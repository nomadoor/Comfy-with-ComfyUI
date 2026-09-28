---
layout: page.njk
lang: ja
section: begin-with
slug: wireless-nodes
navId: wireless-nodes
title: "無線化"
created: 2025-11-26
updated: 2026-03-02
summary: "ノード間のワイヤレス通信について"
seoTitle: "ComfyUIのノードを無線化する：Set & Getノード"
seoDescription: "ワイヤを減らしてworkflowを整理する、ComfyUIのノード無線化の方法。KJNodesのSet / Getノードの使い方と、多用するとかえって読みにくくなる注意点を解説します。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
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

使い方は非常にシンプルです。

![](/media/begin-with/wireless-nodes/legacy_gyazo_fd49b6cc5d0da73a01189cc407104371.png){media=image}

[](/workflows/begin-with/wireless-nodes/set_get.json)


- 1. **Setノード** (送信側):
    - データを入力し、`Constant` に任意の名前（ID）を設定します。
- 2. **Getノード** (受信側):
    - `Constant` に送信側と同じ名前を設定すると、離れた場所でもデータを受け取ることができます。

---

## 便利だけど多用は禁物

![](/media/begin-with/wireless-nodes/legacy_gyazo_0128233c9681fdaa4ad62d7afe59d2aa.png){media=image}

[](/workflows/begin-with/wireless-nodes/set_get_image2image.json)

[リーダブルノードのすゝめ](/ja/begin-with/readable-nodes/) でも触れていますが、ノードツールの最大の利点は「繋がった線を見るだけでデータの流れが掴める」ことです。
いたずらに無線化すると、「この画像データ、どこから飛んできたの？」と処理の流れを追うのが非常に困難になります。

一つのworkflowのあらゆる場所に何度も何度も同じ変数が出てくるような場合には、無線化が便利だったりしますが、そもそも、それほど大きいworkflowは小さく分割すべきかもしれません(；・∀・)