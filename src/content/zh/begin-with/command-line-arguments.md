---
layout: page.njk
lang: zh
section: begin-with
slug: command-line-arguments
navId: command-line-arguments
title: "命令行参数"
created: 2026-02-06
updated: 2026-08-01
summary: "启动 ComfyUI 时指定的选项"
seoTitle: "ComfyUI 命令行参数一览与设置方法"
seoDescription: "启动 ComfyUI 时指定的命令行参数的设置方法与一览。按用途整理了显存不足（OOM）对策、内存控制、端口等连接设置，以及排查错误用的选项。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 什么是命令行参数？

命令行参数 (Command Line Arguments) 是指在运行程序（这里是 ComfyUI 的 `main.py`）时指定的额外设置或选项。

当你想控制 VRAM 的使用方式、网络连接等比普通设置界面更底层的部分时，就会用到它。

## 设置方法

在 `python main.py` 后面加上参数来启动。

```
python main.py --fast
```

便携版的话，右键编辑用来启动的 `.bat` 文件（例：`run_nvidia_gpu.bat`），在 `python.exe` 后面加上参数即可。

![](/media/begin-with/command-line-arguments/legacy_gyazo_44f113bf9373f5dac0ced2a92e054165.png){media=image}

---


## 参数一览


### VRAM / 内存控制 (稳定性与性能)

用于应对 VRAM 不足导致的错误（OOM），或根据 VRAM 容量调整运行方式。

|  | 参数名 | 功能 | 备注 |
| :---: | :--- | :--- | :--- |
| 🔥 | `--reserve-vram [GB]` | **预留 VRAM:** 以 GB 为单位设置 VRAM 量，把这部分留给 OS 或其他应用。 | 设为 `--reserve-vram 1.0` 时，至少会留出 1.0GB。 |
| | `--vram-headroom [GB]` | 为 DynamicVRAM 额外保留空闲 VRAM。 | 设为 `--vram-headroom 1.0` 时，会尝试比通常多留出 1.0GB。 |
| 🔥 | `--disable-smart-memory` | **强制解除内存管理。** 不将模型保留在 VRAM 中，而是积极地卸载到 RAM。 | 在 VRAM 较少的环境下优先考虑稳定性时有效。速度可能会下降。 |
| | `--lowvram` | 启用 VRAM 节约模式。 | 把 UNET 分成几部分执行，以减少 VRAM 用量。是 VRAM 较少时的标准设置。|
| | `--highvram` | 不将模型卸载到 CPU 内存，而是保留在 GPU 内存中。 | 在 VRAM 容量较大的环境下提升模型切换速度。 |
| | `--high-ram` | 解除 RAM 使用限制，让模型更容易保留在内存中。 | 适用于 RAM 充足的环境。内存占用会增加。 |
| | `--fast-disk` | 在 DynamicVRAM 的读取和卸载中优先使用高速磁盘。 | 使用高速 NVMe SSD 时有效。 |
| | `--cpu` | 全部处理都在 CPU 上进行。 | 非常慢，只作为没有 GPU 时的最后手段。 |
| | `--normalvram` | 即使自动启用了 `lowvram`，也强制按常规方式使用 VRAM。 | |

### 启动 / 连接设置 (便利性与网络)

用于设置浏览器的行为，或在局域网内共享 ComfyUI。

|  | 参数名 | 功能 | 备注 |
| :---: | :--- | :--- | :--- |
| 🔥 | `--disable-auto-launch` | 禁用**浏览器自动启动**。 | 使用官方 Windows 便携版时，如果不想在启动时打开浏览器，请将它追加到 `.bat` 文件末尾。 |
| 🔥 | `--output-directory [path]` | 设置**输出目录**。 | 想更改生成图像的保存位置时使用。 |
| | `--listen` | 允许外部连接: 指定监听的 IP 地址。 | 不带参数 (`--listen`) 时同时监听 IPv4 的 `0.0.0.0` 和 IPv6 的 `::`。这样可以从其他 PC 访问。 |
| | `--port [num]` | 设置监听端口 (默认: 8188)。 | 比如端口已被占用时修改。 |
| | `--enable-manager` | 启用 ComfyUI Manager。 | 在便携版和手动安装版中用于显示 Manager。 |
| | `--enable-manager-legacy-ui` | 启用旧版 ComfyUI Manager UI。 | 与 `--enable-manager` 一起使用。详情请参考 [ComfyUI Manager](/zh/begin-with/comfyui-manager/)。 |
| | `--models-directory [path]` | 更改 `models` 目录的位置。 | 指定一个已存在且可读取的目录。 |
| | `--extra-model-paths-config [path]` | 读取一个或多个 `extra_model_paths.yaml` 文件。 | 想要管理多个模型保存位置时使用。 |
| | `--auto-launch` | 使用默认浏览器自动启动 ComfyUI。 | |

### 故障排除 (排查错误/调试)

当 ComfyUI 无法启动，或出现图像全黑等问题时使用。

|  | 参数名 | 功能 | 备注 |
| :---: | :--- | :--- | :--- |
| 🔥 | `--disable-all-custom-nodes` | **禁用所有自定义节点的加载**。 | ComfyUI 无法启动时，用来判断是不是自定义节点导致的，这个最有用。 |
| | `--force-fp32` | 强制使用 FP32 (单精度)。 | 用于排查生成全黑图像等精度问题。 |
| | `--disable-xformers` | 禁用 xformers (加速库)。 | 用于排查报错或全黑图像是否由 xformers 引起。 |
| | `--fp16-vae` | 以 FP16 (半精度) 运行 VAE。 | 能节省 VAE 运行时的 VRAM，但可能会生成全黑图像。 |
| | `--cpu-vae` | 以 CPU 运行 VAE。 | VRAM 极少时将 VAE 处理交给 CPU 的最后手段。 |
| | `--disable-metadata` | 不在文件中保存提示词元数据。 | 想要减小图像文件大小时使用。 |
| | `--fast` | 启用未经测试的优化。 | 速度测试用。不保证质量。 |

### 其他 (进阶/面向开发者)

主要包括 VRAM/精度的高级调优和前端测试相关的参数。

|  | 参数名 | 功能 | 备注 |
| :---: | :--- | :--- | :--- |
| | `--cuda-device [ID]` | 设置此实例使用的 CUDA 设备 ID。 | 面向多 GPU 环境。 |
| 🔥 | `--front-end-version [version]` | 用于尝试新的 UI（前端）。 | 例: `--front-end-version Comfy-Org/ComfyUI_frontend@latest` |
| | `--temp-directory [path]` | 设置 ComfyUI 的临时目录。 | |
| | `--multi-user` | 启用每用户存储。 | |
| | `--verbose` | 增加调试打印信息。 | 用于详细追踪错误。 |
| | `--force-channels-last` | 模型推理时强制使用 Channels Last 格式。 | |
