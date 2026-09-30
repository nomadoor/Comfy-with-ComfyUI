"""Pod entry point: profile -> ComfyUI -> custom nodes -> models -> workflows -> exec ComfyUI.

Any failure keeps the status page up with the cause instead of starting ComfyUI.
See ops/adr/2026-09-30-runpod-poc.md for the design.
"""
import hashlib
import json
import os
import sys
import time
import urllib.parse
from pathlib import Path

from . import comfy, server
from .models import Downloader
from .state import BootError, State
from .util import fetch, fetch_json

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


def place_workflows(profile, profile_url, comfy_dir):
    """Workflows go to the sidebar's Workflows tab; sample inputs to input/ under the name the nodes read."""
    target = Path(comfy_dir) / "user" / "default" / "workflows" / profile["title"]
    target.mkdir(parents=True, exist_ok=True)
    for workflow in profile["workflows"]:
        (target / workflow["name"]).write_bytes(fetch_site_file(workflow, profile_url))
    input_dir = Path(comfy_dir) / "input"
    for item in profile.get("inputs", []):
        destination = (input_dir / item["name"]).resolve()
        if not destination.is_relative_to(input_dir.resolve()):
            raise BootError("workflow", f"Sample input {item['name']} points outside input/.")
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(fetch_site_file(item, profile_url))
    return str(target)


def main():
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

    status_server = server.start(state, PORT)
    state.log(f"status page on :{PORT}, data dir {data_dir}")
    report = {"started_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "data_dir": data_dir, "timings": {}}
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
        report_path.parent.mkdir(parents=True, exist_ok=True)
        report_path.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    try:
        profile_url, profile = timed("profile", lambda: load_profile(state))
        state.update(profile=profile["id"], title=profile["title"])
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
        report["custom_nodes"] = installed
        state.step("custom_nodes", "done", ", ".join(f"{n['id']} {n['version'][:12]}" for n in installed) or "none")

        state.step("models", "running", f"{len(profile['models'])} files")
        downloader = Downloader(data_dir, state, concurrency, hf_token, civitai_token)
        results = timed("models", lambda: downloader.run(profile["models"]))
        report["models"] = [
            {"name": m["name"], "directory": m["directory"], "result": r} for m, r in zip(profile["models"], results)
        ]
        skipped = [m["name"] for m, r in zip(profile["models"], results) if r == "skipped"]
        for name in skipped:
            state.notice("hf_token", f"{name} was skipped: it needs a Hugging Face token (HF_TOKEN).", model=name)
        state.step("models", "done", f"{len(results) - len(skipped)} ready" + (f", {len(skipped)} skipped" if skipped else ""))

        state.step("workflows", "running")
        folder = timed("workflows", lambda: place_workflows(profile, profile_url, comfy_dir))
        inputs = [i["name"] for i in profile.get("inputs", [])]
        report["workflows"] = {"folder": folder, "files": [w["name"] for w in profile["workflows"]], "inputs": inputs}
        state.step(
            "workflows", "done",
            f"{len(profile['workflows'])} in Workflows › {profile['title']}" + (f", {len(inputs)} sample inputs" if inputs else ""),
        )
    except BootError as error:
        state.fail(error)
        write_report("error")
        # Keep the status page up so the reader sees why; the Pod stays until they stop it.
        while True:
            time.sleep(3600)

    state.update(phase="starting")
    state.step("start", "running")
    write_report("started")
    time.sleep(2)  # let open status pages see the final state before the port changes hands
    server.stop(status_server)
    args = [sys.executable, "main.py", "--listen", "0.0.0.0", "--port", str(PORT)]
    args += os.environ.get("COMFY_ARGS", "").split()
    os.chdir(comfy_dir)
    os.execv(sys.executable, args)


if __name__ == "__main__":
    main()
