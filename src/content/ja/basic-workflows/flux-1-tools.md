---
layout: page.njk
lang: ja
section: basic-workflows
slug: flux-1-tools
navId: flux-1-tools
title: "Flux.1 Tools"
summary: "Flux.1 Toolsの使い方"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/204fbd9af3c371511c01a0c97cac40e8.png"
tags: ["controlnet"]
---

## Flux.1 Toolsとは？

Flux.1 には、ベースモデルとは別に [ControlNet](/ja/basic-workflows/sd15-controlnet/) や [IP-Adapter](/ja/basic-workflows/sd15-ip-adapter/) に相当するような派生モデルが Flux 公式から出ています。

- `FLUX.1 Fill` … inpainting / outpainting 用モデル
- `FLUX.1 Depth` / `FLUX.1 Canny` … 構造ベースのガイド（Depth / Canny）で形をキープしたまま描き変えるモデル
- `FLUX.1 Redux` … 参照画像そっくりのバリエーションを量産する、Flux 向け IP-Adapter 的モデル

---

## FLUX.1 Fill

inpaintingモデルと同じように使えます。

### モデルのダウンロード

- [FLUX.1-Fill-dev_fp8.safetensors](https://huggingface.co/1038lab/FLUX.1-Fill-dev_fp8/blob/main/FLUX.1-Fill-dev_fp8.safetensors)  
```text
📂ComfyUI/
└── 📂models/
    └── 📂diffusion_models/
        └── FLUX.1-Fill-dev_fp8.safetensors
```

### workflow

![](https://gyazo.com/ab4e4b0f5c9fe2030ebd637b15ac144d){gyazo=image}

[](/workflows/basic-workflows/flux-1-tools/FLUX.1-Fill.json)

* 🟪 `flux1-fill-dev.safetensors` を `Load Diffusion Model` ノードで読み込みます。
* 🟩 Flux.1 の workflow でも、Stable Diffusion 1.5 の [inpainting](/ja/basic-workflows/sd15-inpainting/) と同じように `InpaintModelConditioning` ノードを追加します。

  * 画像とマスクを入力します。

---

## FLUX.1 Depth / FLUX.1 Canny

ControlNet Depth / Canny と同じような感覚で使えます。

### モデルのダウンロード

* [flux1-depth-dev-fp8.safetensors](https://huggingface.co/boricuapab/flux1-depth-dev-fp8/blob/main/flux1-depth-dev-fp8.safetensors)
* [flux1-canny-dev-fp8.safetensors](https://huggingface.co/boricuapab/flux1-canny-dev-fp8/blob/main/flux1-canny-dev-fp8.safetensors)
```text
📂ComfyUI/
└── 📂models/
    └── 📂diffusion_models/
        ├── flux1-depth-dev-fp8.safetensors
        └── flux1-canny-dev-fp8.safetensors
```

### workflow

![](https://gyazo.com/8b4d310e8b9228e6e2be3b422150e01c){gyazo=image}

[](/workflows/basic-workflows/flux-1-tools/FLUX.1-Depth.json)

* 🟩 `InstructPixToPixConditioning` ノードに制御用画像を入力します。
* 🟦 今回は Depth なので、Depth Anything V2 で深度マップを作成します。

  * この深度マップの画像サイズがそのまま出力される画像サイズになってしまうため、適度なサイズにリサイズします。

> Canny 版では、同じ構成で Canny エッジ画像を入力します。

---

## FLUX.1 Redux

`FLUX.1 Redux` は、一枚以上の参照画像を渡して、その画像に強く寄せたバリエーションを生成するモデルです。  
IP-Adapter に近いですが、Redux はかなりプロンプトが効きにくく、参照画像の見た目がほとんどそのまま出てきます。

### モデルのダウンロード

Redux は、Flux 本体とは別の「スタイルモデル」として読み込みます。  
さらに、参照画像をエンコードするための CLIP-ViT も必要です。

* [FLUX.1-Redux-dev](https://huggingface.co/black-forest-labs/FLUX.1-Redux-dev/tree/main)
* [sigclip_vision_patch14_384](https://huggingface.co/Comfy-Org/sigclip_vision_384/tree/main)
```text
📂ComfyUI/
└── 📂models/
    ├── 📂style_models/
    │   └── flux1-redux-dev.safetensors
    └── 📂clip_vision/
        └── sigclip_vision_patch14_384.safetensors
```

### workflow

![](https://gyazo.com/90588b4c7bc62bf7218901c901f31b8f){gyazo=image}

[](/workflows/basic-workflows/flux-1-tools/FLUX.1-Redux.json)

* 🟩 `Apply Style Model` ノードを追加し、Style モデルと `CLIP Vision Encode` を繋ぎます。

  * `CLIP Vision Encode` ノードには、`sigclip_vision_patch14_384.safetensors` と参照画像を繋ぎます。

### 複数枚を混ぜる

`Apply Style Model` の塊を横に並べれば、複数の画像を参照して混ぜることも出来ます。

![](https://gyazo.com/cd6233194a56e2ceeb597c8877d645ef){gyazo=image}

[](/workflows/basic-workflows/flux-1-tools/FLUX.1-Redux_multi.json)

### Reduxの問題

改めてですが、Redux はプロンプトや LoRA など、他のパラメータをほとんど無視してしまいます。

そう割り切って「参照画像そっくりのバリエーションを量産するツール」として使うのが一番だと思いますが、
プロンプトでもある程度コントロール出来るようにするカスタムノードもあります。参考までに。

* [kaibioinfo/ComfyUI_AdvancedRefluxControl](https://github.com/kaibioinfo/ComfyUI_AdvancedRefluxControl)

