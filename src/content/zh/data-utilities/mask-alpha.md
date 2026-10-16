---
layout: page.njk
lang: zh
section: data-utilities
slug: mask-alpha
navId: mask-alpha
title: "蒙版与 Alpha 通道"
created: 2026-02-06
updated: 2026-03-02
summary: "蒙版的概念，以及透明图像的处理方式"
seoTitle: "ComfyUI 的蒙版与 Alpha 通道（透明）"
seoDescription: "ComfyUI 中蒙版与透明图像的处理。讲解用黑白指定处理范围的蒙版含义、与 Alpha 通道的关系、与一般软件的差异、RGBA 的合并与拆分，以及混用 RGB 导致的错误。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/data-utilities/mask-alpha/legacy_gyazo_bd1a30f0d9562418f2fd74c7d9dd6f1e.png"
---

## 什么是蒙版？

![](/media/data-utilities/mask-alpha/legacy_gyazo_bd1a30f0d9562418f2fd74c7d9dd6f1e.png){media=image}

蒙版是一张黑白图像，用来指定图像的哪些部分 **“要处理 / 要排除”**。

- **白**: 处理（应用）
- **黑**: 不处理（保护）
- **灰**: 调整强度（※取决于功能）

### AI 中的蒙版

![](/media/data-utilities/mask-alpha/legacy_gyazo_3b4d37c9bb4a46d514f2fc77234718f8.png){media=image}

在图像生成 AI 中，蒙版主要用于只重绘图像局部的 **Inpainting**。

AI 只重新生成白色部分，黑色部分则原样保留原图。

> [!WARNING]
> 普通的 Inpainting 无法处理灰色（半透明）蒙版，会被自动当成非白即黑的二值来处理。
>
> 如果想用带渐变的蒙版做出“稍微变化一点”这样的效果，就需要用到 **Differential Diffusion** 这种特殊技术。

---

## 什么是 Alpha 通道？

![](/media/data-utilities/mask-alpha/legacy_gyazo_cf9be566f77d85571b29a2b5597121cb.png){media=image}

普通图像用 **R(红)、G(绿)、B(蓝)** 3 个通道来表示颜色，而背景透明的图像（PNG 等）还额外包含一个 **A(Alpha)** 通道。
它就是负责透明度的信息。

### ComfyUI 中透明图像的处理方式

这里稍微有点绕：Stable Diffusion 本身无法直接处理透明图像。
因此，把透明 PNG 图像读入 ComfyUI 时，它会在内部被拆分成 **“RGB 图像”和“蒙版”** 两部分。

![](/media/data-utilities/mask-alpha/legacy_gyazo_dbe187645fd186d20f936f226a79b926.png){media=image}

让我们来看看 `Load Image` 节点的输出。

- **IMAGE (RGB)**
  - Alpha 通道的信息会丢失，原本透明的部分会被填成 **黑色**。
- **MASK**
  - 提取出 Alpha 通道（透明度）的信息。
  - 在 ComfyUI 中，**原本透明的部分显示为“白色”**。

### 注意与一般软件的区别

![](/media/data-utilities/mask-alpha/legacy_gyazo_e3ba8dcc1452e3ed88512250b0c81d06.png){media=image}


很多软件生成蒙版时是“透明部分＝黑色”，习惯了 Photoshop、Affinity Photo 等图像编辑软件的人可能会有点混乱，请把它们当成两回事。

按照“要处理的是蒙版的白色部分 → 白色部分被加上 Alpha 通道，变成透明图像”这个流程来理解，应该会容易一些。

---

## RGBA 的合并与拆分

处理完成后，如果想让背景重新变透明再保存，该怎么做呢？

![](/media/data-utilities/mask-alpha/legacy_gyazo_b05103b1633b9a4b0fbfdd96063499c2.png){media=image}

[](/workflows/data-utilities/mask-alpha/join_split_image_with_alpha.json)

### 🟨Join Image With Alpha 节点

把 `IMAGE`（RGB 图像）和 `MASK` 合并，转换成一张 **RGBA 图像（透明图像）**。
再把它连到 `Save Image` 节点，就能保存为透明 PNG。

### 🟪Split Image With Alpha 节点

反过来，这个节点会把 RGBA 图像拆分成 RGB 和 MASK。

---

## 🚨 报错陷阱：混淆 RGBA 和 RGB

在 ComfyUI 的连线上，RGB 图像(3 通道)和 RGBA 图像(4 通道)都以同一种 **`IMAGE`** 类型传递，光看是分辨不出来的。

但是，AI（KSampler 或 VAE）基本上只接受 3 通道的 RGB 图像。
所以，如果不小心把经过 `Join Image With Alpha` 的 RGBA 图像连到 `VAE Encode` 等节点，就会出现下面这样的错误。

```bash
RuntimeError: Given groups=1, ... expected input to have 3 channels, but got 4 channels instead
```

如果被骂“说好的 3 通道，怎么来了 4 通道！”，就先怀疑一下是不是哪里把图像变成了 RGBA。

抠图去背景之类的自定义节点，输出有时会突然变成 RGBA。
