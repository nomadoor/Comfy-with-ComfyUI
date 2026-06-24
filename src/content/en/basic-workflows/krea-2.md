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
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/6ce8c9a2f7042a08efbbcdefc8ab6673.png"
tags: []
---

## What is Krea 2?

[Krea 2 Open-Source](https://www.krea.ai/krea-2-open-source) is an open-weight image generation model from Krea.

As with [FLUX.1 Krea](https://www.krea.ai/blog/flux-krea-open-source-release), which Krea released earlier, the architecture itself is not especially unusual. Instead, the model feels built with care around the dataset, aiming for beautiful images that do not look overly AI-like.

Two models are available, but for normal image generation you will use Turbo.

- **Krea 2 Raw**
  - An undistilled base model. Mainly intended for LoRA training and fine-tuning.
- **Krea 2 Turbo**  
  - A distilled model that can generate in 8 steps.

> The Web / API version of Krea also has **Krea 2 Medium** and **Krea 2 Large**, but the open-weight release only includes **Raw** and **Turbo**.

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

![](https://gyazo.com/31bce8c4982ff74992c599268d13374d){gyazo=image}

[](/workflows/basic-workflows/krea-2/Krea_2_turbo_text2image.json)

Krea 2 Turbo is a model for 8-step generation.

- `steps` : 8
- `cfg` : 1.0
- Recommended resolution : 1K to 2K

---

## Official Style LoRAs

One of Krea 2's major selling points is style control through features such as Style references and Moodboards, but at the moment those are not released as OSS.

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

![](https://gyazo.com/7a2ec126a289cfa04dd8cb609b6d04e3){gyazo=image}

[](/workflows/basic-workflows/krea-2/Krea_2_turbo_text2image_darkbrush.json)

- Here, [Krea-2-LoRA-darkbrush](https://huggingface.co/krea/Krea-2-LoRA-darkbrush) is used.
- The trigger word is `monochrome ink wash style`.

I am looking forward to seeing many LoRAs from the community.
