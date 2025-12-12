---
layout: page.njk
lang: ja
section: faq
slug: duplicate-objects
navId: duplicate-objects
title: "生成画像で人や物体が分身している"
summary: "人物や物体が不自然に増えてしまうときの対処法"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 症状

- `a single person` や `a single dog` と指定しているのに、人物や物体が複数体出てくる。
- 手や顔など、一部のパーツだけが増殖しているように見える。

## 発生するタイミング

- Stable Diffusion 1.5 で 1024px 以上など、高すぎる解像度で生成したとき。
- 極端な縦長・横長の解像度で、生成したとき。

## 原因

- SD1.5 が 512px 近辺の正方形画像で学習されており、それより大きい解像度では構図が安定しにくい。
  - 詳しい背景は → [512px × 512pxで生成するのはなぜ？](/ja/faq/why-512px/) を参照。

## 解決方法

- **モデルの推奨解像度に近いサイズで生成する**
  - SD1.5 なら 512〜768px 付近で試す。
