---
layout: page.njk
lang: ja
section: basic-workflows
slug: flux1
navId: flux1
title: "Flux.1"
summary: "Flux.1の基本とComfyUIでの使い方"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/9fd52a56e1f6b7cbf8cd96ca78484d02.png"
tags: []
---

## Flux.1とは？

**Flux.1** は、Stable Diffusion の開発メンバーが立ち上げた Black Forest Labs による画像生成モデルです。  
単なる「高性能版」というだけでなく、アーキテクチャの面でも大きな転換点になったモデルです。

- 画像生成のコアが、従来の UNet から Transformer（DiT）ベースに置き換えられた  
- テキストエンコーダとして、T5 系の LLM が採用された  

この組み合わせにより、大規模なデータセットから効率よく学習できるようになり、  
LLM の文章理解力をそのまま活かしやすくなったことで、現在主流となっている画像生成モデル群への分岐点になりました。

Flux.1 には 3 つのバリエーションがあります。

- **Flux.1 pro**  
  - API 経由のみで利用できる版で、モデルウェイトは公開されていません。
- **Flux.1 dev**  
  - pro を蒸留した研究・検証向けモデルです。ローカル環境で最もよく使われているのはこちらです。
- **Flux.1 schnell**  
  - dev をさらに蒸留したモデルで、Apache-2.0 という比較的ゆるいライセンスで公開されています。

---

## モデルのダウンロード

ここでは、`dev` / `schnell` の fp8 版を使用します。

