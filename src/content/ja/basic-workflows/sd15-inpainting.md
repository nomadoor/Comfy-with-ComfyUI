---
layout: page.njk
lang: ja
section: basic-workflows
slug: sd15-inpainting
navId: sd15-inpainting
title: "inpainting"
created: 2025-12-07
updated: 2026-08-26
summary: "inpaintingで画像の一部分だけ編集する"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
tags: ["controlnet", "region-limited-generation"]
hero:
  image: ""
---

## inpaintingとは？

inpainting は **「画像の一部分だけを描き直す」** ための手法です。

不要なものを消す、一部分だけ描き直す、別のものに置き換える…… 細かく分類すれば様々な用途がありますが、これを実現する方法はいくつもあります。

- [image2image を一部分だけに適用する](#一部分だけの-image2image)
- [inpainting 専用モデルを使う](#inpaintingモデル)
- [ControlNet を使う](#controlnet-inpaint)
- [画像編集モデルを使う](#画像編集モデル)
- etc.

---

## 一部分だけの image2image

通常の image2image では画像全体を再生成しますが、生成する範囲をマスク部分だけに限定すれば、一部分だけを再生成できます。

### workflow

ベースはいつもの [image2image](/ja/basic-workflows/sd15-image2image/) です。そこにマスクを加えて、描き直す場所を決めます。

![](https://gyazo.com/4fc7e54c5ac44fb4c09fc9911f6be06a){gyazo=image}

[](/workflows/basic-workflows/sd15-inpainting/SD1.5_inpainting_SetLatentNoiseMask.json)

- 🟥 `VAE Encode` ノードで元画像を latent に変換
- 🟩 `Set Latent Noise Mask` ノードで latent とマスクを組み合わせる

`Set Latent Noise Mask` は、KSampler が描き直してよい範囲を決めるノードです。

内部では、毎 step 画像全体を image2image した後、マスク外は元の画像（latent）に戻します。

すると結果として、マスク部分だけに image2image をかけたように見えるんですね。

> マスクの作り方やマスク編集の詳細は、別ページの[マスク操作](/ja/data-utilities/mask-ops/)、[AIを使ったマスク生成](/ja/data-utilities/ai-mask-generation/)を参照してください。

### 【問題点】denoise を上げると周囲と合わなくなる

基本的な性質は通常の image2image と同じです。

`denoise` を高くするほど自由度は上がりますが、元画像を忘れていきます。

試しに上の workflow で `denoise` を `1.00` にしてみましょう。

![わお、ホラー画像…(；・∀・)](https://gyazo.com/b18eb39eee9f53b669edb098a219bd24){gyazo=image}

画像全体の image2image であれば、大きく変化しても、それはそれで楽しくてよいでしょう。

しかし、一部分だけの image2image ではマスクの外は元の画像のまま残ります。マスクの中と外で一貫性が無くなってしまうんですね。

花の形を少し変えるくらいなら、この方法でも良いでしょう。でも、大きな変化のときは難しい。

赤い花を青にしたり、花を楽器に置き換えたりするには `denoise` を上げる必要がある。しかし、そうすると周りから浮いてしまう……

さて、こんなときはどうしましょう🤔

---

## inpaintingモデル

答えの一つが、inpainting 専用モデルです。

先ほどの方法では、マスクは一部分だけに image2image をかけるために使われていました。**モデル自身には、どこがマスクされているのか伝わっていません。**

inpainting モデルでは、モデル自身にも「どこを描き直すのか」と「その外側に何が写っているのか」を伝えます。

マスク部分を灰色で隠した画像を作り、それをモデルへ渡します。描き直す前の中身は見せず、周囲だけを手掛かりにして埋めてもらうわけです。

### モデルのダウンロード

- [stable-diffusion-v1-5/sd-v1-5-inpainting.ckpt](https://huggingface.co/stable-diffusion-v1-5/stable-diffusion-inpainting/blob/main/sd-v1-5-inpainting.ckpt)
```
📂ComfyUI/
  └── 📂models/
      └── 📂checkpoints/
          └── sd-v1-5-inpainting.ckpt
```

### workflow

![](https://gyazo.com/1f6954026bfda799259cfd948da779a3){gyazo=image}

[](/workflows/basic-workflows/sd15-inpainting/sd-v1-5-inpainting.json)

- 🟪 inpainting モデルを読み込みます。
- 🟩 `VAE Encode`、`Set Latent Noise Mask` を `InpaintModelConditioning` ノードに置き換えます。

`InpaintModelConditioning` には、二つの役割があります。

1. `Set Latent Noise Mask` と同じように、一部分だけに image2image をかける
2. マスク部分を灰色で隠した元画像とマスクをモデルへ渡す

`noise_mask` は、1つ目の役割を使うかどうかを決める設定です。

- `true`
  - `Set Latent Noise Mask` と同じように、マスク部分だけに image2image をかけます。
  - 通常はこちらで問題ありません。
- `false`
  - モデルにはマスク部分を灰色で隠した元画像とマスクを渡しますが、マスク部分だけでなく全体を描き直させます。
  - 極稀に `true` だとおかしくなるモデルがいるので、そのときは使ってみてください。

上の workflow では `denoise` を `1.00` にしていますが、別の女性が出てくることはなく、周りに合わせて女性の髪を描き直していますね。

どこを編集し、なにを参考に描けばよいのか、モデルがちゃんと分かっている証拠です。

---

## ControlNet inpaint

モデルにマスクの範囲を知らせる方法は、inpainting モデルだけではありません。

その一つが、**ControlNet inpaint** です。

> [ControlNet](/ja/basic-workflows/sd15-controlnet) については、また別のページで説明します。

### カスタムノード

- [Fannovel16/comfyui_controlnet_aux](https://github.com/Fannovel16/comfyui_controlnet_aux)

### ControlNet モデルのダウンロード

- [comfyanonymous/control_v11p_sd15_inpaint_fp16.safetensors](https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/blob/main/control_v11p_sd15_inpaint_fp16.safetensors)
- ```
  📂ComfyUI/
    └── 📂models/
        └── 📂controlnet/
            └── control_v11p_sd15_inpaint_fp16.safetensors
  ```

### workflow

![](https://gyazo.com/ae3fe8d999343135c6ac995b67a165e7){gyazo=image}

[](/workflows/basic-workflows/sd15-inpainting/SD1.5_ControlNet_inpaint.json)

- 好きな SD1.5 checkpoint（＋LoRA）をロード
- 🟨 画像とマスクを `Inpaint Preprocessor` に入力し、ControlNet 用の画像に変換
  - 見た目は、マスク部分を黒く塗りつぶした画像です。
- 🟩 `Apply ControlNet` ノードに ControlNet モデル・画像・VAE を入力
- 🟥 `Set Latent Noise Mask` で、描き直す範囲をマスク部分に限定

使っている技術は違いますが、「埋めてほしい場所」と「その周りに写っているもの」をモデルへ渡す点は、inpainting モデルと同じです。

---

## そのほかのinpainting

ここでは紹介しませんが、Stable Diffusion 1.5 以降のモデルでは、ほかにも様々な方法があります。

- Fooocus Inpaint
- FLUX.1 Fill
- etc.

---

## 画像編集モデル

現在であれば、画像編集モデルについて触れないわけにはいきません。

画像編集モデルは、「男性の帽子を消して」のようにプロンプトで対象を指定したり、赤い線で囲んだ画像と「ここに猫を追加して」という指示を渡したりできます。専用のマスクすらいりません。

正確には inpainting の文脈で語られるものではありませんが、**画像の一部分を変化させられる** という意味で、できることは同じです。

### FLUX.2 [klein]

代表的な画像編集モデルとして、[FLUX.2 \[klein\]](/ja/basic-workflows/flux-2-klein/) を見てみましょう。

![](https://gyazo.com/e55ff686078115488cef6406f60b9370){gyazo=image}

[](/workflows/basic-workflows/flux-2-klein/9b/Flux.2-klein-9b_image-edit.json)

この workflow では、入力画像と `remove the man` というプロンプトだけで、画像から男性を消しています。
