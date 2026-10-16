---
layout: page.njk
lang: ja
section: basic-workflows
slug: moss-image
navId: moss-image
title: "MOSS-Image"
created: 2026-10-17
updated: 2026-10-17
summary: "MOSS-Imageでの画像生成"
seoTitle: "ComfyUIでMOSS-Imageを使う：表現の自由度が高い画像生成"
seoDescription: "約32億枚の画像でゼロから学習された、表現の自由度が高い5Bの画像生成モデルMOSS-Imageの、ComfyUIでの使い方。モデルのダウンロード、プロンプトの書き方、text2imageとBBOXでレイアウトを指定するworkflowを紹介します。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/moss-image/moss_image_hero.png"
tags: []
---

## MOSS-Imageとは？

[MOSS-Image](https://openmoss.ai/MOSS-Image/) は、約32億枚の画像でゼロから事前学習された 5B の画像生成モデルです。

面白いのは、学習データにほとんど品質フィルタをかけていないことで、透かしやボケのある画像も捨てずにキャプションをつけて学ばせています。  
そのおかげか、表現の自由度が非常に高いです。とくにアニメ系の絵がここまでまとまっているモデルは、最先端のモデルを見渡してもなかなか見当たりません。

商用も可能な寛容なライセンスを持っているため、これからコミュニティでどう育っていくのか楽しみなモデルです。

{% runpod %}

---

## 推奨設定値

- 解像度
  - 1MP 〜 2MP（最大 4MP）
  - 縦横ともに 16 の倍数

---

## モデルのダウンロード

- diffusion_models
  - [moss_image_sft_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/MOSS-Image/blob/main/diffusion_models/moss_image_sft_int8_convrot.safetensors) (5.41 GB)
- text_encoders
  - [qwen3.5_9b_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/MOSS-Image/blob/main/text_encoders/qwen3.5_9b_int8_convrot.safetensors) (9.75 GB)
- vae
  - [flux2-vae.safetensors](https://huggingface.co/Comfy-Org/MOSS-Image/blob/main/vae/flux2-vae.safetensors) (336 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── moss_image_sft_int8_convrot.safetensors
    ├── 📂text_encoders/
    │   └── qwen3.5_9b_int8_convrot.safetensors
    └── 📂vae/
        └── flux2-vae.safetensors
```

---

## プロンプト

自然文だけでなく、タグ形式にも対応しています。タグを使う場合、[Anima](/ja/basic-workflows/anima/) に似ていますが、以下の順で書いてください。

```text
Quality -> Score -> Meta -> Year -> Character -> Series -> Artist -> General
```

---

## text2image

![](/media/basic-workflows/moss-image/moss_image_text2image.png){media=image}

[](/workflows/basic-workflows/moss-image/moss_image_text2image.json)

- `steps`: 25
- `cfg`: 3.0
- `SkipLayerGuidanceDiTSimple`
  - `single_layers`: 22
  - `end_percent`: 0.5
  - これをオフにすると、崩れやすくなる代わりに非常にリアルになる…らしいです。オフは確かによく崩れるので、ここでは間をとって 0.5 にしています。

{% outputs %}
![output](/media/basic-workflows/moss-image/moss_image_text2image_output.png){media=image}
{% endoutputs %}

### text2image with BBOX

BBOX で、どこに何を置くかを指定できます。

![](/media/basic-workflows/moss-image/moss_image_text2image_bbox.png){media=image}

[](/workflows/basic-workflows/moss-image/moss_image_text2image_bbox.json)

- `Create Bounding Boxes`
  - BBOX を描くためのコアノードです。ドラッグでボックスを追加して、そこに置きたいものを書いていきます。
  - `width` / `height` は、出力サイズ（`Resolution Selector` の値）に合わせます。

  > [!WARNING]
  > `width` / `height` には `Resolution Selector` の値をつなぎたくなりますが、今はバグがあり、外部入力で解像度を入力すると BBOX の座標がずれてしまいます。  
  > 同じ値を手で入力してください。

- `MOSS-Image Layout Prompt`
  - 画像全体についてのプロンプトを書きます。
  - ボックスの情報とプロンプトを、MOSS-Image が学習している JSON の形にまとめて出してくれます。

{% outputs %}
![output](/media/basic-workflows/moss-image/moss_image_text2image_bbox_output.png){media=image}
{% endoutputs %}
