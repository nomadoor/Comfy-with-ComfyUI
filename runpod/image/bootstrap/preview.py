"""Status page preview: serves the page with a simulated download that loops, and never starts ComfyUI.

Usage (no GPU, no downloads):
  docker run --rm -p 127.0.0.1:8199:8188 -e PROFILE_URL=file:///runpod/profiles/<id>.json \
    -v "$PWD/_site/runpod:/runpod:ro" --entrypoint python cwc-runpod:dev -m bootstrap.preview
"""
import os
import time

from . import server
from .__main__ import PORT, SITE, load_tips
from .state import State
from .util import fetch_json


def main():
    profile_url = os.environ.get("PROFILE_URL") or f"{SITE}/runpod/profiles/{os.environ.get('PROFILE', 'qwen-image-2-1')}.json"
    profile = fetch_json(profile_url)
    state = State()
    server.start(state, PORT)
    state.log(f"status page preview on :{PORT}")
    state.update(profile=profile["id"], title=profile["title"], site=profile.get("site"), article=profile.get("article"))
    state.update(tips=load_tips(profile_url))
    state.step("profile", "done", f"{profile['title']} ({(profile.get('site_commit') or '')[:7]})")
    state.step("comfyui", "done", "latest 0000000")
    nodes = ", ".join(f"{n['id']} latest" for n in profile.get("custom_nodes", []))
    state.step("custom_nodes", "done", nodes or "none", key=None if nodes else "none")
    state.step("models", "running", f"{len(profile['models'])} files", key="files", count=len(profile["models"]))

    models = profile["models"]
    speed = 180_000_000  # bytes per second per file, roughly a datacenter download
    while True:
        state.set_models([
            {"name": m["name"], "directory": m["directory"], "size": m.get("size_bytes"), "done": 0, "speed": 0, "state": "downloading"}
            for m in models
        ])
        started = time.time()
        while True:
            elapsed = time.time() - started
            finished = 0
            for index, m in enumerate(models):
                size = m.get("size_bytes") or 1
                done = min(size, int(elapsed * speed))
                finished += done >= size
                state.model(index, done=done, speed=0 if done >= size else speed, state="done" if done >= size else "downloading")
            if finished == len(models):
                break
            time.sleep(1)
        time.sleep(10)  # hold the finished state briefly, then start over


if __name__ == "__main__":
    main()
