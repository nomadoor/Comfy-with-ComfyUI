---
layout: page.njk
lang: ja
section: ai-capabilities
slug: frame-interpolation
navId: frame-interpolation
title: フレーム補間
summary: 動画をなめらかにしたり、離れたフレーム同士をつなぐ技術
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: 'https://github.com/google-research/frame-interpolation/raw/main/moment.gif'
---

## フレーム補間とは？

**フレーム補間（Video Frame Interpolation / VFI）** は、動画のフレームとフレームの間に新しいフレームを差し込み、動きをなめらかに見せるための技術です。

昔のカクカクした動画を滑らかにしたり、スローモーションで下がったfpsを補ったりする用途で、かなり昔から使われています。

また、動画生成AIの登場によって、**ジェネレーティブフレーム補間** という、単なるFPS補間以上の技術も生まれています。

---

## fpsを上げるためのフレーム補間（古典的VFI）

一般的なVFIは、時間的に近い2枚のフレーム（0.1秒未満程度）を受け取り、その間に挟まる「中間フレーム」を1枚以上生成します。これを繰り返すことで、動画全体のフレーム数を増やします。


![](https://gyazo.com/af7273352979b5286d8f85a9b6915ab6.png){gyazo=image}

[](/workflows/ai-capabilities/frame-interpolation/VFI_GMFSS.json)

[FILM](https://github.com/google-research/frame-interpolation)やGMFSSなど、様々な補完手法が存在します。

---

## Generative interpolation（FLF2V）

従来のフレーム補間は「ほとんど変化のない隣り合うフレーム同士」をつなぐものでした。

最近はそこから一歩進んで、**1秒以上離れたフレームの間を、動画生成モデルの力で埋める**タイプの技術が登場しています。

![](https://gyazo.com/669467e658bbd5cd9e03207a5ccd1faa.gif){gyazo=image}

[](/workflows/ai-capabilities/frame-interpolation/tooncrafter_interp.json)

二枚の画像を渡すと、その間に **「ストーリーを持った動き」** を作りながらつないでくれます。

単純な直線補間ではなく、「途中で何が起きるか」もある程度AIが作るため、モーフィングというより「短いストーリーのある動画」に近づいていきます。

ToonCrafterはこの系統の初期のモデルですが、新しい動画モデルが出るたびに桁違いに自然なFLF2Vモデルが出てくるため、今使う意味はほとんどありません。

---

## Extension

ここまでのフレーム補間は、「隣り合うペアごとに独立して処理する」ものでした。  
3 枚以上の入力フレームがあっても、以下のようにそれぞれは2枚のフレーム補間を繰り返していただけです。

- 1–2 枚目の間を埋める…
- 2–3 枚目の間を埋める…
- 3–4 枚目の間を埋める…

![](https://gyazo.com/356c0e45a7ccf73ace4714f84ccc30fa.gif){gyazo=loop}

VACE の**Extension**は、ここから一段発展しています。

従来のVFIが「隣の2枚の間だけを見る」のに対して、Extensionは一つの動画全体に対して複数のキーフレームを配置し、その間全体を生成モデル側でつなぎます。

例えば、81フレームの動画を生成するとしましょう。
そのうち何フレームかに「キーフレーム」を差し込みます。モデルは、そのキーフレーム同士を**同じ時間軸の中で**自然につなぐように動画を生成します。

![](https://gyazo.com/1bd83bd9c5258b25ce9016917516a526.gif){gyazo=image}

FLF2Vと比べ、遥かに自然な動画が生成されます。おそらく、今後はExtensionのような技術が主流になるでしょう。
