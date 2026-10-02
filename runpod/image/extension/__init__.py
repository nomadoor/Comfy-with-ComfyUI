"""Frontend helper, idle auto-stop, and opening from the RunPod console for the site's RunPod Pods (no nodes).

The bootstrap copies this folder into ComfyUI/custom_nodes/ and writes web/runpod.json, which lists
the profile's workflows in article order (web/runpod.js opens them as tabs).

Idle auto-stop: reader activity in the page (web/runpod.js posts /runpod/activity) and generation
that is actually moving keep the Pod alive. "Moving" means ComfyUI is sending execution events
(a node starting, sampler steps): it sends them with the tab closed too, so a long batch left
running is not cut. A queue that is merely non-empty does not count: a stuck node would keep it so
forever. After IDLE_STOP_MINUTES (default 30, 0 turns it off) with neither, the Pod terminates
itself through the RunPod API. Terminate, not stop: with no volume disk a
stopped Pod costs nothing but also keeps nothing (outputs live on the container disk, which a stop
erases), restarting it waits for a GPU on the same machine, and it lingers in the reader's list. A
new Pod from the article is the one way back. The page shows a warning for the last few minutes.
"""
import json
import logging
import os
import threading
import time
import urllib.request

import server
from aiohttp import web
from multidict import CIMultiDict

NODE_CLASS_MAPPINGS = {}
WEB_DIRECTORY = "./web"

def _idle_minutes():
    # A typo must not fail this import: that would silently drop the idle auto-stop.
    try:
        return float(os.environ.get("IDLE_STOP_MINUTES", "30") or 30)
    except ValueError:
        logging.warning("[comfy-with-comfyui] IDLE_STOP_MINUTES is not a number; using 30")
        return 30.0


IDLE_SECONDS = _idle_minutes() * 60
WARN_SECONDS = min(5 * 60, IDLE_SECONDS / 2)
_state = {"last": time.time(), "stopping": False, "stopped_reason": None}


# Events ComfyUI sends while a prompt runs. "progress" and "progress_state" go out whether or not a
# browser is connected; "executing" only with a client, so it is a bonus, not the signal.
EXECUTION_EVENTS = {"execution_start", "executing", "progress", "progress_state", "executed", "execution_cached", "execution_success"}


def _watch_execution(instance):
    send_sync = instance.send_sync

    def recording_send_sync(event, data, sid=None):
        if event in EXECUTION_EVENTS:
            _state["last"] = time.time()
        return send_sync(event, data, sid)

    instance.send_sync = recording_send_sync


_watch_execution(server.PromptServer.instance)


def _status():
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
    """Terminate this Pod through the RunPod REST API (the Pod-scoped key RunPod injects)."""
    pod_id, key = os.environ.get("RUNPOD_POD_ID"), os.environ.get("RUNPOD_API_KEY")
    if not pod_id or not key:
        # Not on RunPod: nothing to terminate, and the page must not claim it was.
        logging.warning("[comfy-with-comfyui] idle for too long, but RUNPOD_POD_ID/RUNPOD_API_KEY are not set; not terminating")
        return
    _state["stopping"] = True
    logging.warning(f"[comfy-with-comfyui] terminating Pod {pod_id}: {reason}")
    request = urllib.request.Request(
        f"https://rest.runpod.io/v1/pods/{pod_id}", method="DELETE", headers={"Authorization": f"Bearer {key}"}
    )
    try:
        urllib.request.urlopen(request, timeout=30).read()
    except Exception as error:  # noqa: BLE001
        _state["stopping"] = False
        logging.error(f"[comfy-with-comfyui] could not terminate the Pod: {error}")


def _watch():
    while True:
        time.sleep(15)
        status = _status()
        if status["enabled"] and status["stop_in"] <= 0 and not _state["stopping"]:
            stop_pod(f"no activity for {IDLE_SECONDS / 60:.0f} minutes")


# Opening the Pod from the RunPod console is a cross-site navigation (runpod.io -> proxy.runpod.net),
# and ComfyUI answers every request marked `Sec-Fetch-Site: cross-site` with an empty 403. The status
# page normally hides this: it answers the console's click and reloads into ComfyUI from the same
# site. When ComfyUI is already up at the click (a Pod that stayed in initialization for a while),
# the reader gets "Access ... was denied". Let only that top-level load of the page itself (`/`)
# through; every other cross-site request (prompts, API calls, uploads, other GET routes) still meets
# ComfyUI's check.
@web.middleware
async def _allow_console_navigation(request, handler):
    headers = request.headers
    if (
        request.method == "GET"
        and request.path == "/"
        and headers.get("Sec-Fetch-Site") == "cross-site"
        and headers.get("Sec-Fetch-Mode") == "navigate"
        and headers.get("Sec-Fetch-Dest") == "document"
    ):
        request = request.clone(headers=CIMultiDict((k, v) for k, v in headers.items() if k.lower() != "sec-fetch-site"))
    return await handler(request)


# Custom nodes load before the app starts, so the middleware list is still open; first runs outermost.
server.PromptServer.instance.app.middlewares.insert(0, _allow_console_navigation)

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
