---
layout: page.njk
lang: ja
section: ai-capabilities
slug: depth-normal-map
navId: depth-normal-map
title: "深度推定とノーマルマップ生成"
summary: "画像から奥行きや立体感を取り出す技術"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/f6033924229b0ea961d8f22eb38bd6b2.png"
---

## 深度マップとノーマルマップとは？

**深度マップ（depth map）**
- 各ピクセルごとに「カメラからの距離」を持たせた画像です。
- 一般的には手前ほど白く、奥ほど黒くなります。

**ノーマルマップ（normal map）**
- 各ピクセルごとに「面の向き（法線ベクトル）」を RGB で符号化した画像です。
- どの方向を向いた面なのかが分かるので、リライトや 3D っぽい変形に使われます。

**単眼深度推定**
- 1 枚の RGB 画像から深度マップを推定するタスクです。  
- 本当に正確な深度を求めようと思ったら、LiDAR やステレオカメラなど複数センサーが必要ですが、単眼深度推定は「1 枚の写真だけから、擬似的な奥行き情報を復元しよう」という試みです。  
- 深度とノーマルは近い情報なので、両方を同時に推定できるモデルも多いですね。

---

## 単眼深度推定の代表モデル

### MiDaS / ZoeDepth（拡散モデル以前の定番）

拡散モデルが一般化する前は、MiDaS や ZoeDepth が単眼深度推定の定番モデルでした。

![](https://gyazo.com/8471cde6727e271aa05f0bad44797144){gyazo=image}

[](/workflows/ai-capabilities/depth-normal-map/MiDaS_Depth-Normal_Map.json)

- **MiDaS**
  - カメラパラメータがバラバラな「雑多な画像」からでも相対深度を推定できるように学習されたモデル。
  - 「相対的にどちらが手前か・奥か」が分かればよい用途で広く使われてきました。

- **ZoeDepth**
  - 相対深度とメートル単位の深度を統一的に扱うことを目指したモデル。

新しい workflow でこれを使う意味はあまりありませんが、古い workflow で見かけることがあるので、名前だけ覚えておきましょう。

### Depth Anything 系

最近の主流は **Depth Anything / Depth Anything V2 / V3** といった深度推定の基盤モデルです。

![](https://gyazo.com/69b8c5331c693c699d389f1c95935fff){gyazo=image}

[](/workflows/ai-capabilities/depth-normal-map/Depth_Anything_V2.json)

ComfyUI で深度マップを作るときは、ControlNet の前処理として使うのがほとんどだと思いますが、とりあえずこれを使っておけば OK です。

---

## 拡散モデル由来の深度・ノーマル推定

拡散モデルが普及してからは、「生成モデルが持っている世界知識を、他のタスクにも使おう」という方向の研究も出てきました。

誤解を恐れずいえば、**「深度マップ風に絵柄変換している」** ようなものです。

### Marigold

Marigold は Stable Diffusion 2 をベースに、「深度推定タスク用に微調整したモデル」です。

画像生成モデルを画像生成以外で使うというアイデアが他にあまり無かったため、当時はかなり注目されました。
ただ、1 枚画像生成しているのとほぼ同じだけの計算コストがかかるため、単なる下処理としては少々ヘビーです。

### Lotus

Lotus は、「拡散モデルのアーキテクチャを使うが、ノイズ予測ではなく深度や法線そのものを出す」タイプの dense prediction モデルです。

### LBM（Latent Bridge Matching）

LBM は Stable Diffusion XL をベースにした「1 ステップ image-to-image」のための枠組みですが、その中に深度推定 / 法線推定の派生モデルがあります。
