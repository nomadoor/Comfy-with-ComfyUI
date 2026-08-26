---
layout: page.njk
lang: zh
section: basic-workflows
slug: sd15-outpainting
navId: sd15-outpainting
title: "outpainting"
created: 2025-12-07
updated: 2026-08-26
summary: "用 outpainting 扩画图像的外侧"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 什么是 outpainting？

outpainting 是一种 **向图像“外侧”继续扩画** 的方法。

不过，它并不是什么特殊的生成方式。

只需在图像外侧特意加上空白，把空白作为掩膜进行 inpainting。

填补图像内部，还是填补外侧新增的空白。区别仅此而已。

> 如果还没有读过 [inpainting](/zh/basic-workflows/sd15-inpainting/)，请先看一下。

---

## inpainting 模型

先来看使用 inpainting 模型的方法。

### 工作流

![](https://gyazo.com/dc8564ec48c6ac898fa9f4f080e9bcfd){gyazo=image}

[](/workflows/basic-workflows/sd15-outpainting/SD1.5_outpainting_sd-v1-5-inpainting.json)

- 🟦 使用 `Pad Image for Outpainting` 节点，在图像外侧添加空白。
  - 它会输出添加空白后的图像，以及标出空白区域的掩膜。
- 🟩 后面的做法和 [inpainting/inpainting 专用模型](/zh/basic-workflows/sd15-inpainting/#inpainting-专用模型) 相同。将图像和掩膜连接到 `InpaintModelConditioning` 节点。

---

## ControlNet inpaint

当然，也可以使用 ControlNet inpaint。

### 工作流

![](https://gyazo.com/df7f466617d6c2bd773bedf0eeb03bb5){gyazo=image}

[](/workflows/basic-workflows/sd15-outpainting/SD1.5_outpainting_ControlNet_inpaint.json)

- 🟦 使用 `Pad Image for Outpainting` 节点，在图像外侧添加空白。
  - 它会输出添加空白后的图像，以及标出空白区域的掩膜。
- 🟨 后面的做法和 [inpainting/ControlNet inpaint](/zh/basic-workflows/sd15-inpainting/#controlnet-inpaint) 相同。将图像和掩膜传给 ControlNet inpaint 的预处理节点。

---

## 图像编辑模型

使用图像编辑模型会更简单。

在图像外侧加上灰色区域（其实什么颜色都可以），然后把图像交给图像编辑模型。接下来只要用提示词告诉它“自然地 outpaint 灰色区域”即可。

### FLUX.2 [klein]

来试试 [FLUX.2 \[klein\]](/zh/basic-workflows/flux-2-klein/) 9B。

![](https://gyazo.com/15ea40eaf859773d5a1543e1aba4df0b){gyazo=image}

[](/workflows/basic-workflows/sd15-outpainting/Flux.2-klein-9b_image-edit_outpainting.json)

- 🟩 不使用掩膜。只需把添加了空白的图像交给模型，并告诉它填补那片区域。
