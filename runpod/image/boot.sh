#!/usr/bin/env bash
# Pod entry point. The bootstrap prepares everything the profile names, then runs ComfyUI as a
# child process and watches it (bootstrap/__main__.py).
set -euo pipefail

if [ -z "${DATA_DIR:-}" ]; then
  if [ -d /workspace ]; then DATA_DIR=/workspace; else DATA_DIR=/data; fi
fi
export DATA_DIR
mkdir -p "$DATA_DIR"

cd /opt/runpod
exec python -m bootstrap
