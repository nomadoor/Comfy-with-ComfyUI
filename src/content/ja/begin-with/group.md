---
layout: page.njk
lang: ja
slug: group
navId: group
title: "グループ"
summary: "ノードをまとめるグループ機能について"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## ComfyUIにおけるグループ

ComfyUIのグループ機能は、複数のノードをまとめて操作するためのものですが、UIの挙動に癖があります。

「ノードを機能的にまとめる」というよりは、「指定した矩形領域に触れているノードをまとめて扱う」という、見た目重視の機能です。

機能的なまとまりを作りたい場合は [Subgraph](/ja/basic-workflows/subgraphs/) のほうが適しています。

## グループの作成

### 手動で作成

- キャンバス上で右クリック → `Add Group`
- 枠のサイズ変更や移動を行い、ノードを枠内に収める

![](https://gyazo.com/8cc0775e0b3f0bf5605f9b3aedf0665c){gyazo=loop}

### 選択したノードから作成

- ノードを選択 →  `Node Selection Toolbox` の `#` (Frame Nodes) をクリック

> **Note**
> グループ枠は四角形にしかならないため、配置によっては選択していないノードもグループに含まれてしまうことがあります。
>
> これのせいでノードのレイアウトが制限されるため、個人的にはグループ機能をあまり使いません。

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
