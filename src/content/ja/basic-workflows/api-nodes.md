---
layout: page.njk
lang: ja
section: basic-workflows
slug: api-nodes
navId: api-nodes
title: "APIノード"
summary: "ComfyUIのAPIノードで外部のクローズドモデルを利用する方法"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
tags: []
---

## APIノードとは？

ComfyUI は画像生成エンジンですが、そもそも Stable Diffusion や Qwen-Image といったモデルがオープンウェイトとして公開されていなければ意味がありません。

AI を開発している企業のほとんどは営利企業なので、このようにモデルを公開してくれていることのほうが稀です。本当に感謝しなければいけませんね (´・ω・｀)

多くのクローズドモデルは、各社のサイトや専用 UI から使うことになりますが、ComfyUI の中からノード経由で呼び出す方法も用意されています。

APIノード（公式ドキュメント上の呼び名は Partner Nodes）は、ComfyUI から外部のクローズドモデルを API 経由で呼び出すためのノード群です。  

> ここでいう「APIノード」は、あくまで **ComfyUI が用意した課金ノード** を指します。  
> 自前で OpenAI や Gemini の API キーを取得して custom node から叩くパターンとは区別しておきます。

---

## クレジット制

APIノードは、どのモデルを使う場合でも **必ずクレジット（前払い）を消費** します。無料枠やお試しはなく、クレジット残高が 0 の状態では実行できません。

料金は、各モデルごとに「1 回の生成あたり◯クレジット」といった形で決まっています。  
基本的には、各社が公開している API 価格帯と大きく乖離しないレベルに設定されており、「ComfyUI 経由だから極端に割高になる」といったことはありません。

![](https://gyazo.com/6f7f9247364acac4d4fb1ccfeeb2e845){gyazo=image}

だいたいの料金は、APIノードの右上にバッジとして表示されています。

---

## クレジットの購入方法

- 1. ComfyUI を起動し、`⚙ Settings` から `User` を開く
- 2. Comfy アカウント、もしくは Google / GitHub アカウントでログインする
- 3. `User` タブの下にある `Credits` をクリック
- 4. `Purchase Credits` をクリックし、Stripe 決済で必要な分だけチャージする
- 5. 決済完了後、残高が増えていることを確認する（反映されない場合はブラウザのリロードや ComfyUI の再起動）

---

## APIノードの使い方

他のノードと使い方は変わりません。モデル名からノードを検索し、つなぐだけです。

![](https://gyazo.com/0d12a7369948fa19779c0b7ffb487cd0){gyazo=image}

[](/workflows/basic-workflows/api-nodes/Google_Gemini.json)

---

## APIノードの使いどころ

私はローカルで AI を動かすことにこだわっている人間のうちの一人なので、正直 APIノードを頻繁に使うことはありません。

それでも、キャプション生成などは、自分の PC で LLM を回すよりも Gemini を使ってしまったほうがはるかに簡単なので、ときどきお世話になります。

ComfyUI はローカルな環境でモデルを動かせるのが強みですが、クローズドモデルとローカルモデルを同じ workflow の中で混ぜて使える、というのもまた強みと言えるでしょう。
