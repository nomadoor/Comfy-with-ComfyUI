"""The profile this Pod serves: fetching and checking it, and where its workflows go.

A profile is /runpod/profiles/<id>.json on the site, built by runpod/tools/profiles.mjs.
"""
import hashlib
import os
import re
import urllib.parse

from .state import BootError
from .util import fetch, fetch_json

SCHEMA_VERSION = 1
SITE = "https://comfyui.nomadoor.net"


def load_profile(state):
    profile_id = os.environ.get("PROFILE", "").strip()
    if not profile_id:
        raise BootError("profile_missing", "PROFILE is not set on this Pod.")
    url = os.environ.get("PROFILE_URL") or f"{SITE}/runpod/profiles/{profile_id}.json"
    state.step("profile", "running", url)
    try:
        profile = fetch_json(url)
    except Exception as error:  # noqa: BLE001
        raise BootError("profile_fetch", f"Could not fetch {url}: {error}") from None
    if profile.get("schema_version") != SCHEMA_VERSION:
        raise BootError("profile_schema", f"Profile schema {profile.get('schema_version')} is not supported by this image.")
    check_paths(profile)
    return url, profile


# Same rule as safePath in runpod/tools/profiles.mjs, which rejects these names at check:runpod.
SAFE_PART = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._ +()-]*$")


def check_paths(profile):
    """Names from the profile become paths on disk: keep each one inside the folder it belongs to.

    The profile comes from this site, so this is a guard against mistakes rather than attacks.
    """
    def ok(value, nested=False):
        parts = str(value).split("/") if nested else [str(value)]
        return all(SAFE_PART.match(part) and part not in (".", "..") for part in parts)

    bad = [f"model {m.get('directory')}/{m.get('name')}" for m in profile.get("models", []) if not (ok(m.get("name", "")) and ok(m.get("directory", ""), nested=True))]
    bad += [f"workflow {w.get('name')}" for w in profile.get("workflows", []) if not ok(w.get("name", "")) or ("folder" in w and not ok(w["folder"]))]
    bad += [f"custom node {n.get('id')}" for n in profile.get("custom_nodes", []) if not ok(n.get("id", ""), nested=True)]
    if bad:
        raise BootError("profile_invalid", "The profile has names that are not safe as paths: " + ", ".join(bad))


def fetch_site_file(item, profile_url):
    # Fetch from the same site as the profile, so previews and local builds stay consistent.
    url = urllib.parse.urljoin(profile_url, item["path"]) if item.get("path") else item["url"]
    try:
        body = fetch(url)
    except Exception as error:  # noqa: BLE001
        raise BootError("workflow", f"Could not fetch {item['name']}: {error}") from None
    if hashlib.sha256(body).hexdigest() != item["sha256"]:
        raise BootError("workflow", f"{item['name']} does not match the profile (sha256).")
    return body


def load_tips(profile_url):
    """Columns for the status page, from the same site as the profile. Optional: none on failure."""
    try:
        return fetch_json(urllib.parse.urljoin(profile_url, "/runpod/tips.json"), timeout=15).get("tips", [])
    except Exception:  # noqa: BLE001
        return []


def workflow_file(workflow):
    """Where a workflow sits in the sidebar's Workflows tab: its profile folder, if any, then its name."""
    return f"{workflow['folder']}/{workflow['name']}" if workflow.get("folder") else workflow["name"]


def opened_workflows(profile):
    """The workflows opened as tabs on a reader's first visit. A profile built before `open` existed
    flags none; it opens its first (the article's first) workflow, like a profile without `open` does."""
    return [w for w in profile["workflows"] if w.get("open")] or profile["workflows"][:1]
