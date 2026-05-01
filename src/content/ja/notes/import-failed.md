---
layout: page.njk
lang: ja
section: notes
slug: import-failed
navId: import-failed
title: "(IMPORT FAILED)"
created: 2025-12-13
updated: 2026-03-02
noteTags: ["troubleshoot", "custom-nodes"]
summary: "カスタムノードの読み込み失敗"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: ""
---

## 症状

![](https://gyazo.com/3054a82b909490117748ae061e29c35e){gyazo=image}

- ComfyUI を起動したとき、ターミナルに `(IMPORT FAILED)` の行がいくつも並び、特定のカスタムノードが使えなかったり、ノード一覧に出てこなかったりする。

## 発生するタイミング

- ComfyUI を起動した直後。
- インストールしたはずのカスタムノードがノード一覧に出てこないとき。

## 原因

- 必要なライブラリが入っていない、対応していない Python / PyTorch 版を使っている。
  - ターミナルで `(IMPORT FAILED)` から上にスクロールしていくと、  
    `ModuleNotFoundError: No module named 'facenet_pytorch'` など、そのカスタムノードに必要なライブラリが見つからないことが書かれている。
- パスや OS 依存の問題がある。
  - 例：`UnicodeDecodeError('cp932' codec can't decode byte 0x87...)` のように、フォルダパスに日本語が含まれているとエラーになるケースがある。
- 他のカスタムノードとコンフリクトを起こしている。
  - 古いフロントエンド実装や独自の依存関係を抱えたノードが、新しい ComfyUI と相性が悪くて落ちていることもある。

## 解決方法

- ライブラリが入っていない場合
  - Python に慣れている方は、自分で `pip install` しても構いませんが、そうでなければまず、そのカスタムノードの GitHub を開き、インストール方法が間違っていないか確認してください。
  - 現在は ComfyUI Manager 経由であれば、必要なライブラリをまとめて入れてくれるノードも多いです。特別な理由がなければ、まずは Manager から入れてください。
  - README に「手動でこのスクリプトを叩いてください」など特殊な手順が書かれているノードでも、よく分からなければそもそも手を出さないでください。

- 他のカスタムノードとのコンフリクトが疑われる場合
  - できれば、`(IMPORT FAILED)` を出しているカスタムノード以外を一度 `custom_nodes` から退避させ、そのノードだけを残した状態で ComfyUI が起動するかを確認してください。
  - その後、「問題のノード + 他のノード 1 つ」という組み合わせで少しずつ戻していき、どのノードと組み合わせたときに落ちるかを切り分けます。
  - そこまでして使う必要がなければ、そのノードはアンインストール (フォルダごと削除)してください。
