---
layout: page.njk
lang: zh
section: ai-capabilities
slug: video-upscale-restoration
navId: video-upscale-restoration
title: 放大・视频修复
summary: 让视频变大・变清晰的专用模型
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---

## 视频放大・视频修复

基本的思路和手法，与 [放大・图像修复](/zh/ai-capabilities/upscale-restoration/) 几乎相同。

* 1. 提高分辨率
* 2. 自然地补充缺失的细节，整理画质

但是有一个大的区别，在视频中 **时间方向的连接（不闪烁）** 变得很重要。

虽然“逐帧”使用静止画用放大器姑且也能做到视频放大，但因为没有 **时间上的一致性**，所以可能会出现闪烁。

毕竟，还是使用视频专用的放大器比较好吧。

介绍两个现在的 SoTA。

> 虽说无法将静止画用的放大器用于视频，但反过来没什么特别的问题。
> 倒不如说因为比静止画专用的性能更好，实际上经常被使用。

---

## SeedVR2

[numz/ComfyUI-SeedVR2_VideoUpscaler](https://github.com/numz/ComfyUI-SeedVR2_VideoUpscaler)

专注于视频放大，并使其能在 1 步内生成。

虽然性能非常高，甚至可以用于修复级别，但也非常重。

---

## FlashVSR

[lihaoyun6/ComfyUI-FlashVSR_Ultra_Fast](https://github.com/lihaoyun6/ComfyUI-FlashVSR_Ultra_Fast)

![](https://gyazo.com/70f862355eef1106d51e8068ef48a006){gyazo=image}

[](/workflows/ai-capabilities/video-upscale-restoration/FlashVSR.json)

汇总处理多个帧，抑制时间方向的抖动和闪烁。

设计上可以实现接近实时的处理速度，由于高速・轻量，所以最好先试试这个。
