---
layout: page.njk
lang: zh
section: ai-capabilities
slug: video-to-audio
navId: video-to-audio
title: video2audio
created: 2026-02-06
updated: 2026-03-02
summary: 从视频自动生成音效或环境音的技术
seoTitle: "video2audio：从视频自动生成音效的 AI"
seoDescription: "讲解 video2audio：为没有声音的生成视频配上与画面同步的音效和环境音。介绍 FoleyCrafter 与 HunyuanVideo-Foley 的原理和特点。"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---

## 什么是 video2audio？

除了 Sora 2、Veo 3 等少数模型，现在的视频生成模型大多仍然只生成画面。也就是说，没有声音。

这时就轮到 **video2audio** 出场了——一种从视频生成音频的技术。

它会从画面中理解“正在发生什么”，再生成与之对应、并和画面同步的声音。

---

## FoleyCrafter

FoleyCrafter 是一个 **在现有 Text2Audio 模型之上加了“视频适配器”的 Video2Audio 框架**。

<iframe width="100%" height="540" src="https://www.youtube.com/embed/7m4YLrSBOv0" title="FoleyCrafter: Bring Silent Videos to Life with Lifelike and Synchronized Sounds" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

可以理解为：给原本的 Text2Audio 模型补上了“看了画面后，什么声音合适”“该在什么时候响（时机）”这些信息。

---

## HunyuanVideo-Foley

[HunyuanVideo-Foley](https://szczesnys.github.io/hunyuanvideo-foley/) 是一个从一开始就以 **文本＋视频→音频** 为目标设计的多模态扩散 Transformer。

它不像 FoleyCrafter 那样在 text2audio 模型上追加功能，而是从一开始就把文本、视频和音频放在一起训练。
