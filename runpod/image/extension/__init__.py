"""Frontend helper and idle auto-stop for the site's RunPod Pods (no nodes).

The bootstrap copies this folder into ComfyUI/custom_nodes/ and writes web/runpod.json, which lists
the profile's workflows in article order (web/runpod.js opens them as tabs).

Idle auto-stop: reader activity in the page (web/runpod.js posts /runpod/activity) and queued or
running prompts keep the Pod alive. After IDLE_STOP_MINUTES (default 30, 0 turns it off) without
either, the Pod stops itself through the RunPod API. Stop, not terminate: GPU billing ends and the
volume disk is kept. The page shows a warning for the last few minutes.
"""
import json
import logging
import os
import threading
import time
import urllib.request

import server
from aiohttp import web

NODE_CLASS_MAPPINGS = {}
WEB_DIRECTORY = "./web"

IDLE_SECONDS = float(os.environ.get("IDLE_STOP_MINUTES", "30")) * 60
WARN_SECONDS = min(5 * 60, IDLE_SECONDS / 2)
_state = {"last": time.time(), "stopping": False, "stopped_reason": None}


def _busy():
    try:
        return server.PromptServer.instance.prompt_queue.get_tasks_remaining() > 0
    except Exception:  # noqa: BLE001 - never let the watchdog break ComfyUI
        return False


def _status():
    if _busy():
        _state["last"] = time.time()
    left = IDLE_SECONDS - (time.time() - _state["last"])
    return {
        "enabled": IDLE_SECONDS > 0,
        "idle_limit": IDLE_SECONDS,
        "warn_before": WARN_SECONDS,
        "stop_in": max(0, round(left)),
        "stopping": _state["stopping"],
        "can_stop": bool(os.environ.get("RUNPOD_POD_ID") and os.environ.get("RUNPOD_API_KEY")),
    }


def stop_pod(reason):
    """Stop this Pod through the RunPod REST API (the Pod-scoped key RunPod injects)."""
    pod_id, key = os.environ.get("RUNPOD_POD_ID"), os.environ.get("RUNPOD_API_KEY")
    _state["stopping"] = True
    if not pod_id or not key:
        logging.warning("[comfy-with-comfyui] idle for too long, but RUNPOD_POD_ID/RUNPOD_API_KEY are not set; not stopping")
        return
    logging.warning(f"[comfy-with-comfyui] stopping Pod {pod_id}: {reason}")
    request = urllib.request.Request(
        f"https://rest.runpod.io/v1/pods/{pod_id}/stop", method="POST", headers={"Authorization": f"Bearer {key}"}
    )
    try:
        urllib.request.urlopen(request, timeout=30).read()
    except Exception as error:  # noqa: BLE001
        _state["stopping"] = False
        logging.error(f"[comfy-with-comfyui] could not stop the Pod: {error}")


def _watch():
    while True:
        time.sleep(15)
        status = _status()
        if status["enabled"] and status["stop_in"] <= 0 and not _state["stopping"]:
            stop_pod(f"no activity for {IDLE_SECONDS / 60:.0f} minutes")


routes = server.PromptServer.instance.routes


@routes.post("/runpod/activity")
async def _activity(request):
    _state["last"] = time.time()
    return web.json_response(_status())


@routes.get("/runpod/idle")
async def _idle(request):
    return web.json_response(_status())


if IDLE_SECONDS > 0:
    threading.Thread(target=_watch, name="runpod-idle-stop", daemon=True).start()
