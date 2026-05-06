---
layout: page.njk
lang: ja
section: data-utilities
slug: sam3-mask-generation
navId: sam3-mask-generation
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

これまでの SAM は、ポイントや BBOX で「このあたり」を指定してマスクを作る使い方が中心でした。SAM 3 では、短いテキストで対象を指定し、その対象の検出とセグメンテーションをまとめて行えるようになっています。

たとえば `person`、`red car`、`the dog` のように指定すると、対象を探して、その形をマスクとして取り出します。

[SAM 3.1](https://ai.meta.com/blog/segment-anything-model-3/) は SAM 3 の更新版です。特に動画で複数オブジェクトを追跡する処理が改善されています。静止画のマスク生成では、まず SAM 3 / 3.1 系として考えておけばよいでしょう。

---

## 何に使う？

ComfyUI では、inpainting、合成、背景処理、部分的な生成などでマスクをよく使います。

SAM 3 / 3.1 は、次のような場面で便利です。

- 画像内の人物だけをマスクにしたい
- 車、服、家具など、テキストで説明しやすい対象を抜き出したい
- YOLO や Grounding DINO と SAM を組み合わせる前に、まずシンプルに試したい

静止画の AI マスク生成は、ひとまず SAM 3 / 3.1 から始めるのが分かりやすいです。

---

## モデルのダウンロード

ComfyUI 本体側で SAM 3 系が使えるようになっているため、基本的には必要なモデルをダウンロードして使います。

モデルは ComfyUI Manager の `Install Models` から探すか、Meta の Hugging Face ページから入手します。

- [facebook/sam3](https://huggingface.co/facebook/sam3)
- [facebook/sam3.1](https://huggingface.co/facebook/sam3.1)

> Hugging Face 側で利用申請やログインが必要になる場合があります。

---

## workflow

workflow は後で追加します。

まずは「テキストで対象を指定してマスクを作るモデル」と考えておけばOKです。

複雑なマスク生成を組む前に、SAM 3 / 3.1 単体でどこまで取れるか試してみるのがおすすめです。
