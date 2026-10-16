---

layout: page.njk
lang: zh
section: ai-capabilities
slug: human-motion-transfer
navId: human-motion-transfer
title: Human Motion Transfer
created: 2026-02-06
updated: 2026-03-02
summary: 将其他视频的动作转移给角色的技术
seoTitle: "Human Motion Transfer：把视频动作转移给角色的 AI"
seoDescription: "把另一段视频的全身动作转移到单张人物图像上的 Human Motion Transfer。介绍 Animate Anyone 之后的发展，以及 Wan2.1 VACE、Wan-Animate 等 DiT 世代模型。"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ""
---

## 什么是 Human Motion Transfer？

Human Motion Transfer 是一种把 **另一段视频中的全身动作转移** 到一张人物图像（或角色图像）上的技术。

我想最常见的用法，是借来舞蹈视频、走路视频里的“动作本身”，让自己的角色来演。

[talking head](/zh/ai-capabilities/talking-head/) 主要针对“脸部到上半身”，细致地匹配表情和嘴部动作；而 Human Motion Transfer 处理的主要是 **全身的姿势**。

---

## Animate Anyone 之后的潮流

[BDMM](https://github.com/rocketappslab/BDMM?tab=readme-ov-file) 等转移动作的研究以前就有，但让这个任务在图像生成 AI 社区里广为人知的，应该是 **[Animate Anyone](https://humanaigc.github.io/animate-anyone/)**。

它的概念是：输入一张人物图像和另一个人的舞蹈视频等，生成“这个角色做出同样动作的全身视频”，当时有大量演示视频流传开来。

不过 Animate Anyone 本身没有开源，所以实际能上手的，是以 Stable Video Diffusion 为基础尝试复现的 **MimicMotion** 等模型。

![](/media/ai-capabilities/human-motion-transfer/legacy_gyazo_1e1bb54d4617ed57e696502727b80092.mp4){media=loop}

[](/workflows/ai-capabilities/human-motion-transfer/mimicmotion.json)

---

## DiT 世代与 Wan-Animate

随着基于 DiT 的视频生成模型出现，Human Motion Transfer 也顺理成章地进化了。

### Wan2.1 VACE

Wan2.1 有一个叫 VACE 的机制。

VACE 是一个在视频生成中统一处理 `ControlNet`、`reference2video`、`inpainting` 的框架。
把 `ControlNet Pose` 和 reference2video 式的操作组合起来，就能做到接近 Human Motion Transfer 的效果。

与其说它是专门的 Human Motion Transfer 模型，不如说是“以 Wan2.1 为底座，用姿势和参考视频来控制动作的基础”。

### Wan-Animate

更专注于动作转移的模型，是 [Wan-Animate](https://humanaigc.github.io/wan-animate/)。

![](/media/ai-capabilities/human-motion-transfer/legacy_gyazo_9f0e0e20d750b2e207b01adc56858202.png){media=image} ![](/media/ai-capabilities/human-motion-transfer/legacy_gyazo_d7f66b4153473136c37e48c7066709a1.mp4){media=loop} ![](/media/ai-capabilities/human-motion-transfer/legacy_gyazo_86ed4c6aa64af79325ce18359a4021bc.mp4){media=loop}

> Wan-Animate

输入角色图像和带有动作的驱动视频，就能转移全身的动作。

它不仅能用全身姿势，还能把“面部特写视频”当作驱动视频，所以特点是 **talking head 式和 Human Motion Transfer 式两种用法都能覆盖**。
