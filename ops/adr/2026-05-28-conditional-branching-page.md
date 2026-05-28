# ADR: Add Conditional Branching Page

## Status

Accepted

## Context

ComfyUI workflows often need simple conditional logic, such as selecting one value or path based on a number, text, or AI judgment.

The existing `data-utilities` section already explains data types, simple math, and text operations. Conditional branching fits the same group because it explains how to control workflow data flow rather than a specific image-processing technique.

## Decision

Add a new page:

- Section: `data-utilities`
- Slug: `conditional-branching`
- Title: `条件分岐`
- Navigation group: `データ操作`
- Position: after `テキスト操作` and before `Webカメラ入力`

The page is provided in JA/EN/ZH. The Japanese version remains the source text.

## Consequences

- `ops/ia.md` must list `条件分岐` under `データ / 画像ユーティリティ` > `データ操作`.
- `src/_data/nav.{ja,en,zh}.yml` must include `conditional-branching`.
- The page should introduce Switch first, then explain Boolean values through the Switch input, followed by ways to create Boolean values.
