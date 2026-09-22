---
layout: page.njk
lang: ja
section: basic-workflows
slug: qwen-image-2-1
navId: qwen-image-2-1
title: "Qwen-Image-2.1"
created: 2026-09-21
updated: 2026-09-22
summary: "Qwen-Image-2.1 での画像生成と画像編集"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_hero.png"
tags: []
workflowPerformance:
  qwen_image_2_1_text2image.json:
    level: 2
    runs:
      - { gpu: "RTX 4070 Ti 12GB", ram: "DDR5 64GB", time: "121s", tags: ["4MP"] }
  qwen_image_2_1_ref2image.json:
    level: 2
    runs:
      - { gpu: "RTX 4070 Ti 12GB", ram: "DDR5 64GB", time: "104s", tags: ["2MP"] }
  qwen_image_2_1_image_edit.json:
    level: 1
    runs:
      - { gpu: "RTX 4070 Ti 12GB", ram: "DDR5 64GB", time: "57s", tags: ["1MP"] }
  qwen_image_2_1_image_edit_local.json:
    level: 1
    runs:
      - { gpu: "RTX 4070 Ti 12GB", ram: "DDR5 64GB", time: "57s", tags: ["1MP"] }
  qwen_image_2_1_image_edit_local_mask.json:
    level: 2
    runs:
      - { gpu: "RTX 4070 Ti 12GB", ram: "DDR5 64GB", time: "114s", tags: ["2MP"] }
  qwen_image_2_1_outpainting.json:
    level: 2
    runs:
      - { gpu: "RTX 4070 Ti 12GB", ram: "DDR5 64GB", time: "88s", tags: ["2MP"] }
  qwen_image_2_1_text2image_rgba.json:
    level: 1
    runs:
      - { gpu: "RTX 4070 Ti 12GB", ram: "DDR5 64GB", time: "62s", tags: ["2MP"] }
  qwen_image_2_1_subject_extraction.json:
    level: 2
    runs:
      - { gpu: "RTX 4070 Ti 12GB", ram: "DDR5 64GB", time: "87s", tags: ["2MP"] }
  qwen_image_2_1_panorama.json:
    level: 2
    runs:
      - { gpu: "RTX 4070 Ti 12GB", ram: "DDR5 64GB", time: "146s", tags: ["4MP"] }
---

## Qwen-Image-2.1とは？

