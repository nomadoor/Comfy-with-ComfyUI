---
layout: page.njk
lang: zh
section: ai-capabilities
slug: controlnet
navId: controlnet
title: ControlNet 系
created: 2026-02-06
updated: 2026-03-02
summary: 使用姿势或线稿等附加信息控制图像生成的技术
seoTitle: "什么是 ControlNet？用姿势和线稿控制图像生成"
seoDescription: "用姿势、线稿、深度图等附加信息控制图像生成的 ControlNet 原理。介绍 openpose、depth、scribble、lineart、inpaint 等代表类型，以及与基于指令的图像编辑的关系。"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: https://i.gyazo.com/374d9112c26cc1098d9e7e11b5ca49fa.png
---
## 什么是 ControlNet？

粗略地说，扩散模型就是学习了“噪声”和“图像”之间的关系，从而能从噪声中还原出图像的模型。

那么，如果不只给噪声，还一起加上 **“与图像对应的其他信息”**，会怎么样呢？

- 学习线稿和上色完成的插图之间的关系
  - → 只要给出线稿，就能自动上色
- 学习火柴人（姿势图像）和人物照片之间的关系
  - → 只要给出火柴人，就能生成摆出这个姿势的人物图像

这样的 AI 就能做出来了。

像这样，以“附加的图像条件（姿势、线稿、深度等）”为线索来控制生成结果的机制之一，就是 **ControlNet**。

---

## 代表性的 ControlNet 种类

ControlNet 能处理的“附加信息”，只要有想法就可以无限扩充，不过常用的大致就那几种。
这里只列举几个有代表性的。

### openpose（姿势 / 火柴人）
用火柴人或骨架来指定人物或角色的姿势。

![](/media/ai-capabilities/controlnet/legacy_gyazo_637abbf2514e4c973b519053ae5809cd.png){media=image} ![](/media/ai-capabilities/controlnet/legacy_gyazo_aa98af3564647910d9c8b647a9ecbd16.png){media=image}

### depth（深度图）
用深度图来固定构图和纵深。

![](/media/ai-capabilities/controlnet/legacy_gyazo_0c12343e13526e4ac28edf9258e5ad23.png){media=image} ![](/media/ai-capabilities/controlnet/legacy_gyazo_f9fa9577d3e0569f18057da32c50c95a.png){media=image}

### scribble（涂鸦）
只给一张粗略的涂鸦，以它为基础生成图像。

![](/media/ai-capabilities/controlnet/legacy_gyazo_add872b3de994b2b07852f0304ca9d47.png){media=image} ![](/media/ai-capabilities/controlnet/legacy_gyazo_277213578f705e57a2c9a90adaf135c5.png){media=image}

### lineart / anime（线稿）
给出线稿，生成上色。

![](/media/ai-capabilities/controlnet/legacy_gyazo_5ddbfb2110194fca853a74641efd4f87.png){media=image} ![](/media/ai-capabilities/controlnet/legacy_gyazo_6905030224a42fdc28d2c85cf431b0a4.png){media=image}

### inpaint（用于 Inpaint）
把遮罩部分自然地填补起来。

![](/media/ai-capabilities/controlnet/legacy_gyazo_69794d94d649836b33e3110b57bd9272.png){media=image} ![](/media/ai-capabilities/controlnet/legacy_gyazo_18ae31a6d8972fdb966f49275248dd3e.png){media=image}

除此之外，还有边缘提取（Canny）、分割、二维码等各种变体。只要能准备好“图像”和“与之对应的表示”，什么样的 ControlNet 都做得出来。

---

## 基于指令的图像编辑

在最近的图像编辑模型中，越来越多地把过去用 ControlNet 做的事情，直接当作“[基于指令的图像编辑](/zh/ai-capabilities/instruction-based-image-editing/)”来处理。

基于指令的图像编辑，就是对给定的图像下达“拉远镜头”“改成夜晚”之类的指令，从而完成编辑。

也就是说，ControlNet 式的操作也可以作为“图像编辑”来处理。

- 姿势图像 + “用这个姿势，画一个穿黑衣服的角色”
- 深度图 + “保持构图不变，变成夜景照片”
- 草图 + “把这个草图变成漂亮的插图”
