---
layout: page.njk
lang: en
section: begin-with
slug: first-run
navId: first-run
title: "First Run"
created: 2025-11-24
updated: 2026-03-02
summary: "Launching ComfyUI and generating your first image"
seoTitle: "ComfyUI First Run: Generate Your First Image"
seoDescription: "Start ComfyUI and generate your first image from an official template, on portable, desktop, or manual installs, and fix a missing model."
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

Never mind the details for now. Let's just generate an image.

## Launching

### **Portable Version**
- Double-click `run_nvidia_gpu.bat` in the folder where you installed it.
### **Desktop Version**
- Launch it from the desktop shortcut or the Start menu.
### **Manual Installation**
- Run the following commands:
  ```powershell
  cd path\to\comfyui
  venv\Scripts\activate
  python main.py
  ```

After a short wait, ComfyUI opens in your browser.
* If the screen does not open, try entering `http://127.0.0.1:8188` in the browser's address bar.

---

## Select Workflow from Template

![](/media/begin-with/first-run/legacy_gyazo_7ffdc91e29dc41127e4101360ceff732.png){media=image}

- Right after your very first launch, the template screen will probably be open. (If it isn't, select `Templates` in the left sidebar.)
- First, select `Getting Started` -> `Image Generation`.
- A `Missing Models` error will appear.
  - It means you don't have the models this workflow needs, but ignore it for now and press `✕` to close it.

---

## Downloading the Model

This workflow is for running a model called **Stable Diffusion 1.5**.
Compared to today's latest models its performance is modest... or honestly, it's not really usable, but the fundamental mechanism hasn't changed.

Let's learn the basics of image generation with this model, which you could call the ancestor of image generation AI.

- 1.  **Download the model**
  - [v1-5-pruned-emaonly-fp16.safetensors (Direct Link)](https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive/resolve/main/v1-5-pruned-emaonly-fp16.safetensors)
  - Clicking the link above will start the download.
  - Save it in the following folder:
  ```text
  📂ComfyUI/
    └── 📂models/
        └── 📂checkpoints/
            └── v1-5-pruned-emaonly-fp16.safetensors
  ```

- 2.  **Refresh**
  - Just placing the model is not enough for ComfyUI to recognize it.
  - Press the `r` key, or click `ComfyUI Icon` -> `Edit` -> `Refresh Node Definitions`, and it will be picked up.

---

## Let's Generate

![](/media/begin-with/first-run/legacy_gyazo_57af4e96b7f6b2280aeed28afe3bb121.mp4){media=loop}

- Press the **`▷ Run`** button at the top of the screen to start generation.
- If an image shows up in the `Save Image` node, it worked.
- As the name suggests, the `Save Image` node saves the image it receives. Generated images are saved in this folder:
```text
📂ComfyUI/
  └── 📂output/
      ├── SD1.5_00001_.png
      ...
```

Play around by changing the prompt (the text in the `CLIP Text Encode` node) or the `seed` number.

---

## Common Problems

### Model not found (Load Checkpoint is red)
- **Symptom**
  - The `Load Checkpoint` node is outlined in red and an error appears.
  - `Value not in list: ckpt_name: 'v1-5-pruned.ckpt' not in []`
- **Cause**
  - The specified model file is not in the `models/checkpoints/` folder.
  - The file has been renamed.
- **Solution**
  - Check that the file is in the right folder (`models/checkpoints`).
  - Renaming the file is fine, but if you do, select the model again.
