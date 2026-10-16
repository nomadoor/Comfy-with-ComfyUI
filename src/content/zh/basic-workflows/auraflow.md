---
layout: page.njk
lang: zh
section: basic-workflows
slug: auraflow
navId: auraflow
title: "AuraFlow"
created: 2025-12-09
updated: 2026-03-02
summary: "简单梳理 AuraFlow 和 Pony V7"
seoTitle: "在 ComfyUI 中使用 AuraFlow 与 Pony V7"
seoDescription: "fal.ai 开发的轻量 flow 式 text2image 模型 AuraFlow，以及基于它的动漫模型 Pony V7 在 ComfyUI 中的用法，附模型下载与 text2image 工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/auraflow/legacy_gyazo_2d37855d2969e9cd5515e4852dce230e.png"
tags: []
---

## 什么是 AuraFlow

[AuraFlow](https://blog.fal.ai/auraflow/) 是 fal.ai 开发的 **基于 flow 的 text2image 模型**。它以 Apache-2.0 许可证公开，特点是轻量、好上手。

也有一些模型打算从 SDXL 转移到它上面，这里也介绍其中的代表 **Pony V7**。

---

## 下载模型

最新版是 **AuraFlow v0.3**。

- [aura_flow_0.3.safetensors](https://huggingface.co/fal/AuraFlow-v0.3/blob/main/aura_flow_0.3.safetensors)

```text
📂ComfyUI/
 └── 📂models/
     └── 📂checkpoints/
         └── aura_flow_0.3.safetensors
```

---

## text2image

基本的搭法和 SD1.5 / SDXL 几乎一样。

![](/media/basic-workflows/auraflow/legacy_gyazo_b19fda7dcd1fd17b91e2f0eea9d70c8c.png){media=image}

[](/workflows/basic-workflows/auraflow/aura_flow_0_3.json)

---

## Pony V7 : 基于 AuraFlow 的动漫模型

作为 [Pony Diffusion V6 XL](/zh/basic-workflows/sdxl-anime/#pony-diffusion-v6-xl) 的后继，基于 AuraFlow 打造的动漫模型。

### 下载模型

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
  - 当 token 数少于设定值时，用 padding 补齐的节点。加不加都没有太大差别。
- 官方工作流用的是 `euler_normal`，但线条容易乱，所以这里改用了 **CFG++（改良版 CFG 引导）**。  
  - 它会把传统的 CFG 调得更平滑，线条更容易稳定。
