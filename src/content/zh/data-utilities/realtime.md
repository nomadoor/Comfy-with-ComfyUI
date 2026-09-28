---
layout: page.njk
lang: zh
section: data-utilities
slug: realtime
navId: realtime
title: "实时处理"
created: 2026-02-06
updated: 2026-03-02
summary: "伪实时处理，以及 Instant/Change 的使用场景"
seoTitle: "ComfyUI 伪实时处理：Run (Instant / On Change)"
seoDescription: "ComfyUI 并不适合实时处理，但可以做到接近实时。讲解 Run (Instant) 与 Run (On Change) 的区别与使用场景，以及实时 image2image 和 video2video。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## ComfyUI 不适合实时处理

首先也是前提，ComfyUI **不适合实时处理**。
因为所有的处理都是作为一个 工作流 执行的，在一次处理结束之前无法进行下一个动作。

但是，通过在处理刚结束后自动注入下一个处理，可以“让它看起来像实时处理”。

---

## Run(Instant) / Run(Change)

ComfyUI 的输入节点有以下 2 种执行模式。

### Run (Instant)

![](/media/data-utilities/realtime/legacy_gyazo_ba99c003cb82d4e8f2a483eab84e9f03.mp4){media=loop}

- 一旦开始执行，**每次处理结束后都会自动重新执行相同的 工作流**
- 如果想停止，请切换到其他模式（不切换的话不会停止）

### Run (On Change)

![](/media/data-utilities/realtime/legacy_gyazo_59133ed0ac3bcc4d02f0a34cc8bf9320.mp4){media=loop}

- 仅在滑块等数值发生变化时执行
- 每次移动鼠标，处理都会自动进入队列

---

## 关于实时 image2image / video2video

理论上，通过对每一帧进行 image2image / video2video，可以创造出接近“实时视频加工”的体验。
但是，由于生成 AI 的推理毕竟需要时间，**实际意义上的实时处理是非常困难的**。

最新的研究正在拉近实现的距离，但暂时还需要脚踏实地的优化。

- 降低分辨率
- 切换到轻量模型
- 使用视频专用的加速技术（另文讲解）

> “实时 image2image”是 **依赖高速化技术的特殊工作流**。
