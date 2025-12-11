---
layout: page.njk
lang: ja
section: basic-workflows
slug: chroma1-hd
navId: chroma1-hd
title: "Chroma1-HD"
summary: "Chroma1-HDでFlux.1-schnellを拡張する"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/326db88733896540f58ce60e7320824f.png"
tags: []
---

## Chroma1-HDとは？

[Flux.1 [dev]](/ja/basic-workflows/flux1/) は素晴らしいモデルでしたが、コミュニティで広く使ううえでは大きく2つの課題がありました。

- 強く蒸留されているため、LoRA やフルファインチューニングとの相性があまり良くない
- 非商用ライセンス

そこで、より寛大なライセンスを持つ Flux.1 [schnell] を出発点に、「脱蒸留版 Flux」 を再構築しようとする試みがいくつか現れ、その中で最も労力をかけられたもののひとつが LodestoneRock による [Chroma1-HD](https://huggingface.co/lodestones/Chroma1-HD) です。

NSFW やアニメ画像も含めて再学習されているため、元の Flux 系よりもスタイルの自由度が高く、「脱蒸留版 Flux」というよりは、Flux 系アーキテクチャをベースにした新しい汎用モデル と捉えたほうがしっくりきます。

---

## モデルのダウンロード

Chroma1-HD は Flux.1 と違い、CLIP は使わず、T5 のみを利用します。

- diffusion_models  
  - [Chroma1-HD.safetensors](https://huggingface.co/lodestones/Chroma1-HD/blob/main/Chroma1-HD.safetensors)
- text_encoders  
  - [t5xxl_fp8_e4m3fn_scaled.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/t5xxl_fp8_e4m3fn_scaled.safetensors)
- vae  
  - [ae.safetensors](https://huggingface.co/black-forest-labs/FLUX.1-schnell/blob/main/ae.safetensors)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── Chroma1-HD.safetensors
    ├── 📂text_encoders/
    │   └── t5xxl_fp8_e4m3fn_scaled.safetensors
    └── 📂vae/
        └── ae.safetensors
```

## text2image

![](https://gyazo.com/319a7dc82aeea486d7f0912c830fb258){gyazo=image}

[](/workflows/basic-workflows/chroma1-hd/Chroma1-HD.json)

- 基本的な組み方は Flux.1 とほぼ同じです。
- 🟦 T5TokenizerOptions は、トークン数が設定値より少ないときに padding で埋めるノードです。入れても入れなくても大きな差はありません。
- CFGは4.0が規定となっていますが、6〜7 が良いという声もあります。色々試してみてください。