---
layout: page.njk
lang: ja
section: data-utilities
slug: birefnet
navId: birefnet
title: "BiRefNet"
created: 2026-05-30
updated: 2026-06-24
summary: "BiRefNet を使った背景除去とマスク生成"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/2e42734281821aa3f28153af9ba6a08e.png"
---

## BiRefNetとは？

BiRefNet は、背景除去やマッティングに使われるモデルです。

正式には **Dichotomous Image Segmentation (DIS)**、つまり画像を **前景** と **背景** に二分割するためのモデルです。

SAM のように「この点」「この箱」「この物体」と指定してマスクを作るものではありませんが、切り抜き精度が高く、髪や植物など、複雑なディテールを持つものから高品質なマスクを作ることができます。

---

## モデルのダウンロード

- [birefnet.safetensors](https://huggingface.co/Comfy-Org/BiRefNet/blob/main/background_removal/birefnet.safetensors) (444 MB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂background_removal/
        └── birefnet.safetensors
```

---

## workflow

### 前景を切り抜く

![](https://gyazo.com/57972a01d12b0d8e88ef705c18344651){gyazo=image}

[](/workflows/data-utilities/birefnet/BiRefNet.json)

- `Load Background Removal Model` で `birefnet.safetensors` を読み込みます。
- `Remove Background` に画像とモデルを入力すると、背景除去用の `MASK` が出力されます。
- 背景が透過された画像が欲しいときは `Join Image with Alpha` を使います。
  - ただし、そのまま使うと前景側が透明になってしまうので、`Invert Mask` を挟みます。

### 背景を塗りつぶす

上の workflow では背景を透過しましたが、画像生成や解析の下処理として使う場合は、背景を単色で塗りつぶしたほうが扱いやすいことも多いです。

![](https://gyazo.com/5d22ae3e905a8ccd3c1b8c63f615bb4e){gyazo=image}

[](/workflows/data-utilities/birefnet/BiRefNet_fill.json)

- `Image Composite Masked` に元画像、反転マスク、単色画像を入力します。
- マスクされた背景部分だけを単色画像で置き換えます。
- 詳しくは [レイヤ合成](/ja/data-utilities/layer-composite-blend/) をご覧ください。
