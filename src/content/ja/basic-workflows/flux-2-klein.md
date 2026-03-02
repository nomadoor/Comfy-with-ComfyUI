---

layout: page.njk
lang: ja
section: basic-workflows
slug: flux-2-klein
navId: flux-2-klein
title: "FLUX.2 [klein]"
summary: "FLUX.2 [klein] 生成・画像編集workflow"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/46ebf7545e89db8df26b83a992e4c728.png"
tags: [instruction-based-image-editing]
---

## FLUX.2 [klein]とは？

**FLUX.2 [klein]** は、**画像生成** と **指示ベース画像編集** を1つのモデルで扱える、小型・高速のFlux.2系モデルです。

ラインナップ

* **9B** / **9B Base**（FLUX Non-Commercial License。非商用）
* **4B** / **4B Base**（Apache 2.0）

分かりにくいですが、無印のほうが 蒸留（Distilled）モデルです。
Base（20 steps）に対し、Distilled は 4 steps で生成出来ます。

大きな性能差は無いので、生成には基本的にDistilledモデルを使っていきます。

---

## 推奨設定値

- 解像度
  - 最小 64×64
  - 最大 4MP (2048×2048)
  - 縦横ともに 16 の倍数
- 参照画像枚数
  - 最大 4

---

## Flux.2 [klein] 9B

### モデルのダウンロード（9B）

