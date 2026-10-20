---
layout: page.njk
lang: ja
section: basic-workflows
slug: z-image-turbo
navId: z-image-turbo
title: "Z-Image-Turbo"
created: 2025-12-12
updated: 2026-10-20
summary: "Z-Image-Turboでの画像生成"
seoTitle: "ComfyUIでZ-Image-Turboを使う：8ステップの高速画像生成"
seoDescription: "Z-Imageを8ステップで生成できるように蒸留した高速モデルZ-Image-Turboの、ComfyUIでの使い方。モデルのダウンロード、text2image、Fun ControlNet Unionのworkflowを紹介します。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/z-image-turbo/legacy_gyazo_8cb43e18daed0bcb2bf3bf7c794e5360.png"
tags: []
---

## Z-Image-Turboとは？

Z-Image は、Alibaba / Tongyi-MAI による **画像生成モデルファミリー** です。

![](/media/basic-workflows/z-image-turbo/legacy_gyazo_569a829f2dbd9021bfdecf6d1e3267b9.png){media=image}

**Z-Image-Turbo** は、[Z-Image (Base)](/ja/basic-workflows/z-image) を、少ないステップ数(8 steps) で生成できるよう蒸留した高速モデル です。  
また、単に高速化しただけでなく、安定した画質を得ることを目的とした強化学習もあわせて施されています。

そのため、設定を細かく詰めなくても 美しい画像を手早く生成できる 一方で、
シードによるバリエーションは控えめで、得意分野は 実写 に偏っています。  
イラスト調や特殊なプロンプト表現については、あまり得意ではありません。

余談ではありますが、Z-Image ファミリーの中では 最も早い段階で公開されたモデル です。

---

## モデルのダウンロード

- diffusion_models
  - [z_image_turbo_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/z_image_turbo/blob/main/split_files/diffusion_models/z_image_turbo_int8_convrot.safetensors) (6.20 GB)
- text_encoders
  - [qwen_3_4b_fp8_mixed.safetensors](https://huggingface.co/Comfy-Org/z_image_turbo/blob/main/split_files/text_encoders/qwen_3_4b_fp8_mixed.safetensors) (5.63 GB)
- vae
  - [ae.safetensors](https://huggingface.co/Comfy-Org/z_image_turbo/blob/main/split_files/vae/ae.safetensors) (335 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── z_image_turbo_int8_convrot.safetensors
    ├── 📂text_encoders/
    │   └── qwen_3_4b_fp8_mixed.safetensors
    └── 📂vae/
        └── ae.safetensors
```

---

## text2image

Z-Image-Turbo は、Flux.1 dev と同じタイプの **蒸留モデル** です。

![](/media/basic-workflows/z-image-turbo/z_image_turbo.png){media=image}

[](/workflows/basic-workflows/z-image-turbo/z_image_turbo.json)

- `steps` … 6〜8
- `cfg` … 1.0

{% outputs %}
![](/media/basic-workflows/z-image-turbo/z_image_turbo_output.png){media=image}
{% endoutputs %}

---

## Z-Image-Turbo Fun ControlNet Union

Z-Image-Turbo 用の ControlNet 風パッチです。

### モデルのダウンロード

- model_patches
  - [Z-Image-Turbo-Fun-Controlnet-Union-2.1-lite-2602-8steps.safetensors](https://huggingface.co/alibaba-pai/Z-Image-Turbo-Fun-Controlnet-Union-2.1/blob/main/Z-Image-Turbo-Fun-Controlnet-Union-2.1-lite-2602-8steps.safetensors) (2.02 GB)
- geometry_estimation
  - [depth_anything_3_mono_large.safetensors](https://huggingface.co/Comfy-Org/Depth-Anything-3/blob/main/geometry_estimation/depth_anything_3_mono_large.safetensors) (1.34 GB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂model_patches/
    │   └── Z-Image-Turbo-Fun-Controlnet-Union-2.1-lite-2602-8steps.safetensors
    └── 📂geometry_estimation/
        └── depth_anything_3_mono_large.safetensors
```

### workflow

![](/media/basic-workflows/z-image-turbo/z_image_turbo_fun_controlnet_union_2_1.png){media=image}

[](/workflows/basic-workflows/z-image-turbo/z_image_turbo_fun_controlnet_union_2_1.json)

- `QwenImageDiffsynthControlnet` にモデルと制御画像を追加
- 🟩 この workflow では Depth Anything 3 で深度マップを作成します。

{% outputs %}
![input](/media/basic-workflows/z-image-turbo/z_image_turbo_fun_controlnet_union_2_1_input.png){media=image} ![depth](/media/basic-workflows/z-image-turbo/z_image_turbo_fun_controlnet_union_2_1_depth_image.png){media=image} ![output](/media/basic-workflows/z-image-turbo/z_image_turbo_fun_controlnet_union_2_1_output.png){media=image}
{% endoutputs %}