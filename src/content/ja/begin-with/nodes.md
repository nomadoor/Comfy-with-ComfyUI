---
layout: page.njk
lang: ja
section: begin-with
slug: nodes
navId: nodes
title: "ノード"
created: 2025-11-20
updated: 2026-03-02
summary: "ノードについて"
seoTitle: "ComfyUIのノード操作：追加・接続・コピーなど"
seoDescription: "ComfyUIのノードの基本操作。検索やメニュー、ピンからの追加方法、接続と付け替え、選択・削除・コピー＆ペースト・折りたたみ・ピン留めなどの操作をまとめています。"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---


## ノードの追加

### 検索して追加（推奨）

- キャンバス上でダブルクリック → 検索窓に入力
- 欲しいノードをクリック、または矢印キーで選択して `Enter`

検索欄横のアイコンを押すと、フィルターが開きます。データ型や含まれるカスタムノードから絞り込むことができます。

> どんなノードがあるかは覚えるしかないです。頑張って学びましょう！！

![](/media/begin-with/nodes/legacy_gyazo_b0571db1685d43d84739aeac7559abc8.mp4){media=loop}

### メニューから追加

- キャンバス上で右クリック → `Add Node` → ノードを探してクリック

![](/media/begin-with/nodes/legacy_gyazo_ef2cca44a8446a84d9722578e97becbc.mp4){media=loop}


### 接続可能なノードから追加

- ピンからドラッグしてキャンバス上で離す
- 検索窓が表示されますが、データ型によるフィルタがかかった状態で表示されます

![](/media/begin-with/nodes/legacy_gyazo_89de8c5d0c26473008ed7b65c6d62f71.mp4){media=loop}


### 接続可能なノードから追加 (レガシー)

- ピンからドラッグして**Shiftを押しながら**キャンバス上で離す
- 表示されるリストから選択（表示上限があるため、見つからない場合は `Search` から検索）

![](/media/begin-with/nodes/legacy_gyazo_7fd0db2ee2795630a82eff60f59dc967.mp4){media=loop}

---

## ノードの接続

- ピンからピンへドラッグ
- 正確にピンに合わせなくても、ノード上にドラッグするだけで自動的に吸着します。

![](/media/begin-with/nodes/legacy_gyazo_b8d64b7c5ff3ec72eab34d230b18220f.mp4){media=loop}

### 接続の変更

- `Shift` を押しながらピンからピンへドラッグ
- 既に接続されているラインがある場合、まとめて繋ぎ直すことができます。

![](/media/begin-with/nodes/legacy_gyazo_bd765ab5d368f0ea62bd9f6752bbd511.mp4){media=loop}

---

## ノードの操作

### 選択と移動

- **複数選択**: `Shift` or `Ctrl` + 左クリック
- **範囲選択**: `Ctrl` + ドラッグ
- **移動**: 選択した状態でドラッグ

![](/media/begin-with/nodes/legacy_gyazo_ec2d834b60c0fdc243fe12298f2a849d.mp4){media=loop}

### 削除

- ノードを選択して `Delete` キー
- または `Node Selection Toolbox` の `🗑️` をクリック

![](/media/begin-with/nodes/legacy_gyazo_38bdfe83ae6bbbff8f063bed7936edfe.mp4){media=loop}

### コピー & ペースト

- **通常コピー**: `Ctrl + C` → `Ctrl + V`
- **接続を維持してペースト**: `Ctrl + C` → `Ctrl + Shift + V`
- **複製**: `Alt` を押しながらドラッグ

![](/media/begin-with/nodes/legacy_gyazo_3898dc47a12c5d95d8f81093bdf5bfb7.mp4){media=loop}

### 折りたたみ

- ノード左上の `⚫` をクリック
- 折りたたみ中は、新たな接続や解除ができなくなります。

![](/media/begin-with/nodes/legacy_gyazo_cc2fb21c796ea9a872dd9b25fdf317c0.mp4){media=loop}

### ピン留め（固定）

ノードを動かないように固定します。

- ノードを選択して `P` キー

![](/media/begin-with/nodes/legacy_gyazo_e18df835c4248220e5c8a0c2d021dacd.mp4){media=loop}

### パラメータのリセット

