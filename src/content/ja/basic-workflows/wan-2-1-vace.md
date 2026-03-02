---
layout: page.njk
lang: ja
section: basic-workflows
slug: wan-2-1-vace
navId: wan-2-1-vace
title: "Wan2.1 VACE"
summary: "Wan2.1 VACEでControlNet的制御・in/outpainting・reference2video・Extensionを扱う"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://gyazo.com/7e8deb0b28623921172baeeb26cf9de1.mp4"
tags: []
---
## Wan2.1 VACEとは？

**Wan2.1 VACE** は、Wan2.1 の動画生成における編集用モデルです。

動画版の ControlNet と inpainting / outpainting / reference2video を 1 つのノード（`WanVaceToVideo`）にまとめたような機能を持っています。

- 既存動画に対して、ポーズや深度マップで「動きだけ」コントロールする
- reference 画像を元に、キャラを入れ替えたりスタイルを寄せる
- 特定の領域だけ inpainting / outpainting する
- 動画の続きを生成（Extension）したり、ループ・中割りを作る

といったことを、Wan2.1 の生成品質のまま扱うことができます。

---

## 推奨設定

- 推奨解像度
  - 720p 前後、かつ **16 の倍数**
- 最大フレーム数
  - 81 フレーム

---

## モデルのダウンロード

Wan2.1 VACE 用には、通常の T2V モデルとは別の VACE 専用 diffusion model を使います。
ここでは 14B のみ扱います。

- diffusion_models
  - [wan2.1_vace_14B_fp16.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/diffusion_models/wan2.1_vace_14B_fp16.safetensors)
- text encoder
  - [umt5_xxl_fp8_e4m3fn_scaled.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/text_encoders/umt5_xxl_fp8_e4m3fn_scaled.safetensors)
- VAE
  - [wan_2.1_vae.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/vae/wan_2.1_vae.safetensors)
