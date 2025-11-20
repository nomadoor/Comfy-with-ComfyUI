---
layout: page.njk
lang: ja
section: begin-with
slug: component-gallery
navId: component-gallery
title: "コンポーネントギャラリー"
summary: "Markdownで使う基本部品の見た目をまとめた検証ページ。"
tags:
  - component-gallery
  - begin-with
  - docs
  - design
  - ja
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
---

## テーブル

| 手順 | 内容 | メモ |
| ---- | ---- | ---- |
| 01 | Gyazoで静止画 or 動画を撮る。 | 720px 幅の上限を守る。 |
| 02 | docs に取り込む。 | `imageVariant` フィルターを必ず通す。 |
| 03 | Markdownに貼る。 | `alt` テキストを書いてアクセシビリティを確保。 |

## コードブロック

```ts
type Workflow = {
  id: string;
  title: string;
  tags: string[];
};

export function format(workflow: Workflow) {
  return `[${workflow.tags.join(", ")}] ${workflow.title}`;
}
```

行内 `code` も同じトーンで、読みやすいピル形状に収めています。

## 引用

> “Small, clear, safe steps.” 文章のまとまりも 1 ステップずつ説明することで読者の目線をコントロールする。

## ネストしたリスト

- 入力を集める
  - Gyazo スクショ
    - alt を確認
  - Workflow JSON
- ワークフローをまとめる
  - 目的を書く
  - Download / Copy 動作を確認

## Gyazo 画像

![Conditioning reference](https://i.gyazo.com/075ff7bc7a36635d40662b163b5a9cfe.jpg){gyazo=image}

## 画像を横並びにする

サイズの異なる画像を`.article-media-row`で包むと、幅に応じて自動で整列します。

![](https://i.gyazo.com/f805391f1a7ae6b253440cf16168a763.jpg){gyazo=image} ![もこもこキャラ](https://i.gyazo.com/075ff7bc7a36635d40662b163b5a9cfe.jpg){gyazo=image}

## Gyazo 動画（ループ）

![ループ再生で確認したい場合はこちら。](https://gyazo.com/d32149b1fc31363100fbc9f009b41add){gyazo=loop}

## Gyazo 動画（プレイヤー）

![Gyazo公式プレイヤーで再生・停止・シークを操作。](https://gyazo.com/d32149b1fc31363100fbc9f009b41add){gyazo=player}

`gyazoVideoLoop` は自動再生 + ループ前提、`gyazoVideoPlayer` は Gyazo のプレイヤー UI とシークバーをそのまま埋め込みます。

## テーブル + コードの組合せ

| トークン | 値 | 用途 |
| ----- | --- | ---- |
| `--color-panel` | `#111111` | 記事内のコンテナ。 |
| `--color-panel-alt` | `#1a1a1a` | テーブルやコードの背景。 |

```bash
uvx playwright test component-gallery.spec.ts --headed
```
