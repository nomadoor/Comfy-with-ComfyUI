---
layout: page.njk
lang: en
slug: downloading-and-placing-models
navId: downloading-and-placing-models
title: "Downloading and Placing Models"
summary: "About downloading and placing models"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## Where Models are Distributed

Basically, there are two places where models (sometimes called weights) are distributed. If you learn how to use these two, you will not be in trouble.

### [Huggingface](https://huggingface.co/models)
- It is like GitHub in generative AI, and researchers mainly publish models.

### [Civitai](https://civitai.com/)
- It is one of the oldest and most popular places for the community to share fine-tuned models.
- Huggingface has various types of models other than image generation models, but since Civitai is a site for image generation models, there are functions that make it easy to find models such as filter functions. (Although it is a bit too cluttered...)
- Also, there are quite a few NSFW models. That is a strength as well as a big weakness, and recently regulations are becoming stricter from various directions.

---

## Downloading from HuggingFace

Let's download Stable Diffusion 1.5.

![](https://gyazo.com/b274b58909cf22061a2506ab7b43bf61){gyazo=loop}

- 1.  First, open the [Comfy-Org/stable-diffusion-v1-5-archive](https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive) page.
- 2.  Click the `Files and versions` tab and find the target model file (e.g. `.safetensors` or `.ckpt`) from the file list.
- 3.  There are 3 ways to download.
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

Let's download epiCRealism, which took the world by storm as a fine-tuning model of Stable Diffusion 1.5.

![](https://i.gyazo.com/7bcde1665657f544a1191c760248dd80.png){gyazo=image}

- 1.  First, open the [epiCRealism](https://civitai.com/models/25694/epicrealism) page.
- 2.  Click the blue **Download** button on the right side of the screen.
- 3.  Download starts.

* Some models (such as NSFW) cannot be downloaded unless you log in.

---

## Where to Place Models

The place to put the downloaded model file is determined by the type.

It may be difficult if you don't understand the mechanism of image generation, but rest assured that this site lists all model download links and their placement locations. Let's get the hang of it little by little.

```text
📂ComfyUI
└── 📂models
    ├── 📂checkpoints       # ckpt models
    ├── 📂loras             # LoRA
    ├── 📂vae               # VAE
    ...
```

Even if you put the model in the folder after starting ComfyUI, ComfyUI will not recognize it.

After placing the file, press the `r` key on the keyboard, or press `ComfyUI Icon` -> `Edit` -> `Refresh Node Definitions` to load it into ComfyUI.

---

## Model Organization Techniques

As the number of models increases, problems such as "What was the base model of this?" and "Where did that model go?" will arise.
Let's organize by dividing into folders.

### Folder Division

As long as it is inside an appropriate folder (such as `checkpoints` or `loras`), you can create subfolders to organize them without any problem.
ComfyUI automatically recognizes models in subfolders as well.

For example, if you organize the `checkpoints` folder as follows:

```text
📂models/checkpoints/
├── 📂SD1.5
│   └── v1-5-pruned.ckpt
├── 📂SDXL
│   └── sd_xl_base_1.0.safetensors
```

In ComfyUI's `Load Checkpoint` node etc., the file name will be displayed with the folder name, such as `SD1.5\v1-5-pruned.ckpt`.
This makes it easier to classify and manage by model type and usage.

### Even More Convenient with Custom Nodes

If you install a custom node called **[rgthree-comfy](https://github.com/rgthree/rgthree-comfy)**,
it will display the folder structure hierarchically on the menu.

- `ComfyUI Icon` -> `⚙Settings` -> `rgthree-comfy settings` -> `Auto Nest Subdirectories in Menus ✅️`

  ![](https://i.gyazo.com/dccf958c1d05e68e94bcb6bdd680e43c.png){gyazo=image}
