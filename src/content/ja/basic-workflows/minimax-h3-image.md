---
layout: page.njk
lang: ja
section: basic-workflows
slug: minimax-h3-image
navId: minimax-h3-image
title: "MiniMax H3 Image"
created: 2026-11-12
summary: "MiniMax H3 Imageでの画像生成と画像編集"
seoTitle: "ComfyUIでMiniMax H3 Imageを使う：最大16MPの画像生成と画像編集"
seoDescription: "動画生成モデルMiniMax H3と同じ祖先を持ち、16MPまで一発で生成できる画像生成モデルMiniMax H3 Imageの、ComfyUIでの使い方。推奨設定、必要なモデル、プロンプトの書き方、text2image、Ref2Image、画像編集のworkflowを解説します。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/minimax-h3-image/minimax_h3_image_hero.png"
tags: []
---

## MiniMax H3 Imageとは？

[MiniMax H3 Image](https://huggingface.co/MiniMaxAI/MiniMax-H3-Image) は、MiniMax が公開した画像生成モデルです。

動画生成モデルの [MiniMax H3](/ja/basic-workflows/minimax-h3/) と同じ祖先から派生したもので、画像生成と画像編集を 1 つのモデルで扱えます。

特徴は 16 MP という超巨大なサイズを一発で生成できることで、6 ステップ蒸留も相まって、4 MP なら非常に高速に生成できます。

{% runpod %}

---

## 推奨設定値

- 解像度
  - 4〜16 MP
    - 1:1 なら 2048 × 2048 〜 4096 × 4096 px です
  - 幅と高さは 32 の倍数にします

> [!WARNING]
> 大きな解像度も生成できる、というよりは、大きな解像度でないとうまく生成できません。最低でも 4 MP 以上でないと崩れます。

---

## モデルのダウンロード

- diffusion_models
  - [minimax_h3_image_pruned_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/MiniMax-H3-Image/blob/main/diffusion_models/minimax_h3_image_pruned_int8_convrot.safetensors) (21 GB)
- text_encoders
  - [qwen3vl_32b_minimax_h3_nvfp4_awq.safetensors](https://huggingface.co/Comfy-Org/MiniMax-H3-Image/blob/main/text_encoders/qwen3vl_32b_minimax_h3_nvfp4_awq.safetensors) (15.7 GB)
- vae
  - [minimax_h3_image_vae_fp16.safetensors](https://huggingface.co/Comfy-Org/MiniMax-H3-Image/blob/main/vae/minimax_h3_image_vae_fp16.safetensors) (1.17 GB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── minimax_h3_image_pruned_int8_convrot.safetensors
    ├── 📂text_encoders/
    │   └── qwen3vl_32b_minimax_h3_nvfp4_awq.safetensors
    └── 📂vae/
        └── minimax_h3_image_vae_fp16.safetensors
```

---

## プロンプト

以下が MiniMax 公式のプロンプトガイドですが、動画の [MiniMax H3](/ja/basic-workflows/minimax-h3/) と比べると、それほどシビアなプロンプトは求められません。自分の言葉で詳しく伝えてください。

- [h3-image-prompt-writing](https://github.com/MiniMax-AI/MiniMax-H3-Image/tree/main/skills/h3-image-prompt-writing)

### Ref2Image・画像編集

公式の書き方では `<Subject 1>` のように定義してから書く必要がありますが、試した限り、参照画像はつないだ順に `Picture 1`、`Picture 2` と普通に書けば大丈夫です。

また、画像編集であっても、「〜に変えて」と指示の形で書くより、出来上がりの絵を描写したほうが安定するような気がします。

```text
The image shows the man from Picture 1 sitting deep in the chair from Picture 3, wearing the headphones from Picture 2.
```

> [!NOTE]
> プロンプトエンハンスは、Qwen3.5 9B では処理時間がかかるわりにミスも多く、短い文でも十分に生成できたので使っていません。

---

## text2image

![](/media/basic-workflows/minimax-h3-image/minimax_h3_image_text2image.png){media=image}

[](/workflows/basic-workflows/minimax-h3-image/minimax_h3_image_text2image.json)

{% outputs %}
![](/media/basic-workflows/minimax-h3-image/minimax_h3_image_text2image_output.png){media=image}
{% endoutputs %}

---

## Ref2Image

参照画像を組み合わせて、新しい画像を生成します。

参照画像は最大 16 枚まで使えます。

![](/media/basic-workflows/minimax-h3-image/minimax_h3_image_ref2image.png){media=image}

[](/workflows/basic-workflows/minimax-h3-image/minimax_h3_image_ref2image.json)

{% outputs %}
![Picture 1](/media/basic-workflows/minimax-h3-image/minimax_h3_image_ref2image_input1.png){media=image} ![Picture 2](/media/basic-workflows/minimax-h3-image/minimax_h3_image_ref2image_input2.png){media=image} ![Picture 3](/media/basic-workflows/minimax-h3-image/minimax_h3_image_ref2image_input3.png){media=image} ![output](/media/basic-workflows/minimax-h3-image/minimax_h3_image_ref2image_output.png){media=image}
{% endoutputs %}

---

## 画像編集

![](/media/basic-workflows/minimax-h3-image/minimax_h3_image_edit.png){media=image}

[](/workflows/basic-workflows/minimax-h3-image/minimax_h3_image_edit.json)

- `Resize Image/Mask`
  - `MiniMax H3 Image Conditioning` は、入力画像の短辺が 1024〜2048 px に収まるよう、内部で勝手にリサイズしてしまいます。
  - 入力と出力のサイズをぴったり揃えるため、先に短辺を 2048 px にしています。

全身の写真がアップに変わるなど、構図が勝手に変わってしまうことがあります。そのときは、変えたくないものもプロンプトに書いておきましょう。

```text
The framing, pose, and background are the same as Picture 1.
```

{% outputs %}
![input](/media/basic-workflows/minimax-h3-image/minimax_h3_image_edit_input1.png){media=image} ![output](/media/basic-workflows/minimax-h3-image/minimax_h3_image_edit_output.png){media=image}
{% endoutputs %}
