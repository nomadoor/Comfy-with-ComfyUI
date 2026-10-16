---
layout: page.njk
lang: zh
section: ai-capabilities
slug: frame-interpolation
navId: frame-interpolation
title: 帧插值
created: 2026-02-06
updated: 2026-03-02
summary: 让视频更流畅，或把相隔较远的帧连接起来的技术
seoTitle: "什么是帧插值？让视频更流畅的 AI（VFI、FLF2V）"
seoDescription: "在视频帧之间插入新帧的帧插值技术。介绍提升帧率的传统 VFI、用视频生成 AI 连接相隔较远帧的生成式插值（FLF2V），以及视频延长。"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: 'https://github.com/google-research/frame-interpolation/raw/main/moment.gif'
---

## 什么是帧插值？

**帧插值（Video Frame Interpolation / VFI）** 是一种在视频的帧与帧之间插入新帧，使动作看起来更流畅的技术。

它很早就被用来让老旧、卡顿的视频变流畅，或者补足慢动作导致下降的 fps。

此外，随着视频生成 AI 的出现，还诞生了 **生成式帧插值 (Generative interpolation)** 这种超越单纯 FPS 插值的技术。

---

## 提高 fps 的帧插值（经典 VFI）

一般的 VFI 会接收时间上很接近的两帧（相隔不到 0.1 秒左右），生成夹在两者之间的 1 张以上“中间帧”。不断重复这一过程，就能增加整个视频的帧数。

![](/media/ai-capabilities/frame-interpolation/legacy_gyazo_af7273352979b5286d8f85a9b6915ab6.mp4){media=loop}

[](/workflows/ai-capabilities/frame-interpolation/vfi_gmfss.json)

插值方法有很多种，比如 [FILM](https://github.com/google-research/frame-interpolation) 和 GMFSS。

---

## Generative interpolation（FLF2V）

传统的帧插值，连接的是“几乎没有变化的相邻帧”。

最近又更进一步，出现了 **借助视频生成模型，填补相隔 1 秒以上的帧之间空白** 的技术。

![](/media/ai-capabilities/frame-interpolation/legacy_gyazo_669467e658bbd5cd9e03207a5ccd1faa.mp4){media=loop}

[](/workflows/ai-capabilities/frame-interpolation/tooncrafter_interp.json)

给它两张图像，它会在两者之间生成 **“带有故事的动作”**，把它们连接起来。

这不是单纯的线性插值，“中间发生了什么”也在一定程度上由 AI 来创造，所以与其说是变形 (Morphing)，不如说更接近“有一小段故事的视频”。

ToonCrafter 是这一类中较早的模型，但每当新的视频模型出现，都会跟着出现自然得多的 FLF2V 模型，所以现在几乎没有理由再用它了。

---

## Extension

到这里为止的帧插值，都是“对每一对相邻帧分别独立处理”。
即使输入了 3 帧以上，也只是像下面这样，反复做两帧之间的插值而已。

- 填补第 1–2 张之间…
- 填补第 2–3 张之间…
- 填补第 3–4 张之间…

![](/media/ai-capabilities/frame-interpolation/legacy_gyazo_356c0e45a7ccf73ace4714f84ccc30fa.mp4){media=loop}

VACE 的 **Extension** 在此基础上又进了一步。

传统 VFI “只看相邻两帧之间”，而 Extension 会在整段视频中放置多个关键帧，由生成模型把它们之间的部分整体连接起来。

比如要生成一段 81 帧的视频。
在其中几帧的位置插入“关键帧”，模型就会 **在同一条时间轴上** 把这些关键帧自然地连接起来，生成视频。

![](/media/ai-capabilities/frame-interpolation/legacy_gyazo_1bd83bd9c5258b25ce9016917516a526.png){media=image}

与 FLF2V 相比，生成的视频要自然得多。今后大概会是 Extension 这类技术成为主流吧。
