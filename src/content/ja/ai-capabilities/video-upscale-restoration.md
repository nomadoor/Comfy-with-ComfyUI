---
layout: page.njk
lang: ja
section: ai-capabilities
slug: video-upscale-restoration
navId: video-upscale-restoration
title: アップスケール・動画修復
summary: 動画を大きく・きれいにするための専用モデル
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---

## 動画アップスケール・動画修復

基本的な考え方や手法は、[アップスケール・画像修復](/ja/ai-capabilities/upscale-restoration/) とほぼ同じです。

* 1. 解像度を上げる
* 2. 失われたディテールをそれらしく補い、画質を整える

ただし大きな違いが一つあり、動画では **時間方向のつながり（フリッカーしないこと）** が重要になります。

静止画用アップスケーラを「1フレームずつ」当てるだけでも一応は動画アップスケールになりますが、**時間的な一貫性**を持たないため、チラつきがでる可能性があります。

やはり、動画専用のアップスケーラーを使ったほうが良いでしょう。

現在のSoTAを2つだけ紹介します。

> 静止画用のアップスケーラーを動画に使うことは出来ませんが、その逆は特に問題ありません。  
> むしろ静止画専用のものより性能がよく、実際よく使われています。

---

## SeedVR2

[numz/ComfyUI-SeedVR2_VideoUpscaler](https://github.com/numz/ComfyUI-SeedVR2_VideoUpscaler)

動画のアップスケールに特化し、1ステップで生成できるようにしています。

修復レベルで使えるほど非常に高性能ですが、非常に重いです。

---

## FlashVSR

[lihaoyun6/ComfyUI-FlashVSR_Ultra_Fast](https://github.com/lihaoyun6/ComfyUI-FlashVSR_Ultra_Fast)

![](https://gyazo.com/70f862355eef1106d51e8068ef48a006){gyazo=image}

[](/workflows/ai-capabilities/video-upscale-restoration/FlashVSR.json)

複数フレームをまとめて処理し、時間方向のブレやフリッカーを抑えています。

リアルタイム寄りの処理速度を実現できる設計で、高速・軽量なので、とりあえずこちらを試してみるのがいいでしょう。
