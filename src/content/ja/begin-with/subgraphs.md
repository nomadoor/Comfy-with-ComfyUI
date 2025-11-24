---
layout: page.njk
lang: ja
slug: subgraphs
navId: subgraphs
title: "サブグラフ"
summary: "サブグラフについて"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## サブグラフとは

複数のノードを一つのノードに集約する機能です。
見た目を整えるだけでなく、再利用可能なモジュール（Blueprint）として保存し、新しいノードのように扱うことができます。

全てのノードを一つにまとめることも可能ですが、ComfyUIは画像生成のパイプラインを小さなモジュールに分けることができるのが特徴です。

単に見た目を整えるというよりは、あくまで「再利用可能なモジュール」を作成するための機能だと、個人的には考えています。

## サブグラフの作成

- 1. まとめたいノードを複数選択
- 2. `Node Selection Toolbox` の `🕸️` (Convert Selection to Subgraph) をクリック

![](https://gyazo.com/d59c55b69252fad5f076a9b5e17be95a){gyazo=loop}

## サブグラフの編集

サブグラフをダブルクリック、または右上のアイコンをクリックして編集モードに入ります。

基本操作は通常と同じですが、外部とやり取りするパラメータは、サブグラフの入出力スロット（左端・右端）に接続する必要があります。

![](https://gyazo.com/5d5ebc1bc37a8dfdaad5a5db64d66cb2){gyazo=loop}

## パラメータの公開設定

サブグラフ内のパラメータを、サブグラフノードのウィジェットとして表に出すことができます。
いちいち編集モードに入らずに値を変更できるようになります。

- 1. サブグラフを選択
- 2. `Node Selection Toolbox` の `Edit Subgraph Widgets` をクリック
- 3. 公開したいパラメータにチェックを入れる

![](https://gyazo.com/024e67b6cea67bda0849829b3762f4ba){gyazo=loop}

## サブグラフの保存と再利用

作成したサブグラフを保存すると、独自のノードとして再利用できます。

- 1. サブグラフを選択
- 2. `Node Selection Toolbox` の `📖` (Publish Subgraph) をクリック
- 3. 名前を入力して `Confirm`

保存後は、通常のノードと同じように検索（ダブルクリック）して呼び出せます。

サイドバーのノードライブラリからも確認でき、ここからBlueprintの削除・編集を行います。

![](https://gyazo.com/74f9469b12a6b87fc7a62099dde54db7){gyazo=loop}

[](/workflows/begin-with/subgraphs/Chroma_key.json)
