---
layout: page.njk
lang: ja
section: data-utilities
slug: queue
navId: queue
title: "Queue (キュー)"
summary: "処理の予約と回数指定実行について"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## Queue とは？

Queue(キュー)は実行したい処理を順番に並べておく仕組みです。

現在の処理が終了すると、Queue に積まれた次の処理が自動で実行されます。

---

## ComfyUI での Queue の基本

![](https://i.gyazo.com/5831e4d69bd26c7d5a533fb5781a33ad.png){gyazo=image}

ComfyUI の `▷ Run` ボタンは見た目こそ「実行」に見えますが、実際は **Queue に 1 件予約を追加するボタン** です。`▷ Run` を押した瞬間に生成が始まるのは、予約がそのまま先頭に入り、即時に実行されるためです。

サイドバーの`Queue`を開いて、`▷ Run`を連続して押してみましょう。
Queueが追加されていくのが見られるはずです。

---

## Queue を積む（予約する）方法

### 1. 処理中にそのまま Run を押す

もっともシンプルな方法です。
同じ workflow をもう一度実行したい場合に、すぐ続けて Queue に追加できます。

![](https://gyazo.com/0680d8d1d2ff86a81f15a81085af35a9){gyazo=loop}

ComfyUI は処理エンジンが 1 つのため、

- 別タブ
- 別 workflow

から `▷ Run` を押しても、すべて同じ Queue に並びます。

### 2. Run 横の数字を増やして連続実行

![](https://i.gyazo.com/5831e4d69bd26c7d5a533fb5781a33ad.png){gyazo=image}

`▷ Run` ボタンの横にある数字を変更すると、その回数分まとめて Queue に積むことができます。
同じ設定で複数枚をつくりたいときに便利です。

---

## Control After Generate

`INT` 型のパラメータ（例: `KSampler` の `seed` など）には、生成後に値を変えるオプションがあります。

![](https://gyazo.com/3f0dd7eb5dde53d648a2fe2c49d41324){gyazo=loop}

Queue と併用すると、**毎回値を変えながら連続生成する** といった応用ができます。

- `fixed`：値を変えない
- `increment`：1 増やす
- `decrement`：1 減らす
- `randomize`：毎回ランダム


シードガチャのように毎回違う結果を試したい場合は `randomize`、
seed を固定して他のパラメータの比較をしたい場合は `fixed` を使います。

> このサイトのworkflowは再現性のため、ほとんど `fixed` を使用しています。

---

## Queue の操作

### 予約を追加する

- `▷ Run`をクリック
- 横の数字を上げれば、その回数ぶんまとめて積むことができます。

### 現在進行中のジョブを止める

実行中のジョブだけを停止します。
Queue に積まれた “これからの予約” は残ります。

![](https://gyazo.com/a7d76a9fee8c00efeddb0f454528c8d6){gyazo=loop}

- `❌️ (Cancel Current Run)` をクリック

現在実行中のジョブだけが停止します。
Queue に並んでいる “これからの予約” はそのまま残ります。

### 予約されているタスクを消す

![](https://gyazo.com/b4d1229ca875c9fd5cbbde0dfbf47fc6){gyazo=loop}

1 件だけ消したい場合
- サイドバーの Queue で対象を右クリック → Delete

未実行の予約をまとめて消したい場合
- `🔳 (Clear Pending Tasks)` をクリック
- Queue に残っているタスク（未実行分）を一括削除できます


---


## 過去の処理を確認する

![](https://gyazo.com/3db298a7968024f5c06db82ee194d0c9){gyazo=loop}

サイドバーの`Queue`を開くと、過去の処理履歴が確認できます。
ここから過去のworkflowを読み込むことも出来ます。