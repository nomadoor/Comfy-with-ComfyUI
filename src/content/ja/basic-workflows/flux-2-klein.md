---

layout: page.njk
lang: ja
section: basic-workflows
slug: flux-2-klein
navId: flux-2-klein
title: "FLUX.2 [klein]"
created: 2026-01-22
updated: 2026-10-20
summary: "FLUX.2 [klein] 生成・画像編集workflow"
seoTitle: "ComfyUIでFLUX.2 [klein]を使う：画像生成と画像編集"
seoDescription: "画像生成と指示ベース画像編集を1つでこなす小型・高速なFLUX.2 [klein]の使い方。推奨設定、9B / 4BとBase / Distilledの違い、text2image、画像編集、マルチリファレンスのworkflowを解説します。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/flux-2-klein/legacy_gyazo_46ebf7545e89db8df26b83a992e4c728.png"
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

## モデルのダウンロード

> [!WARNING]
> 9B のモデルは、認証しないとダウンロードできません。Hugging Face のアカウントでログインし、[FLUX.2-klein-9b-fp8](https://huggingface.co/black-forest-labs/FLUX.2-klein-9b-fp8) と [FLUX.2-klein-base-9b-fp8](https://huggingface.co/black-forest-labs/FLUX.2-klein-base-9b-fp8) のページで利用条件に同意してください。

- diffusion_models
  - [flux-2-klein-9b-fp8.safetensors（distilled）](https://huggingface.co/black-forest-labs/FLUX.2-klein-9b-fp8/blob/main/flux-2-klein-9b-fp8.safetensors) (9.43 GB)
  - [flux-2-klein-base-9b-fp8.safetensors](https://huggingface.co/black-forest-labs/FLUX.2-klein-base-9b-fp8/blob/main/flux-2-klein-base-9b-fp8.safetensors) (9.57 GB)
  - [flux-2-klein-4b.safetensors（distilled）](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-4b/blob/main/split_files/diffusion_models/flux-2-klein-4b.safetensors) (7.75 GB)
  - [flux-2-klein-base-4b.safetensors](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-4b/blob/main/split_files/diffusion_models/flux-2-klein-base-4b.safetensors) (7.75 GB)
- text_encoders
  - [qwen_3_8b.safetensors](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-9b/blob/main/split_files/text_encoders/qwen_3_8b.safetensors) (16.38 GB)
    - 9B 用
  - [qwen_3_4b.safetensors](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-4b/blob/main/split_files/text_encoders/qwen_3_4b.safetensors) (8.04 GB)
    - 4B 用
- vae
  - [flux2-vae.safetensors](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-9b/blob/main/split_files/vae/flux2-vae.safetensors) (336 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   ├── flux-2-klein-9b-fp8.safetensors
    │   ├── flux-2-klein-base-9b-fp8.safetensors
    │   ├── flux-2-klein-4b.safetensors
    │   └── flux-2-klein-base-4b.safetensors
    ├── 📂text_encoders/
    │   ├── qwen_3_8b.safetensors
    │   └── qwen_3_4b.safetensors
    └── 📂vae/
        └── flux2-vae.safetensors
```

---

## text2image

![](/media/basic-workflows/flux-2-klein/flux_2_klein_base_9b_text2image.png){media=image}

{% workflowPicker
  "!/workflows/basic-workflows/flux-2-klein/9b/flux_2_klein_base_9b_text2image.json",
  "/workflows/basic-workflows/flux-2-klein/4b/flux_2_klein_base_4b_text2image.json"
%}

> [!NOTE]
> 公式workflowでは、`Flux2Scheduler` というものを使いますが、大きな違いは無いので、workflowを簡略化するため`Simple`を使っています。

### Distilled

![](/media/basic-workflows/flux-2-klein/flux_2_klein_9b_text2image.png){media=image}

{% workflowPicker
  "!/workflows/basic-workflows/flux-2-klein/9b/flux_2_klein_9b_text2image.json",
  "/workflows/basic-workflows/flux-2-klein/4b/flux_2_klein_4b_text2image.json"
%}

以下のパラメータだけ変更します。
- `CFG` : 1.0
- `steps` : 4

{% outputs %}
![Base](/media/basic-workflows/flux-2-klein/flux_2_klein_base_9b_text2image_output.png){media=image} ![Distilled](/media/basic-workflows/flux-2-klein/flux_2_klein_9b_text2image_output.png){media=image}
{% endoutputs %}

> [!NOTE]
> 4B は、モデルとテキストエンコーダを 4B のものに置き換えるだけです。workflow は切り替えて選べます。

---

## 画像編集

![](/media/basic-workflows/flux-2-klein/flux_2_klein_base_9b_image_edit.png){media=image}

{% workflowPicker
  "!/workflows/basic-workflows/flux-2-klein/9b/flux_2_klein_base_9b_image_edit.json",
  "/workflows/basic-workflows/flux-2-klein/9b/flux_2_klein_9b_image_edit.json",
  "/workflows/basic-workflows/flux-2-klein/4b/flux_2_klein_base_4b_image_edit.json",
  "/workflows/basic-workflows/flux-2-klein/4b/flux_2_klein_4b_image_edit.json"
%}

「入力画像 + 指示プロンプト」 が基本です。
- 入力画像を `Set Reference Multi Latent` につなぐと、VAE Encode して参照として渡してくれます。
- `empty_latent` 出力は 1 枚目と同じサイズの空 latent なので、そのまま `KSampler` に渡します。

{% outputs %}
![input](/media/basic-workflows/flux-2-klein/flux_2_klein_base_9b_image_edit_input.png){media=image} ![output](/media/basic-workflows/flux-2-klein/flux_2_klein_base_9b_image_edit_output.png){media=image}
{% endoutputs %}

---

## 画像編集（マルチリファレンス）

複数枚の画像を入力して参照させることもできます。

![](/media/basic-workflows/flux-2-klein/flux_2_klein_base_9b_image_edit_multi.png){media=image}

{% workflowPicker
  "!/workflows/basic-workflows/flux-2-klein/9b/flux_2_klein_base_9b_image_edit_multi.json",
  "/workflows/basic-workflows/flux-2-klein/9b/flux_2_klein_9b_image_edit_multi.json",
  "/workflows/basic-workflows/flux-2-klein/4b/flux_2_klein_base_4b_image_edit_multi.json",
  "/workflows/basic-workflows/flux-2-klein/4b/flux_2_klein_4b_image_edit_multi.json"
%}

- `Set Reference Multi Latent` に参照画像をつないでいくだけです。
- 2枚でも3枚でもOKです。（ただし上限は4）

{% outputs %}
![input](/media/basic-workflows/flux-2-klein/flux_2_klein_9b_text2image_output.png){media=image} ![input](/media/basic-workflows/flux-2-klein/flux_2_klein_base_9b_image_edit_multi_input2.png){media=image} ![output](/media/basic-workflows/flux-2-klein/flux_2_klein_base_9b_image_edit_multi_output.png){media=image}
{% endoutputs %}

---

## できること

ここにあるのはあくまで一例です。

絵柄を変えたり、オブジェクトを消すのは画像編集のほんの一部に過ぎません。何を「画像編集」とみなすか？で出来ることは無限に広がっています。色々な使い方を開発してみてください。

### 単一画像

{% mediaRow img="/media/basic-workflows/flux-2-klein/legacy_gyazo_9739688bffdd08a9c5b3db5fa1dd8119.png {media=image}", width=45, align="left" %}

**スタイル変換**

```text
Reskin this into a watercolor illustration on textured paper.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/flux_2_klein_9b_style_transfer.json)
{% endmediaFooter %}

{% endmediaRow %}



{% mediaRow img="/media/basic-workflows/flux-2-klein/legacy_gyazo_1fc2e71374a7d109c7f4d008973b4693.png {media=image}", width=45, align="left" %}

**環境・状態変更**

```text
Change the time to bright midday.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/flux_2_klein_9b_environmental_change.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/flux-2-klein/legacy_gyazo_13aca28a7b3b85966d2831ccd99ba2f4.png {media=image}", width=45, align="left" %}

**オブジェクト入れ替え / 追加**

```text
Replace the ice bear with an ice duck. Add a hat on the duck with light blue, red, and white colors. Add sneakers on the duck.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/flux_2_klein_9b_object_swap.json)
{% endmediaFooter %}

{% endmediaRow %}


{% mediaRow img="/media/basic-workflows/flux-2-klein/legacy_gyazo_f7552667da5fcfa8ce3a4e4b49cf5cdd.png {media=image}", width=45, align="left" %}

**テキスト編集**

```text
Edit the text "WELCOME" to "Flux.2".
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/flux_2_klein_9b_text_edit.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/flux-2-klein/legacy_gyazo_d1e84e57e066c8e30868ac97fbc5512b.png {media=image}", width=45, align="left" %}

**画像修復**

```text
Restore and colorize this black-and-white photo.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/flux_2_klein_9b_restore.json)
{% endmediaFooter %}
{% endmediaRow %}


{% mediaRow img="/media/basic-workflows/flux-2-klein/legacy_gyazo_ef668f3e2ef9f7598ec410bcbbd30960.png {media=image}", width=45, align="left" %}


**ControlNetライク（Pose）**

ControlNetの仕組みで動いているわけではありません。  
棒人間や深度マップを与え、これを元にリアルな画像を生成してもらうことで、画像編集として **ControlNet的** なタスクを行うことが出来ます。

```text
A office lady sitting on outdoor stairs at dusk, matching the pose from the reference image. Evening ambient light, calm urban atmosphere. She wears a long skirt and a black camisole with frills. Natural, realistic photo
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/flux_2_klein_9b_pose.json)
{% endmediaFooter %}
{% endmediaRow %}


{% mediaRow img="/media/basic-workflows/flux-2-klein/legacy_gyazo_090e1bccb68070e4a22c7315d1bdc2ce.png {media=image}", width=45, align="left" %}

**inpainting / outpainting**

マスクを与えてそこを埋めているわけではなく、「灰色のエリアを自然に埋めてください」と指示をするだけです。

```text
Outpaint the gray areas to extend the scene naturally
```
{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/flux_2_klein_9b_outpainting.json)
{% endmediaFooter %}
{% endmediaRow %}


{% mediaRow img="/media/basic-workflows/flux-2-klein/legacy_gyazo_4a562fb90e23c8695ebe7c13b0db223e.png {media=image}", width=45, align="left" %}

**雑コラのリファイン**

```text
Turn this into a single realistic underwater ruins scene with two robots: a sleek white mecha and a large rusty moss-covered robot.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/flux_2_klein_9b_collage_refinement.json)
{% endmediaFooter %}

