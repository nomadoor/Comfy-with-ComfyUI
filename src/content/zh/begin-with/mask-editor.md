---
layout: page.njk
lang: zh
section: begin-with
slug: mask-editor
navId: mask-editor
title: "蒙版编辑器"
summary: "关于蒙版编辑器的使用方法"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## 什么是蒙版编辑器

这是一个能在 ComfyUI 上将图像的特定部分作为蒙版（黑白图像）进行绘制的工具。

不仅可以创建蒙版，还具备简单的绘画功能。

---

## 启动方法

- 选中 `Load Image` 节点等 → 点击 `Node Selection Toolbox` 的 `🌔` (Open Mask Editor)

![](https://gyazo.com/41526255834943bb591e62583d85d324){gyazo=loop}

---

## 工具操作

通过左侧的标签切换功能。

- ※如果浏览器的“硬件加速”关闭，动作可能会变慢。

### 蒙版绘制 (Mask)

用画笔绘制蒙版。

- **Brush Shape**: 画笔形状
- **Thickness**: 画笔粗细
- **Opacity**: 不透明度
  - 由于 AI 生成中的蒙版通常以“白或黑（0 或 1）”来处理，因此基本上保持最大值即可。
- **Hardness**: 画笔硬度（模糊程度）
- **Smoothing precision**: 线条修正强度

### 绘画 (Paint)

给图像上色。可用于 Inpaint 时的引导等。

- **Color Selector**: 选择绘制颜色

![](https://gyazo.com/398548a6895a8ad00ab2c9f5cf509222){gyazo=loop}

### 橡皮擦 (Eraser)

擦除绘制的蒙版或绘画。

在 Mask 或 Paint 模式下，**点击右键** 也可以作为橡皮擦使用。

### 填充

填充被手绘蒙版围住的范围。

- **Tolerance**: 容差
  - 如果太低会产生缝隙，所以最好调高一点。

![](https://gyazo.com/98edbb1b4ca8324d0974416546194a3c){gyazo=loop}

### 自动选择

也就是所谓的“魔棒工具”。

自动将与点击处颜色相似的范围蒙版化。

- **Tolerance**: 颜色的容差

![](https://gyazo.com/bf6ca9fd1af91d39c50174a4ef981b90){gyazo=loop}

---

## 顶部菜单的操作

- **Undo / Redo**: 撤销 / 重做
- **Clear**: 清空
- **Invert**: 蒙版反转

---

## 保存与应用

- 点击 `Save to node`

编辑内容会被应用到节点上，编辑器关闭。

![](https://gyazo.com/05a4f6930a6d074435ac29b77c97e82e){gyazo=loop}
