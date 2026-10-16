---
layout: page.njk
lang: zh
section: notes
slug: torch-cuda-oom
navId: torch-cuda-oom
title: "torch.cuda.OutOfMemoryError"
created: 2026-02-06
updated: 2026-03-02
noteTags: ["troubleshoot", "vram"]
summary: "torch.cuda.OutOfMemoryError"
seoTitle: "ComfyUI 的 torch.cuda.OutOfMemoryError 原因与对策"
seoDescription: "ComfyUI 出现 torch.cuda.OutOfMemoryError（显存不足）时的原因和解决方法，讲解模型、分辨率、批量大小与显存的关系，以及避免报错的对策。"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: ""
---

## 症状

- 刚开始运行时，或在采样途中，出现红色错误画面，处理中断。

- 终端里会出现 `torch.cuda.OutOfMemoryError`，以及有关 VRAM 使用量的信息。

## 出现时机

- 用较大的分辨率或较大的 batch size 运行 Flux / 视频模型等较重的模型时。


## 原因

- 模型＋图像尺寸＋batch size 的组合，超出了 GPU 的 VRAM 容量。

## 解决方法

- 把 batch size 设为 1，分辨率也降到模型的推荐值（SD1.5 为 512～768px，SDXL 为 1024px 左右）。
- 如果还是不行，就换用更轻的模型，或者考虑量化模型（gguf / nf4 等）
- 再不行的话，就老老实实升级 GPU 吧。
