---
layout: page.njk
lang: zh
section: data-utilities
slug: data-types
navId: data-types
title: "数据类型"
created: 2026-02-06
updated: 2026-03-02
summary: "关于 ComfyUI 处理的主要数据类型"

permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 什么是类型？

就是指 **“数据的种类”**。

如果是图像就是“图像数据”，如果是文本就是“文本数据”，如果是数值就是“数值数据”。

虽然在学习编程时这一点很重要，但 ComfyUI 的设计是 **“只能连接到能连接的地方”**，所以老实说没必要考虑得太深入。

因此，几乎不会发生因连接了错误的数据类型而报错的情况，但也并非完全没有，所以我们还是简单了解一下这个“类型”的概念吧。

---

## 基本数据类型

只要学习图像生成 AI 的机制，自然就会明白。没必要在这里拼命死记硬背。

![](https://gyazo.com/6cc70d5d04c3daec2682adf3bc41c77f){gyazo=image}

- MODEL (模型)
- CLIP (条件)
- VAE (潜在空间)
- CONDITIONING (条件)
- LATENT (潜在空间)
- IMAGE (图像)
- MASK (蒙版)

### Primitive (基础) 数据类型

即数值或文字本身。

- **INT** (整数)
  - `1`, `20`, `1024` 等整数。
- **FLOAT** (浮点数)
  - `1.5`, `0.75` 等小数。
- **STRING** (文本)
  - 字符串。提示词输入栏等就属于这一类。

---

## 独自定义的类型

由于 ComfyUI 具有很高的扩展性，根据自定义节点的不同，有时会追加独特的“类型”。

![](https://gyazo.com/d5368ee02f84395613526515c34c458d){gyazo=image}

例如，在著名的 **Impact Pack** 中，会出现名为 `SEGS` 的独特类型。

虽然它是将几个数据打包在一起，但即便如此，它们也只能连接到能连接的地方。

如果感到困惑，就试着拉一根线看看。**只要连上了就 OK！**

---

## Preview as Text 节点

这是用于将任意数据作为文本进行预览的节点。

![](https://gyazo.com/423eaa0eac26fefe67f5d212a1ab2ad1){gyazo=image}

[](/workflows/begin-with/data-types/Preview_as_Text.json)


作为调试，有很多机会显示数字或文本。

虽然不知道是否会用到，但图像或潜在表现等也可以作为文本进行确认。
