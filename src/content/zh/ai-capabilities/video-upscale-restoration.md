---
layout: page.njk
lang: zh
section: ai-capabilities
slug: video-upscale-restoration
navId: video-upscale-restoration
title: 放大与视频修复
created: 2026-02-06
updated: 2026-03-02
summary: 让视频变大、变清晰的专用模型
seoTitle: "视频 AI 放大与修复：SeedVR2、FlashVSR"
seoDescription: "用于提升视频分辨率并修复画质的专用模型。讲解逐帧使用图像放大模型会产生闪烁的问题，以及保持时间一致性的 SeedVR2 和 FlashVSR。"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---

## 视频放大与视频修复

基本思路和方法与 [放大与图像修复](/zh/ai-capabilities/upscale-restoration/) 几乎一样。

* 1. 提高分辨率
* 2. 自然地补上丢失的细节，改善画质

不过有一个很大的区别：视频里 **时间上的连贯（不闪烁）** 非常重要。

把静态图像用的放大器“逐帧”套用，勉强也算是视频放大，但因为缺少 **时间上的一致性**，画面可能会闪烁。

所以还是用视频专用的放大器比较好。

这里只介绍目前的两个 SoTA。

> [!NOTE]
> 静态图像用的放大器不能用于视频，但反过来就没什么问题。
> 倒不如说它们比静态图像专用的模型性能更好，实际上也经常这样用。

---

## SeedVR2

[numz/ComfyUI-SeedVR2_VideoUpscaler](https://github.com/numz/ComfyUI-SeedVR2_VideoUpscaler)

专门针对视频放大，只需 1 步就能生成。

性能非常高，足以用来做修复，但也非常吃资源。

---

## FlashVSR

[lihaoyun6/ComfyUI-FlashVSR_Ultra_Fast](https://github.com/lihaoyun6/ComfyUI-FlashVSR_Ultra_Fast)

![](/media/ai-capabilities/video-upscale-restoration/legacy_gyazo_70f862355eef1106d51e8068ef48a006.mp4){media=loop}

[](/workflows/ai-capabilities/video-upscale-restoration/flashvsr.json)

它会把多帧放在一起处理，以抑制时间上的抖动和闪烁。

它的设计能做到接近实时的处理速度，又快又轻，可以先从它试起。