- gguf（任意）
  - [Wan2.1-VACE-14B-GGUF](https://huggingface.co/QuantStack/Wan2.1-VACE-14B-GGUF/tree/main)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── wan2.1_vace_14B_fp16.safetensors
    ├── 📂text_encoders/
    │   └── umt5_xxl_fp8_e4m3fn_scaled.safetensors
    ├── 📂unet/
    │   └── Wan2.1_14B_VACE-XXXX.gguf   ← gguf を使う場合のみ
    └── 📂vae/
        └── wan_2.1_vae.safetensors
```

## 基本構造

どのパターンでも [Wan2.1 text2video](/ja/basic-workflows/wan-2-1/#品質が上がるかもしれない技術) をベースに、`WanVaceToVideo` ノードを追加した形が基本になります。

![](https://gyazo.com/15272b819b453d21ec3707c059831edc){gyazo=image}

- `control_video`
  - ポーズ・深度マップ・scribble・optical_flow・layout などの「ガイド動画」
- `control_masks`
  - inpainting 用のマスク
- `reference_image`
  - キャラやスタイルを転送したい参照画像

---

## ControlNet的な使い方

ポーズや深度マップなどを使って、動画の動きをコントロールします。

![](https://gyazo.com/58c1530fbeeb7aa1004120b2db2ddff9){gyazo=loop}

[](/workflows/basic-workflows/wan-2-1-vace/Wan2.1_VACE_control_pose.json)

{% mediaRow img="https://gyazo.com/6aca797b02070eb54bef2d7c9b2599ee {gyazo=image}", width=33, align="left" %}

**1. Wan2.1 VACE モデルを読み込む**

- `Load Diffusion Model` で `wan2.1_vace_14B_fp16.safetensors` を読み込みます。
- そのままでは VRAM をかなり使うため、`dtype` を `fp8_e4m3fn` に切り替えて、VRAM の使用量を削減します。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/cbf721a8d70bd43d48b1fde5771b48ab {gyazo=image}", width=33, align="left" %}

**2. 動画のリサイズ**

- `ImageScaleToTotalPixels` で適度なサイズに縮小します。
  - Wan は 720p（1MP）まで生成できますが、私のPCでは VRAM が足りないため 0.5MP にしています。
- `Resize Image v2` で 16 の倍数になるようにクロップします。
  - このノードだけで 0.5MP に揃えることもできますが、処理の意図を分けるために二段構成にしています。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/f6cfc10cb0f532e1e7c9d55acf412aee {gyazo=image}", width=33, align="left" %}

**3. control_video の作成と入力**

- `OpenPose Pose` で動画から棒人間のポーズ動画を作ります。
- それを `WanVaceToVideo` の `control_video` に入力します。

{% endmediaRow %}


## reference2video

reference 画像のキャラやスタイルを、動画に転送します。

![](https://gyazo.com/b9a184b4ffcad5f4a16b056df24818ed){gyazo=loop}

[](/workflows/basic-workflows/wan-2-1-vace/Wan2.1_VACE_reference.json)

{% mediaRow img="https://gyazo.com/235ae5ef44d4fb1518128c0ac099f601 {gyazo=image}", width=33, align="left" %}

**1. 参照画像の下処理・入力**

- `WanVaceToVideo` の `reference_image` に、キャラ画像やイラストを入力します。
  - 背景を切り抜いて白で埋めた画像を使うと安定しやすいです。
  - reference2video と言いながら、仕組み上、参照画像の位置関係をそのまま受け継ぎます。
  - そのため、生成する動画のサイズと参照画像は同じであったほうが良く、キャラの位置や大きさも、最終的に置きたい位置に近づけておくといった前処理が重要になります。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/289292215d191fbf7e114ff0ec2dcd77 {gyazo=loop}", width=33, align="left" %}

**2. 初期フレームカット**

- reference2video では、最初の数フレームに「参照画像＋生成結果が重なったフレーム」が出力されます。
  - これが VACE が参照画像を使用できる仕組みそのものなのですが、この部分は必要ありません。
  - 🟥 `TrimVideoLatent` で、初期フレームを latent の段階でカットしてから動画を書き出します。

{% endmediaRow %}


## 空間的な inpainting

動画の一部分だけを差し替えます。

![](https://gyazo.com/b146e11b6fab1d3e23cdcc30f8fe73c9){gyazo=loop}

[](/workflows/basic-workflows/wan-2-1-vace/Wan2.1_VACE_inpainting.json)

{% mediaRow img="https://gyazo.com/eb65c46a68797753df091e4d28456929 {gyazo=image}", width=33, align="left" %}

**1. マスク生成**

- 好きな方法でマスクを作成してください。
- この workflow では `Florence-2` でクルマを検出し、その BBOX をそのままマスクとして使っています。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/ff3fe037d3699cda4c1939cfe30922c0 {gyazo=image}", width=33, align="left" %}

**2. control_video の作成**

- `control_video` には、**マスク部分を灰色（RGB 127,127,127）で埋めた動画** を使用します。
- `ImageCompositeMasked` でマスク部分を灰色で塗りつぶします。
- `WanVaceToVideo` ノードに、作成した `control_video` とマスクを入力します。

{% endmediaRow %}



## 時間的な outpainting（Extension）

動画の「時間方向」を伸ばすのが Extension です。
入力動画の一部フレームだけを使い、その先を VACE に補完してもらいます。

![](https://gyazo.com/6bb7dd561151e0a93367fec89d90db26){gyazo=loop}

[](/workflows/basic-workflows/wan-2-1-vace/Wan2.1_VACE_Extension.json)

- この workflow では、入力動画の最後 5 フレームを元に、その先の 72 フレーム（81 - 5）を生成しています。

{% mediaRow img="https://gyazo.com/97d42cdc7d3a1c5b9777336efb5dd905 {gyazo=image}", width=33, align="left" %}

**1. 最後 5 フレームの取得**

- 入力動画を一度逆転し、先頭から 5 フレームだけ抜き出します。
- その 5 フレームだけのバッチを、再度逆転して「元動画のラスト 5 フレーム」として使います。
- もう少しスマートなノードが欲しいところですが、現状はこの手順しかありません。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/9b449f71d2dad381d37e4f3e363159cf {gyazo=image}", width=33, align="left" %}

**2. control_video とマスクの作成**

- Extension を**時間的な in/outpainting** と表現しましたが、実際、先程の空間的な inpainting の workflow に似ています。
- 生成したいフレーム数（ここでは 72 フレーム）分の灰色画像と、その全域を覆うマスクを作ります。
  - この区間を丸ごと inpainting するイメージです。
- これを `WanVideo VACE Start To End Frame`（[kijai/ComfyUI-WanVideoWrapper](https://github.com/kijai/ComfyUI-WanVideoWrapper)) で作り、WanVaceToVideo に渡します。
  - コアノードだけでも構成できますが、ノード数が跳ね上がるので、ここは素直に Wrapper ノードに頼ったほうが良いと思います。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/9886bf3bcd6bdbaed2aeadd2d6cb810b {gyazo=image}", width=33, align="left" %}

**3. 生成動画と元動画をつなげる**

- 生成動画は「元動画 5 フレーム + 生成した 72 フレーム」です。
- このまま元動画と繋げてしまうと 5 フレーム重複してしまいます。
- そのため `ImageFromBatch` ノードで最初の 5 フレームを切り捨ててから、元動画の後ろに接続します。

{% endmediaRow %}


## 動画のループ化

動画の最後の数フレームと、最初の数フレームを抽出し、**最後 → 最初** につながるようにすればループ動画が作れます。
これまでも FLF2V を使えば作れましたが、VACE では複数のフレームを入力として使えるため、動画の流れを受け継いだような挙動に出来るのが面白いところです。

![](https://gyazo.com/14d264b55e73ace3c1e07aa9ecc24515){gyazo=loop}

[](/workflows/basic-workflows/wan-2-1-vace/Wan2.1_VACE_Extension_loop.json)

- 上の Extension に加えて、**最初から 5 フレーム** も取得します。
- それを `WanVideo VACE Start To End Frame` の `end_image` に入力します。
- 効果があるかはケースバイケースですが、1 フレーム目を抽出して `reference_image` としても使っています。
