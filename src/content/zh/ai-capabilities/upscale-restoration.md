---
layout: page.njk
lang: zh
section: ai-capabilities
slug: upscale-restoration
navId: upscale-restoration
title: 放大与图像修复
created: 2025-11-13
updated: 2026-09-27
summary: 把图像变大，或修复画质劣化的图像的技术
seoTitle: "AI 放大与图像修复：从 GAN 到扩散模型"
seoDescription: "放大低画质图像并补全丢失细节的放大与修复技术。比较基于 GAN 的传统放大模型、面部修复模型、扩散模型方法，以及基于指令的图像编辑修复。"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## 放大与图像修复

放大（upscale）是把低分辨率图像变大的任务。不过如果只是变大，用 PowerPoint 之类的软件也能做到。

但是，把一张画质很差、满是噪点和锯齿的图像直接放大 2 倍、4 倍，得到的只是一张“更大的糊图”，信息量并不会增加。

所以这里说的放大，是指把 **“放大图像”** 和 **“自然地补上丢失的细节、修复画质”** 这两件事一起完成的技术。

另外，也有更专注于图像修复的技术。去除老照片上的划痕、自动给黑白照片上色这类处理，也可以算作“图像修复”的一种。

下面只挑有代表性的，看看都用了哪些方法和模型。

---

## GAN / 传统放大

使用 GAN 或传统超分辨率模型的放大。
这一类在 Stable Diffusion 出现之前就有了，现在仍然会作为轻量的处理方式使用。

![](/media/ai-capabilities/upscale-restoration/esrgan.png){media=image}

[](/workflows/ai-capabilities/upscale-restoration/esrgan.json)

- ESRGAN
- Real-ESRGAN
- SwinIR
- HYPIR

---

## 面部修复模型（专注于面部）

专门用于修复模糊、崩坏或低分辨率面部的模型。
以 FaceSwap 出名的 ReActor 只能生成低分辨率的结果，所以这些模型常被用作它的后处理。

- GFPGAN
- CodeFormer

---

## 基于扩散模型的放大与修复

使用 Stable Diffusion 等扩散模型，一边重绘图像一边放大、修复的方法。

- image2image
  - 这是以图像为底稿来生成图像的功能。把 `denoise` 调低，就能在基本不改变构图和内容的前提下，把它当作“修复”来用。
- Ultimate SD upscale
  - 单纯的 `image2image` 会受到模型能处理的分辨率和电脑配置的限制，能生成的尺寸有上限。
  - 于是把图像切成一块块瓦片，逐块进行 `image2image` 后再拼回去，这样就能处理更大的图像。
- SUPIR
  - 基于 SDXL、专注于放大和图像修复的模型。目标是从低画质的输入中还原出自然的高分辨率图像。

> [!NOTE]
> 用扩散模型放大，某种意义上就是在重绘。
> 所以它容易超出单纯修复的范围，**“做过头”**。
> 当然这也是一种表现方式，为了和尽量保留原图的放大区分开，有时也会称它为 **Enhance**。

---

## 用基于指令的图像编辑来修复

最近的“基于指令的图像编辑”模型中，有些只要用文字下指令，就能一次完成接近放大、修复的处理。

不用分别准备专用模型，只要说“把这张照片弄清晰”“减少噪点”“给黑白照片上色”，它就会把这些处理一并做完。

![](/media/ai-capabilities/upscale-restoration/legacy_gyazo_70baa67331207740cbab838d153c990d.png){media=image}

[](/workflows/ai-capabilities/upscale-restoration/qwen_image_edit_2509.json)

详细内容请看“[基于指令的图像编辑](/zh/ai-capabilities/instruction-based-image-editing/)”页面。

---

## 视频放大与视频修复

把图像放大逐帧应用，也勉强可以放大视频。

不过这种方法没有时间上的一致性，画面可能会闪烁、跳动。

视频专用的放大、修复模型会利用前后帧的信息，目标是在抑制闪烁的同时提升画质。

代表性的有以下这些。

- SeedVR2
- FlashVSR

把它们用来放大静态图像也完全没问题，倒不如说在这个用途上也很受欢迎。
