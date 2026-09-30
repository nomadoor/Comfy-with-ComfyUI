import hashlib
import json
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