- diffusion model  
  - [flux1-dev-fp8.safetensors](https://huggingface.co/Comfy-Org/flux1-dev/blob/main/flux1-dev-fp8.safetensors)  
  - [flux1-schnell-fp8.safetensors](https://huggingface.co/Comfy-Org/flux1-schnell/blob/main/flux1-schnell-fp8.safetensors)  
- CLIP / T5  
  - [clip_l.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/clip_l.safetensors)  
  - [t5xxl_fp8_e4m3fn_scaled.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/t5xxl_fp8_e4m3fn_scaled.safetensors)  
- VAE  
  - [ae.safetensors](https://huggingface.co/black-forest-labs/FLUX.1-schnell/blob/main/ae.safetensors)  

- ```text
  📂ComfyUI/
  └── 📂models/
      ├── 📂diffusion_models/
      │   ├── flux1-dev-fp8.safetensors
      │   └── flux1-schnell-fp8.safetensors
      ├── 📂clip/
      │   ├── clip_l.safetensors
      │   └── t5xxl_fp8_e4m3fn_scaled.safetensors
      └── 📂vae/
          └── ae.safetensors
  ````

---

## text2image - Flux.1 [dev]

![](https://gyazo.com/2b89975e1b96fcbbd56880d31a0cd9c4){gyazo=image}

[](/workflows/basic-workflows/flux1/flux1-dev.json)

Flux.1 dev / schnell は、**CFG を 1.0 に固定した状態を蒸留したモデル** です。
そのため、従来の Stable Diffusion のような `CFG scale` や Negative Prompt の調整は前提としておらず、**Negative Prompt は一切効きません**。

* cf. [CFG / CFG = 1 の特別な意味](/ja/ai-capabilities/cfg/#cfg-1-の特別な意味)

私は Negative 側のプロンプトを空にしていますが、他の workflow では Negative 用の `CLIP Text Encode` ノードの代わりに `ConditioningZeroOut` ノードを差しているものもあります。

いずれの場合も、Negative 側の条件は 0 倍されるため、**何を書いても出力には影響しません**。

---

## text2image - Flux.1 [schnell]

Flux.1 [dev] と基本的な構成は同じです。

![](https://gyazo.com/ca565f4b96ddd04c336b65fffef6fec9){gyazo=image}

[](/workflows/basic-workflows/flux1/flux1-schnell.json)

---

## LoRA - Flux.1 [dev]

ポートレート画像の質を上げる LoRA を使ってみましょう。

* [AWPortrait-FL-lora.safetensors](https://huggingface.co/Shakker-Labs/AWPortrait-FL/blob/main/AWPortrait-FL-lora.safetensors)

![](https://gyazo.com/292030d5a8ffc53619232546c7ce750b){gyazo=image}

[](/workflows/basic-workflows/flux1/flux1-dev_lora.json)

* 🟪 [LoRA](/ja/basic-workflows/sd15-lora/) でも書いていますが、Flux 以降はテキストエンコーダを学習しなくなったため、`Load LoRA` ノードではなく、**重みのみに適用する** `LoraLoaderModelOnly` ノードを使用します。

---

## ControlNet - Flux.1 [dev]

Flux.1 向けの ControlNet モデルもいくつか公開されていますが、ここでは Union 型のモデルを例に紹介します。

### モデルのダウンロード

* [FLUX.1-dev-ControlNet-Union-Pro-2.0-fp8/diffusion_pytorch_model.safetensors](https://huggingface.co/ABDALLALSWAITI/FLUX.1-dev-ControlNet-Union-Pro-2.0-fp8/blob/main/diffusion_pytorch_model.safetensors)

  * 分かりにくいので、`FLUX.1-dev-ControlNet-Union-Pro-2.0-fp8.safetensors` などにリネームしてください。

- ```text
  📂ComfyUI/
  └── 📂models/
      └── 📂controlnet/
          └── FLUX.1-dev-ControlNet-Union-Pro-2.0-fp8.safetensors
  ```

### workflow

ControlNet-Union は、複数の代表的な ControlNet を 1 つのモデルに内蔵しています。

![](https://gyazo.com/9e7cb79f7ca50fe5946ac9f232a552c6){gyazo=image}

[](/workflows/basic-workflows/flux1/FLUX.1-dev-ControlNet-Union-Pro_depth.json)

* 🟩 Flux を使った image2image の workflow に ControlNet が挿入されただけです。

  * image2image といっても `denoise` が 1.0 なので、挙動としては text2image とほぼ同じです。
  * 入力画像と同じサイズの画像が、少ないノードで作れるため、私はこの形をよく使います。
* 🟩 `SetUnionControlNetType` に、使いたい ControlNet のタイプを入力します。

  * 基本的には `auto` で構いません。

---

## GGUF（Flux.1 を軽量化する）

最後に、**GGUF 版 Flux.1** について少し触れておきます。

もともと GGUF は LLM を軽量化するためのフォーマット（量子化されたウェイト形式）ですが、
これを Flux.1 に応用することで、**VRAM 使用量を減らしつつ、それなりの速度で回す** ことができます。

### カスタムノード

* [city96/ComfyUI-GGUF](https://github.com/city96/ComfyUI-GGUF)

### モデルのダウンロード

性能とモデルサイズのバランスで、いくつかバリエーションがあります。
PC スペックや用途に合わせて選んでください。

* [FLUX.1-dev-gguf](https://huggingface.co/city96/FLUX.1-dev-gguf/tree/main)
* [FLUX.1-schnell-gguf](https://huggingface.co/city96/FLUX.1-schnell-gguf/tree/main)

- ```text
  📂ComfyUI/
  └── 📂models/
      └── 📂unet/
          └── flux1-dev.gguf
  ```

### workflow

![](https://gyazo.com/f465ff82b48c4c7b5d5b9ce144f3dc8d){gyazo=image}

[](/workflows/basic-workflows/flux1/FLUX.1-dev-gguf.json)

* 🟪 `Load Diffusion Model` ノードを、`Unet Loader (GGUF)` ノードに差し替えます。
* ほかの CLIP / T5 / VAE 部分はそのままです。

  * T5 を GGUF に変えることもできますが、体感ではそこまで大きな効果はありません。

現在の多くのモデルで GGUF 版が用意されています。
**GGUF を使うことによるデメリットはほとんどない** ので、VRAM が足りないときは積極的に使ってみてください。
