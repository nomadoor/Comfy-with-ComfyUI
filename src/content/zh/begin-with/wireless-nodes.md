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
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 节点的无线化是什么

节点式工具最大的特点，就是只需用线连接各个功能就能进行复杂的处理。
反之，也存在着节点和连线越多，画面就越混乱（面条化），搞不清到底在做什么的问题。

在这种情况下，会产生“能不能无线传输数据？”的想法也是自然而然的趋势吧。

---

## 自定义节点

有几个能实现无线化的自定义节点。
[chrisgoringe/cg-use-everywhere](https://github.com/chrisgoringe/cg-use-everywhere) 很有名，但最近更简单易用的 **KJNodes** 套装也经常被使用。

- **[kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)**

---

### Set & Get 节点

使用方法非常简单。

![](https://gyazo.com/fd49b6cc5d0da73a01189cc407104371){gyazo=image}

[](/workflows/begin-with/wireless-nodes/Set_Get.json)


- 1. **Set 节点** (发送方):
    - 输入数据，并在 `Constant` 中设置任意名称（ID）。
- 2. **Get 节点** (接收方):
    - 在 `Constant` 中设置与发送方相同的名称，即可即使在很远的地方也能接收数据。

---

## 虽然方便但禁止滥用

![](https://i.gyazo.com/0128233c9681fdaa4ad62d7afe59d2aa.png){gyazo=image}

[](/workflows/begin-with/wireless-nodes/Set_Get_image2image.json)

在 [Readable Node 及其推荐](/zh/begin-with/readable-nodes/) 中也提到过，节点式工具最大的优点就是“光看连接的线就能掌握数据的流动”。
如果毫无节制地进行无线化，追踪“这个图像数据是从哪里飞过来的？”这样的处理流程就会变得非常困难。

如果同一个变量在一个 工作流 的各处反复出现，无线化可能会很方便，但说到底，那么大的 工作流 或许本身就应该被分割得更小(；・∀・)
