import hashlib
import json
import os
import subprocess
import urllib.error
import urllib.request

USER_AGENT = "comfy-with-comfyui-runpod/1"


def run(args, cwd=None, env=None):
    """Run a command; raise with the tail of its output on failure (commands never carry tokens)."""
    result = subprocess.run(args, cwd=cwd, env=env, capture_output=True, text=True)
    if result.returncode != 0:
        tail = (result.stderr or result.stdout).strip().splitlines()[-15:]
        raise RuntimeError(f"{' '.join(map(str, args[:4]))} failed ({result.returncode}): " + "\n".join(tail))
    return result.stdout.strip()


def fetch(url, timeout=60):
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return response.read()


def fetch_json(url, timeout=60):
    return json.loads(fetch(url, timeout).decode("utf-8"))


def http_status(error):
    return error.code if isinstance(error, urllib.error.HTTPError) else None


def sha256_file(path, on_progress=None):
    digest = hashlib.sha256()
    done = 0
    with open(path, "rb") as f:
        while chunk := f.read(16 * 1024 * 1024):
            digest.update(chunk)
            done += len(chunk)
            if on_progress:
                on_progress(done)
    return digest.hexdigest()


def stop_this_pod(log):
    """Stop the Pod through the RunPod REST API (RunPod injects RUNPOD_POD_ID and a Pod-scoped key)."""
    pod_id, key = os.environ.get("RUNPOD_POD_ID"), os.environ.get("RUNPOD_API_KEY")
    if not pod_id or not key:
        log("not on RunPod (no RUNPOD_POD_ID/RUNPOD_API_KEY); not stopping")
        return False
    request = urllib.request.Request(
        f"https://rest.runpod.io/v1/pods/{pod_id}/stop", method="POST", headers={"Authorization": f"Bearer {key}"}
    )
    try:
        urllib.request.urlopen(request, timeout=30).read()
        return True
    except Exception as error:  # noqa: BLE001
        log(f"could not stop the Pod: {error}")
        return False
