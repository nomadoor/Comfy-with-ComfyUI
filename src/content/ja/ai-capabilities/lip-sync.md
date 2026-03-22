---
layout: page.njk
lang: ja
section: ai-capabilities
slug: lip-sync
navId: lip-sync
title: リップシンク
summary: 音声に合わせて口や表情を動かす技術
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---

## リップシンクとは？

リップシンクは、音声の内容やリズムに合わせて、口や表情の動きを後付けする技術です。

もともとある動画に別録りの音声を重ねたり、一枚絵を「しゃべっている風」に動かしたりするために使われます。

---

## 既存動画の口パクを合わせる

![](https://gyazo.com/17b81df017311b5fee98119e7e808492){gyazo=player} ![](https://gyazo.com/a6286699b56195148b64533d441561c0){gyazo=player}
> ← ベース動画 | → リップシンク(LatentSync)

最初に広く知られたのは、Wav2Lipのように「口元だけを直す」タイプのモデルです。

すでに撮影されている動画と別録りの音声を入力すると、顔や体の動きはそのままに、口だけが新しい音声に合うように動いた動画を出力します。

---

## 一枚絵をしゃべらせる

> ![](https://gyazo.com/a74335c1403caa5475429688f420212d){gyazo=player}
> EMO

[EMO](https://humanaigc.github.io/emote-portrait-alive/)のようなモデルは、一枚の顔画像と音声から、しゃべっている動画を直接生成します。  
入力画像を音声という制御で動かす、image2videoの発展とも言えるでしょう。

キャラクターイラストや顔写真を一枚用意して、セリフや歌の音声を与えると、その長さに応じた口パク付きの動画が返ってきます。まばたきや口角の動き、軽い首振りなども一緒に作られます。

---

## 音声から動画全体を動かす

少し声を張り上げて喋って見るとわかりますが、喋る時には口だけ動かしているわけではありません。
肺が膨らみ、肩が持ち上がり、気づいたら手でジェスチャーまでしているわけです。

つまるところ、Wav2Lipのような口だけ音声に合わせて動かす、だけでは自然な動画は作れないんですね。

動画生成モデルが実用的な性能になってきたのも相まって、単なる「リップシンク」というより、**音声駆動型のポートレート動画生成** という流れに進んでいきます。

> ![](https://gyazo.com/808dcfc73aa5fb1959eb35be3534e5e7){gyazo=player}
> InfineTalk

現在のSoTAとして、Wan2.1をベースにした、[FantasyTalking](https://fantasy-amap.github.io/fantasy-talking/)や[InfiniteTalk](https://meigen-ai.github.io/InfiniteTalk/)のようなものがあります。

