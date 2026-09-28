---
layout: page.njk
lang: en
section: basic-workflows
slug: z-image
navId: z-image
title: "Z-Image"
created: 2026-01-31
updated: 2026-03-02
summary: "Image generation with Z-Image"
seoTitle: "Z-Image in ComfyUI: Base Model and ControlNet"
seoDescription: "Use the Z-Image base model from Alibaba / Tongyi-MAI in ComfyUI: text2image, refining with Z-Image-Turbo, and Fun ControlNet Union 2.1."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/z-image/legacy_gyazo_39cddc1debeff5423090f2fe87e5b038.png"
tags: []
---

## What is Z-Image?

Z-Image is a **family of image generation models** by Alibaba / Tongyi-MAI.

![](/media/basic-workflows/z-image/z_family.png){media=image}

The name Z-Image refers to the entire model family, which can be confusing, but this page covers **Z-Image** as the base model (sometimes referred to as Z-Image-Base to distinguish it).

Z-Image has straightforward characteristics as a base model (source for fine-tuning).

Unlike [Z-Image-Turbo](/en/basic-workflows/z-image-turbo/) which is stabilized by distillation and reinforcement learning, Z-Image directly reflects differences in seeds and initial noise in its output. While this offers high creativity and variation, it is also a difficult model where results can vary significantly and parameters are sensitive.

---

## Model Download

- diffusion_models
  - [z_image_bf16.safetensors](https://huggingface.co/Comfy-Org/z_image/blob/main/split_files/diffusion_models/z_image_bf16.safetensors) (12.3 GB)
- text_encoders
  - [qwen_3_4b.safetensors](https://huggingface.co/Comfy-Org/z_image/blob/main/split_files/text_encoders/qwen_3_4b.safetensors) (8.04 GB)
- vae
  - [ae.safetensors](https://huggingface.co/Comfy-Org/z_image/blob/main/split_files/vae/ae.safetensors) (335 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── z_image_bf16.safetensors
    ├── 📂text_encoders/
    │   └── qwen_3_4b.safetensors
    └── 📂vae/
        └── ae.safetensors
```

---

## text2image

![](/media/basic-workflows/z-image/legacy_gyazo_8f4213b84c8d739021b8be032e8f6f8a.png){media=image}

[](/workflows/basic-workflows/z-image/z_image.json)

- `steps` : Depending on the sampler, 30-40 steps (slightly higher) is more stable.

## Refine with Z-Image-Turbo

This method uses Z-Image-Turbo to refine the generation results of Z-Image in a few steps.
It aims to combine the creativity of Z-Image with the stability of Z-Image-Turbo.

You can use image2image, but let's try splitting the sampling into two stages for a smarter approach.

![](/media/basic-workflows/z-image/legacy_gyazo_2545e8ea917a80488d8687464185410d.png){media=image}

[](/workflows/basic-workflows/z-image/z_image_refine_turbo.json)

Here we split it into the first 50% and the last 50%.
(cf. [Split Sampling](/en/basic-workflows/ksampler-advanced/#split-sampling))

- 🟪 Z-Image : 15 steps out of 30 steps
- 🟨 Z-Image-Turbo : 4 steps out of 8 steps

**Comparison**

![Z-Image only](/media/basic-workflows/z-image/legacy_gyazo_73afc01007482bdfbcc0b0d33f75cb98.png){media=image} ![Z-Image + Turbo](/media/basic-workflows/z-image/legacy_gyazo_0c1ece70589a7b42801f37383a604440.png){media=image}



## Z-Image-Fun-Controlnet-Union-2.1

A ControlNet-like patch for Z-Image.

### Model Download

- model_patches

  - [Z-Image-Fun-Controlnet-Union-2.1.safetensors](https://huggingface.co/alibaba-pai/Z-Image-Fun-Controlnet-Union-2.1/blob/main/Z-Image-Fun-Controlnet-Union-2.1.safetensors) (6.71 GB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂model_patches/
        └── Z-Image-Fun-Controlnet-Union-2.1.safetensors
```

### workflow

![](/media/basic-workflows/z-image/z_image_fun_controlnet_union_2_1.png){media=image}

[](/workflows/basic-workflows/z-image/z_image_fun_controlnet_union_2_1.json)

- 🟩 Add model and control image to `QwenImageDiffsynthControlnet`.
- 🟩 In this workflow, Depth Anything V2 is used to create a depth map.


## Reference

- [Comfy.Org blog](https://blog.comfy.org/p/z-image-day-0-support-in-comfyui?utm_campaign=post-expanded-share&utm_medium=web&triedRedirect=true)
- [A different way of combining Z-Image and Z-Image-Turbo](https://www.reddit.com/r/StableDiffusion/comments/1qqzlv8/a_different_way_of_combining_zimage_and/)
