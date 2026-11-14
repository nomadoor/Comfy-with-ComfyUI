---
layout: page.njk
lang: ja
section: basic-workflows
slug: trellis-2
navId: trellis-2
title: "TRELLIS.2"
created: 2026-11-14
summary: "画像1枚から3Dモデルを作る"
seoTitle: "ComfyUIでTRELLIS.2とPixal3Dを使う：画像から3Dモデルを生成"
seoDescription: "画像1枚から、PBRテクスチャ付きの3Dメッシュを生成するTRELLIS.2と、その改良版Pixal3Dの、ComfyUIでの使い方。必要なモデルと、TRELLIS.2、Pixal3D、Pixal3Dマルチビューのworkflowを解説します。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/trellis-2/trellis_2_hero.mp4"
tags: []
---

## TRELLIS.2とは？

[TRELLIS.2](https://huggingface.co/microsoft/TRELLIS.2-4B) は、Microsoft が公開した、画像 1 枚から 3D モデルを生成するモデルです。

出力は、色や質感の付いた 3D モデル（PBR テクスチャ付きのメッシュ）です。

### Pixal3D

[Pixal3D](https://huggingface.co/TencentARC/Pixal3D) は、清華大学と Tencent ARC Lab などが公開した、TRELLIS.2 ベースの改良版です。

画像の特徴を画素ごとに 3D 空間へ投影してから生成するので、入力画像と 3D モデルが画素単位で対応し、入力画像に忠実な形になります。

---

## モデルのダウンロード

- background_removal
  - [birefnet.safetensors](https://huggingface.co/Comfy-Org/BiRefNet/blob/main/background_removal/birefnet.safetensors) (444 MB)
- clip_vision
  - [dino_v3_L_naf_fp32.safetensors](https://huggingface.co/Comfy-Org/Pixal3D/blob/main/clip_vision/dino_v3_L_naf_fp32.safetensors) (1.22 GB)
- diffusion_models
  - [trellis_2_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/TRELLIS.2/blob/main/diffusion_models/trellis_2_int8_convrot.safetensors) (5.25 GB)
    - TRELLIS.2 用
  - [pixal3d_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/Pixal3D/blob/main/diffusion_models/pixal3d_int8_convrot.safetensors) (5.58 GB)
    - Pixal3D 用
  - [pixal3d_multiview_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/Pixal3D/blob/main/diffusion_models/pixal3d_multiview_int8_convrot.safetensors) (5.58 GB)
    - Pixal3D マルチビュー用
- geometry_estimation
  - [moge_3_vitl_fp16.safetensors](https://huggingface.co/Comfy-Org/MoGe/blob/main/geometry_estimation/moge_3_vitl_fp16.safetensors) (741 MB)
    - Pixal3D 用
- vae
  - [trellis_2_shape_vae_bf16.safetensors](https://huggingface.co/Comfy-Org/Pixal3D/blob/main/vae/trellis_2_shape_vae_bf16.safetensors) (1.10 GB)
  - [trellis_2_texture_vae_bf16.safetensors](https://huggingface.co/Comfy-Org/Pixal3D/blob/main/vae/trellis_2_texture_vae_bf16.safetensors) (948 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂background_removal/
    │   └── birefnet.safetensors
    ├── 📂clip_vision/
    │   └── dino_v3_L_naf_fp32.safetensors
    ├── 📂diffusion_models/
    │   ├── trellis_2_int8_convrot.safetensors
    │   ├── pixal3d_int8_convrot.safetensors
    │   └── pixal3d_multiview_int8_convrot.safetensors
    ├── 📂geometry_estimation/
    │   └── moge_3_vitl_fp16.safetensors
    └── 📂vae/
        ├── trellis_2_shape_vae_bf16.safetensors
        └── trellis_2_texture_vae_bf16.safetensors
```

---

## TRELLIS.2

非常に巨大な workflow で尻込みしてしまいますが、基本的には入力画像を変えて実行するだけです。

![](/media/basic-workflows/trellis-2/trellis_2_image2model.png){media=image}

[](/workflows/basic-workflows/trellis-2/trellis_2_image2model.json)

{% mediaRow img="/media/basic-workflows/trellis-2/trellis_2_preprocess.png {media=image}", width=33, align="left" %}
**前処理**

BiRefNet で背景を除去し、背景が真っ黒の正方形の画像を作ります。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/trellis-2/trellis_2_sampling_stages.png {media=image}", width=33, align="left" %}
**4 回のサンプリング**

TRELLIS.2 は、大まかな形から順に 4 回に分けて生成します。

- 1 回目
  - 物体がどこにあるか、32³ の粗いボクセルで決める
- 2 回目
  - そのボクセルの中に、512 の解像度で形を作る
- 3 回目
  - 2 回目の形を 1536 の解像度に引き上げ、形を作り直す
- 4 回目
  - できた形に、色と材質を付ける

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/trellis-2/trellis_2_mesh_cleanup.png {media=image}", width=33, align="left" %}
**メッシュの後処理**

生成されたメッシュを整えてから、テクスチャを焼き付けます。

- `Remesh Mesh` で面を均一に作り直し、`Decimate Mesh` で 70 万面まで減らす
- `Unwrap Mesh UVs` で UV を展開し、ボクセルの色をテクスチャに焼き付ける
- 減らす前のメッシュから、法線マップと AO も焼き付ける

{% endmediaRow %}

{% outputs %}
![入力](/media/basic-workflows/trellis-2/trellis_2_input.png){media=image} ![出力](/media/basic-workflows/trellis-2/trellis_2_turntable.mp4){media=loop}
{% endoutputs %}

---

## Pixal3D

TRELLIS.2 とほとんど同じですが、FOV（視野角）の入力が増えるため、画像からそれを推定する処理が追加されます。

![](/media/basic-workflows/trellis-2/pixal3d_image2model.png){media=image}

[](/workflows/basic-workflows/trellis-2/pixal3d_image2model.json)

{% mediaRow img="/media/basic-workflows/trellis-2/pixal3d_preprocess.png {media=image}", width=33, align="left" %}
**前処理**

`Crop Image to Mask` の `pad_factor` は、TRELLIS.2 では 1.0 ですが、Pixal3D では 1.1 にしています。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/trellis-2/pixal3d_model.png {media=image}", width=33, align="left" %}
**モデル**

拡散モデルを `pixal3d_int8_convrot.safetensors` にします。VAE と DINOv3 は TRELLIS.2 と同じです。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/trellis-2/pixal3d_moge.png {media=image}", width=33, align="left" %}
**MoGe で視野角を推定する**

Pixal3D は、画像を撮ったカメラの視野角（FOV）を使って、画像を 3D 空間に投影します。

この workflow では、FOV の推定に MoGe-3 を使っています。

{% endmediaRow %}

{% outputs %}
![入力](/media/basic-workflows/trellis-2/pixal3d_input.png){media=image} ![出力](/media/basic-workflows/trellis-2/pixal3d_turntable.mp4){media=loop}
{% endoutputs %}

---

## Pixal3D マルチビュー

正面・左・背面・右の 4 枚の画像から、3D モデルを生成します。

![](/media/basic-workflows/trellis-2/pixal3d_multiview2model.png){media=image}

[](/workflows/basic-workflows/trellis-2/pixal3d_multiview2model.json)

複数視点の画像は、[Qwen-Image-2.1](/ja/basic-workflows/qwen-image-2-1/) で生成しました。動画生成モデルで回転動画を作ってフレームを抜き出すなど、好きな方法で用意してください。

{% mediaRow img="/media/basic-workflows/trellis-2/pixal3d_multiview_views.png {media=image}", width=33, align="left" %}
**4 視点の入力**

4 枚の画像それぞれから、上と同じように背景を黒く塗った画像を作ります。

workflow をコンパクトにするため、ここでは一度リストにまとめて順に処理し、`Get Item From List` で 1 枚ずつ取り出しています。

- `fov` は既定の 20
  - 写真を使うときは、MoGe で 1 枚から推定した値を入れたほうがいいかもしれません。

{% endmediaRow %}

{% outputs %}
![正面](/media/basic-workflows/trellis-2/pixal3d_multiview_input_front.png){media=image} ![左](/media/basic-workflows/trellis-2/pixal3d_multiview_input_left.png){media=image} ![背面](/media/basic-workflows/trellis-2/pixal3d_multiview_input_back.png){media=image} ![右](/media/basic-workflows/trellis-2/pixal3d_multiview_input_right.png){media=image}

![出力](/media/basic-workflows/trellis-2/pixal3d_multiview_turntable.mp4){media=loop}
{% endoutputs %}
