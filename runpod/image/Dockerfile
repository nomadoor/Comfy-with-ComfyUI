# Generic ComfyUI image for the site's RunPod profiles. It holds no models, custom nodes or
# workflows: the bootstrap fetches /runpod/profiles/${PROFILE}.json at start and prepares those.
# ComfyUI master is cloned at build time (rebuilt daily) so boot only applies the difference.
# The CUDA "base" image is enough: the PyTorch wheels bring their own CUDA and cuDNN libraries.
FROM nvidia/cuda:13.0.3-base-ubuntu24.04

ENV DEBIAN_FRONTEND=noninteractive \
    PYTHONUNBUFFERED=1 \
    UV_LINK_MODE=copy \
    UV_PYTHON_INSTALL_DIR=/opt/python \
    UV_CACHE_DIR=/tmp/uv-cache \
    VIRTUAL_ENV=/opt/venv \
    PATH=/opt/venv/bin:$PATH

RUN apt-get update \
 && apt-get install -y --no-install-recommends git aria2 jq curl ca-certificates libgl1 libglib2.0-0 \
 && rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:0.9 /uv /uvx /usr/local/bin/

# PyTorch and its CUDA libraries are ~6.7 GB. Installed in one step they make one huge layer, which a
# Pod downloads and unpacks as a single stream. Resolve the set once, then install it in four groups
# of similar size, so the Pod pulls them in parallel.
ENV TORCH_INDEX=https://download.pytorch.org/whl/cu130
RUN uv venv --python 3.12 /opt/venv \
 && printf 'torch\ntorchvision\ntorchaudio\n' > /tmp/torch.in \
 && uv pip compile --quiet --python /opt/venv/bin/python --index-url "$TORCH_INDEX" /tmp/torch.in -o /opt/torch.lock
RUN grep -E '^(nvidia-(cublas|cufft|cufile|curand|cusolver|cusparse|cuda-|nvjitlink|nvtx)[^=]*)==' /opt/torch.lock > /tmp/g1.txt \
 && uv pip install --no-cache --no-deps --index-url "$TORCH_INDEX" -r /tmp/g1.txt
RUN grep -E '^(nvidia-(cudnn|nccl|cusparselt|nvshmem)[^=]*)==' /opt/torch.lock > /tmp/g2.txt \
 && uv pip install --no-cache --no-deps --index-url "$TORCH_INDEX" -r /tmp/g2.txt
RUN grep -E '^triton==' /opt/torch.lock > /tmp/g3.txt \
 && uv pip install --no-cache --no-deps --index-url "$TORCH_INDEX" -r /tmp/g3.txt
RUN uv pip install --no-cache --index-url "$TORCH_INDEX" -r /opt/torch.lock

ARG COMFY_COMMIT=master
RUN git clone --filter=blob:none https://github.com/comfyanonymous/ComfyUI.git /opt/ComfyUI \
 && git -C /opt/ComfyUI checkout --quiet "$COMFY_COMMIT" \
 && uv pip install --no-cache -r /opt/ComfyUI/requirements.txt -r /opt/ComfyUI/manager_requirements.txt "huggingface_hub[hf_xet]" \
 && git -C /opt/ComfyUI rev-parse HEAD > /opt/.runpod-comfyui-requirements.sha

COPY bootstrap /opt/runpod/bootstrap
COPY status /opt/runpod/status
COPY extension /opt/runpod/extension
COPY boot.sh /opt/runpod/boot.sh

WORKDIR /opt/runpod
EXPOSE 8188
CMD ["/opt/runpod/boot.sh"]
