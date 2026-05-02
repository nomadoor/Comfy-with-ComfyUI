---
layout: page.njk
lang: zh
section: basic-workflows
slug: sdxl
navId: sdxl
title: "SDXL"
created: 2026-02-06
updated: 2026-03-02
summary: "SDXL 的使用方法"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/2317e881cf31b7c2af135774fb56b4e4.png"
tags: []
---

## 什么是 SDXL？

SDXL（准确地说是 SDXL 1.0），是由开发了 Stable Diffusion 1.5 的 Stability AI 推出的正统后继模型。（虽说也有叫 Stable Diffusion 2.1 的系统，但那个……性能嘛……）

作为与 Stable Diffusion 的巨大区别，大概有以下 2 点。

**`base` 和 `refiner` 的两段构成**

- 基本的 text2image 仅用 `base` 模型就可以完成。
- 之后，设计为通过用 `refiner` 模型进行 image2image，来进行调整细节和质感的“完稿”。

**学习时的分辨率的变更**

- Stable Diffusion 1.5  
  - 以 512 × 512px 的正方形图像为中心进行学习
- SDXL  
  - 以 1024 × 1024px 为中心，以各种各样的纵横比进行学习
  - 原本就更容易对应分辨率高的图像生成，和纵长・横长的构图。

---

## 模型的下载

- [sd_xl_base_1.0_0.9vae.safetensors](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/blob/main/sd_xl_base_1.0_0.9vae.safetensors)
- [sd_xl_refiner_1.0_0.9vae.safetensors](https://huggingface.co/stabilityai/stable-diffusion-xl-refiner-1.0/blob/main/sd_xl_refiner_1.0_0.9vae.safetensors)

```text
📂ComfyUI/
  └── 📂models/
      └── 📂checkpoints/
          ├── sd_xl_base_1.0_0.9vae.safetensors
          └── sd_xl_refiner_1.0_0.9vae.safetensors
```

---

## 仅用 base 模型 text2image

首先仅用 `base`，简单地 text2image 看看吧。

在 [SD1.5 的 text2image](/zh/basic-workflows/sd15-text2image/) 的工作流中，只要将 Checkpoint 替换为 SDXL base 就能进行基本的生成。

![](https://gyazo.com/c812a47ff8d57de7f90be3b85d1a5f58){gyazo=image}

[](/workflows/basic-workflows/sdxl/SDXL_text2image_base.json)

* 分辨率以大体 1M 像素（1024 × 1024px 前后）为标准。

  * 例：1024 × 1024 / 896 × 1152 / 1152 × 896 等

### CLIPTextEncodeSDXL

SDXL base 作为文本编码器，采用了组合 2 种 CLIP（OpenCLIP-ViT/G, CLIP-ViT/L）的构成。

ComfyUI 中也有可以向各个 CLIP 输入不同文本的节点，但先说好 **没有使用的必要。**

![](https://gyazo.com/55a896ac7ae4544942d9242853a4d9c9){gyazo=image}

[](/workflows/basic-workflows/sdxl/SDXL_text2image_base_CLIPTextEncodeSDXL.json)

* 如果向两个 CLIP 输入了相同的提示词，结果将变为与使用了 `CLIP Text Encode` 节点时几乎相同的举动。
* 在实验结果中也明白，向两个 CLIP 输入相同文本时，最容易成为安定的输出。

---

## base + refiner

接下来，试着用 `refiner` 完成 `base` 生成的图像。

### 用 base 生成 → 用 refiner image2image

SDXL base 和 SDXL refiner 使用相同的 latent 表现。
因此，可以将通过 base 生成的 latent，原样输入到 refiner 侧的 KSampler 进行 image2image。

![](https://gyazo.com/4bc82a63f933e5538c45ca11832c5f08){gyazo=image}

[](/workflows/basic-workflows/sdxl/SDXL_text2image_base-refiner.json)

* 1. 🟪 用 SDXL base 照常进行 text2image（输出 latent）
* 2. 🟨 将那个 latent 连接到使用了 SDXL refiner 的 KSampler
* 3. 🟨 以低的 `denoise`（例：0.2〜0.3）进行 image2image

  * 因为专注于增加细节，所以真的一点点就足够了。

形象上是活用原本 base 的画风，只让 refiner 调整细部和质感。

### 在采样途中切换（KSampler Advanced）

作为稍微聪明一点的做法，也有在采样途中从 base → refiner 切换的做法。
使用 [KSampler (Advanced) 节点](/zh/basic-workflows/ksampler-advanced/)。

![](https://gyazo.com/9f6609b33de0a955ca5d9a86ba882ab4){gyazo=image}

[](/workflows/basic-workflows/sdxl/SDXL_text2image_base-refiner_Advanced.json)

* 🟪 直到中盘用 SDXL base 进行采样
* 🟨 将剩下的步数切换给 SDXL refiner 采样
* 🟦 在 `int` 节点设定切换的时机。

虽然我个人因为 image2image 更容易理解所以喜欢，但像这样，可以在 1 次采样路径中进行 base 和 refiner 的切换这点，记住也未尝不可。

---

## 虽不需要 refiner，但“refiner 式的思考方式”很重要

### refiner-less 的 SDXL 模型

虽然有许许多多以 SDXL 为基础的派生模型（社区模型和商用模型），但很多模型被 **调整为即使不使用 refiner 也能出充分的画质**。

说得稍微强硬点，“用 refiner 进行后处理”这种设计，也是为了弥补当时 base 单体性能的妥协策略。

### refiner 式的思考方式

虽说如此，“跨越多个模型来完成 1 张图像”这个思考方式本身，是至今也十分通用的想法。

* 虽然喜欢画风，但不怎么服从提示词的模型
* 相反，虽然很服从提示词，但画风不喜欢的模型

像这种“差点意思”的模型，要多少有多少。

在这样的场面，SDXL 的 refiner 式的思考方式就会派上用场。

* 用构图和提示词再现性优秀的模型，首先生成作为基础的图像
* 将那个图像，用画风喜欢的模型进行 image2image 来完稿

通过做成这种二段构成，可以组建“构图用 A 模型”“画风用 B 模型”这种，取长补短的工作流。

SDXL 中的 base / refiner，不过是其中一个具体例子。
请寻找“如何组合多个模型”属于你自己的组合。
