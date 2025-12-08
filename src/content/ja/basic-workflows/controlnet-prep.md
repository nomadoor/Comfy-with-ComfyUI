---
layout: page.njk
lang: ja
section: basic-workflows
slug: controlnet-prep
navId: controlnet-prep
title: "ControlNet Preprocessor"
summary: "ControlNetで使う補助画像を作る"
tags: ["controlnet"]
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: ""
---

## Preprocessorとは？

ControlNetで使う棒人間や深度マップのような「制御用画像」を、どう用意するか？  
Canny のような単純なエッジならまだしも、深度マップを毎回手で描くのは現実的ではありません。

そこで、参考画像から棒人間・深度マップ・線画・ノーマルマップなどを自動で作る処理を、ControlNet界隈では便宜上まとめて **「Preprocessor」** と呼んでいます。

これらをすべて行うひとつの技術があるわけではなく、ポーズ推定・深度推定・線画抽出など、それぞれに別々の技術があります。

---

## 制御画像の正体

手描きすると大変だと言いましたが、「手描きできる」ということは覚えておいてください。

制御用画像は特殊なデータ型ではなく、**ただのRGB画像** です。  
深度マップで邪魔な部分を黒で塗りつぶしたり、ポーズ画像の腕だけ描き直して姿勢を変えたりしても構いません。

---

## 必要なカスタムノード

- [Fannovel16/comfyui_controlnet_aux](https://github.com/Fannovel16/comfyui_controlnet_aux)

基本的に、これだけあれば十分です。

---

## よく使われるPreprocessor

ここでは実際に使う頻度が高い技術を紹介します。  
性能的にはもっと良いものもありますが、手軽さ・軽量さ・使いやすさを重視して選んでいます。

ControlNetに使うくらいなら、そこまで極端な精度は必要ありません。

{% mediaRow img="https://gyazo.com/25026afc9e67bd130954acbf98fd851a{gyazo=image}", width=50, align="left" %}

### Canny

[](/workflows/basic-workflows/controlnet-prep/Canny-Canny_Edge.json)

- 🟩 Canny
- 🟨 Canny Edgy

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/4be8acdf3533fb7c80d9b580f755f1db{gyazo=image}", width=50, align="left" %}

### SoftEdge / HED

[](/workflows/basic-workflows/controlnet-prep/HED_Soft-Edge.json)

- 🟩 HED Soft-Edge

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/5fcfc6e4a07be8ed93ec0e3f9ed6a993{gyazo=image}", width=50, align="left" %}

### Lineart

[](/workflows/basic-workflows/controlnet-prep/Realistic-AnyLine_Lineart.json)

- 🟩 Realistic Lineart
- 🟨 AnyLine Lineart

{% endmediaRow %}


{% mediaRow img="https://gyazo.com/6be6036f6e7a7f56a8f6de81aeeea7d6{gyazo=image}", width=50, align="left" %}

### Depth

[](/workflows/basic-workflows/controlnet-prep/Depth_Anything_V2.json)

- 🟩 Depth Anything V2
  - 現在 V3 まで開発されていますが、ControlNet 用途であれば V2 で十分です。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/e55cf3d13d1b3c3c07497724d42b2780{gyazo=image}", width=50, align="left" %}

### Normal

[](/workflows/basic-workflows/controlnet-prep/DSINE.json)

- 🟩 DSINE

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/d7fe5840a075c7567848f8953c381734{gyazo=image}", width=50, align="left" %}

### MLSD

[](/workflows/basic-workflows/controlnet-prep/M-LSD.json)

- 🟩 M-LSD Lines

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/9297daf25cc10b21f495ed985e2bae7c{gyazo=image}", width=50, align="left" %}

### Pose

[](/workflows/basic-workflows/controlnet-prep/OpenPose_DWPose.json)

- 🟩 OpenPose
- 🟨 DWPose
  - OpenPose の上位互換として扱われることが多いですが、後ろ姿が苦手という明確な弱点があります。状況に応じて OpenPose と併用してください。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/d859b24e730122c4e510e2c97878a7e8{gyazo=image}", width=50, align="left" %}

### SDPose


[](/workflows/basic-workflows/controlnet-prep/SDPose.json)

[judian17/ComfyUI-SDPose-OOD](https://github.com/judian17/ComfyUI-SDPose-OOD)
- 🟩 SDPose
  - OpenPose は動物やアニメイラストに非常に弱いため、うまくいかなかったときはこちらを試してみてください。

{% endmediaRow %}
