---
layout: page.njk
lang: ja
section: basic-workflows
slug: florence2
navId: florence2
title: "Florence-2"
created: 2025-12-08
updated: 2026-03-02
summary: "Florence-2を使った画像キャプション生成・物体検出"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
tags: ["tag-caption-generation","object-detection"]
---

## Florence-2とは？

画像を見てキャプション生成・物体検出・セグメンテーション・OCR など、1つのモデルでいくつものタスクをこなせる汎用 VLM（Visual Language Model）です。

このページでは、ComfyUI でよく使う「キャプション生成」「物体検出（座標抽出）」「OCR」「画像に関するQ&A」の4つに絞って扱います。

---

## カスタムノード

- [kijai/ComfyUI-Florence2](https://github.com/kijai/ComfyUI-Florence2?tab=readme-ov-file)
  - モデルは最初の実行時に自動でダウンロードされます。

---

## Florence2Run ノード

Florence2Run は、入力画像に対して Florence-2 にタスクを実行させるためのメインノードです。`task` を切り替えることで、キャプション生成や物体検出、OCR などの機能を使い分けることができます。

### caption, detailed caption

画像から自然文のキャプションを生成します。

![](https://gyazo.com/b364e8bc1ba2799ad953384f4dfe2079){gyazo=image}

[](/workflows/basic-workflows/florence2/Florence2-detailed_caption.json)

- `caption`  
  - 画像の概要をシンプルに説明します。
- `detailed caption`  
  - 構図や見た目をもう少し細かく説明します。

ただし、「プロンプト用のキャプション」だけが目的であれば、[JoyCaption](/ja/basic-workflows/joycaption/) など、キャプション専用モデルを使ったほうが遥かに柔軟でクオリティの高いものが出てきます。

### caption_to_phrase_grounding

指定したキャプションのフレーズごとに、物体の位置を矩形（バウンディングボックス）の形で出力します。

![](https://gyazo.com/0acc3146eed131b9642857ebc1edcce1){gyazo=image}

[](/workflows/basic-workflows/florence2/Florence2-caption_to_phrase_grounding.json)

- 「left tree」「red car」など、少し複雑な指示でも位置を取れるのが特徴です。
- 🟨 `Florence2 Coordinates` ノードで座標を取り出し、SAM2 などのセグメンテーションモデルと組み合わせることで、特定の物体だけをマスク化するといった使い方ができます。

### ocr

画像内の文字を読み取り、テキストとして出力します。

![](https://gyazo.com/e701757ab4dfe4056a74a5290d52edbb){gyazo=image}

[](/workflows/basic-workflows/florence2/Florence2-ocr.json)


### docvqa

画像についての質問に答えるタスクです。

![](https://gyazo.com/614f705d137c7d5a19015b5a9aaa4f17){gyazo=image}

[](/workflows/basic-workflows/florence2/Florence2-docvqa.json)

- 「この画像の中で○○はどこにあるか？」「この表の値は？」といった質問を投げて、回答をテキストで受け取ることができます。
- ChatGPT に画像を投げて質問するのと似た使い方のイメージです。
