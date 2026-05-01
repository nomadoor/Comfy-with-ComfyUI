---
layout: page.njk
lang: en
section: data-utilities
slug: api-run-workflow
navId: api-run-workflow
title: "Running a Workflow via API"
summary: "Minimum steps: Request execution -> Check completion -> Get output"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## What We're Basically Doing

Let's try executing a ComfyUI workflow "from the outside" via the API.

It's simple: just **POST API-formatted JSON (= prompt) to `http://127.0.0.1:8188/prompt`**.

With this, the ComfyUI server receives the command "execute this workflow", queues it, executes it, and returns a `prompt_id` (execution ID).

> It's a bit confusing, but the "prompt" here refers to the **entire workflow (execution graph)**, not just the text prompt.
> Text is just a part of it, for example, `inputs.text` of `CLIPTextEncode` falls under this.

This time, let's try executing it from Python.

--- 

## Start ComfyUI

The API is not a mechanism that "eliminates the need to start ComfyUI".
Python sends commands to the running ComfyUI server.

- Start ComfyUI
- Ensure `http://127.0.0.1:8188` can be opened in your browser

---

## Prepare Workflow for API

### Workflow to Use (SD1.5 text2image)

For now, we will use the simplest Stable Diffusion 1.5 text2image.

![](https://gyazo.com/897f66c308b3b98440f641ee3d33d50e){gyazo=image}

[](/workflows/basic-workflows/sd15-text2image/SD1.5_text2image_vae-ft-mse-840000.json)

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

- 1. Open the workflow above in ComfyUI Node UI
- 2. Select `File` -> **Export (API)** from the menu
- 3. Save with a recognizable name (e.g. `SD1.5_text2image_API.json`)

**Sample**

[](/workflows/data-utilities/api-run-workflow/SD1.5_text2image_API.json)

### Difference from Normal Workflow JSON

Normal JSON contains "information easy to edit/share in UI".  
API workflow strips away such extra information and is in a convenient form to pass to the server for execution.

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

This is minimal code that just reads `SD1.5_text2image_API.json` and throws it to `/prompt`.
It is basically the same as pressing `▷Run` in the node UI.

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

Let's check if it ran successfully.

- `{"prompt_id": "...", ...}` returns on the Python side (This is the execution ID.)
- Execution logs appear in the ComfyUI terminal
- Image file increases in `ComfyUI/output/`
  - It should be saved in the same location as when executing with the node UI

If you can do this far, you are executing via API.

---

## Change Prompt from CLI

Of course, you can change parameters by directly editing the JSON for API.  
However, if you want to execute continuously without polluting the original file, it is easier to handle by **replacing with Python**.

### What to Rewrite (In Case of This JSON)

This time, we will only change the "prompt".

- Positive prompt: `inputs.text` of node `6`

### Note: Node ID is Not Fixed

In the example on this page, `6` is used, but this is **only because it is so in this distributed JSON**.
When doing it with your own workflow, it is surest to open the JSON and look for it.

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

This time, input of parameters is required during the process.

```bash
positive prompt: Enter your favorite prompt
```

If the image is saved in `ComfyUI/output/` with that prompt, it is OK.

---

## Once You Get the Feel, Just Build It

Although we only used API to "execute" this time, there are various other things in the API.

- Receive progress in real time (WebSocket)
- Control queue (stop, interrupt, etc.)
- Image upload (pass to i2i input)
- Get node input specifications (foothold to automate workflow editing)

On this page, it is enough if you just get the atmosphere that "you can execute workflow from outside".

Now, feel free to build whatever you want, whether it's vibe coding or anything else!
