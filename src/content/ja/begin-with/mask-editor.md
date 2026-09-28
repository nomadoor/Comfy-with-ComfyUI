---
layout: page.njk
lang: ja
section: begin-with
slug: mask-editor
navId: mask-editor
title: "マスクエディタ"
created: 2025-11-20
updated: 2026-03-02
summary: "マスクエディタの使い方について"
seoTitle: "ComfyUIのマスクエディタの使い方"
seoDescription: "ComfyUIの画像にマスクを描くマスクエディタの使い方。起動方法、ブラシ・消しゴム・塗りつぶし・自動選択などのツール、上部メニューの操作、マスクの保存と適用までまとめています。"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## マスクエディタとは

ComfyUI上で、画像の特定部分をマスク（白黒画像）として描画できるツールです。

マスク作成だけでなく、簡易的なペイント機能も備えています。

---

## 起動方法

- `Load Image` ノードなどを選択 → `Node Selection Toolbox` の `🌔` (Open Mask Editor) をクリック

![](/media/begin-with/mask-editor/legacy_gyazo_41526255834943bb591e62583d85d324.mp4){media=loop}

---

## ツール操作

左端のタブで機能を切り替えます。

- ※ブラウザの「ハードウェアアクセラレーション」がオフだと動作が重くなる場合があります。

### マスク描画

ブラシでマスクを描きます。

- **Brush Shape**: ブラシの形状
- **Thickness**: ブラシの太さ
- **Opacity**: 不透明度
  - AI生成におけるマスクは通常「白か黒か（0か1か）」で扱うため、基本的には最大値のままで使用します。
- **Hardness**: ブラシの硬さ（ぼかし具合）
- **Smoothing precision**: 線の補正強度

### ペイント

画像に色を塗ります。Inpaint時のガイドなどに使用できます。

- **Color Selector**: 描画色の選択

![](/media/begin-with/mask-editor/legacy_gyazo_398548a6895a8ad00ab2c9f5cf509222.mp4){media=loop}

### 消しゴム

描いたマスクやペイントを消去します。

MaskやPaintモードのまま **右クリック** することでも消しゴムとして機能します。

### 塗りつぶし

手書きマスクで囲まれた範囲を塗りつぶします。

- **Tolerance**: 許容範囲
  - 低いと隙間が出来てしまうため、上げておいたほうが良いです。

![](/media/begin-with/mask-editor/legacy_gyazo_98edbb1b4ca8324d0974416546194a3c.mp4){media=loop}

### 自動選択

いわゆる「自動選択ツール（マジックワンド）」です。

クリックした箇所と似た色の範囲を自動的にマスク化します。

- **Tolerance**: 色の許容範囲

![](/media/begin-with/mask-editor/legacy_gyazo_bf6ca9fd1af91d39c50174a4ef981b90.mp4){media=loop}

---

## 上部メニューの操作

- **Undo / Redo**: 操作の取り消し / やり直し
- **Clear**: 全消去
- **Invert**: マスクの反転

---

## 保存と適用

- `Save to node` をクリック

編集内容がノードに適用され、エディタが閉じます。

![](/media/begin-with/mask-editor/legacy_gyazo_05a4f6930a6d074435ac29b77c97e82e.mp4){media=loop}