- ノードを右クリック → `Fix node(recreate)`

![](/media/begin-with/nodes/legacy_gyazo_b1fec4d60d74acb79b6ef2c56db4e6ab.mp4){media=loop}

### Node Info（ノード情報）

ノードの詳細情報を確認します。

- `Node Selection Toolbox` の `ℹ️` をクリック
- そのノードがどのPythonファイルで定義されているかなどが分かります。エラー時のデバッグに便利です。

### ノードの色変更

ノードの背景色を変更して、役割ごとに色分けすると見やすくなります。

- `Node Selection Toolbox` の `🎨 (Color)` をクリックして色を選択

![](/media/begin-with/nodes/legacy_gyazo_57d95f8586bdda17ed96855cbac37af8.mp4){media=loop}

### ノードのタイトル変更

ノードの表示名（タイトル）を変更します。

- ノードをダブルクリック → 好きな名前を入力して `Enter`

![](/media/begin-with/nodes/legacy_gyazo_6d04c3d29e18e2ef5327c438264ff3d0.mp4){media=loop}


---

## Rerouteノード

workflowの配線を整理するために使用します。

- 検索して追加
- ポイントを中クリックで追加

![](/media/begin-with/nodes/legacy_gyazo_86de60d6b6959f5448dcfaad42178fcb.mp4){media=loop}


### ドット型Reroute

Rerouteノードはノードとして単体で存在しましたが、こちらはノードではなく、ラインの通過地点を設定するものです。

- ライン上の点を `Alt + 左クリック`

![](/media/begin-with/nodes/legacy_gyazo_cac43ac8b7fef76a4cdb0ff5d83bd1c7.mp4){media=loop}

---

## バイパスとミュート

### バイパス (Bypass)

そのノードを**無視して**処理を続けます。

- ノードを選択して `Ctrl + B`
- `Node Selection Toolbox` の `🔀` をクリック

![](/media/begin-with/nodes/legacy_gyazo_4ab6605bdd97ee8cae5b4403057a38e5.mp4){media=loop}

### ミュート (Mute)

そのノードで処理を**停止**します。

- ノードを選択して `Ctrl + M`
- または右クリック → `Mode` → `Never`

> **違いについて**
> - **バイパス**: 「このノードが無かったこと」にして、前後のノードを直結しようとします。
> - **ミュート**: 「ここで行き止まり」にします。
>
> 実際のところ、ミュートはあまり使われません。使用しないノードを全部バイパスしてしまうことが多いです。

![](/media/begin-with/nodes/legacy_gyazo_5d96054e7b54a62b3a446a28d70212d6.png){media=image}

---

## 外部入力への変換

入力欄（ウィジェット）をピン入力に変換し、他のノードから値を渡せるようにします。

- **変換**: ピンがないパラメータの横にカーソルを持っていくと、接続ポイントが現れます。
- **戻す**: 接続しているラインを外すと、自動的に元の入力欄に戻ります。

![](/media/begin-with/nodes/legacy_gyazo_80e1bb9211082f4d89a2a85d5abd78c2.mp4){media=loop}

### Primitiveノード

あらゆる型の入力として使える万能ノードです。接続先の型に合わせて動的に変化します。

> **注意:** 
> 接続先の型に合わせる都合上、rerouteノードと組み合わせて使用できません。
>
> 現在は型が決まった`intノード`、`floatノード`、`stringノード`などを使用することを推奨します。

![](/media/begin-with/nodes/legacy_gyazo_e0a056e9c112028930466701e22afd10.mp4){media=loop}

> **Tip:**
> ピンを **ダブルクリック** すると、その型に合ったPrimitiveノードが自動的に接続されます。

![](/media/begin-with/nodes/legacy_gyazo_35f00ebec3fab7b0471b5595b4b0a5e5.mp4){media=loop}


## ノードの整理

複数ノードを選択し、`Node Selection Toolbox` の `⋮` をクリックします。

- **Align Selected To**: 選択したノードを整列させます（上揃え、左揃えなど）。
- **Distribute Nodes**: 選択したノードを等間隔に配置します。

![](/media/begin-with/nodes/legacy_gyazo_6bb992414f853ea57c7182cde11933f8.mp4){media=loop}
