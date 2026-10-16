---
layout: page.njk
lang: zh
section: basic-workflows
slug: z-image-turbo
navId: z-image-turbo
title: "Z-Image-Turbo"
created: 2025-12-12
updated: 2026-03-02
summary: "用 Z-Image-Turbo 生成图像"
seoTitle: "在 ComfyUI 中使用 Z-Image-Turbo：8 步高速图像生成"
seoDescription: "Z-Image-Turbo 是把 Z-Image 蒸馏成 8 步即可生成的高速模型。本文说明它在 ComfyUI 中的用法，介绍模型下载、text2image 以及 Fun ControlNet Union 工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/z-image-turbo/legacy_gyazo_8cb43e18daed0bcb2bf3bf7c794e5360.png"
tags: []
---

## 什么是 Z-Image-Turbo？

Z-Image 是 Alibaba / Tongyi-MAI 推出的 **图像生成模型家族**。

![](/media/basic-workflows/z-image-turbo/legacy_gyazo_569a829f2dbd9021bfdecf6d1e3267b9.png){media=image}

**Z-Image-Turbo** 是把 [Z-Image (Base)](/zh/basic-workflows/z-image) 蒸馏而成的高速模型，用很少的步数（8 steps）就能生成。  
而且它不只是单纯提速，还同时做了强化学习，以获得稳定的画质。

所以即使不仔细调参数，也能很快生成漂亮的图像；但另一方面，
不同种子之间的变化比较小，擅长的领域也偏向写实。  
插画风格或比较特殊的提示词表达，它不太擅长。

顺带一提，它是 Z-Image 家族中最早公开的模型。

---

## 下载模型

- diffusion_models  
  - [z_image_turbo_bf16.safetensors](https://huggingface.co/Comfy-Org/z_image_turbo/blob/main/split_files/diffusion_models/z_image_turbo_bf16.safetensors) (12.3 GB)
- text_encoders  
  - [qwen_3_4b.safetensors](https://huggingface.co/Comfy-Org/z_image_turbo/blob/main/split_files/text_encoders/qwen_3_4b.safetensors) (8.04 GB)
- vae  
  - [ae.safetensors](https://huggingface.co/Comfy-Org/z_image_turbo/blob/main/split_files/vae/ae.safetensors)（335 MB）

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── z_image_turbo_bf16.safetensors
    ├── 📂text_encoders/
    │   └── qwen_3_4b.safetensors
    └── 📂vae/
        └── ae.safetensors
```

---

## text2image

Z-Image-Turbo 和 Flux.1 dev 一样，属于 **蒸馏模型**。

![](/media/basic-workflows/z-image-turbo/legacy_gyazo_7e5d76cec53ee44278c313a30035463f.png){media=image}

[](/workflows/basic-workflows/z-image-turbo/z_image_turbo.json)

- `steps` … 6〜8
- `cfg` … 1.0

---

## Z-Image-Turbo Fun ControlNet Union

这是 Z-Image-Turbo 用的 ControlNet 式补丁。

### 下载模型

- model_patches

  - [Z-Image-Turbo-Fun-Controlnet-Union-2.1.safetensors](https://huggingface.co/alibaba-pai/Z-Image-Turbo-Fun-Controlnet-Union-2.0/blob/main/Z-Image-Turbo-Fun-Controlnet-Union-2.1.safetensors)

```text
📂ComfyUI/
└── 📂models/
    └── 📂model_patches/
        └── Z-Image-Turbo-Fun-Controlnet-Union-2.1.safetensors
```

### 工作流

![](/media/basic-workflows/z-image-turbo/legacy_gyazo_53c91fd9eeb8f94357b20839e5d8c967.png){media=image}

[](/workflows/basic-workflows/z-image-turbo/z_image_turbo_fun_controlnet_union_2_1.json)

- 🟩 向 `QwenImageDiffsynthControlnet` 添加模型和控制图像
- 🟩 这个工作流用 Depth Anything V2 生成深度图。
