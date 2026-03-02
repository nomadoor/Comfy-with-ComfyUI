---
layout: page.njk
lang: en
section: basic-workflows
slug: auraflow
navId: auraflow
title: "AuraFlow"
summary: "AuraFlow and Pony V7 rough organization"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/2d37855d2969e9cd5515e4852dce230e.png"
tags: []
---

## What is AuraFlow?

[AuraFlow](https://blog.fal.ai/auraflow/) is a **flow-based text2image model** developed by fal.ai. It is released under the Apache-2.0 license and is characterized by being lightweight and easy to handle.

There are some movements to move from SDXL, and **Pony V7**, a representative example of this, is also introduced here.

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

The basic construction is almost the same as SD1.5 / SDXL.

![](https://gyazo.com/b19fda7dcd1fd17b91e2f0eea9d70c8c){gyazo=image}

[](/workflows/basic-workflows/auraflow/aura_flow_0.3.json)

---

## Pony V7 : AuraFlow-based Anime Model

It is an anime-oriented model based on AuraFlow, created as a successor to [Pony Diffusion V6 XL](/en/basic-workflows/sdxl-anime/#pony-diffusion-v6-xl).

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

![](https://gyazo.com/65638b2cf68cfc2a4ed7ff762653c0bc){gyazo=image}

[](/workflows/basic-workflows/auraflow/pony-v7-base.json)

- 🟦 `T5TokenizerOptions`
  - A node that fills with padding if the number of tokens is below the set value. There is no big difference whether you include it or not.
- The official workflow was `euler_normal`, but since the lines tended to be chaotic, **CFG++ (Improved CFG Guidance)** is used here.
  - It adjusts conventional CFG smoothly, making lines easier to stabilize.
