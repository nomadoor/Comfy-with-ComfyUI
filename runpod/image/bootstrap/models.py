"""Model downloads into ${DATA_DIR}/models/<directory>/<name>: several files at once (DL_CONCURRENCY),
each split into 16 ranges by aria2.

Files are written under ${DATA_DIR}/models/.incoming and renamed into place only when complete
(and verified when the profile has a sha256), so an interrupted Pod never leaves a broken model.
"""
import json
import os
import re
import shutil
import subprocess
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from .state import BootError
from .util import sha256_file

RETRIES = 3


class AuthError(Exception):
    pass


UNITS = {"B": 1, "KiB": 1024, "MiB": 1024**2, "GiB": 1024**3, "TiB": 1024**4}
# aria2's summary line: [#ce14f6 2.6MiB/1.7GiB(0%) CN:16 DL:3.9MiB ETA:7m44s]
ARIA2_PROGRESS = re.compile(r"\[#\w+ ([\d.]+)(B|KiB|MiB|GiB|TiB)/")


def _progress_class(on_bytes):
    """A stand-in for tqdm that reports bytes instead of drawing a bar (HF_DOWNLOADER=xet only).

    huggingface_hub hands a non-tqdm class the bar's kwargs and calls update() for bytes written.
    With hf_xet it also calls update_transfer() for bytes received, which runs well ahead of the
    writes because hf_xet buffers in memory, so progress is the larger of the two.
    """

    class Progress:
        def __init__(self, *args, **kwargs):
            self.n = kwargs.get("initial") or 0
            self.total = kwargs.get("total")
            self.transferred = 0

        def update(self, n=1):
            self.n += n
            on_bytes(max(self.n, self.transferred))

        def update_transfer(self, n):
            self.transferred += n
            on_bytes(max(self.n, self.transferred))

        def __enter__(self):
            return self

        def __exit__(self, *args):
            pass

        def __getattr__(self, name):
            # Other tqdm methods (close, refresh, set_postfix_str, ...) are no-ops here.
            return lambda *args, **kwargs: None

    return Progress


def _download_xet(model, tmp_dir, token, on_bytes):
    """Hugging Face through hf_xet. Kept as an option: aria2 was faster in the 2026-10-01 test."""
    from huggingface_hub import hf_hub_download
    from huggingface_hub.errors import GatedRepoError, HfHubHTTPError

    try:
        path = hf_hub_download(
            repo_id=model["repo_id"],
            filename=model["path_in_repo"],
            revision=model.get("revision") or "main",
            local_dir=tmp_dir,
            token=token or False,
            tqdm_class=_progress_class(on_bytes),
        )
    except GatedRepoError as error:
        raise AuthError("gated") from error
    except HfHubHTTPError as error:
        status = getattr(error.response, "status_code", None)
        if status in (401, 403):
            raise AuthError(str(status)) from error
        raise RuntimeError(f"Hugging Face returned {status}") from None
    return Path(path)


def _download_aria2(model, tmp_dir, token, on_bytes):
    """One file split into 16 ranges fetched at once; progress comes from aria2's summary lines.

    --continue with the .aria2 control file left in tmp_dir: a retry picks up the ranges already
    fetched instead of starting over (a 9 GB file failing at 90% used to restart from zero). The
    control file is saved every 5 s, so even a killed aria2 loses only the last few seconds.
    """
    args = [
        "aria2c", "-x", "16", "-s", "16", "-k", "16M", "--file-allocation=none",
        "--summary-interval=1", "--show-console-readout=false", "--console-log-level=warn",
        "--download-result=hide", "--auto-file-renaming=false", "--allow-overwrite=true", "--continue=true",
        "--auto-save-interval=5",
        "-d", str(tmp_dir), "-o", model["name"], model["url"],
    ]
    if token:
        args[1:1] = ["--header", f"Authorization: Bearer {token}"]
    process = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, bufsize=1)
    for line in process.stdout:
        match = ARIA2_PROGRESS.search(line)
        if match:
            on_bytes(int(float(match.group(1)) * UNITS[match.group(2)]))
    code = process.wait()
    if code == 24:  # aria2: HTTP authorization failed (Hugging Face answers 401 for gated files)
        raise AuthError("401")
    if code != 0:
        # Do not echo the command line: it may carry the token header.
        reason = {3: "file not found", 19: "name resolution failed", 22: "unexpected HTTP response"}.get(code, "")
        raise RuntimeError(f"aria2c exited with {code}" + (f" ({reason})" if reason else ""))
    return Path(tmp_dir) / model["name"]


