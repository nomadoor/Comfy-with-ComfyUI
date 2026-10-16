---
layout: page.njk
lang: zh
section: basic-workflows
slug: qwen-image
navId: qwen-image
title: "Qwen-Image"
created: 2025-12-11
updated: 2026-03-02
summary: "Qwen-Image 的使用方法"
seoTitle: "在 ComfyUI 中使用 Qwen-Image：ControlNet、Lightning"
seoDescription: "以 Qwen2.5-VL 作为文本编码器、提示词理解力强的 Qwen-Image 在 ComfyUI 中的用法。介绍推荐分辨率、text2image、InstantX ControlNet 和高速生成用 Lightning LoRA。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/qwen-image/legacy_gyazo_4f6ca42890bb8717fa4668d8c56bcbc5.png"
tags: []
---

## 什么是 Qwen-Image？

[Qwen-Image](https://github.com/QwenLM/Qwen-Image) 是中国 Alibaba 旗下 Qwen 团队开发的图像生成模型。

它的文本编码器用的是多模态 LLM **Qwen2.5-VL**，和使用 T5 或 Gemma 的模型相比，对提示词的理解力高出一截。

另外，和 [Flux.1 dev](/zh/basic-workflows/flux-1/) 不同，它的基础模型不是蒸馏模型，训练起来比较容易；加上姐妹模型 [Qwen-Image-Edit](/zh/basic-workflows/qwen-image-edit/)，LoRA、Lightning 等周边生态也很丰富，这也是它的特点。

---

## 推荐分辨率

Qwen-Image 推荐使用 1.5M〜1.8M 像素左右的分辨率。

* 1:1 … 1328 × 1328
* 4:3 … 1472 × 1104
* 3:2 … 1584 × 1056
* 16:9 … 1664 × 928

---

## 下载模型

* diffusion_models

  * [qwen_image_fp8_e4m3fn.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/blob/main/split_files/diffusion_models/qwen_image_fp8_e4m3fn.safetensors)
* text_encoders

  * [qwen_2.5_vl_7b_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/blob/main/split_files/text_encoders/qwen_2.5_vl_7b_fp8_scaled.safetensors)
* vae

  * [qwen_image_vae.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/blob/main/split_files/vae/qwen_image_vae.safetensors)

- gguf（任意）

  * [city96/Qwen-Image-gguf](https://huggingface.co/city96/Qwen-Image-gguf/tree/main)
  * [unsloth/Qwen2.5-VL-7B-Instruct-GGUF](https://huggingface.co/unsloth/Qwen2.5-VL-7B-Instruct-GGUF/tree/main)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── qwen_image_fp8_e4m3fn.safetensors
    ├── 📂text_encoders/
    │   ├── qwen_2.5_vl_7b_fp8_scaled.safetensors
    │   └── Qwen2.5-VL-7B.gguf    ← 仅在使用 gguf 的时候
    ├── 📂unet/
    │   └── qwen-image.gguf       ← 仅在使用 gguf 的时候
    └── 📂vae/
        └── qwen_image_vae.safetensors
```

---

## text2image

![](/media/basic-workflows/qwen-image/legacy_gyazo_c06f913435b344d929cb0ec8e94d20c3.png){media=image}

[](/workflows/basic-workflows/qwen-image/qwen_image.json)

* 采样器多用 `euler` 或 `res_multistep`。

---

## ControlNet（InstantX）

Qwen-Image 用的 ControlNet 模型有好几种，这里介绍以 **ControlNet-Union** 形式提供、基于 InstantX 的那一款，因为它用起来比较顺手。

### 下载模型

* controlnet

  * [Qwen-Image-InstantX-ControlNet-Union.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image-InstantX-ControlNets/blob/main/split_files/controlnet/Qwen-Image-InstantX-ControlNet-Union.safetensors)
  * [Qwen-Image-InstantX-ControlNet-Inpainting.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image-InstantX-ControlNets/blob/main/split_files/controlnet/Qwen-Image-InstantX-ControlNet-Inpainting.safetensors)

```text
📂ComfyUI/
└── 📂models/
    └── 📂controlnet/
        ├── Qwen-Image-InstantX-ControlNet-Union.safetensors
        └── Qwen-Image-InstantX-ControlNet-Inpainting.safetensors
```

### 工作流

![](/media/basic-workflows/qwen-image/legacy_gyazo_dd47c0c42514446cddc587561e073e0d.png){media=image}

[](/workflows/basic-workflows/qwen-image/qwen_image_instantx_controlnet_union.json)

![](/media/basic-workflows/qwen-image/legacy_gyazo_26cde876245eaa2fb914859216fc66a4.png){media=image}

[](/workflows/basic-workflows/qwen-image/qwen_image_instantx_controlnet_inpainting.json)

---

## Lightning（高速生成 LoRA）

**Qwen-Image-Lightning** 是 **一组经过蒸馏、让 Qwen-Image 能用 4 / 8 steps 运行的 LoRA**。

它几乎不损失画质就能大幅减少步数，所以相当多的工作流都在用。

### 下载模型

* loras

  * [Qwen-Image-Lightning-4steps-V2.0-bf16.safetensors](https://huggingface.co/lightx2v/Qwen-Image-Lightning/blob/main/Qwen-Image-Lightning-4steps-V2.0-bf16.safetensors)
  * [Qwen-Image-Lightning-8steps-V2.0-bf16.safetensors](https://huggingface.co/lightx2v/Qwen-Image-Lightning/blob/main/Qwen-Image-Lightning-8steps-V2.0-bf16.safetensors)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        ├── Qwen-Image-Lightning-4steps-V2.0-bf16.safetensors
        └── Qwen-Image-Lightning-8steps-V2.0-bf16.safetensors
```

### 工作流

![](/media/basic-workflows/qwen-image/qwen_image_lightning_8steps.png){media=image}

[](/workflows/basic-workflows/qwen-image/qwen_image_lightning_8steps.json)

* 用 `LoraLoaderModelOnly` 节点加载 Lightning LoRA。
* 把 `KSampler` 的 `steps` 设为 4 或 8，`CFG` 设为 1.0。
