---
layout: page.njk
lang: ja
section: faq
slug: torch-cuda-oom
navId: torch-cuda-oom
title: "torch.cuda.OutOfMemoryError"
summary: "torch.cuda.OutOfMemoryError"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 症状

- 処理を実行した瞬間、またはサンプリング途中で赤いエラー画面が出て処理が止まる。

- ターミナルには `torch.cuda.OutOfMemoryError` と VRAM の使用量に関するメッセージが出る。

## 発生するタイミング

- Flux / 動画モデルなど重いモデルを、大きな解像度や大きな batch size で回したとき。


## 原因

- GPU の VRAM 容量に対して、モデル＋画像サイズ＋バッチサイズの組み合わせが大きすぎる。

## 解決方法

- batch size を 1 にし、解像度もモデルの推奨値（SD1.5 なら 512〜768px、SDXL なら 1024px 前後）まで下げる。
- それでもダメな場合は、より軽いモデルを使う、量子化モデル（gguf / nf4 など）を検討する
- それでもダメなら素直に GPU を増強する。