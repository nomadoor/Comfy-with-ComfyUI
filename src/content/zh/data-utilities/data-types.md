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
seoTitle: "ComfyUI 数据类型：IMAGE、LATENT、MASK 等"
seoDescription: "ComfyUI 节点处理的主要数据类型：INT、STRING 等基本类型，IMAGE、LATENT、MASK、CONDITIONING 等 ComfyUI 特有类型，以及查看内容的 Preview as Text 节点。"

permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 什么是类型？

就是指 **“数据的种类”**。

比如图像就是“图像数据”，文本就是“文本数据”，数值就是“数值数据”。

学编程时这一点很重要，但 ComfyUI 被设计成 **“只能连到能连的地方”**，所以说实话不用想得太深。

因此，因为连错数据类型而报错的情况几乎不会发生，不过也不是完全没有，还是简单了解一下“类型”这个概念吧。

---

## 基本数据类型

随着学习图像生成 AI 的原理，自然就会明白。没必要在这里拼命记。

![](/media/data-utilities/data-types/legacy_gyazo_6cc70d5d04c3daec2682adf3bc41c77f.png){media=image}

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

## 独有的类型

ComfyUI 的扩展性很高，有些自定义节点会添加自己独有的“类型”。

![](/media/data-utilities/data-types/legacy_gyazo_d5368ee02f84395613526515c34c458d.png){media=image}

例如，有名的 **Impact Pack** 里就有一个叫 `SEGS` 的独有类型。

它把好几种数据打包在了一起，但即便如此，也还是只能连到能连的地方。

拿不准的时候，先拉根线试试。**连得上就 OK！**

---

## Preview as Text 节点

这是用于将任意数据作为文本进行预览的节点。

![](/media/data-utilities/data-types/legacy_gyazo_423eaa0eac26fefe67f5d212a1ab2ad1.png){media=image}

[](/workflows/begin-with/data-types/preview_as_text.json)


调试时，经常需要显示数字或文本。

不知道会不会用到，不过图像、潜在表示等也可以作为文本来查看。
