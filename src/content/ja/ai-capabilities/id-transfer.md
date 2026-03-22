---
layout: page.njk
lang: ja
section: ai-capabilities
slug: id-transfer
navId: id-transfer
title: ID転送とFaceSwap
summary: 人物の顔や本人性を保ったまま、別シーンの画像を作る技術と顔差し替え
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: https://i.gyazo.com/877d8862f6e7f6dd3ec7fbeac5331cd9.png
---
## ID転送とFaceSwapとは？

ID転送は、Subject転送の中でも人物に特化したものです。特に**顔**の一貫性にこだわったものが多いです（個人的には、髪や体まで含めてIDとして扱ってほしいですが）。

FaceSwapは、生成AI登場以前からあったタスクです。古典的な方法は参照人物の顔の「仮面」を対象の人物の顔に被せるというものですが、ID転送の技術を使って、対象の顔の部分のみinpaintingすれば、より柔軟性のあるFaceSwapができます。

---

## LoRA

LoRAは「モデルが描けないものを後から描けるようにする」仕組みで、人物の画像を学習させることもできます。

学習が必要というデメリットさえ克服できれば、柔軟性と安定性は一級です。

---

## IP-Adapter系

Subject転送で扱ったIP-Adapterの技術を、IDに特化させた系譜がいくつかあります。

### IP-Adapter（無印）

IP-Adapterは、既存のtext2imageモデルに「画像からの条件入力」を追加するためのアダプタです。

画像から特徴ベクトルを取り出し、それをUNet内部に注入することで、生成結果に反映させます。人物の転送もできますが、Subjectやスタイルをざっくり反映させるほうがメインです。

### IP-Adapter-plus-face

公式の顔に特化したIP-Adapterモデルです。

![](https://gyazo.com/afe7232d9dd3cc54f5d8a2f1d956e15f){gyazo=image}

[](/workflows/ai-capabilities/id-transfer/ip-adapter-faceid-plusv2_sd15.json)

### IP-Adapter-FaceID

IP-Adapter-FaceID系は、顔認識モデル（InsightFace）と組み合わせてIDを強く固定するためのモデル群です。

**FaceID**では、CLIP画像埋め込みの代わりに「顔認識モデルからのFace ID埋め込み」を使い、さらにLoRAでID一貫性を高めています。

改良版の**FaceID-Plus**では、「ID用のFace ID埋め込み」と「顔構造用のCLIP画像埋め込み」を両方使うことで、顔の似せ方と顔の形・構造の安定性を両立させています。

### InstantID

厳密にはIP-Adapterの系譜ではないですが、同じく追加のアダプタを指すだけで使えるID転送に特化した手法です。

![](https://gyazo.com/a4213b144081a1267432874bfc09c1f4){gyazo=image}

[](/workflows/ai-capabilities/id-transfer/InstantID-simple.json)

IP-Adapter型の画像アダプタに加えて、顔認識モデルから得たID埋め込みと顔ランドマークを使う追加ネットワーク（IdentityNet）を組み合わせることで、一枚の顔写真からのID保持とテキスト編集のバランスを高めています。

個人的には、SDXLで使うならInstantIDが最強だと思います。

### PuLID-FLUX / InfiniteYou

時代が進み、ベースモデルの主戦場もSDXLからDiffusion Transformer系（FLUX系）に移ってきました。それに合わせて、Flux.1を前提としたID転送手法も登場しています。

**PuLID-FLUX**は、FLUX1-devをベースにした、ID特化のカスタマイズ手法です。Lightning T2Iなどの工夫により、追加の学習なしで「参照顔＋テキスト」でIDを保ったまま絵柄を変えることができます。

- ![](https://gyazo.com/7a87706872f7b195d46aeabafa6a399e){gyazo=image}

- [](/workflows/ai-capabilities/id-transfer/PuLID_Flux_ll.json)

**InfiniteYou**は、FLUX系のDiffusion TransformerをベースにしたID保持フレームワークです。Identity特徴をDiT本体に注入するモジュール（InfuseNet）と多段階の学習戦略により、IDの似せ方、テキスト整合性、画質を同時に高めることを目指しています。

---

## 指示ベース画像編集とID転送

Subject転送ができるので言わずもがなですが、「[指示ベース画像編集モデル](/ja/ai-capabilities/instruction-based-image-editing/)」も、ID転送に使えます。

---

## FaceSwap

FaceSwapは、ターゲットの人物の顔を参照人物の顔と入れ替える技術です。

### 古典的なFaceSwap（ReActor / InsightFace系）

ID転送というより、「仮面を作って被せる」に近い発想です。

顔検出とランドマーク検出で、顔の位置・向き・輪郭を推定し、ソース顔とターゲット顔をアフィン変換などで位置合わせして、マスクとブレンディングでターゲット側の顔部分をソース顔に置き換えます。

![](https://gyazo.com/1a0a81f044bd264db835ef99d40a37d1){gyazo=image}

[](/workflows/ai-capabilities/id-transfer/ReActor_Fast.json)

ComfyUIで使用できる代表的なものは、ReActor（InsightFaceベースのFaceSwap）ですが、倫理的観点からリポジトリが削除されたりと、不安要素が強い技術でもあります。

### ID転送を使った顔inpainting

ターゲットの人物の顔をマスクにしてinpaintingする際、ID転送の技術を使ってターゲットの顔を描き直す方法です。

ID転送の技術が未熟だったころは、ReActorでFaceSwapしてから、ID転送を使ったinpaintingでリファインする、という手法もありました（私が作ったworkflowの中でも、かなり人気のあるものです）。

[ReActorでFace SwapしたあとにInstantIDを使ってリファインする](https://scrapbox.io/work4ai/ReActor%E3%81%A7Face_Swap%E3%81%97%E3%81%9F%E3%81%82%E3%81%A8%E3%81%ABInstantID%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%83%AA%E3%83%95%E3%82%A1%E3%82%A4%E3%83%B3%E3%81%99%E3%82%8B)

![](https://gyazo.com/877d8862f6e7f6dd3ec7fbeac5331cd9){gyazo=image}

[](/workflows/ai-capabilities/id-transfer/ReActor_w_InstantID2.json)
