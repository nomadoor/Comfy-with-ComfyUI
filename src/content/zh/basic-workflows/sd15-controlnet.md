---
layout: page.njk
lang: zh
section: basic-workflows
slug: sd15-controlnet
navId: sd15-controlnet
title: "ControlNet"
summary: "使用姿势或线稿控制图像生成"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
tags: ["controlnet"]
hero:
  image: "https://i.gyazo.com/81753915732cf767995f1b35ac827b5d.png"
---

## 什么是 ControlNet？

生成 AI 的本质，是学习 **“两个东西的对应关系”**。
在 text2image 中让其记住“噪声 ↔ 图像”的关系，但噪声以外的东西也能做同样的事

- 学习 **线稿 ↔ 图像** 的配对 → 线稿自动上色
- 学习 **火柴人 ↔ 图像** 的配对 → 指定姿势生成图像
- 学习 **深度图 ↔ 图像** 的配对 → 从景深信息生成图像

**ControlNet** 是实现这些的技术之一。

---

## SD1.5 × ControlNet Scribble

ControlNet 有无数的种类，首先试一下“scribble”吧。  
scribble 模型，是基于“粗略的涂鸦”生成图像的 ControlNet。

### ControlNet 模型的下载

- [control_v11p_sd15_scribble_fp16.safetensors](https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/blob/main/control_v11p_sd15_scribble_fp16.safetensors)
- ```
  📂ComfyUI/
    └── 📂models/
        └── 📂controlnet/
            └── control_v11p_sd15_scribble_fp16.safetensors
  ```

### 工作流

![](https://gyazo.com/885feaa8a1857c09ce11977ad9d424c2){gyazo=image}

[](/workflows/basic-workflows/sd15-controlnet/SD1.5_ControlNet_scribble.json)

- 🟩 向 `Apply ControlNet` 节点输入 ControlNet 模型和 scribble 图像。
- 🟨 ControlNet 图像和生成的图像尺寸如果不相同也不会报错，但最好设为相同尺寸。

> scribble 模型是对“黑背景上用白色画的线”最优化的。  
> 如果是白背景上用黑色画的线，很多时候反应不好，请注意。

- 样本图像
  - ![](https://gyazo.com/fd112e311d4e0503fbb4df2044fc9325){gyazo=image}

---

## ControlNet 的控制平衡

扩散模型，本来 **在不受束缚生成时质量最高**。  
但是，如果完全自由就没法用，所以用文本或 ControlNet 等 **Conditioning** 进行控制。  
如果控制太强质量就会下降 —— 这在文本提示词或 LoRA 中也是一样的。

那么，控制和质量的平衡该如何取呢？

### start_percent / end_percent

![](https://gyazo.com/3c82ca8a7dcb51f2475d0451de727783){gyazo=loop}

采样是在序章决定大致形状，在后半描绘细节。

ControlNet 的许多（pose / depth / scribble 等）是 **决定形状类型** 的控制。  
也就是说，可以认为 **只在序章让 ControlNet 生效就好**。

在 `Apply ControlNet` 中，可以指定 ControlNet **在哪个区间生效**。
- `start_percent`: 开始生效的时机
- `end_percent`: 结束生效的时机

越降低 `end_percent`，后半段模型的自由度就越恢复，能在保持形状的同时提高质量。

组合 `strength`（强度）和 `start_percent / end_percent`，  
去寻找“不过度束缚，也不过度崩坏”的平衡吧。

---

## 主要的 ControlNet 的种类

能与图像对应的“概念”，有星辰之多。  
这里只介绍具有代表性的东西。

### 模型的下载

- [comfyanonymous/ControlNet-v1-1_fp16_safetensors](https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/tree/main)
- [monster-labs/control_v1p_sd15_qrcode_monster](https://huggingface.co/monster-labs/control_v1p_sd15_qrcode_monster/tree/main)

### 一览

{% mediaRow img="https://gyazo.com/be3200558982f020a124d2bc68276c16 {gyazo=image}", width=60, align="left" %}
### Canny
- 保持照片或图像的轮廓，以别的风格重绘。
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/debe9e414b688be1fa07bf01101ea2e0 {gyazo=image}", width=60, align="left" %}
### Lineart
- 与 Canny 相似，但更面向插画。  
- 用于线稿上色等。
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/cbe33c8ba39da19e249634a6e46ec13b {gyazo=image}", width=60, align="left" %}
### Depth
- 使用深度图（前后信息），保持元图像的景深和构图进行生成。
- 适合不想破坏建筑物或风景等立体感的情况。
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/ae9a4fd7513b17114e2317b0da8dc14c {gyazo=image}", width=60, align="left" %}
### Normal
- 使用法线贴图，控制光照方式和立体感。{% endmediaRow %}

{% mediaRow img="https://gyazo.com/8df713d0e8415ada994ad7c5f91d8ba9 {gyazo=image}", width=60, align="left" %}
### Pose
- 从 OpenPose 等提取的“火柴人姿势信息”，生成相同姿势的人物・角色图像。 
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/fe7da06340c74791241cac5a482531bb {gyazo=image}", width=60, align="left" %}
### Inpaint
- 想要只重绘图像一部分时使用的模型。
- 可以只自然地重绘用掩膜指定的范围（消除不需要的东西・替换小物件等）。
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/ea6af6e0edcd04ffe43f032b8a10b4fb {gyazo=image}", width=60, align="left" %}
### QR Code Monster
- 制作作为二维码可读取的图像。
- 不限于二维码，也可以将“黑白图案图像”作为基础，变形为喜欢的画面。
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/65e5e0ed5aaf2c87d363e6eb37e7d33b {gyazo=image}", width=60, align="left" %}
### Tile
- 从模糊强烈的图像或低分辨率图像，制作漂亮的图像。
- 虽然也可以单体使用，但实际上更多被与 Ultimate SD Upscale 这样的“超分辨率放大”组合使用。
{% endmediaRow %}


## ControlNet Union

虽然是 Flux 以后的话题，但将 Scribble 或 Pose、Depth 这样基本的 ControlNet  
作为一个模型内置的东西就是“ControlNet Union”。

只要认为是自动识别输入图像的特征（姿势・线・深度等），  
试图统一再现接近的 ControlNet 举动的模型就足够了。
