---
layout: page.njk
lang: ja
section: basic-workflows
slug: sd15-ip-adapter
navId: sd15-ip-adapter
title: "IP-Adapter"
summary: "参照画像からスタイルや被写体を転送する元祖的な仕組み"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/64fdcae074a2a01943d7f5fff3aaa418.png"
tags: ["subject-transfer", "style-transfer"]
---

## IP-Adapterとは？

絵や写真を見ながら「これと同じ雰囲気で描いてほしい」と思っても、テキストだけで細部まで説明するのはほぼ不可能です。

そこで、「テキストを介さずに、AI に直接画像を見てもらう」仕組みがいくつか提案されてきました。  
その中でも、**スタイルや被写体の“転送”** に使われてきた古典的な手法のひとつが **IP-Adapter** です。

「reference2image」「[subject 転送](/ja/ai-capabilities/subject-transfer/)」の元祖的な位置づけだと思ってください。

---

## 必要なカスタムノード

- [cubiq/ComfyUI_IPAdapter_plus](https://github.com/cubiq/ComfyUI_IPAdapter_plus)

---

## SD1.5 × IP-Adapter

IP-Adapterにはいくつか種類がありますが、最もスタンダードなものをまずは試してみましょう。

### モデルのダウンロード

- IP-Adapter 本体（SD1.5 用）
  - [ip-adapter_sd15.safetensors](https://huggingface.co/h94/IP-Adapter/blob/main/models/ip-adapter_sd15.safetensors)
- CLIP Vision モデル
  - [model.safetensors](https://huggingface.co/h94/IP-Adapter/blob/main/models/image_encoder/model.safetensors)
    - 分かりにくいので `OpenCLIP-ViT-H-14` にリネームしてください。
```text
📂ComfyUI/
  └── 📂models/
      ├── 📂clip_vision/
      │   └── OpenCLIP-ViT-H-14.safetensors
      └── 📂ip_adapter/
          └── ip-adapter_sd15.safetensors
```

### workflow

![](https://gyazo.com/6e8376130553997cbd30696c6700a601){gyazo=image}

[](/workflows/basic-workflows/sd15-ip-adapter/ip-adapter_sd15.json)

- 🟩 `IPAdapter Advanced` ノードに各種モデルと参考にしたい画像を接続します。
- 🟦 `Prep Image For ClipVision` ノードで参考画像をクロップします。
  - 詳細は下に

---

## どこを「見て」いるか

![](https://gyazo.com/302c47a4eb43f19e7e8535ca40e8ed5c){gyazo=image}

IP-Adapter の「目」にあたる CLIP ViT-H-14 は、基本的に **224 × 224 の範囲**しか見ていません。  
そのため、縦長の人物写真をそのまま渡すと、顔や足が切れたり、体の真ん中あたりだけを手がかりに特徴を取ってしまったりします。

どの部分を基準にしてほしいか決めたい場合は、上のworkflowのように先にリサイズ・クロップをしてください。

---

## IP-Adapterの主なモデル

いくつか派生モデルがありますが、参照画像から「何をどこまで借りてくるか」は、モデルごとにだいぶ性格が違います。  

### ip-adapter-plus_sd15

構図やオブジェクトの位置を強めに転送するモデルです。

![](https://gyazo.com/ecbbe99d3410a850767aaf506645952b){gyazo=image}

[](/workflows/basic-workflows/sd15-ip-adapter/ip-adapter-plus_sd15.json)

- [ip-adapter-plus_sd15.safetensors](https://huggingface.co/h94/IP-Adapter/blob/main/models/ip-adapter-plus_sd15.safetensors)
- 参照画像とかなり近い構図になる


### ip-adapter_sd15_light

テキストプロンプト優先寄りのモデルです。

![](https://gyazo.com/422b44322caef6fe6fdec8c7d37f54e3){gyazo=image}

[](/workflows/basic-workflows/sd15-ip-adapter/ip-adapter_sd15_light.json)

- [ip-adapter_sd15_light.safetensors](https://huggingface.co/h94/IP-Adapter/blob/main/models/ip-adapter_sd15_light.safetensors)
- テキストの指示を強めに残す
- 参照画像は主に「スタイル・雰囲気」のヒント程度

### ip-adapter-plus-face_sd15

顔（頭部）に特化した IP-Adapter です。

![](https://gyazo.com/bba6f8053f411bee64044c141d4632c0){gyazo=image}

[](/workflows/basic-workflows/sd15-ip-adapter/ip-adapter-plus-face_sd15.json)

- [ip-adapter-plus-face_sd15.safetensors](https://huggingface.co/h94/IP-Adapter/blob/main/models/ip-adapter-plus-face_sd15.safetensors)
- 顔立ち・輪郭・目鼻立ちなどをかなり強く固定する

### ip-adapter-faceid-plusv2_sd15

CLIPだけでなく、insightfaceの顔認識モデルも組み合わせたモデルです。

![](https://gyazo.com/ded09a4d7a09bb7cfca5ccfa684951dc){gyazo=image}

[](/workflows/basic-workflows/sd15-ip-adapter/ip-adapter-faceid-plusv2_sd15.json)

- [ip-adapter-faceid-plusv2_sd15.bin](https://huggingface.co/h94/IP-Adapter-FaceID/blob/main/ip-adapter-faceid-plusv2_sd15.bin)
- plus-faceよりも柔軟にIDを転送します。
- 🟨 `IPAdapter FaceID`ノードを使用します。

---

## SDXL用モデルリンク

もしSDXLも試してみたい方向けに、SDXL用のモデルリンクの一覧です。

- [ip-adapter_sdxl_vit-h](https://huggingface.co/h94/IP-Adapter/blob/main/sdxl_models/ip-adapter_sdxl_vit-h.safetensors)
- [ip-adapter-plus-face_sdxl_vit-h](https://huggingface.co/h94/IP-Adapter/blob/main/sdxl_models/ip-adapter-plus-face_sdxl_vit-h.safetensors)
- [ip-adapter-plus_sdxl_vit-h](https://huggingface.co/h94/IP-Adapter/blob/main/sdxl_models/ip-adapter-plus_sdxl_vit-h.safetensors)
- [ip-adapter-faceid-plusv2_sdxl](https://huggingface.co/h94/IP-Adapter-FaceID/blob/main/ip-adapter-faceid-plusv2_sdxl.bin)