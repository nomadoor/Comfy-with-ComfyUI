# ADR: 出力例を専用のトレイにする (2026-09-29)

## Status
Accepted

## Context
- workflow の下に出力例を並べる流れが定着したが、見出しは `**出力例**` の太字段落で書いていた。H3 とほとんど区別がつかず、太字も増える。英語・中国語は訳語が揺れていた（Output example / Output Example、输出例 / 输出示例）。

## Decision
- `{% outputs %}` 〜 `{% endoutputs %}` で出力例を囲む。中の Markdown（画像・動画の行など）はそのまま描画する。
- ステップカード（`2026-09-29-media-step-cards.md`）と同じ形のトレイにする：カードと同じ塗り、枠線なし、左上の角が灰色の四角（画像アイコン）、カードのラベルと同じ書式の「Outputs」。ラベルは3言語共通の英語。見出しではないので TOC に出ない。
- 既存の「出力例」系の太字段落は全言語で置き換える（日本語44、英語44、中国語44）。

## Files
- Updated: `.eleventy.js`, `src/assets/css/site.css`, `ops/style-writing.md`, `ops/style-design.md`, articles in `src/content/{ja,en,zh}`
