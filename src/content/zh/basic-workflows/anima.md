---
layout: page.njk
lang: zh
section: basic-workflows
slug: anima
navId: anima
title: "Anima"
created: 2026-05-29
updated: 2026-08-01
summary: "使用 Anima 进行图像生成"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
tags: []
hero:
  image: "https://i.gyazo.com/1a342c19b3f7d493f6af396cde34891f.png"
---

## Anima 是什么？

[Anima](https://huggingface.co/circlestone-labs/Anima) 是由 CircleStone Labs 与 Comfy Org 合作创建的，2B 参数图像生成模型。

它以 NVIDIA Cosmos 为基础，是使用数百万张动漫图像和艺术图像训练的 **纯动漫模型**。

作为从 SDXL 世代的动漫模型迁移过去的目标之一，Anima 受到了相当多的期待。

> 许可证是 **CircleStone Labs Non-Commercial License**。  
> Anima 模型本身、派生模型和 LoRA 等为非商业用途。生成图像可以用于商业用途。

---

## 模型下载

* diffusion_models

  * [anima-base-v1.0.safetensors](https://huggingface.co/circlestone-labs/Anima/blob/main/split_files/diffusion_models/anima-base-v1.0.safetensors) (4.18 GB)
  * [anima-aesthetic-v1.1.safetensors](https://huggingface.co/circlestone-labs/Anima/blob/main/split_files/diffusion_models/anima-aesthetic-v1.1.safetensors) (4.18 GB)

* text_encoders

  * [qwen_3_06b_base.safetensors](https://huggingface.co/circlestone-labs/Anima/blob/main/split_files/text_encoders/qwen_3_06b_base.safetensors) (1.19 GB)

* vae

  * [qwen_image_vae.safetensors](https://huggingface.co/circlestone-labs/Anima/blob/main/split_files/vae/qwen_image_vae.safetensors) (254 MB)

> `anima-base-v1.0` 是未经调整的基础模型。
> `anima-aesthetic-v1.1` 是使用高质量图像微调过的模型。如果只想轻松试试生成，基本上使用这个即可。

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

Anima 使用 Danbooru 系标签、自然语言，以及两者的组合进行训练。

因为文本编码器比较聪明，所以不需要像 [Pony Diffusion V6](/zh/basic-workflows/sdxl-anime/#pony-diffusion-v6-xl) 那样严格，不过在提示词开头加上下面这样的质量标签，可能会比较好用。

```text
masterpiece, best quality, score_9, safe,
```

---

## text2image

![](https://gyazo.com/0e2f46074799b0e7a016ee1a5bd28118){gyazo=image}

[](/workflows/basic-workflows/anima/anima-aesthetic-v1.1.json)

* 推荐分辨率是 `512px` 到 `1536px`。
* 推荐使用 `er_sde` 或 `euler_ancestral` 这样带有一点随机变化的采样器。

---

## Anima LLLite

ControlNet-LLLite 是 kohya 开发的轻量级 ControlNet。

### 模型下载

* [Comfy-Org/Anima-LLLite](https://huggingface.co/Comfy-Org/Anima-LLLite/tree/main/model_patches)

请根据要使用的控制图像准备合适的模型。

> 标有 `v2` 的模型针对 Anima-Base v1.0 训练。其他模型使用旧版 Anima Preview3 训练，因此效果可能会稍弱一些。

```text
📂ComfyUI/
└── 📂models/
    └── 📂model_patches/
        └── anima-lllite-*.safetensors
```

### anima-lllite-any-test-like-v2

![](https://gyazo.com/d42f85633b9036b7e2e6e806c064ef56){gyazo=image}

[](/workflows/basic-workflows/anima/anima-lllite-any-test-like-v2.json)

* `anima-lllite-any-test-like-v2` 将多种控制整合在一个模型中。它可以通过草图或线稿传递构图，也可以为灰度图像上色。
* 这个工作流会使用 `Canny` 从输入图像中提取轮廓，并将其作为控制图像。
