---
layout: page.njk
lang: zh
section: ai-capabilities
slug: segmentation
navId: segmentation
title: "分割"
created: 2026-02-06
updated: 2026-03-02
summary: "为了制作蒙版而区分图像的技术（主要是 SAM 系）"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/4a56caa5986a2c2403dcad74d1bf1874.png"
---

## 什么是分割？

说到分割，其实有很多种类，但在 ComfyUI 的语境下，是指 **制作由点、BBOX、蒙版・文本指定的客体形状的蒙版** 的技术。

---

## 与抠图的区别

你可能会觉得它和抠图很像，但它们之间有以下巨大的区别。

- **抠图 (Matting)**
  - 以“前景”还是“背景”的二选一制作蒙版

- **分割 (Segmentation)**
  - 目的是抠出（制作蒙版）**任意的物体**

那么抠图是分割的下位替代吗？完全不是这样，本来作用就不一样。

-  偏向分类任务的分割
-  可以进行也能表现透明的高品质抠图的抠图技术

---

## SAM

> ![](https://gyazo.com/109335e3e675b7bd8beb9f77bc489829){gyazo=loop}
> [Introducing Meta Segment Anything Model 3 and Segment Anything Playground](https://ai.meta.com/blog/segment-anything-model-3/)

在 ComfyUI 中提到“分割”时，实际被使用的几乎都是 **SAM（Segment Anything）系的模型**。

前面说目的是抠出（制作蒙版）任意的物体，但为了实现这一点，AI 必须在一定程度上理解“那个物体的形状”。

例如桌子上放着一个水果篮，如果想抠出苹果，如果不认识“苹果”的形状，就不知道把哪里算作苹果来处理。实现了这一点的就是 **SAM**。

### 主要模型

- **SAM**
  - Meta 发布的初期模型。
  - 只需点击任意位置，就会返回该区域的蒙版。

- **[HQ-SAM](https://github.com/SysCV/SAM-HQ)**
  - 以 SAM 为基础，提高了蒙版质量的派生模型。

- **SAM 2 / 2.1**
  - 支持视频。可以在视频中一边追踪相同的物体一边输出蒙版。

- **SAM 3**
  - 可能会变成可以用文本指定对象。
  - 到目前为止，因为必须用点或 BBOX 指定对象，所以想要自动制作蒙版的话，必须与物体检测组合使用。

---

## 在 ComfyUI 中的用处

从抠图到 inpainting，在各种各样的场合都会使用。

此外，在 [Segment Anything Playground](https://aidemos.meta.com/segment-anything/gallery) 中，有许多模糊脸部、将背景变成黑白等的例子。（顺便说一下，这些大部分都可以在 ComfyUI 中重现。）

![](https://gyazo.com/8a13dabaec7771795dc4028d6e40abff){gyazo=image}

[](/workflows/ai-capabilities/segmentation/SAM3.json)

在 SAM 2.1 以前，因为无法用文本指定对象，所以经常与 Grounding DINO 或 Florence2 等[物体检测](/zh/ai-capabilities/object-detection/)组合使用。

SAM 3 虽然可以用文本指定，但在物体检测这层意义上，我认为今后也会出现超越 SAM 的模型，所以记住这个组合比较好。

---

## 补充：SAM 以前的分割

在教科书上，分割有如下分类。

> ![](https://gyazo.com/010576fd5cce11b2da01333c92d39ae7){gyazo=image}
> [インスタンスセグメンテーション (Instance Segmentation, 実例分割)](https://cvml-expertguide.net/terms/dl/instance-segmentation/)

- **语义分割 (Semantic Segmentation)**
  - 给每个像素加上“类标签”。
  - person / sky / road / building 等。无论有多少人，全部作为“person”类汇总处理。

- **实例分割 (Instance Segmentation)**
  - 在语义的基础上，区分“每个个体的蒙版”。
  - person_1 / person_2 / person_3 … 像这样个别分割。

SAM 就像是同时在做这两件事，这些在自动驾驶或监控摄像头领域至今也是重要的任务。
