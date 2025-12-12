---
layout: page.njk
lang: ja
section: basic-workflows
slug: detailer
navId: detailer
title: "Detailer"
summary: "小さな顔や細部だけを切り出してinpaintする仕組み"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/5904f9e96c234cd6bec18b10af263838.png"
tags: ["upscale-restoration"]
---

## Detailerとは？

![](https://gyazo.com/eb9c93e225419a1fe7574451d7cd94e1){gyazo=image}

Stable Diffusion 1.5 がもっとも得意なのは、だいたい 512〜768px 前後の画像です。  
この解像度で全身を描いたとき、「顔」に使えるピクセル数は 30〜50px 程度しかありません。

単純に解像度が小さいという問題もありますが、画面全体から見ると顔があまりにも小さく、  
AI にとっても「細かい作業」になりすぎてしまいます。人間と同じように、細かい作業はAIも得意ではありません。

それならばいっそ、顔の部分だけ切り抜き、描き直したものを元の画像に貼り戻してしまえばいいんじゃない？ という発想が出ました。

この **「切り抜き → 拡大 → inpaint → 元画像に貼り戻し」** という一連の処理を、 **Detailer** といいます。

---

## なぜDetailerが必要なのか

「画像全体をアップスケールして inpaint すればいいのでは？」という考え方もあります。

しかし、inpainting の計算量は、マスクの大きさではなく **元画像のサイズ** で決まります。  
4K の画像があったとき、顔だけを塗り直したい場合でも、4K 全体ぶんの計算が発生してしまい非常に非効率です。

Detailer は、inpaintしたい周辺領域だけ切り抜くため無駄がありません。

---

## 必要なカスタムノード

- [lquesada/ComfyUI-Inpaint-CropAndStitch](https://github.com/lquesada/ComfyUI-Inpaint-CropAndStitch)

> 一般的には、Impact Pack に含まれる Detailer ノードが有名です。  
> こちらのほうが物体検出まで含めた自動化が出来るので多機能なのですが、独自パラメータが多く難しいため、別で改めて扱います。

---

## マスクとクロップ領域

マスクとクロップ領域の違いを確認しておきましょう。

![](https://gyazo.com/e52ea814ccd051de4c939bb7e90eb941){gyazo=image}

- マスク：本当に書き換えたい部分（顔そのもの など）
- クロップ領域：マスクや BBOX を少しだけ広げた「作業用キャンバス」

Detailer は、この**クロップ領域のみで行うinpainting**です。


## ✂️ Inpaint Crop

![](https://gyazo.com/52c85301e868fe14f7bb729508206078){gyazo=image}

[](/workflows/basic-workflows/detailer/Inpaint_Crop_(Improved).json)

workflow を見れば分かるとおり、**マスク＋元画像** を渡すと、マスクをもとに少し余白を足したクロップ領域を自動で作り、その部分だけを指定サイズにリサイズしてくれます。


かなり多くのパラメータがありますが、基本的には下のものだけ見ておけば十分です。

| パラメータ名           | 役割・意味                                                                 |
|------------------------|----------------------------------------------------------------------------|
| `mask_fill_holes`      | マスク内の小さな穴（塗り残し）を自動で埋める                               |
| `mask_expand_pixels`   | マスクの境界を外側に指定ピクセルぶん広げる                                |
| `mask_invert`          | マスクを反転する             |
| `mask_blend_pixels`    | マスク境界をぼかす。                                  |
| 🔥`context_from_mask_extend_factor` | マスクからクロップ領域を作るときの「余白の量」を倍率で指定する        |
| 🔥`output_target_width`  | クロップ後の出力幅（ピクセル）。顔用キャンバスの横サイズなどを指定する    |
| 🔥`output_target_height` | クロップ後の出力高さ（ピクセル）。顔用キャンバスの縦サイズなどを指定する  |
| `output_padding`       | 必要に応じて、解像度をこの値の倍数になるように余白を追加する             |

---

## ✂️ Inpaint Stitch (Improved)

![](https://gyazo.com/c210a482208c8932e252b770b8b856bf){gyazo=image}

[](/workflows/basic-workflows/detailer/Inpaint_Stitch_(Improved).json)

`✂️ Inpaint Stitch (Improved)` ノードは、いじったクロップ画像を元の位置に戻します。

マスクされた部分だけが元画像に上書きされます。


---

## Inpaint Crop and Stitchで手作業Detailer

さて、早速Detailer をやってみましょう。  
といっても、[inpainting](/ja/basic-workflows/sd15-inpainting/) のworkflowに組み込むだけです。

![](https://gyazo.com/4246aded675f5267c9b5685486791390){gyazo=image}

[](/workflows/basic-workflows/detailer/Detailer_Inpaint_Crop.json)

- 🟩 ベースモデルによって　`output_target_width/height` を調整してください。
  - 今回はSD1.5なので512px
- 🟥 直接 Detailer とは関係ありませんが、Inpaint Crop が「境界をぼかしたマスク」を出力してくれるので、それを活かせる [Differential Diffusion](/ja/basic-workflows/differential-diffusion/) とはかなり相性が良いです。

---

## 物体検出を組み合わせる

顔のマスクを自動で作成して、少し自動化してみましょう。

![](https://gyazo.com/d65f393b285ec6c84a17a6a6ef438f14){gyazo=image}

[](/workflows/basic-workflows/detailer/Detailer_Inpaint_Crop_SAM3.json)

- 🟦 SAM 3を使って顔のマスクを作成します。

Detailerの基礎はこれだけなので、もう十分使いこなせると思います。  
ただ、画像に映った複数の人物をまとめて検出して、一気に処理したい……となるとImpactPackを使用する必要があります。

→ [Detailer ImpactPack (WIP)](まだ)

---

## サンプル画像

![](https://gyazo.com/7564534ad31facc3d0c91bc36606c930){gyazo=image}