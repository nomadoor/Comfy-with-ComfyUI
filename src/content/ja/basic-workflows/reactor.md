---
layout: page.njk
lang: ja
section: basic-workflows
slug: reactor
navId: reactor
title: "ReActor"
created: 2025-12-09
updated: 2026-03-02
summary: "ReActorを使ったFaceSwap（顔入れ替え）"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/c75a0142055d05c154f7d8cf03b3ca56.png"
tags: ["id-transfer"]
---

## ReActorとは？

**face swap** は deepfake として何年も前から存在しますが、当時は同じ人物の顔画像を何百枚も集めて学習させる必要がありました。

ReActor（正確にはそのコアである **InsightFace** ）は、1枚の顔写真だけを参照にして、別の画像や動画に映っている顔を差し替えることができます。

現在は拡散モデルベースのより柔軟な ID 転送手段も登場していますが、ReActor は「比較的軽い」「良い意味で柔軟性がなく安定している」といった理由から、現在でもよく使われている手法です。

---

## カスタムノードとインストール

- [Gourieff/ComfyUI-ReActor](https://github.com/Gourieff/ComfyUI-ReActor?tab=readme-ov-file#installation)

### インストール方法

このノードは導入が少し難しく、ComfyUI Manager からインストールするだけでは動きません。

- 1. ComfyUI Manager から ReActor ノードをインストール。
- 2. `ComfyUI/custom_nodes/ComfyUI-ReActor` にある `install.bat` を実行。
- 3. Windows ユーザーはこれだけでは動かず、別途 InsightFace のインストールが必要です。
  - 詳しくは：[InsightFaceのインストール方法](/ja/notes/insightface-install/) を参照してください。
- 4. ComfyUI を再起動。

---

## FaceSwap（inswapper）

基本的な FaceSwap は、ReActor ノードに「元画像」と「参照顔画像」を入力するだけです。

![](https://gyazo.com/bc67dfff78c431c688d8ec1a4937969e){gyazo=image}

[](/workflows/basic-workflows/reactor/ReActor_Fast_Face_Swap.json)

- `input_image`  
  - 顔を入れ替えたい元の画像を接続します。
- `source_image`  
  - 参照したい顔画像（1枚の顔写真など）を接続します。

その他、よく使うパラメータを簡単にまとめます。

- `face_restore_model`
  - `GFPGANv1.3` を選ぶと、FaceSwap 後に GFPGAN による顔修復をかけます。
  - `inswapper` は顔の部分を 128px 四方にリサイズして処理するため、そのままだとディテールが失われやすく、このような後処理が重要になります。
  - ただ、どうしてもノッペリした印象になりやすい点には注意が必要です。
- `detect_gender_input` / `detect_gender_source`
  - 入力画像・参照画像の性別を自動判定するかどうかの設定です。
  - 性別の違いによって結果が不自然になる場合は、ON/OFF を切り替えて試してみるとよいでしょう。
- `input_faces_index`
  - 元画像の中に複数人の顔がある場合、どの顔を対象にするかを指定します。
  - `0` が最初に見つかった顔、`1` が2人目……というイメージです。
  - `0,1` のようにカンマ区切りで複数指定すると、複数人を同時に置き換えることもできます。
- `source_faces_index`
  - 参照側の `source_image` に複数人の顔がある場合、どの顔を使うかを `input_faces_index` と同じように指定します。

---

## 別の FaceSwap モデルを使う（HyperSwap）

先程使用した inswapper は、古いモデルということもありますが、社会的影響を考え、開発者によって高解像度版が封印されています。  
代替モデルはいくつかありますが、FaceFusion Labs が開発している HyperSwap を使ってみましょう。

### モデルのダウンロード

- [hyperswap_1a_256.onnx](https://huggingface.co/facefusion/models-3.3.0/blob/main/hyperswap_1a_256.onnx) 
```text
📂ComfyUI/
  └── 📂models/
      └── 📂hyperswap/
          └── hyperswap_1a_256.onnx
```

### workflow の設定

![](https://gyazo.com/bab77e7c89d65dff9a4ebedb17a46375){gyazo=image}

[](/workflows/basic-workflows/reactor/ReActor_hyperswap.json)

- ReActor ノードの `swap_model` を、`hyperswap_1a_256` に変更します。

---

## NSFWフィルターについて

リポジトリが削除されないようにするため、ReActor には NSFW な画像に対するフィルターが入っています。  
そのため、NSFW を含む画像を使った場合拒否されます。

あまり詳しくはいいませんが、簡単な手段で回避することは出来ます。  
( [Detailer](/ja/basic-workflows/detailer/) が役に立つ……かもしれません )
