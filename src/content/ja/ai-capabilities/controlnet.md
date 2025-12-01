---
layout: page.njk
lang: ja
section: ai-capabilities
slug: controlnet
navId: controlnet
title: ControlNet系
summary: ポーズや線画などの追加情報で画像生成をコントロールする技術
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: https://i.gyazo.com/374d9112c26cc1098d9e7e11b5ca49fa.png
---
## ControlNetとは？

拡散モデルは、ざっくり言えば「ノイズ」と「画像」の関係性を学習し、ノイズの中から画像を復元できるようにしたモデルです。

ここに、ノイズだけでなく **「画像と対応する別の情報」** を一緒に加えたらどうなるでしょうか。

- 線画と、塗り終わったイラストの関係を学習しておけば
  - → 線画を渡すだけで、自動で色を塗ってくれる
- 棒人間（ポーズ画像）と、人の写真の関係を学習しておけば
  - → 棒人間を渡すだけで、そのポーズをした人物の画像を作れる

そんなAIを作ることが出来ます。

このように、「追加の画像条件（ポーズ・線画・深度など）」を手がかりに生成結果をコントロールするための仕組みのひとつが **ControlNet** です。

---

## 代表的なControlNetの種類

ControlNet で扱える「追加情報」はアイデア次第でいくらでも増やせますが、よく使われるものはある程度パターンがあります。
代表的なものだけ挙げておきます。

### openpose（ポーズ / 棒人間）
棒人間やスケルトンで、人やキャラのポーズを指定します。

![](https://gyazo.com/637abbf2514e4c973b519053ae5809cd){gyazo=image} ![](https://gyazo.com/aa98af3564647910d9c8b647a9ecbd16){gyazo=image}

### depth（深度マップ）
深度マップを使って、構図や奥行きを固定します。

![](https://gyazo.com/0c12343e13526e4ac28edf9258e5ad23){gyazo=image} ![](https://gyazo.com/f9fa9577d3e0569f18057da32c50c95a){gyazo=image}

### scribble（落書き）
ラフな落書きだけ渡し、それをもとに画像を生成します。

![](https://gyazo.com/add872b3de994b2b07852f0304ca9d47){gyazo=image} ![](https://gyazo.com/277213578f705e57a2c9a90adaf135c5){gyazo=image}

### lineart / anime（線画）
線画を渡して、塗りを生成します。

![](https://gyazo.com/5ddbfb2110194fca853a74641efd4f87){gyazo=image} ![](https://gyazo.com/6905030224a42fdc28d2c85cf431b0a4){gyazo=image}

### inpaint（インペイント用）
マスクされた部分を自然に埋めます。

![](https://gyazo.com/69794d94d649836b33e3110b57bd9272){gyazo=image} ![](https://gyazo.com/18ae31a6d8972fdb966f49275248dd3e){gyazo=image}

このほかにも、エッジ抽出（Canny）、セグメンテーション、QR コードなど、さまざまなバリエーションがありますが、「画像」と「対応する表現」を用意さえできればどんなControlNetでも作れます。

---

## 指示ベース画像編集

最近の画像編集モデルでは、従来 ControlNet でやっていたようなことを、「[指示ベースの画像編集](/ja/ai-capabilities/instruction-based-image-editing/)」として扱ってしまうケースも増えています。

指示ベース画像編集は、与えた画像に対して、「ズームアウトして」や「夜にして」などの指示を渡すことで画像編集を行えます。

ということは、CotrolNet的な操作も「画像編集」として扱ってしまうこともできます。

- ポーズ画像 + 「このポーズで、黒い服のキャラを描いて」
- 深度マップ + 「同じ構図のまま、夜景の写真にして」
- ラフ画像 + 「このラフをきれいなイラストにして」

