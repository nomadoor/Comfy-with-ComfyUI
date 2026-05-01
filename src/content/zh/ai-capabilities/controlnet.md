---
layout: page.njk
lang: zh
section: ai-capabilities
slug: controlnet
navId: controlnet
title: ControlNet 系
summary: 使用姿势或线稿等附加信息控制图像生成的技术
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: https://i.gyazo.com/374d9112c26cc1098d9e7e11b5ca49fa.png
---
## 什么是 ControlNet？

扩散模型粗略地说，是学习了“噪点”和“图像”的关系，从而能够从噪点中恢复图像的模型。

如果在这里，不仅仅是噪点，连同 **“与图像对应的其他信息”** 一起加入会怎么样呢。

- 如果学习了线稿和上色完毕的插图的关系
  - → 只要给出线稿，就能自动上色
- 如果学习了火柴人（姿势图像）和人物照片的关系
  - → 只要给出火柴人，就能制作出摆出该姿势的人物图像

可以制作出这样的 AI。

像这样，以“附加的图像条件（姿势・线稿・深度等）”为线索，控制生成结果的机制之一，就是 **ControlNet**。

---

## 代表性的 ControlNet 种类

ControlNet 能处理的“附加信息”只要有点子就可以无限增加，但常用的东西在某种程度上有固定的模式。
这里只列举代表性的东西。

### openpose（姿势 / 火柴人）
用火柴人或骨架，指定人或角色的姿势。

![](https://gyazo.com/637abbf2514e4c973b519053ae5809cd){gyazo=image} ![](https://gyazo.com/aa98af3564647910d9c8b647a9ecbd16){gyazo=image}

### depth（深度图）
利用深度图，固定构图或纵深。

![](https://gyazo.com/0c12343e13526e4ac28edf9258e5ad23){gyazo=image} ![](https://gyazo.com/f9fa9577d3e0569f18057da32c50c95a){gyazo=image}

### scribble（涂鸦）
只给出粗略的涂鸦，以此为基础生成图像。

![](https://gyazo.com/add872b3de994b2b07852f0304ca9d47){gyazo=image} ![](https://gyazo.com/277213578f705e57a2c9a90adaf135c5){gyazo=image}

### lineart / anime（线稿）
给出线稿，生成涂色。

![](https://gyazo.com/5ddbfb2110194fca853a74641efd4f87){gyazo=image} ![](https://gyazo.com/6905030224a42fdc28d2c85cf431b0a4){gyazo=image}

### inpaint（Inpaint 用）
自然地填充被遮罩的部分。

![](https://gyazo.com/69794d94d649836b33e3110b57bd9272){gyazo=image} ![](https://gyazo.com/18ae31a6d8972fdb966f49275248dd3e){gyazo=image}

除此之外，还有边缘提取（Canny）、分割、二维码等各种变体，但只要能准备好“图像”和“对应的表现”，就能制作任何 ControlNet。

---

## 基于指令的图像编辑

在最近的图像编辑模型中，越来越多的情况是将过去用 ControlNet 做的事情，当作“[基于指令的图像编辑](/zh/ai-capabilities/instruction-based-image-editing/)”来处理。

基于指令的图像编辑，可以通过对给定的图像发出“缩小”或“变成夜晚”等指令来进行图像编辑。

也就是说，ControlNet 式的操作也可以作为“图像编辑”来处理。

- 姿势图像 + “用这个姿势，画一个穿黑衣服的角色”
- 深度图 + “保持构图不变，变成夜景照片”
- 粗略图像 + “把这个草图变成漂亮的插图”
