---
layout: page.njk
lang: zh
section: basic-workflows
slug: chroma1-hd
navId: chroma1-hd
title: "Chroma1-HD"
created: 2026-02-06
updated: 2026-03-02
summary: "用 Chroma1-HD 扩展 Flux.1-schnell"
seoTitle: "在 ComfyUI 中使用 Chroma1-HD：去蒸馏版 Flux"
seoDescription: "以 Flux.1 [schnell] 为起点重建、更适合 LoRA 和微调的“去蒸馏版 Flux”Chroma1-HD 在 ComfyUI 中的用法，附模型下载与 text2image 工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/chroma1-hd/legacy_gyazo_326db88733896540f58ce60e7320824f.png"
tags: []
---

## 什么是 Chroma1-HD？

[Flux.1 [dev]](/zh/basic-workflows/flux-1/) 是一个非常出色的模型，但要在社区里广泛使用，它有两个大问题。

- 蒸馏程度很高，和 LoRA、全量微调不太合得来
- 非商业许可证

于是出现了一些尝试，以许可证更宽松的 Flux.1 [schnell] 为起点，重新构建“去蒸馏版 Flux”。其中投入心血最多的之一，就是 LodestoneRock 开发的 [Chroma1-HD](https://huggingface.co/lodestones/Chroma1-HD)。

它重新训练时也加入了 NSFW 和动漫图像，风格的自由度比原来的 Flux 系更高。与其说是“去蒸馏版 Flux”，不如把它看作一个基于 Flux 系架构的全新通用模型，这样更贴切。

---

## 下载模型

Chroma1-HD 和 Flux.1 不同，不用 CLIP，只用 T5。

- diffusion_models  
  - [Chroma1-HD.safetensors](https://huggingface.co/lodestones/Chroma1-HD/blob/main/Chroma1-HD.safetensors)
- text_encoders  
  - [t5xxl_fp8_e4m3fn_scaled.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/t5xxl_fp8_e4m3fn_scaled.safetensors)
- vae  
  - [ae.safetensors](https://huggingface.co/Comfy-Org/z_image/blob/main/split_files/vae/ae.safetensors)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── Chroma1-HD.safetensors
    ├── 📂text_encoders/
    │   └── t5xxl_fp8_e4m3fn_scaled.safetensors
    └── 📂vae/
        └── ae.safetensors
```

## text2image

![](/media/basic-workflows/chroma1-hd/legacy_gyazo_319a7dc82aeea486d7f0912c830fb258.png){media=image}

[](/workflows/basic-workflows/chroma1-hd/chroma1_hd.json)

- 基本的搭法和 Flux.1 几乎一样。
- 🟦 T5TokenizerOptions 是在 token 数少于设定值时用 padding 补齐的节点。加不加都没有太大差别。
- CFG 默认是 4.0，不过也有人说 6〜7 更好。可以多试试看。
