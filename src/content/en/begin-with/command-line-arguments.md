---
layout: page.njk
lang: en
section: begin-with
slug: command-line-arguments
navId: command-line-arguments
title: "Command Line Arguments"
summary: "Options specified when starting ComfyUI"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## What are Command Line Arguments?

Command line arguments are additional settings and options specified when executing a program (here, ComfyUI's `main.py`).

Use this when you want to control more core parts such as VRAM usage and network connection than the normal settings screen.

## How to Set

Start by adding arguments after `python main.py`.

```
python main.py --fast
```

In the portable version, you can set it by right-clicking and editing the `.bat` file used for startup (e.g. `run_nvidia_gpu.bat`) and adding arguments after `python.exe`.

![](https://i.gyazo.com/44f113bf9373f5dac0ced2a92e054165.png){gyazo=image}

---


## List of Arguments


### VRAM / Memory Control (Stability and Performance)

Used for countermeasures against errors due to lack of VRAM (OOM) and operation adjustment according to VRAM capacity.

|  | Argument Name | Function | Remarks |
| :---: | :--- | :--- | :--- |
| 🔥 | `--reserve-vram [GB]` | **Reserve VRAM:** Sets the amount of VRAM to use in GB units, and reserves that amount for the OS and other apps. | In the case of `--reserve-vram 1.0`, at least 1.0GB remains. |
| 🔥 | `--disable-smart-memory` | **Forced release of memory management.** Does not keep the model in VRAM and actively offloads it to RAM. | Effective when you want to prioritize stability in an environment with low VRAM. Speed may drop. |
| | `--lowvram` | Enable VRAM saving mode. | Splits and executes UNET partially to reduce VRAM usage. Standard setting when VRAM is low. |
| | `--highvram` | Keep the model in GPU memory without unloading it to CPU memory. | Improves model switching speed in environments with large VRAM capacity. |
| | `--cpu` | Use CPU for all processing. | Very slow, so use as a last resort when there is no GPU. |
| | `--normalvram` | Force normal VRAM usage even if `lowvram` is automatically enabled. | |

### Startup / Connection Settings (Convenience and Network)

Used for browser behavior and ComfyUI sharing settings within LAN.

|  | Argument Name | Function | Remarks |
| :---: | :--- | :--- | :--- |
| 🔥 | `--disable-auto-launch` | Disable **browser auto-launch**. | Convenient when auto-launch is unnecessary, such as in the portable version. |
| 🔥 | `--output-directory [path]` | Set **output directory**. | When you want to change the save destination of generated images. |
| | `--listen` | Allow external connection: Specify the IP address to listen to. | Listen on `0.0.0.0` (all addresses) with no argument (`--listen`). Accessible from another PC. |
| | `--port [num]` | Set listen port (default: 8188). | Change when the port is already in use. |
| | `--extra-model-paths-config [path]` | Load one or more `extra_model_paths.yaml` files. | When you want to manage multiple model storage locations. |
| | `--auto-launch` | Automatically launch ComfyUI in the default browser. | |

### Troubleshooting (Error Isolation / Debugging)

Used when ComfyUI stops starting or when defects such as black images appear.

|  | Argument Name | Function | Remarks |
| :---: | :--- | :--- | :--- |
| 🔥 | `--disable-all-custom-nodes` | **Disable loading of all custom nodes**. | Most useful for isolating whether a custom node is the cause when ComfyUI stops starting. |
| | `--force-fp32` | Force FP32 (single precision). | For troubleshooting precision issues such as black images appearing. |
| | `--disable-xformers` | Disable xformers (acceleration library). | Isolate when xformers causes errors or black images. |
| | `--fp16-vae` | Run VAE in FP16 (half precision). | Saves VRAM during VAE execution, but black images may be generated. |
| | `--cpu-vae` | Run VAE on CPU. | Last resort to leave VAE processing to CPU when VRAM is extremely low. |
| | `--disable-metadata` | Do not save prompt metadata to file. | When you want to reduce the image file size. |
| | `--fast` | Enable untested optimizations. | For speed testing. Quality is not guaranteed. |

### Others (Advanced / For Developers)

Mainly includes advanced tuning of VRAM/precision and frontend testing.

|  | Argument Name | Function | Remarks |
| :---: | :--- | :--- | :--- |
| | `--cuda-device [ID]` | Set the CUDA device ID used by this instance. | For multi-GPU environments. |
| 🔥 | `--front-end-version [version]` | Used to try the new UI (frontend). | Example: `--front-end-version Comfy-Org/ComfyUI_frontend@latest` |
| | `--temp-directory [path]` | Set ComfyUI temporary directory. | |
| | `--multi-user` | Enable per-user storage. | |
| | `--verbose` | Increase debug prints. | For detailed error tracking. |
| | `--force-channels-last` | Force channels-last format during model inference. | |
