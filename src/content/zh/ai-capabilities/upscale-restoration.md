---
layout: page.njk
lang: zh
section: ai-capabilities
slug: upscale-restoration
navId: upscale-restoration
title: 放大・图像修复
created: 2026-02-06
updated: 2026-03-02
summary: 放大图像，或修复劣化图像的技术
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## 放大・图像修复

放大是将分辨率小的图像放大的任务，但如果只是单纯放大，PowerPoint 等也可以做到。

但是，如果只是将低画质且粗糙的图像单纯地放大 2 倍、4 倍，只会得到“巨大的粗糙图像”，信息量不会增加。

因此，这里说的放大是指 **“放大图像”、“看起来自然地补充缺失的细节，修复画质”**，这两者成套进行的技术。

此外，也有更专注于图像修复的技术。消除旧照片的划痕，或自动为黑白照片上色等处理，也可以视为“图像修复”的一种。

让我们只看看使用了什么手法・模型，以及代表性的东西。

---

## GAN / 传统型放大

使用 GAN 或传统型超分辨率模型进行的放大。
这是 Stable Diffusion 以前就有的系统，现在有时仍作为轻量处理被使用。

![](https://gyazo.com/072c6cd7f09d777141293f6cf619ad83){gyazo=image}

[](/workflows/ai-capabilities/upscale-restoration/ESRGAN.json)

- ESRGAN
- Real-ESRGAN
- SwinIR
- HYPIR

---

## 面部修复模型（专注于面部周围）

专注于面部，用于恢复模糊、崩坏、低分辨率面部的模型。
虽然有名为 ReActor 的 FaceSwap 技术，但因为它只能生成低分辨率，所以作为后处理被使用。

- GFPGAN
- CodeFormer

---

## 扩散模型系放大・修复

使用 Stable Diffusion 等扩散模型，一边重绘图像一边进行放大・修复的方法。

- image2image
  - 虽然是以图像为底稿生成图像的功能，但通过抑制 `denoise` 量，可以在不怎么改变构图和内容的情况下作为“修复”使用。
- Ultimate SD upscale
  - 如果只是单纯的 `image2image`，受限于该模型能处理的分辨率或 PC 规格，能生成的尺寸有限制。
  - 因此，将图像分割成瓦片状，逐个进行 `image2image` 后再合并，从而能够处理更大图像的机制。
- SUPIR
  - 基于 SDXL，专注于放大・图像恢复的模型。目的是从低画质的输入中恢复自然的高分辨率图像。

> 扩散模型中的放大，在某种意义上是重绘。
> 因此，超越单纯的修复，有 **“做过头”** 的倾向。
> 当然这也是表现的一种，为了与尽量保持原图像的放大区别开来，有时也被称为 **Enhance**。

---

## 基于指令的图像编辑进行的修复

在最近的“基于指令的图像编辑”模型中，也有只需用文本指示，就能汇总进行接近放大・修复处理的模型。

即使不分别准备专用的模型，只要指示“把这张照片变漂亮”、“减少噪点”、“给黑白照片上色”等，它就会汇总进行这些处理。

![](https://gyazo.com/70baa67331207740cbab838d153c990d){gyazo=image}

[](/workflows/ai-capabilities/upscale-restoration/Qwen-Image-Edit-2509.json)

详情在“[基于指令的图像编辑](/zh/ai-capabilities/instruction-based-image-editing/)”页面介绍。

---

## 视频的放大・视频修复

如果逐帧应用图像放大，视频的放大姑且也是可能的。

但是，这种方法因为没有时间上的一致性，可能会残留闪烁或抖动。

视频专用的放大・修复模型，通过使用前后帧的信息，旨在抑制闪烁或抖动的同时提高画质。

代表性的系列有以下这些。

- SeedVR2
- FlashVSR

将它们作为静止画的放大使用也没问题。不如说在那个用途上人气也挺高。
