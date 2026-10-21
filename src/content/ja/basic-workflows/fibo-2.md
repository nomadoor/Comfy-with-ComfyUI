---
layout: page.njk
lang: ja
section: basic-workflows
slug: fibo-2
navId: fibo-2
title: "Fibo 2.0"
created: 2026-10-21
updated: 2026-10-21
summary: "Fibo 2.0での画像生成と画像編集"
seoTitle: "ComfyUIでFibo 2.0を使う：構造化プロンプトで画像生成と編集"
seoDescription: "Bria AIの8Bモデル、Fibo 2.0のComfyUIでの使い方。text2image、画像編集、multi-reference（編集は4ステップのEdit Turbo版も）、MLLMで構造化プロンプト（VGL）を作るworkflowを紹介します。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/fibo-2/fibo_2_hero.png"
tags: []
---

## Fibo 2.0とは？

[Fibo 2.0](https://huggingface.co/briaai/Fibo-2.0-dev) は、Bria AI の 8B の画像生成・編集モデルです。

前世代の [FIBO](https://github.com/Bria-AI/FIBO) は、[Ideogram 4.0](/ja/basic-workflows/ideogram-4/) よりも早くから、JSON 形式の構造化プロンプトに焦点を当てていたモデルでした。

Fibo 2.0 はその後継で、この特徴を保ったまま画像編集もできるようになりました。

この構造化プロンプトは VGL（Visual GenAI Language）と呼ばれていますが、Fibo 2.0 では幸い、普通の文章でもある程度の性能を出せます。  
簡単な指示を MLLM に渡して、VGL に書き換えてもらうのもいいですね。

モデルは、生成と編集の両方ができる **Dev** と、編集専用で 4 ステップの **Edit Turbo** の 2 つがあります。

> [!NOTE]
> このページでは、すべてのタスクで Dev の workflow を載せています。画像編集では、Edit Turbo の workflow も並べて置いています。

{% runpod %}

---

## 推奨設定値

- 解像度
  - 約 1MP
  - 縦横ともに 16 の倍数
- 参照画像枚数
  - 最大 4

---

## モデルのダウンロード

- diffusion_models
  - [fibo2_dev_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/Fibo-2.0/blob/main/diffusion_models/fibo2_dev_int8_convrot.safetensors) (8.41 GB)
  - [fibo2_edit_turbo_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/Fibo-2.0/blob/main/diffusion_models/fibo2_edit_turbo_int8_convrot.safetensors) (8.41 GB)
- text_encoders
  - [qwen3vl_4b_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/Fibo-2.0/blob/main/text_encoders/qwen3vl_4b_int8_convrot.safetensors) (4.86 GB)
  - [qwen3.5_9b_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/MOSS-Image/blob/main/text_encoders/qwen3.5_9b_int8_convrot.safetensors) (9.75 GB)
    - 🚨 VGL を作るときに使用（オプション）
- vae
  - [flux2-vae.safetensors](https://huggingface.co/Comfy-Org/Fibo-2.0/blob/main/vae/flux2-vae.safetensors) (336 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   ├── fibo2_dev_int8_convrot.safetensors
    │   └── fibo2_edit_turbo_int8_convrot.safetensors
    ├── 📂text_encoders/
    │   ├── qwen3vl_4b_int8_convrot.safetensors
    │   └── qwen3.5_9b_int8_convrot.safetensors
    └── 📂vae/
        └── flux2-vae.safetensors
```

---

## 基本のworkflow

### 画像生成

![](/media/basic-workflows/fibo-2/fibo_2_dev_text2image.png){media=image}

[](/workflows/basic-workflows/fibo-2/fibo_2_dev_text2image.json)

- `steps`: 30
- `cfg`: 5.0

{% outputs %}
![output](/media/basic-workflows/fibo-2/fibo_2_dev_text2image_output.png){media=image}
{% endoutputs %}

### 画像編集

![](/media/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit.png){media=image}

[](/workflows/basic-workflows/fibo-2/fibo_2_dev_image_edit.json)

[](/workflows/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit.json)

- `TextEncodeFibo2`
  - `width` / `height` を 0 にしておくと、入力画像のサイズがそのまま使われます。

Edit Turbo は、以下のパラメータだけ変更します。
- `steps`: 4
- `cfg`: 1.0

{% outputs %}
![input](/media/basic-workflows/fibo-2/fibo_2_image_edit_input.png){media=image} ![Dev](/media/basic-workflows/fibo-2/fibo_2_dev_image_edit_output.png){media=image} ![Edit Turbo](/media/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit_output.png){media=image}
{% endoutputs %}

### 画像編集 multi-reference

![](/media/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit_multi.png){media=image}

[](/workflows/basic-workflows/fibo-2/fibo_2_dev_image_edit_multi.json)

[](/workflows/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit_multi.json)

プロンプトでは、`TextEncodeFibo2` につないだ順に `<image_1>`、`<image_2>` と書いて、どの画像のことかを指定してください。

```text
Replace the pink-haired girl on the right of <image_1> with the mechanic woman from <image_2>.
```

{% outputs %}
![input](/media/basic-workflows/fibo-2/fibo_2_image_edit_multi_input1.png){media=image} ![input](/media/basic-workflows/fibo-2/fibo_2_image_edit_multi_input2.png){media=image} ![Dev](/media/basic-workflows/fibo-2/fibo_2_dev_image_edit_multi_output.png){media=image} ![Edit Turbo](/media/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit_multi_output.png){media=image}
{% endoutputs %}

---

## VGLあり（MLLMで構造化プロンプトを作る）

構造化プロンプトを使ってこそ、FIBO の真骨頂が発揮されます。  
とはいえ JSON を一から手で書くのは大変なので、MLLM に自然文を VGL の JSON に書き換えてもらいましょう。

システムプロンプトは、Bria の [bria-vgl](https://github.com/Bria-AI/vgl/tree/dev/src/bria_vgl/dialects/thales/prompts) に入っている Gemini 用のものを、Qwen3.5 向けに少し調整して使っています。  
画像生成・画像編集・multi-reference でそれぞれ中身が違うので、使い回さないよう注意してください。

> [!NOTE]
> MLLM には Qwen3.5 9B を使っています。テキストエンコーダとして読み込んでいる Qwen3-VL 4B を使い回すこともできますが、この用途には性能が足りないため、おすすめしません。

### 画像生成

![](/media/basic-workflows/fibo-2/fibo_2_dev_text2image_vgl.png){media=image}

[](/workflows/basic-workflows/fibo-2/fibo_2_dev_text2image_vgl.json)

構造化プロンプトは、パラメータのように一部だけを変えられるのが特徴です。  
できあがった JSON プロンプトを使って、たとえばカメラアングルだけを別のものに変えて生成してみましょう。

{% outputs %}
![元の JSON](/media/basic-workflows/fibo-2/fibo_2_dev_text2image_vgl_output.png){media=image} ![camera_angle だけ Low angle に変更](/media/basic-workflows/fibo-2/fibo_2_dev_text2image_vgl_output2.png){media=image}
{% endoutputs %}

### 画像編集

![](/media/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit_vgl.png){media=image}

[](/workflows/basic-workflows/fibo-2/fibo_2_dev_image_edit_vgl.json)

[](/workflows/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit_vgl.json)

{% outputs %}
![input](/media/basic-workflows/fibo-2/fibo_2_image_edit_vgl_input.png){media=image} ![Dev](/media/basic-workflows/fibo-2/fibo_2_dev_image_edit_vgl_output.png){media=image} ![Edit Turbo](/media/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit_vgl_output.png){media=image}
{% endoutputs %}

### 画像編集 multi-reference

![](/media/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit_multi_vgl.png){media=image}

[](/workflows/basic-workflows/fibo-2/fibo_2_dev_image_edit_multi_vgl.json)

[](/workflows/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit_multi_vgl.json)

`Generate Text` に複数の画像を入力するときは、`Batch Images` でバッチにしてから入力します。

ただし、`Batch Images` は 2 枚目以降を 1 枚目と同じ解像度にクロップします。  
1 枚目が縦長で 2 枚目が横長のように向きが違うときは、画像が切れないよう、pad で余白を足しておいてください。

{% outputs %}
![input](/media/basic-workflows/fibo-2/fibo_2_image_edit_multi_vgl_input1.png){media=image} ![input](/media/basic-workflows/fibo-2/fibo_2_image_edit_multi_vgl_input2.png){media=image} ![Dev](/media/basic-workflows/fibo-2/fibo_2_dev_image_edit_multi_vgl_output.png){media=image} ![Edit Turbo](/media/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit_multi_vgl_output.png){media=image}
{% endoutputs %}
