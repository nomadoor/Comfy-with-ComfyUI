---
layout: page.njk
lang: zh
section: basic-workflows
slug: anima
navId: anima
title: "Anima"
created: 2026-05-29
updated: 2026-05-29
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
> 请注意，只能用于非商业用途。

---

## 模型下载

* diffusion_models

  * [anima-base-v1.0.safetensors](https://huggingface.co/circlestone-labs/Anima/blob/main/split_files/diffusion_models/anima-base-v1.0.safetensors) (4.18 GB)

* text_encoders

  * [qwen_3_06b_base.safetensors](https://huggingface.co/circlestone-labs/Anima/blob/main/split_files/text_encoders/qwen_3_06b_base.safetensors) (1.19 GB)

* vae

  * [qwen_image_vae.safetensors](https://huggingface.co/circlestone-labs/Anima/blob/main/split_files/vae/qwen_image_vae.safetensors) (254 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── anima-base-v1.0.safetensors
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

![](https://gyazo.com/7e9aaaea23279a5d2ca5298c713b4f8f){gyazo=image}

[](/workflows/basic-workflows/anima/anima-base-v1.0.json)

- 推荐分辨率是 `512px` 到 `1536px`。
- 推荐使用 `er_sde` 或 `euler_ancestral` 这样带有一点随机变化的采样器。
