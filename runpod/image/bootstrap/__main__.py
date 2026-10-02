"""Pod entry point: profile -> ComfyUI -> custom nodes -> models -> workflows -> run ComfyUI.

Any failure keeps the status page up with the cause instead of starting ComfyUI, then terminates the
Pod. So does a setup that runs past its deadline, and a ComfyUI that exits on its own: no path may
leave a GPU billing with nobody watching. See ops/adr/2026-09-30-runpod-poc.md for the design.
"""
import configparser
import hashlib
import json
import os
import shutil
import signal
import subprocess
import sys
import threading
import time
import urllib.parse
from pathlib import Path

from . import comfy, runtime, server
from .models import Downloader
from .state import BootError, State
from .util import env_minutes, fetch, fetch_json, pod_timing, terminate_this_pod

SCHEMA_VERSION = 1
SITE = "https://comfyui.nomadoor.net"
PORT = 8188


def env_token(name):
    """Unset secrets arrive as the literal template placeholder (`{{ RUNPOD_SECRET_... }}`)."""
    value = os.environ.get(name, "").strip()
    if not value or value.startswith("{{"):
        os.environ.pop(name, None)
        return None
    return value


def load_profile(state):
    profile_id = os.environ.get("PROFILE", "").strip()
    if not profile_id:
        raise BootError("profile_missing", "PROFILE is not set on this Pod.")
    url = os.environ.get("PROFILE_URL") or f"{SITE}/runpod/profiles/{profile_id}.json"
    state.step("profile", "running", url)
    try:
        profile = fetch_json(url)
    except Exception as error:  # noqa: BLE001
        raise BootError("profile_fetch", f"Could not fetch {url}: {error}") from None
    if profile.get("schema_version") != SCHEMA_VERSION:
        raise BootError("profile_schema", f"Profile schema {profile.get('schema_version')} is not supported by this image.")
    return url, profile


def fetch_site_file(item, profile_url):
    # Fetch from the same site as the profile, so previews and local builds stay consistent.
    url = urllib.parse.urljoin(profile_url, item["path"]) if item.get("path") else item["url"]
    try:
        body = fetch(url)
    except Exception as error:  # noqa: BLE001
        raise BootError("workflow", f"Could not fetch {item['name']}: {error}") from None
    if hashlib.sha256(body).hexdigest() != item["sha256"]:
        raise BootError("workflow", f"{item['name']} does not match the profile (sha256).")
    return body


def load_tips(profile_url):
    """Columns for the status page, from the same site as the profile. Optional: none on failure."""
    try:
        return fetch_json(urllib.parse.urljoin(profile_url, "/runpod/tips.json"), timeout=15).get("tips", [])
    except Exception:  # noqa: BLE001
        return []


def place_workflows(profile, profile_url, comfy_dir):
    """Workflows go to the sidebar's Workflows tab; sample inputs to input/ under the name the nodes read."""
    # Straight into the Workflows tab, no folder: a Pod serves one profile, and the folder is rebuilt per Pod.
    target = Path(comfy_dir) / "user" / "default" / "workflows"
    target.mkdir(parents=True, exist_ok=True)
    for workflow in profile["workflows"]:
        (target / workflow["name"]).write_bytes(fetch_site_file(workflow, profile_url))
    # Sample inputs are site media on R2 (WebP); the key carries the first 16 hex of their sha256.
    input_dir = Path(comfy_dir) / "input"
    for item in profile.get("inputs", []):
        destination = (input_dir / item["name"]).resolve()
        if not destination.is_relative_to(input_dir.resolve()):
            raise BootError("workflow", f"Sample input {item['name']} points outside input/.")
        try:
            body = fetch(item["url"])
        except Exception as error:  # noqa: BLE001
            raise BootError("workflow", f"Could not fetch sample input {item['name']}: {error}") from None
        if item.get("sha256_prefix") and hashlib.sha256(body).hexdigest()[:16] != item["sha256_prefix"]:
            raise BootError("workflow", f"Sample input {item['name']} does not match the profile (sha256).")
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(body)
    return str(target)


