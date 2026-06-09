---
layout: page.njk
lang: ja
section: basic-workflows
slug: pixeldit-pid
navId: pixeldit-pid
title: "PixelDiT / PiD"
created: 2026-06-09
updated: 2026-06-09
summary: "PixelDiT と PiD を使った画像生成・高解像度デコード"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/d2c8e2acd81c8ab3a69526c0e33f40f2.png"
tags: [upscale-restoration]
---

## PixelDiT

**[PixelDiT](https://pixeldit.github.io/)** は、NVIDIA が公開している **ピクセル拡散モデル** です。

Stable Diffusion 以降の画像生成モデルの多くは、[Latent Diffusion Model](/ja/ai-capabilities/latent-diffusion-vae/) という仕組みを使っています。

画像を 1 ピクセルずつ計算するのは大変なので、一度 latent という小さな表現に圧縮することで計算量を減らしつつ、形や色、構図のような特徴を扱いやすくしているんですね。

ただ、latent からピクセルに戻すときに、細かい文字、模様といった細部がどうしても劣化してしまいます。

**ピクセル拡散モデル** は、latent を介さずに画像をピクセル空間のまま扱います。そのため、VAE による復元劣化は仕組み的に起きません。

計算量を下げるための latent だったんじゃないの？という疑問は残りますが、画像全体をそのまま細かく見るのではなく、パッチに分けて大まかに見つつ、細部はピクセル側で描き込むといった工夫でこれを解決しています。

### モデルのダウンロード

- diffusion_models
  - [pixeldit_1300m_1024px_bf16.safetensors](https://huggingface.co/Comfy-Org/PixelDiT/blob/main/diffusion_models/pixeldit_1300m_1024px_bf16.safetensors) (2.6 GB)
- text_encoders
  - [gemma_2_2b_it_elm_bf16.safetensors](https://huggingface.co/Comfy-Org/PixelDiT/blob/main/text_encoders/gemma_2_2b_it_elm_bf16.safetensors) (5.23 GB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── pixeldit_1300m_1024px_bf16.safetensors
    └── 📂text_encoders/
        └── gemma_2_2b_it_elm_bf16.safetensors
```

### text2image

![](https://gyazo.com/fd716c0bb5f65a54aad3363c31da7d15){gyazo=image}

PixelDiT 単体で text2image を行う workflow です。

[Latent Diffusion Model](/ja/ai-capabilities/latent-diffusion-vae/) のように VAE を経由しないため、細かい文字やテクスチャの崩れ方が少し違います。
ただし、この記事ではまず ComfyUI で動かすための入口として扱います。

---

## PiD

**PiD** は、VAE Decode の代わりに使う PixelDiT です。

通常は、生成した latent を VAE Decode して画像に戻します。
PiD では、その latent を PixelDiT に渡して、画像への復元と拡大をまとめて行います。

例えば、Z-Image-Turbo で 1024×1024 の latent を作り、VAE Decode する前に PiD へ渡します。
`1024_to_4096` の PiD なら、それを 4096×4096 の画像として出力します。

既存モデルの生成力を使いつつ、VAE Decode による細部劣化を避けられる、というわけです。

中身としては、他の latent 拡散モデルが作った latent を条件にして、4 ステップ蒸留した PixelDiT モデルで画像生成しています。

### モデルの選び方

PiD は、元になる latent 空間に合わせて選びます。

たとえば `1024_to_4096` は、1024px 相当の latent / 出力を PiD に渡し、4096px の画像として出すためのモデルです。
対応していないモデルや解像度の組み合わせでは、うまく動かなかったり、絵が崩れたりします。

### モデルのダウンロード

**SDXL 用**

- [pid_sdxl_1024_to_4096_4step_bf16.safetensors](https://huggingface.co/Comfy-Org/PixelDiT/blob/main/diffusion_models/pid_sdxl_1024_to_4096_4step_bf16.safetensors)

**Qwen-Image 用**

- [pid_qwenimage_1024_to_4096_4step_bf16.safetensors](https://huggingface.co/Comfy-Org/PixelDiT/blob/main/diffusion_models/pid_qwenimage_1024_to_4096_4step_bf16.safetensors)

**Flux.1 / Z-Image 用**

- [pid_flux1_512_to_2048_4step_bf16.safetensors](https://huggingface.co/Comfy-Org/PixelDiT/blob/main/diffusion_models/pid_flux1_512_to_2048_4step_bf16.safetensors)
- [pid_flux1_1024_to_4096_4step_bf16.safetensors](https://huggingface.co/Comfy-Org/PixelDiT/blob/main/diffusion_models/pid_flux1_1024_to_4096_4step_bf16.safetensors)

**Flux.2 用**

- [pid_flux2_512_to_2048_4step_bf16.safetensors](https://huggingface.co/Comfy-Org/PixelDiT/blob/main/diffusion_models/pid_flux2_512_to_2048_4step_bf16.safetensors)
- [pid_flux2_1024_to_4096_4step_2606_bf16.safetensors](https://huggingface.co/Comfy-Org/PixelDiT/blob/main/diffusion_models/pid_flux2_1024_to_4096_4step_2606_bf16.safetensors)

```text
📂ComfyUI/
└── 📂models/
    └── 📂diffusion_models/
        ├── pid_flux1_512_to_2048_4step_bf16.safetensors
        ├── pid_flux1_1024_to_4096_4step_bf16.safetensors
        ├── pid_flux2_512_to_2048_4step_bf16.safetensors
        └── pid_flux2_1024_to_4096_4step_2606_bf16.safetensors
```

### Z-Image-Turbo → PiD

![](https://gyazo.com/be589a49f195194b86b2ccef61cdc250){gyazo=image}

Z-Image-Turbo の latent を、通常の VAE Decode ではなく PiD 側へ接続する例です。

`Context Windows (Manual)` ノードは、いわゆるタイリング用です。
OOM する場合や、縦長・横長の画像で出力が荒れる場合に使います。

### 任意の画像をアップスケール

PiD は latent を入力にするため、任意の画像を使う場合は、いったん対応する VAE で latent に変換してから渡します。

ただし、やっていることは本質的には描き直しなので、忠実な再現が必要な用途には向かないことに注意です。

---

## 参考

- [PixelDiT](https://pixeldit.github.io/)
- [PiD: Fast and High-Resolution Latent Decoding with Pixel Diffusion](https://research.nvidia.com/labs/sil/projects/pid/)
- [ComfyUI Pull Request: Support NVIDIA PixelDiT and PiD](https://github.com/Comfy-Org/ComfyUI/pull/14103)
- [Comfy-Org / PixelDiT](https://huggingface.co/Comfy-Org/PixelDiT)
