---
layout: page.njk
lang: ja
section: data-utilities
slug: conditional-branching
navId: conditional-branching
title: "条件分岐"
created: 2026-05-28
updated: 2026-05-29
summary: "Switch や Boolean を使って、workflow の流れを切り替える方法"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

ComfyUI はノードベースプログラミングと呼ばれることがありますが、基本的には、モデルやプロンプトを KSampler に入れると画像が出力されるだけの、一本道でシンプルなものです。

しかし、少し複雑なパイプラインを組みたいときもあります。

- 入力画像が小さければアップスケール処理を挟む。
- 画像を解析して、手が崩れていそうなら後処理を入れる。
- プロンプトに特定の文字が含まれていたら、別のモデルや設定に切り替える
- …

このような「条件によって処理を変える」仕組みを、プログラミングでは条件分岐と呼びますが、ComfyUI にも、この条件分岐に近いことをするための基本的なノードがあります。

## 条件分岐の基本

![](https://gyazo.com/42e0cbeb5ce32694423b50de55885358){gyazo=image}

[](/workflows/data-utilities/conditional-branching/Switch.json)

### Switch で切り替える

条件分岐の基本になるのは **Switch ノード** です。

2 つ入力のうち、どちらを出力するかを切り替えるものです。

これを使えば、条件が合っているときは `a`、そうでないときは `b` を出力する、という使い方ができそうです。

### Switch には Boolean を渡す

Switch において、2 つの入力のうち、どちらを出力するのか決めるための値が **Boolean** です。

Boolean は、`true` か `false`（0 or 1）のどちらかしか持たないシンプルな型で、トグルスイッチのようなものです。

もちろん手動でポチポチしても切り替えられますが、それでは面白くないですね。

プログラミング的に処理を切り替えるというのは、つまり、この Boolean をどのように作るか？という話になってきます。

---

## Boolean を作る方法

プログラミングの世界では、Boolean を作る方法はいくらでもありますが、ここでは、ComfyUI のコアノードで扱える、汎用的なものをいくつか見てみましょう。

### Math Expression

[単純な計算](/ja/data-utilities/simple-math/) でも使ったものですが、このノードを使えば、数値を比べて Boolean を作ることができます。

例えば以下のように書いてみましょう。

![](https://gyazo.com/78cde905a66746c303948be75f9b02c6){gyazo=image}

[](/workflows/data-utilities/conditional-branching/Math_Expression.json)

```python
a == 20
```

a に `18` や `20` といった数値を入力した `int` ノードを繋いでみましょう。
ご覧の通り、`20` つまり、設定した値と同じになったときだけ、`true` と表示されますね。

もっとたくさんの数値、変数を使うこともできます。

```python
0 < a <= b * 100
```

この式なら、`a` が `0` より大きく、`b * 100` 以下のとき `true` になります。

他にも以下のような比較演算子が使えますね。

```python
a == b  # 等しい
a != b  # 等しくない
a > b   # a が b より大きい
a >= b  # a が b 以上
a < b   # a が b より小さい
a <= b  # a が b 以下
```

### Compare Text

文字列から Boolean を作るには、`Compare Text` ノードが使えます。

機能はかなりシンプルで、2 つの string を比較し、その結果を Boolean として出力します。

たとえば、入力されたテキストが `Hello` と一致するか、`Hello` から始まっているか / 終わっているか、といった判定ができます。

![](https://gyazo.com/d0c09611404d536c589fb34a690152e8){gyazo=image}

[](/workflows/data-utilities/conditional-branching/Compare_Text.json)

`string_a` と `string_b` を比較し、条件に合っていれば `true`、合っていなければ `false` を出力します。

- `mode`
  - `Starts With`: `string_a` が `string_b` から始まっているか
  - `Ends With`: `string_a` が `string_b` で終わっているか
  - `Equal`: `string_a` と `string_b` が同じか
- `case_sensitive` を `true` にすると、大文字・小文字を区別します。

### MLLM

少しリッチな方法ですが、MLLM を使って、Boolean を作り出すこともできます。

Boolean というのは `true` / `false` で表現される、という話をしましたが、実はこれは数字の `1` / `0` でも良いのです。

つまり、MLLM に対して、`「〇〇だったら 1、そうでないときは 0 と出力して」` といえば、それを Boolean に変換することができるんですね。

![](https://gyazo.com/09299f1fde08831664593c6f0b4c0d5e){gyazo=image}

[](/workflows/data-utilities/conditional-branching/Qwen3.5_4b.json)

- ここでは `TextGenerate` ノードを使い、Qwen 3.5 4B を使用しています。
- 少しややこしいですが、MLLM の出力はテキスト、つまり `string` なので、それを `int` に変換し、それをさらに `Boolean` に直します。

MLLM を使うと、単なる数値やテキスト比較に比べて、遥かに柔軟で複雑なことができます。

- この画像に映っている人の人数は？
- このプロンプトに合うのはアニメ系モデル？実写系モデル？
- 出力画像の品質は良い？悪い？

---

## 複数条件を組み合わせる

「画像の高さが 1000px 以上 **かつ** 横幅が 500px 未満」というように、複数の条件を組み合わせたい場合があります。

そのような場面で使うのが **論理演算子** です。

### AND / OR / NOT

論理演算子には `AND` / `OR` / `NOT` の三種類があります。

複数の Boolean 入力があったとき、その組み合わせによって `true` か `false` を出力します。

![](https://gyazo.com/e7730a6112a0820ab0a65b4371f7e70b){gyazo=image}

[](/workflows/data-utilities/conditional-branching/AND_OR_NOT.json)

- **AND**: 全てが `true` のときだけ `true`
- **OR**: どれかが `true` なら `true`
- **NOT**: `true` と `false` を反転する

もちろん、これらは組み合わせても構いません。

AND に NOT を組み合わせれば、2 つの入力が `true` のとき、`false` を出力する、なんてことができるわけですね。

難しく考える必要はありません。実際に使って動きを見てみましょう。

---

## 実践例

### 画像が縦長なら 90 度回転

![](https://gyazo.com/b6b8471813b62a487bf91519a04f7279){gyazo=image}

[](/workflows/data-utilities/conditional-branching/Rotate_If_Portrait.json)

1. `Get Image Size` で画像のサイズを取得
2. 縦長のときは、`width < height` が `true` になります
3. `true` のとき、入力画像を `Rotate Image` で回転させたものを出力します

### 女性が映っていれば男性に変える

女性が映っていれば男性に変え、それ以外の場合は人物をすべて消します。

![](https://gyazo.com/cf499e4e4ed79b91d0020220c854d4ea){gyazo=image}

[](/workflows/data-utilities/conditional-branching/Switch_MLLM_Flux.2-Klein-9B.json)

1. MLLM に画像を見せて、女性が映っていれば `1`、そうでなければ `0` を出力させます
2. `true` のときは、女性を男性に変えるプロンプト、`false` のときは、人物を除去するプロンプトに切り替えます
3. 画像とプロンプトを Flux.2 Klein 9B に渡し、画像編集させます
