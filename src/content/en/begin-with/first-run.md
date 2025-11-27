---
layout: page.njk
lang: en
slug: first-run
navId: first-run
title: "First Run"
summary: "About first run"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

Leaving the details aside, let's generate an image for now.

## Startup

### **Portable Version**
- Double-click `run_nvidia_gpu.bat` in the installed folder.
### **Desktop Version**
- Start from the desktop shortcut or Start menu.
### **Manual Installation**
- Execute the following commands:
  ```powershell
  cd path\to\comfyui
  venv\Scripts\activate
  python main.py
  ```

After a while, the ComfyUI screen will open in your browser.
* If the screen does not open, try entering `http://127.0.0.1:8188` in the browser's address bar.

---

## Select Workflow from Template

![](https://i.gyazo.com/7ffdc91e29dc41127e4101360ceff732.png){gyazo=image}

- Immediately after the very first startup, the template screen is probably open. (If not, select `Templates` on the left sidebar.)
- First, select `Getting Started` -> `Image Generation`.
- An error `Missing Models` will be displayed.
  - This indicates that the model for running the workflow is missing, but ignore it for now and press `✕` to close it.

---

## Downloading the Model

This workflow is for running a model called **Stable Diffusion 1.5**.
Compared to current latest models, its performance is modest... or rather, honestly, it's not very useful, but the fundamental mechanism hasn't changed.

Let's learn basic image generation with this model, which can be said to be the ancestor of image generation AI.

- 1.  **Download Model**
  - [v1-5-pruned-emaonly-fp16.safetensors (Direct Link)](https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive/resolve/main/v1-5-pruned-emaonly-fp16.safetensors)
  - Clicking the link above will start the download.
  - Save this in the following folder:
  ```text
  📂ComfyUI/
    └── 📂models/
        └── 📂checkpoints/
            └── v1-5-pruned-emaonly-fp16.safetensors
  ```

- 2.  **Refresh**
  - Just placing the model is not enough for ComfyUI to recognize it.
  - Press the `r` key on your keyboard, or press `ComfyUI Icon` -> `Edit` -> `Refresh Node Definitions` to recognize it.

---

## Let's Generate

![](https://gyazo.com/57af4e96b7f6b2280aeed28afe3bb121){gyazo=loop}

- Press the **`▷ Run`** button at the top of the screen to start generation.
- If an image is displayed in the `Save Image` node, it is successful.
- The `Save Image` node is, as the name suggests, a node that saves the input image. The generated image is saved in the following folder:
```text
📂ComfyUI/
  └── 📂output/
      ├── SD1.5_00001_.png
      ...
```

Try changing the prompt (text in the `CLIP Text Encode` node) or changing the `seed` number to play around.

---

## Common Troubles

### Model not found (Load Checkpoint is red)
- **Symptom**
  - The `Load Checkpoint` node is surrounded by red and an error is displayed.
  - `Value not in list: ckpt_name: 'v1-5-pruned.ckpt' not in []`
- **Cause**
  - The specified model file is not in the `models/checkpoints/` folder.
  - The file name has been changed.
- **Solution**
  - Check if the folder location is correct (`models/checkpoints`).
  - There is no problem if the file name changes, but in that case, please re-select the model.
