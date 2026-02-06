---

layout: page.njk
lang: zh
section: ai-capabilities
slug: human-motion-transfer
navId: human-motion-transfer
title: Human Motion Transfer
summary: 将其他视频的动作转移给角色的技术
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
image:
------

## 什么是 Human Motion Transfer？

Human Motion Transfer 是将 **其他视频的全身动作转移** 到一张人物图像（或角色图像）上的技术。

我想很多用法是借用舞蹈视频或走路视频的“动作”，让自己的角色来表演。

与 [talking head](/zh/ai-capabilities/talking-head/) 主要以“脸〜上半身”为对象、细致地匹配表情和嘴部动作相对，Human Motion Transfer 主要处理 **全身的姿势**。

---

## Animate Anyone 之后的潮流

虽然像 [BDMM](https://github.com/rocketappslab/BDMM?tab=readme-ov-file) 等，以前就存在转移动作的研究，但在图像生成 AI 社区中并没有广泛传播，让这个任务广为人知的应该是 **[Animate Anyone](https://humanaigc.github.io/animate-anyone/)**。

以一张人物图像和另一个人物的舞蹈视频等作为输入，生成“该角色做同样动作的全身视频”为概念，流传了许多演示视频。

但是 Animate Anyone 本身没有开源，所以作为实际能接触到的模型，出现了以 Stable Video Diffusion 为基础试图重现的 **MimicMotion** 等模型。

![](https://gyazo.com/1e1bb54d4617ed57e696502727b80092){gyazo=loop}

[](/workflows/ai-capabilities/human-motion-transfer/MimicMotion.json)

---

## DiT 世代和 Wan-Animate

随着基于 DiT 的视频生成模型的登场，Human Motion Transfer 也在顺理成章地进化。

### Wan2.1 VACE

Wan2.1 中有一种被称为 VACE 的机制。

VACE 是在视频生成中可以汇总处理 `ControlNet`、`reference2video`、`inpainting` 的框架。
通过组合 `ControlNet Pose` 和 reference2video 式的操作，可以做到接近 Human Motion Transfer 的事情。

与其说是专用的 Human Motion Transfer 模型，不如说是作为“以 Wan2.1 为基础，使用姿势和参考视频控制动作的平台”来使用。

### Wan-Animate

更专注于动作转移的模型是 [Wan-Animate](https://humanaigc.github.io/wan-animate/)。

![](https://gyazo.com/9f0e0e20d750b2e207b01adc56858202){gyazo=image} ![](https://gyazo.com/d7f66b4153473136c37e48c7066709a1){gyazo=loop} ![](https://gyazo.com/86ed4c6aa64af79325ce18359a4021bc){gyazo=loop}

> Wan-Animate

输入角色图像和带有动作的驱动视频，可以转移全身的动作。

不仅是全身的姿势，还可以使用“面部特写视频”作为驱动，因此特征是 **可以覆盖 talking head 式的用法和 Human Motion Transfer 式的用法两者**。
