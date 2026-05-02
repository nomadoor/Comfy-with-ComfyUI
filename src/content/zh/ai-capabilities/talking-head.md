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
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---

## 什么是 Talking Head？

Talking Head 是让一张图像或人脸照片看起来像“正在说话的人”那样移动的技术。以输入的图像为基础，利用另外准备的 **参考视频的动作** 或 **音频** 为线索，驱动嘴巴和表情。

它与对口型（Lip Sync）非常相似，但对口型主要是“让原本视频的嘴巴配合音频”。Talking Head 基本上是驱动单张图片，且很多工具主要是基于参考视频的动作而不是音频来驱动。

正如 Talking Head 之名，它是从驱动脸部开始的，但正在向驱动上半身乃至全身的方向进化。

---

## 变形基 Talking Head

### [Thin-Plate Spline Motion Model for Image Animation](https://github.com/yoyo-nb/Thin-Plate-Spline-Motion-Model)

![](https://gyazo.com/8e6de400ea9bc95a25e689483bd6b238){gyazo=image} ![](https://gyazo.com/b38439d333755e724f174fa774f74f71){gyazo=loop} ![](https://gyazo.com/c86570789722d04da913aed1f9ffd268){gyazo=loop}

输入一张图像和正在活动的人的视频，图像侧就会模仿那个动作进行变形。

与其说是 3D 模型，不如说更接近在 2D 状态下“扭曲”的印象。就像 Photoshop 的操控变形一样。

### [LivePortrait](/zh/basic-workflows/liveportrait/)

![](https://gyazo.com/c893e38c12859f8f20ff1e0fca545788){gyazo=image}

[](/workflows/basic-workflows/liveportrait/LivePortrait_i2v_ref.json)

这个也是输入一张图和参考视频，但为了能稳定重现脸部各部分的动作、视线、感情的细微差别等进行了改良。

因为不是扩散模型，所以比较轻，也适合接近实时的处理。此外，因为可以进行“脸稍微朝下”或“眼睛稍微睁大”等编辑，所以现在也经常被使用。

---

## 扩散模型基 Talking Head

到了下一代，出现了使用扩散模型“重绘图像本身”方向的 Talking Head。[X-Portrait](https://byteaigc.github.io/x-portrait/) 或 [HelloMeme](https://songkey.github.io/hellomeme/) 就属于这一系。

![](https://gyazo.com/c70468086a939dce538a876073c9c523){gyazo=loop}

[](/workflows/ai-capabilities/talking-head/HelloMeme_video.json)

它们从参考视频中提取出相当于“头的方向”或“表情变化”的信号，并将其作为条件传递给扩散模型。所做的事情接近于一边用 ControlNet 固定姿势和构图一边生成图像，就像指定“希望用这个动作重绘这个角色的脸”一样。

---

## 视频生成模型基 Talking Head

在更新的一代中，出现了以视频生成模型本身为基础的 Talking Head / Avatar 模型。[OmniAvatar](https://omni-avatar.github.io/) 或 [Wan-Animate](https://humanaigc.github.io/wan-animate/) 就属于这一类。

![](https://gyazo.com/9f0e0e20d750b2e207b01adc56858202){gyazo=image} ![](https://gyazo.com/d7f66b4153473136c37e48c7066709a1){gyazo=loop} ![](https://gyazo.com/86ed4c6aa64af79325ce18359a4021bc){gyazo=loop}
> Wan-Animate

Wan-Animate 是输入角色图像和“带有动作的参考视频”，让角色像描绘那个动作一样移动的模型。

---

## 走向 Human Motion Transfer

当 Talking Head 技术能够稳定处理脸部周围时，自然会变成“也想驱动上半身或全身”。

像 Thin-Plate Spline 这样的老技术，原本就不只用于脸部，也能应用于全身，而且 Wan-Animate 也能完美地处理全身，所以感觉没必要特意和 Talking Head 区分开来，但由于 Human Motion Transfer 也是独自进化而来的，所以稍微看一看吧。

→ [Human Motion Transfer](/zh/ai-capabilities/human-motion-transfer/)
