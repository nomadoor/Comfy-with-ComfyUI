---
layout: page.njk
lang: en
section: begin-with
slug: command-line-arguments
navId: command-line-arguments
title: "Command Line Arguments"
created: 2025-11-24
updated: 2026-08-01
summary: "Options specified when starting ComfyUI"
seoTitle: "ComfyUI Command Line Arguments: Full List"
seoDescription: "How to set ComfyUI command line arguments, with a list by purpose: VRAM and OOM fixes, memory control, port and network settings, and debugging."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## What are Command Line Arguments?

Command line arguments are extra settings and options you pass when running a program (here, ComfyUI's `main.py`).

You use them to control lower-level things that the regular settings screen doesn't cover, such as how VRAM is used or network connections.

## How to Set

Add the arguments after `python main.py` when you launch it.

```
python main.py --fast
```

In the portable version, right-click the `.bat` file you use to launch it (e.g. `run_nvidia_gpu.bat`), choose edit, and add the arguments after `python.exe`.

![](/media/begin-with/command-line-arguments/legacy_gyazo_44f113bf9373f5dac0ced2a92e054165.png){media=image}

---


## List of Arguments


### VRAM / Memory Control (Stability and Performance)

For dealing with out-of-VRAM errors (OOM) and tuning behavior to how much VRAM you have.

|  | Argument Name | Function | Remarks |
| :---: | :--- | :--- | :--- |
| 🔥 | `--reserve-vram [GB]` | **Reserve VRAM:** Sets an amount of VRAM in GB and keeps that much free for the OS and other apps. | With `--reserve-vram 1.0`, at least 1.0GB is left free. |
| | `--vram-headroom [GB]` | Keep additional VRAM free for DynamicVRAM. | With `--vram-headroom 1.0`, ComfyUI tries to leave an extra 1.0GB free. |
| 🔥 | `--disable-smart-memory` | **Turns off smart memory management.** Models aren't kept in VRAM and are aggressively offloaded to RAM. | Useful on low-VRAM systems when you want stability first. It may be slower. |
| | `--lowvram` | Enable VRAM saving mode. | Runs the UNET in parts to reduce VRAM usage. The standard setting when VRAM is low. |
| | `--highvram` | Keep the model in GPU memory without unloading it to CPU memory. | Speeds up model switching on systems with lots of VRAM. |
| | `--high-ram` | Remove RAM usage limits and make it easier to keep models in memory. | For systems with plenty of RAM. Memory usage will increase. |
| | `--fast-disk` | Prefer fast disk storage for DynamicVRAM loading and offloading. | Useful when using a fast NVMe SSD. |
| | `--cpu` | Use CPU for all processing. | Very slow, so it's a last resort when you have no GPU. |
| | `--normalvram` | Force normal VRAM usage even if `lowvram` is automatically enabled. | |

### Startup / Connection Settings (Convenience and Network)

For browser behavior and sharing ComfyUI over your LAN.

|  | Argument Name | Function | Remarks |
| :---: | :--- | :--- | :--- |
| 🔥 | `--disable-auto-launch` | Disable **browser auto-launch**. | With official Windows Portable, add this to the end of the `.bat` file if you do not want the browser to open at startup. |
| 🔥 | `--output-directory [path]` | Set **output directory**. | For when you want generated images saved somewhere else. |
| | `--listen` | Allow external connections: sets the IP address to listen on. | With no value (`--listen`), it listens on both IPv4 `0.0.0.0` and IPv6 `::`, so other PCs can connect. |
| | `--port [num]` | Set listen port (default: 8188). | Change it when the port is already in use, for example. |
| | `--enable-manager` | Enable ComfyUI Manager. | Used to show Manager in the portable and manual installation versions. |
| | `--enable-manager-legacy-ui` | Enable the old ComfyUI Manager UI. | Use together with `--enable-manager`. See [ComfyUI Manager](/en/begin-with/comfyui-manager/) for details. |
| | `--models-directory [path]` | Change the location of the `models` directory. | Specify an existing readable directory. |
| | `--extra-model-paths-config [path]` | Load one or more `extra_model_paths.yaml` files. | For when you keep models in more than one place. |
| | `--auto-launch` | Automatically launch ComfyUI in the default browser. | |

### Troubleshooting (Error Isolation / Debugging)

For when ComfyUI won't start, or when something goes wrong, like images coming out black.

|  | Argument Name | Function | Remarks |
| :---: | :--- | :--- | :--- |
| 🔥 | `--disable-all-custom-nodes` | **Disable loading of all custom nodes**. | The most useful way to check whether a custom node is the cause when ComfyUI won't start. |
| | `--force-fp32` | Force FP32 (single precision). | For troubleshooting precision issues, such as black images. |
| | `--disable-xformers` | Disable xformers (acceleration library). | Helps tell whether xformers is behind errors or black images. |
| | `--fp16-vae` | Run VAE in FP16 (half precision). | Saves VRAM during VAE execution, but black images may be generated. |
| | `--cpu-vae` | Run VAE on CPU. | A last resort that hands VAE work to the CPU when VRAM is extremely low. |
| | `--disable-metadata` | Do not save prompt metadata in files. | For when you want smaller image files. |
| | `--fast` | Enable untested optimizations. | For speed testing. Quality is not guaranteed. |

### Others (Advanced / For Developers)

Mostly advanced VRAM/precision tuning and frontend testing.

|  | Argument Name | Function | Remarks |
| :---: | :--- | :--- | :--- |
| | `--cuda-device [ID]` | Set the CUDA device ID used by this instance. | For multi-GPU environments. |
| 🔥 | `--front-end-version [version]` | For trying out a new UI (frontend). | Example: `--front-end-version Comfy-Org/ComfyUI_frontend@latest` |
| | `--temp-directory [path]` | Set ComfyUI's temporary directory. | |
| | `--multi-user` | Enable per-user storage. | |
| | `--verbose` | Print more debug output. | For detailed error tracking. |
| | `--force-channels-last` | Force channels-last format during model inference. | |
