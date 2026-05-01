---
layout: page.njk
lang: zh
section: ai-capabilities
slug: sampling
navId: sampling
title: 采样 (Sampling)
summary: 决定以何种步骤减少噪点的机制
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## 什么是采样 (Sampling)？

![](https://gyazo.com/bf9d6d2e5b528f0b82f9d13e3c18c5fa){gyazo=image}

[扩散模型](/zh/ai-capabilities/diffusion-models/) 并不是一下子消除噪点的，而是一边进行多次稍微减少一点噪点的步骤，一边制作图像。

在学习时确实是将步骤分得非常细，每次逐渐增加一点噪点，但如果在生成时也以同样的细度一步步消除噪点，步数就会过多，无法在现实的时间内完成。

因此，在实际生成中，会将原本分得更细的噪点阶段，重新整理为几个代表性的步骤，例如在 20 步左右完成。

此时，将整体分为几步、1 步减少多少噪点，这种决定如何减少噪点的整体机制，在本网站中称为 **采样 (Sampling)**。

---

## 采样器和调度器

在 ComfyUI 中，Sampling 分为两个要素进行设置。

### 采样器 (Sampler)

根据当前状态和模型预测，决定如何进入下一步的算法。

- **Euler**：直接应用 1 步的变化量
- **DPM 系**：参考过去的步骤进行智能修正

此外，为了以尽可能少的步数完成且保证质量，人们发明了数量惊人的采样器，但只要记住 2～3 个就足够了。

### 调度器 (Scheduler)

决定“在整体步骤的哪个阶段，减少多少噪点”的 **时间表**。

扩散模型在学习时，是以一边一点点改变噪点水平，一边连续破坏图像为前提进行学习的。如果照样以同样的细度去除噪点，步数会变得太多，所以在实际生成时，会“在那个轨道上只选取几个噪点水平作为代表”进行计算。
调度器决定了是在早期阶段大幅减少，还是将后半段用于微调这样的分配。

---

## 对质量有多大影响？

Sampling 对画质并非没有影响，但即使专注于此设置，质量也不会提高那么多。

基本上选择 **Euler + normal 或 Simple / 20step** 就可以了。

### 注意不兼容的组合

但是，根据采样器、调度器、CFG、步数的组合，有时可能无法顺利生成。

参考: [Stable Diffusion Deep Dive - CFG - Don't Accidentally Fry Your Images](https://www.youtube.com/watch?v=kuhO9zAzetk)


> ![](https://gyazo.com/2726d797e03185230ce53475d48d707b){gyazo=image}

按照这张图，例如 **DPM++ 2M Karras 20step 如果 CFG 超过 25 就是红灯**。

实际生成一下就会发现生成的图像质量很差。

- DPM++ 2M Karras / Step 数 20 / **CFG 8**
  ![](https://gyazo.com/262e228b7207b827b105bfad833d3ac5){gyazo=image}

- DPM++ 2M Karras / Step 数 20 / **CFG 30**
  ![](https://gyazo.com/375e367784f6446fcc1e4a0a93fbc0cb){gyazo=image}

除了 CFG 以外的原因，有时也会生成像这样饱和度过高的图像。这种图像有时被称为 **over-saturated colors** 或 **burn out**。

反过来说，如果生成了这样的图像，可能是采样器或 CFG 的组合不好。请确认这些参数。

---

## 用于高速化的 Sampling（LCM 系等）

通常的扩散模型需要花费 20 步左右来减少噪点，但也有一些模型通过重新学习，能在 1 到数步内近似完成原模型“20 步”所做的变化。

这些模型被称为 **高速化蒸馏模型**。代表性的有 LCM（Latent Consistency Model）和 Lightning 系等。

起初是以与专用采样器（LCM 采样器等）组合使用为前提的，但最近的模型已经调整为可以使用 Euler 等通用采样器运行。

特别需要注意的一点是，它们通常是以 `CFG = 1` 为前提进行学习的。
也就是说，如果设置大于 1 的 CFG，可能会像上面进行的实验一样变成 **over-saturated colors**，或者无法正确生成。请注意。