{% endmediaRow %}

### マルチリファレンス画像編集

{% mediaRow img="/media/basic-workflows/flux-2-klein/legacy_gyazo_fabad47684ddbc15657d34973511a405.png {media=image}", width=45, align="left" %}

**スタイル転送**

```text
Change image 1 to match the style of image 2.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/flux_2_klein_9b_style_transfer_multi.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/flux-2-klein/legacy_gyazo_d673551f6b212c41c35c0cfd2e729e8f.png {media=image}", width=45, align="left" %}

**オブジェクト・人物入れ替え**

```text
Replace the person in image 1 with the person from image 2.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/flux_2_klein_9b_object_swap_multi.json)
{% endmediaFooter %}
{% endmediaRow %}


{% mediaRow img="/media/basic-workflows/flux-2-klein/legacy_gyazo_6360d713f4bee61dd3c844d4336eebcd.png {media=image}", width=45, align="left" %}

**オブジェクト追加**

```text
Place the airship from image 2 in the sky of image 1,Make the airship prominent (closer to camera)
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/flux_2_klein_9b_object_add_multi.json)
{% endmediaFooter %}

{% endmediaRow %}


## 参考

- [Prompting Guide - FLUX.2 [klein]](https://docs.bfl.ai/guides/prompting_guide_flux2_klein)
- [FLUX.2 [klein] 公式Doc](https://docs.bfl.ai/flux_2/flux2_overview#flux-2-[klein]-models)
- [Comfy.Org blog](https://blog.comfy.org/p/flux2-klein-4b-fast-local-image-editing)