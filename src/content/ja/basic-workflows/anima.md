---
layout: page.njk
lang: ja
section: basic-workflows
slug: anima
navId: anima
title: "Anima"
created: 2026-05-29
updated: 2026-05-29
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
> 非商用のみなので注意してください。

---

## モデルのダウンロード

* diffusion_models

  * [anima-base-v1.0.safetensors](https://huggingface.co/circlestone-labs/Anima/blob/main/split_files/diffusion_models/anima-base-v1.0.safetensors) (4.18 GB)

* text_encoders

  * [qwen_3_06b_base.safetensors](https://huggingface.co/circlestone-labs/Anima/blob/main/split_files/text_encoders/qwen_3_06b_base.safetensors) (1.19 GB)

* vae

  * [qwen_image_vae.safetensors](https://huggingface.co/circlestone-labs/Anima/blob/main/split_files/vae/qwen_image_vae.safetensors) (254 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── anima-base-v1.0.safetensors
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

![](https://gyazo.com/7e9aaaea23279a5d2ca5298c713b4f8f){gyazo=image}

[](/workflows/basic-workflows/anima/anima-base-v1.0.json)

- 推奨解像度は `512px` 〜 `1536px` です。
- `er_sde` や `euler_ancestral` のような、少し揺らぎを持たせるサンプラーが推奨されています。