EXTENSION = Path(__file__).resolve().parent.parent / "extension"


def manager_enabled():
    return os.environ.get("ENABLE_MANAGER", "1") != "0"


def prepare_frontend(profile, comfy_dir):
    """Skip the first-run template gallery, set up Manager, and open the profile's workflows as tabs."""
    user_dir = Path(comfy_dir) / "user" / "default"
    settings_file = user_dir / "comfy.settings.json"
    settings = json.loads(settings_file.read_text(encoding="utf-8")) if settings_file.exists() else {}
    settings["Comfy.TutorialCompleted"] = True
    settings_file.write_text(json.dumps(settings, indent=2) + "\n", encoding="utf-8")

    # The built-in ComfyUI-Manager lets readers add models and custom nodes for other workflows from
    # the UI. It refuses installs on a non-loopback listener unless network_mode is personal_cloud,
    # which is what a Pod behind its own private proxy URL is.
    if manager_enabled():
        manager_config = Path(comfy_dir) / "user" / "__manager" / "config.ini"
        manager_config.parent.mkdir(parents=True, exist_ok=True)
        parser = configparser.ConfigParser()
        parser.read(manager_config)
        if not parser.has_section("default"):
            parser.add_section("default")
        parser.set("default", "network_mode", "personal_cloud")
        parser.set("default", "security_level", "normal")
        with manager_config.open("w", encoding="utf-8") as f:
            parser.write(f)

    target = Path(comfy_dir) / "custom_nodes" / "comfy-with-comfyui-runpod"
    shutil.rmtree(target, ignore_errors=True)
    shutil.copytree(EXTENSION, target)
    config = {
        "profile": profile["id"],
        # A new boot is a new Pod for the reader: its first visit opens the tabs again.
        "boot": int(time.time()),
        "workflows": [f"workflows/{w['name']}" for w in profile["workflows"]],
    }
    (target / "web" / "runpod.json").write_text(json.dumps(config, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def give_up(state, minutes):
    """Keep the status page up for `minutes` so the reader sees why, then terminate the Pod.

    Retries until RunPod accepts: a single failed call (a 5xx, a timeout) must not leave the Pod
    billing. After the first failure the status page asks the reader to terminate it by hand.
    """
    if minutes > 0:
        time.sleep(minutes * 60)
        state.log(f"stopped {minutes:.0f} minutes ago; terminating the Pod")
        delay, asked = 60, False
        while terminate_this_pod(state.log) is False:
            if not asked:
                state.notice("terminate", "This Pod could not terminate itself. Terminate it from the RunPod console.")
                asked = True
            time.sleep(delay)
            delay = min(delay * 2, 900)
    while True:
        time.sleep(3600)


def exit_on_stop(signum, _frame):
    # This process is the container's PID 1, which ignores SIGTERM unless it handles it: without
    # this, stopping the Pod while it prepares (or after ComfyUI died) waits for the forced kill.
    # os._exit: download threads must not hold the exit up.
    os._exit(0)


def main():
    for signum in (signal.SIGTERM, signal.SIGINT):
        signal.signal(signum, exit_on_stop)
    state = State()
    comfy_dir = os.environ.get("COMFY_DIR", "/opt/ComfyUI")
    data_dir = os.environ.get("DATA_DIR") or ("/workspace" if Path("/workspace").is_dir() else "/data")
    concurrency = max(1, int(os.environ.get("DL_CONCURRENCY", "8")))
    hf_token = env_token("HF_TOKEN")
    civitai_token = env_token("CIVITAI_TOKEN")
    os.environ.setdefault("HF_XET_HIGH_PERFORMANCE", "1")
    os.environ.setdefault("HF_HUB_DISABLE_PROGRESS_BARS", "1")
    os.environ.setdefault("HF_HUB_DISABLE_TELEMETRY", "1")
    Path(data_dir).mkdir(parents=True, exist_ok=True)
    # IDLE_STOP_MINUTES: how long a failed Pod shows why before it terminates (0 = never).
    # BOOT_TIMEOUT_MINUTES: setup that has not finished by then counts as failed (0 = no deadline).
    idle_minutes = env_minutes("IDLE_STOP_MINUTES", 30, state.log)
    boot_minutes = env_minutes("BOOT_TIMEOUT_MINUTES", 60, state.log)

    status_server = server.start(state, PORT)
    state.log(f"status page on :{PORT}, data dir {data_dir}")
    report = {"started_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "data_dir": data_dir, "timings": {}}
    # How long RunPod took before this process ran (mostly the image pull): the number that decides
    # which base image to use. Logged so it shows in the Pod's log view too.
    try:
        report["pod_start"] = pod_timing(state.started)
    except Exception as error:  # noqa: BLE001 - measurement only; never stop the boot over it
        report["pod_start"] = {"pod_error": str(error)}
    for field in ("lastStartedAt", "createdAt"):
        if f"seconds_from_{field}" in report["pod_start"]:
            state.log(f"boot started {report['pod_start'][f'seconds_from_{field}']}s after the Pod's {field}")
    report_path = Path(data_dir) / "runpod-boot" / "report.json"

    def timed(name, fn):
        t = time.time()
        result = fn()
        report["timings"][name] = round(time.time() - t, 1)
        return result

    def write_report(outcome):
        report["outcome"] = outcome
        report["finished_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        report["notices"] = state.data["notices"]
        report["error"] = state.data["error"]
        try:
            report_path.parent.mkdir(parents=True, exist_ok=True)
            report_path.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        except OSError as error:  # a full disk must not skip the terminate that follows
            state.log(f"could not write {report_path}: {error}")

    # Exactly one of these ends the boot: the main thread starting ComfyUI or failing, or the deadline.
    decided = threading.Lock()

    def fail(error):
        state.fail(error)
        write_report("error")
        give_up(state, idle_minutes)

    def deadline():
        time.sleep(boot_minutes * 60)
        if decided.acquire(blocking=False):
            fail(BootError("boot_timeout", f"Setup did not finish within {boot_minutes:.0f} minutes.", minutes=round(boot_minutes)))

    if boot_minutes > 0:
        threading.Thread(target=deadline, name="boot-deadline", daemon=True).start()

    try:
        profile_url, profile = timed("profile", lambda: load_profile(state))
        state.update(profile=profile["id"], title=profile["title"], site=profile.get("site"), article=profile.get("article"))
        state.update(tips=load_tips(profile_url))
        report.update(profile=profile["id"], profile_url=profile_url, site_commit=profile.get("site_commit"))
        state.step("profile", "done", f"{profile['title']} ({(profile.get('site_commit') or '')[:7]})")

        ref = os.environ.get("COMFY_REF") or profile["comfyui"]["default"]
        sha = timed("comfyui", lambda: comfy.update(comfy_dir, ref, profile, state))
        report["comfyui"] = {"ref": ref, "commit": sha}
        state.step("comfyui", "done", f"{ref} {sha[:7]}")

        models_dir = Path(data_dir) / "models"
        comfy.write_model_paths(comfy_dir, models_dir, [m["directory"] for m in profile["models"]])

        nodes = profile.get("custom_nodes", [])
        installed = timed("custom_nodes", lambda: comfy.install_custom_nodes(comfy_dir, nodes, state))
        report["custom_nodes"] = [{k: v for k, v in n.items() if k != "dir"} for n in installed]
        names = ", ".join(f"{n['id']} {n['version'][:12]}" for n in installed)
        state.step("custom_nodes", "done", names or "none", key=None if names else "none")

        # PyTorch installs on a thread while the models download; every other pip install waits for
        # it, so nothing pulls a generic PyTorch from PyPI first.
        runtime_started = time.time()
        torch_job = runtime.Background(state)
        state.step("models", "running", f"{len(profile['models'])} files", key="files", count=len(profile["models"]))
        same_disk = os.stat(data_dir).st_dev == os.stat(runtime.LOCK.parent).st_dev
        reserve = runtime.INSTALLED_BYTES if torch_job.thread and same_disk else 0
        downloader = Downloader(data_dir, state, concurrency, hf_token, civitai_token, reserve_bytes=reserve)
        results = timed("models", lambda: downloader.run(profile["models"]))
        report["timings"]["torch"] = torch_job.wait()
        comfy.sync_requirements(comfy_dir, sha, state)
        comfy.install_node_deps(installed, state)
        report["timings"]["runtime"] = round(time.time() - runtime_started, 1)
        state.step("runtime", "done", "ready", key="runtime_ready")
        report["models"] = [
            {"name": m["name"], "directory": m["directory"], "result": r, **downloader.timings.get(f"{m['directory']}/{m['name']}", {})}
            for m, r in zip(profile["models"], results)
        ]
        skipped = [m["name"] for m, r in zip(profile["models"], results) if r == "skipped"]
        for name in skipped:
            state.notice("hf_token", f"{name} was skipped: it needs a Hugging Face token (HF_TOKEN).", model=name)
        ready = len(results) - len(skipped)
        state.step(
            "models", "done", f"{ready} ready" + (f", {len(skipped)} skipped" if skipped else ""),
            key="ready", ready=ready, skipped=len(skipped),
        )

        state.step("workflows", "running")
        folder = timed("workflows", lambda: place_workflows(profile, profile_url, comfy_dir))
        prepare_frontend(profile, comfy_dir)
        inputs = [i["name"] for i in profile.get("inputs", [])]
        report["workflows"] = {"folder": folder, "files": [w["name"] for w in profile["workflows"]], "inputs": inputs}
        state.step(
            "workflows", "done",
            f"{len(profile['workflows'])} in the Workflows tab" + (f", {len(inputs)} sample inputs" if inputs else ""),
            key="placed", workflows=len(profile["workflows"]), inputs=len(inputs),
        )
    except Exception as error:  # noqa: BLE001 - every failure, expected or not, ends in a terminate
        if not isinstance(error, BootError):
            error = BootError("internal", f"{type(error).__name__}: {error}")
        if decided.acquire(blocking=False):
            fail(error)
        while True:  # the deadline already failed the boot and owns the terminate
            time.sleep(3600)

    if not decided.acquire(blocking=False):
        while True:  # finished after the deadline had already given up
            time.sleep(3600)
    state.update(phase="starting")
    state.step("start", "running")
    write_report("started")
    time.sleep(2)  # let open status pages see the final state before the port changes hands
    server.stop(status_server)
    args = [sys.executable, "main.py", "--listen", "0.0.0.0", "--port", str(PORT)]
    if manager_enabled():
        args.append("--enable-manager")
    args += os.environ.get("COMFY_ARGS", "").split()
    # ComfyUI runs as a child, not through exec: if it exits on its own (a CUDA init failure at
    # start, a crash later), this process brings the status page back with the reason and still
    # terminates the Pod. The idle auto-stop inside ComfyUI cannot cover a ComfyUI that is gone.
    # Manager's restart re-execs ComfyUI in place, so the child keeps its PID.
    def status_page_again():
        # Best effort: the reason matters less than reaching the terminate in fail().
        try:
            server.start(state, PORT)
        except OSError as error:
            state.log(f"could not reopen the status page: {error}")

    try:
        child = subprocess.Popen(args, cwd=comfy_dir)
    except OSError as error:
        status_page_again()
        fail(BootError("comfyui_exit", f"ComfyUI could not start: {error}."))
    asked_to_stop = []

    def forward(signum, _frame):
        asked_to_stop.append(signum)
        try:
            child.send_signal(signum)
        except ProcessLookupError:
            pass

    for signum in (signal.SIGTERM, signal.SIGINT):
        signal.signal(signum, forward)
    code = child.wait()
    if asked_to_stop:
        sys.exit(0)
    for signum in (signal.SIGTERM, signal.SIGINT):
        signal.signal(signum, exit_on_stop)
    state.log(f"ComfyUI exited with code {code}")
    status_page_again()
    fail(BootError("comfyui_exit", f"ComfyUI exited with code {code}.", exit_code=code))


if __name__ == "__main__":
    main()
