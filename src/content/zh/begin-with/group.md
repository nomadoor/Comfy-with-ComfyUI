---
layout: page.njk
lang: zh
section: begin-with
slug: group
navId: group
title: "组 (Group)"
created: 2026-02-06
updated: 2026-03-02
summary: "介绍把节点归到一起的组功能"
seoTitle: "ComfyUI 组功能：用框整理节点"
seoDescription: "ComfyUI 组（Group）的用法。介绍组框的创建、编辑与移动，碰到框的节点也会跟着移动的机制，以及它和 Subgraph 的使用区分。"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## ComfyUI 中的组 (Group)

ComfyUI 的组，与其说是“按功能把节点捆在一起”，不如说是一个 **把碰到框（矩形）的节点放在一起处理** 的 UI 功能。
所以它在视觉上整理很方便，但根据摆放方式，有时会把不想动的节点也一起带走。

如果想按功能把节点归成一组，[Subgraph](/zh/begin-with/subgraphs/) 更合适。

## 创建组

### 手动创建

- 在画布上右键点击 → `Add Group`
- 调整框的大小和位置，把节点放进框内

![](/media/begin-with/group/legacy_gyazo_8cc0775e0b3f0bf5605f9b3aedf0665c.mp4){media=loop}

### 从选中的节点创建

- 选中节点 → 点击 `Node Selection Toolbox` 的 `#` (Frame Nodes)

> [!NOTE]
> 分组框只能是矩形，所以根据摆放方式，有时会把没选中的节点也框进去。
> 这会降低布局的自由度，所以我个人不太用组功能。

![](/media/begin-with/group/legacy_gyazo_b1c0185c6afc1de67f01acd041169f7c.mp4){media=loop}

## 编辑分组框

点击分组框的标题栏，然后在 `Node Selection Toolbox` 中操作。

- **Color**: 更改颜色
- **Remove**: 删除分组框

![](/media/begin-with/group/legacy_gyazo_5aedd107ed53fa8d73da8cfdbbf7d898.mp4){media=loop}

## 组的操作

右键点击分组框的标题栏，或者在 `Node Selection Toolbox` 的 `⋮` 中操作。

- **Fit Group to Nodes**: 自动调整框的大小
- **Select Nodes**: 全选组内的节点
- **Bypass Group Nodes**: 批量绕过（bypass）组内的节点

![](/media/begin-with/group/legacy_gyazo_2469b9f9e950748aa68bd9ee6c418841.mp4){media=loop}

## 移动分组框

拖动分组框时，接触到的节点也会一起移动。
可是只想微调框的位置时，并不希望节点跟着动。

按住 `Ctrl` + `Alt` 再拖动，就可以只移动分组框。

![](/media/begin-with/group/legacy_gyazo_09e16ba51468b0e313ba1c0f445550d4.mp4){media=loop}
