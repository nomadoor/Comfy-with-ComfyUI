---
layout: page.njk
lang: ja
slug: sd15-basics
navId: sd15-basic
title: "画像生成の基本(SD1.5)"
summary: "Stable Diffusion 1.5で学ぶ画像生成の基本"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  gradient:
  image: ""
---

## どのモデルでもworkflowは大体同じ

![](https://gyazo.com/55ef8fc59cbcbc5093b9e1b3d15dceb5){gyazo=image}

![](https://gyazo.com/bc7fe8fc68bbc2fb408314e8acee9ab1){gyazo=image}

上が**Stable Diffusion 1.5**、下が最新モデルである **Z-Image** のworkflow です。

ノードの数など細かい違いはあれど、大体同じなのが分かるでしょうか？  
どんな新しい画像生成モデルであろうとも、動画生成モデルであろうとも、**「材料を用意してKSamplerに投げる」** この流れは変わりません。

早く新しいモデルを使いたいという気持ちはとても良くわかりますが、逸る気持ちを抑え、一度Stable Diffusion 1.5をベースにしたworkflowを網羅してみてください。

この先のComfyUI生活が、ぐっと楽しくなるはずです。

---

## 「モジュール式である」とは？

ComfyUI のようなノードベースツールは、よく「モジュール式である」ことが利点だと説明されます。

では、そもそもモジュール式とは何か。  
それが画像生成において、どんなふうに便利なのでしょうか。  

### モジュール式

モジュール式とは、レゴブロックのように「必要な機能を後から付け足していける」構造のことです。

- ベースになる土台がある
- 必要な機能が出てきたら、その部分だけブロックを付け足す
- さらに機能を増やしたいときは、またブロックを付け足す

こうした「足し算していく」考え方が、ComfyUI の workflow にもそのまま当てはまります。

### ComfyUI ではどうなっているか

具体的なノード名はいったん置いておいて、workflow を少しずつ拡張していく様子を見てみます。  
どの部分がモジュールとして増えているのか、流れで確認してみましょう。
- **1. text2image**
  - 基本です。プロンプトを入力して、それをKSamplerに投げるだけです。
  - ![](https://gyazo.com/bc319d809ad6024712e82fcf7e6e6b43){gyazo=image}
  - [](/workflows/basic-workflows/sd15-basics/SD1.5_text2image.json)

- **2. image2image**
  - 入力した画像を下書きに画像生成します。
  - ![](https://gyazo.com/a0a22121db82a64b69295b981d693088){gyazo=image}
  - [](/workflows/basic-workflows/sd15-basics/SD1.5_image2image.json)
  - 🟩画像を読み込むノードと、それをlatentに変換するノードを追加しまう。

- **3. inpainting**
  - 入力した画像の一部分だけimage2imageします。
  - ![](https://gyazo.com/e3eac290ca9e72274e84b8600d0762de){gyazo=image}
  - [](/workflows/basic-workflows/sd15-basics/SD1.5_inpainting.json)
  - 🟥マスクした場所のみimage2imageさせるためのノードを追加します。

- **4. ControlNet**
  - ControlNetは、画像を生成する際に、画像を入力して制御することができる機能です。
  - ![](https://gyazo.com/1c493ff35a7871c5984770fe29ce300c){gyazo=image}
  - [](/workflows/basic-workflows/sd15-basics/SD1.5_inpainting_controlnet.json)
  - 🟦ControlNetを追加するノードと、ControlNetの制御として使う画像を作るためのノードを追加します。
  
- **5. さらにControlNetを追加**
  - ControlNetは一つだけという制限はありません。もう一個追加してみましょう。
  - ![](https://gyazo.com/15bf3aa575d2d7f7c48d608e331f95d6){gyazo=image}
  - [](/workflows/basic-workflows/sd15-basics/SD1.5_inpainting_controlnet2.json)
  - 🟦ControlNetとその下処理ノードをもう1セット作ってつなげるだけです。

---

ひとつの例ですが、ComfyUIの柔軟性を見せられたと思います。

公式のテンプレート以外にも、多くの人がworkflowを公開していますが、それでも、あなたの望む完璧なworkflowはこの世に無いかもしれません。  
でも心配ありません。いらなかったら消し、他に欲しい機能があれば加えればいいのです。