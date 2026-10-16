# ADR: アップスケール・修正 を 動画生成・処理 の下へ移す (2026-10-17)

## Status
Accepted

## Context
- 基本のworkflow では、「アップスケール・修正」が「他の基盤モデル」と「動画生成・処理」のあいだにあった。
- オーナー判断で、生成モデルのまとまり（画像 → 動画）を続けて並べ、アップスケール・修正はその後ろに置く。

## Decision
- JA / EN / ZH のナビで、`upscale-fix` を `video-workflows` の下、`llm-mllm-workflows` の上へ移す。
- グループの中身、記事、URL、slug は変えない。
- 前後ページのリンクはナビ順に従うので、Krea 2 の次は Wan 2.1 に、Detailer の次は LLM / MLLMとは に変わる。

## Files
- Updated: `src/_data/nav.{ja,en,zh}.yml`
