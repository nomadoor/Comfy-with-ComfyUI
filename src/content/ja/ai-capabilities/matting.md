---
layout: page.njk
lang: ja
section: ai-capabilities
slug: matting
navId: matting
title: マッティング
summary: "自然な画像から前景を切り出し、背景と分離する技術"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: 'https://i.gyazo.com/38630075ecd6336a630da0fe5b8ba130.gif'
---

## マッティングとは？

マッティング（Image Matting）は、グリーンバック撮影のような特別な準備なしに、普通の写真や画像から**前景と背景を分離する**タスクです。

いわゆる「背景除去サービス」の多くは、このマッティング技術をベースにしています。

髪の毛のような細かい部分も、できるだけ自然に切り抜くのがマッティングの目標です。単純な2値マスク（白黒だけ）ではなく、**アルファマット**と呼ばれる半透明の情報も含めたマスクを生成します。

---

## BiRefNet

[BiRefNet](https://github.com/ZhengPeng7/BiRefNet)は前景抽出用のモデルファミリーで、背景除去・マット生成に特化した高精度モデルです。

軽量で高性能なので、マッティングならBiRefNetを選んでおけば間違いないです。

![](https://gyazo.com/131fe705fd29ddd98391fb4e78b608ab){gyazo=image}

[](/workflows/ai-capabilities/matting/BiRefNet-general.json)

いくつか派生モデルがありますが、まずは**general**から試してみてください。人物・物体・動物など、幅広い対象に対応しています。

---

## SDMatte

[SDMatte](https://github.com/vivoCameraResearch/SDMatte)は、Stable Diffusionの知識を利用したマッティングモデルです。

![](https://gyazo.com/317da8e987179adbe6e02f0eb40a4a07){gyazo=image}

[](/workflows/ai-capabilities/matting/SDMatte.json)

BiRefNetと同じように前景切り抜きもできますが、ガラス瓶・液体・薄い布など、**透けて見えるもの**もある程度扱えるのが特徴です。

拡散ベースの運命として計算コストは高いですが、透明・半透明のオブジェクト、毛先といった極細のものを切り抜きたいときは試してみてください。