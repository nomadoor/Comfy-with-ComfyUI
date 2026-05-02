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
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/4f6ca42890bb8717fa4668d8c56bcbc5.png"
tags: []
---

## 什么是 Qwen-Image？

[Qwen-Image](https://github.com/QwenLM/Qwen-Image) 是中国 Alibaba 系的 Qwen 团队开发的画像生成模型。

文本编码器使用了多模态 LLM 的 **Qwen2.5-VL**，与使用 T5 或 Gemma 的模型相比，提示词的理解力高出一头。

而且，与 [Flux.1 dev](/zh/basic-workflows/flux-1/) 不同，由于基础不是蒸馏模型所以容易学习，与作为姐妹模型的 [Qwen-Image-Edit](/zh/basic-workflows/qwen-image-edit/) 合在一起，LoRA 或 Lightning 系周边的生态系统充实也是特征。

---

## 推荐分辨率

Qwen-Image 推荐 1.5M〜1.8M 像素前后。

* 1:1 … 1328 × 1328
* 4:3 … 1472 × 1104
* 3:2 … 1584 × 1056
* 16:9 … 1664 × 928

---

## 模型的下载

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

![](https://gyazo.com/c06f913435b344d929cb0ec8e94d20c3){gyazo=image}

[](/workflows/basic-workflows/qwen-image/Qwen-Image.json)

* 采样器经常被使用 `euler` 或 `res_multistep`。

---

## ControlNet（InstantX）

Qwen-Image 面向的 ControlNet 模型有几个，因为方便使用，介绍作为 **ControlNet-Union** 被提供的 InstantX 基础的东西。

### 模型的下载

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

![](https://gyazo.com/dd47c0c42514446cddc587561e073e0d){gyazo=image}

[](/workflows/basic-workflows/qwen-image/Qwen-Image-InstantX-ControlNet-Union.json)

![](https://gyazo.com/26cde876245eaa2fb914859216fc66a4){gyazo=image}

[](/workflows/basic-workflows/qwen-image/Qwen-Image-InstantX-ControlNet-Inpainting.json)

---

## Lightning（高速生成 LoRA）

**Qwen-Image-Lightning** 是，为了让 Qwen-Image 用 **4 / 8 steps 运转而被蒸馏的 LoRA 组**。

几乎没有劣化就能大幅减少步数，在相当多的工作流被采用。

### 模型的下载

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

![](https://gyazo.com/08f16f6f84c2d76a7ad1d50c617d32ef){gyazo=image}

[](/workflows/basic-workflows/qwen-image/Qwen-Image_lightning_8steps.json)

* 用 `LoraLoaderModelOnly` 节点读取 Lightning LoRA。
* 将 `KSampler` 的 `steps` 设定为 4 或 8，`CFG` 设定为 1.0。
