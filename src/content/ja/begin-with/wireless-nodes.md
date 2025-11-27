---
layout: page.njk
lang: ja
section: begin-with
slug: wireless-nodes
navId: wireless-nodes
title: "無線化"
summary: "ノード間のワイヤレス通信について"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/f7990ba8ce62b43de894da9eba20cb20.png"
---

## ノードの無線化とは

ノードベースツールの最大の特徴は、各機能を線で繋いでいくだけで複雑な処理ができることです。
その反面、ノードと線の数が増えれば増えるほど、画面がごちゃごちゃになり（スパゲッティ化し）、何をしているのかさっぱり分からなくなる問題も抱えています。

そんな中、「データをワイヤレスで飛ばせばいいんじゃない？」という発想が出るのは自然な流れでしょう。

---

## カスタムノード

無線化を実現するカスタムノードはいくつか存在します。
[chrisgoringe/cg-use-everywhere](https://github.com/chrisgoringe/cg-use-everywhere) も有名ですが、最近ではよりシンプルで扱いやすい **KJNodes** のセットがよく使われています。

- **[kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)**

---

### Set & Get ノード

![](https://gyazo.com/fd49b6cc5d0da73a01189cc407104371){gyazo=image}

[](/workflows/begin-with/wireless-nodes/Set_Get.json)

使い方は非常にシンプルです。

- 1. **Setノード** (送信側):
    - データを入力し、`Constant` に任意の名前（ID）を設定します。
- 2. **Getノード** (受信側):
    - `Constant` に送信側と同じ名前を設定すると、離れた場所でもデータを受け取ることができます。

---

## 便利だけど多用は禁物

![](https://i.gyazo.com/0128233c9681fdaa4ad62d7afe59d2aa.png){gyazo=image}

[](/workflows/begin-with/wireless-nodes/Set_Get_image2image.json)

[リーダブルノードのすゝめ](/ja/begin-with/readable-nodes/) でも触れましたが、ノードツールの最大の利点は「繋がった線を見るだけでデータの流れが掴める」ことです。
いたずらに無線化すると、「この画像データ、どこから飛んできたの？」と処理の流れを追うのが非常に困難になります。

一つのworkflowのあらゆる場所に何度も何度も同じ変数が出てくるような場合は、無線化が便利であったりしますが、そもそも、それほど大きいworkflowは小さく分割すべきかもしれませんね(；・∀・)
