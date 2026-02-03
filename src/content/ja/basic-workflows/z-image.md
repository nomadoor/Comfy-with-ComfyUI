---
layout: page.njk
lang: ja
section: basic-workflows
slug: z-image
navId: z-image
title: "Z-Image"
summary: "Z-Imageでの画像生成"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/39cddc1debeff5423090f2fe87e5b038.png"
tags: []
---

## Z-Imageとは？

Z-Image は、Alibaba / Tongyi-MAI による **画像生成モデルファミリー** です。

![](https://gyazo.com/126c0d5ef1364355014fdd7e3288825c){gyazo=image}

Z-Image という名前自体がモデル群の総称なので少し分かりにくいですが、このページでは、派生元となる ベースモデルとしての **Z-Image** を扱います。
（区別のために Z-Image-Base と呼ばれることもあります。）


Z-Image は、（ファインチューニング元となる）ベースモデルとして、素直な特性を持っています。

[Z-Image-Turbo](/ja/basic-workflows/z-image-turbo/) のような蒸留・強化学習による安定化が入っていないため、シードや初期ノイズの違いが出力に反映されやすく、創造性とバリエーションが広い反面、パラメータにシビアで結果が大きく振れる難しいモデルでもあります。

---

## モデルのダウンロード

- diffusion_models  
  - [z_image_bf16.safetensors](https://huggingface.co/Comfy-Org/z_image/blob/main/split_files/diffusion_models/z_image_bf16.safetensors) (12.3 GB)
- text_encoders  
  - [qwen_3_4b.safetensors](https://huggingface.co/Comfy-Org/z_image/blob/main/split_files/text_encoders/qwen_3_4b.safetensors) (8.04 GB)
- vae  
  - [ae.safetensors](https://huggingface.co/Comfy-Org/z_image/blob/main/split_files/vae/ae.safetensors)（335 MB）

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── z_image_bf16.safetensors
    ├── 📂text_encoders/
    │   └── qwen_3_4b.safetensors
    └── 📂vae/
        └── ae.safetensors
```

---

## text2image

![](https://gyazo.com/8f4213b84c8d739021b8be032e8f6f8a){gyazo=image}

[](/workflows/basic-workflows/z-image/Z-Image.json)

- `steps` : サンプラーにもよりますが、30〜40 ほどと少し多めのほうが安定します

## Z-Image-Turbo によるリファイン

Z-Image の生成結果を、Z-Image-Turbo で短いステップでリファインする方法です。
Z-Image の創造性と、Z-Image-Turbo の品質の安定感の両取りを狙います。

image2image してもいいですが、ここでは少しオシャレにサンプリングを2段に分けてみましょう。

![](https://gyazo.com/2545e8ea917a80488d8687464185410d){gyazo=image}

[](/workflows/basic-workflows/z-image/Z-Image_refine-turbo.json)

今回は前半50%、後半50%で分けます。
(cf. [サンプリングを分割する](/ja/basic-workflows/ksampler-advanced/#サンプリングを分割する))

- 🟪 Z-Image : 30 steps のうち 15 steps
- 🟨 Z-Image-Turbo : 8 steps のうち 4 steps

**比較**

![Z-Image のみ](https://gyazo.com/73afc01007482bdfbcc0b0d33f75cb98){gyazo=image} ![Z-Image + Turbo](https://gyazo.com/0c1ece70589a7b42801f37383a604440){gyazo=image}


## Z-Image-Fun-Controlnet-Union-2.1

Z-Image 用の ControlNet 風パッチです。

### モデルのダウンロード

- model_patches

  - [Z-Image-Fun-Controlnet-Union-2.1.safetensors](https://huggingface.co/alibaba-pai/Z-Image-Fun-Controlnet-Union-2.1/blob/main/Z-Image-Fun-Controlnet-Union-2.1.safetensors) (6.71 GB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂model_patches/
        └── Z-Image-Fun-Controlnet-Union-2.1.safetensors

```

### workflow

![](https://gyazo.com/959448d98af117e9a56ee7b10ba3fb7b){gyazo=image}

[](/workflows/basic-workflows/z-image/Z-Image-Fun-Controlnet-Union-2.1.json)

- 🟩 `QwenImageDiffsynthControlnet` にモデルと制御画像を追加
- 🟩 この workflow では Depth Anything V2 で深度マップを作成します。



## 参考

- [Comfy.Org blog](https://blog.comfy.org/p/z-image-day-0-support-in-comfyui?utm_campaign=post-expanded-share&utm_medium=web&triedRedirect=true)
- [A different way of combining Z-Image and Z-Image-Turbo](https://www.reddit.com/r/StableDiffusion/comments/1qqzlv8/a_different_way_of_combining_zimage_and/)