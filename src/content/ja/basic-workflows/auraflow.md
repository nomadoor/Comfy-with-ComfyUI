---
layout: page.njk
lang: ja
section: basic-workflows
slug: auraflow
navId: auraflow
title: "AuraFlow"
summary: "AuraFlowとPony V7のざっくり整理"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/2d37855d2969e9cd5515e4852dce230e.png"
tags: []
---

## AuraFlowとは？

[AuraFlow](https://blog.fal.ai/auraflow/) は、fal.ai が開発している **flow ベースの text2image モデル** です。  

なによりも、**Apache-2.0 ライセンス** という緩いライセンスで公開されているのが特徴です。

今でこそオープンウェイトの中国系モデルがいくつかありますが、登場当時は「軽量かつ緩いライセンスの汎用モデル」として注目されました。

これを「次世代の SDXL」のようなポジションとしてファインチューニングしたモデルもいくつか登場しており、その代表例のひとつが Pony V7 です。

---

## モデルのダウンロード

現在は **AuraFlow v0.3** が最新バージョンです。

- [aura_flow_0.3.safetensors](https://huggingface.co/fal/AuraFlow-v0.3/blob/main/aura_flow_0.3.safetensors)

```text
📂ComfyUI/
 └── 📂models/
     └── 📂checkpoints/
         └── aura_flow_0.3.safetensors
```

---

## text2image

基本的には、SD1.5 / SDXLと同じworkflowです。

![](https://gyazo.com/b19fda7dcd1fd17b91e2f0eea9d70c8c){gyazo=image}

[](/workflows/basic-workflows/auraflow/aura_flow_0.3.json)

---

## Pony V7 : AuraFlow ベースのアニメ系モデル

[Pony Diffusion V6 XL](/ja/basic-workflows/sdxl-anime/#pony-diffusion-v6-xl) の後継として開発された、AuraFlow ベースのアニメ系モデルです。
ベースが SDXL から AuraFlow に変わったことで、モデルサイズと動作速度の面で扱いやすくなっています。

### モデルのダウンロード

- diffusion_model
  * [pony-v7-base.safetensors](https://huggingface.co/purplesmartai/pony-v7-base/blob/main/safetensor/pony-v7-base.safetensors)
- text_encoder
  * [text_encoder/model.fp16.safetensors](https://huggingface.co/purplesmartai/pony-v7-base/blob/main/text_encoder/model.fp16.safetensors)
- VAE
  * [vae/diffusion_pytorch_model.fp16.safetensors](https://huggingface.co/purplesmartai/pony-v7-base/blob/main/vae/diffusion_pytorch_model.fp16.safetensors)

```text
📂ComfyUI/
 └── 📂models/
     ├── 📂diffusion_models/
     │   └── pony-v7-base.safetensors
     ├── 📂text_encoders/
     │   └── model.fp16.safetensors
     └── 📂vae/
         └── diffusion_pytorch_model.fp16.safetensors
```

### text2image

![](https://gyazo.com/65638b2cf68cfc2a4ed7ff762653c0bc){gyazo=image}

[](/workflows/basic-workflows/auraflow/pony-v7-base.json)

* 🟦 `T5TokenizerOptions`

  * トークン数が設定値以下だった場合に padding で埋めるノードですが、入れても入れなくても大きな差はありません。
* 公式の workflow では `euler_normal` を使っていましたが、線がかなり暴れやすかったため、この workflow では **CFG++（改良版 CFG ガイダンス）** を使っています。
  - 従来の CFG を調整したもので、滑らかにデノイズされます。
  - これが正解では無いと思いますが、私が試した中では最良でした。
