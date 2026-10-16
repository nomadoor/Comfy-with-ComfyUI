---
layout: page.njk
lang: zh
section: begin-with
slug: wireless-nodes
navId: wireless-nodes
title: "无线化"
created: 2026-02-06
updated: 2026-03-02
summary: "关于节点间的无线通信"
seoTitle: "ComfyUI 节点无线化：Set 与 Get 节点"
seoDescription: "减少连线、整理工作流的 ComfyUI 节点无线化方法。介绍 KJNodes 的 Set / Get 节点用法，以及过度使用反而难以阅读的注意点。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 什么是节点无线化

节点式工具最大的特点，就是只需用线连接各个功能就能进行复杂的处理。
但反过来，节点和连线越多，画面就越乱（变成一盘意大利面），最后完全看不出在做什么。

于是冒出“把数据无线传过去不就好了？”这种想法，也是很自然的事吧。

---

## 自定义节点

有几个能实现无线化的自定义节点。
[chrisgoringe/cg-use-everywhere](https://github.com/chrisgoringe/cg-use-everywhere) 也很有名，不过最近更常用的是更简单好用的 **KJNodes** 这一套。

- **[kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)**

---

### Set & Get 节点

使用方法非常简单。

![](/media/begin-with/wireless-nodes/legacy_gyazo_fd49b6cc5d0da73a01189cc407104371.png){media=image}

[](/workflows/begin-with/wireless-nodes/set_get.json)


- 1. **Set 节点** (发送方):
    - 输入数据，并在 `Constant` 中设置任意名称（ID）。
- 2. **Get 节点** (接收方):
    - 在 `Constant` 中设置与发送方相同的名称，即使离得很远也能接收数据。

---

## 方便，但别滥用

![](/media/begin-with/wireless-nodes/legacy_gyazo_0128233c9681fdaa4ad62d7afe59d2aa.png){media=image}

[](/workflows/begin-with/wireless-nodes/set_get_image2image.json)

在 [Readable Node 及其推荐](/zh/begin-with/readable-nodes/) 中也提到过，节点式工具最大的优点就是“光看连接的线就能掌握数据的流动”。
随意无线化的话，就会变成“这张图像数据是从哪儿飞过来的？”，处理流程很难追踪。

如果同一个变量在一个工作流的各处反复出现，无线化倒是挺方便，但说到底，那么大的工作流或许本来就该拆小一点(；・∀・)
