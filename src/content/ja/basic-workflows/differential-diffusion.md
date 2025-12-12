---
layout: page.njk
lang: ja
section: basic-workflows
slug: differential-diffusion
navId: differential-diffusion
title: "Differential Diffusion"
summary: "マスクの濃度で変化量をコントロールする"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/1f32a3d04b7ee26518803718151fc1d0.png"
---

## Differential Diffusionとは？

通常の inpainting では、マスクは「白か黒か」の二択で扱われます。  
少しでもグレーになると「マスクしていない」と見なされ、完全な白の部分だけしか inpainting してくれません。

Differential Diffusion は、**マスクの濃度に応じて denoise の強さを連続的に変える** ための仕組みです。  
これのおかげで、場所ごとに変化量が異なる inpainting を一回のサンプリングで行うことができます。

> [inpainting](/ja/basic-workflows/sd15-inpainting/) を先に読んでいる前提です。  
> マスクの作り方は [マスク操作](/ja/data-utilities/mask-ops/)、[AIを使ったマスク生成](/ja/data-utilities/ai-mask-generation/) を参照してください。

---

## 使い方

グラデーションマスクを用意し、inpainting の workflow に `Differential Diffusion` ノードを追加するだけです。

### workflow

![](https://gyazo.com/32341a2b91def8997072eb24dde93cce){gyazo=image}

[](/workflows/basic-workflows/differential-diffusion/SD1.5_Differential_Diffusion.json)

- ベースは `Set Latent Noise Mask` ノードを使った workflow です。
  - もちろん、inpainting モデルや ControlNet モデルを使った workflow でも使えます。
- 🟩 `Differential Diffusion` ノードを追加

マスクの白い部分ほどプロンプトに寄り、黒い部分ほど「元の絵」を残します。

---

## 面白い使い方

### 部位ごとに変化量を変える

マスクはグラデーションである必要はありません。  
**一枚のマスクの中で、場所ごとに濃さを変える** ことで、1 回のサンプリングで部位ごとに違う変化量を指定できます。

![](https://gyazo.com/4b3d0506456a4f1dc8aa062d4e445b17){gyazo=image}

[](/workflows/basic-workflows/differential-diffusion/SD1.5_Differential_Diffusion_multi-obj.json)

- 変えたい部分ごとに、マスクの濃さを描き分ける（例: 顔は薄めのグレー、背景は白など）

### マスク境界をなじませる

inpainting のよくある問題として、マスクの境目がくっきり出てしまうことがあります。  
Differential Diffusion と、ぼかしたマスクを組み合わせることで、この境界を自然になじませましょう。

![](https://gyazo.com/e54a8d82e7dca29bf6ab19fdb20c3354){gyazo=image}

[](/workflows/basic-workflows/differential-diffusion/SD1.5_Differential_Diffusion_blur.json)

- 🟪 今回は inpainting モデルを使った workflow に組み込みます。
- `Gaussian Blur Mask` ノード（[ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack)）でマスクの境界をぼかす
  - ぼかすと実質マスクが小さくなるため、前処理として少しマスクを大きくしておきます。

### 深度マップをマスクとして使う

深度マップは白黒のグラデーションで表されます。  
つまり、Differential Diffusion と相性が良いマスクとして使うことが出来ます。

![](https://gyazo.com/ac52958c32bb143910151029c53707d1){gyazo=image}

[](/workflows/basic-workflows/differential-diffusion/SD1.5_Differential_Diffusion_depthmap.json)

- 🟦 Depth Anything V2 で深度マップを作成
  - これは IMAGE なので `Convert Image to Mask` ノードでマスクに変換します。

正直、SD1.5 では性能が足りないのであまり活かしきれていませんが、深度マップをマスクとして使うことは自体は面白く、個人的にお気に入りの方法です。

---

## サンプル画像

![](https://gyazo.com/8d2eb48340cf6f6f99e539e11517d6a2){gyazo=image} ![](https://gyazo.com/d8cd78b75de91ed4e9a1da1eedfcf21d){gyazo=image} ![](https://gyazo.com/ff958820180efd9b316cb42ddd9c0276){gyazo=image} ![](https://gyazo.com/2d0d14ad85109598f389e5ac0ad7b85f){gyazo=image}
