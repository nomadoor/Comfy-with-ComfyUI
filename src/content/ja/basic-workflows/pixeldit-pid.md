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
  image: "https://gyazo.com/be589a49f195194b86b2ccef61cdc250"
tags: [upscale-restoration]
---

## PixelDiT

**PixelDiT** は、NVIDIA が公開している **ピクセル拡散モデル** です。

[Latent Diffusion Model](/ja/ai-capabilities/latent-diffusion-vae/) のように latent 空間で生成するのではなく、ピクセル空間そのものを denoise して画像を作ります。

ピクセル空間で処理する利点は、VAE の圧縮・復元を挟まないことです。
VAE は画像を扱いやすい latent に圧縮してくれる一方で、細かい文字、模様、エッジ、質感のような情報は落ちることがあります。

ピクセル拡散モデルでは、最終的な画像そのものに近い空間で denoise するため、こうした細部を直接作り込めます。
ただし、ピクセル空間は latent 空間よりずっと大きいので、そのまま扱うと計算量と VRAM 使用量が重くなります。

PixelDiT では画像をパッチとして扱い、全体の意味を扱う経路と、細部を詰めるピクセル側の経路を分けることで、この重さを抑えています。

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

**PiD** は、PixelDiT 系の仕組みを使って、既存の [Latent Diffusion Model](/ja/ai-capabilities/latent-diffusion-vae/) の **VAE Decode を置き換える** モデルです。

既存モデルが作った latent を **VAE Decode せずに** 受け取り、高解像度の画像として出力します。

通常の流れはこうです。

```text
Latent Diffusion Model
→ VAE Decode
→ アップスケール / 修復
```

PiD を使う場合は、ここをまとめます。

```text
Latent Diffusion Model
→ PiD
→ 高解像度画像
```

PiD は「アップスケーラ」として見てもよいですが、単純な画像アップスケールではありません。
入力するのは完成画像ではなく、モデルが生成した latent です。

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

### Z-Image-Turbo + PiD

![](https://gyazo.com/be589a49f195194b86b2ccef61cdc250){gyazo=image}

Z-Image-Turbo の latent を、通常の VAE Decode ではなく PiD 側へ接続する例です。

この場合、Z-Image 側では低めの解像度で latent を作り、PiD で 4K 相当まで引き上げます。
`1024_to_4096` の PiD を使う場合は、1024px から 4096px へ、つまり 4 倍の出力を狙う形になります。

`Context Windows (Manual)` ノードは、いわゆるタイリング用です。
OOM する場合や、縦長・横長の画像で出力が荒れる場合に使います。

---

## 参考

- [PixelDiT](https://pixeldit.github.io/)
- [PiD: Fast and High-Resolution Latent Decoding with Pixel Diffusion](https://research.nvidia.com/labs/sil/projects/pid/)
- [ComfyUI Pull Request: Support NVIDIA PixelDiT and PiD](https://github.com/Comfy-Org/ComfyUI/pull/14103)
- [Comfy-Org / PixelDiT](https://huggingface.co/Comfy-Org/PixelDiT)
