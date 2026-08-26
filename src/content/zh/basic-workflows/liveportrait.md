---
layout: page.njk
lang: zh
section: basic-workflows
slug: liveportrait
navId: liveportrait
title: "LivePortrait"
created: 2025-12-12
updated: 2026-08-26
summary: "在 LivePortrait 中从 1 张脸部照片控制表情和摇头"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/0df8e012722c39159be1762a9a38ea99.png"
tags: ["talking-head"]
---

## 什么是 LivePortrait？

[LivePortrait](https://liveportrait.github.io/) 是为了配合别的视频或参数让 1 张脸部照片动起来的 **基于关键点的 Talking Head 模型**。

以在照片中的脸部打的关键点为线索，以 AI 1 秒几十次自动执行 Photoshop 的“液化工具”那样的印象使其变形。

可以让其做与参照视频相同的表情・摇头，也可以按脸部的部件（眼・口・首的方向等）进行微调。  
虽然没有最近使用视频生成模型的东西那样的“什么都有感”，但 **正因为不是扩散模型所以非常轻，几乎能实时让其动作** 是其巨大的特征。

用于装置也可以，用于“让眼睑稍微闭上”“让脸稍微朝下”等，在此微调生成的图像也相当方便。

---

## 自定义节点

- [PowerHouseMan/ComfyUI-AdvancedLivePortrait](https://github.com/PowerHouseMan/ComfyUI-AdvancedLivePortrait)

---

## image2image

变化输入的人物图像的脸的方向・表情。  
大体有 2 种控制方法。

- 用参数调整表情
- 设为与参照图像相同的表情

### 用参数调整表情

![](https://gyazo.com/f3793dcde8d6e286a67c3dd41b732da5){gyazo=loop}

[](/workflows/basic-workflows/liveportrait/LivePortrait_i2i.json)

- 虽然有各种参数，但试着摸一下比较快呢。
- 像这个视频那样，使用 `▷ Run (On Change)` 比较方便。

### 从参照图像编辑

![](https://gyazo.com/0df8e012722c39159be1762a9a38ea99){gyazo=image}

[](/workflows/basic-workflows/liveportrait/LivePortrait_i2i_ref.json)

- 只是向刚才的工作流加入 `sample_image`。
- 可以从 `sample_parts`，选择让哪个部位跟随参照图像。
  - `OnlyExpression` … 仅表情
  - `OnlyRotation` … 仅脸的方向
  - `OnlyMouth` … 仅口
  - `OnlyEyes` … 仅眼
  - `All` … 全部

让其变成参照图像的表情（方向）的基础上，也可以使用参数进行微调。

---

## image2video

把图像内的人物，依照参数或参照视频使其动作。

### motion_link

在 `Expression Editor (PHM)` 制作好几个表情，通过让那个表情一个接一个变化可以制作视频。

![](https://gyazo.com/adf677e141945fd7d957acb2e26c02ec){gyazo=loop}

[](/workflows/basic-workflows/liveportrait/LivePortrait_i2v_motion_link.json)

- 🟨 `Advanced Live Portrait (PHM)` 节点
  - 将 `animate_without_vid` 设为 `true`
  - 在其下的命令栏，设定对哪个表情花多少变化。

命令栏的格式是如下那样的印象。

```text
表情的索引 = 向那个表情“变化用的帧数”:“保持那个表情等待的帧数”
````

例如，考虑如下写的情况。

```text
1 = 1:0
2 = 15:0
3 = 20:10
```

* `1 = 1:0`

  * 变化帧 1、等待帧 0
  * 从这个表情开始，马上向下一个表情变化。
* `2 = 15:0`

  * 花 15 帧从 1 的表情向这个表情变化，马上移向下一个表情。
* `3 = 20:10`

  * 花 20 帧从 2 的表情向这个表情变化，之后保持 10 帧。

这种情况下，能做出合计 46 帧的视频。

### 从参照视频传送

虽然上面做了稍微取巧的事，但实际上这边的使用方法才是主流。

![](https://gyazo.com/c893e38c12859f8f20ff1e0fca545788){gyazo=image}

[](/workflows/basic-workflows/liveportrait/LivePortrait_i2v_ref.json)

* 🟨 只是向 `driving_images` 输入参照视频。

将参照视频侧的表情・摇头，原样传送到输入图像。
当然，也可以与上面的 `motion_link` 组合使用。

---

## video2video

将视频中的人物的表情配合参照视频。

![](https://gyazo.com/1a0205956e78b32045372f207582566d){gyazo=loop}

[](/workflows/basic-workflows/liveportrait/LivePortrait_v2v_ref.json)

- 🟨 只是将 `src_images`、 `driving_images` 双方设为视频。
* 可以保持基础视频的运镜和背景原样，只替换人物的表情・对口型。
