---
layout: page.njk
lang: zh
section: basic-workflows
slug: liveportrait
navId: liveportrait
title: "LivePortrait"
created: 2025-12-12
updated: 2026-08-26
summary: "用 LivePortrait 控制一张人脸照片的表情和转头"
seoTitle: "在 ComfyUI 中使用 LivePortrait：控制人脸表情与转头"
seoDescription: "控制单张人脸照片表情和头部朝向的 LivePortrait 在 ComfyUI 中的用法。介绍用参数调整表情、从参考图编辑，以及迁移参考视频动作的 image2video / video2video。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/liveportrait/legacy_gyazo_0df8e012722c39159be1762a9a38ea99.png"
tags: ["talking-head"]
---

## 什么是 LivePortrait？

[LivePortrait](https://liveportrait.github.io/) 是一个 **基于关键点的 Talking Head 模型**，可以让一张人脸照片跟着别的视频或参数动起来。

它以照片中人脸上标出的关键点为线索来变形图像，感觉就像 AI 在 1 秒内自动执行几十次 Photoshop 的“液化工具”。

既可以让照片做出和参考视频一样的表情、转头动作，也可以按脸部的各个部位（眼睛、嘴、头的朝向等）进行微调。  
虽然没有最近那些基于视频生成模型的方法那种“什么都能做”的感觉，但 **因为不是扩散模型，所以非常轻量，几乎可以实时驱动**，这是它的一大特点。

可以用在装置艺术上，用来微调生成的图像也相当方便，比如“让眼睛稍微闭上一点”“让脸稍微朝下一点”。

---

## 自定义节点

- [PowerHouseMan/ComfyUI-AdvancedLivePortrait](https://github.com/PowerHouseMan/ComfyUI-AdvancedLivePortrait)

---

## image2image

改变输入人物图像中脸的朝向和表情。  
主要有 2 种控制方法。

- 用参数调整表情
- 做成与参考图像相同的表情

### 用参数调整表情

![](/media/basic-workflows/liveportrait/legacy_gyazo_f3793dcde8d6e286a67c3dd41b732da5.mp4){media=loop}

[](/workflows/basic-workflows/liveportrait/liveportrait_i2i.json)

- 参数有很多，直接动手试试最快。
- 像这个视频一样，使用 `▷ Run (On Change)` 会很方便。

### 根据参考图像编辑

![](/media/basic-workflows/liveportrait/legacy_gyazo_0df8e012722c39159be1762a9a38ea99.png){media=image}

[](/workflows/basic-workflows/liveportrait/liveportrait_i2i_ref.json)

- 只是在刚才的工作流中加上 `sample_image`。
- 可以在 `sample_parts` 中选择让哪些部位跟随参考图像。
  - `OnlyExpression` … 仅表情
  - `OnlyRotation` … 仅脸的朝向
  - `OnlyMouth` … 仅嘴
  - `OnlyEyes` … 仅眼睛
  - `All` … 全部

也可以先变成参考图像的表情（朝向），再用参数进行微调。

---

## image2video

让图像中的人物按照参数或参考视频动起来。

### motion_link

在 `Expression Editor (PHM)` 中做出几个表情，再让它们依次变化下去，就可以做成视频。

![](/media/basic-workflows/liveportrait/legacy_gyazo_adf677e141945fd7d957acb2e26c02ec.mp4){media=loop}

[](/workflows/basic-workflows/liveportrait/liveportrait_i2v_motion_link.json)

- 🟨 `Advanced Live Portrait (PHM)` 节点
  - 将 `animate_without_vid` 设为 `true`
  - 在下方的命令栏中，设置向哪个表情变化、花多少帧。

命令栏的格式大致如下。

```text
表情的索引 = 向那个表情“变化用的帧数”:“保持那个表情等待的帧数”
````

例如，假设写成下面这样。

```text
1 = 1:0
2 = 15:0
3 = 20:10
```

* `1 = 1:0`

  * 变化帧 1、等待帧 0
  * 从这个表情开始，马上变化到下一个表情。
* `2 = 15:0`

  * 用 15 帧从表情 1 变化到这个表情，然后马上转到下一个表情。
* `3 = 20:10`

  * 用 20 帧从表情 2 变化到这个表情，之后保持 10 帧。

这样会生成总共 46 帧的视频。

### 从参考视频迁移

上面做的事情有点取巧，实际上我想这种用法才是主流。

![](/media/ai-capabilities/talking-head/legacy_gyazo_c893e38c12859f8f20ff1e0fca545788.mp4){media=loop}

[](/workflows/basic-workflows/liveportrait/liveportrait_i2v_ref.json)

* 🟨 只需把参考视频输入到 `driving_images`。

参考视频中的表情和转头动作，会原样迁移到输入图像上。
当然，也可以和上面的 `motion_link` 组合使用。

---

## video2video

让视频中人物的表情跟随参考视频。

![](/media/basic-workflows/liveportrait/legacy_gyazo_1a0205956e78b32045372f207582566d.mp4){media=loop}

[](/workflows/basic-workflows/liveportrait/liveportrait_v2v_ref.json)

- 🟨 只需把 `src_images` 和 `driving_images` 都换成视频。
* 可以保留原视频的运镜和背景，只替换人物的表情和口型。
