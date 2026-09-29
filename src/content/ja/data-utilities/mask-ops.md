---
layout: page.njk
lang: ja
section: data-utilities
slug: mask-ops
navId: mask-ops
title: "マスク操作"
created: 2025-11-25
updated: 2026-09-27
summary: "マスクの作成方法と編集方法"
seoTitle: "ComfyUIのマスク操作：作成・変換・編集ノード"
seoDescription: "ComfyUIでマスクを作成・確認・編集する方法。画像やカラーからのマスク作成、Create Solid Mask、マスクエディタ、深度マップの活用、マスクの拡張・ぼかし・合成などの編集ノードをまとめています。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## マスクの確認

### MaskPreview ノード

`Preview Image` ノードのマスク版です。

![](/media/data-utilities/mask-ops/legacy_gyazo_a9dd4acbc14438fd7edfe85d3a14c6f3.png){media=image}

[](/workflows/data-utilities/mask-ops/maskpreview.json)


### Convert Mask to Image ノード

マスクを白黒の`Image`に変換します。

![](/media/data-utilities/mask-ops/legacy_gyazo_28a1d381f0697c598db58f1e4c5648c6.png){media=image}

[](/workflows/data-utilities/mask-ops/convert_mask_to_image.json)


---

## マスクの作成

### Load Image (as Mask) ノード

画像ファイルを直接マスクデータとして読み込みます。

![](/media/data-utilities/mask-ops/legacy_gyazo_49e0e05fc6511b8e37a16439afad6fed.png){media=image}

[](/workflows/data-utilities/mask-ops/load_image_as_mask.json)


- **channel**:
  - `red`/`green`/`blue`: 白黒画像を使用する場合、どれを選んでもOKです。
  - `alpha`: 透過PNGの「透明部分」をマスクとして使いたい場合に選択します。

### Convert Image to Mask ノード

ワークフロー内の `IMAGE`（RGB画像）を `MASK` に変換します。  
`Load Image (as Mask)` ノードを分解したようなものです。

![](/media/data-utilities/mask-ops/legacy_gyazo_aa0f427a4464958a9ebea27ac925294a.png){media=image}

[](/workflows/data-utilities/mask-ops/convert_image_to_mask.json)



### 🪢 Color To Mask ノード

画像の特定色（グリーンバックなど）をマスクに変換します。  
いわゆるクロマキー処理ですね。

![](/media/data-utilities/mask-ops/legacy_gyazo_c38c27135c901d0db5927d493b5b8650.png){media=image}

[](/workflows/data-utilities/mask-ops/color_to_mask.json)

コアノードにも同様の機能を持つ `ImageColorToMask` ノードというのがあるんですが、閾値の調整ができず使いにくいため、以下のカスタムノードを使用します。

- **[Kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)**: `Color To Mask` ノード
- RGBでターゲット色を指定し、`threshold`（許容値）で色の誤差を調整します。

### Create Solid Mask ノード

指定したサイズで矩形のマスクを作ります。  
全面を塗りつぶした（あるいは空の）マスクが必要な場合に使用します。

![](/media/data-utilities/mask-ops/create_solid_mask.png){media=image}

[](/workflows/data-utilities/mask-ops/create_solid_mask.json)

### Mask Editor

ComfyUI上で、画像の特定部分をマスク（白黒画像）として描画できるツールです。


![](/media/begin-with/mask-editor/legacy_gyazo_05a4f6930a6d074435ac29b77c97e82e.mp4){media=loop}

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

![](/media/data-utilities/mask-ops/legacy_gyazo_f2313d12383bc625fbf7f0c16cb8ba34.png){media=image}

[](/workflows/data-utilities/mask-ops/depthmapasmask.json)

深度マップは白黒のグラデーション画像です。ということは、そのままマスクとして転用できるんですね。  
スマホのアプリなどで、あとから写真の背景ぼかす加工がありますが、基本的には同じ仕組みです。

