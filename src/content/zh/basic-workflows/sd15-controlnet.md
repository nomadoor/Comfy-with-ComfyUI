---
layout: page.njk
lang: zh
section: basic-workflows
slug: sd15-controlnet
navId: sd15-controlnet
title: "ControlNet"
created: 2025-12-08
updated: 2026-08-26
summary: "使用姿势或线稿控制图像生成"
seoTitle: "在 ComfyUI 中使用 ControlNet：Stable Diffusion 1.5"
seoDescription: "在 Stable Diffusion 1.5 上用 ControlNet 通过姿势和线稿控制图像生成。介绍 Scribble 工作流、用 start_percent / end_percent 调整控制强度，以及主要 ControlNet 类型。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
tags: ["controlnet"]
hero:
  image: "/media/basic-workflows/sd15-controlnet/legacy_gyazo_81753915732cf767995f1b35ac827b5d.png"
---

## 什么是 ControlNet？

生成 AI 擅长学习各种事物之间的关系。
text2image 让模型记住的是“噪声 ↔ 图像”的关系，但换成噪声以外的东西也一样可以

- 学习 **线稿 ↔ 图像** 的配对 → 就能给线稿自动上色
- 学习 **火柴人 ↔ 图像** 的配对 → 就能指定姿势生成图像
- 学习 **深度图 ↔ 图像** 的配对 → 就能根据深度信息生成图像

**ControlNet** 是实现这些的技术之一。

---

## SD1.5 × ControlNet Scribble

ControlNet 的种类多得数不清，先来试试“scribble”吧。  
scribble 模型是根据“随手画的涂鸦”生成图像的 ControlNet。

### 下载 ControlNet 模型

- [control_v11p_sd15_scribble_fp16.safetensors](https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/blob/main/control_v11p_sd15_scribble_fp16.safetensors)
- ```
  📂ComfyUI/
    └── 📂models/
        └── 📂controlnet/
            └── control_v11p_sd15_scribble_fp16.safetensors
  ```

### 工作流

![](/media/basic-workflows/sd15-controlnet/legacy_gyazo_885feaa8a1857c09ce11977ad9d424c2.png){media=image}

[](/workflows/basic-workflows/sd15-controlnet/sd1_5_controlnet_scribble.json)

- 🟩 向 `Apply ControlNet` 节点输入 ControlNet 模型和 scribble 图像。
- 🟨 ControlNet 图像和要生成的图像尺寸不同也不会报错，但还是设成相同尺寸吧。

> scribble 模型是针对“黑底白线”优化的。  
> 请注意，如果是白底黑线，很多时候效果不好。

- 示例图像
  - ![](/media/basic-workflows/sd15-controlnet/legacy_gyazo_fd112e311d4e0503fbb4df2044fc9325.png){media=image}

---

## 平衡 ControlNet 的控制

扩散模型本来 **在不受约束地生成时质量最高**。  
但完全放任它自由就派不上用场了，所以要用文本或 ControlNet 等 **Conditioning** 来控制。  
控制太强，质量就会下降 —— 文本提示词和 LoRA 也是一样。

那么，控制和质量之间该怎么平衡呢？

### start_percent / end_percent

![](/media/ai-capabilities/diffusion-models/legacy_gyazo_3c82ca8a7dcb51f2475d0451de727783.mp4){media=loop}

采样在前期确定大致形状，在后期描绘细节。

ControlNet 中有很多（pose / depth / scribble 等）属于 **决定形状的那类** 控制。  
这样一来，也可以认为 **只要在前期让 ControlNet 生效就够了**。

在 `Apply ControlNet` 中，可以指定 ControlNet **在哪个区间生效**。
- `start_percent`: 开始生效的时机
- `end_percent`: 结束生效的时机

`end_percent` 越低，后期模型的自由度就恢复得越多，能在保持形状的同时提升质量。

把 `strength`（强度）和 `start_percent / end_percent` 搭配起来，  
找到“既不束缚过头，也不崩得太厉害”的平衡吧。

---

## 主要的 ControlNet 类型

能与图像对应起来的“概念”多如繁星。  
这里只介绍几个有代表性的。

### 下载模型

- [comfyanonymous/ControlNet-v1-1_fp16_safetensors](https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/tree/main)
- [monster-labs/control_v1p_sd15_qrcode_monster](https://huggingface.co/monster-labs/control_v1p_sd15_qrcode_monster/tree/main)

### 一览

{% mediaRow img="/media/basic-workflows/sd15-controlnet/legacy_gyazo_be3200558982f020a124d2bc68276c16.png {media=image}", width=60, align="left" %}
### Canny
- 保留照片或图像的轮廓，用另一种风格重新绘制。
{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/sd15-controlnet/legacy_gyazo_debe9e414b688be1fa07bf01101ea2e0.png {media=image}", width=60, align="left" %}
### Lineart
- 和 Canny 类似，但更适合插画。  
- 用于线稿上色等。
{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/sd15-controlnet/legacy_gyazo_cbe33c8ba39da19e249634a6e46ec13b.png {media=image}", width=60, align="left" %}
### Depth
- 使用深度图（远近信息），在保持原图纵深和构图的同时进行生成。
- 适合建筑、风景等不想破坏立体感的场合。
{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/sd15-controlnet/legacy_gyazo_ae9a4fd7513b17114e2317b0da8dc14c.png {media=image}", width=60, align="left" %}
### Normal
- 使用法线贴图，控制光照和立体感。{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/sd15-controlnet/legacy_gyazo_8df713d0e8415ada994ad7c5f91d8ba9.png {media=image}", width=60, align="left" %}
### Pose
- 根据 OpenPose 等提取的“火柴人姿势信息”，生成相同姿势的人物或角色图像。
{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/sd15-controlnet/legacy_gyazo_fe7da06340c74791241cac5a482531bb.png {media=image}", width=60, align="left" %}
### Inpaint
- 想只重绘图像的一部分时使用的模型。
- 可以只把掩膜指定的范围自然地重绘（去除多余物体、替换小物件等）。
{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/sd15-controlnet/legacy_gyazo_ea6af6e0edcd04ffe43f032b8a10b4fb.png {media=image}", width=60, align="left" %}
### QR Code Monster
- 生成能当作二维码扫描的图像。
- 不只是二维码，也可以用“黑白图案图像”作为基础，把它变成自己喜欢的画面。
{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/sd15-controlnet/legacy_gyazo_65e5e0ed5aaf2c87d363e6eb37e7d33b.png {media=image}", width=60, align="left" %}
### Tile
- 从很模糊或低分辨率的图像生成清晰的图像。
- 也可以单独使用，但实际上更常和 Ultimate SD Upscale 这类“超分辨率放大”搭配使用。
{% endmediaRow %}


## ControlNet Union

ControlNet 中还有一种叫作 **ControlNet Union** 的模型。

它并不能完成什么特殊的任务，而是把 Scribble、Pose、Depth 这些原本一个用途对应一个模型的 ControlNet 合并成了一个模型。

不用换模型就能完成多种任务，看到的话不妨试试。
