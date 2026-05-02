---
layout: page.njk
lang: ja
section: basic-workflows
slug: sd15-outpainting
navId: sd15-outpainting
title: "outpainting"
created: 2025-12-07
updated: 2026-03-02
summary: "outpaintingで画像の外側を描き足す"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: ""
---

## outpaintingとは？

outpainting は **画像の「外側」を描き足す** 手法です。

中身としては、inpainting の **「タイプB: 周囲の情報を見ながら、マスク部分を自然に埋める」** とまったく同じです。

画像の中にマスクがあるか、外側にあるか、それだけの違いです。

> [inpainting](/ja/basic-workflows/sd15-inpainting/) を先に読んでいる前提で進めます。

---

## inpaintingモデル

inpainting モデルを使った、素直なやり方です。

### workflow

![](https://gyazo.com/dc8564ec48c6ac898fa9f4f080e9bcfd){gyazo=image}

[](/workflows/basic-workflows/sd15-outpainting/SD1.5_outpainting_sd-v1-5-inpainting.json)

- [inpainting/inpaintingモデル](/ja/basic-workflows/sd15-inpainting/#inpaintingモデル) とほぼ同じです。
- 🟦 `Pad Image for Outpainting` ノードで、外側に画像を広げます。
  - 広がった部分がマスクとして出力されます。
- 🟩 あとは `InpaintModelConditioning` ノードに接続するだけです。

---

## ControlNet inpaint

好きなモデルをそのまま使いたい場合は、ControlNet inpaint を使います。

### workflow

![](https://gyazo.com/df7f466617d6c2bd773bedf0eeb03bb5){gyazo=image}

[](/workflows/basic-workflows/sd15-outpainting/SD1.5_outpainting_ControlNet_inpaint.json)

- 基本構成は [inpainting/ControlNet inpaint](/ja/basic-workflows/sd15-inpainting/#controlnet-inpaint) と同じです。
- 🟦 `Pad Image for Outpainting` ノードで、外側に画像を広げます。
  - こちらも、広がった部分がマスクになります。
- 🟨 outpainting 後の画像とマスクを、ControlNet inpaint 用の前処理ノードに渡します。