深度マップの作成方法は、[ControlNet Preprocessor](/ja/basic-workflows/controlnet-prep/#よく使われるpreprocessor)をご覧ください。

---

## マスクの編集

### Resize Image/Mask ノード

[Resize Image/Mask ノード](/ja/data-utilities/resize-crop-pad/#resize-image-mask-ノード) で詳しく扱っているので、そちらを参照してください。

![](/media/data-utilities/mask-ops/legacy_gyazo_fd9f3fab0b5ead47c84ce51f9ec3325a.png){media=image}

[](/workflows/data-utilities/mask-ops/resize_imagemask_match_size.json)

ここでは、`match size` だけ触れておきます。  
画像をリサイズすると、画像とマスクのサイズがズレて、対応が取れなくなることがあります。

`match size` を使うことで、参照画像に合わせてマスク側をリサイズでき、形（位置関係）を保ったまま揃えることができます。

### CropMask ノード

マスクを指定範囲で切り抜きます。

![](/media/data-utilities/mask-ops/legacy_gyazo_aa6a319345beedb98ad7d873633df500.png){media=image}

[](/workflows/data-utilities/mask-ops/cropmask.json)


### GrowMask ノード

マスクの輪郭を広げます。数値をマイナスにすると狭める（痩せさせる）こともできます。

![](/media/data-utilities/mask-ops/legacy_gyazo_395ae15fa99d4b099e80b006dc1c2d7b.png){media=image}

[](/workflows/data-utilities/mask-ops/growmask.json)


### 🪢 Gaussian Blur Mask ノード

マスクをぼかします。合成時の境界を馴染ませるために重要です。

![](/media/data-utilities/mask-ops/legacy_gyazo_447edb124127718662b35089effdcfa3.png){media=image}

[](/workflows/data-utilities/mask-ops/gaussian_blur_mask.json)

- [ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack) などに含まれます。

### InvertMask ノード

マスクの白黒を反転します。

![](/media/data-utilities/mask-ops/legacy_gyazo_c8ca1c37aa1e2bf3dd4581028e5ab8b9.png){media=image}

[](/workflows/data-utilities/mask-ops/invertmask.json)

### ThresholdMask ノード

中間値（グラデーション）を持つマスクを、指定したしきい値でバイナリ（白か黒か）マスクに変換します。

![](/media/data-utilities/mask-ops/legacy_gyazo_08a267a2826ab83e8ba872298c3974ff.png){media=image}

[](/workflows/data-utilities/mask-ops/thresholdmask.json)


### 🪢 Remap Mask Range ノード

グラデーションマスクのかかり方を調整します。
前述の「深度マップ」と組み合わせると、奥行きの「どの位置」に焦点を当てるか変更できて面白い効果が得られます。

![](/media/data-utilities/mask-ops/legacy_gyazo_fc933c9858f06298ea6524fc6ed0ca5b.mp4){media=loop}

[](/workflows/data-utilities/mask-ops/remap_mask_range.json)


---

## マスクの合成

### MaskComposite ノード

二つのマスクを様々なモード（足し算、引き算、掛け算など）で合成します。

![](/media/data-utilities/mask-ops/legacy_gyazo_564ef15662a33280a1ec6708104833ce.png){media=image}

[](/workflows/data-utilities/mask-ops/maskcomposite.json)


---

{% outputs "samples" %}
![](/media/data-utilities/mask-ops/legacy_gyazo_a4f60a62fa0aec62796ab908f16d9eaa.png){media=image} ![](/media/data-utilities/mask-ops/legacy_gyazo_20ca6b1922830c8864f755bc695d5c80.png){media=image} ![](/media/data-utilities/mask-ops/legacy_gyazo_727e5c4b9b80304adabccd3b36fbfcfe.png){media=image} ![](/media/data-utilities/mask-ops/legacy_gyazo_8c08c2615b3a741e711d3c11485d4d93.png){media=image} ![](/media/data-utilities/mask-ops/legacy_gyazo_96ab673a43e5b23bd666d1889360c981.png){media=image} ![](/media/data-utilities/mask-ops/legacy_gyazo_bb5bd997733867c5c07a986d5793c63a.png){media=image}
{% endoutputs %}
