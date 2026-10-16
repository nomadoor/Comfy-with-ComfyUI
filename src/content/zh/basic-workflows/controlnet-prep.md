---
layout: page.njk
lang: zh
section: basic-workflows
slug: controlnet-prep
navId: controlnet-prep
title: "ControlNet 预处理器"
created: 2025-12-08
updated: 2026-03-02
summary: "制作 ControlNet 用的辅助图像"
seoTitle: "ComfyUI 的 ControlNet 预处理器：Canny、Depth、OpenPose"
seoDescription: "从参考图自动生成 ControlNet 所需的线稿、深度图、骨架等控制图像的预处理器用法。比较 Canny、SoftEdge、Lineart、Depth、Normal、MLSD、OpenPose 等。"
tags: ["controlnet"]
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/controlnet-prep/legacy_gyazo_b0ce7cf302624ce253c4d12e78885127.png"
---

## 什么是 Preprocessor？

ControlNet 用到的火柴人、深度图这类“控制图像”，该怎么准备呢？  
Canny 那样简单的边缘图还好说，但每次都手绘深度图就不太现实了。

因此，在 ControlNet 圈子里，为了方便，把从参考图像自动生成火柴人、深度图、线稿、法线贴图等的处理统称为 **“Preprocessor（预处理器）”**。

并没有一种技术能包办所有这些，姿态估计、深度估计、线稿提取等，各自都是不同的技术。

---

## 控制图像的本质

前面说手绘很费劲，但请记住：它“是可以手绘的”。

控制图像并不是什么特殊的数据类型，**只是普通的 RGB 图像**。  
把深度图里碍事的部分涂黑，或者只重画姿势图里的手臂来改变姿势，都完全可以。

---

## 需要的自定义节点

- [Fannovel16/comfyui_controlnet_aux](https://github.com/Fannovel16/comfyui_controlnet_aux)

基本上有这一个就够了。

---

## 常用的 Preprocessor

这里介绍实际使用频率较高的技术。  
论性能还有更好的选择，但这里优先考虑了简便、轻量和好用。

只是给 ControlNet 用的话，并不需要那么极致的精度。

{% mediaRow img="/media/basic-workflows/controlnet-prep/legacy_gyazo_25026afc9e67bd130954acbf98fd851a.png{media=image}", width=50, align="left" %}

### Canny


- 🟩 Canny
- 🟨 Canny Edgy

{% mediaFooter %}
[](/workflows/basic-workflows/controlnet-prep/canny_canny_edge.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/controlnet-prep/legacy_gyazo_4be8acdf3533fb7c80d9b580f755f1db.png{media=image}", width=50, align="left" %}

### SoftEdge / HED


- 🟩 HED Soft-Edge

{% mediaFooter %}
[](/workflows/basic-workflows/controlnet-prep/hed_soft_edge.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/controlnet-prep/legacy_gyazo_5fcfc6e4a07be8ed93ec0e3f9ed6a993.png{media=image}", width=50, align="left" %}

### Lineart


- 🟩 Realistic Lineart
- 🟨 AnyLine Lineart

{% mediaFooter %}
[](/workflows/basic-workflows/controlnet-prep/realistic_anyline_lineart.json)
{% endmediaFooter %}

{% endmediaRow %}


{% mediaRow img="/media/basic-workflows/controlnet-prep/legacy_gyazo_6be6036f6e7a7f56a8f6de81aeeea7d6.png{media=image}", width=50, align="left" %}

### Depth


- 🟩 Depth Anything V2
  - 目前已经开发到 V3，但用于 ControlNet 的话，V2 就足够了。

{% mediaFooter %}
[](/workflows/basic-workflows/controlnet-prep/depth_anything_v2.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/controlnet-prep/legacy_gyazo_e55cf3d13d1b3c3c07497724d42b2780.png{media=image}", width=50, align="left" %}

### Normal


- 🟩 DSINE

{% mediaFooter %}
[](/workflows/basic-workflows/controlnet-prep/dsine.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/controlnet-prep/legacy_gyazo_d7fe5840a075c7567848f8953c381734.png{media=image}", width=50, align="left" %}

### MLSD


- 🟩 M-LSD Lines

{% mediaFooter %}
[](/workflows/basic-workflows/controlnet-prep/m_lsd.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/controlnet-prep/legacy_gyazo_9297daf25cc10b21f495ed985e2bae7c.png{media=image}", width=50, align="left" %}

### Pose


- 🟩 OpenPose
- 🟨 DWPose
  - 它常被当作 OpenPose 的升级版，但有一个明显的弱点：不擅长处理背影。请视情况和 OpenPose 搭配使用。

{% mediaFooter %}
[](/workflows/basic-workflows/controlnet-prep/openpose_dwpose.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/controlnet-prep/legacy_gyazo_617591c28e0aba1c028b9b4012a07c98.png {media=image}", width=50, align="left" %}

### SDPose


[judian17/ComfyUI-SDPose-OOD](https://github.com/judian17/ComfyUI-SDPose-OOD)
- 🟩 SDPose
  - OpenPose 很不擅长处理动物和动漫插画，效果不好的时候可以试试这个。

{% mediaFooter %}
[](/workflows/basic-workflows/controlnet-prep/sdpose.json)
{% endmediaFooter %}

{% endmediaRow %}
