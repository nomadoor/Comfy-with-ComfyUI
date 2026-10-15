"""What the reader finds when ComfyUI opens: workflows in the sidebar, sample inputs in input/,
Manager set up, and the profile's `open` workflows as tabs."""
import configparser
import hashlib
import json
import os
import shutil
import time
from pathlib import Path

from .profile import fetch_site_file, opened_workflows, workflow_file
from .state import BootError
from .util import fetch


def place_workflows(profile, profile_url, comfy_dir):
    """Workflows go to the sidebar's Workflows tab; sample inputs to input/ under the name the nodes read."""
    # Into the Workflows tab, in the profile's folders if it has any (a Pod serves one profile, and the
    # folder is rebuilt per Pod).
    target = Path(comfy_dir) / "user" / "default" / "workflows"
    target.mkdir(parents=True, exist_ok=True)
    for workflow in profile["workflows"]:
        destination = target / workflow_file(workflow)
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(fetch_site_file(workflow, profile_url))
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
    """Skip the first-run template gallery, set up Manager, and open the profile's `open` workflows as tabs."""
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
        "workflows": [f"workflows/{workflow_file(w)}" for w in opened_workflows(profile)],
    }
    (target / "web" / "runpod.json").write_text(json.dumps(config, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
