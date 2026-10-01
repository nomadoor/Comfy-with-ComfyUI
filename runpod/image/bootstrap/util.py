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


def terminate_this_pod(log):
    """Terminate the Pod through the RunPod REST API (RunPod injects RUNPOD_POD_ID and a Pod-scoped key)."""
    pod_id, key = os.environ.get("RUNPOD_POD_ID"), os.environ.get("RUNPOD_API_KEY")
    if not pod_id or not key:
        log("not on RunPod (no RUNPOD_POD_ID/RUNPOD_API_KEY); not terminating")
        return False
    request = urllib.request.Request(
        f"https://rest.runpod.io/v1/pods/{pod_id}", method="DELETE", headers={"Authorization": f"Bearer {key}"}
    )
    try:
        urllib.request.urlopen(request, timeout=30).read()
        return True
    except Exception as error:  # noqa: BLE001
        log(f"could not terminate the Pod: {error}")
        return False


_SECRET = ("KEY", "TOKEN", "SECRET", "PASSWORD")
_POD_FIELDS = ("createdAt", "lastStartedAt", "lastStatusChange", "desiredStatus", "imageName", "machineId",
               "gpuTypeId", "gpuCount", "dataCenterId", "costPerHr", "containerDiskInGb", "uptimeSeconds")


def pod_timing(boot_started):
    """How long the Pod took to reach our boot process (image pull + container start), for report.json.

    Asks the RunPod REST API about this Pod with the Pod-scoped key and keeps a short whitelist of
    fields: never the env, which can hold the reader's tokens. Returns {} outside RunPod.
    """
    info = {"runpod_env": {k: v for k, v in os.environ.items() if k.startswith("RUNPOD_") and not any(s in k for s in _SECRET)}}
    pod_id, key = os.environ.get("RUNPOD_POD_ID"), os.environ.get("RUNPOD_API_KEY")
    if not pod_id or not key:
        return info
    request = urllib.request.Request(f"https://rest.runpod.io/v1/pods/{pod_id}", headers={"Authorization": f"Bearer {key}"})
    try:
        pod = json.loads(urllib.request.urlopen(request, timeout=15).read())
    except Exception as error:  # noqa: BLE001
        info["pod_error"] = str(error)
        return info
    flat = dict(pod)
    for nested in ("machine", "runtime"):
        if isinstance(pod.get(nested), dict):
            flat.update({k: v for k, v in pod[nested].items() if not isinstance(v, (dict, list))})
    info["pod"] = {k: flat[k] for k in _POD_FIELDS if k in flat}
    info["pod_fields"] = sorted(k for k in pod.keys() if k != "env")  # names only, to learn the schema
    for field in ("lastStartedAt", "createdAt"):
        value = flat.get(field)
        if isinstance(value, str):
            try:
                from datetime import datetime

                started = datetime.fromisoformat(value.replace("Z", "+00:00")).timestamp()
                info[f"seconds_from_{field}"] = round(boot_started - started, 1)
            except ValueError:
                pass
    return info
