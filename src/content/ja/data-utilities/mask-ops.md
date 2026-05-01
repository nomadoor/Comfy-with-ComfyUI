---
layout: page.njk
lang: ja
section: data-utilities
slug: mask-ops
navId: mask-ops
title: "マスク操作"
created: 2025-11-25
updated: 2026-03-02
summary: "マスクの作成方法と編集方法"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## マスクの確認

### MaskPreview ノード

`Preview Image` ノードのマスク版です。

![](https://gyazo.com/a9dd4acbc14438fd7edfe85d3a14c6f3){gyazo=image}

[](/workflows/data-utilities/mask-ops/MaskPreview.json)


### Convert Mask to Image ノード

マスクを白黒の`Image`に変換します。

![](https://gyazo.com/28a1d381f0697c598db58f1e4c5648c6){gyazo=image}

[](/workflows/data-utilities/mask-ops/Convert_Mask_to_Image.json)


---

## マスクの作成

### Load Image (as Mask) ノード

画像ファイルを直接マスクデータとして読み込みます。

![](https://gyazo.com/49e0e05fc6511b8e37a16439afad6fed){gyazo=image}

[](/workflows/data-utilities/mask-ops/Load_Image_(as_Mask).json)


- **channel**:
  - `red`/`green`/`blue`: 白黒画像を使用する場合、どれを選んでもOKです。
  - `alpha`: 透過PNGの「透明部分」をマスクとして使いたい場合に選択します。

### Convert Image to Mask ノード

ワークフロー内の `IMAGE`（RGB画像）を `MASK` に変換します。  
`Load Image (as Mask)` ノードを分解したようなものです。

![](https://gyazo.com/aa0f427a4464958a9ebea27ac925294a){gyazo=image}

[](/workflows/data-utilities/mask-ops/Convert_Image_to_Mask.json)



### 🪢 Color To Mask ノード

画像の特定色（グリーンバックなど）をマスクに変換します。  
いわゆるクロマキー処理ですね。

![](https://gyazo.com/c38c27135c901d0db5927d493b5b8650){gyazo=image}

[](/workflows/data-utilities/mask-ops/Color_To_Mask.json)

コアノードにも同様の機能を持つ `ImageColorToMask` ノードというのがあるんですが、閾値の調整ができず使いにくいため、以下のカスタムノードを使用します。

- **[Kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)**: `Color To Mask` ノード
- RGBでターゲット色を指定し、`threshold`（許容値）で色の誤差を調整します。

### SolidMask ノード

指定したサイズで矩形のマスクを作ります。  
全面を塗りつぶした（あるいは空の）マスクが必要な場合に使用します。

![](https://gyazo.com/088fbef6cdf9175a1a5bb0c08cfc9d8f){gyazo=image}

[](/workflows/data-utilities/mask-ops/SolidMask.json)

### Mask Editor

ComfyUI上で、画像の特定部分をマスク（白黒画像）として描画できるツールです。


![](https://gyazo.com/05a4f6930a6d074435ac29b77c97e82e){gyazo=loop}

- **起動方法**: `Load Image` ノードなどを選択 → `Node Selection Toolbox` の `🌔` (Open Mask Editor) をクリック

左端のタブで機能を切り替えます。

- **マスク描画**: ブラシでマスクを描きます。
- **塗りつぶし**: 手書きマスクで囲まれた範囲を塗りつぶします。
- **自動選択**: クリックした箇所と似た色の範囲を自動的にマスク化します。

編集が終わったら、ヘッダーの `Save` をクリックして適用します。

詳しい操作方法は [マスクエディタ](/ja/begin-with/mask-editor/) をご覧ください。

---

## 深度マップの活用

### 🪢 Depth Map (深度マップ)

![](https://i.gyazo.com/f2313d12383bc625fbf7f0c16cb8ba34.png){gyazo=image}

[](/workflows/data-utilities/mask-ops/DepthmapAsMask.json)

深度マップは白黒のグラデーション画像です。ということは、そのままマスクとして転用できるんですね。  
スマホのアプリなどで、あとから写真の背景ぼかす加工がありますが、基本的には同じ仕組みです。

深度マップの作成方法は、[ControlNet Preprocessor](/ja/basic-workflows/controlnet-prep/#よく使われるpreprocessor)をご覧ください。

---

## マスクの編集

### Resize Image/Mask ノード

[Resize Image/Mask ノード](/ja/data-utilities/resize-crop-pad/#resize-image-mask-ノード) で詳しく扱っているので、そちらを参照してください。

![](https://gyazo.com/fd9f3fab0b5ead47c84ce51f9ec3325a){gyazo=image}

[](/workflows/data-utilities/mask-ops/Resize_ImageMask_match-size.json)

ここでは、`match size` だけ触れておきます。  
画像をリサイズすると、画像とマスクのサイズがズレて、対応が取れなくなることがあります。

`match size` を使うことで、参照画像に合わせてマスク側をリサイズでき、形（位置関係）を保ったまま揃えることができます。

### CropMask ノード

マスクを指定範囲で切り抜きます。

![](https://gyazo.com/aa6a319345beedb98ad7d873633df500){gyazo=image}

[](/workflows/data-utilities/mask-ops/CropMask.json)


### GrowMask ノード

マスクの輪郭を広げます。数値をマイナスにすると狭める（痩せさせる）こともできます。

![](https://gyazo.com/395ae15fa99d4b099e80b006dc1c2d7b){gyazo=image}

[](/workflows/data-utilities/mask-ops/GrowMask.json)


### 🪢 Gaussian Blur Mask ノード

マスクをぼかします。合成時の境界を馴染ませるために重要です。

![](https://gyazo.com/447edb124127718662b35089effdcfa3){gyazo=image}

[](/workflows/data-utilities/mask-ops/Gaussian_Blur_Mask.json)

- [ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack) などに含まれます。

### InvertMask ノード

マスクの白黒を反転します。

![](https://gyazo.com/c8ca1c37aa1e2bf3dd4581028e5ab8b9){gyazo=image}

[](/workflows/data-utilities/mask-ops/InvertMask.json)

### ThresholdMask ノード

中間値（グラデーション）を持つマスクを、指定したしきい値でバイナリ（白か黒か）マスクに変換します。

![](https://gyazo.com/08a267a2826ab83e8ba872298c3974ff){gyazo=image}

[](/workflows/data-utilities/mask-ops/ThresholdMask.json)


### 🪢 Remap Mask Range ノード

グラデーションマスクのかかり方を調整します。
前述の「深度マップ」と組み合わせると、奥行きの「どの位置」に焦点を当てるか変更できて面白い効果が得られます。

![](https://i.gyazo.com/fc933c9858f06298ea6524fc6ed0ca5b.png){gyazo=image}

[](/workflows/data-utilities/mask-ops/Remap_Mask_Range.json)


---

## マスクの合成

### MaskComposite ノード

二つのマスクを様々なモード（足し算、引き算、掛け算など）で合成します。

![](https://gyazo.com/564ef15662a33280a1ec6708104833ce){gyazo=image}

[](/workflows/data-utilities/mask-ops/MaskComposite.json)


---

## サンプル画像

![](https://gyazo.com/a4f60a62fa0aec62796ab908f16d9eaa){gyazo=image} ![](https://gyazo.com/20ca6b1922830c8864f755bc695d5c80){gyazo=image} ![](https://gyazo.com/727e5c4b9b80304adabccd3b36fbfcfe){gyazo=image} ![](https://gyazo.com/8c08c2615b3a741e711d3c11485d4d93){gyazo=image} ![](https://gyazo.com/96ab673a43e5b23bd666d1889360c981){gyazo=image} ![](https://gyazo.com/bb5bd997733867c5c07a986d5793c63a){gyazo=image}