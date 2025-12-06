---
layout: page.njk
lang: ja
slug: sd15-image2image
navId: sd15-image2image
title: "image2image"
summary: "Stable Diffusion 1.5で学ぶimage2image"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: ""
---

## image2imageとは？

![](https://gyazo.com/bbb1bca709f4a0b20735da8222d6e3f9){gyazo=image}

image2imageは **参考画像を下書きにして、その上から絵を描いてもらう** 方法です。

下書きにするといっても、完璧にトレスしてしまったらただのコピーです。なんのオリジナリティもありません。

そこで、元の画像が分かる程度にノイズを追加してから、ノイズを除去することで、元画像の構図や雰囲気はほどよく引き継ぎつつ、プロンプトに沿った別バージョンの絵を描いてもらいましょう。

---

## image2imageの仕組み

ここでもう一度、拡散モデルとSamplingのおさらいです。  
ComfyUIでは、KSamplerがまず「空の latent」をノイズで埋め、そこから少しずつノイズを取り除くことで画像を生成していました。

image2imageでは、この「空の latent」を**参照画像をエンコードした latent**に置き換えます。そして、**どの時点からノイズを足し始めるか**を `start_at_step` で調整します。

では、`steps: 20` の KSampler (Advanced) で `start_at_step` を変えてみたときの様子を見てみましょう。

{% mediaRow img="https://gyazo.com/9068f8b11d1798b5aef16930565aa97c{gyazo=image}", width=50, align="left" %}
**start_at_step: 0**
- 最初からノイズで埋められます。
- 下書きの画像は全く見えません。ほぼ通常のtext2imageと同じです。
- > ※Stable Diffusion 1.5に限り少し挙動が違います。  
 → [denoise 1.0のときのimage2imageとtext2image](#denoise-1-0のときのimage2imageとtext2image)
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/9e4a63492f71b4f31e4efa761999c772{gyazo=image}", width=50, align="left" %}
**start_at_step: 1**
- 1step進んだ場所からスタートします。
- そのため、下書きに追加されるノイズの量（＝これから除去するノイズ量）が少し減ります。
- とはいえ、まだ下書きの画像はほとんど見えません。
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/2f5da8a9b3c1cdc017149a7c63fa7678{gyazo=image}", width=50, align="left" %}
**start_at_step: 9**
- 下書きに追加されるノイズの量（＝これから除去するノイズ量）がかなり減ります。
- 下書きの輪郭や構図が、そのまま分かる程度に残っています
{% endmediaRow %}



{% mediaRow img="https://gyazo.com/26906eaf7dfc00de20c1f265be4feff9{gyazo=image}", width=50, align="left" %}
**start_at_step: 20**
- 20ステップあるうち、最後のステップから始める指定なので、実質「何もしない」のと同じです。
- つまり、実際には一切サンプリングせず、ノイズも追加されません。
- そのため、入力した画像がそのまま出力されます。
{% endmediaRow %}

このように、`start_at_step` を `1 ~ (steps - 1)` のどこかに設定すると、元の絵を残しつつサンプリングしている状態になります。

これを **image2image** と呼びます。

---

## KSampler (Advanced)でのworkflow

![](https://gyazo.com/e5ff6f57deb2d62f568cb8897eb41355){gyazo=image}

[](/workflows/basic-workflows/sd15-image2image/SD1.5_image2image_KSampler_(Advanced).json)

- 🟩VAE Encodeノードで、画像をlatentに変換します。
- 🟨`start_at_step`の値を変更して、元の画像をどれくらい残すか、いろいろ試してみてください。

---

## KSamplerでのworkflow

無印 KSampler でも、もちろん image2image はできます。  
ただし、**「どのつまみで元画像の残り具合を決めるか」** が、KSampler (Advanced) とかなり違います。

![](https://gyazo.com/41975fb8a105170ea9d8a9dbbd48b5dd){gyazo=image}

[](/workflows/basic-workflows/sd15-image2image/SD1.5_image2image_KSampler.json)

- 🟪`denoise`の値を変更して、元の画像をどれくらい残すかを設定します。
  - `1.0`では完全にノイズで埋めます。つまりtext2imageと同じです。
  - `0.0`ではノイズを一切追加しないので、元の画像がそのまま出力されます。

---

## 無印と Advanced の違い

ここで、KSampler (Advanced) と見比べてみます。

やりたいこと自体は同じで、どちらも **「元画像にどれくらいノイズを足してから、どれくらい除去するか」** を調整しています。

ただ、つまみの割り当て方が違うため少し混乱します。同じ結果になりそうな設定でそれぞれの挙動を見てみましょう。

{% mediaRow img="https://gyazo.com/e38909e3a90797d5b6aba273df2b97ca{gyazo=image}", width=50, align="left" %}
**KSampler (Advanced)**
- 例えば `steps: 20`, `start_at_step: 4` とすると、  
  「全体 20 ステップのうち、4 ステップ目から 20 ステップ目まで」だけを実行します。
- 実際にサンプリングされる回数は **20 - 4 = 16 回** です。
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/b3bd1f3ffe6b83d34ce52fbe27958768{gyazo=image}", width=50, align="left" %}
**無印 KSampler**
- 同じく `steps: 20` にして、`denoise: 0.8` などと設定すると、見た目の「ノイズのかかり方」は近くなりますが、**サンプリング回数は 20 回のまま** です。
- `denoise` の値を 0.5 に変えても 0.1 に変えても、やはり 20 回サンプリングします。
{% endmediaRow %}


- **Advanced**
  - `steps` は「全体のステップ数」、`start_at_step` 以降だけ実行 → 実行回数が変わる  
- **無印**
  - `steps` は「実際の実行回数」、`denoise` はノイズの強さだけを変える → 実行回数は変わらない  

もし、無印KSamplerで Advanced に「近いノイズのかかり方」にしたい場合、以下の式がざっくりした目安になります。（完全に一致はしません）
```
設定するstep数 ≒ 全体のstep数 * denoise
```

### 別に気にしなくていい

ここまでしっかり説明しておいてなんですが、どちらも **「元画像にどれくらいノイズを足すか」** を決めているだけです。

無印KSamplerとAdvancedを混在させる場合は注意が必要ですが、そんなworkflowを組む人はいないので、気にする必要はありません。

どのパラメータを変更すれば、どの程度の元の画像が残るかがわかっていればOKです。

---

## denoise 1.0のときのimage2imageとtext2image

`denoise: 1.0`の時、元の画像をノイズで完全に埋めてしまうので、仕組み的にはimage2imageも`Empty Latent Image`ノードを使ったtext2imageも同じになるはずです。

![](https://gyazo.com/aae8ea31ec753bc12053ae1d6b701179){gyazo=image}

が、**Stable Diffusion 1.5だと同じになりません**。（実装の違いだと思いますが、理解していないのでわかりません。）  
一方で、最近のモデル(Flux等)では、全く同じ画像になります。

Stable Diffusion 1.5は特殊な例として、このサイトでは、本来の設計どおり **「denoise 1.0 の image2image と text2image は同じもの」** として扱っていきます。

---

## サンプル画像

![](https://gyazo.com/1f5fee22e1db9942bf950cf39906c881){gyazo=image}