class Downloader:
    def __init__(self, data_dir, state, concurrency, hf_token, civitai_token, reserve_bytes=0):
        self.models_dir = Path(data_dir) / "models"
        # Space something else on the same disk still needs (PyTorch installing alongside).
        self.reserve_bytes = reserve_bytes
        self.incoming = self.models_dir / ".incoming"
        self.boot_dir = Path(data_dir) / "runpod-boot"
        self.verified_path = self.boot_dir / "verified.json"
        self.state = state
        self.concurrency = concurrency
        self.hf_token = hf_token
        self.civitai_token = civitai_token
        self._verified_lock = threading.Lock()
        self.verified = json.loads(self.verified_path.read_text()) if self.verified_path.exists() else {}
        self.timings = {}  # "<directory>/<name>": seconds, average MB/s and method, for report.json

    def _remember(self, final, model):
        with self._verified_lock:
            stat = final.stat()
            self.verified[str(final)] = {"size": stat.st_size, "mtime": int(stat.st_mtime), "sha256": model.get("sha256")}
            self.boot_dir.mkdir(parents=True, exist_ok=True)
            self.verified_path.write_text(json.dumps(self.verified, indent=2))

    def _already_there(self, index, model, final):
        """True when the file is present and matches; hashes it once, then trusts size + mtime."""
        if not final.exists():
            return False
        size = final.stat().st_size
        if model.get("size_bytes") and size != model["size_bytes"]:
            return False
        if not model.get("sha256"):
            return True
        known = self.verified.get(str(final))
        if known and known["sha256"] == model["sha256"] and known["size"] == size and known["mtime"] == int(final.stat().st_mtime):
            return True
        self.state.model(index, state="verifying", done=0)
        if sha256_file(final, lambda done: self.state.model(index, done=done)) != model["sha256"]:
            return False
        self._remember(final, model)
        return True

    def _fetch(self, index, model):
        final = self.models_dir / model["directory"] / model["name"]
        if self._already_there(index, model, final):
            self.state.model(index, state="present", done=model.get("size_bytes") or final.stat().st_size, speed=0)
            self.state.log(f"model {model['directory']}/{model['name']}: already present")
            return "present"

        if model.get("requires_hf_token") and not self.hf_token:
            self.state.model(index, state="skipped", reason="hf_token")
            return "skipped"

        tmp_dir = self.incoming / f"{model['directory']}__{model['name']}"
        stop = threading.Event()
        reported = {"bytes": 0}

        def on_bytes(n):
            reported["bytes"] = n

        def watch():
            # Speed is averaged over the last ~10 seconds so bursts do not make it jump around.
            samples, last_log = [(time.time(), 0)], 0
            while not stop.wait(1):
                size = reported["bytes"]  # file size is meaningless for sparse, segmented writes
                now = time.time()
                samples = [s for s in samples if now - s[0] <= 10] + [(now, size)]
                t0, size0 = samples[0]
                speed = max(0, (size - size0) / (now - t0)) if now > t0 else 0
                self.state.model(index, done=size, speed=int(speed))
                if now - last_log >= 15:
                    last_log = now
                    total = model.get("size_bytes") or 0
                    pct = f" {size * 100 / total:.0f}%" if total else ""
                    self.state.log(f"model {model['name']}:{pct} {size / 1e9:.2f} GB, {speed / 1e6:.0f} MB/s")

        fresh = True  # start from an empty tmp_dir; later attempts resume what aria2 already has
        for attempt in range(1, RETRIES + 1):
            if fresh:
                shutil.rmtree(tmp_dir, ignore_errors=True)
                fresh = False
            tmp_dir.mkdir(parents=True, exist_ok=True)
            self.state.model(index, state="downloading", done=0, attempt=attempt)
            reported["bytes"] = 0
            stop.clear()
            started = time.time()  # the successful attempt's transfer only: no backoff, no hashing
            watcher = threading.Thread(target=watch, daemon=True)
            watcher.start()
            try:
                if model["source"] == "hf" and os.environ.get("HF_DOWNLOADER") == "xet":
                    path = _download_xet(model, tmp_dir, self.hf_token, on_bytes)
                else:
                    token = self.hf_token if model["source"] == "hf" else self.civitai_token
                    path = _download_aria2(model, tmp_dir, token, on_bytes)
                stop.set()
                watcher.join()
                seconds = time.time() - started
                if model.get("sha256"):
                    self.state.model(index, state="verifying", done=0, speed=0)
                    digest = sha256_file(path, lambda done: self.state.model(index, done=done))
                    if digest != model["sha256"]:
                        fresh = True  # a corrupt file must not be resumed
                        raise RuntimeError("sha256 mismatch")
                final.parent.mkdir(parents=True, exist_ok=True)
                os.replace(path, final)
                shutil.rmtree(tmp_dir, ignore_errors=True)
                self._remember(final, model)
                self.state.model(index, state="done", done=final.stat().st_size, speed=0)
                size = final.stat().st_size
                method = "xet" if model["source"] == "hf" and os.environ.get("HF_DOWNLOADER") == "xet" else "aria2"
                self.timings[f"{model['directory']}/{model['name']}"] = {"seconds": round(seconds, 1), "mb_per_s": round(size / 1e6 / max(seconds, 0.1)), "method": method}
                self.state.log(f"model {model['directory']}/{model['name']}: done in {seconds:.0f}s ({size / 1e6 / max(seconds, 0.1):.0f} MB/s, {method})")
                return "downloaded"
            except AuthError:
                stop.set()
                watcher.join()
                shutil.rmtree(tmp_dir, ignore_errors=True)
                if model["source"] == "hf" and model.get("requires_hf_token"):
                    self.state.model(index, state="skipped", reason="hf_token", speed=0)
                    return "skipped"
                self.state.model(index, state="error", speed=0)
                if model["source"] == "hf":
                    raise BootError("download", f"{model['name']}: Hugging Face refused access.", model=model["name"])
                raise BootError("civitai_token", f"{model['name']}: Civitai refused the download (token required).", model=model["name"])
            except Exception as error:  # noqa: BLE001 - reported to the reader, then retried
                stop.set()
                watcher.join()
                message = str(error) or error.__class__.__name__
                self.state.log(f"model {model['name']}: attempt {attempt} failed: {message}")
                if attempt == RETRIES:
                    shutil.rmtree(tmp_dir, ignore_errors=True)
                    self.state.model(index, state="error", speed=0)
                    raise BootError("download", f"{model['name']}: {message}", model=model["name"]) from None
                time.sleep(2 ** attempt)
        return "error"

    def run(self, models):
        self.state.set_models([
            {"name": m["name"], "directory": m["directory"], "size": m.get("size_bytes"), "done": 0, "speed": 0, "state": "pending"}
            for m in models
        ])
        self.incoming.mkdir(parents=True, exist_ok=True)

        def needs_download(m):
            path = self.models_dir / m["directory"] / m["name"]
            return not path.exists() or (m.get("size_bytes") and path.stat().st_size != m["size_bytes"])

        # A wrong-sized file is downloaded again next to the old one, so it counts in full too.
        missing = sum(m.get("size_bytes") or 0 for m in models if needs_download(m))
        disk_free = shutil.disk_usage(self.models_dir).free
        if missing + self.reserve_bytes > disk_free:
            need_gb = -(-(missing + self.reserve_bytes) // 10**9) + 5
            also = f" plus {self.reserve_bytes / 1e9:.0f} GB for PyTorch" if self.reserve_bytes else ""
            raise BootError(
                "disk_space",
                f"Models need {missing / 1e9:.1f} GB{also} but only {disk_free / 1e9:.1f} GB is free on {self.models_dir}.",
                need_gb=need_gb,
            )

        results = [None] * len(models)
        with ThreadPoolExecutor(max_workers=self.concurrency) as pool:
            futures = {pool.submit(self._fetch, i, m): i for i, m in enumerate(models)}
            first_error = None
            for future, i in futures.items():
                try:
                    results[i] = future.result()
                except BootError as error:
                    results[i] = "error"
                    first_error = first_error or error
        shutil.rmtree(self.incoming, ignore_errors=True)
        if first_error:
            raise first_error
        return results
