---
layout: page.njk
lang: ja
section: basic-workflows
slug: qwen-image
navId: qwen-image
title: "Qwen-Image"
created: 2025-12-11
updated: 2026-03-02
summary: "Qwen-Imageの使い方"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/4f6ca42890bb8717fa4668d8c56bcbc5.png"
tags: []
---

## Qwen-Imageとは？

[Qwen-Image](https://github.com/QwenLM/Qwen-Image) は、中国 Alibaba 系の Qwen チームが開発した画像生成モデルです。

テキストエンコーダにマルチモーダル LLM の **Qwen2.5-VL** を使っており、T5 や Gemma を使っているモデルに比べると、プロンプトの理解力は頭ひとつ抜けています。

さらに、[Flux.1 dev](/ja/basic-workflows/flux1/) と違ってベースが蒸留モデルではないため学習しやすく、姉妹モデルである [Qwen-Image-Edit](/ja/basic-workflows/qwen-image-edit/) と合わせて、LoRA や Lightning 系の周辺エコシステムが充実しているのも特徴です。

---

## 推奨解像度

Qwen-Image は 1.5M〜1.8M ピクセル前後が推奨です。

* 1:1 … 1328 × 1328
* 4:3 … 1472 × 1104
* 3:2 … 1584 × 1056
* 16:9 … 1664 × 928

---

## モデルのダウンロード

* diffusion_models

  * [qwen_image_fp8_e4m3fn.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/blob/main/split_files/diffusion_models/qwen_image_fp8_e4m3fn.safetensors)
* text_encoders

  * [qwen_2.5_vl_7b_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/blob/main/split_files/text_encoders/qwen_2.5_vl_7b_fp8_scaled.safetensors)
* vae

  * [qwen_image_vae.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/blob/main/split_files/vae/qwen_image_vae.safetensors)

- gguf（任意）

  * [city96/Qwen-Image-gguf](https://huggingface.co/city96/Qwen-Image-gguf/tree/main)
  * [unsloth/Qwen2.5-VL-7B-Instruct-GGUF](https://huggingface.co/unsloth/Qwen2.5-VL-7B-Instruct-GGUF/tree/main)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── qwen_image_fp8_e4m3fn.safetensors
    ├── 📂text_encoders/
    │   ├── qwen_2.5_vl_7b_fp8_scaled.safetensors
    │   └── Qwen2.5-VL-7B.gguf    ← gguf を使う場合のみ
    ├── 📂unet/
    │   └── qwen-image.gguf       ← gguf を使う場合のみ
    └── 📂vae/
        └── qwen_image_vae.safetensors
```

---

## text2image

![](https://gyazo.com/c06f913435b344d929cb0ec8e94d20c3){gyazo=image}

[](/workflows/basic-workflows/qwen-image/Qwen-Image.json)

* サンプラーは `euler` または `res_multistep` が使われることが多いです。

---

## ControlNet（InstantX）

Qwen-Image 向けの ControlNet モデルはいくつかありますが、使い勝手が良いので、**ControlNet-Union** として提供されている InstantX ベースのものを紹介します。

### モデルのダウンロード

* controlnet

  * [Qwen-Image-InstantX-ControlNet-Union.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image-InstantX-ControlNets/blob/main/split_files/controlnet/Qwen-Image-InstantX-ControlNet-Union.safetensors)
  * [Qwen-Image-InstantX-ControlNet-Inpainting.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image-InstantX-ControlNets/blob/main/split_files/controlnet/Qwen-Image-InstantX-ControlNet-Inpainting.safetensors)

```text
📂ComfyUI/
└── 📂models/
    └── 📂controlnet/
        ├── Qwen-Image-InstantX-ControlNet-Union.safetensors
        └── Qwen-Image-InstantX-ControlNet-Inpainting.safetensors
```

### workflow

![](https://gyazo.com/dd47c0c42514446cddc587561e073e0d){gyazo=image}

[](/workflows/basic-workflows/qwen-image/Qwen-Image-InstantX-ControlNet-Union.json)

![](https://gyazo.com/26cde876245eaa2fb914859216fc66a4){gyazo=image}

[](/workflows/basic-workflows/qwen-image/Qwen-Image-InstantX-ControlNet-Inpainting.json)

---

## Lightning（高速生成 LoRA）

**Qwen-Image-Lightning** は、Qwen-Image を **4 / 8 steps で回せるように蒸留した LoRA セット** です。

ほとんど劣化なしで大幅にステップ数を減らせるため、かなり多くの workflow で採用されています。

### モデルのダウンロード

* loras

  * [Qwen-Image-Lightning-4steps-V2.0-bf16.safetensors](https://huggingface.co/lightx2v/Qwen-Image-Lightning/blob/main/Qwen-Image-Lightning-4steps-V2.0-bf16.safetensors)
  * [Qwen-Image-Lightning-8steps-V2.0-bf16.safetensors](https://huggingface.co/lightx2v/Qwen-Image-Lightning/blob/main/Qwen-Image-Lightning-8steps-V2.0-bf16.safetensors)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        ├── Qwen-Image-Lightning-4steps-V2.0-bf16.safetensors
        └── Qwen-Image-Lightning-8steps-V2.0-bf16.safetensors
```

### workflow

![](https://gyazo.com/08f16f6f84c2d76a7ad1d50c617d32ef){gyazo=image}

[](/workflows/basic-workflows/qwen-image/Qwen-Image_lightning_8steps.json)

* `LoraLoaderModelOnly` ノードで Lightning LoRA を読み込みます。
* `KSampler` の `steps` を 4 または 8、`CFG` を 1.0 に設定します。

