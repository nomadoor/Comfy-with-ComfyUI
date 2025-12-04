---
layout: page.njk
lang: ja
slug: sd15-text2image
navId: sd15-text2image
title: "text2image"
summary: "Stable Diffusion 1.5でのtext2image"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  gradient:
  image: ""
---

## text2image

テキストプロンプトを入力して、画像を生成します。

より本質的にいえば、**テキストプロンプトという条件** で拡散モデルを制御します。



## mediaRow サンプル（Gyazo対応）

左に画像・右に本文（デフォルト 33%）

{% mediaRow img="https://gyazo.com/e19dc759345f54e3115ca7518c5af7e7 {gyazo=image}", width=33, align="left" %}
**出力例**
- Positive: `1girl, masterpiece, best quality`
- Negative: `text, watermark`
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/a573409de28653a2cf68d6d86bf3e17c {gyazo=image}", width=33, align="left" %}
テスト

**出力例**
- Positive: `1girl, masterpiece, best quality`
- Negative: `text, watermark`
- Negative: `text, watermark`
- Negative: `text, watermark`
- Negative: `text, watermark`
{% endmediaRow %}


{% mediaRow img="https://gyazo.com/849df23b6647401ff5849d09bbb8d80c {gyazo=player}",align="left" %}
**出力例**
- Positive: `...`
- Negative: `...`
{% endmediaRow %}



{% mediaRow img="https://gyazo.com/b38439d333755e724f174fa774f74f71 {gyazo=loop}", width=33, align="right" %}
**出力例**
- Positive: `...`
- Negative: `...`
{% endmediaRow %}


右に画像を寄せたい場合


補足
- `width` はパーセンテージ（省略時 33）
- 画像は Gyazo でも通常画像でもOK。`createImageVariants` が効くので CLS を抑制
- スマホでは自動で縦並びになります
