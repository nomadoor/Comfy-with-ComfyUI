---
layout: page.njk
lang: zh
section: faq
slug: torch-cuda-oom
navId: torch-cuda-oom
title: "torch.cuda.OutOfMemoryError"
summary: "torch.cuda.OutOfMemoryError"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 症状

- 执行处理的瞬间，或在采样途中出现红色错误画面，处理停止。

- 终端会出现 `torch.cuda.OutOfMemoryError` 和关于 VRAM 使用量的消息。

## 发生的时机

- 在大分辨率或大 batch size 下运行 Flux / 视频模型等重模型时。


## 原因

- 相对于 GPU 的 VRAM 容量，模型＋图像尺寸＋Batch Size 的组合太大了。

## 解决方法

- 将 batch size 设为 1，分辨率也降到模型的推荐值（如果是 SD1.5 就是 512〜768px，如果是 SDXL 就是 1024px 前后）。
- 即使这样也不行的话，使用更轻的模型，或者考虑量化模型（gguf / nf4 等）
- 即使这样也不行的话，就老实地增强 GPU 吧。
