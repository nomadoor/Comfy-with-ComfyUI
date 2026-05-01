---
layout: page.njk
lang: zh
section: basic-workflows
slug: sd15-outpainting
navId: sd15-outpainting
title: "outpainting"
created: 2026-02-06
updated: 2026-03-02
summary: "用 outpainting 扩画图像的外侧"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 什么是 outpainting？

outpainting 是 **扩画图像“外侧”** 的手法。

从内容上来说，和 inpainting 的 **“类型 B: 一边看周围的信息，一边自然地填补掩膜部分”** 完全一样。

区别仅在于掩膜是在图像里面，还是在外面。

> 以前提是先读了 [inpainting](/zh/basic-workflows/sd15-inpainting/) 来推进。

---

## inpainting 模型

使用了 inpainting 模型的，老实做法。

### 工作流

![](https://gyazo.com/dc8564ec48c6ac898fa9f4f080e9bcfd){gyazo=image}

[](/workflows/basic-workflows/sd15-outpainting/SD1.5_outpainting_sd-v1-5-inpainting.json)

- 和 [inpainting/inpainting 模型](/zh/basic-workflows/sd15-inpainting/#inpainting 模型) 几乎一样。
- 🟦 在 `Pad Image for Outpainting` 节点，向外侧扩展图像。
  - 扩展的部分作为掩膜输出。
- 🟩 剩下的只要连接到 `InpaintModelConditioning` 节点就行。

---

## ControlNet inpaint

如果想原样使用喜欢的模型，就使用 ControlNet inpaint。

### 工作流

![](https://gyazo.com/df7f466617d6c2bd773bedf0eeb03bb5){gyazo=image}

[](/workflows/basic-workflows/sd15-outpainting/SD1.5_outpainting_ControlNet_inpaint.json)

- 基本构成和 [inpainting/ControlNet inpaint](/zh/basic-workflows/sd15-inpainting/#controlnet-inpaint) 一样。
- 🟦 在 `Pad Image for Outpainting` 节点，向外侧扩展图像。
  - 这个也是，扩展的部分变成掩膜。
- 🟨 将 outpainting 后的图像和掩膜，传递给 ControlNet inpaint 用的预处理节点。
