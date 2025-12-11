---
layout: page.njk
lang: ja
section: basic-workflows
slug: ace-plus-plus
navId: ace-plus-plus
title: "ACE++"
summary: "ACE++でFlux.1 Fillを拡張する"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/ca2c5be6b2a22cead23cf75a4fc8424f.png"
tags: ["id-transfer","subject-transfer"]
---

## ACE++とは？

![](https://gyazo.com/1ecb26d7a9f2f9f558b02e91114cc692){gyazo=image}

これは以下のようなプロンプトで生成した1枚の画像です。
- 2フレームに分かれた画像。
- 1フレーム目にはAさんが座っている。
- 2フレーム目ではAさんがこちらを向いている。

見て分かるように、左右に映っている人物は同一人物に見えますね。
これはスプライトシートテクニックといって、一貫性のあるシチュエーションを複数枚作りたいときに、Stable Diffusion 1.5 時代から使われていた裏技です。

![](https://gyazo.com/5b66002abf37e213214611933ac7b833){gyazo=image}

ここから一歩進めて、上のような画像を与えたうえで、右半分だけを inpainting させてみます。  
すると、**左の画像を参照しながら、右側に新たな画像が生成されます。**

これが IC-LoRA、そして今回扱う **[ACE++](https://ali-vilab.github.io/ACE_plus_page/)** の根本的な原理です。
これまでは「うまく行くときもある」程度のテクニックでしたが、Flux の登場により、ある程度安定した生成が可能になりました。

雑にまとめると、ACE++ はこの原理を LoRA で強化したもので、用途別に3つの LoRA が用意されています。

* ID転送 / Face Swap
* Subject転送
* 指示ベース画像編集（ローカル編集）

---

## 必要なカスタムノード

* [1038lab/ComfyUI-RMBG](https://github.com/1038lab/ComfyUI-RMBG)

マッティングやセグメンテーション系のノードが多く含まれるカスタムノードですが、この中にある `IC LoRA Concat (RMBG) 🖼️` ノードだけを使います。  
ACE++ 公式のカスタムノードもありますが、挙動が安定しないためここでは採用しません。

---

## モデルのダウンロード

* diffusion_models
  * [FLUX.1-Fill-dev_fp8.safetensors](https://huggingface.co/1038lab/FLUX.1-Fill-dev_fp8/blob/main/FLUX.1-Fill-dev_fp8.safetensors)
* loras
  * [comfyui_portrait_lora64.safetensors](https://huggingface.co/ali-vilab/ACE_Plus/blob/main/portrait/comfyui_portrait_lora64.safetensors)
  * [comfyui_subject_lora16.safetensors](https://huggingface.co/ali-vilab/ACE_Plus/blob/main/subject/comfyui_subject_lora16.safetensors)
  * [comfyui_local_lora16.safetensors](https://huggingface.co/ali-vilab/ACE_Plus/blob/main/local_editing/comfyui_local_lora16.safetensors)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── FLUX.1-Fill-dev_fp8.safetensors
    └── 📂loras/
        ├── comfyui_portrait_lora64.safetensors
        ├── comfyui_subject_lora16.safetensors
        └── comfyui_local_lora16.safetensors
```

---

## 基本の考え方

ACE++ は、**「参照画像」と「編集したい画像＋マスク」を横並びにした1枚の画像** を見ながら動きます。

* 左側：参照画像（寄せたい顔・キャラなど）
* 右側：白紙 or 編集したい画像（＋その上に描いたマスク）

この2つを横にくっつけて1枚の画像にしてから、通常どおり inpainting させるイメージです。
Flux.1 Fill が「どこを描き直すか」、ACE++ の LoRA が「どのような見た目に寄せるか」を担当している、と捉えると分かりやすいと思います。

---

## ID転送

参照画像の人物（顔）に似た画像を生成します。

![](https://gyazo.com/ebe23ac6ca509cf96538f2a85fcf69c3){gyazo=image}

[](/workflows/basic-workflows/ace-plus-plus/ACE_Plus_portrait.json)

* ベースは Flux.1 Fill を使った inpainting です。
* 🟪 FLUX.1 Fill と `portrait` LoRA を読み込みます。
* 🟩 `IC LoRA Concat (RMBG) 🖼️` ノードで、「参照画像」と「ベース画像＋マスク」を横並びにします。
  * 左：参照画像（人物写真など）
  * 右：ベース画像（ここではグレーの空画像）＋マスク
  * マスクに何も入力しなかった場合、右側全体がマスク扱いになります。
* 🟨 通常の inpainting で使うものと同じ `InpaintModelConditioning` ノードです。
* 🟦 出力画像は当然、横長の2枚組になります。
  * 右半分だけ使いたいので、`IC LoRA Concat (RMBG) 🖼️` ノードから渡される位置情報を使って、右側だけをクロップします。

---

## Face Swapとして使う

基本は ID転送 と同じですが、「右側に入れるベース画像」と「マスクのかけ方」を変えることで Face Swap として動きます。

![](https://gyazo.com/966d3c2bfcbaa5ae054fdd7ec4bb1c96){gyazo=image}

[](/workflows/basic-workflows/ace-plus-plus/ACE_Plus_portrait_faceswap.json)

* 🟩 右側に、顔を入れ替えたい画像（ベース画像）を入力します。
* 🟩 顔だけ変えたい場合は、顔の周辺だけにマスクをかけます。

FaceSwap といいながら、より柔軟なので、頭部全体をマスクしてもうまくいきます。

---

## Subject転送

`comfyui_subject_lora16.safetensors` に切り替えると、Subject 転送が出来ます。

![](https://gyazo.com/3e84f30e31b23d804ff651a4d29667e9){gyazo=image}

[](/workflows/basic-workflows/ace-plus-plus/ACE_Plus_subject.json)

* 先程の Face Swap と同じ workflow です。
* 🟪 読み込む LoRA を `subject` に変更します。

人物だけでなく、ロゴやアイテムなど様々なものを参照して生成できます。
* ロゴだけ別のパッケージ写真に転写する
* あるキャラクターやマスコットを、別の背景に立たせる
* 特定の小物（カバンなど）だけを別の写真に移植する

---

## ローカル編集

`comfyui_local_lora16.safetensors` を使うと、マスクした領域だけを **プロンプトに沿って描き直すローカル編集** に寄せることができます。

![](https://gyazo.com/e93a8e393eca60dbb1832fd314402dec){gyazo=image}

[](/workflows/basic-workflows/ace-plus-plus/ACE_Plus_local.json)

* 横並べではなく、通常の inpainting の workflow を使います。
* 🟪 読み込む LoRA を `local` に変更します。
* 「彼女の服を白シャツに変更」のように、**指示**の形でプロンプトを書きます。
