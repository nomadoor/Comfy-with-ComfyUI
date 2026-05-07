---
layout: page.njk
lang: ja
section: data-utilities
slug: sam3
navId: sam3
title: "SAM 3 / 3.1"
created: 2026-05-07
updated: 2026-05-07
summary: "SAM 3 / 3.1を使ったAIマスク生成"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## SAM 3 / 3.1とは？

[SAM 3](https://github.com/facebookresearch/sam3) は、Meta の Segment Anything Model シリーズの新しいモデルです。

これまでの SAM は、あくまで **物の形が分かる** だけで、指定したオブジェクトを切り抜くには、BBOX や座標で位置を指定してあげる必要がありました。

SAM 3 では、VLM のようにテキストで対象を指定し、単独でセグメンテーションを完結させることができるようになっています。

[SAM 3.1](https://ai.meta.com/blog/segment-anything-model-3/) は SAM 3 の更新版です。動画で複数オブジェクトを追跡する処理が改善されています。

---

## モデルのダウンロード

- [sam3.1_multiplex_fp16.safetensors](https://huggingface.co/Comfy-Org/sam3.1/blob/main/checkpoints/sam3.1_multiplex_fp16.safetensors) (1.75 GB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂checkpoints/
        └── sam3.1_multiplex_fp16.safetensors
```

---

## workflow

### 静止画

![](https://gyazo.com/cd6078ed81d850085144836e404754d5){gyazo=image}

[](/workflows/data-utilities/sam3/SAM3.1.json)

- `SAM3 Detect` ノードに、画像・マスク、切り抜く対象の情報（テキストプロンプト、BBOX、座標）を入力します。
- 少しややこしい仕様ですが、そのプロンプトに対応する対象が複数あった場合、単に `car` のように書くだけでは、そのうちの一番それらしいものしか検出しません。
  - N 番目までセグメンテーションしたい場合は、`car:N` のように書く必要があります。
  - 単に画面に映っている対象をすべて検出したい場合は、`car:99` のように書いてしまってもいいでしょう。

### 動画

![](https://gyazo.com/96c353a26df8cf274d9b68a95453ba7b){gyazo=loop}

[](/workflows/data-utilities/sam3/SAM3.1_video.json)

- `SAM3 Video Track` ノードを使用します。
- 出力を `SAM3 Track to Mask` ノードに渡すことで、マスクとして使用できます。
- `SAM3 Track Preview` ノードは、画像と `track_data` を入力すると、マスク部分を色付けして見やすくしてくれます。
