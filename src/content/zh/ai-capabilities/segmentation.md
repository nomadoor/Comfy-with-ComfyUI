---
layout: page.njk
lang: zh
section: ai-capabilities
slug: segmentation
navId: segmentation
title: "分割"
created: 2026-02-06
updated: 2026-03-02
summary: "为制作蒙版而把图像分成不同区域的技术（主要是 SAM 系）"
seoTitle: "什么是分割？用 SAM 制作蒙版的技术"
seoDescription: "根据点、BBOX 或文本指定的物体生成对应形状蒙版的分割技术。讲解与抠图的区别、Segment Anything（SAM）系列主要模型，以及在 ComfyUI 中的用法。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/ai-capabilities/segmentation/legacy_gyazo_4a56caa5986a2c2403dcad74d1bf1874.png"
---

## 什么是分割？

说到分割，其实有很多种类，但在 ComfyUI 的语境下，指的是 **根据点、BBOX、蒙版或文本指定的物体，生成该物体形状的蒙版** 的技术。

---

## 与抠图的区别

你可能会觉得它和抠图很像，但两者有下面这些很大的区别。

- **抠图 (Matting)**
  - 在“前景”和“背景”之间二选一来制作蒙版

- **分割 (Segmentation)**
  - 目的是抠出 **任意物体**（制作它的蒙版）

那么，抠图是分割的低配版吗？完全不是，两者的作用本来就不同。

-  分割更偏向分类任务
-  抠图能做出连透明感都能表现的高质量抠图

---

## SAM

> ![](/media/ai-capabilities/segmentation/legacy_gyazo_109335e3e675b7bd8beb9f77bc489829.mp4){media=loop}
> [Introducing Meta Segment Anything Model 3 and Segment Anything Playground](https://ai.meta.com/blog/segment-anything-model-3/)

在 ComfyUI 中提到“分割”，实际用的几乎都是 **SAM（Segment Anything）系的模型**。

前面说过，目的是抠出任意物体（制作蒙版），但要做到这一点，AI 必须在一定程度上理解“这个物体的形状”。

比如桌上放着一个水果篮，想把苹果抠出来，如果不知道“苹果”长什么样，就不知道哪一部分该算作苹果。实现了这一点的就是 **SAM**。

### 主要模型

- **SAM**
  - Meta 发布的最早的模型。
  - 只要点击任意位置，就会返回该区域的蒙版。

- **[HQ-SAM](https://github.com/SysCV/SAM-HQ)**
  - 在 SAM 的基础上提高了蒙版质量的派生模型。

- **SAM 2 / 2.1**
  - 支持视频。可以在视频中持续追踪同一个物体并输出蒙版。

- **SAM 3**
  - 可以用文本来指定对象了。
  - 在此之前必须用点或 BBOX 指定对象，所以想自动生成蒙版，就得和物体检测组合使用。

---

## 在 ComfyUI 中的用法

从抠图到 inpainting，几乎所有场景都会用到。

另外，[Segment Anything Playground](https://aidemos.meta.com/segment-anything/gallery) 里还有很多例子，比如给人脸打码、把背景变成黑白等。（顺便一提，其中大部分都能在 ComfyUI 中复现。）

![](/media/ai-capabilities/segmentation/legacy_gyazo_8a13dabaec7771795dc4028d6e40abff.png){media=image}

[](/workflows/ai-capabilities/segmentation/sam3.json)

SAM 2.1 及之前的版本无法用文本指定对象，所以常和 Grounding DINO、Florence2 等[物体检测](/zh/ai-capabilities/object-detection/)组合使用。

SAM 3 虽然能用文本指定，但单论物体检测，我想今后还会出现比 SAM 更强的模型，所以这个组合还是记住为好。

---

## 补充：SAM 之前的分割

按教科书的说法，分割有以下几类。

> ![](/media/ai-capabilities/segmentation/legacy_gyazo_010576fd5cce11b2da01333c92d39ae7.png){media=image}
> [インスタンスセグメンテーション (Instance Segmentation, 実例分割)](https://cvml-expertguide.net/terms/dl/instance-segmentation/)

- **语义分割 (Semantic Segmentation)**
  - 给每个像素打上“类别标签”。
  - person / sky / road / building 等。不管有几个人，都统一归为“person”类。

- **实例分割 (Instance Segmentation)**
  - 在语义分割的基础上，再按“每个个体”分出蒙版。
  - 像 person_1 / person_2 / person_3 … 这样逐个分开。

SAM 相当于同时在做这两件事，不过它们在自动驾驶、监控摄像头等领域至今仍是重要的任务。
