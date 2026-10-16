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

Since the name Z-Image itself refers to the whole model family, it's a little confusing, but this page covers **Z-Image** as the base model the others are derived from (sometimes called Z-Image-Base to tell them apart).

As a base model (the starting point for fine-tuning), Z-Image behaves in a plain, unbiased way.

It doesn't have the stabilizing distillation and reinforcement learning that [Z-Image-Turbo](/en/basic-workflows/z-image-turbo/) has, so differences in seed and initial noise show up readily in the output. That gives it more creativity and variety, but it's also a tricky model: it's sensitive to parameters and results can swing a lot.

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

- `steps` : It depends on the sampler, but a slightly higher count, around 30-40, is more stable.

## Refine with Z-Image-Turbo

This refines Z-Image's output with Z-Image-Turbo in a few steps.
The goal is to get both Z-Image's creativity and Z-Image-Turbo's consistent quality.

You could just do image2image, but here let's be a little fancy and split the sampling into two stages.

![](/media/basic-workflows/z-image/legacy_gyazo_2545e8ea917a80488d8687464185410d.png){media=image}

[](/workflows/basic-workflows/z-image/z_image_refine_turbo.json)

Here we split it into the first 50% and the last 50%.
(cf. [Split Sampling](/en/basic-workflows/ksampler-advanced/#split-sampling))

- 🟪 Z-Image : 15 steps out of 30 steps
- 🟨 Z-Image-Turbo : 4 steps out of 8 steps

{% outputs %}
![Z-Image only](/media/basic-workflows/z-image/legacy_gyazo_73afc01007482bdfbcc0b0d33f75cb98.png){media=image} ![Z-Image + Turbo](/media/basic-workflows/z-image/legacy_gyazo_0c1ece70589a7b42801f37383a604440.png){media=image}
{% endoutputs %}



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

- 🟩 Add the model and control image to `QwenImageDiffsynthControlnet`.
- 🟩 In this workflow, Depth Anything V2 is used to create a depth map.


## Reference

- [Comfy.Org blog](https://blog.comfy.org/p/z-image-day-0-support-in-comfyui?utm_campaign=post-expanded-share&utm_medium=web&triedRedirect=true)
- [A different way of combining Z-Image and Z-Image-Turbo](https://www.reddit.com/r/StableDiffusion/comments/1qqzlv8/a_different_way_of_combining_zimage_and/)
