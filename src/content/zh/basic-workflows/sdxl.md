---
layout: page.njk
lang: zh
section: basic-workflows
slug: sdxl
navId: sdxl
title: "SDXL"
created: 2026-02-06
updated: 2026-03-02
summary: "SDXL 的用法"
seoTitle: "在 ComfyUI 中使用 SDXL：base 与 refiner"
seoDescription: "Stable Diffusion 1.5 的后继 SDXL 在 ComfyUI 中的用法。介绍仅用 base 模型的 text2image、CLIPTextEncodeSDXL、base + refiner 两段式结构和用 KSampler (Advanced) 切换，以及 refiner 的思路。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/sdxl/legacy_gyazo_2317e881cf31b7c2af135774fb56b4e4.png"
tags: []
---

## 什么是 SDXL？

SDXL（准确地说是 SDXL 1.0）是开发 Stable Diffusion 1.5 的 Stability AI 推出的正统后继模型。（其实还有 Stable Diffusion 2.1 这条线，不过嘛……性能嘛……）

和 Stable Diffusion 相比，主要区别大概有以下 2 点。

**`base` 和 `refiner` 的两段式结构**

- 基本的 text2image 只用 `base` 模型就能完成。
- 之后再用 `refiner` 模型做 image2image，完成调整细节和质感的“收尾”，这是它的设计思路。

**训练分辨率的变化**

- Stable Diffusion 1.5  
  - 主要用 512 × 512px 的正方形图像训练
- SDXL  
  - 以 1024 × 1024px 为中心，用各种长宽比训练
  - 本身就比较能应对高分辨率的图像生成，以及竖长、横长的构图。

---

## 下载模型

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

## 只用 base 模型进行 text2image

先只用 `base`，简单地做一次 text2image 吧。

在 [SD1.5 的 text2image](/zh/basic-workflows/sd15-text2image/) 的工作流中，只要将 Checkpoint 替换为 SDXL base 就能进行基本的生成。

![](/media/basic-workflows/sdxl/legacy_gyazo_c812a47ff8d57de7f90be3b85d1a5f58.png){media=image}

[](/workflows/basic-workflows/sdxl/sdxl_text2image_base.json)

* 分辨率以 1M 像素左右（1024 × 1024px 上下）为参考。

  * 例：1024 × 1024 / 896 × 1152 / 1152 × 896 等

### CLIPTextEncodeSDXL

SDXL base 的文本编码器由 2 种 CLIP（OpenCLIP-ViT/G, CLIP-ViT/L）组合而成。

ComfyUI 中也有可以给每个 CLIP 分别输入不同文本的节点，但先说结论：**没必要用。**

![](/media/basic-workflows/sdxl/legacy_gyazo_55a896ac7ae4544942d9242853a4d9c9.png){media=image}

[](/workflows/basic-workflows/sdxl/sdxl_text2image_base_cliptextencodesdxl.json)

* 给两个 CLIP 输入相同的提示词时，结果和使用 `CLIP Text Encode` 节点时几乎一样。
* 实验结果也表明，给两个 CLIP 输入相同文本时，输出最容易稳定。

---

## base + refiner

接下来，试着用 `refiner` 给 `base` 生成的图像收尾。

### 用 base 生成 → 用 refiner image2image

SDXL base 和 SDXL refiner 使用相同的 latent 表示。
所以可以把 base 生成的 latent 直接输入 refiner 那边的 KSampler 做 image2image。

![](/media/basic-workflows/sdxl/legacy_gyazo_4bc82a63f933e5538c45ca11832c5f08.png){media=image}

[](/workflows/basic-workflows/sdxl/sdxl_text2image_base_refiner.json)

* 1. 🟪 用 SDXL base 照常进行 text2image（输出 latent）
* 2. 🟨 把这个 latent 连接到使用 SDXL refiner 的 KSampler
* 3. 🟨 用较低的 `denoise`（例：0.2〜0.3）进行 image2image

  * refiner 专门用来增加细节，所以真的只要一点点就够了。

大致就是保留 base 原本的画风，只让 refiner 修整细节和质感。

### 在采样途中切换（KSampler Advanced）

还有一种更巧妙一点的做法，就是在采样途中从 base 切换到 refiner。
使用 [KSampler (Advanced) 节点](/zh/basic-workflows/ksampler-advanced/)。

![](/media/basic-workflows/sdxl/legacy_gyazo_9f6609b33de0a955ca5d9a86ba882ab4.png){media=image}

[](/workflows/basic-workflows/sdxl/sdxl_text2image_base_refiner_advanced.json)

* 🟪 前半段用 SDXL base 采样
* 🟨 剩下的步数切换到 SDXL refiner 采样
* 🟦 用 `int` 节点设置切换的时机。

我个人觉得 image2image 更好懂，所以更喜欢那种方式；不过能像这样在 1 次采样过程中切换 base 和 refiner，记住也许也没坏处。

---

## refiner 用不着，但“refiner 式的思路”很重要

### 不需要 refiner 的 SDXL 模型

基于 SDXL 的派生模型（社区模型和商用模型）有很多，其中大部分都 **经过调整，不用 refiner 也能得到足够的画质**。

说得重一点，“用 refiner 做后处理”这种设计，其实也是为了弥补当时 base 单独性能不足的权宜之计。

### refiner 式的思路

话虽如此，“用多个模型接力完成 1 张图像”这个思路本身，到现在也完全适用。

* 画风很喜欢，但不太听提示词的模型
* 反过来，很听提示词，但画风不合口味的模型

像这种“差点意思”的模型，要多少有多少。

这种时候，SDXL 的 refiner 式思路就能派上用场。

* 先用构图和提示词还原度出色的模型，生成作为基础的图像
* 再用画风喜欢的模型对这张图像做 image2image 来收尾

做成这样的两段式结构，就能搭出“构图用 A 模型”“画风用 B 模型”这种取长补短的工作流。

SDXL 的 base / refiner 只是其中一个具体例子而已。
“多个模型怎么搭配”，请试着找出属于你自己的组合。
