---
layout: page.njk
lang: ja
slug: nodes
navId: nodes
title: "ノード"
summary: "ノードについて"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---


## ノードの追加

### 検索して追加（推奨）

- キャンバス上でダブルクリック → 検索窓に入力
- 欲しいノードをクリック、または矢印キーで選択して `Enter`

検索欄横のアイコンを押すと、フィルターが開きます。データ型や含まれるカスタムノードから絞り込むことができます。

> 右クリックメニューから探す方法は時間がかかるため、ノード名を頑張って覚えましょう

![](https://gyazo.com/b0571db1685d43d84739aeac7559abc8){gyazo=loop}

### メニューから追加

- キャンバス上で右クリック → `Add Node` → ノードを探してクリック

![](https://gyazo.com/ef2cca44a8446a84d9722578e97becbc){gyazo=loop}


### 接続可能なノードから追加

- ピンからドラッグしてキャンバス上で離す
- 検索窓が表示されますが、データ型によるフィルタがかかった状態で表示されます

![](https://gyazo.com/89de8c5d0c26473008ed7b65c6d62f71){gyazo=loop}


### 接続可能なノードから追加 (レガシー)

- ピンからドラッグして**Shiftを押しながら**キャンバス上で離す
- 表示されるリストから選択（表示上限があるため、見つからない場合は `Search` から検索）

![](https://gyazo.com/7fd0db2ee2795630a82eff60f59dc967){gyazo=loop}
---

## ノードの接続

- ピンからピンへドラッグ
- 正確にピンに合わせなくても、ノード上にドラッグするだけで自動的に吸着します。

![](https://gyazo.com/b8d64b7c5ff3ec72eab34d230b18220f){gyazo=loop}

### 接続の変更

- `Shift` を押しながらピンからピンへドラッグ
- 既に接続されているラインがある場合、まとめて繋ぎ直すことができます。

![](https://gyazo.com/bd765ab5d368f0ea62bd9f6752bbd511){gyazo=loop}

---

## ノードの操作

### 選択と移動

- **複数選択**: `Shift` + 左クリック
- **範囲選択**: `Ctrl` + ドラッグ
- **移動**: 選択した状態でドラッグ

![](https://gyazo.com/673e247b4c7f1f785a32a8a66a6e5c24){gyazo=loop}
![](https://gyazo.com/ecdc4bbbba9c87d83599b129a8e0b900){gyazo=loop}
![](https://gyazo.com/3c5b2f417600f8a13f4e0856bb766356){gyazo=loop}

### 削除

- ノードを選択して `Delete` キー
- または右クリック → `Remove`

![](https://gyazo.com/9411b084cc0eaf6bbff44627b0e6e3a4){gyazo=loop}

### コピー & ペースト

- **通常コピー**: `Ctrl + C` → `Ctrl + V`
- **接続を維持してペースト**: `Ctrl + C` → `Ctrl + Shift + V`
- **複製**: `Alt` を押しながらドラッグ

![](https://gyazo.com/998a2fdf2c364abf7f3a3bca42ef2c7c){gyazo=loop}
![](https://gyazo.com/8b101ca29fe83dd8ef755d80feba9179){gyazo=loop}
![](https://gyazo.com/f2ad27c4df3405c005b530ace3af72fb){gyazo=loop}

### 折りたたみ

- ノード左上の `⚫` をクリック
- 折りたたみ中は、新たな接続や解除ができなくなります。

![](https://gyazo.com/cc2fb21c796ea9a872dd9b25fdf317c0){gyazo=loop}

### ピン留め（固定）

ノードを動かないように固定します。

- ノードを選択して `P` キー
- または右クリック → `Pin`（解除は `Unpin`）

![](https://gyazo.com/e18df835c4248220e5c8a0c2d021dacd){gyazo=loop}

### パラメータのリセット

- ノードを右クリック → `Fix node(recreate)`

![](https://gyazo.com/b1fec4d60d74acb79b6ef2c56db4e6ab){gyazo=loop}

---

## Rerouteノード（中継点）

workflowの配線を整理するために使用します。

- **追加**: 右クリック → `Add Node` → `utils` → `Reroute`
- **縦向きに変更**: 右クリック → `Set Vertical`

![](https://gyazo.com/316ead0d575a1635c0bd74c3a5b8c9c2){gyazo=loop}

> **Tip**
> ピンの上で **中クリック** することでも素早く呼び出せます。

![](https://gyazo.com/c928c0d92b853be8feb42cd24cd4f7a8){gyazo=loop}

### ドット型Reroute

- ライン上の点を `Alt + 左クリック`
- またはピンからドラッグしたメニューで `Add Reroute`

![](https://gyazo.com/7dd44ce8cadd4e8468fde2d2c6178ffa){gyazo=loop}

> **Note**
> 通常のRerouteノードとは異なり、単体のノードとしては存在できません。そのため、スイッチのような使い方はできません。

![](https://gyazo.com/524f49b51aab632adf7881507b58a950){gyazo=loop}

---

## バイパスとミュート

### バイパス (Bypass)

そのノードを**無視して**処理を続けます。

- ノードを選択して `Ctrl + B`
- または右クリック → `Bypass`

![](https://gyazo.com/4ab6605bdd97ee8cae5b4403057a38e5){gyazo=loop}

### ミュート (Mute)

そのノードで処理を**停止**します。

- ノードを選択して `Ctrl + M`
- または右クリック → `Mode` → `Never`

> **違いについて**
> - **バイパス**: 「このノードが無かったこと」にして、前後のノードを直結しようとします。
> - **ミュート**: 「ここで行き止まり」にします。
>
> 挙動が少し複雑なので、実際に試してみることをおすすめします。

![](https://gyazo.com/5d96054e7b54a62b3a446a28d70212d6){gyazo=loop}

---

## 外部入力への変換

入力欄（ウィジェット）をピン入力に変換し、他のノードから値を渡せるようにします。

- **変換**: ピンがないパラメータの横にカーソルを持っていくと、接続ポイントが現れます。
- **戻す**: 接続しているラインを外すと、自動的に元の入力欄に戻ります。

![](https://gyazo.com/80e1bb9211082f4d89a2a85d5abd78c2){gyazo=loop}

### Primitiveノード

あらゆる型の入力として使える万能ノードです。接続先の型に合わせて動的に変化します。

![](https://i.gyazo.com/e0a056e9c112028930466701e22afd10.gif){gyazo=image}

> **Tip**
> ピンを **ダブルクリック** すると、その型に合ったPrimitiveノードが自動的に接続されます。

![](https://gyazo.com/35f00ebec3fab7b0471b5595b4b0a5e5){gyazo=loop}



