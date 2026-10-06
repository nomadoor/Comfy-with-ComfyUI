# ADR: APIノードの記事をナビから外す (2026-10-07)

## Status
Accepted

## Context
- 「APIノード」（`/<lang>/basic-workflows/api-nodes/`）は、基本のworkflow の一番上に単独のリンクとして置かれていた。`2026-10-06-sidebar-group-parents.md` で一番上の親を見出しに揃えたあと、これだけ形が違っていた。
- 中身は workflow ではなく、公式の課金ノード（現在の呼び名は Partner Nodes）とクレジットの買い方。「パートナーノード」として はじめてのComfyUI へ移す案も検討したが、オーナー判断で取りやめた。このサイトはローカルで動かすことを扱い、課金ノードの使い方をナビで案内しない。

## Decision
- JA / EN / ZH のナビから外す。
- 記事・URL・slug・workflow JSON・画像はそのまま残す。URL を直接開けば読め、LLM / MLLM の記事からのリンクも残る。リダイレクトは入れない。
- ナビにないので、サイドバーで選択状態にならず、前後ページのリンクも出ない。

## Files
- Updated: `src/_data/nav.{ja,en,zh}.yml`, `ops/ia.md`
