---
layout: page.njk
lang: en
section: data-utilities
slug: api-run-workflow
navId: api-run-workflow
title: "Running a Workflow via API"
created: 2026-02-05
updated: 2026-03-02
summary: "The minimum steps: request a run -> confirm it finished -> get the output"
seoTitle: "Run a ComfyUI Workflow via the API with Python"
seoDescription: "Run a ComfyUI workflow from outside: POST API-format JSON to /prompt with a minimal Python script, then change the prompt from the command line."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## What We're Basically Doing

Let's run a ComfyUI workflow "from the outside" through the API.

It's simple: just **POST API-formatted JSON (= prompt) to `http://127.0.0.1:8188/prompt`**.

The ComfyUI server then takes this as an order to "run this workflow," adds it to the queue, runs it, and returns a `prompt_id` (execution ID).

> [!NOTE]
> It's a bit confusing, but the "prompt" here isn't the text prompt. It means the **entire workflow (execution graph)**.
> The text is just one part of it, such as `inputs.text` in `CLIPTextEncode`.

This time, let's run it from Python.

--- 

## Start ComfyUI

The API is not a way to "skip starting ComfyUI."
Python sends its commands to a ComfyUI server that is already running.

- Start ComfyUI
- Make sure you can open `http://127.0.0.1:8188` in your browser

---

## Prepare Workflow for API

### Workflow to Use (SD1.5 text2image)

To start, we'll use the simplest workflow there is: Stable Diffusion 1.5 text2image.

![](/media/basic-workflows/sd15-text2image/legacy_gyazo_897f66c308b3b98440f641ee3d33d50e.png){media=image}

[](/workflows/basic-workflows/sd15-text2image/sd1_5_text2image_vae_ft_mse_840000.json)

**Model Download**
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

### Get Workflow for API

- 1. Open the workflow above in the ComfyUI node UI
- 2. Select `File` -> **Export (API)** from the menu
- 3. Save with a recognizable name (e.g. `SD1.5_text2image_API.json`)

**Sample**

[](/workflows/data-utilities/api-run-workflow/sd1_5_text2image_api.json)

### Difference from Normal Workflow JSON

A regular workflow JSON also contains "information that makes it easy to edit and share in the UI."  
An API workflow strips out that extra information, leaving a form that's convenient to hand to the server to run.

---

## Run It First

### Python Environment Preparation

Create a virtual environment and install `requests` for HTTP communication.

```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS / Linux:
# source venv/bin/activate

pip install requests
```

### run_min.py

This is the minimal code: it just reads `SD1.5_text2image_API.json` and sends it to `/prompt`.
It's basically the same as pressing `▷Run` in the node UI.

```python
import json
import requests

BASE = "http://127.0.0.1:8188"

prompt = json.load(open("SD1.5_text2image_API.json", encoding="utf-8"))

res = requests.post(f"{BASE}/prompt", json={"prompt": prompt}).json()
print(res)  # {"prompt_id": "...", "number": ..., "node_errors": {...}}
```

File Placement

```text
your_project/
  ├── run_min.py
  └── SD1.5_text2image_API.json
```


### Execute

Run `run_min.py` in the terminal.

```powershell
cd path\to\your_project
venv\Scripts\activate
python run_min.py
```

Let's check whether it worked.

- Python prints `{"prompt_id": "...", ...}` (this is the execution ID)
- Execution logs appear in ComfyUI's terminal
- A new image file appears in `ComfyUI/output/`
  - It should be saved in the same place as when you run from the node UI

If you've gotten this far, you're running workflows through the API.

---

## Change Prompt from CLI

Of course, you can change parameters by editing the API JSON directly.  
But if you want to run it repeatedly without touching the original file, it's easier to **swap the values in Python**.

### What to Rewrite (for This JSON)

This time, we'll change "only the prompt."

- Positive prompt: `inputs.text` of node `6`

### Note: Node ID is Not Fixed

The examples on this page use `6`, but **that's only how it happens to be in this sample JSON**.
For your own workflow, the surest way is to open the JSON and look for the following.

e.g. `SD1.5_text2image_API.json`
```json
  "6": { //This is ID
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

### `run.py` (Prompt Input)

```python
import json
import requests

BASE = "http://127.0.0.1:8188"
prompt = json.load(open("SD1.5_text2image_API.json", encoding="utf-8"))

pos = input("positive prompt: ").strip()

# Premise of distributed JSON on this page: 6=positive
if pos:
    prompt["6"]["inputs"]["text"] = pos

res = requests.post(f"{BASE}/prompt", json={"prompt": prompt}).json()
print(res)
print("done (check ComfyUI/output)")
```

### Execute

Run in the same way as before.

```powershell
cd path\to\your_project
venv\Scripts\activate
python run.py
```

This time, it will ask you to type in a parameter partway through.

```bash
positive prompt: Enter your favorite prompt
```

If an image made with that prompt is saved to `ComfyUI/output/`, you're done.

---

## Once You Get the Feel, Just Build It

This time we only used the API for "running" workflows, but the API can do plenty more.

- Receive progress in real time (WebSocket)
- Control queue (stop, interrupt, etc.)
- Image upload (pass to i2i input)
- Get node input specs (a first step toward automating workflow editing)

For this page, it's enough to get a feel for how "you can run workflows from outside."

From here, vibe coding or whatever works for you, go build what you actually want!
