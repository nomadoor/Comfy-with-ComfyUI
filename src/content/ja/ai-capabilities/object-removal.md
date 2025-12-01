---
layout: page.njk
lang: ja
section: ai-capabilities
slug: object-removal
navId: object-removal
title: "オブジェクト除去"
summary: "画像から特定のものだけを消すタスクと、その代表的なやり方"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/e06eeccf0efa2e91773bb54acb31560a.gif"
---

## オブジェクト除去とは？

その名の通り、画像から特定のオブジェクトだけを消すタスクです。

人物・看板・電線・ゴミ・通行人など、写っていてほしくないものを自然に消して、背景を滑らかに埋めます。

---

## LaMa

拡散モデル登場以前は、LaMaのようなCNNベースのinpaintingモデルがSoTAとしてよく使われていました。

![](https://gyazo.com/4c0b962c3983bc3296da9b994c07f3b6){gyazo=image}

[](/workflows/ai-capabilities/object-removal/LaMa.json)

マスクされた領域を周囲のテクスチャで埋めることに特化しており、透かし除去などにも使われていましたね。

---

## inpaintingによる除去

もっとも素朴な方法は、マスクを用意して普通のinpaintingで塗りつぶすやり方です。

消したいオブジェクトにマスクを描き、背景に合わせたプロンプト（例：「背景の芝生だけ」「何もない床」）を書いて、inpaintingします。

![](https://gyazo.com/2cad88edab0d74b24f0fc78f528a320d){gyazo=image}

[](/workflows/ai-capabilities/object-removal/Remake_for_SDXL-Removing_Object_and_Filling_with_Background.json)

ただし、オブジェクトを消すどころか、別のオブジェクトを新たに増やしてしまうこともあり、オブジェクト除去としては安定しない場合もありました。

そのため、昔はinpaintingの下処理にLaMaを使っていたこともありましたが、現在のモデルには不要でしょう。

---

## 指示ベース画像編集でのオブジェクト除去

最近の指示ベース画像編集モデルでは、オブジェクト除去もかなり単純なタスクになりつつあります。

「この人を消して」「この標識を消して」「右下のロゴを消して」などと指示するだけです。

![](https://gyazo.com/84af7edfab7cd344f7654090b7957166){gyazo=image}

[](/workflows/ai-capabilities/object-removal/Qwen-Image-Edit-2509_object-removal.json)

### マスク不要という利点

inpaintingと比較して明確に優れている点は、**マスクを描かなくて済む**点です。

オブジェクト除去を自動化しようとすると、セグメンテーションでオブジェクトのマスクを作る必要がありますが、本来は対象オブジェクトだけではなく、**影やガラスに映った反射まで消さなければいけません**。これが難しいのです。

指示ベース画像編集モデルならば、それらも含めて消してくれます。