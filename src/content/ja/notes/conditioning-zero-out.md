---
layout: page.njk
lang: ja
section: notes
slug: conditioning-zero-out
navId: conditioning-zero-out
title: "Conditioning Zero Out ってなに？"
created: 2026-09-28
updated: 2026-09-28
noteTags: ["faq", "conditioning", "cfg"]
summary: "CFG 1.0 の workflow で Conditioning Zero Out を使う理由"
seoTitle: "Conditioning Zero Outとは？ CFG 1.0で使う理由"
seoDescription: "最近のworkflowでよく見るConditioning Zero Outノードの役割。CFG 1.0でnegativeが無視される理由と、positiveや空のプロンプトをつなぐ方法との違い、Zero Outを使う利点を解説します。"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: "/media/notes/conditioning-zero-out/conditioning_zero_out_hero.png"
---

![](/media/notes/conditioning-zero-out/conditioning_zero_out_hero.png){media=image}

最近の workflow では、`Conditioning Zero Out` というノードをちょくちょく見かけます。

これは、一体なんなんだ！

一言でいうと、**CFG 1.0 のとき、使われない `negative` 入力を埋めておくためのノード**です。

なぜそんなものが必要なのか、順番に見ていきましょう。

## CFG 1.0 では Negative が無視される

[CFG](/ja/ai-capabilities/cfg/) の計算式をシンプルに書くと、こうなっています。

```text
output = negative + CFG × (positive - negative)
```

ここに CFG 1.0 を入れると、

```text
output = negative + 1.0 × (positive - negative)
       = positive
```

Negative が綺麗に消えましたね。

つまり CFG 1.0 では、Negative に何を入れても結果は変わりません。

そのかわり、Negative 側の計算をまるごと省けるので、生成がかなり速くなります。嬉しい。

最近のモデルの多くは、CFG 1.0 でも綺麗に生成できるように学習されています（CFG 蒸留）。そのため、CFG 1.0 で使う workflow が増えているんですね。

## でも KSampler には negative 入力がある

CFG 1.0 なら Negative は使われない。

なのに、`KSampler` には普通に `negative` 入力があり、ここに何かつながないとエラーになります。

生成には使わないのに、とりあえず何かしらの conditioning をつないでおく必要があるのです。

どうせ無視されるので、何をつないでも結果は同じです。いくつか方法を見てみましょう。

### Positive をそのままつなぐ

一番シンプルなのは、Positive Prompt の conditioning を、そのまま `negative` にも入れてしまうことです。

![](/media/notes/conditioning-zero-out/krea2_positive_as_negative.png){media=image}

[](/workflows/notes/conditioning-zero-out/krea2_positive_as_negative.json)

これでも問題なく動きます。

ただ、workflow としてはちょっと気持ち悪いですね。初心者の方が見たら、

「なんで negative に positive が入っているんだ？」

と思うことでしょう。

しかもこの方法には、もう一つ変なところがあります。

`negative` に `positive` と同じものを入れると、

```text
output = positive + CFG × (positive - positive)
       = positive + CFG × 0
       = positive
```

となり、CFG をいくつにしても結果が変わりません。

CFG 1.0 で使う前提なら問題ないのですが、あとから CFG を上げてみても、何も起きないのは少し混乱しそうです。

### 空のプロンプトをつなぐ

別の方法として、`CLIP Text Encode` を空のままにして、その conditioning を `negative` へつないでみましょう。

![](/media/notes/conditioning-zero-out/krea2_empty_negative_prompt.png){media=image}

[](/workflows/notes/conditioning-zero-out/krea2_empty_negative_prompt.json)

こちらは見た目的には分かりやすいですね。

ただし、どうせ使われない conditioning を作るためだけに、Text Encoder をもう一度動かしています。

大きな負荷ではないにせよ、使わないもののために処理を増やすのは少し勿体ない。

## そこで Conditioning Zero Out

そこで便利なのが `Conditioning Zero Out` です。

入力した conditioning の中身を、全部 0 に置き換えるだけのノードです。

![](/media/notes/conditioning-zero-out/krea2_conditioning_zero_out.png){media=image}

[](/workflows/notes/conditioning-zero-out/krea2_conditioning_zero_out.json)

CFG 1.0 なら、当然さっきと同じ生成結果になります。

そのうえで、

- Negative 用に Text Encoder をもう一度動かす必要がない
- 「Negative には意味のないものを入れている」という意図が、見た目で伝わる
- Positive を流用する方法と違い、CFG を上げればちゃんと結果が変わる

と、いいとこ取りなんですね。

## 空のプロンプトと Zero Out の違い

空のプロンプトと `Conditioning Zero Out`。

なんとなく同じもののような気がしますが、作られるデータはまったく違います。

実際に ComfyUI で中身を見てみましょう。

![](/media/notes/conditioning-zero-out/clip_text_encoder_conditioning_zero_out.png){media=image}

`Hello!` というプロンプトから作った conditioning には、当然いろいろな数値が入っています。

`Conditioning Zero Out` は、この数値を全部 0 に置き換えます。

では、空のプロンプトはどうでしょう。

![](/media/notes/conditioning-zero-out/clip_text_encoder_empty.png){media=image}

全部 0 にはなりません。

何も書いていないなら何もない conditioning になりそうですが、Text Encoder にとっては「何も書かれていない文章」にも、それなりの意味があるんですね。

CFG 1.0 なら Negative そのものが使われないので、どちらを使っても生成結果は同じです。

が、CFG を 1.0 より大きくすると結果は変わってくるので、そこだけは注意です。

