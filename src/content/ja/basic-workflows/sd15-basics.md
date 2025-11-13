---
layout: page.njk
lang: ja
section: basic-workflows
slug: sd15-basics
navId: sd15-basics
title: "SD1.5 基本ワークフロー(ダミー)"
summary: "標準的な text2image の流れを確認するダミー用記事。"
tags:
  - sd15-basics
  - conditioning
workflowJson:
  - id: sd15-basic
    title: "SD1.5 Basic Flow"
    json: "/workflows/sd15-basics/standard.json"
    image: "https://i.gyazo.com/f805391f1a7ae6b253440cf16168a763.jpg"
    copy: |
      {
        "workflow": "sd15-basic",
        "notes": "Dummy payload"
      }
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  gradient: "linear-gradient(135deg, #1a1f3f, #352c64)"
---

## ノード構成
H2 dummy

### text2image
H3 dummy

## Hires.fix
- 分岐点
- 画像は workflows セクションで参照予定
