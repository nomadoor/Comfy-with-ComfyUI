---
layout: page.njk
lang: en
section: basic-workflows
slug: anima
navId: anima
title: "Anima"
created: 2026-05-29
updated: 2026-05-30
summary: "Image generation with Anima"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
tags: []
hero:
  image: "https://i.gyazo.com/1a342c19b3f7d493f6af396cde34891f.png"
---

## What is Anima?

[Anima](https://huggingface.co/circlestone-labs/Anima) is a 2B parameter image generation model created through a collaboration between CircleStone Labs and Comfy Org.

It is based on NVIDIA Cosmos, and is a **pure anime model** trained on several million anime images and art images.

It is one of the models drawing a lot of attention as a possible migration target from SDXL-era anime models.

> The license is **CircleStone Labs Non-Commercial License**.  
> The Anima model itself, derivative models, and LoRAs are non-commercial. Generated images can be used commercially.

---

## Model Download

* diffusion_models

  * [anima-base-v1.0.safetensors](https://huggingface.co/circlestone-labs/Anima/blob/main/split_files/diffusion_models/anima-base-v1.0.safetensors) (4.18 GB)

* text_encoders

  * [qwen_3_06b_base.safetensors](https://huggingface.co/circlestone-labs/Anima/blob/main/split_files/text_encoders/qwen_3_06b_base.safetensors) (1.19 GB)

* vae

  * [qwen_image_vae.safetensors](https://huggingface.co/circlestone-labs/Anima/blob/main/split_files/vae/qwen_image_vae.safetensors) (254 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── anima-base-v1.0.safetensors
    ├── 📂text_encoders/
    │   └── qwen_3_06b_base.safetensors
    └── 📂vae/
        └── qwen_image_vae.safetensors
```

---

## Prompt

Anima is trained on Danbooru-style tags, natural language, and combinations of both.

Because the text encoder is smart, you do not need to be as strict as with [Pony Diffusion V6](/en/basic-workflows/sdxl-anime/#pony-diffusion-v6-xl), but it may be useful to put quality tags like the following at the beginning of the prompt.

```text
masterpiece, best quality, score_9, safe,
```

---

## text2image

![](https://gyazo.com/7e9aaaea23279a5d2ca5298c713b4f8f){gyazo=image}

[](/workflows/basic-workflows/anima/anima-base-v1.0.json)

- Recommended resolution is `512px` to `1536px`.
- Samplers with a little variation, such as `er_sde` and `euler_ancestral`, are recommended.
