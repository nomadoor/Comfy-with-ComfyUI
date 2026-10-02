# Generic ComfyUI image for the site's RunPod profiles. It holds no models, custom nodes or
# workflows: the bootstrap fetches /runpod/profiles/${PROFILE}.json at start and prepares those.
# ComfyUI master is cloned at build time (rebuilt daily) so boot only applies the difference.
# The CUDA "base" image is enough: the PyTorch wheels (installed at boot) bring their own CUDA and cuDNN libraries.
FROM nvidia/cuda:13.0.3-base-ubuntu24.04

ENV DEBIAN_FRONTEND=noninteractive \
    PYTHONUNBUFFERED=1 \
    UV_LINK_MODE=copy \
    UV_PYTHON_INSTALL_DIR=/opt/python \
    UV_CACHE_DIR=/tmp/uv-cache \
    VIRTUAL_ENV=/opt/venv \
    PATH=/opt/venv/bin:$PATH

# gcc and libc6-dev: Triton (used by PyTorch's native ops since cu130) compiles a small C helper
# the first time it touches the GPU. Without a compiler every prompt fails with
# "Failed to find C compiler".
RUN apt-get update \
 && apt-get install -y --no-install-recommends git aria2 jq curl ca-certificates libgl1 libglib2.0-0 gcc libc6-dev \
 && rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:0.9 /uv /uvx /usr/local/bin/

# PyTorch and its CUDA libraries (~6.7 GB) are NOT in the image. Pulled as layers, they took a fresh
# RunPod machine ~1.5 minutes (one stream per layer, unpacked one layer at a time); the boot process
# installs the same wheels from the PyTorch index in parallel, while the models download. The image
# keeps the exact versions (/opt/runtime.lock) so every Pod gets the same set; everything else
# ComfyUI needs is resolved against those versions and installed here.
ENV TORCH_INDEX=https://download.pytorch.org/whl/cu130
RUN uv venv --python 3.13 /opt/venv

ARG COMFY_COMMIT=master
RUN git clone --filter=blob:none https://github.com/comfyanonymous/ComfyUI.git /opt/ComfyUI \
 && git -C /opt/ComfyUI checkout --quiet "$COMFY_COMMIT" \
 && printf 'torch\ntorchvision\ntorchaudio\n' > /tmp/torch.in \
 && printf 'huggingface_hub[hf_xet]\n' > /tmp/extra.in \
 && uv pip compile --quiet --python /opt/venv/bin/python --index-url "$TORCH_INDEX" /tmp/torch.in -o /tmp/torch.lock \
 && uv pip compile --quiet --python /opt/venv/bin/python --extra-index-url "$TORCH_INDEX" --index-strategy unsafe-best-match \
      -c /tmp/torch.lock /tmp/torch.in /opt/ComfyUI/requirements.txt /opt/ComfyUI/manager_requirements.txt /tmp/extra.in \
      -o /opt/full.lock \
 && grep -E '^(torch|torchvision|torchaudio|triton|nvidia-[a-z0-9-]+|cuda-[a-z0-9-]+)==' /opt/full.lock > /opt/runtime.lock \
 && grep -vE '^(torch|torchvision|torchaudio|triton|nvidia-[a-z0-9-]+|cuda-[a-z0-9-]+)==' /opt/full.lock > /tmp/rest.lock \
 && uv pip install --no-cache --no-deps --extra-index-url "$TORCH_INDEX" --index-strategy unsafe-best-match -r /tmp/rest.lock \
 && git -C /opt/ComfyUI rev-parse HEAD > /opt/.runpod-comfyui-requirements.sha

# Every later install (ComfyUI and custom node requirements at boot, Manager installs from the UI)
# must keep the locked PyTorch: a node asking for another torch fails loudly instead of quietly
# replacing the cu130 build with a PyPI one. Set after the build's own installs.
ENV UV_CONSTRAINT=/opt/runtime.lock \
    PIP_CONSTRAINT=/opt/runtime.lock

COPY bootstrap /opt/runpod/bootstrap
COPY status /opt/runpod/status
COPY extension /opt/runpod/extension
COPY boot.sh /opt/runpod/boot.sh

WORKDIR /opt/runpod
EXPOSE 8188
CMD ["/opt/runpod/boot.sh"]
