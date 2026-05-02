---
layout: page.njk
lang: ja
section: basic-workflows
slug: sd15-inpainting
navId: sd15-inpainting
title: "inpainting"
created: 2025-12-07
updated: 2026-03-02
summary: "inpaintingで画像の一部分だけ編集する"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
tags: ["controlnet", "region-limited-generation"]
hero:
  image: ""
---

## inpaintingとは？

inpainting は **「画像の一部分だけを描き直す」** ための手法です。  
が、実は中身を見てみると、次の 2 パターンに分けられます。

- タイプA: **マスク部分だけを image2image する** 
- タイプB: **周囲の情報を見ながら、マスク部分を自然に埋める**

一般的には、これらに区別をつけていませんが、それゆえ混乱している初心者をよく見かけます。  
いったん別物として分けて考えていきましょう。

> マスクの作り方やマスク編集の詳細は、別ページの[マスク操作](/ja/data-utilities/mask-ops/)、[AIを使ったマスク生成](/ja/data-utilities/ai-mask-generation/)を参照してください。

---

## タイプA: マスク部分だけの image2image

マスクした部分だけを、通常の image2image と同じノリで描き直す方法です。  
少し顔の表情を変える、絵柄を変える、細かい部分をちょっと修正したいときに向いています。

### workflow

この workflow では、`SetLatentNoiseMask` ノードを使って「どこにノイズを足すか」を指定します。

![](https://gyazo.com/4fc7e54c5ac44fb4c09fc9911f6be06a){gyazo=image}

[](/workflows/basic-workflows/sd15-inpainting/SD1.5_inpainting_SetLatentNoiseMask.json)

- ベースは image2image の workflow です。
- 🟥 `VAE Encode` ノードで元画像を latent に変換
- 🟩 `Set Latent Noise Mask` ノードで latent とマスクを組み合わせる

### この手法の問題点

試しに上の workflow で `denoise` を `1.00` にしてみましょう。

![](https://gyazo.com/b18eb39eee9f53b669edb098a219bd24){gyazo=image}

わお、ホラー画像が生成されました(；・∀・)  

この手法は、あくまで「マスク部分だけをキャンバスにした image2image」です。  
`denoise` を上げると、マスク部分でほとんど **text2image に近い挙動** になります。

プロンプトに「赤いパンチパーマの女性」と書いたので、元の画像とは関係なく、新たに女性を描き出したわけですね。

全体の雰囲気を見つつ、マスクされた部分を描いてもらう方法はないでしょうか？

---

## タイプB: 周囲を見ながらマスクを埋める

画像全体を見たうえで、「周りと自然につなげるようにマスク部分を描き直す」タイプです。  

先ほどは、「image2image の適用範囲をマスクで物理的に切り取る」だけでした。  
こちらのタイプでは、マスク領域そのものを [Conditioning](/ja/ai-capabilities/conditioning/) の一種として扱い、「この範囲だけを描き直してほしい」という条件をモデルに直接渡します。

そのうえで、実装のアプローチはいろいろありますが、SD1.5 では次の 2 系統を押さえておけば十分です。

- **inpainting 専用モデルを使う**
- **ControlNet inpaint でノーマルモデルを inpaint 対応にする**

---

## inpaintingモデル

SD1.5 を「周囲を見ながら埋める」タスク向けに調整したチェックポイントです。

### モデルのダウンロード

- [stable-diffusion-v1-5/sd-v1-5-inpainting.ckpt](https://huggingface.co/stable-diffusion-v1-5/stable-diffusion-inpainting/blob/main/sd-v1-5-inpainting.ckpt)
- ```
  📂ComfyUI/
    └── 📂models/
        └── 📂checkpoints/
            └── sd-v1-5-inpainting.ckpt
  ```

### workflow

![](https://gyazo.com/1f6954026bfda799259cfd948da779a3){gyazo=image}

[](/workflows/basic-workflows/sd15-inpainting/sd-v1-5-inpainting.json)

- 🟪 inpainting モデルを読み込みます。
* 🟩 `VAE Encode`、`Set Latent Noise Mask` を `InpaintModelConditioning` ノードに置き換えます。
  * 入力するパラメータはほぼ同じです。

- `noise_mask` パラメータだけ少し注意が必要です。
  * `true`
    - `Set Latent Noise Mask` のときと同様に、マスクの中だけを書き直すよう強制します。通常はこの設定で問題ありません。
  * `false`
    - 一部のモデルでは、`true` にすると破綻することがあります。その場合の逃げ道として `false` を試してみてください。

上の例では、`denoise` を `1.00` にしても、画像全体が自然に見えるように女性の髪を描き直していることが分かります。
タイプA と違って、「周囲との整合性を見ながらマスク部分を埋める」挙動になっていますね。

---

## ControlNet inpaint

inpainting モデルの欠点は、inpainting モデルを使わないといけないことです。
Stable Diffusion 1.5 をファインチューニングしたモデルを、そのまま inpainting に使いたいときもあるでしょう。

そんな時、**ControlNet inpaint** が役に立ちます。

> [ControlNet](/ja/basic-workflows/sd15-controlnet) については、また別のページで説明します。

### カスタムノード

- [Fannovel16/comfyui_controlnet_aux](https://github.com/Fannovel16/comfyui_controlnet_aux)

### ControlNet モデルのダウンロード

* [comfyanonymous/control_v11p_sd15_inpaint_fp16.safetensors](https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/blob/main/control_v11p_sd15_inpaint_fp16.safetensors)
* ```
  📂ComfyUI/
    └── 📂models/
        └── 📂controlnet/
            └── control_v11p_sd15_inpaint_fp16.safetensors
  ```

### workflow

![](https://gyazo.com/ae3fe8d999343135c6ac995b67a165e7){gyazo=image}

[](/workflows/basic-workflows/sd15-inpainting/SD1.5_ControlNet_inpaint.json)

* 好きな SD1.5 checkpoint（＋LoRA）をロード
* 🟨 画像とマスクを `Inpaint Preprocessor` に入力し、ControlNet 用の画像に変換
  * 実際のところ、マスク部分を黒で塗りつぶしているだけです。
* 🟩 `Apply ControlNet` ノードに ControlNet モデル・画像・VAE を入力
* 🟥 上でやった `Set Latent Noise Mask` を使った inpainting を組み込む

---

## SDXL / Flux などへのつなぎ

このページは SD1.5 に特化していますが、ほかにも inpainting 手段はいくつか存在します。

- Fooocus inpaint（SDXL 向けの inpaint モデル）
- Flux.fill（Flux 系の塗りつぶし機能）
- Lanpaint（画像編集・inpaint 系ツール）

これらは、また別で取り扱う予定です。
