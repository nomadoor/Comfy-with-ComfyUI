"""Boot state shared by the status page (status.json) and stdout (the RunPod log view).

Tokens never enter this object: every message written here is shown to the reader.
"""
import json
import threading
import time

STEPS = [
    ("profile", "Fetch profile"),
    ("comfyui", "Update ComfyUI"),
    ("custom_nodes", "Install custom nodes"),
    ("models", "Download models"),
    ("workflows", "Place workflows"),
    ("start", "Start ComfyUI"),
]


class BootError(Exception):
    """A failure the reader should see. `code` selects the advice text on the status page."""

    def __init__(self, code, message, **detail):
        super().__init__(message)
        self.code = code
        self.message = message
        self.detail = detail


class State:
    def __init__(self):
        self._lock = threading.Lock()
        self.started = time.time()
        self.data = {
            "profile": None,
            "title": None,
            "phase": "booting",  # booting | error | starting
            "steps": [{"id": step_id, "label": label, "state": "pending", "detail": ""} for step_id, label in STEPS],
            "models": [],
            "notices": [],
            "error": None,
            "started_at": int(self.started),
            "updated_at": int(self.started),
        }

    def log(self, message):
        elapsed = time.time() - self.started
        print(f"[boot {elapsed:6.1f}s] {message}", flush=True)

    def _step(self, step_id):
        return next(s for s in self.data["steps"] if s["id"] == step_id)

    def update(self, **fields):
        with self._lock:
            self.data.update(fields)
            self.data["updated_at"] = int(time.time())

    def step(self, step_id, state, detail=""):
        with self._lock:
            step = self._step(step_id)
            step["state"] = state
            step["detail"] = detail
            self.data["updated_at"] = int(time.time())
        label = self._step(step_id)["label"]
        self.log(f"{label}: {state}{' - ' + detail if detail else ''}")

    def set_models(self, models):
        with self._lock:
            self.data["models"] = models

    def model(self, index, **fields):
        with self._lock:
            self.data["models"][index].update(fields)
            self.data["updated_at"] = int(time.time())

    def notice(self, code, message, **detail):
        with self._lock:
            self.data["notices"].append({"code": code, "message": message, **detail})
        self.log(f"notice: {message}")

    def fail(self, error):
        with self._lock:
            self.data["phase"] = "error"
            self.data["error"] = {"code": error.code, "message": error.message, **error.detail}
            for step in self.data["steps"]:
                if step["state"] == "running":
                    step["state"] = "error"
        self.log(f"ERROR [{error.code}] {error.message}")

    def to_json(self):
        with self._lock:
            return json.dumps(self.data, ensure_ascii=False)
