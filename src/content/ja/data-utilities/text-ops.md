---
layout: page.njk
lang: ja
section: data-utilities
slug: text-ops
navId: text-ops
title: "テキスト操作"
summary: "テキストを操作するノードについて"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## テキストの操作

![](https://i.gyazo.com/8731cc3b1bd685d83a13d37ffc0617ed.png){gyazo=image}

ComfyUIでは、主にプロンプトとしてテキストを扱います。
文字列の一部を置き換えたり、LLMが作成したプロンプトにトリガーワードをくっつけたりと、いくつかの操作を自動化することでワークフローがより便利になります。


## stringとは？

プログラミングの世界では、テキストを数字などと区別するために **string（ストリング）** と呼びます。

- `apple` → 5文字のstring
- `123` → 数字に見えるけど、実際は文字として扱うstring
- `" "` (空白) → 見えないけど、1文字のstring

---

## 基本的な操作ノード

### 文字を入力する

![](https://i.gyazo.com/7669da6621b5fcb5b7cc0c539f4d5af7.png){gyazo=image}

文字列を入力するノードとして **String** ノードと **String (Multiline)** ノードなどが用意されています。

Multilineは単に改行ができるようになったものです。

### 文字をつなげる

複数のstringをつなげてひとつにまとめます。
（例：`apple` + `pen` → `applepen`）

![](https://i.gyazo.com/a20e6df7b2f65bf71d42c2070f79c726.png){gyazo=image}

- **Concatenateノード**
  - `delimiter` は区切り文字のことです。好きなものが使用できます（カンマや改行など）。

### 文字を置き換える

指定した文字を別の文字に置き換えます。
（例：`apple pen` → `orange pen`）

![](https://i.gyazo.com/db1e540470805d5888a9c90b1381fa44.png){gyazo=image}

- **Replaceノード**

### 文字の一部を切り出す

指定した範囲の文字を抽出します。
（例：`apple` → `ppl`）

![](https://i.gyazo.com/ab158488e388004f441a2258379c7930.png){gyazo=image}

- **Substringノード**
  - `start` 番目から `end` 番目までの文字列を切り出します。

### 余計な空白を消す

文字列の前後にあるスペースを削除します。
（例：` apple ` → `apple`）

![](https://i.gyazo.com/1b83d39d165c117f05e1d28ca88957ee.png){gyazo=image}

- **Trimノード**
  - ユーザー入力などで意図しない空白が入ってエラーになるのを防げるため、地味ですが重要です。

### 文字数を調べる

文字の長さをカウントします。
（例：`apple` → `5`）

![](https://i.gyazo.com/cd8d1001ddaf646c85f31bfbf7df61fb.png){gyazo=image}

- **Lengthノード**
  - スペースや改行も1文字としてカウントされます。
  - 出力は **int型（数値）** になります。

---

## 高度な操作（正規表現）

「正規表現（Regex）」という記述ルールを使って、複雑な検索や置換を行います。

### 正規表現で抽出する

![](https://i.gyazo.com/ad16cc24b76fdffe4ed4adfd84a48563.png){gyazo=image}

- **Regex Extractノード**

### 正規表現で置き換える

![](https://i.gyazo.com/8f469774411a0096e3725a090fe41d9d.png){gyazo=image}

- **Regex Replaceノード**

---

## Power Puter (rgthree)

[単純な計算](/ja/data-utilities/simple-math/) で使った [rgthree-comfy](https://github.com/rgthree/rgthree-comfy) の`Power Puter` ですが、stringの入力・出力も可能なため、上記のテキスト処理を含め柔軟に文字列の操作をすることができます。

- [Node: Power Puter (Wiki)](https://github.com/rgthree/rgthree-comfy/wiki/Node:-Power-Puter)

![](https://i.gyazo.com/c6fd4f1e69b293da19f84963fa1e3ac1.png){gyazo=image}

[](/workflows/data-utilities/text-ops/Power_Puter_(rgthree)_Replace.json)