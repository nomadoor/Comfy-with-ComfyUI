---
layout: page.njk
lang: ja
section: data-utilities
slug: simple-math
navId: simple-math
title: "単純な計算"
summary: "四則演算など、基本的な計算を行うノードについて"

permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 単純な計算

画像のサイズを綺麗に半分にしたり、バッチサイズを調整したりと、単純な四則演算をする場面はしばしばあります。
そのためのノードを見ていきましょう。

## おすすめのカスタムノード

単純な機能なので、これを実装するものは探せばいくらでもありますが、以下のどちらかのカスタムノードがあれば十分です。(コアノードとして実装されるといいんですがね…)

- **[ComfyUI_essentials](https://github.com/cubiq/ComfyUI_essentials)**
  - 優れたノードなのですが、ほぼアーカイブ状態であるため、優れたノードが見つかれば差し替えます。
- **[ComfyUI-Custom-Scripts](https://github.com/pythongosssss/ComfyUI-Custom-Scripts)**

ここでは、**ComfyUI_essentials**の **Simple Math**ノード を例に解説します。

---

## Simple Math

![](https://gyazo.com/02da3cbf7851b49c8ba18326cda16d3c){gyazo=image}

[](/workflows/data-utilities/simple-math/Simple_Math.json)

`a`, `b`, `c` にそれぞれ数値を入れられます。
その変数を利用して、`a * b - c` のように書けば、単純に算数を行うことができます。

また、これはPythonの式をそのまま使ったものなので、もう少し高度な計算も行えます。

```python
a // b       # 整数除算（小数点以下切り捨て）
a % b        # 剰余（割り算の余り）
a ** b       # 累乗（べき乗）
(a + b) * c  # 括弧で優先順位を指定

abs(a - b)   # 絶対値を求める
min(a, b)    # 最小値を返す
max(a, b)    # 最大値を返す
round(a / b) # 四捨五入

(a > b) * 1  # 論理式：条件を数値化（a > bなら1, そうでなければ0）
(a == b) * 1 # 論理式：等しいかどうか判定
(a != b) * 1 # 論理式：異なるかどうか判定
```

---

## int型とfloat型

数字には「型（タイプ）」があります。
ComfyUIでは主に **`int`** と **`float`** の2種類を使います。

- **int型**：整数のみ（例：`512`, `32`, `1`）
  - バッチサイズや画像の解像度など
- **float型**：小数を扱える（例：`0.7`, `1.5`, `24.0`）
  - KSamplerのstrengthや動画のfpsなど

適切な型で入出力しないとノードに接続できません。
「全部floatでええやん」というツッコミが聞こえてきそうですが、計算の効率や精度のために区別されているんですね…慣れてしまいましょう。

### 型の変換

ちなみに、値を一度 `Simple Math` ノードに通すと、`int` ↔ `float` の変換を行えます。

入力がfloatでも、出力先がintなら自動的に変換してくれます。

![](https://gyazo.com/2265cc54a515359586944c94f258df50){gyazo=image}

[](/workflows/data-utilities/simple-math/Simple_Math_FloatInt.json)

---

## 【小技】入力欄での簡易計算

ノードを使うほどでもない簡単な計算なら、入力欄で直接計算式を書くと、計算された値が入力されます。

![](https://gyazo.com/a285ddb6cb86d6a0e8d3a58766afe51e){gyazo=image}

---

## Power Puter (rgthree)

**[rgthree-comfy](https://github.com/rgthree/rgthree-comfy)** で追加される `Power Puter` を使うと、画像のサイズを取得できたりif文が使えたりと、もはやほぼプログラミングですが、より複雑な処理をすることができます。

- [Node: Power Puter (Wiki)](https://github.com/rgthree/rgthree-comfy/wiki/Node:-Power-Puter)

![](https://gyazo.com/20c5f92d6ef1e7057c6d42e2065d84b1){gyazo=image}

[](/workflows/data-utilities/simple-math/Power_Puter.json)