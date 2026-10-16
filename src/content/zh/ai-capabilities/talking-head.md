---
layout: page.njk
lang: zh
section: ai-capabilities
slug: talking-head
navId: talking-head
title: Talking Head
created: 2026-02-06
updated: 2026-03-02
summary: 让单张图片或人脸照片配合参考视频或音频说话的技术
seoTitle: "什么是 Talking Head？让单张图说话的 AI"
seoDescription: "让单张图像或人脸照片配合参考视频或音频说话的 Talking Head 技术。讲解与 Lip Sync 的区别，以及 LivePortrait 等变形式、扩散模型式和视频生成模型式的方法。"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---

## 什么是 Talking Head？

Talking Head 是让一张图像或人脸照片动起来、看起来像“正在说话的人”的技术。它以另外准备的 **参考视频的动作** 或 **音频** 为线索，驱动输入图像的嘴部和表情。

它和对口型（Lip Sync）很像，但对口型主要是“让现有视频里的嘴配合音频”。Talking Head 基本上是让单张图像动起来，而且很多是以参考视频的动作、而不是音频为主要驱动来源。

正如 Talking Head 这个名字，它是从驱动脸部开始的，但正在朝驱动上半身乃至全身的方向进化。

---

## 基于变形的 Talking Head

### [Thin-Plate Spline Motion Model for Image Animation](https://github.com/yoyo-nb/Thin-Plate-Spline-Motion-Model)

![](/media/ai-capabilities/talking-head/legacy_gyazo_8e6de400ea9bc95a25e689483bd6b238.png){media=image} ![](/media/ai-capabilities/talking-head/legacy_gyazo_b38439d333755e724f174fa774f74f71.mp4){media=loop} ![](/media/ai-capabilities/talking-head/legacy_gyazo_c86570789722d04da913aed1f9ffd268.mp4){media=loop}

输入一张图像和一段人在动的视频，图像就会跟着模仿那个动作发生变形。

它做的事与其说是 3D 模型，不如说更像是在 2D 状态下把图像“揉来揉去”。有点像 Photoshop 的操控变形。

### [LivePortrait](/zh/basic-workflows/liveportrait/)

![](/media/ai-capabilities/talking-head/legacy_gyazo_c893e38c12859f8f20ff1e0fca545788.mp4){media=loop}

[](/workflows/basic-workflows/liveportrait/liveportrait_i2v_ref.json)

它同样输入一张图和参考视频，但做了不少改进，能稳定地还原面部各部位的动作、视线和情绪的细微变化。

它不是扩散模型，所以比较轻，也适合接近实时的用途。另外，它还能做“脸稍微朝下一点”“眼睛稍微睁大一点”之类的编辑，所以现在仍然很常用。

---

## 基于扩散模型的 Talking Head

到了下一代，出现了用扩散模型“把画面本身重新画一遍”的 Talking Head，比如 [X-Portrait](https://byteaigc.github.io/x-portrait/)、[HelloMeme](https://songkey.github.io/hellomeme/) 这一类。

![](/media/ai-capabilities/talking-head/legacy_gyazo_c70468086a939dce538a876073c9c523.mp4){media=loop}

[](/workflows/ai-capabilities/talking-head/hellomeme_video.json)

它们从参考视频中提取相当于“头部朝向”“表情变化”的信号，作为条件交给扩散模型。这和用 ControlNet 固定姿势与构图来生成图像很接近，相当于在指定“请用这个动作，把这个角色的脸重新画出来”。

---

## 基于视频生成模型的 Talking Head

更新的一代，出现了以视频生成模型本身为基础的 Talking Head / Avatar 模型。[OmniAvatar](https://omni-avatar.github.io/)、[Wan-Animate](https://humanaigc.github.io/wan-animate/) 就属于这一路线。

![](/media/ai-capabilities/human-motion-transfer/legacy_gyazo_9f0e0e20d750b2e207b01adc56858202.png){media=image} ![](/media/ai-capabilities/human-motion-transfer/legacy_gyazo_d7f66b4153473136c37e48c7066709a1.mp4){media=loop} ![](/media/ai-capabilities/human-motion-transfer/legacy_gyazo_86ed4c6aa64af79325ce18359a4021bc.mp4){media=loop}
> Wan-Animate

Wan-Animate 以角色图像和“带有动作的参考视频”为输入，让角色照着那个动作动起来。

---

## 走向 Human Motion Transfer

当 Talking Head 技术能稳定地处理脸部一带之后，自然就会想“上半身和全身也想动起来”。

像 Thin-Plate Spline 这样的老技术，本来就不只能用于脸部，也能用于全身；Wan-Animate 更是能完美地处理全身，所以感觉没必要特意和 Talking Head 区分开。不过 Human Motion Transfer 也有它自己的一条进化路线，我们稍微看一下吧。

→ [Human Motion Transfer](/zh/ai-capabilities/human-motion-transfer/)
