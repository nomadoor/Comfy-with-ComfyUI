---
name: localization
description: Use when translating, syncing, or reviewing JA/EN/ZH documentation pages, nav labels, news rows, summaries, or localized metadata.
---

# Localization

## Read First

- `/ops/style-writing.md`, especially ZH translation rules.
- The Japanese source page.
- Existing EN/ZH sibling pages for local style.

## Rules

- JA is the source of truth.
- Do not localize unless the owner explicitly requested it in the current task.
- Preserve `slug`, `navId`, `section`, workflow paths, model filenames, node names, and code spans.
- Use the same `created` / `updated` as the JA page unless the task is a locale-only correction.
- EN should be natural and concise, not literal.
- ZH should be simplified Chinese, neutral, and preserve UI/model/node names in English where appropriate.

## Workflow

1. Diff the JA source and identify only the content that needs syncing.
2. Update locale pages and locale nav entries together when new localized pages are requested.
3. Preserve Gyazo and workflow links unless the owner supplied locale-specific assets.
4. Build and check search/nav output.

## Checks

- `npm run check:content`
- `npm run build`
