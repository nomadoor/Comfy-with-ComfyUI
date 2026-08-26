---
layout: page.njk
lang: ja
section: basic-workflows
slug: sd15-outpainting
navId: sd15-outpainting
title: "outpainting"
created: 2025-12-07
updated: 2026-08-26
summary: "outpaintingで画像の外側を描き足す"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: ""
---

## outpaintingとは？

outpainting は **画像の「外側」を描き足す** 手法です。

といっても、特別な生成方法ではありません。

画像の外側にわざわざ余白を作り、その余白をマスクにして inpainting しているだけです。

画像の中を埋めるか、外側に作った余白を埋めるか。それだけです。

> [inpainting](/ja/basic-workflows/sd15-inpainting/) をまだ読んでいなければ、先にご覧ください。

---

## inpaintingモデル

まずは、inpainting モデルを使う方法です。

### workflow

![](https://gyazo.com/dc8564ec48c6ac898fa9f4f080e9bcfd){gyazo=image}

[](/workflows/basic-workflows/sd15-outpainting/SD1.5_outpainting_sd-v1-5-inpainting.json)

- 🟦 `Pad Image for Outpainting` ノードで、画像の外側に余白を作ります。
  - 余白を追加した画像と、その余白を示すマスクが出力されます。
- 🟩 あとは [inpainting/inpaintingモデル](/ja/basic-workflows/sd15-inpainting/#inpaintingモデル) と同じです。画像とマスクを `InpaintModelConditioning` ノードに接続します。

---

## ControlNet inpaint

当然、ControlNet inpaint を使う方法もあります。

### workflow

![](https://gyazo.com/df7f466617d6c2bd773bedf0eeb03bb5){gyazo=image}

[](/workflows/basic-workflows/sd15-outpainting/SD1.5_outpainting_ControlNet_inpaint.json)

- 🟦 `Pad Image for Outpainting` ノードで、画像の外側に余白を作ります。
  - 余白を追加した画像と、その余白を示すマスクが出力されます。
- 🟨 あとは [inpainting/ControlNet inpaint](/ja/basic-workflows/sd15-inpainting/#controlnet-inpaint) と同じです。画像とマスクを、ControlNet inpaint 用の前処理ノードに渡します。

---

## 画像編集モデル

画像編集モデルを使うと、もっと簡単です。

画像の外側に灰色の領域（色はなんでもいいのですが）を付け足し、画像編集モデルに入力します。あとは、「灰色の部分を自然に outpaint して」とプロンプトで指示するだけです。

### FLUX.2 [klein]

[FLUX.2 \[klein\]](/ja/basic-workflows/flux-2-klein/) 9B を使ってみましょう。

![](https://gyazo.com/15ea40eaf859773d5a1543e1aba4df0b){gyazo=image}

[](/workflows/basic-workflows/sd15-outpainting/Flux.2-klein-9b_image-edit_outpainting.json)

- 🟩 マスクは使いません。余白を付け足した画像を渡して、そこを埋めるように指示しているだけです。
