---
layout: page.njk
lang: zh
section: ai-capabilities
slug: relight
navId: relight
title: 重打光
created: 2026-02-06
updated: 2026-03-02
summary: "改变光源或环境光，调整图像光照的任务"
seoTitle: "什么是重打光？用 AI 改变图像光照"
seoDescription: "改变图像光源与环境光的重打光（Relighting）技术。介绍让合成前景融入背景的 IC-Light、LBM，图像编辑模型加重打光 LoRA，以及放置虚拟光源的方法。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: '/media/ai-capabilities/relight/legacy_gyazo_4c413909ac34f89df891a976fc660f70.png'
---

## 什么是重打光？

重打光（Relighting）是调整图像光照的任务。

大致可以分为下面两类。

- **用于合成的重打光**：把前景和背景合成在一起时，让前景的光照与背景融为一体

- **放置虚拟光源的重打光**：放一个虚拟光源，参考深度图或法线贴图来改变光照

---

## 用于合成的重打光

把抠出来的人物或物体贴到另一个背景上时，如果什么都不做，“光的方向”“色温”“对比度”等都和背景对不上，一看就是合成的。

在 AI 出现之前，也可以用 Photoshop 之类一点点修，不过现在就用生成式 AI 一下子搞定吧！

### IC-Light / LBM 等基于扩散模型的重打光

![](/media/ai-capabilities/relight/legacy_gyazo_5e8ab13bbf6385a8413fd8dfdb774a77.png){media=image}

扩散模型在学习大量图像的过程中，不只学会了“生成图像”，还掌握了“这样看起来更自然”“光从这边来，影子就会这样落下”之类的统计知识。

IC-Light、LBM 等方法就是利用这一性质，只把前景的光照往背景那边靠拢。

### 基于指令的图像编辑模型＋重打光类 LoRA

思路和 [粗糙拼贴的精修](/zh/ai-capabilities/collage-refine/) 相近，可以理解为让模型“编辑”图像，把放在前面的东西自然地融进背景。

当然，不做合成，只是单纯改变场景（改成夜晚、改成傍晚等）的重打光也可以。

也有人做了专用的 LoRA。
- [dx8152/Qwen-Image-Edit-2509-Relight](https://huggingface.co/dx8152/Qwen-Image-Edit-2509-Relight)
- > ![](/media/ai-capabilities/relight/legacy_gyazo_74f605b5c212b69e7e0c269066665864.mp4){media=loop}

---

## 放置虚拟光源的重打光

另一类是 **在场景中放置虚拟光源** 的重打光。

> ![ClipDrop Relight](/media/ai-capabilities/relight/legacy_gyazo_1cfc90b511ed7c12e3cfcf9128c170e5.mp4){media=loop}

先推断深度图或法线贴图，再放上“这里打一盏聚光灯”“阳光从这边照进来”之类的虚拟光源，根据光源重新计算阴影和高光。

硬要说的话，它更接近 CG 或图像处理方面的任务。[ClipDrop Relight](https://clipdrop.co/relight)、[LightLab](https://nadmag.github.io/LightLab/) 等都属于这一类。

相关研究有好几项，但很遗憾，目前能在 ComfyUI 中实际使用的还不多。
