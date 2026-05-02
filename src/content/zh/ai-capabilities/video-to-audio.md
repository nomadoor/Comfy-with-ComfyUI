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
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---

## 什么是 video2audio？

除了 Sora 2 或 Veo 3 等之外，目前的视频生成模型仍然只能生成视频。也就是说，没有声音。

这时有用的就是 **video2audio** —— 从视频生成音频的技术。

理解视频中“正在发生什么”，并生成与该内容对应的、与视频同步的声音。

---

## FoleyCrafter

FoleyCrafter 是 **在现有的 Text2Audio 模型上添加“视频用适配器”的 Video2Audio 框架**。

<iframe width="100%" height="540" src="https://www.youtube.com/embed/7m4YLrSBOv0" title="FoleyCrafter: Bring Silent Videos to Life with Lifelike and Synchronized Sounds" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

这就像是给原来的 Text2Audio 模型，加上了“看视频，什么声音是合适的”“应该什么时候响（时机）”的信息。

---

## HunyuanVideo-Foley

[HunyuanVideo-Foley](https://szczesnys.github.io/hunyuanvideo-foley/) 是从一开始就设想 **文本＋视频→音频** 的多模态扩散 Transformer。

不是像 FoleyCrafter 那样从一开始就给 text2audio 模型添加功能，而是将文本、视频、音频汇总进行学习。
