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

![](https://gyazo.com/41526255834943bb591e62583d85d324){gyazo=loop}

## ツール操作

左端のタブで機能を切り替えます。

### マスク描画

ブラシでマスクを描きます。

- **Brush Shape**: ブラシの形状
- **Thickness**: ブラシの太さ
- **Opacity**: 不透明度
  - AI生成におけるマスクは通常「白か黒か（0か1か）」で扱うため、基本的には触りません。
- **Hardness**: ブラシの硬さ（ぼかし具合）
- **Smoothing precision**: 線の補正強度

### ペイント

画像に色を塗ります。Inpaint時のガイドなどに使用できます。

![](https://gyazo.com/398548a6895a8ad00ab2c9f5cf509222){gyazo=loop}

- **Color Selector**: 描画色の選択

### 消しゴム

描いたマスクやペイントを消去します。

> **Tip**
> MaskやPaintモードのまま **右クリック** することでも消しゴムとして機能します。

### 塗りつぶし

手書きマスクで囲まれた範囲を塗りつぶします。

![](https://gyazo.com/98edbb1b4ca8324d0974416546194a3c){gyazo=loop}

- **Tolerance**: 許容範囲
  - 低いと隙間が出来てしまうため、上げておいたほうが良いです。

### 自動選択

いわゆる「自動選択ツール（マジックワンド）」です。

クリックした箇所と似た色の範囲を自動的にマスクにします。

![](https://gyazo.com/bf6ca9fd1af91d39c50174a4ef981b90){gyazo=loop}

- **Tolerance**: 色の許容範囲

## 上部メニューの操作

- **Undo / Redo**: 操作の取り消し / やり直し
- **Clear**: 全消去
- **Invert**: マスクの反転

## 保存と適用

- `Save to node` をクリック

編集内容がノードに適用され、エディタが閉じます。

![](https://gyazo.com/05a4f6930a6d074435ac29b77c97e82e){gyazo=loop}
