---
layout: page.njk
lang: en
section: basic-workflows
slug: idol
navId: idol
title: "Idol"
created: 2026-11-13
summary: "Turn a single image into a 3D Gaussian Splat"
seoTitle: "Idol in ComfyUI: 3D Gaussian Splat from a Single Image"
seoDescription: "Use Idol in ComfyUI to make a 3D Gaussian Splat (3DGS) from one image. It shares TripoSplat's architecture, so it runs on the built-in TripoSplat nodes."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/idol/idol_hero.mp4"
tags: []
---

## What is Idol?

[Idol](https://huggingface.co/speridlabs/idol) is a model released by speridlabs that generates a 3D Gaussian Splat (3DGS) from a single image.

Idol has the same architecture as TripoSplat, so in ComfyUI it runs on the TripoSplat nodes.

---

## Downloading the models

- background_removal
  - [birefnet.safetensors](https://huggingface.co/Comfy-Org/BiRefNet/blob/main/background_removal/birefnet.safetensors) (444 MB)
- diffusion_models
  - [idol_fp16.safetensors](https://huggingface.co/Comfy-Org/Idol/blob/main/diffusion_models/idol_fp16.safetensors) (741 MB)
- clip_vision
  - [dino_v3_vit_h_bf16.safetensors](https://huggingface.co/Comfy-Org/Idol/blob/main/clip_vision/dino_v3_vit_h_bf16.safetensors) (1.68 GB)
- vae
  - [flux2-vae.safetensors](https://huggingface.co/Comfy-Org/Idol/blob/main/vae/flux2-vae.safetensors) (336 MB)
  - [idol_decoder_fp16.safetensors](https://huggingface.co/Comfy-Org/Idol/blob/main/vae/idol_decoder_fp16.safetensors) (576 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂background_removal/
    │   └── birefnet.safetensors
    ├── 📂clip_vision/
    │   └── dino_v3_vit_h_bf16.safetensors
    ├── 📂diffusion_models/
    │   └── idol_fp16.safetensors
    └── 📂vae/
        ├── flux2-vae.safetensors
        └── idol_decoder_fp16.safetensors
```

---

## image to 3DGS

![](/media/basic-workflows/idol/idol_image2gaussian_splat.png){media=image}

[](/workflows/basic-workflows/idol/idol_image2gaussian_splat.json)

- `Remove Background`
  - Removes the background with BiRefNet.
- `TripoSplat Preprocess Image`
  - Places the subject cut out by the mask in the center of a square with a black background.
- `TripoSplat Decode`
  - `num_gaussians` is the number of Gaussians to generate.
  - Going above 262144 only makes it denser; it does not add detail.
- `Create 3D File (from Splat)` → `Save 3D Model`
  - Saves the splat as `.ply`, and you can check it right away in the 3D view.

{% outputs %}
![](/media/basic-workflows/idol/idol_turntable.mp4){media=loop}
{% endoutputs %}
