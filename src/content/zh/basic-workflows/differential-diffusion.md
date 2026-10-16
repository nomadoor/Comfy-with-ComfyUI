---
layout: page.njk
lang: zh
section: basic-workflows
slug: differential-diffusion
navId: differential-diffusion
title: "Differential Diffusion"
created: 2025-12-07
updated: 2026-08-26
summary: "用蒙版的深浅控制变化量"
seoTitle: "ComfyUI 的 Differential Diffusion：用蒙版浓度控制变化量"
seoDescription: "根据蒙版浓度按区域改变 denoise 的 Differential Diffusion 用法。介绍分区域调整变化量、融合边界，以及把深度图当作蒙版使用，附工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/differential-diffusion/legacy_gyazo_1f32a3d04b7ee26518803718151fc1d0.png"
---

## 什么是 Differential Diffusion？

普通的 inpainting 中，蒙版白色的部分会变，黑色的部分不变。

那涂成灰色，是不是就只会变一点点？很遗憾，直接这么做并不能得到想象中的效果。

于是便有了 Differential Diffusion。

它可以**根据蒙版的浓淡，改变各个位置的 denoise**，因此既能让不同位置产生不同程度的变化，也能使用边界经过模糊的蒙版。

> [!TIP]
> 如果还没有读过 [inpainting](/zh/basic-workflows/sd15-inpainting/)，请先看这篇文章。

---

## 使用方法

只要在 inpainting 工作流里加上 `Differential Diffusion` 节点，再让蒙版有深有浅就行。

### 工作流

![](/media/basic-workflows/differential-diffusion/legacy_gyazo_32341a2b91def8997072eb24dde93cce.png){media=image}

[](/workflows/basic-workflows/differential-diffusion/sd1_5_differential_diffusion.json)

- 🟩 添加 `Differential Diffusion` 节点
- 这个示例以使用 `Set Latent Noise Mask` 节点的工作流为基础。
  - 当然，也可以用于使用 inpainting 模型或 ControlNet 模型的工作流。

蒙版越白的地方变化越大，越黑的地方越会保留“原来的画面”。

---

## 蒙版的用法

### 让不同位置产生不同程度的变化

蒙版的浓淡不必是平滑的渐变。

通过**在一张蒙版图像中，为不同位置设置不同的浓淡**，就能在一次采样中为各个部位指定不同的变化量。

![](/media/basic-workflows/differential-diffusion/legacy_gyazo_4b3d0506456a4f1dc8aa062d4e445b17.png){media=image}

[](/workflows/basic-workflows/differential-diffusion/sd1_5_differential_diffusion_multi_obj.json)

- 为每个想改变的部分分别设置蒙版浓淡（例如脸部使用浅灰色，背景使用白色）

### 柔化边界

inpainting 的一个常见问题，是蒙版的边界会清楚地显现出来。

将 Differential Diffusion 与模糊后的蒙版组合使用，可以让边界衔接得更加自然。

![](/media/basic-workflows/differential-diffusion/legacy_gyazo_e54a8d82e7dca29bf6ab19fdb20c3354.png){media=image}

[](/workflows/basic-workflows/differential-diffusion/sd1_5_differential_diffusion_blur.json)

- 🟪 这次加到使用 inpainting 模型的工作流里。
- 🟨 使用 `Gaussian Blur Mask` 节点（[ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack)）模糊蒙版边界
  - 模糊会让蒙版在效果上变小，因此需要预先将蒙版稍微扩大。

### 将深度图作为蒙版使用

深度图以黑白渐变表示。

也就是说，它可以直接作为 Differential Diffusion 的蒙版使用。

![](/media/basic-workflows/differential-diffusion/legacy_gyazo_ac52958c32bb143910151029c53707d1.png){media=image}

[](/workflows/basic-workflows/differential-diffusion/sd1_5_differential_diffusion_depthmap.json)

- 🟦 使用 Depth Anything V2（[comfyui_controlnet_aux](https://github.com/Fannovel16/comfyui_controlnet_aux)）制作深度图
  - 输出是 IMAGE，因此需要使用 `Convert Image to Mask` 节点将其转换为蒙版。
- 使用 `RemapMaskRange`（[ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)）调整浓淡范围

老实说，SD1.5 的能力还不太够，但我很喜欢用深度图作蒙版这个方法。

---

{% outputs "samples" %}
![](/media/basic-workflows/differential-diffusion/legacy_gyazo_8d2eb48340cf6f6f99e539e11517d6a2.png){media=image} ![](/media/basic-workflows/differential-diffusion/legacy_gyazo_d8cd78b75de91ed4e9a1da1eedfcf21d.png){media=image} ![](/media/basic-workflows/differential-diffusion/legacy_gyazo_ff958820180efd9b316cb42ddd9c0276.png){media=image} ![](/media/basic-workflows/differential-diffusion/legacy_gyazo_2d0d14ad85109598f389e5ac0ad7b85f.png){media=image}
{% endoutputs %}
