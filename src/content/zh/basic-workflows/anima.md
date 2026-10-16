---
layout: page.njk
lang: zh
section: basic-workflows
slug: anima
navId: anima
title: "Anima"
created: 2026-05-29
updated: 2026-08-01
summary: "用 Anima 生成图像"
seoTitle: "在 ComfyUI 中使用 Anima：轻量动漫图像生成模型"
seoDescription: "基于 NVIDIA Cosmos、用动漫图像训练的 2B 图像生成模型 Anima 在 ComfyUI 中的用法。介绍模型下载、提示词写法、text2image 和 Anima LLLite 工作流。"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
tags: []
hero:
  image: "/media/basic-workflows/anima/legacy_gyazo_1a342c19b3f7d493f6af396cde34891f.png"
---

## Anima 是什么？

[Anima](https://huggingface.co/circlestone-labs/Anima) 是 CircleStone Labs 与 Comfy Org 合作打造的 2B 参数图像生成模型。

它以 NVIDIA Cosmos 为基础，用数百万张动漫图像和艺术图像训练而成，是一个 **纯动漫模型**。

作为 SDXL 时代动漫模型的接班人，它可以说是相当受期待的模型之一。

> [!WARNING]
> 许可证是 **CircleStone Labs Non-Commercial License**。  
> Anima 模型本身、派生模型、LoRA 等仅限非商业用途。生成的图像可以商用。

{% runpod %}

---

## 下载模型

* diffusion_models

  * [anima-base-v1.0.safetensors](https://huggingface.co/circlestone-labs/Anima/blob/main/split_files/diffusion_models/anima-base-v1.0.safetensors) (4.18 GB)
  * [anima-aesthetic-v1.1.safetensors](https://huggingface.co/circlestone-labs/Anima/blob/main/split_files/diffusion_models/anima-aesthetic-v1.1.safetensors) (4.18 GB)

* text_encoders

  * [qwen_3_06b_base.safetensors](https://huggingface.co/circlestone-labs/Anima/blob/main/split_files/text_encoders/qwen_3_06b_base.safetensors) (1.19 GB)

* vae

  * [qwen_image_vae.safetensors](https://huggingface.co/circlestone-labs/Anima/blob/main/split_files/vae/qwen_image_vae.safetensors) (254 MB)

> [!TIP]
> `anima-base-v1.0` 是未经微调的基础模型。
> `anima-aesthetic-v1.1` 是使用高质量图像微调过的模型。想随手试试生成的话，基本上用这个就行。

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   ├── anima-base-v1.0.safetensors
    │   └── anima-aesthetic-v1.1.safetensors
    ├── 📂text_encoders/
    │   └── qwen_3_06b_base.safetensors
    └── 📂vae/
        └── qwen_image_vae.safetensors
```

---

## 提示词

Anima 的训练数据包括 Danbooru 风格的标签、自然语言，以及两者的组合。

因为文本编码器比较聪明，所以不需要像 [Pony Diffusion V6](/zh/basic-workflows/sdxl-anime/#pony-diffusion-v6-xl) 那样严格，不过在提示词开头加上下面这样的质量标签，可能会比较好用。

```text
masterpiece, best quality, score_9, safe,
```

---

## text2image

![](/media/basic-workflows/anima/anima_aesthetic_v1_1.png){media=image}

[](/workflows/basic-workflows/anima/anima_aesthetic_v1_1.json)

* 推荐分辨率是 `512px` 到 `1536px`。
* 推荐使用 `er_sde`、`euler_ancestral` 这类带一点随机性的采样器。

---

## Anima LLLite

ControlNet-LLLite 是 kohya 开发的轻量级 ControlNet。

### 下载模型

* [Comfy-Org/Anima-LLLite](https://huggingface.co/Comfy-Org/Anima-LLLite/tree/main/model_patches)

请根据要使用的控制图像准备合适的模型。

> [!NOTE]
> 标有 `v2` 的模型针对 Anima-Base v1.0 训练。其他模型使用旧版 Anima Preview3 训练，因此效果可能会稍弱一些。

```text
📂ComfyUI/
└── 📂models/
    └── 📂model_patches/
        └── anima-lllite-*.safetensors
```

### anima-lllite-any-test-like-v2

![](/media/basic-workflows/anima/anima_lllite_any_test_like_v2.png){media=image}

[](/workflows/basic-workflows/anima/anima_lllite_any_test_like_v2.json)

* `anima-lllite-any-test-like-v2` 将多种控制整合在一个模型中。它可以通过草图或线稿传递构图，也可以为灰度图像上色。
* 这个工作流会使用 `Canny` 从输入图像中提取轮廓，并将其作为控制图像。
