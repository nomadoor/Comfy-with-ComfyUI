"""PyTorch and its CUDA libraries, installed at boot rather than shipped in the image.

The image keeps the exact versions (/opt/runtime.lock, resolved at build time against the rest of
ComfyUI's dependencies) so every Pod gets the same set. Pulling ~6.7 GB of layers took a fresh
machine ~1.5 minutes (one stream per layer, unpacked one layer at a time); the same wheels come
from the PyTorch index in parallel, while the models download.
"""
import hashlib
import os
import sys
import threading
import time
from pathlib import Path

from .state import BootError
from .util import run

LOCK = Path("/opt/runtime.lock")
MARKER = Path("/opt/.runpod-runtime.sha")
INDEX = os.environ.get("TORCH_INDEX", "https://download.pytorch.org/whl/cu130")


def _lock_hash():
    return hashlib.sha256(LOCK.read_bytes()).hexdigest()


# Room PyTorch takes once installed, kept free when it shares a disk with the models.
INSTALLED_BYTES = 8 * 10**9


def needed():
    return LOCK.exists() and (not MARKER.exists() or MARKER.read_text(encoding="utf-8").strip() != _lock_hash())


def install():
    """Install the locked set; recorded only after uv succeeds. Returns seconds taken."""
    started = time.time()
    # --no-cache: otherwise the ~6.7 GB of wheels stay in the uv cache next to the installed copy.
    run(["uv", "pip", "install", "--python", sys.executable, "--no-cache", "--no-deps", "--index-url", INDEX, "-r", str(LOCK)])
    MARKER.write_text(_lock_hash() + "\n", encoding="utf-8")
    return round(time.time() - started, 1)


class Background:
    """Runs install() on a thread so it overlaps the model downloads; wait() re-raises failures."""

    def __init__(self, state):
        self.state = state
        self.error = None
        self.seconds = 0.0
        self.thread = None
        if needed():
            state.step("runtime", "running", "installing PyTorch", key="torch")
            self.thread = threading.Thread(target=self._run, name="runtime-install", daemon=True)
            self.thread.start()

    def _run(self):
        try:
            self.seconds = install()
            self.state.log(f"PyTorch installed in {self.seconds}s")
        except Exception as error:  # noqa: BLE001 - surfaced by wait()
            self.error = error

    def wait(self):
        if self.thread:
            self.thread.join()
        if self.error:
            raise BootError("runtime", f"Could not install PyTorch: {self.error}")
        return self.seconds
