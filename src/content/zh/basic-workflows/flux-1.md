---
layout: page.njk
lang: zh
section: basic-workflows
slug: flux-1
navId: flux-1
title: "Flux.1"
created: 2026-02-06
updated: 2026-03-02
summary: "Flux.1 的基础知识与在 ComfyUI 中的用法"
seoTitle: "在 ComfyUI 中使用 Flux.1：dev、schnell、LoRA、ControlNet"
seoDescription: "在 ComfyUI 中使用 Black Forest Labs 的 Flux.1：[dev] 与 [schnell] 的 text2image、LoRA、ControlNet 以及用 GGUF 轻量化，附整理清晰易读的工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/flux-1/legacy_gyazo_9fd52a56e1f6b7cbf8cd96ca78484d02.png"
tags: []
---

## 什么是 Flux.1？

**Flux.1** 是 Black Forest Labs 推出的图像生成模型，这家公司由 Stable Diffusion 的开发成员创立。  
它不只是一个“高性能版”，在架构上也是一个重大转折点。

- 图像生成的核心，从传统的 UNet 换成了基于 Transformer（DiT）的结构  
- 文本编码器采用了 T5 系的 LLM  

这个组合让模型能从大规模数据集中高效学习，  
也更容易直接发挥 LLM 的文本理解能力，由此成为通往当今主流图像生成模型的分水岭。

Flux.1 有 3 个版本。

- **Flux.1 pro**  
  - 只能通过 API 使用的版本，没有公开模型权重。
- **Flux.1 dev**  
  - 由 pro 蒸馏而来，面向研究和验证的模型。本地环境里最常用的就是它。
- **Flux.1 schnell**  
  - 在 dev 的基础上进一步蒸馏的模型，以比较宽松的 Apache-2.0 许可证公开。

---

## 下载模型

这里使用 `dev` / `schnell` 的 fp8 版。

