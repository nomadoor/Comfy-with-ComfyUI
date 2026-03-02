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

## Z-Image-Turboとは？

Z-Image は、Alibaba / Tongyi-MAI による **画像生成モデルファミリー** です。

![](https://gyazo.com/569a829f2dbd9021bfdecf6d1e3267b9){gyazo=image}

**Z-Image-Turbo** は、[Z-Image (Base)](/ja/basic-workflows/z-image) を、少ないステップ数(8 steps) で生成できるよう蒸留した高速モデル です。  
また、単に高速化しただけでなく、安定した画質を得ることを目的とした強化学習もあわせて施されています。

そのため、設定を細かく詰めなくても 美しい画像を手早く生成できる 一方で、
シードによるバリエーションは控えめで、得意分野は 実写 に偏っています。  
イラスト調や特殊なプロンプト表現については、あまり得意ではありません。

余談ではありますが、Z-Image ファミリーの中では 最も早い段階で公開されたモデル です。

---

## モデルのダウンロード

- diffusion_models  
  - [z_image_turbo_bf16.safetensors](https://huggingface.co/Comfy-Org/z_image_turbo/blob/main/split_files/diffusion_models/z_image_turbo_bf16.safetensors) (12.3 GB)
- text_encoders  
  - [qwen_3_4b.safetensors](https://huggingface.co/Comfy-Org/z_image_turbo/blob/main/split_files/text_encoders/qwen_3_4b.safetensors) (8.04 GB)
- vae  
  - [ae.safetensors](https://huggingface.co/Comfy-Org/z_image_turbo/blob/main/split_files/vae/ae.safetensors)（335 MB）

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