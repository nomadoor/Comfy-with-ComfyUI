---
layout: page.njk
lang: ja
section: basic-workflows
slug: sd15-controlnet
navId: sd15-controlnet
title: "ControlNet"
summary: "ポーズや線画を使って画像生成をコントロールする"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
tags: ["controlnet"]
hero:
  image: "https://i.gyazo.com/374d9112c26cc1098d9e7e11b5ca49fa.png"
---

## ControlNetとは？

生成AIの本質は、**「2つのものの対応関係」を学習すること**です。
text2imageでは「ノイズ ↔ 画像」の関係を覚えさせますが、ノイズ以外のものでも同じことができます

- **線画 ↔ 画像** のペアを学習 → 線画から自動着色が
- **棒人間 ↔ 画像** のペアを学習 → ポーズ指定で画像生成が
- **深度マップ ↔ 画像** のペアを学習 → 奥行き情報から画像生成が

**ControlNet** はこれを実現する技術のひとつです

---

## SD1.5 × ControlNet Scribble

ControlNet は、無数の種類がありますが、まずは「scribble」を試してみましょう。  
scribble モデルは、「ラフな落書き」をもとに画像を生成する ControlNet です。

### ControlNetモデルのダウンロード

- [control_v11p_sd15_scribble_fp16.safetensors](https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/blob/main/control_v11p_sd15_scribble_fp16.safetensors)
- ```
  📂ComfyUI/
    └── 📂models/
        └── 📂controlnet/
            └── control_v11p_sd15_scribble_fp16.safetensors
  ```

### workflow

![](https://gyazo.com/885feaa8a1857c09ce11977ad9d424c2){gyazo=image}

[](/workflows/basic-workflows/sd15-controlnet/SD1.5_ControlNet_scribble.json)

- 🟩 `Apply ControlNet` ノードにControlNet モデルとscribble 画像を入力。
- 🟨 ControlNet画像と生成する画像のサイズは同じでなくてもエラーは出ませんが、同じサイズにしておきましょう。

> scribble モデルは「黒背景に白で描いた線」に最適化されています。  
> 白背景に黒で描いた線だと、うまく反応しないことが多いので注意してください。

- サンプル画像
  - ![](https://gyazo.com/fd112e311d4e0503fbb4df2044fc9325){gyazo=image}

---

## ControlNetの制御のバランス

拡散モデルは、本来 **縛られずに生成するときが最もクオリティが高く** なります。  
しかし、完全に自由だと役に立たないので、テキストや ControlNet などの **Conditioning** で制御します。  
制御が強すぎるとクオリティが落ちる —— これはテキストプロンプトでも LoRA でも同じです。

では、制御とクオリティのバランスはどう取ればよいでしょうか？

### start_percent / end_percent

![](https://gyazo.com/3c82ca8a7dcb51f2475d0451de727783){gyazo=loop}

サンプリングは序盤で大まかな形が決まり、後半で細部が描き込まれます。

ControlNet の多く（pose / depth / scribble など）は **形を決めるタイプ** の制御です。  
ということは、**序盤だけ ControlNet を効かせればよい** と考えることもできるわけです。

`Apply ControlNet` では、ControlNet が **どの区間で効くか** を指定できます。
- `start_percent`: 効き始めるタイミング
- `end_percent`: 効き終わるタイミング

`end_percent` を下げるほど、後半はモデルの自由度が戻り、形を保ちながらクオリティも向上させられます。

`strength`（強さ）と `start_percent / end_percent` を組み合わせて、  
「縛りすぎず、崩しすぎない」バランスを見つけていきましょう。

---

## 主なControlNetの種類

画像と対応させられる「概念」は、星の数ほどあります。  
ここでは代表的なものだけ紹介しましょう。

### モデルのダウンロード

- [comfyanonymous/ControlNet-v1-1_fp16_safetensors](https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/tree/main)
- [monster-labs/control_v1p_sd15_qrcode_monster](https://huggingface.co/monster-labs/control_v1p_sd15_qrcode_monster/tree/main)

### 一覧

{% mediaRow img="https://gyazo.com/be3200558982f020a124d2bc68276c16 {gyazo=image}", width=60, align="left" %}
### Canny
- 写真や画像の輪郭を保ったまま別のスタイルで描き直します。
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/debe9e414b688be1fa07bf01101ea2e0 {gyazo=image}", width=60, align="left" %}
### Lineart
- Cannyと似ていますが、よりイラスト向けです。  
- 線画着色などに使われます。
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/cbe33c8ba39da19e249634a6e46ec13b {gyazo=image}", width=60, align="left" %}
### Depth
- 深度マップ（手前・奥の情報）を使って、元画像の奥行きや構図を保ちながら生成します。
- 建物や風景など、立体感を崩したくない場合に向いています。
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/ae9a4fd7513b17114e2317b0da8dc14c {gyazo=image}", width=60, align="left" %}
### Normal
- 法線マップを使って、光の当たり方や立体感をコントロールします。{% endmediaRow %}

{% mediaRow img="https://gyazo.com/8df713d0e8415ada994ad7c5f91d8ba9 {gyazo=image}", width=60, align="left" %}
### Pose
- OpenPose などで抽出した「棒人間のポーズ情報」から、同じポーズの人物・キャラクター画像を生成します。 
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/fe7da06340c74791241cac5a482531bb {gyazo=image}", width=60, align="left" %}
### Inpaint
- 画像の一部だけを描き直したいときに使うモデルです。
- マスクで指定した範囲だけ、自然に描き換えることができます（不要物の消去・小物の差し替えなど）。
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/ea6af6e0edcd04ffe43f032b8a10b4fb {gyazo=image}", width=60, align="left" %}
### QR Code Monster
- QRコードとして読み取れる画像を作り出します。
- QRコードに限らず、「白黒のパターン画像」をベースに、好きな絵柄に変形させる使い方もできます。
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/65e5e0ed5aaf2c87d363e6eb37e7d33b {gyazo=image}", width=60, align="left" %}
### Tile
- ぼかしが強い画像や低解像度の画像から、綺麗な画像を作り出します。
- 単体でも使えますが、実際には Ultimate SD Upscale のような「超解像アップスケール」と組み合わせて使われることが多いです。
{% endmediaRow %}


## ControlNet Union

Flux 以降の話になりますが、Scribble や Pose、Depth といった基本的な ControlNet を  
ひとつのモデルとして内蔵させたものが「ControlNet Union」です。

入力された画像の特徴（ポーズ・線・深度など）を自動で認識し、  
それに近い ControlNet の挙動をまとめて再現しようとするモデルだと考えておけば十分です。
