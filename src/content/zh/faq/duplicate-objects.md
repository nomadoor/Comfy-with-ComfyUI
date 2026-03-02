---
layout: page.njk
lang: zh
section: faq
slug: duplicate-objects
navId: duplicate-objects
title: "生成图像中人或物体分裂了"
summary: "人物或物体变得不自然地增多时的对策"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 症状

- 明明指定了 `a single person` 或 `a single dog`，人物或物体却出现了多个。
- 手或脸等，看起来只有一部分部件增殖了。

## 发生的时机

- 在 Stable Diffusion 1.5 中以 1024px 以上等过高的分辨率生成时。
- 以极端的纵长・横长分辨率生成时。

## 原因

- SD1.5 是以 512px 附近的正方形图像进行学习的，在比这大的分辨率下构图难以稳定。
  - 详细背景请参照 → [为什么生成 512px × 512px？](/zh/faq/why-512px/)。

## 解决方法

- **以接近模型推荐分辨率的尺寸进行生成**
  - 如果是 SD1.5 就在 512〜768px 附近尝试。
