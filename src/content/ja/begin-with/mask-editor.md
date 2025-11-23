---
layout: page.njk
lang: ja
slug: mask-editor
navId: mask-editor
title: "マスクエディタ"
summary: "マスクエディタの使い方について"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## マスクエディタとは

ComfyUI上で、画像の特定部分をマスク（白黒画像）として描画できるツールです。
マスク作成だけでなく、簡易的なペイント機能も備えています。

## 起動方法

- `Load Image` ノードなどを選択 → `Node Selection Toolbox` の `🌔` (Open Mask Editor) をクリック

## ツール操作

画面下部のタブで機能を切り替えます。

### Mask (マスク描画)

ブラシでマスクを描きます。

- **Thickness**: ブラシの太さ
- **Opacity**: 不透明度
  > **Note**
  > AI生成におけるマスクは通常「白か黒か（0か1か）」で扱うため、基本的には `1.0` のままで使用します。
- **Hardness**: ブラシの硬さ（ぼかし具合）
- **Smoothing precision**: 線の補正強度

### Paint (ペイント)

画像に色を塗ります。Inpaint時のガイドなどに使用できます。

- **Color Selector**: 描画色の選択

### Eraser (消しゴム)

描いたマスクやペイントを消去します。

> **Tip**
> MaskやPaintモードのまま **右クリック** することでも消しゴムとして機能します。

### Bucket (塗りつぶし)

クリックした箇所と似た色の範囲を塗りつぶします。

- **Tolerance**: 色の許容範囲（値を上げると広い範囲を塗りつぶす）
- **Fill Opacity**: 塗りつぶしの不透明度

### Color Select (自動選択)

いわゆる「自動選択ツール（マジックワンド）」です。
クリックした箇所と似た色の範囲を自動的にマスク化します。

- **Tolerance**: 色の許容範囲

## 上部メニューの操作

- **Undo / Redo**: 操作の取り消し / やり直し
- **Clear**: 全消去
- **Invert**: マスクの反転

## 保存と適用

- `Save to node` をクリック

編集内容がノードに適用され、エディタが閉じます。
