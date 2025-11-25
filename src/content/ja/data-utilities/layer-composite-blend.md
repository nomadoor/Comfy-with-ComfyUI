---
layout: page.njk
lang: ja
section: data-utilities
slug: layer-composite-blend
navId: layer-composite-blend
title: "レイヤ合成"
summary: "画像の重ね合わせや結合、ブレンドについて"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 画像の合成

二つの画像を重ねたり、横に並べたりします。

Photoshopなら画像をドラッグして上に持っていくだけの簡単な作業ですが、ノードベースのComfyUIでこれをやろうとすると一苦労です。

Inpainting処理などで必要な場面もありますが、色調補正同様、諦めてペイントツールを使うのも良い選択です。

---

## 画像を重ねる

単純に、ある画像の上に別の画像を配置する操作です。

### ImageCompositeMasked ノード

![](https://gyazo.com/0f12d674fe3e1f6f30c2a06340464eb4){gyazo=image}

[](/workflows/data-utilities/layer-composite-blend/ImageCompositeMasked.json)

画像を重ね合わせるための基本ノードです。

- **destination**: 背面（ベース）になる画像
- **source**: 前面（上に乗る）画像
- **x / y**: 左上を基準とした位置調整
- **resize_source**: `true` にすると、`source`画像が`destination`と同じサイズになるように引き伸ばされます（※アスペクト比が違うと歪みます）。

### 中央に配置したい場合

![](https://gyazo.com/282ad8bae51d35eef6a4810780f3eb82){gyazo=image}

[](/workflows/data-utilities/layer-composite-blend/ImageCompositeMasked-Align_center.json)

CSSでおなじみの `position: absolute; top: 50%; left: 50%;` のような座標計算をノードで行えば中央配置も可能ですが…まあ、正直めんどくさいですね(；・∀・)

---

## 透過画像を重ねる

ここがComfyUIにおけるレイヤー合成の肝です。

「背景が透明な画像」を重ねたい場合、単に画像を繋ぐだけではうまくいきません。

ComfyUIでは、**「マスクされた部分を source 画像で置き換える」** という処理として考え直す必要があります。

### 透過PNGを合成する手順

![](https://gyazo.com/cd53e89115c033f8a8ea175b72ca0aef){gyazo=image}

[](/workflows/data-utilities/layer-composite-blend/ImageCompositeMasked-with_Alpha.json)

使うのは同じく `ImageCompositeMasked` ノードですが、**`mask` 入力** を使用します。

- 1. 透過画像を読み込むと、`MASK` 出力から「透明部分のマスク」が得られます。
- 2. このマスクを `ImageCompositeMasked` ノードの `mask` 入力に繋ぎます。
- 3. すると、**マスクの部分だけが source 画像（ピンクの空など）に置き換わります**。

### サイズ違いによる歪み対策

`resize_source` を `true` にしていると、source画像は無理やり destination 画像と同じサイズに引き伸ばされます。

![](https://gyazo.com/f7ba12c0cf33e3e5dc8a9b5fb24cb0a6){gyazo=image}

[](/workflows/data-utilities/layer-composite-blend/ImageCompositeMasked-with_crop-pad.json)

背景が単色やパターンなら気になりませんが、写真などの場合は歪んでしまいます。
一番簡単な解決策は、**あらかじめ2つの画像を同じサイズにパディング/クロップしておくこと**です。

- 🟪前面画像を背景画像のサイズにパディング
- 🟨背景画像を前面画像のサイズにクロップ

### 実践例：セグメンテーションとの組み合わせ

![](https://i.gyazo.com/c848c0f8e8d3ee590ba7ae09e8db7e68.png){gyazo=image}

[](/workflows/data-utilities/layer-composite-blend/ImageCompositeMasked_Segmentation.json)

「ドレスの部分だけ色を変えたい」といった場合も同じ理屈です。

- 1. 入力画像からセグメンテーションで「ドレスのマスク」を作ります。
- 2. `source` に `EmptyImage`（単色画像）などを繋ぎます。
- 3. `resize_source` を `true` にします（単色なら歪んでも関係ないのでOK）。
- 4. これでドレス部分だけが指定色で塗りつぶされます。

最初は感覚が掴みづらいとは思いますが、徐々に慣れていきましょう。

---

## 画像を並べる (結合)

画像を横並び、または縦並びに結合します。比較画像を作りたい時などに便利です。

### Image Stitch ノード

![](https://i.gyazo.com/4ce9346ef269709f6456f0fcd5832a9c.png){gyazo=image}

[](/workflows/data-utilities/layer-composite-blend/Image_Stitch.json)

シンプルな結合ノードです。

### 🪢 Image Concatenate From Batch ノード

![](https://i.gyazo.com/18d0555fd1d0bd01ead60b3992662cb0.png){gyazo=image}

[](/workflows/data-utilities/layer-composite-blend/Image_Concatenate_From_Batch.json)

Stitchノードを複数使えば3枚、4枚と並べられますが、バッチ（複数枚セット）画像をまとめてグリッド状に並べたい場合は、このノードを使うとスマートに処理できます。

- **[Kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)** に含まれます。

---

## 画像を混ぜる (ブレンド)

### Image Blend ノード

![](https://i.gyazo.com/0c3dbad0a36a0399e7e12301a4b58638.png){gyazo=image}

[](/workflows/data-utilities/layer-composite-blend/Image_Blend.json)

ペイントソフトでいうレイヤーの「合成モード」のようなものです。
標準ではごく単純なブレンドしかできませんが、`blend_factor` で合成の強さを調整できます。

- `blend_factor`: 1.0に近いほど source 画像が濃くなります。

---

## EmptyImage ノード

![](https://gyazo.com/c39404b4f19fe6a47565b326b7f0dc6d){gyazo=image}

[](/workflows/data-utilities/layer-composite-blend/EmptyImage.json)

単色の画像を作るだけのノードです。

### 色の設定方法

色の設定がややこしく、慣れ親しんだ16進数やRGBではなく、**24ビットカラー（10進数）** で設定します。

計算式は以下の通りです：

```
Decimal Value = (Red × 65536) + (Green × 256) + Blue
```

**例：** ピンク色（RGB: 255, 192, 203）を作りたい場合

```
255 × 65536 + 192 × 256 + 203 = 16,761,035
```

このように計算した値を `color` パラメータに入力します。