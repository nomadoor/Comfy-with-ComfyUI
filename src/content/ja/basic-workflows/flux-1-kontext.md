---
layout: page.njk
lang: ja
section: basic-workflows
slug: flux-1-kontext
navId: flux-1-kontext
title: "Flux.1 Kontext"
created: 2025-12-11
updated: 2026-03-02
summary: "Flux.1 Kontextで指示ベース画像編集を行う。"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/79c075e47d999e282c8a2cd3c05f10ef.png"
tags: ["instruction-based-image-editing","collage-refine"]
---

## Flux.1 Kontextとは？

Flux.1 Kontext は、[Flux.1](/ja) をベースにした指示ベース画像編集モデルです。

nano bananaを始めとするAI画像編集というタスクの流行に火をつけたのは間違いなくこのモデルでしょう。

Flux.1 と同じように `pro`/`max`/`dev`の3つのバリエーションがありますが、ローカルで使用出来るのは `dev` のみです。


---

## 指示ベース画像編集とは？

画像とテキストの指示を入力すると、その指示に従って画像を編集してくれるモデルを、このサイトでは **指示ベース画像編集モデル** と呼んでいます。

例えば、写真に写っている女性の髪を赤くしたいと思ったとします。  
これまでは、髪をマスクし、髪型は変更したくないのでControlNet Cannyを追加、その上で「赤い髪の女性の写真」などというプロンプトで inpainting をしていました。

指示ベース画像編集ならば簡単です。画像をモデルに渡して「女性の髪を赤くして」とプロデューサーがデザイナーに頼むように**指示**するだけです。

表情を変えたり、邪魔なオブジェクトを削除したり、絵柄を変換したり。

全て、ひとつのモデルとプロンプトだけで実現できてしまうのです。

---

## モデルのダウンロード

Kontext でも、基本的な構成は通常の Flux.1 と同じです。

* diffusion_models

  * [flux1-dev-kontext_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/flux1-kontext-dev_ComfyUI/blob/main/split_files/diffusion_models/flux1-dev-kontext_fp8_scaled.safetensors)

* clip / T5 / VAE

  * [clip_l.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/clip_l.safetensors)
  * [t5xxl_fp8_e4m3fn_scaled.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/t5xxl_fp8_e4m3fn_scaled.safetensors)
  * [ae.safetensors](https://huggingface.co/Comfy-Org/z_image/blob/main/split_files/vae/ae.safetensors)

* gguf（任意）

  * [flux1-kontext-dev.gguf](https://huggingface.co/QuantStack/FLUX.1-Kontext-dev-GGUF/blob/main/flux1-kontext-dev.gguf)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── flux1-dev-kontext_fp8_scaled.safetensors
    ├── 📂clip/
    │   ├── clip_l.safetensors
    │   └── t5xxl_fp8_e4m3fn_scaled.safetensors
    ├── 📂vae/
    │   └── ae.safetensors
    └── 📂unet/
        └── flux1-kontext-dev.gguf      ← gguf を使う場合のみ
```

---

## workflow（基本形）

Kontext の workflow 自体は、通常の Flux.1 に`ReferenceLatent` を追加しただけのシンプルな構成です。

![](https://gyazo.com/b872b5de146a585c0c9745168d5f1dae){gyazo=image}

[](/workflows/basic-workflows/flux-1-kontext/Flux.1-Kontext.json)

* 🟪 `flux1-dev-kontext_fp8_scaled.safetensors` を読み込みます。
* 🟩 `FluxKontextImageScale` ノードで、入力画像を Kontext 向けの解像度にリサイズします。
  - Flux 推奨の解像度があるのですが、その中から、**アスペクト比が近い解像度が自動的に選ばれます**。
* 🟩 リサイズした画像を latent に変換し、`ReferenceLatent` に接続します。

---

## プロンプトの書き方

基本的に公式のプロンプトガイドに従います。
- [FLUX.1 Kontext Prompting Guide](https://docs.bfl.ai/guides/prompting_guide_kontext_i2i)

とはいえ、特別な記法があるわけではありません。
**「◯◯を△△して」** という形で、やりたいことをそのまま英語で書けばだいたい動いてくれます。

もし、変更したくないところまで変わってしまうとき（例：髪型だけ変えたいのに背景まで変わる）には、次のように「変えてほしくない条件」を明示します。

- e.g. `Keep the person's pose, position, and size the same.`

> とはいえ、モデルの性能として、指示にうまく従わないこともよくあります。  
> まだまだ、あまり多くを求めすぎてはいけません。

---

## できること

{% mediaRow img="https://gyazo.com/79c075e47d999e282c8a2cd3c05f10ef {gyazo=image}", width=50, align="left" %}
### 画像編集

```text
Change the hair to a messy blonde bob.
```

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/677d45b54c4f1c9c278ae230e7b000b9 {gyazo=image}", width=50, align="left" %}
### 絵柄変換

```text
This character is made out of Lego blocks.
```

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/7a409e39ee00b1766ee164df76b0ac7c {gyazo=image}", width=50, align="left" %}
### オブジェクト除去

```text
Remove the woman
```

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/49bb5579217513e0b774d0952579bd4f {gyazo=image}", width=50, align="left" %}
### テキスト置き換え

```text
Replace [OPEN] with [FLUX]
```

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/6abbbb3aacaddf5df09d459f29466e93 {gyazo=image}", width=50, align="left" %}
### サブジェクト転送

```text
A photo of a girl who received a stuffed elephant as a Christmas present.
```

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/84db6461613ef8253aa130778cdb4305 {gyazo=image}", width=50, align="left" %}
### ガイドによる位置指定

```text
Add a sailing ship to the box position.
```

{% endmediaRow %}


{% mediaRow img="https://gyazo.com/dae38a4ef8ee07c4a5922992c585578a {gyazo=image}", width=50, align="left" %}
### 雑コラのリファイン

手動で作ったコラージュ画像を **溶け込ませる** という編集します。


```text
Transform the flat duck sticker into a realistic plush duck toy with the same blue hat and place it in the woman’s arms so she is naturally hugging it. Also turn the outlined pendant lamp into a realistic lamp, removing the white sticker edges and matching the scene’s lighting, color, and perspective.
```

この能力を底上げするLoRAもあります。

- [Place it Flux Kontext LoRA](https://civitai.com/models/1780962/place-it-flux-kontext-lora)

{% endmediaRow %}
