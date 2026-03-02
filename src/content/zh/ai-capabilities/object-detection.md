---
layout: page.njk
lang: zh
section: ai-capabilities
slug: object-detection
navId: object-detection
title: 物体检测
summary: "找出图像中即“有什么”“在哪里”的技术"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: 'https://i.gyazo.com/1a10dcd7dcf8f72eee275a3d8484f882.png'
---

## 什么是物体检测？

物体检测（Object Detection）是找出图像中“拍到了什么（类）”“在哪里（位置）”的任务。

一般会为每个物体输出边界框（长方形）和标签。

在 ComfyUI 中，主要作为生成蒙版的入口使用。
从图像中检测出狗并消除，或者只检测出脸并进行优化……总之是出场率很高的技术。

---

## 代表性手法

在原本的物体检测世界中有各种各样的系统，但从 ComfyUI 的视角来看，以下是代表性的。

### YOLO 系

用于检测特定物体（车、人、狗等）的，传统且强大的模型群。

![](https://gyazo.com/2b694eacfaee03e50818eb87174f0ef9){gyazo=image}

[](/workflows/ai-capabilities/object-detection/yolo8.json)

* 压倒性地高速，轻量到可以用于实时处理。
* 针对预先决定的类集合（如“人”、“车”等）进行学习，并从中进行检测。
- 如果没有模型，需要自己进行训练。

### DETR 系

不是使用 CNN 而是使用 Transformer 的检测模型。
在 ComfyUI 中直接处理的机会几乎没有，但在物体检测的语境下应该会看到名字。

---

## 文本物体检测

上面的检测器只能检测预先决定的类，因此如果试图检测人和车等代表性物体以外的东西，一下子就会变得很难用。

对 ComfyUI 来说重要的，是 **可以用文本指定物体的类型** 的检测。

### Grounding DINO

* 图像编码器＋文本编码器，将图像和文本的特征对应起来的模型。
* “red car”、“traffic light”等，可以检测任何用提示词（文本）指示的东西。

### Florence-2

![](https://gyazo.com/9efa0561eb445e5b300aaf3abb76f526){gyazo=image}

[](/workflows/ai-capabilities/object-detection/Florence-2.json)

* 观察图像进行描述生成・物体检测・分割等，一个模型能扮演多个角色的通用 VLM。
* 因为拥有接近 LLM 的结构，所以比起 Grounding DINO，可以用更复杂的文章进行指示是它的强项。

---

## 在 ComfyUI 中的用处（作为蒙版生成）

在 ComfyUI 中，物体检测几乎都是作为 **蒙版生成的入口** 来使用的。

话虽如此，从物体检测模型输出的只有 BBOX（长方形）。

虽然光是这个对于通过 inpainting 去除对象等也很有用，但例如检测到人时，其中大部分区域是背景，作为蒙版使用稍微有点浪费。

因此，这些检测结果很多时候不单独使用，而是与后续的抠图或分割并用。接下来让我们看看那些。

## 相关

- [使用 AI 生成蒙版](/zh/data-utilities/ai-mask-generation/)
