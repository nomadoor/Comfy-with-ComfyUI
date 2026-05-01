---
layout: page.njk
lang: zh
section: begin-with
slug: command-line-arguments
navId: command-line-arguments
title: "与启动参数"
created: 2026-02-06
updated: 2026-03-02
summary: "启动 ComfyUI 时指定的选项"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 什么是命令行参数与启动参数？

命令行参数 (Command Line Arguments) 是指在运行程序（这里是 ComfyUI 的 `main.py`）时指定的额外设置或选项。

当你想控制 VRAM 使用方式或网络连接等、比普通设置画面更核心的部分时，就会用到它。

## 设置方法

通过在 `python main.py` 后面追加参数来启动。

```
python main.py --fast
```

在便携版中，可以通过右键编辑用于启动的 `.bat` 文件（例：`run_nvidia_gpu.bat`），在 `python.exe` 之后追加参数来进行设置。

![](https://i.gyazo.com/44f113bf9373f5dac0ced2a92e054165.png){gyazo=image}

---


## 参数一览


### VRAM / 内存控制 (稳定性与性能)

用于应对 VRAM 不足导致的错误（OOM）或根据 VRAM 容量调整运行。

|  | 参数名 | 功能 | 备注 |
| :---: | :--- | :--- | :--- |
| 🔥 | `--reserve-vram [GB]` | **VRAM 预约:** 将使用的 VRAM 量以 GB 为单位进行设定，为 OS 或其他应用保留指定大小的显存。 | 设定为 `--reserve-vram 1.0` 时，会至少保留 1.0GB。 |
| 🔥 | `--disable-smart-memory` | **强制解除内存管理。** 不将模型保留在 VRAM 中，而是积极地卸载到 RAM。 | 在 VRAM 较少的环境下优先考虑稳定性时有效。速度可能会下降。 |
| | `--lowvram` | 启用 VRAM 节约模式。 | 将 UNET 分割执行以减少 VRAM 使用量。VRAM 较少情况下的标准设置。|
| | `--highvram` | 不将模型卸载到 CPU 内存，而是保留在 GPU 内存中。 | 在 VRAM 容量较大的环境下提升模型切换速度。 |
| | `--cpu` | 全部处理都在 CPU 上进行。 | 因为非常慢，仅作为没有 GPU 时的最后手段。 |
| | `--normalvram` | 即使自动启用了 `lowvram`，也强制进行常规 VRAM 使用。 | |

### 启动 / 连接设置 (便利性与网络)

用于 Web 浏览器动作或局域网内的 ComfyUI 共享设置。

|  | 参数名 | 功能 | 备注 |
| :---: | :--- | :--- | :--- |
| 🔥 | `--disable-auto-launch` | 禁用**浏览器自动启动**。 | 在便携版等不需要自动启动时很方便。 |
| 🔥 | `--output-directory [path]` | 设置**输出目录**。 | 想更改生成图像的保存位置时使用。 |
| | `--listen` | 允许外部连接: 指定监听的 IP 地址。 | 不带参数 (`--listen`) 时监听 `0.0.0.0` (所有地址)。这样可以从其他 PC 访问。 |
| | `--port [num]` | 设置监听端口 (默认: 8188)。 | 当端口已被占用时进行更改。 |
| | `--extra-model-paths-config [path]` | 读取一个或多个 `extra_model_paths.yaml` 文件。 | 想要管理多个模型保存位置时使用。 |
| | `--auto-launch` | 使用默认浏览器自动启动 ComfyUI。 | |

### 故障排除 (错误隔离/调试)

当 ComfyUI 无法启动，或出现生成全黑图像等故障时使用。

|  | 参数名 | 功能 | 备注 |
| :---: | :--- | :--- | :--- |
| 🔥 | `--disable-all-custom-nodes` | **禁用所有自定义节点的加载**。 | 当 ComfyUI 无法启动时，这是判断是否由自定义节点引起的最有效手段。 |
| | `--force-fp32` | 强制使用 FP32 (单精度)。 | 用于解决生成全黑图像等精度问题的故障排除。 |
| | `--disable-xformers` | 禁用 xformers (加速库)。 | 当 xformers 导致报错或生成全黑图像时用于隔离问题。 |
| | `--fp16-vae` | 以 FP16 (半精度) 运行 VAE。 | 虽能节约 VAE 运行时显存，但可能生成全黑图像。 |
| | `--cpu-vae` | 以 CPU 运行 VAE。 | VRAM 极少时将 VAE 处理交给 CPU 的最后手段。 |
| | `--disable-metadata` | 不在文件中保存提示词元数据。 | 想要减小图像文件大小时使用。 |
| | `--fast` | 启用未经测试的优化。 | 速度测试用。不保证质量。 |

### 其他 (面向应用/开发者)

主要包含 VRAM/精度的高级调整、前端测试相关内容。

|  | 参数名 | 功能 | 备注 |
| :---: | :--- | :--- | :--- |
| | `--cuda-device [ID]` | 设置此实例使用的 CUDA 设备 ID。 | 面向多 GPU 环境。 |
| 🔥 | `--front-end-version [version]` | 用于尝试新的 UI（前端）。 | 例: `--front-end-version Comfy-Org/ComfyUI_frontend@latest` |
| | `--temp-directory [path]` | 设置 ComfyUI 的临时目录。 | |
| | `--multi-user` | 启用每用户存储。 | |
| | `--verbose` | 增加调试打印信息。 | 用于详细追踪错误。 |
| | `--force-channels-last` | 模型推理时强制使用 Channels Last 格式。 | |
