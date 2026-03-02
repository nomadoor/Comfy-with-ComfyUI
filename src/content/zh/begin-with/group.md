---
layout: page.njk
lang: zh
section: begin-with
slug: group
navId: group
title: "组 (Group)"
summary: "关于将节点汇总的组功能"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## ComfyUI 中的组 (Group)

ComfyUI 的组功能，与其说是“功能上将节点捆绑在一起”，不如说是一个**将接触到框（矩形）的节点统一处理**的 UI 功能。
因此，虽然它在视觉整理上很方便，但根据布局不同，有时会连同非预期的节点一起移动。

如果你想创建功能上的集合体，[Subgraph](/zh/begin-with/subgraphs/) 会更适合。

## 创建组

### 手动创建

- 在画布上右键点击 → `Add Group`
- 执行框的大小变更或移动，将节点收纳进框内

![](https://gyazo.com/8cc0775e0b3f0bf5605f9b3aedf0665c){gyazo=loop}

### 从选中的节点创建

- 选中节点 → 点击 `Node Selection Toolbox` 的 `#` (Frame Nodes)

> 由于分组框固定为矩形，根据布局不同，有时可能会包含未选中的节点。
> 因为这会降低布局的自由度，所以我个人不太常使用组功能。

![](https://gyazo.com/b1c0185c6afc1de67f01acd041169f7c){gyazo=loop}

## 编辑分组框

点击分组框的标题栏，从 `Node Selection Toolbox` 进行操作。

- **Color**: 更改颜色
- **Remove**: 删除分组框

![](https://gyazo.com/5aedd107ed53fa8d73da8cfdbbf7d898){gyazo=loop}

## 组的操作

右键点击分组框的标题栏，或从 `Node Selection Toolbox` 的 `⋮` 进行操作。

- **Fit Group to Nodes**: 自动调整框的大小
- **Select Nodes**: 全选组内的节点
- **Bypass Group Nodes**: 批量屏蔽组内的节点

![](https://gyazo.com/2469b9f9e950748aa68bd9ee6c418841){gyazo=loop}

## 移动分组框

拖动分组框时，接触到的节点也会一起移动。
当只想微调位置时，我们并不希望节点跟过来。

按住 `Ctrl` + `Alt` 进行拖动，即可仅移动分组框。

![](https://gyazo.com/09e16ba51468b0e313ba1c0f445550d4){gyazo=loop}
