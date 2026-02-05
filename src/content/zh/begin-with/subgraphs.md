---
layout: page.njk
lang: zh
section: begin-with
slug: subgraphs
navId: subgraphs
title: "子图 (Subgraph)"
summary: "关于子图"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## 什么是子图

这是一个将多个节点合并为一个节点的功能。
不仅可以整理外观，还可以将其作为可复用的模块（Blueprint: 蓝图）保存，并像新节点一样进行处理。

虽然可以将所有节点整合成一个，但 ComfyUI 的特征在于可以将图像生成管道划分为小的模块。

我个人认为，与其说它只是为了整顿外观，不如说是为了创建“可复用模块”而存在的功能。

---

## 创建子图

- 1. 选中多个想要合并的节点
- 2. 点击 `Node Selection Toolbox` 的 `🕸️` (Convert Selection to Subgraph)

![](https://gyazo.com/d59c55b69252fad5f076a9b5e17be95a){gyazo=loop}

---

## 编辑子图

双击子图，或点击右上角的图标进入编辑模式。

基本操作与通常相同，但与外部交互的参数需要连接到子图的输入输出插槽（左端・右端）。

![](https://gyazo.com/5d5ebc1bc37a8dfdaad5a5db64d66cb2){gyazo=loop}

---

## 公开参数设置

可以将子图内的参数，作为子图节点的 Widget 公开表露出来。
这样无需每次都进入编辑模式即可更改数值。

- 1. 选中子图
- 2. 点击 `Node Selection Toolbox` 的 `Edit Subgraph Widgets`
- 3. 勾选想要公开的参数

![](https://gyazo.com/024e67b6cea67bda0849829b3762f4ba){gyazo=loop}

---

## 子图的保存与复用

保存创建的子图后，可以将其作为独特的节点进行复用。

- 1. 选中子图
- 2. 点击 `Node Selection Toolbox` 的 `📖` (Publish Subgraph)
- 3. 输入名称并 `Confirm`

保存后，可以像普通节点一样通过搜索（双击）进行调用。

也可以从侧边栏的节点库中确认，并在此处进行 Blueprint 的删除或编辑。

![](https://gyazo.com/74f9469b12a6b87fc7a62099dde54db7){gyazo=loop}

[](/workflows/begin-with/subgraphs/Chroma_key.json)
