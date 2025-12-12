---
layout: page.njk
lang: ja
section: faq
slug: oom-vram
navId: oom-vram
title: "VRAM不足のクイックチェック(ダミー)"
summary: "エラー診断フローのダミー。"
tags:
  - oom-vram
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  gradient: "linear-gradient(135deg, #1d1d1d, #2c2c2c)"
---

## 症状を確認
- ログに `CUDA out of memory` が出ているか

### まず試すこと
- 1. 解像度を落とす
- 2. バッチサイズを 1 にする

## 永続対策
- VRAM プロファイラを併用
- 一時キャッシュをクリア
