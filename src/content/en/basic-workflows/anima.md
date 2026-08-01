---
layout: page.njk
lang: en
section: basic-workflows
slug: anima
navId: anima
title: "Anima"
created: 2026-05-29
updated: 2026-08-01
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
  * [anima-aesthetic-v1.1.safetensors](https://huggingface.co/circlestone-labs/Anima/blob/main/split_files/diffusion_models/anima-aesthetic-v1.1.safetensors) (4.18 GB)

* text_encoders

  * [qwen_3_06b_base.safetensors](https://huggingface.co/circlestone-labs/Anima/blob/main/split_files/text_encoders/qwen_3_06b_base.safetensors) (1.19 GB)

* vae

  * [qwen_image_vae.safetensors](https://huggingface.co/circlestone-labs/Anima/blob/main/split_files/vae/qwen_image_vae.safetensors) (254 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   ├── anima-base-v1.0.safetensors
    │   └── anima-aesthetic-v1.1.safetensors
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

![](https://gyazo.com/0e2f46074799b0e7a016ee1a5bd28118){gyazo=image}

[](/workflows/basic-workflows/anima/anima-aesthetic-v1.1.json)

* Recommended resolution is `512px` to `1536px`.
* Samplers with a little variation, such as `er_sde` and `euler_ancestral`, are recommended.

---

## Anima LLLite

LLLite is something like a lightweight ControlNet developed by Kohya.

### Model Download

* [Comfy-Org/Anima-LLLite](https://huggingface.co/Comfy-Org/Anima-LLLite/tree/main/model_patches)

Choose a suitable model for the control image you want to use.

> Models marked `v2` are for Anima-Base v1.0. The others were trained for the older Anima Preview3, so they may be a little less effective.

```text
📂ComfyUI/
└── 📂models/
    └── 📂model_patches/
        └── anima-lllite-*.safetensors
```

### anima-lllite-any-test-like

![](https://gyazo.com/d42f85633b9036b7e2e6e806c064ef56){gyazo=image}

[](/workflows/basic-workflows/anima/anima-lllite-any-test-like-v2.json)

`any-test-like-v2` combines several types of control, including rough sketches, line art, and grayscale images, in one model.

Here, let's simply use an edge-detected image as the input.
