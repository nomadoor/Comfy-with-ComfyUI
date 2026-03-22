---
layout: page.njk
lang: ja
section: ai-capabilities
slug: segmentation
navId: segmentation
title: "セグメンテーション"
summary: "マスクをつくるために画像を分ける技術（主にSAM系）"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/4a56caa5986a2c2403dcad74d1bf1874.png"
---

## セグメンテーションとは？

セグメンテーションというと実は色々な種類があるのですが、ComfyUIにおける文脈では、**ポイントやBBOX、マスク・テキストで指定したオブジェクトの形のマスクを作る**技術です。

---

## マッティングとの違い

マッティングに似ていると感じるかもしれませんが、以下の大きな違いがあります。

- **マッティング**  
  - 「前景」か「背景」かの二択でマスクを作る

- **セグメンテーション**  
  - 任意の物体を切り抜く（マスクを作る）ことが目的

ではマッティングがセグメンテーションの下位互換か、というと全くそういうわけではなく、そもそも役割が違います。

-  分類タスク寄りなセグメンテーション
-  透過表現も可能な高品質な切り抜きが出来るマッティング
---

## SAM

> ![](https://gyazo.com/109335e3e675b7bd8beb9f77bc489829){gyazo=loop}
> [Introducing Meta Segment Anything Model 3 and Segment Anything Playground](https://ai.meta.com/blog/segment-anything-model-3/)

ComfyUIで「セグメンテーション」といったとき、実際に使われているのはほぼ**SAM（Segment Anything）系のモデル**です。

任意の物体を切り抜く（マスクを作る）ことが目的といいましたが、そのためには、AI が「その物体の形」をある程度理解している必要があります。

例えば机の上にフルーツバスケットが置かれているとして、りんごを切り抜きたいと思っても、「りんご」の形を知っていなければどこまでをりんごとして扱っていいのかがわかりません。これを実現したのが **SAM** です。

### 主なモデル

- **SAM**
  - Meta発表の初期モデル。
  - 任意の場所をクリックするだけで、その領域のマスクを返します。

- **[HQ-SAM](https://github.com/SysCV/SAM-HQ)**
  - SAMをベースにマスク品質を高めた派生モデルです。

- **SAM 2 / 2.1**
  - 動画にも対応。動画の中で同じ物体を追跡しながらマスクを出力できます。

- **SAM 3**
  - テキストで対象を指定することが可能に。
  - これまではポイントやBBOXで対象を指定する必要があったため、自動でマスクを作ろうと思うと物体検出と組み合わせる必要があった。

---

## ComfyUIでの使いどころ

切り抜きからinpaintingに至るまで、あらゆる場面で使用します。

他にも[Segment Anything Playground](https://aidemos.meta.com/segment-anything/gallery)には、顔をぼかしたり、背景を白黒にしたりといった例がいくつもあります。(ちなみにこれらのほとんどをComfyUIで再現することが出来ます。)

![](https://gyazo.com/8a13dabaec7771795dc4028d6e40abff){gyazo=image}

[](/workflows/ai-capabilities/segmentation/SAM3.json)

SAM 2.1以前はテキストでのオブジェクト指定ができなかったため、Grounding DINOやFlorence2といった[物体検出](/ja/ai-capabilities/object-detection)と組み合わせて使用されることが多かったですね。

SAM 3はテキストでの指定もできますが、物体検出という意味ではSAM以上のモデルは今後も出ると思うので、このコンビネーションは覚えておきましょう。

---

## 補足：SAM以前のセグメンテーション

教科書的には、セグメンテーションには次のような分類があります。

> ![](https://gyazo.com/010576fd5cce11b2da01333c92d39ae7){gyazo=image}
> [インスタンスセグメンテーション (Instance Segmentation, 実例分割)](https://cvml-expertguide.net/terms/dl/instance-segmentation/)

- **セマンティックセグメンテーション**
  - 各ピクセルに「クラスラベル」を付けます。
  - person / sky / road / buildingなど。何人いようが、すべて「person」クラスとしてまとめて扱います。

- **インスタンスセグメンテーション**
  - セマンティックに加えて、「個体ごとのマスク」を分けます。
  - person_1 / person_2 / person_3 …と個別に分割します。

SAMはこの2つを同時に行っているようなものですが、これらも自動運転や監視カメラの分野では今でも重要なタスクです。