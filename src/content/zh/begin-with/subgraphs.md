---
layout: page.njk
lang: zh
section: begin-with
slug: subgraphs
navId: subgraphs
title: "子图 (Subgraph)"
created: 2026-02-06
updated: 2026-03-02
summary: "关于子图"
seoTitle: "ComfyUI 子图用法：合并节点并复用"
seoDescription: "将多个节点合并为一个节点的 ComfyUI 子图功能。讲解创建与编辑、参数的公开设置，以及保存为可复用模块的方法。"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## 什么是子图

这是一个将多个节点合并为一个节点的功能。
不仅可以整理外观，还可以将其作为可复用的模块（Blueprint: 蓝图）保存，像新节点一样使用。

也可以把所有节点都合成一个，但 ComfyUI 的特点本来就在于能把图像生成管线拆成一个个小模块。

我个人认为，与其说是用来整理外观，它终究是用来创建“可复用模块”的功能。

---

## 创建子图

- 1. 选中多个想要合并的节点
- 2. 点击 `Node Selection Toolbox` 的 `🕸️` (Convert Selection to Subgraph)

![](/media/begin-with/subgraphs/legacy_gyazo_d59c55b69252fad5f076a9b5e17be95a.mp4){media=loop}

---

## 编辑子图

双击子图，或点击右上角的图标进入编辑模式。

基本操作和平时一样，但与外部交互的参数需要连接到子图的输入输出插槽（左侧/右侧）。

![](/media/begin-with/subgraphs/legacy_gyazo_5d5ebc1bc37a8dfdaad5a5db64d66cb2.mp4){media=loop}

---

## 设置公开参数

可以把子图内的参数，作为子图节点的 Widget 显示在外面。
这样就不用每次都进入编辑模式来改数值了。

- 1. 选中子图
- 2. 点击 `Node Selection Toolbox` 的 `Edit Subgraph Widgets`
- 3. 勾选想要公开的参数

![](/media/begin-with/subgraphs/legacy_gyazo_024e67b6cea67bda0849829b3762f4ba.mp4){media=loop}

---

## 保存与复用子图

把做好的子图保存下来，就能当作自己的节点来复用。

- 1. 选中子图
- 2. 点击 `Node Selection Toolbox` 的 `📖` (Publish Subgraph)
- 3. 输入名称并 `Confirm`

保存后，可以像普通节点一样通过搜索（双击）调出来。

在侧边栏的节点库里也能看到，Blueprint 的删除和编辑就在这里进行。

![](/media/begin-with/subgraphs/legacy_gyazo_74f9469b12a6b87fc7a62099dde54db7.mp4){media=loop}

[](/workflows/begin-with/subgraphs/chroma_key.json)
