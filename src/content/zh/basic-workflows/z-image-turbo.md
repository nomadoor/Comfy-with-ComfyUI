---
layout: page.njk
lang: zh
section: basic-workflows
slug: z-image-turbo
navId: z-image-turbo
title: "Z-Image-Turbo"
created: 2025-12-12
updated: 2026-03-02
summary: "使用 Z-Image-Turbo 的图像生成"
seoTitle: "在 ComfyUI 中使用 Z-Image-Turbo：8 步高速图像生成"
seoDescription: "把 Z-Image 蒸馏为 8 步即可生成的高速模型 Z-Image-Turbo 在 ComfyUI 中的用法。介绍模型下载、text2image 以及 Fun ControlNet Union 工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/z-image-turbo/legacy_gyazo_8cb43e18daed0bcb2bf3bf7c794e5360.png"
tags: []
---

## 什么是 Z-Image-Turbo？

Z-Image 是，Alibaba / Tongyi-MAI 的 **图像生成模型家族**。

![](/media/basic-workflows/z-image-turbo/legacy_gyazo_569a829f2dbd9021bfdecf6d1e3267b9.png){media=image}

**Z-Image-Turbo** 是，为了能以少的步数 (8 steps) 生成 [Z-Image (Base)](/zh/basic-workflows/z-image) 而被蒸馏的高速模型。  
并且，不仅是单纯的高速化，为了得到安定的画质也合并施加了强化学习。

因此，即使不细微地填设定也能快速生成美丽的图像，另一方面，
基于 Seed 的变化保守，拿手领域偏向实写。  
关于插画风或特殊的提示词表现，不太擅长。

虽是余谈，但在 Z-Image 家族中是 最早阶段被公开的模型。

---

## 模型的下载

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

Z-Image-Turbo 是，与 Flux.1 dev 相同类型的 **蒸馏模型**。

![](/media/basic-workflows/z-image-turbo/legacy_gyazo_7e5d76cec53ee44278c313a30035463f.png){media=image}

[](/workflows/basic-workflows/z-image-turbo/z_image_turbo.json)

- `steps` … 6〜8
- `cfg` … 1.0

---

## Z-Image-Turbo Fun ControlNet Union

Z-Image-Turbo 用的 ControlNet 风补丁。

### 模型的下载

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

- 🟩 向 `QwenImageDiffsynthControlnet` 追加模型和控制数据
- 🟩 在这个 workflow 用 Depth Anything V2 制作深度图。
