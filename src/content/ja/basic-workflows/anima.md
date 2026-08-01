---
layout: page.njk
lang: ja
section: basic-workflows
slug: anima
navId: anima
title: "Anima"
created: 2026-05-29
updated: 2026-08-01
summary: "Animaでの画像生成"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
tags: []
hero:
  image: "https://i.gyazo.com/1a342c19b3f7d493f6af396cde34891f.png"
---

## Animaとは？

[Anima](https://huggingface.co/circlestone-labs/Anima) は、CircleStone Labs と Comfy Org の協力によって作成された、2B パラメータの画像生成モデルです。

NVIDIA Cosmos をベースにし、数百万枚のアニメ画像とアート画像で学習された **純アニメモデル** です。

SDXL 世代のアニメ系モデルからの移行先として、かなり期待されているモデルのひとつですね。

> ライセンスは **CircleStone Labs Non-Commercial License** です。  
> Anima のモデル本体・派生モデル・LoRA などは非商用です。生成した画像は商用利用できます。

---

## モデルのダウンロード

* diffusion_models

  * [anima-base-v1.0.safetensors](https://huggingface.co/circlestone-labs/Anima/blob/main/split_files/diffusion_models/anima-base-v1.0.safetensors) (4.18 GB)
  * [anima-aesthetic-v1.1.safetensors](https://huggingface.co/circlestone-labs/Anima/blob/main/split_files/diffusion_models/anima-aesthetic-v1.1.safetensors) (4.18 GB)

* text_encoders

  * [qwen_3_06b_base.safetensors](https://huggingface.co/circlestone-labs/Anima/blob/main/split_files/text_encoders/qwen_3_06b_base.safetensors) (1.19 GB)

* vae

  * [qwen_image_vae.safetensors](https://huggingface.co/circlestone-labs/Anima/blob/main/split_files/vae/qwen_image_vae.safetensors) (254 MB)

> `anima-base-v1.0` は未調整のベースモデルです。
> `anima-aesthetic-v1.1` は、高品質な画像でファインチューニングされたモデルです。気軽に生成を試したいときは、基本的にこちらを使えばよいでしょう。

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   ├── anima-base-v1.0.safetensors
    │   └── anima-aesthetic-v1.1.safetensors
    ├── 📂text_encoders/
    │   └── qwen_3_06b_base.safetensors
    └── 📂vae/
        └── qwen_image_vae.safetensors
```

---

## プロンプト

Anima は Danbooru 系のタグ、自然文、その組み合わせで学習されています。

テキストエンコーダが賢いので [Pony Diffusion V6](/ja/basic-workflows/sdxl-anime/#pony-diffusion-v6-xl) ほどシビアになる必要はありませんが、プロンプトの先頭に以下のようなクオリティータグをつけておくと良いかもしれません。

```text
masterpiece, best quality, score_9, safe,
```

---

## text2image

![](https://gyazo.com/0e2f46074799b0e7a016ee1a5bd28118){gyazo=image}

[](/workflows/basic-workflows/anima/anima-aesthetic-v1.1.json)

* 推奨解像度は `512px` 〜 `1536px` です。
* `er_sde` や `euler_ancestral` のような、少し揺らぎを持たせるサンプラーが推奨されています。

---

## Anima LLLite

ControlNet-LLLite は、kohya 氏が開発した軽量な ControlNet です。

### モデルのダウンロード

* [Comfy-Org/Anima-LLLite](https://huggingface.co/Comfy-Org/Anima-LLLite/tree/main/model_patches)

制御画像に合わせて適切なモデルを用意してください。

> `v2` と書かれたものは Anima-Base v1.0 向けに学習されています。それ以外は旧 Preview3 版の Anima で学習されているので、効きが少し悪いかもしれません。

```text
📂ComfyUI/
└── 📂models/
    └── 📂model_patches/
        └── anima-lllite-*.safetensors
```

### anima-lllite-any-test-like-v2

![](https://gyazo.com/d42f85633b9036b7e2e6e806c064ef56){gyazo=image}

[](/workflows/basic-workflows/anima/anima-lllite-any-test-like-v2.json)

* `anima-lllite-any-test-like-v2` は、いくつかの制御をひとつにまとめたモデルです。ラフや線画から構図を渡したり、グレースケール画像を彩色できたりします。
* この workflow では、入力画像から `Canny` で輪郭を抽出し、制御画像として使っています。
