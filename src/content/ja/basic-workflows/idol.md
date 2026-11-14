---
layout: page.njk
lang: ja
section: basic-workflows
slug: idol
navId: idol
title: "Idol"
created: 2026-11-13
summary: "画像1枚から3D Gaussian Splatを作る"
seoTitle: "ComfyUIでIdolを使う：画像1枚から3D Gaussian Splatを生成"
seoDescription: "画像1枚から3D Gaussian Splat（3DGS）を生成するIdolの、ComfyUIでの使い方。TripoSplatと同じ構造なので、ComfyUI標準のTripoSplatノードで動かせます。必要なモデルとworkflowを解説します。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/idol/idol_hero.mp4"
tags: []
---

## Idolとは？

[Idol](https://huggingface.co/speridlabs/idol) は、speridlabs が公開した、画像 1 枚から 3D Gaussian Splat（3DGS）を生成するモデルです。

Idol は TripoSplat と同じ構造のモデルなので、ComfyUI では TripoSplat のノードを使います。

---

## モデルのダウンロード

- background_removal
  - [birefnet.safetensors](https://huggingface.co/Comfy-Org/BiRefNet/blob/main/background_removal/birefnet.safetensors) (444 MB)
- diffusion_models
  - [idol_fp16.safetensors](https://huggingface.co/Comfy-Org/Idol/blob/main/diffusion_models/idol_fp16.safetensors) (741 MB)
- clip_vision
  - [dino_v3_vit_h_bf16.safetensors](https://huggingface.co/Comfy-Org/Idol/blob/main/clip_vision/dino_v3_vit_h_bf16.safetensors) (1.68 GB)
- vae
  - [flux2-vae.safetensors](https://huggingface.co/Comfy-Org/Idol/blob/main/vae/flux2-vae.safetensors) (336 MB)
  - [idol_decoder_fp16.safetensors](https://huggingface.co/Comfy-Org/Idol/blob/main/vae/idol_decoder_fp16.safetensors) (576 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂background_removal/
    │   └── birefnet.safetensors
    ├── 📂clip_vision/
    │   └── dino_v3_vit_h_bf16.safetensors
    ├── 📂diffusion_models/
    │   └── idol_fp16.safetensors
    └── 📂vae/
        ├── flux2-vae.safetensors
        └── idol_decoder_fp16.safetensors
```

---

## image to 3DGS

![](/media/basic-workflows/idol/idol_image2gaussian_splat.png){media=image}

[](/workflows/basic-workflows/idol/idol_image2gaussian_splat.json)

- `Remove Background`
  - BiRefNet で背景を除去します。
- `TripoSplat Preprocess Image`
  - マスクで切り抜いた対象を、黒背景の正方形の中央に置き直します。
- `TripoSplat Decode`
  - `num_gaussians` は、生成する Gaussian の数です。
  - 262144 より増やしても密になるだけで、細部は増えません。
- `Create 3D File (from Splat)` → `Save 3D Model`
  - Splat を `.ply` で保存し、そのまま 3D ビューで確認できます。

{% outputs %}
![](/media/basic-workflows/idol/idol_turntable.mp4){media=loop}
{% endoutputs %}
