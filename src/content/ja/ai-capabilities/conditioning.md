---
layout: page.njk
lang: ja
section: ai-capabilities
slug: conditioning
navId: conditioning
title: "Conditioningの考え方(ダミー)"
summary: "拡散モデルにおける Conditioning の役割をダミーで解説。"
tags:
  - conditioning
  - upscale-restoration
workflowJson:
  - id: clip-conditioning
    title: "CLIP Text Encoder"
    json: "/workflows/conditioning/clip-conditioning.json"
    image: "https://i.gyazo.com/f805391f1a7ae6b253440cf16168a763.jpg"
    copy: |
      {
        "workflow": "clip-conditioning",
        "notes": "Dummy payload"
      }
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/f805391f1a7ae6b253440cf16168a763.jpg"
  alt: "Conditioning walkthrough"
---

## Conditioningとは
ベクトルを使って生成方向を与える仕組みのダミー説明です。

### 入力チャネル
- 正例 / 負例プロンプト
- CLIP, T5 など

## 実践ポイント
- CFG と併せて調整
- ノード構成例を workflows で提示予定

### ロバスト性
サンプル用段落。TOC で H3 まで拾えるか確認。

![Conditioning gyazo](https://i.gyazo.com/f805391f1a7ae6b253440cf16168a763.jpg)
