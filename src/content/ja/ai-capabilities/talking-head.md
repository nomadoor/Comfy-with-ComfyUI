---
layout: page.njk
lang: ja
section: ai-capabilities
slug: talking-head
navId: talking-head
title: talking head
summary: 1枚絵や顔写真を、参照動画や音声に合わせてしゃべらせる技術
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---

## talking headとは？

talking headは、1枚の画像や顔写真を「しゃべっている人」に見えるように動かす技術です。入力した画像を、別途用意した**参照動画の動き**や**音声**を手がかりにして、口や表情を動かします。

リップシンクとよく似ていますが、リップシンクは「元からある動画の口だけを音声に合わせる」ものが中心です。talking headは、1枚絵を動かすことが基本で、音声ではなく参照動画の動きを元に動かすことをメインに据えているものが多いです。

talking headの名の通り、顔を動かすことからスタートしましたが、上半身や全身まで動かす方向へと進化しています。

---

## 変形ベースのtalking head

### [Thin-Plate Spline Motion Model for Image Animation](https://github.com/yoyo-nb/Thin-Plate-Spline-Motion-Model)

![](https://gyazo.com/8e6de400ea9bc95a25e689483bd6b238){gyazo=image} ![](https://gyazo.com/b38439d333755e724f174fa774f74f71){gyazo=loop} ![](https://gyazo.com/c86570789722d04da913aed1f9ffd268){gyazo=loop}

1枚の画像と、動いている人の動画を入力すると、画像側がその動きを真似するように変形します。

やっていることは3Dモデルというより、2Dのまま「グニャっと」ねじっているイメージに近いです。Photoshopのパペットワープのようなものですね。

### [LivePortrait](https://liveportrait.github.io/)

![](https://gyazo.com/4dbed52f9f26d6f5ac4a15dac7f1c3af){gyazo=loop}

[](/workflows/ai-capabilities/talking-head/AdvancedLivePortrait_image2video.json)

こちらも1枚絵と参照動画を入力にしますが、顔のパーツごとの動きや視線、感情のニュアンスなどを安定して再現できるよう工夫されています。

拡散モデルではないため比較的軽く、リアルタイム寄りにも向いています。また、「顔の向きを少し下に」や「目を少し開く」といった編集ができるため、現在でもよく使われます。

---

## 拡散モデルベースのtalking head

次の世代では、拡散モデルを使って「絵そのものを描き直す」方向のtalking headが出てきました。[X-Portrait](https://byteaigc.github.io/x-portrait/)や[HelloMeme](https://songkey.github.io/hellomeme/)といった系統です。

![](https://gyazo.com/c70468086a939dce538a876073c9c523){gyazo=loop}

[](/workflows/ai-capabilities/talking-head/HelloMeme_video.json)

これらは、参照動画から「頭の向き」や「表情の変化」に相当する信号を取り出し、それを条件として拡散モデルに渡します。やっていることは、ControlNetでポーズや構図を固定しながら画像生成するのに近く、「このキャラの顔を、この動きで描き直してほしい」と指定しているようなものです。

---

## 動画生成モデルベースのtalking head

さらに新しい世代では、動画生成モデル自体をベースにしたtalking head / avatarモデルが登場しています。[OmniAvatar](https://omni-avatar.github.io/)や[Wan-Animate](https://humanaigc.github.io/wan-animate/)がこのラインにあたります。

![](https://gyazo.com/9f0e0e20d750b2e207b01adc56858202){gyazo=image} ![](https://gyazo.com/d7f66b4153473136c37e48c7066709a1){gyazo=loop} ![](https://gyazo.com/86ed4c6aa64af79325ce18359a4021bc){gyazo=loop}
> Wan-Animate

Wan-Animateは、キャラクター画像と「動きを持った参照動画」を入力にして、その動きをなぞるようにキャラクターを動かすタイプのモデルです。

---

## Human Motion Transferへ

talking headの技術が顔まわりを安定して扱えるようになってくると、「上半身や全身も動かしたい」となるのは自然な流れです。

Thin-Plate Splineのような古いものも、もともと顔だけでなく全身に適用できましたし、Wan-Animateでは完璧に全身を扱うことができるので、わざわざtalking headと区別する必要も無い気がしますが、Human Motion Transferはこちらはこちらで独自に進化してきたので、少し見てみましょう。

→ [Human Motion Transfer](/ja/ai-capabilities/human-motion-transfer)