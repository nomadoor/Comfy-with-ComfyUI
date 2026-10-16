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

首先要说明的是，ComfyUI **并不适合实时处理**。
因为所有处理都作为一个工作流来执行，一次处理结束之前无法进入下一步。

不过，只要在一次处理刚结束时自动塞入下一次处理，就可以“让它看起来像是实时的”。

---

## Run(Instant) / Run(Change)

ComfyUI 的输入节点有以下 2 种执行模式。

### Run (Instant)

![](/media/data-utilities/realtime/legacy_gyazo_ba99c003cb82d4e8f2a483eab84e9f03.mp4){media=loop}

- 一旦开始执行，**每次处理结束后都会自动重新执行同一个工作流**
- 想停下来时，请切换到其他模式（放着不管是不会停的）

### Run (On Change)

![](/media/data-utilities/realtime/legacy_gyazo_59133ed0ac3bcc4d02f0a34cc8bf9320.mp4){media=loop}

- 仅在滑块等数值发生变化时执行
- 每次拖动鼠标，都会自动把一次处理加入队列

---

## 关于实时 image2image / video2video

理论上，逐帧做 image2image / video2video，就能做出接近“实时视频处理”的体验。
但生成 AI 的推理终究需要时间，**真正意义上的实时处理非常困难**。

最新的研究正在让它一步步接近现实，但暂时还需要一点一点地优化。

- 降低分辨率
- 切换到轻量模型
- 使用视频专用的加速技术（另文讲解）

> [!NOTE]
> “实时 image2image”是 **以加速技术为前提的特殊工作流**。
