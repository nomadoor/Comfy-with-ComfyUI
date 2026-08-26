---
layout: page.njk
lang: zh
section: basic-workflows
slug: differential-diffusion
navId: differential-diffusion
title: "Differential Diffusion"
created: 2025-12-07
updated: 2026-08-26
summary: "用掩膜的浓度控制变化量"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/1f32a3d04b7ee26518803718151fc1d0.png"
---

## 什么是 Differential Diffusion？

在通常的 inpainting 中，掩膜的白色部分会发生变化，黑色部分不会变化。

那么，改成灰色是不是就能只改变一点？很遗憾，直接这样做并不能得到想象中的控制效果。

于是便有了 Differential Diffusion。

它可以**根据掩膜的浓淡，改变各个位置的 denoise**，因此既能让不同位置产生不同程度的变化，也能使用边界经过模糊的掩膜。

> 如果还没有读过 [inpainting](/zh/basic-workflows/sd15-inpainting/)，请先看这篇文章。

---

## 使用方法

只需在 inpainting 工作流中添加 `Differential Diffusion` 节点，再为掩膜添加深浅变化。

### 工作流

![](https://gyazo.com/32341a2b91def8997072eb24dde93cce){gyazo=image}

[](/workflows/basic-workflows/differential-diffusion/SD1.5_Differential_Diffusion.json)

- 🟩 追加 `Differential Diffusion` 节点
- 这个示例以使用 `Set Latent Noise Mask` 节点的工作流为基础。
  - 当然，也可以用于使用 inpainting 模型或 ControlNet 模型的工作流。

掩膜越白的部分变化越大，越黑的部分越多地保留原图。

---

## 掩膜的用法

### 让不同位置产生不同程度的变化

掩膜的浓淡不必是平滑的渐变。

通过**在一张掩膜图像中，为不同位置设置不同的浓淡**，就能在一次采样中为各个部位指定不同的变化量。

![](https://gyazo.com/4b3d0506456a4f1dc8aa062d4e445b17){gyazo=image}

[](/workflows/basic-workflows/differential-diffusion/SD1.5_Differential_Diffusion_multi-obj.json)

- 为每个想改变的部分分别设置掩膜浓淡（例如脸部使用浅灰色，背景使用白色）

### 柔化边界

inpainting 的一个常见问题，是掩膜的边界会清楚地显现出来。

将 Differential Diffusion 与模糊后的掩膜组合使用，可以让边界衔接得更加自然。

![](https://gyazo.com/e54a8d82e7dca29bf6ab19fdb20c3354){gyazo=image}

[](/workflows/basic-workflows/differential-diffusion/SD1.5_Differential_Diffusion_blur.json)

- 🟪 这次组装进使用了 inpainting 模型的工作流。
- 🟨 使用 `Gaussian Blur Mask` 节点（[ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack)）模糊掩膜边界
  - 模糊会让掩膜在效果上变小，因此需要预先将掩膜稍微扩大。

### 将深度图作为掩膜使用

深度图以黑白渐变表示。

也就是说，它可以直接作为 Differential Diffusion 的掩膜使用。

![](https://gyazo.com/ac52958c32bb143910151029c53707d1){gyazo=image}

[](/workflows/basic-workflows/differential-diffusion/SD1.5_Differential_Diffusion_depthmap.json)

- 🟦 使用 Depth Anything V2（[comfyui_controlnet_aux](https://github.com/Fannovel16/comfyui_controlnet_aux)）制作深度图
  - 输出是 IMAGE，因此需要使用 `Convert Image to Mask` 节点将其转换为掩膜。
- 使用 `RemapMaskRange`（[ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)）调整浓淡范围

老实说，SD1.5 的能力还不太够，但我很喜欢用深度图作掩膜这个方法。

---

## 样本图像

![](https://gyazo.com/8d2eb48340cf6f6f99e539e11517d6a2){gyazo=image} ![](https://gyazo.com/d8cd78b75de91ed4e9a1da1eedfcf21d){gyazo=image} ![](https://gyazo.com/ff958820180efd9b316cb42ddd9c0276){gyazo=image} ![](https://gyazo.com/2d0d14ad85109598f389e5ac0ad7b85f){gyazo=image}
