# ADR: 出力例を専用のトレイにする (2026-09-29)

## Status
Accepted

## Context
- workflow の下に出力例を並べる流れが定着したが、見出しは `**出力例**` の太字段落で書いていた。H3 とほとんど区別がつかず、太字も増える。英語・中国語は訳語が揺れていた（Output example / Output Example、输出例 / 输出示例）。

## Decision
- `{% outputs %}` 〜 `{% endoutputs %}` で出力例を囲む。中の Markdown（画像・動画の行など）はそのまま描画する。
- ステップカード（`2026-09-29-media-step-cards.md`）と同じ塗りのトレイにする：枠線なし。見出しは控えめな灰色の小さな画像アイコンと「Outputs」だけ（カードのような角の四角は付けない。目立ちすぎるため）。ラベルは3言語共通の英語。見出しではないので TOC に出ない。
- 既存の「出力例」系の太字段落は全言語で置き換える（日本語・英語・中国語とも44か所。あわせて、ラベルなしで並んでいた出力（qwen-image-2-1 の7か所、ksampler-advanced の2か所）と「生成例」「比較」ラベルの4か所（wan-animate 3、z-image 1）も各言語でトレイにした）。

## Files
- Updated: `.eleventy.js`, `src/assets/css/site.css`, `ops/style-writing.md`, `ops/style-design.md`, articles in `src/content/{ja,en,zh}`

## Addendum (2026-09-29)
- 記事末尾の「サンプル画像」（workflow に入れる素材）も同じトレイにする。`{% outputs "samples" %}` でラベルを Samples、アイコンをダウンロードにする。H2 は外す（mask-ops、differential-diffusion、detailer、sd15-image2image の3言語）。
