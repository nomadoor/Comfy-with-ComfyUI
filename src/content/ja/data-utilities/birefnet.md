---
layout: page.njk
lang: ja
section: data-utilities
slug: birefnet
navId: birefnet
title: "BiRefNet"
created: 2026-05-30
updated: 2026-05-30
summary: "BiRefNet を使った背景除去とマスク生成"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
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

### 背景除去

![](https://gyazo.com/0c2c21a3dd7088141b67a66b44c80b3a){gyazo=image}

[](/workflows/data-utilities/birefnet/BiRefNet.json)

- `Load Background Removal Model` で `birefnet.safetensors` を読み込みます。
- `Remove Background` に画像とモデルを入力すると、背景除去用の `MASK` が出力されます。
