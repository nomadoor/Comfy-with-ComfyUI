---
layout: page.njk
lang: zh
section: basic-workflows
slug: differential-diffusion
navId: differential-diffusion
title: "Differential Diffusion"
summary: "用掩膜的浓度控制变化量"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/1f32a3d04b7ee26518803718151fc1d0.png"
---

## 什么是 Differential Diffusion？

在通常的 inpainting，掩膜以“白或黑”的二选一被处理。  
即使稍微有点灰也会被视为“没有掩膜”，只 inpainting 完全是白色的部分。

Differential Diffusion 是 **根据掩膜的浓度连续地改变 denoise 的强度** 的机制。  
多亏了这个，可以用 1 次采样进行每一处变化量不同的 inpainting。

> 前提是先读了 [inpainting](/zh/basic-workflows/sd15-inpainting/)。  
> 掩膜的制作方法请参照 [掩膜操作](/zh/data-utilities/mask-ops/)、[使用 AI 生成掩膜](/zh/data-utilities/ai-mask-generation/)。

---

## 使用方法

只要准备渐变掩膜，向 inpainting 的工作流追加 `Differential Diffusion` 节点就好。

### 工作流

![](https://gyazo.com/32341a2b91def8997072eb24dde93cce){gyazo=image}

[](/workflows/basic-workflows/differential-diffusion/SD1.5_Differential_Diffusion.json)

- 基础是使用了 `Set Latent Noise Mask` 节点的工作流。
  - 当然，也能用于使用了 inpainting 模型或 ControlNet 模型的工作流。
- 🟩 追加 `Differential Diffusion` 节点

掩膜越白的部分越靠拢提示词，越黑的部分越残留“原来的画”。

---

## 有趣的使用方法

### 每部位改变变化量

掩膜没必要是渐变。  
通过 **在 1 张掩膜中，每处改变浓度**，可以在 1 次采样中每部位指定不同的变化量。

![](https://gyazo.com/4b3d0506456a4f1dc8aa062d4e445b17){gyazo=image}

[](/workflows/basic-workflows/differential-diffusion/SD1.5_Differential_Diffusion_multi-obj.json)

- 每想改变的部分，分画掩膜的浓度（例: 脸是浅灰、背景是白等）

### 融合掩膜边界

作为 inpainting 常见的问题，掩膜的交界线会清晰地显现。  
通过组合 Differential Diffusion 和模糊的掩膜，让这个边界自然地融合吧。

![](https://gyazo.com/e54a8d82e7dca29bf6ab19fdb20c3354){gyazo=image}

[](/workflows/basic-workflows/differential-diffusion/SD1.5_Differential_Diffusion_blur.json)

- 🟪 这次组装进使用了 inpainting 模型的工作流。
- 用 `Gaussian Blur Mask` 节点（[ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack)）模糊掩膜的边界
  - 因为模糊的话实质掩膜变小，所以作为预处理稍微让掩膜大一点。

### 将深度图作为掩膜使用

深度图以黑白的渐变表示。  
也就是说，可以作为与 Differential Diffusion 相性好的掩膜使用。

![](https://gyazo.com/ac52958c32bb143910151029c53707d1){gyazo=image}

[](/workflows/basic-workflows/differential-diffusion/SD1.5_Differential_Diffusion_depthmap.json)

- 🟦 用 Depth Anything V2 制作深度图
  - 因为这是 IMAGE 所以用 `Convert Image to Mask` 节点转换为掩膜。

老实说，在 SD1.5 性能不足，但将深度图作为掩膜使用本身，是我中意的方法。

---

## 样本图像

![](https://gyazo.com/8d2eb48340cf6f6f99e539e11517d6a2){gyazo=image} ![](https://gyazo.com/d8cd78b75de91ed4e9a1da1eedfcf21d){gyazo=image} ![](https://gyazo.com/ff958820180efd9b316cb42ddd9c0276){gyazo=image} ![](https://gyazo.com/2d0d14ad85109598f389e5ac0ad7b85f){gyazo=image}
