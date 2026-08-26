---
layout: page.njk
lang: ja
section: basic-workflows
slug: differential-diffusion
navId: differential-diffusion
title: "Differential Diffusion"
created: 2025-12-07
updated: 2026-08-26
summary: "マスクの濃度で変化量をコントロールする"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/1f32a3d04b7ee26518803718151fc1d0.png"
---

## Differential Diffusionとは？

通常の inpainting では、マスクの白い部分は変化し、黒い部分は変化しません。

では、グレーにすれば少しだけ変化するのか？というと、残念、想像するようなコントロールはそのままではできません。

そこで生まれたのが Differential Diffusion です。

**マスクの濃度に応じて、場所ごとに denoise を変える** ことが出来るため、場所ごとに変化量を変えたり、境界をぼかしたマスクを扱えるようになります。

> [inpainting](/ja/basic-workflows/sd15-inpainting/) をまだ読んでいなければ、先にご覧ください。

---

## 使い方

inpainting の workflow に `Differential Diffusion` ノードを追加し、マスクに濃淡をつけるだけです。

### workflow

![](https://gyazo.com/32341a2b91def8997072eb24dde93cce){gyazo=image}

[](/workflows/basic-workflows/differential-diffusion/SD1.5_Differential_Diffusion.json)

- 🟩 `Differential Diffusion` ノードを追加
- ベースは `Set Latent Noise Mask` ノードを使った workflow です。
  - もちろん、inpainting モデルや ControlNet モデルを使った workflow でも使えます。

マスクの白い部分ほど大きく変化し、黒い部分ほど「元の絵」を残します。

---

## マスクの使い方

### 場所ごとに変化量を変える

マスクの濃さは、滑らかなグラデーションにする必要はありません。

**一枚のマスク画像の中で、場所ごとに濃さを変える** ことで、1 回のサンプリングで部位ごとに違う変化量を指定できます。

![](https://gyazo.com/4b3d0506456a4f1dc8aa062d4e445b17){gyazo=image}

[](/workflows/basic-workflows/differential-diffusion/SD1.5_Differential_Diffusion_multi-obj.json)

- 変えたい部分ごとに、マスクの濃さを描き分ける（例: 顔は薄めのグレー、背景は白など）

### 境界をなじませる

inpainting のよくある問題として、マスクの境目がくっきり出てしまうことがあります。

Differential Diffusion と、ぼかしたマスクを組み合わせて、境界を自然になじませましょう。

![](https://gyazo.com/e54a8d82e7dca29bf6ab19fdb20c3354){gyazo=image}

[](/workflows/basic-workflows/differential-diffusion/SD1.5_Differential_Diffusion_blur.json)

- 🟪 今回は inpainting モデルを使った workflow に組み込みます。
- 🟨 `Gaussian Blur Mask` ノード（[ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack)）でマスクの境界をぼかす
  - ぼかすと実質マスクが小さくなるため、前処理として少しマスクを大きくしておきます。

### 深度マップをマスクとして使う

深度マップは白黒のグラデーションで表されます。  
つまり、そのまま Differential Diffusion のマスクとして使うことが出来ます。

![](https://gyazo.com/ac52958c32bb143910151029c53707d1){gyazo=image}

[](/workflows/basic-workflows/differential-diffusion/SD1.5_Differential_Diffusion_depthmap.json)

- 🟦 Depth Anything V2（[comfyui_controlnet_aux](https://github.com/Fannovel16/comfyui_controlnet_aux)）で深度マップを作成
  - これは IMAGE なので `Convert Image to Mask` ノードでマスクに変換します。
- `RemapMaskRange`（[ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)）で濃淡を調整

正直、SD1.5 では性能が足りないのですが、深度マップをマスクとして使うこと自体は、お気に入りの方法です。

---

## サンプル画像

![](https://gyazo.com/8d2eb48340cf6f6f99e539e11517d6a2){gyazo=image} ![](https://gyazo.com/d8cd78b75de91ed4e9a1da1eedfcf21d){gyazo=image} ![](https://gyazo.com/ff958820180efd9b316cb42ddd9c0276){gyazo=image} ![](https://gyazo.com/2d0d14ad85109598f389e5ac0ad7b85f){gyazo=image}
