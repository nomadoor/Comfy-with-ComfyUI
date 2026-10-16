---
layout: page.njk
lang: zh
section: ai-capabilities
slug: object-detection
navId: object-detection
title: 物体检测
created: 2026-02-06
updated: 2026-03-02
summary: "找出图像中“有什么”“在哪里”的技术"
seoTitle: "什么是物体检测？YOLO、Grounding DINO、Florence-2"
seoDescription: "找出图像中“有什么、在哪里”的物体检测。介绍 YOLO 系与 DETR 系，用文本指定对象的 Grounding DINO 和 Florence-2，以及在 ComfyUI 中作为生成蒙版第一步的用法。"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: 'https://i.gyazo.com/1a10dcd7dcf8f72eee275a3d8484f882.png'
---

## 什么是物体检测？

物体检测（Object Detection）是找出图像中“拍到了什么（类别）”“在哪里（位置）”的任务。

一般会为每个物体输出边界框（矩形）和标签。

在 ComfyUI 中，它主要作为生成蒙版的入口。
从图像里检测出狗再把它去掉，或者只检测出脸来精修……总之是出场机会非常多的技术。

---

## 代表性方法

物体检测这个领域本身有各种各样的流派，但从 ComfyUI 的角度来看，以下几种比较有代表性。

### YOLO 系

用于检测特定物体（车、人、狗等）的一组模型，历史悠久且性能强大。

![](/media/ai-capabilities/object-detection/legacy_gyazo_2b694eacfaee03e50818eb87174f0ef9.png){media=image}

[](/workflows/ai-capabilities/object-detection/yolo8.json)

* 速度快得惊人，轻量到可以用于实时处理。
* 事先针对“人”“车”等一组固定的类别进行训练，再从中检测。
- 没有现成模型的话，需要自己训练。

### DETR 系

不用 CNN，而是用 Transformer 的检测模型。
在 ComfyUI 中直接用到它的机会几乎没有，但在物体检测相关的内容里应该会看到这个名字。

---

## 用文本进行物体检测

上面的检测器只能检测预先定好的类别，所以一旦要检测人、车这类常见物体以外的东西，马上就不好用了。

对 ComfyUI 来说更重要的，是 **能用文本指定物体** 的那类检测。

### Grounding DINO

* 用图像编码器＋文本编码器，把图像和文本的特征对应起来的模型。
* “red car”“traffic light”等，用提示词（文本）指定什么，就能检测什么。

### Florence-2

![](/media/ai-capabilities/object-detection/legacy_gyazo_9efa0561eb445e5b300aaf3abb76f526.png){media=image}

[](/workflows/ai-capabilities/object-detection/florence_2.json)

* 一个通用的 VLM，看图就能完成描述生成、物体检测、分割等，一个模型身兼数职。
* 它的结构接近 LLM，所以强项是能用比 Grounding DINO 更复杂的句子来下指令。

---

## 在 ComfyUI 中的用法（用于生成蒙版）

在 ComfyUI 中，物体检测几乎都是作为 **生成蒙版的入口** 来用的。

不过，物体检测模型输出的只有 BBOX（矩形）。

光是这样，用 inpainting 去除物体之类也已经够用了；但比如检测人物时，框里大部分区域其实是背景，拿来当蒙版有点浪费。

所以这些检测结果通常不会单独使用，而是和后面的抠图、分割配合使用。接下来我们就来看看这些。

## 相关

- [使用 AI 生成蒙版](/zh/data-utilities/ai-mask-generation/)
