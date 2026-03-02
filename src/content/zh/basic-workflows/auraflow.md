---
layout: page.njk
lang: zh
section: basic-workflows
slug: auraflow
navId: auraflow
title: "AuraFlow"
summary: "AuraFlow 和 Pony V7 的粗略整理"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/2d37855d2969e9cd5515e4852dce230e.png"
tags: []
---

## 什么是 AuraFlow

[AuraFlow](https://blog.fal.ai/auraflow/) 是 fal.ai 开发的 **flow 基础的 text2image 模型**。以 Apache-2.0 许可证公开，特征是轻量且易于处理。

也有一些从 SDXL 移行的动作，这里也介绍作为那个代表例的 **Pony V7**。

---

## 模型的下载

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

基本的组建方法与 SD1.5 / SDXL 几乎相同。

![](https://gyazo.com/b19fda7dcd1fd17b91e2f0eea9d70c8c){gyazo=image}

[](/workflows/basic-workflows/auraflow/aura_flow_0.3.json)

---

## Pony V7 : AuraFlow 基础的动漫系模型

作为 [Pony Diffusion V6 XL](/zh/basic-workflows/sdxl-anime/#pony-diffusion-v6-xl) 的后继制作的，AuraFlow 基础的动漫面向模型。

### 模型的下载

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
  - 令牌数在设定值以下的情况下用 padding 填充的节点。放不放都没有大差别。
- 官方工作流是 `euler_normal`，但因为线条容易乱，所以这里使用了 **CFG++（改良版 CFG 引导）**。  
  - 平滑调整传统的 CFG 的东西，线条更容易安定。
