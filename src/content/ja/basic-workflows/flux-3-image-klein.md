---
layout: page.njk
lang: ja
section: basic-workflows
slug: flux-3-image-klein
navId: flux-3-image-klein
title: "FLUX 3 Image Klein"
created: 2026-10-16
updated: 2026-10-16
summary: "FLUX 3 Image Klein 生成・画像編集workflow"
seoTitle: "ComfyUIでFLUX 3 Image Kleinを使う：画像生成と画像編集"
seoDescription: "画像生成、画像編集、BBOXによる配置指定を1つでこなすFLUX 3 Image Kleinの、ComfyUIでの使い方。モデルのダウンロード、Prompt Upsampler、text2image、Ref2Image、画像編集のworkflowを紹介します。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_hero.png"
tags: [instruction-based-image-editing]
---

## FLUX 3 Image Kleinとは？

**FLUX 3 Image Klein** は、Black Forest Labs の画像生成モデルです。

[FLUX.2 [klein]](/ja/basic-workflows/flux-2-klein/) の次の世代にあたり、画像生成、画像編集、Ref2Image を 1 つのモデルでこなします。  
BBOX で要素の配置や編集する範囲を指定できるのも面白いところ。[Ideogram 4.0](/ja/basic-workflows/ideogram-4/) と同じような使い方ですね。

ものすごく表現力が高いモデル、というわけではないですが、高速で気軽にポンポン生成できるのは気持ちが良いですね。

---

## 推奨設定値

- 解像度
  - 最大 4K
  - 縦横ともに 16 の倍数
- 参照画像枚数
  - 最大 10

---

## モデルのダウンロード