[Qwen-Image-2.1](https://qwen.ai/blog?id=qwen-image-2.1) は、画像生成と画像編集を 1 つにまとめた open weight の画像生成モデルです。

クローズドでは Qwen-Image 2.0 が先に公開されていましたが、open weight の Qwen-Image 系としては、`Qwen-Image-2512` / `Qwen-Image-Edit-2511` の後継ですね。

従来の Qwen-Image は生成用と編集用でモデルが分かれていましたが、2.x では [MiniMax H3](/ja/basic-workflows/minimax-h3/) と同じように、テキストも参照画像も一本の DiT にまとめて放り込むので、画像生成、編集、Ref2Image まで同じモデルで扱えます。

さらに RGBA、つまり透過画像の生成にもネイティブで対応しています。

画像生成部は 7B と小型ながら、生成、編集、参照、透過まで一通りできる。なかなか器用なモデルです。

---

## 推奨設定値

- 解像度
  - 2K（約 4 MP 推奨）
    - 1:1 なら 2048 × 2048 px です
  - 幅と高さは 32 の倍数にします

---

## モデルのダウンロード

- diffusion_models
  - [qwen_image_2.1_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image-2.1/blob/main/diffusion_models/qwen_image_2.1_int8_convrot.safetensors) (7.26 GB)
- text_encoders
  - [qwen3vl_8b_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image-2.1/blob/main/text_encoders/qwen3vl_8b_int8_convrot.safetensors) (9.35 GB)
- vae
  - [qwen_image_2.1_vae_bf16.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image-2.1/blob/main/vae/qwen_image_2.1_vae_bf16.safetensors) (676 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── qwen_image_2.1_int8_convrot.safetensors
    ├── 📂text_encoders/
    │   └── qwen3vl_8b_int8_convrot.safetensors
    └── 📂vae/
        └── qwen_image_2.1_vae_bf16.safetensors
```

---

## text2image

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_text2image.png){media=image}

[](/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_text2image.json)

- `CFG`: 1.0
  - 公式の workflow は CFG なしになっていますが、少し上げて Negative Prompt を使ってみる価値はあるかもしれませんね

良くも悪くも、Seed による差が非常に大きいです。解像度を変えても絵が大きく変わるので、いろいろな解像度と Seed で試してみてください。

**出力例**

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_text2image_output.png){media=image}

---

## Ref2Image

参照画像を組み合わせて、新しい画像を描いてもらいます。

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_ref2image.png){media=image}

[](/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_ref2image.json)

- 参照画像は最大 10 枚まで入力可
- プロンプトで「`<image1>` の女性が `<image2>` の場所に座っている」のように、どの画像を使うのか指定します。

{% mediaRow img="/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_ref2image_text_encode.png", width=40, align="left" %}
**Text Encode Qwen Image 2.1**

ここに参照画像とプロンプトを入力します。

- `resolution`
  - 参照画像は、アスペクト比を保ったまま約 1 MP にリサイズされてからモデルに渡ります
- `latent` 出力
  - この latent は 1 枚目のサイズに合わせた空 latent ですが、内部で丸められたサイズになります。入力した画像とぴったり同じサイズで出したいので、私の workflow では使いません

{% endmediaRow %}


**出力例**

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_ref2image_output.png){media=image}

---

## 画像編集

workflow は Ref2Image とほとんど同じです。違うのは、生成する画像のサイズを 1 枚目に合わせているところだけ。

編集なので、元の絵が同じサイズで返ってこないと困ります。そこで `Get Image Size` で 1 枚目のサイズを読み取り、`Empty Latent Image` に渡しています。

2 枚目以降は Ref2Image と同じで、参照画像として使えますよ。

### 基本的な画像編集

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit.png){media=image}

[](/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit.json)

これまでの画像編集と同様に、「男性を消して」「服を赤くして」「水彩画に変えて」のように指示してください。

{% mediaRow img="/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_text_encode.png", width=40, align="left" %}
**Text Encode Qwen Image 2.1**

- `resolution`
  - Ref2Image のときと違い、ここは `0` にします。拡大縮小されず、32 の倍数に丸められるだけです（事前にリサイズしてあるので、実際は何も起きませんが）
  - モデルが見る画像のサイズと出力するサイズは、一応合わせておきましょう。

{% endmediaRow %}


![input](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_input.png){media=image} ![output](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_output.png){media=image}

### 赤丸で位置指定して編集

編集したい場所を色ペンで囲って指示します。

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_local.png){media=image}

[](/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_local.json)

編集したい画像に直接、編集させたいオブジェクトを囲みます。
- `Load Image` ノードに付いている `Mask Editor` でも可能です。

「赤丸で囲った腕時計を消して」のように指示するだけです。

複数の色を使って別々の指示を出せたりするので言葉で上手く指示しにくいときには便利ですね。

![input](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_local_input.png){media=image} ![output](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_local_output.png){media=image}

### マスクで位置指定して編集

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_local_mask.png){media=image}

[](/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_local_mask.json)

赤丸と考え方は同じですが、こちらは位置を示す白黒画像を、**元画像とは別に** 入力します。

元画像へ直接書き込まないので、画像を汚さずに済むのがいいところですね。

{% mediaRow img="/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_local_mask_convert.png", width=50, align="left" %}
**マスクを画像に変換**

`Load Image` の MASK 出力を `Convert Mask to Image` で白黒画像に変換し、`image_2` へ入力します。

実のところ、モデルが受け取るのはただの白黒画像です。マスクから変換せず、黒い背景に白でﾇﾘﾇﾘした画像を直接用意しても構いませんよ。

{% endmediaRow %}

> いわゆる [inpainting](/ja/basic-workflows/sd15-inpainting/) とはまったく異なる仕組みです。\
> inpainting にはマスクの外を編集させない仕組みがありますが、こちらはあくまで位置を示すガイドです。\
> そのため、指定した範囲から編集がはみ出すこともあります。

![input](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_local_mask_convert_input.png){media=image} ![mask](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_local_mask_convert_mask.png){media=image} ![output](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_local_mask_convert_output.png){media=image}

### Outpainting

こちらも、Padding を足してそこを inpainting させる……という一般的な [Outpainting](/ja/basic-workflows/sd15-outpainting/) とは、まったく仕組みが違います。

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_outpainting.png){media=image}

[](/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_outpainting.json)

参照画像として横長の画像を入れる。でも、生成させる画像サイズを縦長にしたらどうでしょう？

そう、上下の空間を埋めた画像を Qwen-Image-2.1 が生成してくれるんですね。

こちらも余白のみならず画像全体を描き直しているので、元の部分も多少変わります。

きっちり元画像を固定する方法ではありませんが、簡単でいいですね。

![input](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_outpainting_input.png){media=image} ![output](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_outpainting_output.png){media=image}

---

## 透過画像

Qwen-Image-2.1 は、プロンプトを少し変えるだけで透過画像も生成できます。

特殊なノードを挟む必要もなく、最初から Alpha Channel を持った RGBA 画像が出てきます。

### 透過画像を生成

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_text2image_rgba.png){media=image}

[](/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_text2image_rgba.json)

以下の形でプロンプトを書きます。

```text
This is an RGBA image with transparency. <ここに生成したいもののプロンプト>. The image has alpha channel and the background is transparent.
```

前後は決まり文句なので、そのままコピーして真ん中だけ差し替えれば大丈夫です。

透過情報を残すため、出力は PNG で保存してください。JPEG にすると、せっかくの Alpha Channel が消えてしまいます。

**出力例**

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_text2image_rgba_output.png){media=image}

### 切り抜き

透過生成を画像編集に組み合わせると……そうです、切り抜きもできちゃうんですね。

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_subject_extraction.png){media=image}

[](/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_subject_extraction.json)

先ほどのフォーマットで、切り抜きたいものを `Extract 〇〇` と指示するだけです。

![input](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_subject_extraction_input.png){media=image} ![output](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_subject_extraction_output.png){media=image}

---

## 応用

### パノラマ生成

好きな画像を参照に、2:1 の解像度で ERP として生成して、といえば、それだけで 360 度パノラマ画像ができてしまいます。お手軽すぎる…

**カスタムノード**

- [nomadoor/ComfyUI-Panorama-Stickers](https://github.com/nomadoor/ComfyUI-Panorama-Stickers)
  - 私が作っているものでちょっと宣伝になりますが、パノラマのプレビューや、パノラマ空間での撮影ができるノードがあります。よかったら導入してみてください。

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_panorama.mp4){media=loop}

[](/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_panorama.json)

元画像を参照しながら、横長 (2:1) の画像を生成します。

左右をキッチリ Outpainting するというよりは、パノラマ空間に自然に収まるように ERP 全体を描き直してもらうイメージです。
