---
layout: page.njk
lang: ja
section: data-utilities
slug: mask-alpha
navId: mask-alpha
title: "マスクとアルファチャンネル"
summary: "マスクの概念と透過画像の扱いについて"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/bd1a30f0d9562418f2fd74c7d9dd6f1e.png"
---

## マスクとは？

![](https://i.gyazo.com/bd1a30f0d9562418f2fd74c7d9dd6f1e.png){gyazo=image}

マスクとは、画像のどの部分を処理の **「対象にするか / 除外するか」** を指示するための白黒画像です。

- **白**: 処理する（適用する）
- **黒**: 処理しない（保護する）
- **グレー**: 強度を調整（※ただし機能による）

### AIにおけるマスク

![](https://i.gyazo.com/3b4d37c9bb4a46d514f2fc77234718f8.png){gyazo=image}

画像生成AIにおいては、主に画像の一部分だけを描き直す **Inpainting** で使用されます。

白い部分だけをAIが再生成し、黒い部分は元の画像をそのまま残します。

> **注意点：**
> 通常のInpaintingでは、グレー（半透明）のマスクは扱えないため、勝手に白か黒かの二値として処理されます。
>
> グラデーションのあるマスクを使って「うっすら変化させる」ようなことをしたい場合は、**Differential Diffusion** という特殊な技術が必要になります。

---

## アルファチャンネルとは？

![](https://gyazo.com/cf9be566f77d85571b29a2b5597121cb){gyazo=image}

通常の画像は **R(赤)・G(緑)・B(青)** の3つのチャンネルで色が表現されていますが、背景が透けている画像（PNGなど）には、これに加えて **A(アルファ)** というチャンネルが含まれています。
これが透明度を司る情報です。

### ComfyUIでの透過画像の扱い

ここが少しややこしいポイントですが、Stable Diffusion自体は透過画像を直接扱うことができません。
そのため、ComfyUIに透過PNG画像を読み込むと、内部で **「RGB画像」と「マスク」** の2つに分離されます。

![](https://i.gyazo.com/dbe187645fd186d20f936f226a79b926.png){gyazo=image}

`Load Image` ノードの出力を見てみましょう。

- **IMAGE (RGB)**
  - アルファチャンネルの情報が消えるため、透明だった部分は**黒**で塗りつぶされます。
- **MASK**
  - アルファチャンネル（透明度）の情報が抽出されます。
  - ComfyUIでは、**透明だった部分が「白」** として表現されます。

### 一般的なソフトとの違いに注意

![](https://i.gyazo.com/e3ba8dcc1452e3ed88512250b0c81d06.png){gyazo=image}


多くのソフトでは「透明部分＝黒」としてマスクが作られるため、PhotoshopやAffinity Photoなどの画像編集ソフトに慣れている人は混乱するかもしれませんが、別物と考えてください。

処理する部分はマスクの白い部分 → 白い部分にアルファチャンネルが付加され透明画像に、という流れを汲めば理解しやすいと思います。

---

## RGBAの結合と分離

処理が終わった後、再び背景を透過させて保存したい場合はどうすればよいでしょうか？

### 🟨Join Image With Alpha ノード

`IMAGE`（RGB画像）と `MASK` を合体させて、1枚の **RGBA画像（透過画像）** に変換します。
これを `Save Image` ノードに繋げば、透過PNGとして保存できます。

### 🟪Split Image With Alpha ノード

逆に、RGBA画像を RGB と MASK に分離するノードです。

![](https://gyazo.com/b05103b1633b9a4b0fbfdd96063499c2){gyazo=image}

[](/workflows/data-utilities/mask-alpha/Join-Split_Image_with_Alpha.json)

### 🚨 エラーの罠：RGBAとRGBの混同

ComfyUIのワイヤー上では、RGB画像(3チャンネル)も RGBA画像(4チャンネル)も、同じ **`IMAGE`** 型として流れます。見た目で区別がつきません。

しかし、AI（KSamplerやVAE）は基本的に3チャンネルのRGB画像しか受け付けません。
そのため、うっかり `Join Image With Alpha` した後のRGBA画像を `VAE Encode` などに繋ぐと、以下のようなエラーが出ます。

```bash
RuntimeError: Given groups=1, ... expected input to have 3 channels, but got 4 channels instead
```

「3チャンネル期待してたのに4チャンネル来たぞ！」と怒られたら、どこかで画像がRGBAになっていないか疑ってください。

背景切り抜き系のカスタムノードなどは、出力がいきなりRGBAになっていることがあります。