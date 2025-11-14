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

## Gyazo 画像

![Conditioning reference](https://i.gyazo.com/075ff7bc7a36635d40662b163b5a9cfe.jpg)

## 画像を横並びにする

サイズの異なる画像を`.article-media-row`で包むと、幅に応じて自動で整列します。

<div class="article-media-row">
  <figure class="article-media" style="--article-media-width:225px; --article-media-height:300px; --article-media-aspect:1108 / 1477;">
    <div class="article-media__frame">
      <img src="https://i.gyazo.com/f805391f1a7ae6b253440cf16168a763.jpg" alt="巻物ねこ" loading="lazy" decoding="async" />
    </div>
  </figure>
  <figure class="article-media" style="--article-media-width:300px; --article-media-height:300px; --article-media-aspect:1212 / 1352;">
    <div class="article-media__frame">
      <img src="https://i.gyazo.com/075ff7bc7a36635d40662b163b5a9cfe.jpg" alt="もこもこキャラ" loading="lazy" decoding="async" />
    </div>
  </figure>
</div>

## Gyazo 動画（ループ）

{% gyazoVideoLoop "https://gyazo.com/d32149b1fc31363100fbc9f009b41add", "ループ再生で確認したい場合はこちら。" %}

## Gyazo 動画（プレイヤー）

{% gyazoVideoPlayer "https://gyazo.com/d32149b1fc31363100fbc9f009b41add", "Gyazo公式プレイヤーで再生・停止・シークを操作。" %}

`gyazoVideoLoop` は自動再生 + ループ前提、`gyazoVideoPlayer` は Gyazo のプレイヤー UI とシークバーをそのまま埋め込みます。

## テーブル + コードの組合せ

| トークン | 値 | 用途 |
| ----- | --- | ---- |
| `--color-panel` | `#111111` | 記事内のコンテナ。 |
| `--color-panel-alt` | `#1a1a1a` | テーブルやコードの背景。 |

```bash
uvx playwright test component-gallery.spec.ts --headed
```