* diffusion_models

  * [flux-2-klein-9b-fp8.safetensors（distilled）](https://huggingface.co/black-forest-labs/FLUX.2-klein-9b-fp8/blob/main/flux-2-klein-9b-fp8.safetensors)
  * [flux-2-klein-base-9b-fp8.safetensors](https://huggingface.co/black-forest-labs/FLUX.2-klein-base-9b-fp8/blob/main/flux-2-klein-base-9b-fp8.safetensors)
* text_encoders

  * [qwen_3_8b.safetensors](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-9b/blob/main/split_files/text_encoders/qwen_3_8b.safetensors)
* vae

  * [flux2-vae.safetensors](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-9b/blob/main/split_files/vae/flux2-vae.safetensors)


```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   ├── flux-2-klein-9b-fp8.safetensors
    │   └── flux-2-klein-base-9b-fp8.safetensors
    ├── 📂text_encoders/
    │   └── qwen_3_8b.safetensors
    └── 📂vae/
        └── flux2-vae.safetensors
```

### text2image Base

![](https://gyazo.com/0936f046def982bdf00c697bb1740bfa){gyazo=image}

[](/workflows/basic-workflows/flux-2-klein/9b/Flux.2-klein-base-9b_text2image.json)

> 公式workflowでは、`Flux2Scheduler` というものを使いますが、大きな違いは無いので、workflowを簡略化するため`Simple`を使っています。

### text2image Distilled

![](https://gyazo.com/ba71c46ad1a5880a40a4897992777050){gyazo=image}

[](/workflows/basic-workflows/flux-2-klein/9b/Flux.2-klein-9b_text2image.json)

以下のパラメータだけ変更します。
- `CFG` : 1.0
- `steps` : 4

### 画像編集 Base

![](https://gyazo.com/74b3fe065e88c1a48210c04b0e9c0766){gyazo=image}

[](/workflows/basic-workflows/flux-2-klein/9b/Flux.2-klein-base-9b_image-edit.json)

「入力画像 + 指示プロンプト」 が基本です。
- 入力画像を VAE Encode して `ReferenceLatent` に渡します。


### 画像編集 Distilled

![](https://gyazo.com/e55ff686078115488cef6406f60b9370){gyazo=image}

[](/workflows/basic-workflows/flux-2-klein/9b/Flux.2-klein-9b_image-edit.json)

### 画像編集（マルチリファレンス）Base

複数枚の画像を入力して参照させることもできます。

![](https://gyazo.com/d5d524090b273847fbc4a45cf52284b4){gyazo=image}

[](/workflows/basic-workflows/flux-2-klein/9b/Flux.2-klein-base-9b_image-edit-multi.json)

- `参照画像 → VAE Encode → ReferenceLatent` この塊を直列に繋いでいくだけです。
- 2枚でも3枚でもOKです。（ただし上限は4）

### 画像編集（マルチリファレンス）Distilled

![](https://gyazo.com/8d4bcf62e22ccaf6e91c3b2de20a417b){gyazo=image}

[](/workflows/basic-workflows/flux-2-klein/9b/Flux.2-klein-9b_image-edit-multi.json)

---

## Flux.2 [klein] 4B

### モデルのダウンロード（4B）

* diffusion_models

  * [flux-2-klein-4b.safetensors（distilled）](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-4b/blob/main/split_files/diffusion_models/flux-2-klein-4b.safetensors)
  * [flux-2-klein-base-4b.safetensors](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-4b/blob/main/split_files/diffusion_models/flux-2-klein-base-4b.safetensors)
* text_encoders

  * [qwen_3_4b.safetensors](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-4b/blob/main/split_files/text_encoders/qwen_3_4b.safetensors)
* vae

  * [flux2-vae.safetensors](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-9b/blob/main/split_files/vae/flux2-vae.safetensors)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   ├── flux-2-klein-4b.safetensors
    │   └── flux-2-klein-base-4b.safetensors
    ├── 📂text_encoders/
    │   └── qwen_3_4b.safetensors
    └── 📂vae/
        └── flux2-vae.safetensors
```

### workflow

基本は9Bと全く同じです。  
モデルとテキストエンコーダを4Bのものに置き換えるだけです。

**text2image**
- [](/workflows/basic-workflows/flux-2-klein/4b/Flux.2-klein-base-4b_text2image.json)
- [](/workflows/basic-workflows/flux-2-klein/4b/Flux.2-klein-4b_text2image.json)

**画像編集**
- [](/workflows/basic-workflows/flux-2-klein/4b/Flux.2-klein-base-4b_image-edit.json)
- [](/workflows/basic-workflows/flux-2-klein/4b/Flux.2-klein-4b_image-edit.json)

**画像編集（マルチリファレンス)**
- [](/workflows/basic-workflows/flux-2-klein/4b/Flux.2-klein-base-4b_image-edit-multi.json)
- [](/workflows/basic-workflows/flux-2-klein/4b/Flux.2-klein-4b_image-edit-multi.json)

---

## できること

ここにあるのはあくまで一例です。

絵柄を変えたり、オブジェクトを消すのは画像編集のほんの一部に過ぎません。何を「画像編集」とみなすか？で出来ることは無限に広がっています。色々な使い方を開発してみてください。

### 単一画像

{% mediaRow img="https://gyazo.com/9739688bffdd08a9c5b3db5fa1dd8119 {gyazo=image}", width=45, align="left" %}

**スタイル変換**

```text
Reskin this into a watercolor illustration on textured paper.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_Style-transfer.json)
{% endmediaFooter %}

{% endmediaRow %}



{% mediaRow img="https://gyazo.com/1fc2e71374a7d109c7f4d008973b4693 {gyazo=image}", width=45, align="left" %}

**環境・状態変更**

```text
Change the time to bright midday.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_Environmental-change.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/13aca28a7b3b85966d2831ccd99ba2f4 {gyazo=image}", width=45, align="left" %}

**オブジェクト入れ替え / 追加**

```text
Replace the ice bear with an ice duck. Add a hat on the duck with light blue, red, and white colors. Add sneakers on the duck.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_Object-swap.json)
{% endmediaFooter %}

{% endmediaRow %}


{% mediaRow img="https://gyazo.com/f7552667da5fcfa8ce3a4e4b49cf5cdd {gyazo=image}", width=45, align="left" %}

**テキスト編集**

```text
Edit the text "WELCOME" to "Flux.2".
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_Text-edit.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/d1e84e57e066c8e30868ac97fbc5512b {gyazo=image}", width=45, align="left" %}

**画像修復**

```text
Restore and colorize this black-and-white photo.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_Restore.json)
{% endmediaFooter %}
{% endmediaRow %}


{% mediaRow img="https://gyazo.com/ef668f3e2ef9f7598ec410bcbbd30960 {gyazo=image}", width=45, align="left" %}


**ControlNetライク（Pose）**

ControlNetの仕組みで動いているわけではありません。  
棒人間や深度マップを与え、これを元にリアルな画像を生成してもらうことで、画像編集として **ControlNet的** なタスクを行うことが出来ます。

```text
A office lady sitting on outdoor stairs at dusk, matching the pose from the reference image. Evening ambient light, calm urban atmosphere. She wears a long skirt and a black camisole with frills. Natural, realistic photo
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_Pose.json)
{% endmediaFooter %}
{% endmediaRow %}


{% mediaRow img="https://gyazo.com/090e1bccb68070e4a22c7315d1bdc2ce {gyazo=image}", width=45, align="left" %}

**inpainting / outpainting**

マスクを与えてそこを埋めているわけではなく、「灰色のエリアを自然に埋めてください」と指示をするだけです。

```text
Outpaint the gray areas to extend the scene naturally
```
{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_outpainting.json)
{% endmediaFooter %}
{% endmediaRow %}


{% mediaRow img="https://gyazo.com/4a562fb90e23c8695ebe7c13b0db223e {gyazo=image}", width=45, align="left" %}

**雑コラのリファイン**

```text
Turn this into a single realistic underwater ruins scene with two robots: a sleek white mecha and a large rusty moss-covered robot.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_Collage-refinement.json)
{% endmediaFooter %}

{% endmediaRow %}

### マルチリファレンス画像編集

{% mediaRow img="https://gyazo.com/fabad47684ddbc15657d34973511a405 {gyazo=image}", width=45, align="left" %}

**スタイル転送**

```text
Change image 1 to match the style of image 2.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_Style-transfer-multi.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/d673551f6b212c41c35c0cfd2e729e8f {gyazo=image}", width=45, align="left" %}

**オブジェクト・人物入れ替え**

```text
Replace the person in image 1 with the person from image 2.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_Object-swap-multi.json)
{% endmediaFooter %}
{% endmediaRow %}


{% mediaRow img="https://gyazo.com/6360d713f4bee61dd3c844d4336eebcd {gyazo=image}", width=45, align="left" %}

**オブジェクト追加**

```text
Place the airship from image 2 in the sky of image 1,Make the airship prominent (closer to camera)
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_Object-add-multi.json)
{% endmediaFooter %}

{% endmediaRow %}


## 参考

- [Prompting Guide - FLUX.2 [klein]](https://docs.bfl.ai/guides/prompting_guide_flux2_klein)
- [FLUX.2 [klein] 公式Doc](https://docs.bfl.ai/flux_2/flux2_overview#flux-2-[klein]-models)
- [Comfy.Org blog](https://blog.comfy.org/p/flux2-klein-4b-fast-local-image-editing)