---
layout: page.njk
lang: ja
section: basic-workflows
slug: esrgan
navId: esrgan
title: "ESRGAN"
summary: "画像のアップスケールと顔補正"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: ""
tags: ["upscale-restoration"]
---

## ESRGANとは？

拡散モデル（Stable Diffusionなど）が流行る前、画像生成の主役は **GAN** でした。  
ESRGANは、その GAN 世代から引き継がれてきたアップスケール用のモデルです。

ESRGANは、低解像度の画像を高解像度にアップスケールするための **超解像GAN** です。  
ただ拡大するのではなく、「それっぽい細部」を描き足しながら 2〜4倍に拡大してくれます。

拡散モデルのアップスケールに比べて非常に軽量なので、いまだ活躍する機会は多いですね。

## モデルのダウンロード

用途によってめちゃめちゃな数のモデルがありますが、ひとまず、以下のモデルを使ってみましょう。

**RealESRGAN**
- `ComfyUI Manager` → `Model Manager`
- `RealESRGAN x4` と検索して `Install` してください。

[OpenModelDB](https://openmodeldb.info/)
  - 有志によって開発されたモデルが共有されています。
  - クリーンアップに特化したモデルなどもあり、眺めているだけでも楽しめますね。

## ESRGANでアップスケールする

![](https://gyazo.com/daebc07f85601b354c872a0a27f3fec1){gyazo=image}

[](/workflows/basic-workflows/esrgan/RealESRGAN.json)

- 🟩 `Load Upscale Model`ノードに任意のモデルを読み込みます。

### 倍率を修正する

`RealESRGAN x4` のように大体のアップスケーラーには `x4` のような文字があります。
これは倍率で、このモデルを使ってアップスケールすると **強制的に** 4倍になります。

しかし、例えばHires.fixのworkflowに組み込むときなどは4倍だと大きすぎます。
こういったときはアップスケーラーで大きくした画像を縮小する処理を追加します。

### workflow

![](https://gyazo.com/c05fc016293e3f1ae55b153cf1adaaae){gyazo=image}

[](/workflows/basic-workflows/esrgan/RealESRGAN_x0.5.json)

- 🟨 `scale_by`の値を変更して倍率を調整できます。
- この場合なら、`4倍 × 0.5倍` で、最終的には2倍の解像度になります。

---

## GFPGANで顔だけ補正する

**顔（Face）専用の復元GAN** として GFPGAN というものがあります。  
ノイズで崩れた顔を検出し、「学習済みのきれいな顔」に寄せて描き直すタイプのモデルです。

FaceSwapノードなどの後処理で「ついでに顔だけ整える」用途で登場することがあります。

詳しい使い方はここでは扱いませんが、**「顔を専用に直す仕上げ用GANがある」** 程度に覚えておけば十分です。
