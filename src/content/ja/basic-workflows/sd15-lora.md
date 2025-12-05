---
layout: page.njk
lang: ja
slug: sd15-lora
navId: sd15-lora
title: "LoRA"
summary: "Stable Diffusion 1.5でのLoRA"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: ""
---

## LoRAとは？

[Textual Inversion](/ja/basic-workflows/sd15-textual-inversion/) は「テキストでは説明しづらい見た目」を 1 つの単語に押し込める技術でしたが、モデルがもともと知らないものをゼロから描けるようにする力はありません。

「モデルが元々描けなかったものも描けるようにしたい！」と思ったとき、従来はモデル全体をファインチューニングする必要がありました。  
しかし、学習にかなりのコストがかかります。

そこで使われるようになったのが、もともと LLM で使われていた **LoRA（Low-Rank Adaptation）** です。

LoRA は、モデルの重みそのものを書き換えるのではなく、「変更分」だけを小さな追加データとして外部に保存する方式です。  
ベースモデルに対して、あとから拡張パックを読み込むような感覚で、新しいスタイルやキャラクターを足せます。

---

## LoRAを適用した text2image

### LoRAのダウンロード

今回は例として、ピクセルアート風にする LoRA を使ってみます。

- [8bitdiffuser 64x](https://civitai.com/models/185743)
-  ```text
    📂ComfyUI/
      └── 📂models/
          └── 📂loras/
              └── PX64NOCAP_epoch_10.safetensors
    ```

### workflow

![](https://gyazo.com/c2eee3ec1ec36c052a302dc344ff1a69){gyazo=image}

[](/workflows/basic-workflows/sd15-lora/SD1.5_lora.json)

- 🟩`Load LoRA`ノードを追加します。
  - `Load Checkpoint` と `CLIP Text Encode` / `KSampler` の間に挟む形で接続します。
  - **MODEL** と **CLIP** の両方を `Load LoRA` 経由で通す必要があります。
- `strength_model` / `strength_clip` : LoRA の適用強度です。基本は `1.0` ですが、効きすぎるときは下げます。
- 🟨トリガーワード
  - LoRA を適用しただけで、内部的にはドット絵を描く能力がベースモデルに上乗せされています。
  - ただし、その能力を確実に引き出すには、作者が学習時に使ったワードをプロンプトに含める必要があります。
  - これをトリガーワードと呼びます。今回の LoRA では `pixel_art` がトリガーワードになっています。

---

## Flux.1以降のモデルと LoRA

### 画像生成AIの設計思想の変更

**Stable Diffusion 1.5** や **SDXL** では、LoRAを適用する際、画像生成の核となる拡散モデルと、プロンプトを解釈するテキストエンコーダの両方を学習対象とするのが一般的でした。

しかし、**Flux.1**以降のモデルでは、テキストエンコーダにT5やQwenといった大規模な言語モデルが採用されるようになりました。  
これらは小さなChatGPTのようなもので、すでに汎用的な言語理解能力があり、画像生成のために再学習させるのは非効率、どころか性能が落ちる可能性すらあります。

そのため、最新のモデルではテキストエンコーダは固定し、拡散モデル本体だけ学習する設計が主流になっています。

### LoRAも追随

LoRAもこれに追随します。

SDXLまでは、拡散モデルとテキストエンコーダ両方を学習していましたが、  
Flux.1以降のモデルでは、LoRAの学習・適用も、拡散モデルのみになっています。

### ComfyUI workflowの変化

この新しい設計を反映し、ComfyUIでは `LoraLoaderModelOnly`ノードが用意されています。  
これは名前の通り、MODEL（拡散モデル）にのみLoRAを適用するノードです。

![](https://gyazo.com/87dc794e1f87940a585696bf82df517d){gyazo=image}

[](/workflows/basic-workflows/sd15-lora/Flux.1_lora.json)