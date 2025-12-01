---
layout: page.njk
lang: ja
section: ai-capabilities
slug: lineart-colorization
navId: lineart-colorization
title: "線画着色"
summary: "線画に色を塗る技術"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 線画着色とは？

線画に色を付けるタスクです。

すでに自分で線画を描ける人にとっては、0からのtext2imageよりも、「自分の線画をどう塗らせるか」のほうが重要になることも多いと思います。

---

## ControlNetによる線画着色

ControlNet Canny（edge）を使用すれば、入力した線画はおおむね保持したまま、そこに色を塗ることができます。

![](https://gyazo.com/7e1ed10e17831b224bc547a8d6b3deea){gyazo=image}

[](/workflows/ai-capabilities/line-art-coloring/Flux_ControlNet-Union.json)

線画（もしくはエッジ抽出結果）をControlNetに渡し、テキストプロンプトで服装や色、雰囲気を指定します。

---

## 指示ベース画像編集での線画着色

指示ベース画像編集モデルに、線画をそのまま渡して塗らせることもできます。

![](https://gyazo.com/18b33d684675ffa56b3b805a9f56791a){gyazo=image}

[](/workflows/ai-capabilities/line-art-coloring/Qwen-Image-Edit-2509.json)

入力画像に線画を与え、「この線画をフルカラーで塗って」「アニメ塗りで彩色して」などとテキストで指示するだけです。

---

## 参照ベースの色付け（線画＋カラー画像）

「この線画を、このキャラと同じ配色で塗りたい」「この一枚絵の色使いを借りたい」といった場合は、参照画像ベースの色付けが使えます。

ControlNet（lineart / animeなど）で線画の形・構図を固定し、IP-Adapterなどの参照画像アダプタでカラーイラストや写真を渡して、配色や質感・画風を寄せます。

指示ベース画像編集モデルでも、マルチリファレンスに対応しているものは、「画像2を参考に画像1の線画を塗ってほしい」といった指定ができるものもあります。

---

## 余談

実際の絵描きのワークフローは、「下塗り → 影 → 仕上げ」のように、もう少し段階を踏みます。

着色に限りませんが、AIはいきなり完成品を作るのは得意でも、人間のように徐々に絵を描いていくことはあまり得意ではありません。

私が日本人なので多少贔屓しますが、[Copainter](https://www.copainter.ai/ja)のような商用サービスからコミュニティのLoRAまで、日本ではこの手の研究・実装がかなり盛んです。