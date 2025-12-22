---
layout: page.njk
lang: ja
section: basic-workflows
slug: z-image-turbo
navId: z-image-turbo
title: "Z-Image-Turbo"
summary: "Z-Image-Turboでの画像生成"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/8cb43e18daed0bcb2bf3bf7c794e5360.png"
tags: []
---

## Z-Imageとは？

Z-Image は、Alibaba / Tongyi-MAI による **画像生成モデルファミリー** です。

- Z-Image-Base：ベースモデル（未公開）
- Z-Image-Turbo：Base を数ステップ用に蒸留した実写寄り text2image
- Z-Image-Edit：編集向けモデル（未公開）

現状ローカルで扱えるのは Z-Image-Turbo だけなので、このページでは Z-Image-Turbo に絞って扱います。

---

## モデルのダウンロード

- diffusion_models  
  - [z_image_turbo_bf16.safetensors](https://huggingface.co/Comfy-Org/z_image_turbo/blob/main/split_files/diffusion_models/z_image_turbo_bf16.safetensors)
- text_encoders  
  - [qwen_3_4b.safetensors](https://huggingface.co/Comfy-Org/z_image_turbo/blob/main/split_files/text_encoders/qwen_3_4b.safetensors)
- vae  
  - [ae.safetensors](https://huggingface.co/Comfy-Org/z_image_turbo/blob/main/split_files/vae/ae.safetensors)（Flux.1 と共通）

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── z_image_turbo_bf16.safetensors
    ├── 📂text_encoders/
    │   └── qwen_3_4b.safetensors
    └── 📂vae/
        └── ae.safetensors
```

---

## text2image

Z-Image-Turbo は、Flux.1 dev と同じタイプの **蒸留モデル** です。

![](https://gyazo.com/7e5d76cec53ee44278c313a30035463f){gyazo=image}

[](/workflows/basic-workflows/z-image-turbo/Z-Image-Turbo.json)

- `steps` … 6〜8
- `cfg` … 1.0

---

## Z-Image-Turbo Fun ControlNet Union

Z-Image-Turbo 用の ControlNet 風パッチです。

### モデルのダウンロード

- model_patches

  - [Z-Image-Turbo-Fun-Controlnet-Union-2.1.safetensors](https://huggingface.co/alibaba-pai/Z-Image-Turbo-Fun-Controlnet-Union-2.0/blob/main/Z-Image-Turbo-Fun-Controlnet-Union-2.1.safetensors)

```text
📂ComfyUI/
└── 📂models/
    └── 📂model_patches/
        └── Z-Image-Turbo-Fun-Controlnet-Union-2.1.safetensors
```

### workflow

![](https://gyazo.com/53c91fd9eeb8f94357b20839e5d8c967){gyazo=image}

[](/workflows/basic-workflows/z-image-turbo/Z-Image-Turbo-Fun-Controlnet-Union-2.1.json)

- 🟩 `QwenImageDiffsynthControlnet` にモデルと制御画像を追加
- 🟩 この workflow では Depth Anything V2 で深度マップを作成します。