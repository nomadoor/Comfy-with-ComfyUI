"""Check a running Pod against its workflows without generating anything (no GPU work).

Usage inside the container, once ComfyUI is up:  python -m bootstrap.verify
For every placed workflow: each node type is registered, each model file is visible to ComfyUI,
and each sample input is in input/. Exits 1 when anything is missing.
"""
import json
import os
import sys
import urllib.parse
from pathlib import Path

from .util import fetch_json

FRONTEND_NODES = {"Note", "MarkdownNote", "Reroute", "PrimitiveNode"}
INPUT_NODES = {"LoadImage", "LoadImageMask", "LoadVideo", "LoadAudio"}
MODEL_EXT = (".safetensors", ".gguf", ".ckpt", ".pt", ".pth", ".bin", ".sft")


def main():
    base = os.environ.get("COMFY_URL", "http://127.0.0.1:8188")
    comfy_dir = Path(os.environ.get("COMFY_DIR", "/opt/ComfyUI"))
    data_dir = Path(os.environ.get("DATA_DIR") or ("/workspace" if Path("/workspace").is_dir() else "/data"))
    report = json.loads((data_dir / "runpod-boot" / "report.json").read_text(encoding="utf-8"))
    folder = Path(report["workflows"]["folder"])

    registered = set(fetch_json(f"{base}/api/object_info", timeout=120))
    model_lists = {}

    def models_in(directory):
        if directory not in model_lists:
            try:
                model_lists[directory] = set(fetch_json(f"{base}/api/models/{urllib.parse.quote(directory)}"))
            except Exception:  # noqa: BLE001 - an unknown folder simply lists nothing
                model_lists[directory] = set()
        return model_lists[directory]

    failures = 0
    for name in report["workflows"]["files"]:
        workflow = json.loads((folder / name).read_text(encoding="utf-8"))
        subgraphs = workflow.get("definitions", {}).get("subgraphs", [])
        subgraph_ids = {s["id"] for s in subgraphs}
        nodes = workflow.get("nodes", []) + [n for s in subgraphs for n in s.get("nodes", [])]
        problems = []
        for node in nodes:
            if node.get("mode") == 4:  # bypassed
                continue
            node_type = node.get("type")
            if node_type not in registered and node_type not in FRONTEND_NODES and node_type not in subgraph_ids:
                problems.append(f"node {node['id']}: {node_type} is not registered")
            values = node.get("widgets_values") if isinstance(node.get("widgets_values"), list) else []
            listed = {m["name"]: m["directory"] for m in (node.get("properties") or {}).get("models", [])}
            for value in values:
                if isinstance(value, str) and value.lower().endswith(MODEL_EXT):
                    directory = listed.get(os.path.basename(value))
                    if directory and value not in models_in(directory):
                        problems.append(f"node {node['id']}: {directory}/{value} is not visible to ComfyUI")
            if node_type in INPUT_NODES and values:
                file_name = str(values[0]).removesuffix(" [input]")
                if not (comfy_dir / "input" / file_name).exists():
                    problems.append(f"node {node['id']}: sample input {file_name} is not in input/")
        failures += bool(problems)
        print(f"{'ok  ' if not problems else 'FAIL'} {name}")
        for problem in problems:
            print(f"     {problem}")

    print(f"\n{len(report['workflows']['files']) - failures}/{len(report['workflows']['files'])} workflows ready.")
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
