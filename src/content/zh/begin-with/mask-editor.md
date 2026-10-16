---
layout: page.njk
lang: zh
section: begin-with
slug: mask-editor
navId: mask-editor
title: "蒙版编辑器"
created: 2026-02-06
updated: 2026-03-02
summary: "蒙版编辑器的使用方法"
seoTitle: "ComfyUI 蒙版编辑器的使用方法"
seoDescription: "在 ComfyUI 中给图像绘制蒙版的蒙版编辑器用法。包括打开方式、画笔、橡皮擦、填充、自动选择等工具、顶部菜单，以及蒙版的保存与应用。"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## 什么是蒙版编辑器

这是一个可以在 ComfyUI 中把图像的特定部分画成蒙版（黑白图像）的工具。

除了制作蒙版，它还带有简单的绘画功能。

---

## 启动方法

- 选中 `Load Image` 节点等 → 点击 `Node Selection Toolbox` 的 `🌔` (Open Mask Editor)

![](/media/begin-with/mask-editor/legacy_gyazo_41526255834943bb591e62583d85d324.mp4){media=loop}

---

## 工具操作

用最左侧的标签切换功能。

- ※如果浏览器关闭了“硬件加速”，运行可能会变卡。

### 蒙版绘制 (Mask)

用画笔绘制蒙版。

- **Brush Shape**: 画笔形状
- **Thickness**: 画笔粗细
- **Opacity**: 不透明度
  - AI 生成中的蒙版通常按“非白即黑（0 或 1）”来处理，所以基本保持最大值就行。
- **Hardness**: 画笔硬度（模糊程度）
- **Smoothing precision**: 线条修正强度

### 绘画 (Paint)

给图像上色。可以用作 Inpaint 时的引导等。

- **Color Selector**: 选择绘制颜色

![](/media/begin-with/mask-editor/legacy_gyazo_398548a6895a8ad00ab2c9f5cf509222.mp4){media=loop}

### 橡皮擦 (Eraser)

擦除画好的蒙版或颜色。

在 Mask 或 Paint 模式下直接 **点击右键**，也能当橡皮擦用。

### 填充

填充手绘蒙版围起来的区域。

- **Tolerance**: 容差
  - 太低的话会留下缝隙，最好调高一些。

![](/media/begin-with/mask-editor/legacy_gyazo_98edbb1b4ca8324d0974416546194a3c.mp4){media=loop}

### 自动选择

也就是所谓的“魔棒工具”。

自动把与点击处颜色相近的区域变成蒙版。

- **Tolerance**: 颜色的容差

![](/media/begin-with/mask-editor/legacy_gyazo_bf6ca9fd1af91d39c50174a4ef981b90.mp4){media=loop}

---

## 顶部菜单操作

- **Undo / Redo**: 撤销 / 重做
- **Clear**: 清空
- **Invert**: 反转蒙版

---

## 保存与应用

- 点击 `Save to node`

编辑内容会应用到节点上，编辑器随之关闭。

![](/media/begin-with/mask-editor/legacy_gyazo_05a4f6930a6d074435ac29b77c97e82e.mp4){media=loop}
