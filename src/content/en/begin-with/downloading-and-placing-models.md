---
layout: page.njk
lang: en
section: begin-with
slug: downloading-and-placing-models
navId: downloading-and-placing-models
title: "Downloading and Placing Models"
created: 2025-11-24
updated: 2026-03-02
summary: "About downloading and placing models"
seoTitle: "Where to Download and Put Models in ComfyUI"
seoDescription: "Download models from Hugging Face and Civitai, learn which ComfyUI models folder each type goes in, and keep a growing collection organized."
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## Where Models are Distributed

Models (sometimes also called weights) are basically distributed in these two places. Once you know how to use both, you'll be fine.

### [Huggingface](https://huggingface.co/models)
- It's something like the GitHub of generative AI, where mostly researchers publish their models.

### [Civitai](https://civitai.com/)
- It's one of the oldest and most popular places for the community to share fine-tuned models.
- Huggingface hosts all kinds of models beyond image generation, but Civitai is a site for image generation models, so it has features like filters that make models easier to find. (It's a bit too cluttered, though...)
- It also has a lot of NSFW models. That's both a strength and a big weakness, and lately pressure on it has been tightening from many directions.

---

## Downloading from HuggingFace

Let's download Stable Diffusion 1.5.

![](/media/begin-with/downloading-and-placing-models/legacy_gyazo_b274b58909cf22061a2506ab7b43bf61.mp4){media=loop}

- 1.  First, open the [Comfy-Org/stable-diffusion-v1-5-archive](https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive) page.
- 2.  Click the `Files and versions` tab and find the model file you want (e.g. `.safetensors` or `.ckpt`) in the file list.
- 3.  There are 3 ways to download it.
    * **Direct Download:**
        - Click **↓ (Download Icon)** next to the file name.
    * **Download from Detail Page:**
        - Click the file name to open the detail page, and click the `↓ download` button displayed there.
    * **Use Direct Link:**
        - Click `Copy download link` on the file detail page to copy the download URL.
        - You can use this URL with `wget` etc.
            ```bash
            wget https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive/resolve/main/v1-5-pruned-emaonly.safetensors
            ```


---

## Downloading from Civitai

Let's download epiCRealism, a fine-tuned Stable Diffusion 1.5 model that was hugely popular in its day.

![](/media/begin-with/downloading-and-placing-models/legacy_gyazo_7bcde1665657f544a1191c760248dd80.png){media=image}

- 1.  First, open the [epiCRealism](https://civitai.com/models/25694/epicrealism) page.
- 2.  Click the blue **Download** button on the right side of the screen.
- 3.  The download starts.

* Some models (such as NSFW) cannot be downloaded unless you log in.

---

## Where to Place Models

Where a downloaded model file goes depends on its type.

This can be pretty hard until you understand how image generation works, but don't worry: this site lists the download link and the folder for every model. You'll get a feel for it bit by bit.

```text
📂ComfyUI
└── 📂models
    ├── 📂checkpoints       # ckpt models
    ├── 📂loras             # LoRA
    ├── 📂vae               # VAE
    ...
```

If you add a model to the folder after ComfyUI has started, ComfyUI won't pick it up.

After placing the file, press the `r` key, or click `ComfyUI Icon` -> `Edit` -> `Refresh Node Definitions`, and ComfyUI will load it.

---

## Model Organization Techniques

As your models pile up, you start running into questions like "What base model was this one for?" and "Where did that model go?"
Keep things tidy by sorting them into folders.

### Using Folders

As long as you stay inside the right folder (such as `checkpoints` or `loras`), you can freely create subfolders to organize them.
ComfyUI automatically recognizes models in subfolders as well.

For example, if you organize the `checkpoints` folder as follows:

```text
📂models/checkpoints/
├── 📂SD1.5
│   └── v1-5-pruned.ckpt
├── 📂SDXL
│   └── sd_xl_base_1.0.safetensors
```

Nodes like ComfyUI's `Load Checkpoint` will then show the file name with its folder, such as `SD1.5\v1-5-pruned.ckpt`.
This makes it easier to sort and manage models by type and purpose.

### Even More Convenient with Custom Nodes

If you install a custom node called **[rgthree-comfy](https://github.com/rgthree/rgthree-comfy)**,
it shows your folder structure as nested menus.

- `ComfyUI Icon` -> `⚙Settings` -> `rgthree-comfy settings` -> `Auto Nest Subdirectories in Menus ✅️`

  ![](/media/begin-with/downloading-and-placing-models/legacy_gyazo_dccf958c1d05e68e94bcb6bdd680e43c.png){media=image}
