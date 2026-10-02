"""ComfyUI checkout, model paths and custom node installation."""
import json
import os
import shutil
import sys
import tempfile
import zipfile
from pathlib import Path

from .state import BootError
from .util import fetch, fetch_json, run

REGISTRY = "https://api.comfy.org"


def pip_install(*args):
    run(["uv", "pip", "install", "--python", sys.executable, *args])


def update(comfy_dir, ref, profile, state):
    """Check out the requested ComfyUI commit (git only). Returns the checked-out sha.

    Its requirements are installed later by sync_requirements, once PyTorch is in place: installing
    them first would let uv pull a generic PyTorch from PyPI.
    """
    if ref == "latest":
        target = "origin/master"
    elif ref == "verified":
        target = profile["comfyui"].get("verified_commit")
        if not target:
            raise BootError("comfyui_ref", "COMFY_REF=verified, but this profile has no verified commit yet.")
    else:
        target = ref
    try:
        state.step("comfyui", "running", f"fetching {ref}", key="fetching", ref=ref)
        run(["git", "-C", comfy_dir, "fetch", "--quiet", "origin", "master"])
        if target != "origin/master":
            run(["git", "-C", comfy_dir, "fetch", "--quiet", "origin", target])
            target = "FETCH_HEAD"
        run(["git", "-C", comfy_dir, "checkout", "--quiet", "--force", target])
        return run(["git", "-C", comfy_dir, "rev-parse", "HEAD"])
    except RuntimeError as error:
        raise BootError("comfyui_update", f"Could not update ComfyUI to {ref}: {error}") from error


def sync_requirements(comfy_dir, sha, state, manager=False):
    """Install ComfyUI's requirements when the checked-out commit is newer than the image's.

    With Manager on, its pinned package (manager_requirements.txt) moves with the commit too.

    Recorded only after uv succeeds, so a failed install is retried on the next boot. The record says
    whether Manager's file went in, so turning Manager on later at the same commit still installs it.
    The image writes the bare commit: its build installed both files.
    """
    marker = Path(comfy_dir).parent / ".runpod-comfyui-requirements.sha"
    installed = marker.read_text(encoding="utf-8").strip() if marker.exists() else None
    covered = {sha, f"{sha} manager"} | (set() if manager else {f"{sha} no-manager"})
    if installed in covered:
        return
    state.step("runtime", "running", f"installing requirements for {sha[:7]}", key="requirements", sha=sha[:7])
    try:
        files = ["requirements.txt"] + (["manager_requirements.txt"] if manager else [])
        args = [arg for name in files if (Path(comfy_dir) / name).exists() for arg in ("-r", str(Path(comfy_dir) / name))]
        pip_install(*args)
    except RuntimeError as error:
        raise BootError("comfyui_update", f"Could not install ComfyUI's requirements: {error}") from error
    marker.write_text(f"{sha} {'manager' if manager else 'no-manager'}\n", encoding="utf-8")


def write_model_paths(comfy_dir, models_dir, directories):
    """Point ComfyUI at the data disk so models survive Pod restarts when a volume is attached."""
    lines = ["runpod:", f"  base_path: {models_dir}", "  is_default: true"]
    for directory in sorted(set(directories) | {"checkpoints", "loras", "vae", "text_encoders", "diffusion_models"}):
        lines.append(f"  {directory}: {directory}/")
    (Path(comfy_dir) / "extra_model_paths.yaml").write_text("\n".join(lines) + "\n", encoding="utf-8")
    for directory in directories:
        (Path(models_dir) / directory).mkdir(parents=True, exist_ok=True)


def _resolve_registry(node_id, version):
    """`latest` is the Registry's latest reviewed release (what ComfyUI-Manager installs)."""
    if version == "latest":
        info = fetch_json(f"{REGISTRY}/nodes/{node_id}")
        version = (info.get("latest_version") or {}).get("version")
        if not version:
            raise RuntimeError("the Registry lists no release")
    install = fetch_json(f"{REGISTRY}/nodes/{node_id}/install?version={version}")
    return version, install["downloadUrl"]


def _install_node_deps(node_dir):
    requirements = node_dir / "requirements.txt"
    if requirements.exists():
        pip_install("-r", str(requirements))
    if (node_dir / "install.py").exists():
        run([sys.executable, "install.py"], cwd=node_dir)


def install_custom_nodes(comfy_dir, nodes, state):
    """Fetch each custom node (no pip yet); returns [{id, source, requested, version, dir}].

    Python dependencies come later from install_node_deps, after PyTorch is installed.
    """
    installed = []
    root = Path(comfy_dir) / "custom_nodes"
    for index, node in enumerate(nodes, 1):
        node_id, requested = node["id"], node.get("version") or "latest"
        target = root / node_id.replace("/", "__")
        marker = target / ".runpod-node.json"
        state.step("custom_nodes", "running", f"{index}/{len(nodes)} {node_id}")
        try:
            if node["source"] == "git":
                version = requested
                if not marker.exists():
                    shutil.rmtree(target, ignore_errors=True)  # leftovers of a failed earlier attempt
                    run(["git", "clone", "--quiet", node["git"], str(target)])
                    if requested != "latest":
                        run(["git", "-C", str(target), "checkout", "--quiet", requested])
                    version = run(["git", "-C", str(target), "rev-parse", "HEAD"])
                    marker.write_text(json.dumps({"id": node_id, "version": version}), encoding="utf-8")
                else:
                    version = json.loads(marker.read_text(encoding="utf-8"))["version"]
            else:
                version, url = _resolve_registry(node_id, requested)
                current = json.loads(marker.read_text(encoding="utf-8")).get("version") if marker.exists() else None
                if current != version:
                    shutil.rmtree(target, ignore_errors=True)
                    with tempfile.TemporaryDirectory() as tmp:
                        archive = Path(tmp) / "node.zip"
                        archive.write_bytes(fetch(url, timeout=300))
                        with zipfile.ZipFile(archive) as zf:
                            zf.extractall(target)
                    marker.write_text(json.dumps({"id": node_id, "version": version}), encoding="utf-8")
        except (RuntimeError, OSError, KeyError, zipfile.BadZipFile) as error:
            raise BootError("custom_node", f"Could not install custom node {node_id}: {error}", node=node_id) from error
        state.log(f"custom node {node_id} {version}")
        installed.append({"id": node_id, "source": node["source"], "requested": requested, "version": version, "dir": str(target)})
    return installed


def install_node_deps(installed, state):
    """Install each fetched node's requirements (and install.py) once; a marker records success."""
    for node in installed:
        target = Path(node["dir"])
        done = target / ".runpod-deps.json"
        if done.exists() and json.loads(done.read_text(encoding="utf-8")).get("version") == node["version"]:
            continue
        state.step("runtime", "running", f"dependencies of {node['id']}", key="node_deps", node=node["id"])
        try:
            _install_node_deps(target)
        except (RuntimeError, OSError) as error:
            raise BootError("custom_node", f"Could not install custom node {node['id']}: {error}", node=node["id"]) from error
        done.write_text(json.dumps({"version": node["version"]}), encoding="utf-8")
