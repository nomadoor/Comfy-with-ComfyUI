---
layout: page.njk
lang: zh
section: basic-workflows
slug: sd15-ip-adapter
navId: sd15-ip-adapter
title: "IP-Adapter"
created: 2025-12-09
updated: 2026-08-26
summary: "从参考图像迁移风格和主体的鼻祖级机制"
seoTitle: "在 ComfyUI 中使用 IP-Adapter：从参考图迁移画风"
seoDescription: "在 Stable Diffusion 1.5 上用 IP-Adapter，无需文字即可迁移参考图的风格或主体。介绍自定义节点、模型下载、工作流，以及 plus / light / face 等主要模型的区别。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/sd15-ip-adapter/legacy_gyazo_64fdcae074a2a01943d7f5fff3aaa418.png"
tags: ["subject-transfer", "style-transfer"]
---

## 什么是 IP-Adapter？

看着一幅画或一张照片，心想“希望能画出和这个一样的氛围”，可只靠文字把细节都说清楚几乎是不可能的。

于是，人们提出了好几种“不经过文字，直接让 AI 看图像”的机制。  
其中一直被用来 **“迁移”风格和主体** 的经典方法之一，就是 **IP-Adapter**。

可以把它看作“reference2image”“[Subject 转印](/zh/ai-capabilities/subject-transfer/)”的鼻祖。

---

## 所需的自定义节点

- [cubiq/ComfyUI_IPAdapter_plus](https://github.com/cubiq/ComfyUI_IPAdapter_plus)

---

## SD1.5 × IP-Adapter

IP-Adapter 有好几种，先来试试最标准的那一个吧。

### 下载模型

- IP-Adapter 本身（SD1.5 用）
  - [ip-adapter_sd15.safetensors](https://huggingface.co/h94/IP-Adapter/blob/main/models/ip-adapter_sd15.safetensors)
- CLIP Vision 模型
  - [model.safetensors](https://huggingface.co/h94/IP-Adapter/blob/main/models/image_encoder/model.safetensors)
    - 这个名字不好认，请重命名为 `OpenCLIP-ViT-H-14`。
```text
📂ComfyUI/
  └── 📂models/
      ├── 📂clip_vision/
      │   └── OpenCLIP-ViT-H-14.safetensors
      └── 📂ip_adapter/
          └── ip-adapter_sd15.safetensors
```

### 工作流

![](/media/basic-workflows/sd15-ip-adapter/legacy_gyazo_6e8376130553997cbd30696c6700a601.png){media=image}

[](/workflows/basic-workflows/sd15-ip-adapter/ip_adapter_sd15.json)

- 🟩 把各个模型和想参考的图像连接到 `IPAdapter Advanced` 节点。
- 🟦 用 `Prep Image For ClipVision` 节点裁剪参考图像。
  - 详见下文

---

## 它在“看”哪里

![](/media/basic-workflows/sd15-ip-adapter/legacy_gyazo_302c47a4eb43f19e7e8535ca40e8ed5c.png){media=image}

CLIP ViT-H-14 相当于 IP-Adapter 的“眼睛”，它基本上只看 **224 × 224 的范围**。  
所以如果直接传入竖长的人物照片，脸或脚可能会被切掉，或者只根据身体中间一带来提取特征。

如果想指定以哪个部分为基准，请像上面的工作流那样先缩放、裁剪。

---

## IP-Adapter 的主要模型

IP-Adapter 有几个派生模型，从参考图像“借用什么、借到什么程度”，每个模型的风格差别相当大。  

### ip-adapter-plus_sd15

会较强地迁移构图和物体位置的模型。

![](/media/basic-workflows/sd15-ip-adapter/legacy_gyazo_ecbbe99d3410a850767aaf506645952b.png){media=image}

[](/workflows/basic-workflows/sd15-ip-adapter/ip_adapter_plus_sd15.json)

- [ip-adapter-plus_sd15.safetensors](https://huggingface.co/h94/IP-Adapter/blob/main/models/ip-adapter-plus_sd15.safetensors)
- 构图会和参考图像相当接近


### ip-adapter_sd15_light

偏向以文本提示词为主的模型。

![](/media/basic-workflows/sd15-ip-adapter/legacy_gyazo_422b44322caef6fe6fdec8c7d37f54e3.png){media=image}

[](/workflows/basic-workflows/sd15-ip-adapter/ip_adapter_sd15_light.json)

- [ip-adapter_sd15_light.safetensors](https://huggingface.co/h94/IP-Adapter/blob/main/models/ip-adapter_sd15_light.safetensors)
- 较多地保留文本的指示
- 参考图像主要只是作为“风格、氛围”的提示

### ip-adapter-plus-face_sd15

专门针对脸部（头部）的 IP-Adapter。

![](/media/basic-workflows/sd15-ip-adapter/legacy_gyazo_bba6f8053f411bee64044c141d4632c0.png){media=image}

[](/workflows/basic-workflows/sd15-ip-adapter/ip_adapter_plus_face_sd15.json)

- [ip-adapter-plus-face_sd15.safetensors](https://huggingface.co/h94/IP-Adapter/blob/main/models/ip-adapter-plus-face_sd15.safetensors)
- 会相当强地固定长相、脸型、五官等

---

## SDXL 用模型链接

如果也想试试 SDXL，这里列出了 SDXL 用的模型链接。

- [ip-adapter_sdxl_vit-h](https://huggingface.co/h94/IP-Adapter/blob/main/sdxl_models/ip-adapter_sdxl_vit-h.safetensors)
- [ip-adapter-plus-face_sdxl_vit-h](https://huggingface.co/h94/IP-Adapter/blob/main/sdxl_models/ip-adapter-plus-face_sdxl_vit-h.safetensors)
- [ip-adapter-plus_sdxl_vit-h](https://huggingface.co/h94/IP-Adapter/blob/main/sdxl_models/ip-adapter-plus_sdxl_vit-h.safetensors)