> [!WARNING]
> FLUX 3 Image Klein のモデルは、認証しないとダウンロードできません。Hugging Face のアカウントでログインし、[flux-3-image-klein-comfy のページ](https://huggingface.co/black-forest-labs/flux-3-image-klein-comfy) で利用条件に同意してください。
>
> ![](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_huggingface_gated.png){media=image}

- diffusion_models
  - [flux3_image_klein_sd_int8_convrot.safetensors](https://huggingface.co/black-forest-labs/flux-3-image-klein-comfy/blob/main/diffusion_models/flux3_image_klein_sd_int8_convrot.safetensors) (5.83 GB)
- text_encoders
  - [qwen3vl_4b_int8_convrot.safetensors](https://huggingface.co/black-forest-labs/flux-3-image-klein-comfy/blob/main/text_encoders/qwen3vl_4b_int8_convrot.safetensors) (4.86 GB)
  - [qwen3.5_9b_flux3_prompt_upsampler_int8_convrot.safetensors](https://huggingface.co/black-forest-labs/flux-3-image-klein-comfy/blob/main/text_encoders/qwen3.5_9b_flux3_prompt_upsampler_int8_convrot.safetensors) (9.75 GB)
    - Prompt Upsampler。Ref2Image / 画像編集で使用
- vae
  - [flux2-vae.safetensors](https://huggingface.co/black-forest-labs/flux-3-image-klein-comfy/blob/main/vae/flux2-vae.safetensors) (336 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── flux3_image_klein_sd_int8_convrot.safetensors
    ├── 📂text_encoders/
    │   ├── qwen3vl_4b_int8_convrot.safetensors
    │   └── qwen3.5_9b_flux3_prompt_upsampler_int8_convrot.safetensors
    └── 📂vae/
        └── flux2-vae.safetensors
```

---

## Prompt Upsampler

![](/media/basic-workflows/flux-3-image-klein/qwen3_5_9b_flux3_prompt_upsampler.png){media=image}

FLUX 3 Image Klein には、Prompt Upsampler（いわゆるプロンプトエンハンサー）が用意されています。  
Qwen3.5-9B をベースにした LLM で、短い指示を詳しいプロンプトに書き換えてくれます。

ただ、あまり表現力が高くないので、text2image ではオススメしません。  
BBOX を使う場合であっても、ChatGPT などに渡してプロンプトを書いてもらったほうが良いでしょう。

逆に Ref2Image / 画像編集では、これが無いと全く安定しないので、デフォルトで使うようにしています。

Prompt Upsampler 自体は 9B ありますが、拡散モデル本体が軽いので、そこまで負担にはならない…ハズ…

> [!NOTE]
> Ref2Image / 画像編集、BBOX のあり・なしで必要な指示が違うため、それぞれ別の system prompt を使っています（ここは公式 workflow と違います）。

---

## text2image

![](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_text2image.png){media=image}

[](/workflows/basic-workflows/flux-3-image-klein/flux_3_image_klein_text2image.json)

- `steps`: 15
- `CFG`: 1.0

{% outputs %}
![output](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_text2image_output.png){media=image}
{% endoutputs %}

### text2image with BBOX

プロンプトに座標を含めることで、どこに何を置くかを直感的に指示できます。

![](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_text2image_bbox.png){media=image}

[](/workflows/basic-workflows/flux-3-image-klein/flux_3_image_klein_text2image_bbox.json)

- `Create Bounding Boxes`
  - BBOX を描くためのコアノードです。ドラッグでボックスを追加して、そこに置きたいものを書いていきます。

  > [!NOTE]
  > `color_palette` で色も指定できますが、FLUX 3 Image Klein はこれを理解できないので、使っても意味がありません。

- `FLUX 3 Image Layout Prompt`
  - 画像全体についてのプロンプトを書きます。
  - ボックスの情報から FLUX 3 に必要なもの（ID・座標・説明）だけを抜き出して、プロンプトとまとめて出してくれます。
  - 雑に埋めた BBOX の `elements` を AI に渡して、プロンプトを作ってもらうのもいいですね。

{% outputs %}
![output](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_text2image_bbox_output.png){media=image}
{% endoutputs %}

---

## Ref2Image

参照画像をもとに、新しい画像を生成します。

![](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_ref2image.png){media=image}

[](/workflows/basic-workflows/flux-3-image-klein/flux_3_image_klein_ref2image.json)

指示は Prompt Upsampler（`Generate Text`）に書いてください。

`Set Reference Multi Latent` の出力の `empty_latent` を使うと、1 枚目の画像と同じサイズで出力されます。  
Ref2Image では好きなサイズで出力したいので、別途 `Empty Flux 2 Latent` をつないでいます。

{% outputs %}
![input](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_ref2image_input.png){media=image} ![output](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_ref2image_output.png){media=image}
{% endoutputs %}

---

## 画像編集

![](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_image_edit.png){media=image}

[](/workflows/basic-workflows/flux-3-image-klein/flux_3_image_klein_image_edit.json)

Ref2Image とほとんど同じですが、出力サイズは入力画像に合わせるので、`Set Reference Multi Latent` の `empty_latent` を使います。

Prompt Upsampler が入力画像と編集指示を見て、適切な形に直してくれます。

{% outputs %}
![input](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_image_edit_input.png){media=image} ![output](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_image_edit_output.png){media=image}
{% endoutputs %}

### 画像編集 with BBOX

BBOX で、どこを編集するかを指示できます。  
「ここに〇〇を追加して」という使い方もできますし、「A にあるものを B に移動させて」のようなこともできますね。

![](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_image_edit_bbox.png){media=image}

[](/workflows/basic-workflows/flux-3-image-klein/flux_3_image_klein_image_edit_bbox.json)

- `Create Bounding Boxes`
  - `background` に入力画像をつなぐと、解像度を自動でその画像に合わせてくれます。
  - 今回は鳥を移動させたいので、移動元のボックスに `src`、移動先のボックスに `tgt` という説明を付けています。
- `FLUX 3 Image Layout Prompt`
  - ここに編集指示を書きます。ボックスに付けた説明は、そのまま指示の中で使えますよ。

    ```text
    Move the bird from src to tgt.
    ```

{% outputs %}
![input](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_image_edit_bbox_input.jpg){media=image} ![output](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_image_edit_bbox_output.png){media=image}
{% endoutputs %}

---

## 参考

- [FLUX 3 Image Klein](https://bfl.ai/models/flux-3-image-klein)
- [Blog](https://bfl.ai/blog/flux-3-image-klein)
- [公式Doc](https://docs.bfl.ml/flux_3/flux3_image_klein)
