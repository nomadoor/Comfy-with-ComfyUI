---
layout: page.njk
lang: en
section: basic-workflows
slug: auraflow
navId: auraflow
title: "AuraFlow"
created: 2025-12-09
updated: 2026-03-02
summary: "A quick overview of AuraFlow and Pony V7"
seoTitle: "AuraFlow and Pony V7 in ComfyUI"
seoDescription: "Use AuraFlow, fal.ai's lightweight flow-based text2image model, and the AuraFlow-based anime model Pony V7 in ComfyUI, with text2image workflows."
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "/media/basic-workflows/auraflow/legacy_gyazo_2d37855d2969e9cd5515e4852dce230e.png"
tags: []
---

## What is AuraFlow?

[AuraFlow](https://blog.fal.ai/auraflow/) is a **flow-based text2image model** developed by fal.ai. It's released under the Apache-2.0 license and is lightweight and easy to work with.

There have been a few efforts to move over from SDXL to it, and this page also covers the best-known one, **Pony V7**.

---

## Model Download

The latest version is **AuraFlow v0.3**.

- [aura_flow_0.3.safetensors](https://huggingface.co/fal/AuraFlow-v0.3/blob/main/aura_flow_0.3.safetensors)

```text
📂ComfyUI/
 └── 📂models/
     └── 📂checkpoints/
         └── aura_flow_0.3.safetensors
```

---

## text2image

The basic setup is almost the same as SD1.5 / SDXL.

![](/media/basic-workflows/auraflow/legacy_gyazo_b19fda7dcd1fd17b91e2f0eea9d70c8c.png){media=image}

[](/workflows/basic-workflows/auraflow/aura_flow_0_3.json)

---

## Pony V7 : AuraFlow-based Anime Model

An AuraFlow-based anime model created as the successor to [Pony Diffusion V6 XL](/en/basic-workflows/sdxl-anime/#pony-diffusion-v6-xl).

### Model Download

- diffusion_model
  - [pony-v7-base.safetensors](https://huggingface.co/purplesmartai/pony-v7-base/blob/main/safetensor/pony-v7-base.safetensors)
- text_encoder
  - [text_encoder/model.fp16.safetensors](https://huggingface.co/purplesmartai/pony-v7-base/blob/main/text_encoder/model.fp16.safetensors)
- VAE
  - [vae/diffusion_pytorch_model.fp16.safetensors](https://huggingface.co/purplesmartai/pony-v7-base/blob/main/vae/diffusion_pytorch_model.fp16.safetensors)

```text
📂ComfyUI/
 └── 📂models/
     ├── 📂diffusion_models/
     │   └── pony-v7-base.safetensors
     ├── 📂text_encoders/
     │   └── model.fp16.safetensors
     └── 📂vae/
         └── diffusion_pytorch_model.fp16.safetensors
```

### text2image

![](/media/basic-workflows/auraflow/legacy_gyazo_65638b2cf68cfc2a4ed7ff762653c0bc.png){media=image}

[](/workflows/basic-workflows/auraflow/pony_v7_base.json)

- 🟦 `T5TokenizerOptions`
  - Pads the input when the token count is below the set value. It doesn't make much difference whether you use it or not.
- The official workflow used `euler_normal`, but the lines tended to get messy, so this one uses **CFG++ (an improved version of CFG guidance)** instead.
  - It smooths out regular CFG, which helps keep lines stable.
