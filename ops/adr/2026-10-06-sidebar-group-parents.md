# ADR: 一番上の親はページを持たない見出しにする (2026-10-06)

## Status
Accepted

## Context
- 基本のworkflow の一番上の親のうち、「画像生成の基本 (SD1.5)」（`sd15-basics`）と「LLM / MLLM」（`llm-mllm`）だけが自分のページを持っていた。他の親（他の基盤モデル、動画生成・処理など）はリンクのない見出し（`noLink`）。
- 同じ位置の項目が、あるものはリンクでありあるものは見出し、という揺れがあった。見出しをクリックしてページに飛ぶことも予想しにくい。
- 2つのページはどちらも中身のある記事で、他の記事やお知らせからリンクされ、閲覧もある。

## Decision
- 一番上の親はすべて `noLink` の見出しにする。この2つにも見出し用の新しい ID を付ける：`sd15-workflows`（画像生成の基本 (SD1.5)）、`llm-mllm-workflows`（LLM / MLLM）。見出しの表示名は今のまま。
- 記事は消さず、URL・slug・navId も変えない。それぞれ見出しの最初の子として置く。サイドバー上の名前だけ内容に合わせる：
  - `sd15-basics`：JA「SD1.5から始める理由」／EN "Why Start with SD1.5"／ZH「为什么从 SD1.5 开始」
  - `llm-mllm`：JA「LLM / MLLMとは」／EN "LLM / MLLM Overview"／ZH「LLM / MLLM 概述」
- 記事タイトルは変えない。前後ページの順番も変わらない（見出しは前後リンクに入らず、記事は同じ位置に残る）。
- JA / EN / ZH のナビを同じ構造にする。
- 対象は一番上の親だけ。Flux.1、Qwen-Image、Wan 2.1、ControlNet など、子を持つモデル記事はモデル本体の記事なのでリンクのまま。
- 見出し用 ID には、既存の `noLink` 見出しと同じく noindex のプレースホルダページが生成される。

## Files
- Updated: `src/_data/nav.ja.yml`, `src/_data/nav.en.yml`, `src/_data/nav.zh.yml`, `ops/ia.md`
