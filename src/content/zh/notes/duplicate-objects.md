---
layout: page.njk
lang: zh
section: notes
slug: duplicate-objects
navId: duplicate-objects
title: "生成图像里的人或物体出现了“分身”"
created: 2026-02-06
updated: 2026-03-02
noteTags: ["troubleshoot", "prompt"]
summary: "人物或物体不自然地变多时的解决办法"
seoTitle: "生成图像中人或物体重复出现的原因与对策"
seoDescription: "图像生成 AI 中人物或物体不自然增多的原因和解决方法。讲解 Stable Diffusion 1.5 等在过高分辨率或极端宽高比下生成时出现该问题的理由。"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: ""
---

## 症状

- 明明指定了 `a single person` 或 `a single dog`，却出来了好几个人或物体。
- 手、脸等部分部位看起来变多了。

## 什么时候会出现

- 用 Stable Diffusion 1.5 以 1024px 以上等过高的分辨率生成时。
- 以极端的竖长或横长分辨率生成时。

## 原因

- SD1.5 是用 512px 左右的正方形图像训练的，分辨率比这更大时，构图就不容易稳定。
  - 详细背景请参阅 → [为什么生成 512px × 512px？](/zh/notes/why-512px/)。

## 解决方法

- **用接近模型推荐分辨率的尺寸生成**
  - SD1.5 的话，就在 512〜768px 左右试试。
