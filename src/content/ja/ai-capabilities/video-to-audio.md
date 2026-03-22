---
layout: page.njk
lang: ja
section: ai-capabilities
slug: video-to-audio
navId: video-to-audio
title: video2audio
summary: 動画から効果音や環境音を自動生成する技術
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---

## video2audioとは？

Sora 2やVeo 3などを除き、現在の動画生成モデルは未だに動画のみしか生成しません。つまり、音がありません。

そんなときに役立つのが、**video2audio** - 動画から音声を生成する技術です。

映像から「何が起きているか」を理解し、その内容に対応した音を、映像にシンクロするように生成します。

---

## FoleyCrafter

FoleyCrafterは、**既存のText2Audioモデルの上に「動画用のアダプタ」を足したVideo2Audioフレームワーク**です。

<iframe width="100%" height="540" src="https://www.youtube.com/embed/7m4YLrSBOv0" title="FoleyCrafter: Bring Silent Videos to Life with Lifelike and Synchronized Sounds" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

元になる Text2Audio モデルに、「映像を見て、どんな音がふさわしいか」「いつ鳴るべきか（タイミング）」の情報を足しているイメージです。

---

## HunyuanVideo-Foley

[HunyuanVideo-Foley](https://szczesnys.github.io/hunyuanvideo-foley/)は、**テキスト＋動画→オーディオ**を最初から想定した、マルチモーダル拡散Transformerです。

端からFoleyCrafterのようにtext2audioモデルに機能を足したのではなく、テキストと動画、音声をまとめて学習しています。
