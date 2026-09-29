---
layout: page.njk
lang: zh
section: begin-with
slug: canvas-navigation
navId: canvas-navigation
title: "画布操作"
created: 2026-02-06
updated: 2026-03-02
summary: "关于画布的操作"
seoTitle: "ComfyUI 画布操作：移动、缩放、全局显示"
seoDescription: "ComfyUI 画布的移动与缩放方法。介绍避免误拖动节点的技巧、显示整个工作流或聚焦单个节点，以及小地图的用法。"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---


## 移动画布

在广阔的画布上自由移动。

- **按住鼠标左键在空白处拖动**
- **按住鼠标中键（滚轮）拖动**
- **按住 Space 键的同时按住鼠标左键拖动**

> [!TIP]
> 如果在节点上按住鼠标左键拖动，移动的将不是画布而是节点本身。<br>
> 在节点密集的区域，推荐使用 **中键** 或 **Space 键** 进行移动，这样毫无压力。

![](/media/begin-with/canvas-navigation/legacy_gyazo_21e446d62dc091c9ad2972e824010680.mp4){media=loop}

---

## 放大/缩小（缩放）

- 滚动鼠标滚轮
- 点击窗口右下角的 `+` / `-` 按钮

![](/media/begin-with/canvas-navigation/legacy_gyazo_e4a9566bd88e073497c6e75b02b7bbf9.mp4){media=loop}

---

## 全局显示 / 聚焦节点 (Fit View)

当迷路或者想关注特定节点时非常方便。

- **全局显示**: 在未选择任何东西的状态下，点击窗口右下角的 `⏹️ (Fit View)`
- **聚焦节点**: 在选中节点的状态下，点击 `⏹️ (Fit View)`

![](/media/begin-with/canvas-navigation/legacy_gyazo_076543f8a710ae811112a54812adb348.mp4){media=loop}

---

## 小地图

可以在小窗口中确认画布的全貌。

- 点击窗口右下角的 `🗺️ (View Minimap)` 图标
- 或者是快捷键 `Alt + M`

![](/media/begin-with/canvas-navigation/legacy_gyazo_e5e2c39d837213a933b58059d27cd496.mp4){media=loop}
