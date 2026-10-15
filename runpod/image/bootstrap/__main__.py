"""Pod entry point: profile -> ComfyUI -> custom nodes -> models -> workflows -> run ComfyUI.

Any failure keeps the status page up with the cause instead of starting ComfyUI, then terminates the
Pod. So does a setup that runs past its deadline, and a ComfyUI that exits on its own: no path may
leave a GPU billing with nobody watching. See ops/adr/2026-09-30-runpod-poc.md for the design.
"""
import json
import os
import signal
import subprocess
import sys
import threading
import time
from dataclasses import dataclass
from pathlib import Path

from . import comfy, runtime, server
from .frontend import manager_enabled, place_workflows, prepare_frontend
from .models import Downloader
from .profile import load_profile, load_tips, workflow_file
from .state import BootError, State
from .util import default_data_dir, env_minutes, pod_timing, terminate_this_pod

PORT = 8188


def env_token(name):
    """Unset secrets arrive as the literal template placeholder (`{{ RUNPOD_SECRET_... }}`)."""
    value = os.environ.get(name, "").strip()
    if not value or value.startswith("{{"):
        os.environ.pop(name, None)
        return None
    return value


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


@dataclass
class BootConfig:
    """Settings from the Pod's environment variables (runpod/README.md lists them)."""
    comfy_dir: str
    data_dir: str
    concurrency: int
    hf_token: str | None
    civitai_token: str | None
    # FAIL_STOP_MINUTES: how long a failed Pod shows why before it terminates (0 = never). Short: a
    # failed Pod never recovers (nothing retries the boot or restarts ComfyUI), so it only bills.
    fail_minutes: float
    # BOOT_TIMEOUT_MINUTES: setup that has not finished by then counts as failed (0 = no deadline).
    boot_minutes: float

    @classmethod
    def from_env(cls, log):
        return cls(
            comfy_dir=os.environ.get("COMFY_DIR", "/opt/ComfyUI"),
            data_dir=default_data_dir(),
            concurrency=max(1, int(os.environ.get("DL_CONCURRENCY", "8"))),
            hf_token=env_token("HF_TOKEN"),
            civitai_token=env_token("CIVITAI_TOKEN"),
            fail_minutes=env_minutes("FAIL_STOP_MINUTES", 3, log),
            boot_minutes=env_minutes("BOOT_TIMEOUT_MINUTES", 60, log),
        )


class Boot:
    """One boot: the status page state, report.json, and the rule that exactly one of the main
    thread (starting ComfyUI or failing) and the deadline ends the boot."""

    def __init__(self, state, config):
        self.state = state
        self.config = config
        self.report = {"started_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "data_dir": config.data_dir, "timings": {}}
        self.report_path = Path(config.data_dir) / "runpod-boot" / "report.json"
        self.decided = threading.Lock()

    def record_pod_start(self):
        # How long RunPod took before this process ran (mostly the image pull): the number that decides
        # which base image to use. Logged so it shows in the Pod's log view too.
        try:
            self.report["pod_start"] = pod_timing(self.state.started)
        except Exception as error:  # noqa: BLE001 - measurement only; never stop the boot over it
            self.report["pod_start"] = {"pod_error": str(error)}
        for field in ("lastStartedAt", "createdAt"):
            if f"seconds_from_{field}" in self.report["pod_start"]:
                self.state.log(f"boot started {self.report['pod_start'][f'seconds_from_{field}']}s after the Pod's {field}")

    def timed(self, name, fn):
        t = time.time()
        result = fn()
        self.report["timings"][name] = round(time.time() - t, 1)
        return result

    def write_report(self, outcome):
        report = self.report
        report["outcome"] = outcome
        report["finished_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        report["notices"] = self.state.data["notices"]
        report["error"] = self.state.data["error"]
        try:
            self.report_path.parent.mkdir(parents=True, exist_ok=True)
            self.report_path.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        except OSError as error:  # a full disk must not skip the terminate that follows
            self.state.log(f"could not write {self.report_path}: {error}")

    def fail(self, error):
        self.state.fail(error)
        self.write_report("error")
        give_up(self.state, self.config.fail_minutes)

    def start_deadline(self):
        boot_minutes = self.config.boot_minutes

        def deadline():
            time.sleep(boot_minutes * 60)
            if self.decided.acquire(blocking=False):
                self.fail(BootError("boot_timeout", f"Setup did not finish within {boot_minutes:.0f} minutes.", minutes=round(boot_minutes)))

        if boot_minutes > 0:
            threading.Thread(target=deadline, name="boot-deadline", daemon=True).start()


def setup(boot):
    """Everything before ComfyUI starts. Returns nothing; raises on any failure."""
    state, config, report, timed = boot.state, boot.config, boot.report, boot.timed
    comfy_dir, data_dir = config.comfy_dir, config.data_dir

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
    downloader = Downloader(data_dir, state, config.concurrency, config.hf_token, config.civitai_token, reserve_bytes=reserve)
    results = timed("models", lambda: downloader.run(profile["models"]))
    report["timings"]["torch"] = torch_job.wait()
    comfy.sync_requirements(comfy_dir, sha, state, manager=manager_enabled())
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
    report["workflows"] = {"folder": folder, "files": [workflow_file(w) for w in profile["workflows"]], "inputs": inputs}
    state.step(
        "workflows", "done",
        f"{len(profile['workflows'])} in the Workflows tab" + (f", {len(inputs)} sample inputs" if inputs else ""),
        key="placed", workflows=len(profile["workflows"]), inputs=len(inputs),
    )


def run_comfyui(boot, status_server):
    """Hand the port to ComfyUI and watch it: an exit of its own fails the boot (and the Pod)."""
    state, comfy_dir = boot.state, boot.config.comfy_dir
    state.update(phase="starting")
    state.step("start", "running")
    boot.write_report("started")
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
        boot.fail(BootError("comfyui_exit", f"ComfyUI could not start: {error}."))
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
    boot.fail(BootError("comfyui_exit", f"ComfyUI exited with code {code}.", exit_code=code))


def wait_forever():
    while True:
        time.sleep(3600)


def main():
    for signum in (signal.SIGTERM, signal.SIGINT):
        signal.signal(signum, exit_on_stop)
    state = State()
    config = BootConfig.from_env(state.log)
    os.environ.setdefault("HF_XET_HIGH_PERFORMANCE", "1")
    os.environ.setdefault("HF_HUB_DISABLE_PROGRESS_BARS", "1")
    os.environ.setdefault("HF_HUB_DISABLE_TELEMETRY", "1")
    Path(config.data_dir).mkdir(parents=True, exist_ok=True)

    status_server = server.start(state, PORT)
    state.log(f"status page on :{PORT}, data dir {config.data_dir}")
    boot = Boot(state, config)
    boot.record_pod_start()
    boot.start_deadline()

    try:
        setup(boot)
    except Exception as error:  # noqa: BLE001 - every failure, expected or not, ends in a terminate
        if not isinstance(error, BootError):
            error = BootError("internal", f"{type(error).__name__}: {error}")
        if boot.decided.acquire(blocking=False):
            boot.fail(error)
        wait_forever()  # the deadline already failed the boot and owns the terminate

    if not boot.decided.acquire(blocking=False):
        wait_forever()  # finished after the deadline had already given up
    run_comfyui(boot, status_server)


if __name__ == "__main__":
    main()
