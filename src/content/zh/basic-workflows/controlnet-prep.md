---
layout: page.njk
lang: zh
section: basic-workflows
slug: controlnet-prep
navId: controlnet-prep
title: "ControlNet 预处理器"
summary: "制作在 ControlNet 使用的辅助图像"
tags: ["controlnet"]
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/b0ce7cf302624ce253c4d12e78885127.png"
---

## 什么是 Preprocessor？

像火柴人或深度图那样在 ControlNet 使用的“控制用图像”，该怎么准备呢？  
如果是像 Canny 那样单纯的边缘还可以，但每次都手绘深度图是不现实的。

因此，将从参考图像自动制作火柴人・深度图・线稿・法线贴图等的处理，在 ControlNet 业界为方便起见统称为 **“Preprocessor（预处理器）”**。

并不是有一个进行这些全部的技术，而是姿势推定・深度推定・线稿抽出等，分别有别的技术。

---

## 控制图像的真面目

虽说手绘很难，但请记住“是可以手绘的”。

控制用图像不是特殊的数据型，**只是单纯的 RGB 图像**。  
用黑色涂满深度图中碍事的部分，或只重画姿势图像的手臂改变姿势也没关系。

---

## 必要的自定义节点

- [Fannovel16/comfyui_controlnet_aux](https://github.com/Fannovel16/comfyui_controlnet_aux)

基本上，只要有这个就足够了。

---

## 经常被使用的 Preprocessor

在这里介绍实际上使用频率高的技术。  
虽然在性能方面也有更好的东西，但重视简便・轻量・易用性选出了这些。

如果是用于 ControlNet 的程度，不需要那么极端的精度。

{% mediaRow img="https://gyazo.com/25026afc9e67bd130954acbf98fd851a{gyazo=image}", width=50, align="left" %}

### Canny


- 🟩 Canny
- 🟨 Canny Edgy

{% mediaFooter %}
[](/workflows/basic-workflows/controlnet-prep/Canny-Canny_Edge.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/4be8acdf3533fb7c80d9b580f755f1db{gyazo=image}", width=50, align="left" %}

### SoftEdge / HED


- 🟩 HED Soft-Edge

{% mediaFooter %}
[](/workflows/basic-workflows/controlnet-prep/HED_Soft-Edge.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/5fcfc6e4a07be8ed93ec0e3f9ed6a993{gyazo=image}", width=50, align="left" %}

### Lineart


- 🟩 Realistic Lineart
- 🟨 AnyLine Lineart

{% mediaFooter %}
[](/workflows/basic-workflows/controlnet-prep/Realistic-AnyLine_Lineart.json)
{% endmediaFooter %}

{% endmediaRow %}


{% mediaRow img="https://gyazo.com/6be6036f6e7a7f56a8f6de81aeeea7d6{gyazo=image}", width=50, align="left" %}

### Depth


- 🟩 Depth Anything V2
  - 虽然现在开发到了 V3，但如果是 ControlNet 用途的话 V2 就足够了。

{% mediaFooter %}
[](/workflows/basic-workflows/controlnet-prep/Depth_Anything_V2.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/e55cf3d13d1b3c3c07497724d42b2780{gyazo=image}", width=50, align="left" %}

### Normal


- 🟩 DSINE

{% mediaFooter %}
[](/workflows/basic-workflows/controlnet-prep/DSINE.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/d7fe5840a075c7567848f8953c381734{gyazo=image}", width=50, align="left" %}

### MLSD


- 🟩 M-LSD Lines

{% mediaFooter %}
[](/workflows/basic-workflows/controlnet-prep/M-LSD.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/9297daf25cc10b21f495ed985e2bae7c{gyazo=image}", width=50, align="left" %}

### Pose


- 🟩 OpenPose
- 🟨 DWPose
  - 虽然经常被作为 OpenPose 的上位互换对待，但有不擅长背影这个明确的弱点。请根据状况与 OpenPose 并用。

{% mediaFooter %}
[](/workflows/basic-workflows/controlnet-prep/OpenPose_DWPose.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/617591c28e0aba1c028b9b4012a07c98 {gyazo=image}", width=50, align="left" %}

### SDPose


[judian17/ComfyUI-SDPose-OOD](https://github.com/judian17/ComfyUI-SDPose-OOD)
- 🟩 SDPose
  - OpenPose 因为非常不擅长动物和动漫插图，所以如果不顺利的时候请尝试这边。

{% mediaFooter %}
[](/workflows/basic-workflows/controlnet-prep/SDPose.json)
{% endmediaFooter %}

{% endmediaRow %}
