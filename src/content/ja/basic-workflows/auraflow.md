---
layout: page.njk
lang: ja
section: basic-workflows
slug: auraflow
navId: auraflow
title: "AuraFlow"
summary: "AuraFlow と Pony V7 をざっくり整理"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/2d37855d2969e9cd5515e4852dce230e.png"
tags: []
---

## AuraFlowとは

[AuraFlow](https://blog.fal.ai/auraflow/) は fal.ai が開発した **flow ベースの text2image モデル** です。Apache-2.0 ライセンスで公開され、軽量で扱いやすいのが特徴です。  

SDXLから移行しようという動きもいくつかあり、その代表例である **Pony V7** もここで紹介します。

---

## モデルのダウンロード

最新版は **AuraFlow v0.3** です。

- [aura_flow_0.3.safetensors](https://huggingface.co/fal/AuraFlow-v0.3/blob/main/aura_flow_0.3.safetensors)

```text
📂ComfyUI/
 └── 📂models/
     └── 📂checkpoints/
         └── aura_flow_0.3.safetensors
```

---

## text2image

基本的な組み方は SD1.5 / SDXL とほぼ同じです。

![](https://gyazo.com/b19fda7dcd1fd17b91e2f0eea9d70c8c){gyazo=image}

[](/workflows/basic-workflows/auraflow/aura_flow_0.3.json)

---

## Pony V7 : AuraFlow ベースのアニメ系モデル

[Pony Diffusion V6 XL](/ja/basic-workflows/sdxl-anime/#pony-diffusion-v6-xl) の後継として作られた、AuraFlow ベースのアニメ向けモデルです。

### モデルのダウンロード

- diffusion_model  
  - [pony-v7-base.safetensors](https://huggingface.co/purplesmartai/pony-v7-base/blob/main/safetensor/pony-v7-base.safetensors)
- text_encoder  
  - [text_encoder/model.fp16.safetensors](https://huggingface.co/purplesmartai/pony-v7-base/blob/main/text_encoder/model.fp16.safetensors)
- VAE  
  - [vae/diffusion_pytorch_model.fp16.safetensors](https://huggingface.co/purplesmartai/pony-v7-base/blob/main/vae/diffusion_pytorch_model.fp16.safetensors)

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

- 🟦 `T5TokenizerOptions`  
  - トークン数が設定値以下だった場合に padding で埋めるノードです。入れても入れなくても大きな差はありません。
- 公式の workflow は `euler_normal` でしたが線が暴れやすかったため、ここでは **CFG++（改良版 CFG ガイダンス）** を使用しています。  
  - 従来の CFG を滑らかに調整するもので、線が安定しやすくなります。