- diffusion model  
  - [flux1-dev-fp8.safetensors](https://huggingface.co/Comfy-Org/flux1-dev/blob/main/flux1-dev-fp8.safetensors)  
  - [flux1-schnell-fp8.safetensors](https://huggingface.co/Comfy-Org/flux1-schnell/blob/main/flux1-schnell-fp8.safetensors)  
- CLIP / T5  
  - [clip_l.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/clip_l.safetensors)  
  - [t5xxl_fp8_e4m3fn_scaled.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/t5xxl_fp8_e4m3fn_scaled.safetensors)  
- VAE  
  - [ae.safetensors](https://huggingface.co/Comfy-Org/z_image/blob/main/split_files/vae/ae.safetensors)

- ```text
  📂ComfyUI/
  └── 📂models/
      ├── 📂diffusion_models/
      │   ├── flux1-dev-fp8.safetensors
      │   └── flux1-schnell-fp8.safetensors
      ├── 📂clip/
      │   ├── clip_l.safetensors
      │   └── t5xxl_fp8_e4m3fn_scaled.safetensors
      └── 📂vae/
          └── ae.safetensors
  ```

---

## text2image - Flux.1 [dev]

![](/media/basic-workflows/flux-1/legacy_gyazo_2b89975e1b96fcbbd56880d31a0cd9c4.png){media=image}

[](/workflows/basic-workflows/flux1/flux1_dev.json)

Flux.1 dev / schnell 是 **在 CFG 固定为 1.0 的状态下蒸馏出来的模型**。
所以它不像传统的 Stable Diffusion 那样需要调 `CFG scale` 和 Negative Prompt，**Negative Prompt 完全不起作用**。

* cf. [CFG / CFG = 1 的特殊意义](/zh/ai-capabilities/cfg/#cfg-1-的特殊意义)

我把 Negative 那边的提示词留空了，不过也有些工作流不用 Negative 的 `CLIP Text Encode` 节点，而是改接 `ConditioningZeroOut` 节点。

无论哪种做法，Negative 那边的条件都会被乘以 0，**所以写什么都不会影响输出**。

---

## text2image - Flux.1 [schnell]

这是在 Flux.1 [dev] 的基础上进一步蒸馏的模型，4〜6 步就能生成图像。

![](/media/basic-workflows/flux-1/legacy_gyazo_365108a45e0039af1ce0d35cf2cdcfa6.png){media=image}

[](/workflows/basic-workflows/flux1/flux1_schnell.json)
- 将 `steps` 设为 4〜6。

---

## LoRA - Flux.1 [dev]

来试试能提升人像质量的 LoRA 吧。

* [AWPortrait-FL-lora.safetensors](https://huggingface.co/Shakker-Labs/AWPortrait-FL/blob/main/AWPortrait-FL-lora.safetensors)

![](/media/basic-workflows/flux-1/legacy_gyazo_292030d5a8ffc53619232546c7ce750b.png){media=image}

[](/workflows/basic-workflows/flux1/flux1_dev_lora.json)

* 🟪 [LoRA](/zh/basic-workflows/sd15-lora/) 里也写过，从 Flux 开始不再训练文本编码器，所以不用 `Load LoRA` 节点，而是用 **只作用于模型权重的** `LoraLoaderModelOnly` 节点。

---

## ControlNet - Flux.1 [dev]

Flux.1 也有几个公开的 ControlNet 模型，这里以 Union 型模型为例。

### 下载模型

* [FLUX.1-dev-ControlNet-Union-Pro-2.0-fp8/diffusion_pytorch_model.safetensors](https://huggingface.co/ABDALLALSWAITI/FLUX.1-dev-ControlNet-Union-Pro-2.0-fp8/blob/main/diffusion_pytorch_model.safetensors)

  * 原文件名不好辨认，建议重命名为 `FLUX.1-dev-ControlNet-Union-Pro-2.0-fp8.safetensors` 之类的名字。

- ```text
  📂ComfyUI/
  └── 📂models/
      └── 📂controlnet/
          └── FLUX.1-dev-ControlNet-Union-Pro-2.0-fp8.safetensors
  ```

### 工作流

ControlNet-Union 把多个常用的 ControlNet 集成在一个模型里。

![](/media/basic-workflows/flux-1/legacy_gyazo_9e7cb79f7ca50fe5946ac9f232a552c6.png){media=image}

[](/workflows/basic-workflows/flux1/flux_1_dev_controlnet_union_pro_depth.json)

* 🟩 只是在 Flux 的 image2image 工作流里加入了 ControlNet。

  * 虽说是 image2image，但 `denoise` 是 1.0，所以实际表现和 text2image 几乎一样。
  * 这样用很少的节点就能生成和输入图像同尺寸的图像，所以我经常用这种形式。
* 🟩 在 `SetUnionControlNetType` 中选择要用的 ControlNet 类型。

  * 基本上 `auto` 就没问题。

---

## GGUF（轻量化 Flux.1）

最后简单说一下 **GGUF 版 Flux.1**。

GGUF 本来是用来给 LLM 瘦身的格式（量化后的权重格式），
把它用在 Flux.1 上，就能 **在减少 VRAM 占用的同时，以还算不错的速度运行**。

### 自定义节点

* [city96/ComfyUI-GGUF](https://github.com/city96/ComfyUI-GGUF)

### 下载模型

根据性能和模型大小的取舍，有好几个版本。
请按照电脑配置和用途来选择。

* [FLUX.1-dev-gguf](https://huggingface.co/city96/FLUX.1-dev-gguf/tree/main)
* [FLUX.1-schnell-gguf](https://huggingface.co/city96/FLUX.1-schnell-gguf/tree/main)

- ```text
  📂ComfyUI/
  └── 📂models/
      └── 📂unet/
          └── flux1-dev.gguf
  ```

### 工作流

![](/media/basic-workflows/flux-1/legacy_gyazo_f465ff82b48c4c7b5d5b9ce144f3dc8d.png){media=image}

[](/workflows/basic-workflows/flux1/flux_1_dev_gguf.json)

* 🟪 将 `Load Diffusion Model` 节点替换为 `Unet Loader (GGUF)` 节点。
* 其他 CLIP / T5 / VAE 部分保持原样。

  * 也可以把 T5 换成 GGUF，但体感上效果没那么明显。

现在很多模型都提供了 GGUF 版。
**使用 GGUF 几乎没有缺点**，VRAM 不够的时候不妨积极用起来。
