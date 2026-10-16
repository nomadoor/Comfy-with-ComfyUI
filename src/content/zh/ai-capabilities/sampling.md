---
layout: page.njk
lang: zh
section: ai-capabilities
slug: sampling
navId: sampling
title: 采样 (Sampling)
created: 2026-02-06
updated: 2026-03-27
summary: 决定按什么步骤去除噪声的机制
seoTitle: "什么是采样器与调度器？Sampling 的原理"
seoDescription: "决定扩散模型如何逐步去除噪声的 Sampling。讲解采样器与调度器的区别、对画质影响有多大、不宜搭配的组合，以及 LCM 等加速用采样。"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## 什么是采样 (Sampling)？

![](/media/ai-capabilities/sampling/legacy_gyazo_bf9d6d2e5b528f0b82f9d13e3c18c5fa.png){media=image}

[扩散模型](/zh/ai-capabilities/diffusion-models/) 并不是一口气把噪声去掉，而是把“稍微去掉一点噪声”这一步重复很多次，逐渐生成图像。

训练时，步骤确实分得非常细，噪声是一点点加上去的；但如果生成时也按同样的粒度一步步去噪，步数就太多了，没法在可接受的时间内完成。

所以在实际生成时，会把原本分得更细的噪声阶段重新归并成几个有代表性的步骤，比如 20 步左右就能完成。

这时“总共分成几步、每一步去掉多少噪声”等关于如何去噪的整套决定方式，本站统称为 **采样 (Sampling)**。

---

## 采样器和调度器

在 ComfyUI 中，Sampling 分成两个要素来设置。

### 采样器 (Sampler)

根据当前状态和模型的预测，决定如何走到下一步的算法。

- **Euler**：把一步的变化量直接套用上去
- **DPM 系**：还会参考之前的步骤，聪明地加以修正

为了用尽量少的步数得到干净的结果，人们不断改进，发明了多得离谱的采样器，不过记住两三个就足够了。

### 调度器 (Scheduler)

决定“在全部步骤中的哪个阶段、去掉多少噪声”的 **时间表**。

扩散模型训练时，是以一点点改变噪声水平、连续地破坏图像为前提的。如果按同样的粒度去噪，步数就太多了，所以实际生成时，只会“从这条轨迹上挑出几个噪声水平作为代表”来计算。
调度器决定的就是这种分配：是在前期大幅去噪，还是把后半段留给细微调整。

---

## 对质量的影响有多大？

Sampling 并非对画质毫无影响，但在这个设置上再怎么讲究，质量也不会提高多少。

基本上选择 **Euler + normal 或 Simple / 20step** 就可以了。

### 小心不合适的组合

不过，采样器、调度器、CFG 和步数的某些组合，可能会导致生成失败。

参考: [Stable Diffusion Deep Dive - CFG - Don't Accidentally Fry Your Images](https://www.youtube.com/watch?v=kuhO9zAzetk)


> ![](/media/ai-capabilities/sampling/legacy_gyazo_2726d797e03185230ce53475d48d707b.png){media=image}

按照这张图，比如 **DPM++ 2M Karras 20step 时，CFG 超过 25 就亮红灯了**。

实际生成看看，就会发现图像质量确实很差。

- DPM++ 2M Karras / Step 数 20 / **CFG 8**
  ![](/media/ai-capabilities/sampling/legacy_gyazo_262e228b7207b827b105bfad833d3ac5.png){media=image}

- DPM++ 2M Karras / Step 数 20 / **CFG 30**
  ![](/media/ai-capabilities/sampling/legacy_gyazo_375e367784f6446fcc1e4a0a93fbc0cb.png){media=image}

CFG 以外的原因，有时也会生成这种饱和度过高的图像。这样的图像有时被称为 **over-saturated colors** 或 **burn out**。

反过来说，如果生成了这样的图像，可能是采样器或 CFG 的组合不好，请检查一下这些参数。

---

## 用于加速的 Sampling（LCM 系等）

一般的扩散模型要花 20 步左右来去噪，但也有一些模型经过重新训练，能用 1 到几步近似原模型“20 步”所做的变化。

这类模型称为 **加速蒸馏模型**，代表有 LCM（Latent Consistency Model）和 Lightning 系等。

起初它们需要搭配专用采样器（LCM 采样器等）使用，但最近的模型已经调整成用 Euler 等通用采样器也能跑。

特别要注意的是，它们大多是以 `CFG = 1` 为前提训练的。
也就是说，如果把 CFG 设得大于 1，就可能像上面的实验那样出现 **over-saturated colors**，或者无法正常生成。请多加注意。
