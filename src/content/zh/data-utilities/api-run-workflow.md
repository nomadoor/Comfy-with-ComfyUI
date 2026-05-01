---
layout: page.njk
lang: zh
section: data-utilities
slug: api-run-workflow
navId: api-run-workflow
title: "尝试通过 API 执行工作流"
created: 2026-02-06
updated: 2026-03-02
summary: "请求执行 → 确认完成 → 获取输出，的最简步骤"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 基本原理

我们将通过 API，从“外部”执行 ComfyUI 的 工作流。

要做的事情很简单，只需将 **API 格式的 JSON（= prompt）POST 到 `http://127.0.0.1:8188/prompt`** 即可。

这样 ComfyUI 服务器就会接收到“执行该 工作流”的指令，并将其放入队列执行，最后返回 `prompt_id`（执行 ID）。

> 稍微有点绕的是，这里出现的“prompt”并不是文本提示词，而是指 **整个工作流（执行图表）**。
> 文本只是其中的一部分，例如 `CLIPTextEncode` 的 `inputs.text` 等就属于这部分。

这次，我们试着用 Python 来执行。

--- 

## 预先启动 ComfyUI

API 并不是“让你无需启动 ComfyUI 的机制”。
Python 是向正在运行的 ComfyUI 服务器发送指令。

- 请预先启动 ComfyUI
- 确保浏览器能打开 `http://127.0.0.1:8188`

---

## 准备 API 用的工作流

### 这次使用的工作流（SD1.5 text2image）

首先，我们使用最简单的 Stable Diffusion 1.5 的 text2image。

![](https://gyazo.com/897f66c308b3b98440f641ee3d33d50e){gyazo=image}

[](/workflows/basic-workflows/sd15-text2image/SD1.5_text2image_vae-ft-mse-840000.json)

**下载模型**
- checkpoints
  - [v1-5-pruned-emaonly-fp16.safetensors](https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive/blob/main/v1-5-pruned-emaonly-fp16.safetensors)
- vae
  - [vae-ft-mse-840000-ema-pruned.safetensors](https://huggingface.co/stabilityai/sd-vae-ft-mse-original/blob/main/vae-ft-mse-840000-ema-pruned.safetensors)

```text
📂ComfyUI/
  └── 📂models/
      ├── 📂checkpoints/
      │   └── v1-5-pruned-emaonly-fp16.safetensors
      └── 📂vae/
          └── vae-ft-mse-840000-ema-pruned.safetensors
```

### 获取 API 用的工作流

- 1. 在 ComfyUI 的节点 UI 中，打开上述 工作流
- 2. 从菜单中选择 `File` → **Export (API)**
- 3. 以易懂的名称保存（例：SD1.5_text2image_API.json）

**示例**

[](/workflows/data-utilities/api-run-workflow/SD1.5_text2image_API.json)

### 与普通工作流 JSON 的区别

普通的 JSON 包含了“便于在 UI 中编辑和分享的信息”。
API 的 工作流 则是去除了这些多余信息，变成了方便服务器接收并执行的形式。

---

## 首先让它跑起来

### Python 环境准备

创建虚拟环境，并安装用于 HTTP 通信的 `requests`。

```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS / Linux:
# source venv/bin/activate

pip install requests
```

### run_min.py

这是读取 `SD1.5_text2image_API.json` 并投递给 `/prompt` 的最小代码。
这与在节点 UI 中按下 `▷Run` 基本相同。

```python
import json
import requests

BASE = "http://127.0.0.1:8188"

prompt = json.load(open("SD1.5_text2image_API.json", encoding="utf-8"))

res = requests.post(f"{BASE}/prompt", json={"prompt": prompt}).json()
print(res)  # {"prompt_id": "...", "number": ..., "node_errors": {...}}
```

文件放置

```text
your_project/
  ├── run_min.py
  └── SD1.5_text2image_API.json
```


### 执行

在终端执行 `run_min.py`。

```powershell
cd path\to\your_project
venv\Scripts\activate
python run_min.py
```

让我们确认一下是否执行成功。

- Python 侧返回 `{"prompt_id": "...", ...}` （这就是执行 ID。）
- ComfyUI 侧的终端显示执行日志
- `ComfyUI/output/` 中增加了图像文件
  * 应该保存在与节点 UI 执行时相同的位置

如果到这里都能成功，说明已经可以通过 API 执行了。

---

## 从 CLI 更改提示词

即使直接编辑 API 用的 JSON，当然也可以更改参数。
但是，如果想在不弄脏原文件的情况下连续执行，**用 Python 进行替换** 会更容易处理。

### 要重写哪里（以本次的 JSON 为例）

这次我们只更改“提示词”。

- Positive prompt：节点 `6` 的 `inputs.text` 

### 注：节点 ID 不是固定的

本页面的示例使用了 `6`，但这 **仅仅是因为在这个分发的 JSON 中是这样**。
如果是用自己的 工作流，最稳妥的方法是打开 JSON 寻找。

e.g. `SD1.5_text2image_API.json`
```json
  "6": { //这就是 ID
    "inputs": {
      "text": "beautiful scenery nature glass bottle landscape, , purple galaxy bottle,",
      "clip": [
        "4",
        1
      ]
    },
    "class_type": "CLIPTextEncode",
    "_meta": {
      "title": "CLIP Text Encode (Prompt)"
    }
  },
```

### `run.py`（输入提示词）

```python
import json
import requests

BASE = "http://127.0.0.1:8188"
prompt = json.load(open("SD1.5_text2image_API.json", encoding="utf-8"))

pos = input("positive prompt: ").strip()

# 基于本页面的分发 JSON：6=positive
if pos:
    prompt["6"]["inputs"]["text"] = pos

res = requests.post(f"{BASE}/prompt", json={"prompt": prompt}).json()
print(res)
print("done (check ComfyUI/output)")
```

### 执行

与刚才一样执行。

```powershell
cd path\to\your_project
venv\Scripts\activate
python run.py
```

这次中途会要求输入参数。

```bash
positive prompt: 输入喜欢的提示词
```

如果该提示词生成的图像保存在了 `ComfyUI/output/` 中，那就 OK 了。

---

## 掌握了感觉后，剩下的就只是制作了

这次只使用了“执行”的 API，但 API 还有很多其他功能。

- 实时接收进度（WebSocket）
- 队列控制（停止、中断等）
- 图像上传（传递给 i2i 的输入）
- 获取节点的输入规格（自动化 工作流 编辑的立足点）

在这个页面，只要掌握了“能从外部执行 工作流”的感觉就足够了。

剩下的不管是 vibe coding 还是什么，请试着实际制作你想要的东西吧！
