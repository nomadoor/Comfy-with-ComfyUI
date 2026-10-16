---
layout: page.njk
lang: zh
section: ai-capabilities
slug: 3d-model-generation
navId: 3d-model-generation
title: 3D 模型生成
created: 2026-02-06
updated: 2026-03-02
summary: "从多视角到世界模型"
seoTitle: "3D 模型生成 AI：从多视角到世界模型"
seoDescription: "整理由图像或文本生成 3D 模型的 AI 发展：Zero123++ 等多视角生成、Stable Video 3D、Hunyuan3D-2.1、SAM 3D Objects，以及可以漫游其中的世界模型。"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---

## 3D 生成

3D 生成，顾名思义，就是根据文本提示词或参考图像来制作 3D 模型的任务。

要是能像 text2image 那样，让模型直接从噪声中浮现出来就好了。但就像视频在时间轴上多了一个维度一样，3D 生成在空间上多了维度，所以没那么容易实现。

先说在前面：3D 生成的性能还达不到专业使用的水平。
不过，从图像生成模型，乃至生成可以四处走动的世界，这类技术正在稳步成长。

这项技术正处在快速发展之中，我们稍微梳理一下它的脉络。

※ 无论时间顺序还是技术之间的关联，都整理得相当随意。请轻松地看看就好。

---

## 3D 生成

### 多视角生成

从图像构建 3D 空间和模型的技术，早就有 NeRF 之类。
但用 NeRF 构建 3D，需要同一个物体从各个视角拍摄的图像。

多视角生成正是从这个需求出发诞生的。

### Zero-1-to-3

> ![](/media/ai-capabilities/3d-model-generation/legacy_gyazo_8f4d195ac2daffffc7356a036d4a3c98.png){media=image}
> [Zero-1-to-3: Zero-shot One Image to 3D Object](https://zero123.cs.columbia.edu/)

这是基于扩散模型的最早一批多视角生成，它会改变输入图像的相机构图，生成新视角的图像。

当时我觉得就算不用于 3D 生成也挺方便的，但配置要求太高，没能用上。
现在用基于指令的图像编辑，就能轻松做到类似的事情了。

### Zero123++

Zero-1-to-3 的用法是“为输入图像生成一张其他角度的图像 → 换个角度再跑一次，反复多次”，而 **[Zero123++](https://github.com/SUDO-AI-3D/zero123plus)** 会同时生成多个视角。

![](/media/ai-capabilities/3d-model-generation/legacy_gyazo_b6b4e05ace668acfd75449b8252b139f.png){media=image} ![](/media/ai-capabilities/3d-model-generation/legacy_gyazo_59359f3b3b6f250358211d2044d207fe.jpg){media=image}

人们早就知道，扩散模型批量生成多张图像时（cf. [Batch・视频](/zh/data-utilities/batch-video/)），生成的图像之间会有一定的一致性。

而 3D 生成从一开始就需要覆盖各个方向的多张图像。
可以说，Zero123++ 正是利用这一性质，走向了“一次生成就尽量得到一组一致的多视角”的路线。

---

## 视频生成模型的登场

稍晚一些，能够生成视频的模型开始出现。

于是有了这样一个想法：与其把多视角生成当作“一种图像编辑”，不如把它看作

> 绕着目标物体转一圈拍摄的视频
> ＝ 切分得非常细的多视角

来处理，不是更好吗？

### Stable Video 3D

[Introducing Stable Video 3D](https://stability.ai/news/introducing-stable-video-3d)

基于 Stable Video Diffusion 的 image2model。

![](/media/ai-capabilities/3d-model-generation/legacy_gyazo_49e94de4d1476e100761e2e6be7a2f6e.mp4){media=loop}

[](/workflows/ai-capabilities/3d-model-generation/sv3d.json)

* 输入一张静态图像
* 生成该物体旋转一圈的 360 度视频
* 把视频的每一帧当作不同视角的图像，从中重建 3D

把视频生成模型用于 3D 模型生成，这个方向至今仍在延续。

现在的视频生成模型比当时强大得多，即使不做专门的微调，也能生成高清的 360 度旋转视频。

---

## 直接瞄准 image→3D 模型的模型

到这里为止，前提都是

* 先收集多视角（或旋转视频）
* 再用另一套机制把它变成 3D

这样的“两段式结构”。

在此基础上更进一步，

> 输入是图像（或文本），输出直接就是 3D 模型

正面瞄准这种形式的模型已经出现了。

### Hunyuan3D-2.1

Hunyuan3D-2.1 是一个从图像或文本制作 3D 资产的大规模模型。

* 先是只生成“形状”的阶段（粗略的 3D 形状）
* 然后是贴上包含 PBR 纹理的高分辨率外观的阶段

采用的是这样的两段式结构。

### SAM 3D Objects

SAM 3D Objects 是一个从单张实拍图像重建 3D 物体的模型。

* 在 2D 这一侧，用 SAM 系列的分割把目标物体准确地抠出来
* 以抠出的区域为线索，一边补全被遮挡的部分，一边推断 3D 形状和纹理

大致是这样的流程。


两者的技术内容完全不同，但都是想正面解决“image → 3D 模型”这个问题。

---

## World 模型

到这里讲的都是把单个物体做成 3D 模型。
另一方面，从照片生成整个世界的尝试也在推进。

> [!NOTE]
> 这里说的“World 模型”，与其说是世界模型（预测物理），不如说只是指 **构建 3D 世界（场景）的模型**。

### 360 度全景生成

起点是 360 度全景生成。

Latent Labs 的工具、[HunyuanWorld-1.0](https://github.com/Tencent-Hunyuan/HunyuanWorld-1.0) 等都属于这一类。

* 把输入图像贴到全景球面上
* 用 outpainting 补全画面里没有的方向

思路很简单，先做出“至少 360 度都填满了的画面”。

这个阶段还称不上 3D，但人们正尝试在此基础上结合深度图和网格重建，构建出有纵深的 3D 空间。

### HunyuanWorld-Mirror

到了 [HunyuanWorld-Mirror](https://github.com/Tencent-Hunyuan/HunyuanWorld-Mirror)，就更接近真正意义上“可以四处走动的世界”了。

> ![](/media/ai-capabilities/3d-model-generation/legacy_gyazo_47ddf0aa2f5bc667b43be75d2ed1223c.mp4){media=player}

* 它由这样一些组件构成：以图像（或视频）为输入，一并推断相机信息、深度和 3D 表示（3D Gaussian 等）。
