---
layout: page.njk
lang: en
section: basic-workflows
slug: krea-2
navId: krea-2
title: "Krea 2"
created: 2026-06-24
updated: 2026-06-24
summary: "Image generation with Krea 2 Turbo"
seoTitle: "Krea 2 in ComfyUI: Beautiful, Natural-Looking Images"
seoDescription: "Use Krea 2 Open-Source (Turbo) in ComfyUI for images that do not look AI-made: model download, text2image, and the official style LoRAs."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/krea-2/legacy_gyazo_6ce8c9a2f7042a08efbbcdefc8ab6673.png"
tags: []
---

## What is Krea 2?

[Krea 2 Open-Source](https://www.krea.ai/krea-2-open-source) is an open-weight image generation model from Krea.

Just like [FLUX.1 Krea](https://www.krea.ai/blog/flux-krea-open-source-release), which Krea made earlier, there's nothing special about the architecture. What sets it apart is the care that went into it: the dataset was carefully built so the model can generate beautiful images that don't look AI-made.

Two models have been released, but for regular image generation you'll use Turbo.

- **Krea 2 Raw**
  - An undistilled base model. Mainly intended for LoRA training and fine-tuning.
- **Krea 2 Turbo**  
  - A distilled model that can generate in 8 steps.

> [!NOTE]
> Krea's web / API versions also include **Krea 2 Medium** and **Krea 2 Large**, but only **Raw** and **Turbo** have been released as open weights.

{% runpod %}

---

## Model Download

- diffusion_models
  - [krea2_turbo_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Krea-2/blob/main/diffusion_models/krea2_turbo_fp8_scaled.safetensors) (13.1 GB)
- text_encoders
  - [qwen3vl_4b_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Krea-2/blob/main/text_encoders/qwen3vl_4b_fp8_scaled.safetensors) (5.24 GB)
- vae
  - [qwen_image_vae.safetensors](https://huggingface.co/Comfy-Org/Krea-2/blob/main/vae/qwen_image_vae.safetensors) (254 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── krea2_turbo_fp8_scaled.safetensors
    ├── 📂text_encoders/
    │   └── qwen3vl_4b_fp8_scaled.safetensors
    └── 📂vae/
        └── qwen_image_vae.safetensors
```

---

## text2image

![](/media/basic-workflows/krea-2/krea_2_turbo_text2image.png){media=image}

[](/workflows/basic-workflows/krea-2/krea_2_turbo_text2image.json)

Krea 2 Turbo is built for 8-step generation.

- `steps` : 8
- `cfg` : 1.0
- Recommended resolution : 1K to 2K

---

## Official Style LoRAs

One of Krea 2's big selling points is style control through features like Style references and Moodboards, but for now those haven't been released as open source.

Instead, Krea has released several official style LoRAs, so let's try those.

- [Krea 2 LoRAs](https://huggingface.co/collections/krea/krea-2-loras)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        └── *.safetensors
```

Each LoRA has its own recommended trigger word and strength, so check the model card for the one you use.

### text2image (with LoRA)

![](/media/basic-workflows/krea-2/krea_2_turbo_text2image_darkbrush.png){media=image}

[](/workflows/basic-workflows/krea-2/krea_2_turbo_text2image_darkbrush.json)

- This example uses [Krea-2-LoRA-darkbrush](https://huggingface.co/krea/Krea-2-LoRA-darkbrush).
- The trigger word is `monochrome ink wash style`.

I'm looking forward to seeing lots of LoRAs from the community.
