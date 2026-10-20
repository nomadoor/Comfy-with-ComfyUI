---
layout: page.njk
lang: ja
section: basic-workflows
slug: z-image
navId: z-image
title: "Z-Image"
created: 2026-01-31
updated: 2026-10-20
summary: "Z-Imageでの画像生成"
seoTitle: "ComfyUIでZ-Imageを使う：ベースモデルとControlNet"
seoDescription: "Alibaba / Tongyi-MAIの画像生成モデルファミリーZ-Imageのベースモデルの、ComfyUIでの使い方。text2image、Z-Image-Turboでのリファイン、Fun ControlNet Union 2.1のworkflowを紹介します。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/z-image/legacy_gyazo_39cddc1debeff5423090f2fe87e5b038.png"
tags: []
---

## Z-Imageとは？

Z-Image は、Alibaba / Tongyi-MAI による **画像生成モデルファミリー** です。

![](/media/basic-workflows/z-image/z_family.png){media=image}

Z-Image という名前自体がモデル群の総称なので少し分かりにくいですが、このページでは、派生元となる ベースモデルとしての **Z-Image** を扱います。
（区別のために Z-Image-Base と呼ばれることもあります。）


Z-Image は、（ファインチューニング元となる）ベースモデルとして、素直な特性を持っています。

[Z-Image-Turbo](/ja/basic-workflows/z-image-turbo/) のような蒸留・強化学習による安定化が入っていないため、シードや初期ノイズの違いが出力に反映されやすく、創造性とバリエーションが広い反面、パラメータにシビアで結果が大きく振れる難しいモデルでもあります。

{% runpod %}

---

## 推奨設定値

- 解像度
  - 512×512 〜 2048×2048（総ピクセル数）
  - 幅と高さは 16 の倍数にします

---

## モデルのダウンロード

- diffusion_models
  - [z_image_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/z_image/blob/main/split_files/diffusion_models/z_image_int8_convrot.safetensors) (6.20 GB)
  - [z_image_turbo_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/z_image_turbo/blob/main/split_files/diffusion_models/z_image_turbo_int8_convrot.safetensors) (6.20 GB)
    - 🚨 Z-Image-Turbo によるリファインで使用
- text_encoders
  - [qwen_3_4b_fp8_mixed.safetensors](https://huggingface.co/Comfy-Org/z_image/blob/main/split_files/text_encoders/qwen_3_4b_fp8_mixed.safetensors) (5.63 GB)
- vae
  - [ae.safetensors](https://huggingface.co/Comfy-Org/z_image/blob/main/split_files/vae/ae.safetensors) (335 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   ├── z_image_int8_convrot.safetensors
    │   └── z_image_turbo_int8_convrot.safetensors
    ├── 📂text_encoders/
    │   └── qwen_3_4b_fp8_mixed.safetensors
    └── 📂vae/
        └── ae.safetensors
```

---

## text2image

![](/media/basic-workflows/z-image/z_image.png){media=image}

[](/workflows/basic-workflows/z-image/z_image.json)

- `steps` : サンプラーにもよりますが、30〜40 ほどと少し多めのほうが安定します

{% outputs %}
![](/media/basic-workflows/z-image/z_image_output.png){media=image}
{% endoutputs %}

## Z-Image-Turbo によるリファイン

Z-Image の生成結果を、Z-Image-Turbo で短いステップでリファインする方法です。
Z-Image の創造性と、Z-Image-Turbo の品質の安定感の両取りを狙います。

image2image してもいいですが、ここでは少しオシャレにサンプリングを2段に分けてみましょう。

![](/media/basic-workflows/z-image/z_image_refine_turbo.png){media=image}

[](/workflows/basic-workflows/z-image/z_image_refine_turbo.json)

今回は前半50%、後半50%で分けます。
(cf. [サンプリングを分割する](/ja/basic-workflows/ksampler-advanced/#サンプリングを分割する))

- Z-Image : 30 steps のうち 15 steps
- Z-Image-Turbo : 8 steps のうち 4 steps

{% outputs %}
![Z-Image のみ](/media/basic-workflows/z-image/z_image_only_output.png){media=image} ![Z-Image + Turbo](/media/basic-workflows/z-image/z_image_refine_turbo_output.png){media=image}
{% endoutputs %}


## Z-Image-Fun-Controlnet-Union-2.1

Z-Image 用の ControlNet 風パッチです。

### モデルのダウンロード

- model_patches

  - [Z-Image-Fun-Controlnet-Union-2.1.safetensors](https://huggingface.co/alibaba-pai/Z-Image-Fun-Controlnet-Union-2.1/blob/main/Z-Image-Fun-Controlnet-Union-2.1.safetensors) (6.71 GB)
- geometry_estimation
  - [depth_anything_3_mono_large.safetensors](https://huggingface.co/Comfy-Org/Depth-Anything-3/blob/main/geometry_estimation/depth_anything_3_mono_large.safetensors) (1.34 GB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂model_patches/
    │   └── Z-Image-Fun-Controlnet-Union-2.1.safetensors
    └── 📂geometry_estimation/
        └── depth_anything_3_mono_large.safetensors
```

### workflow

![](/media/basic-workflows/z-image/z_image_fun_controlnet_union_2_1.png){media=image}

[](/workflows/basic-workflows/z-image/z_image_fun_controlnet_union_2_1.json)

- `QwenImageDiffsynthControlnet` にモデルと制御画像を追加
- 🟩 この workflow では Depth Anything 3 で深度マップを作成します。

{% outputs %}
![input](/media/basic-workflows/z-image/z_image_fun_controlnet_union_2_1_input.png){media=image} ![depth](/media/basic-workflows/z-image/z_image_fun_controlnet_union_2_1_depth_image.png){media=image} ![output](/media/basic-workflows/z-image/z_image_fun_controlnet_union_2_1_output.png){media=image}
{% endoutputs %}



## 参考

- [Comfy.Org blog](https://blog.comfy.org/p/z-image-day-0-support-in-comfyui?utm_campaign=post-expanded-share&utm_medium=web&triedRedirect=true)
- [A different way of combining Z-Image and Z-Image-Turbo](https://www.reddit.com/r/StableDiffusion/comments/1qqzlv8/a_different_way_of_combining_zimage_and/)
