---
layout: page.njk
lang: ja
section: begin-with
slug: group
navId: group
title: "グループ"
created: 2025-11-23
updated: 2026-03-02
summary: "ノードをまとめるグループ機能について"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## ComfyUIにおけるグループ

ComfyUIのグループは、ノードを「機能的に束ねる」というより、**枠（矩形）に触れているノードをまとめて扱う** ためのUI機能です。  
そのため、見た目の整理には便利ですが、配置次第で意図しないノードまで一緒に動くことがあります。

機能的なまとまりを作りたい場合は [Subgraph](/ja/begin-with/subgraphs/) のほうが適しています。

## グループの作成

### 手動で作成

- キャンバス上で右クリック → `Add Group`
- 枠のサイズ変更や移動を行い、ノードを枠内に収める

![](https://gyazo.com/8cc0775e0b3f0bf5605f9b3aedf0665c){gyazo=loop}

### 選択したノードから作成

- ノードを選択 →  `Node Selection Toolbox` の `#` (Frame Nodes) をクリック

> グループ枠は四角形固定なので、配置によっては選択していないノードも含まれることがあります。  
> レイアウトの自由度が下がるため、個人的にはグループ機能はあまり使いません。

![](https://gyazo.com/b1c0185c6afc1de67f01acd041169f7c){gyazo=loop}

## グループ枠の編集

グループ枠のヘッダーをクリックし、`Node Selection Toolbox` から操作します。

- **Color**: 色の変更
- **Remove**: グループ枠の削除

![](https://gyazo.com/5aedd107ed53fa8d73da8cfdbbf7d898){gyazo=loop}

## グループの操作

グループ枠のヘッダーを右クリック、または `Node Selection Toolbox` の `⋮` から操作します。

- **Fit Group to Nodes**: 枠のサイズを自動調整
- **Select Nodes**: グループ内のノードを全選択
- **Bypass Group Nodes**: グループ内のノードをまとめてバイパス

![](https://gyazo.com/2469b9f9e950748aa68bd9ee6c418841){gyazo=loop}

## グループ枠の移動

グループ枠をドラッグすると、触れているノードも一緒に移動します。  
位置だけ微調整したいときは、ノードはついてきてほしくありません。

`Ctrl` + `Alt` を押しながらドラッグすることで、グループ枠のみ移動できます。

![](https://gyazo.com/09e16ba51468b0e313ba1c0f445550d4){gyazo=loop}