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
  image: ""
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
  - 81フレーム

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

---

## 基本構造


どのパターンでも [Wan2.1 text2video](/ja/basic-workflows/wan-2-1/#品質が上がるかもしれない技術) をベースに　`WanVaceToVideo` ノードを追加した形が基本になります。

![](https://gyazo.com/15272b819b453d21ec3707c059831edc){gyazo=image}


- `control_video`
  - ポーズ・深度マップ・scribble・optical_flow・layout などの「ガイド動画」
- `control_masks`
  - inpainting用のマスク
- `reference_image`
  - キャラやスタイルを転送したい参照画像

---

## ControlNet的な使い方

ポーズや深度マップなどを使って、動画の動きをコントロールします。

![](https://gyazo.com/58c1530fbeeb7aa1004120b2db2ddff9){gyazo=image}

[](/workflows/basic-workflows/wan-2-1-vace/Wan2.1_VACE_control_pose.json)

- ポーズ（OpenPose など）や深度マップなどを `control_video` として入力します。
- 「元動画のカメラワークは維持しつつ、ポーズだけ別動画から借りてくる」といった用途に使えます。

---

## reference2video

reference 画像のキャラやスタイルを、動画に転送します。

![](https://gyazo.com/b9a184b4ffcad5f4a16b056df24818ed){gyazo=image}

[](/workflows/basic-workflows/wan-2-1-vace/Wan2.1_VACE_reference.json)

- `reference_image` に、キャラ画像やイラストを入力します。
- 背景を切り抜いて白で埋めた画像を使うと安定しやすいです。
- 生成動画の冒頭に参照画像がそのまま残る場合があるため、`TrimVideoLatent` で初期フレームをカットすると扱いやすくなります。
- 出力解像度に合わせて、reference 画像もリサイズしておくと破綻を防げます。

---

## 空間的な inpainting

動画の一部分だけを差し替えます。

![](https://gyazo.com/b146e11b6fab1d3e23cdcc30f8fe73c9){gyazo=image}

[](/workflows/basic-workflows/wan-2-1-vace/Wan2.1_VACE_inpainting.json)

- `control_video` には、**マスク部分を灰色（RGB 127,127,127）で埋めた動画** を使用します。
- 何もしない領域は元動画をそのまま使い、グレーで埋めた部分だけ差し替えます。

---

## 時間的な outpainting（Extension）

動画の「時間方向」を伸ばします。
入力動画の最初の N フレームだけを使い、その続きを生成させる仕組みです。

![](https://gyazo.com/6bb7dd561151e0a93367fec89d90db26){gyazo=loop}

[](/workflows/basic-workflows/wan-2-1-vace/Wan2.1_VACE_Extension.json)

- `Create Fade Mask Advanced` などで、続きを作らせたい区間（例：11フレーム目以降）を全面マスクにします。
- 使わないフレームをそのまま `control_video` に残すと余計なガイドになるため、生成させたい部分はマスクやグレーで塗りつぶすのがコツです。

---

## 動画のループ化

Extension を応用して、既存動画をループ動画にします。

![](https://gyazo.com/14d264b55e73ace3c1e07aa9ecc24515){gyazo=loop}
[](/workflows/basic-workflows/wan-2-1-vace/Wan2.1_VACE_Extension_loop.json)

- 元動画の頭と末尾を使い、間をつなぐフレームを Extension で生成してループさせます。
