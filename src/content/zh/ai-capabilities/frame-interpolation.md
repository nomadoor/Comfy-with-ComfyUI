---
layout: page.njk
lang: zh
section: ai-capabilities
slug: frame-interpolation
navId: frame-interpolation
title: 帧插值
summary: 让视频更流畅，或连接分离帧的技术
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: 'https://github.com/google-research/frame-interpolation/raw/main/moment.gif'
---

## 什么是帧插值？

**帧插值（Video Frame Interpolation / VFI）** 是一种在视频的帧与帧之间插入新帧，使动作看起来更流畅的技术。

它很早就被用于让老旧卡顿的视频变流畅，或补充慢动作导致的 fps 下降等用途。

此外，随着视频生成 AI 的登场，也诞生了名为 **生成式帧插值 (Generative interpolation)** 的、不仅仅是单纯 FPS 插值的技术。

---

## 提高 fps 的帧插值（古典 VFI）

一般的 VFI 接收时间上接近的两张帧（不到 0.1 秒左右），在其间生成 1 张以上的“中间帧”。通过重复这个过程，增加视频整体的帧数。

![](https://gyazo.com/af7273352979b5286d8f85a9b6915ab6.png){gyazo=image}

[](/workflows/ai-capabilities/frame-interpolation/VFI_GMFSS.json)

存在 [FILM](https://github.com/google-research/frame-interpolation) 或 GMFSS 等各种补充手法。

---

## Generative interpolation（FLF2V）

传统的帧插值是连接“几乎没有变化的相邻帧”。

最近，从此通过前进一步，出现了 **用视频生成模型的力量填补相隔 1 秒以上帧之间** 类型的技术。

![](https://gyazo.com/669467e658bbd5cd9e03207a5ccd1faa.gif){gyazo=image}

[](/workflows/ai-capabilities/frame-interpolation/tooncrafter_interp.json)

只要给它两张图像，它就能在两者之间一边制作 **“有故事的动作”** 一边连接起来。

因为不是单纯的线性插值，AI 会在某种程度上创造“中间发生了什么”，所以与其说是变形 (Morphing)，不如说更接近“有短故事的视频”。

ToonCrafter 是这个系列的早期模型，但每次新的视频模型出现，都会出现自然度高出几个数量级的 FLF2V 模型，所以现在几乎没有使用它的意义了。

---

## Extension

到此为止的帧插值，是“对相邻的每一对独立进行处理”的。
即使有 3 张以上的输入帧，如下所示，也只是分别重复 2 张的帧插值。

- 填补第 1–2 张之间…
- 填补第 2–3 张之间…
- 填补第 3–4 张之间…

![](https://gyazo.com/356c0e45a7ccf73ace4714f84ccc30fa.gif){gyazo=loop}

VACE 的 **Extension** 则在此基础上进一步发展了。

相对于传统的 VFI“只看相邻的 2 张之间”，Extension 则是对一个整体视频配置多个关键帧，并在生成模型侧连接这期间的整体。

例如，假设要生成 81 帧的视频。
在其中插入几帧作为“关键帧”。模型会在 **同一个时间轴中** 自然地连接这些关键帧来生成视频。

![](https://gyazo.com/1bd83bd9c5258b25ce9016917516a526.gif){gyazo=image}

与 FLF2V 相比，生成的视频要自然得多。恐怕今后 Extension 这样的技术会成为主流吧。
