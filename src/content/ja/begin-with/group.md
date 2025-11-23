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

## グループの作成

### 手動で作成

- キャンバス上で右クリック → `Add Group`
- 出てきた枠の大きさを変えたり移動させたりして、ノードを枠内に収めます。

![](https://gyazo.com/8cc0775e0b3f0bf5605f9b3aedf0665c){gyazo=loop}

### 選択したノードから作成

- ノードを選択 → キャンバス上で右クリック → `Add Group For Selected Nodes`

> **Note**
> グループ枠は矩形（四角形）にしかならないため、配置によっては選択していないノードもグループに含まれてしまうことがあります。

![](https://gyazo.com/9d354b774d2e70e463beafa27e160095){gyazo=loop}

## グループの操作

グループ枠（ヘッダー部分など）を右クリックすると、グループ内のノードに対してまとめて操作を行えます。

- **Fit Group to Nodes**: グループ枠の大きさを自動調整
- **Select Nodes**: グループ内のノードを全選択
- **Bypass Group Nodes**: グループ内のノードをまとめてバイパス

![](https://gyazo.com/86fb39ec8c0a330b5e6a0b22bc016926){gyazo=loop}
