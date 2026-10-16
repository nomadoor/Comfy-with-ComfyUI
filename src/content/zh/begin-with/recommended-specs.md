---
layout: page.njk
lang: zh
section: begin-with
slug: recommended-specs
navId: recommended-specs
title: "推荐配置"
created: 2026-02-06
updated: 2026-03-02
summary: "运行 ComfyUI 所需的 PC 配置"
seoTitle: "ComfyUI 推荐配置：需要多少显存和内存"
seoDescription: "流畅运行 ComfyUI 的电脑配置参考。以最重要的 GPU 显存为中心，根据实际使用体验整理 CPU、内存（RAM）和存储的推荐配置。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

如果要将图像生成融入插画制作或设计工作中，本地运行在稳定性和实用性上都远远优于云环境。这里根据实际使用体验，整理一下流畅使用 ComfyUI 的推荐配置。

---

## CPU

大部分处理都是在 GPU 上进行的，所以不必太执着于 CPU。

虽然也有一些处理是由 CPU 完成的，但现在的 CPU 基本不会成为瓶颈。

---

## GPU

总之，VRAM（显存）容量最重要。计算速度再快，VRAM 不够的话，模型根本跑不起来。只有这一点最好不要妥协。

- 8GB：最低限度。花点心思能跑，但限制较多。
- 12〜16GB：大致能应对最新的技术（或者说，新技术都在朝着这个容量做轻量化）。
  - e.g. RTX 4060 Ti (16GB) / RTX 5060 (16GB)
- 24GB以上：如果还想同时跑 LLM、做长视频等重度任务，就以这个为目标吧。
  - e.g. RTX 3090 / 4090 / 5090

另外，别忘了选 Nvidia 的 GPU。

虽然 AMD 或 Intel 在相同 VRAM 容量下更便宜，但绝大多数 AI 模型都是针对 Nvidia 优化的。哪怕纸面参数差不多，实际跑起来处理时间要多花好几倍，到时候就后悔了。

---

## 内存 (RAM)

具体机制会在别处讲，利用 RAM，就能运行 VRAM 装不下的模型。而 ComfyUI 非常擅长这种处理。

VRAM 想多 12GB 要花一大笔钱，而加 RAM 相对便宜（虽说最近也涨得厉害……），所以能插多少就插多少吧。至少需要 32GB。

---

## 存储

SSD 的读取速度快得多，所以存放模型推荐用 SSD，而不是 HDD。

话虽如此，AI 模型每一个都很大，即便只精选常用的，也很快就会超过 1TB。SSD 容量自然是越大越好，不过这就得看钱包了。

生成的图像和视频保存在 HDD 上没有问题。
