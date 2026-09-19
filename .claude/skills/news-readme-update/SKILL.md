---
name: news-readme-update
description: Use when updating src/content/*/news.md, README.md, public changelog-like notes, or site-facing update summaries.
---

# News And README Updates

## Rules

- News rows are public-facing and should be short.
- Keep localized news entries aligned only when the owner requested localization.
- Update `updated` frontmatter when the news page changes.
- README should describe the site, not operational internals.
- Do not add promotional claims that are not reflected by the site content.

## Checks

- `npm run check:content`
- `npm run build`

## Pipeline

Part of the article pipeline in [article-authoring](../article-authoring/SKILL.md).

Add one row per language that actually has the page. If [localization](../localization/SKILL.md) has not run, JA only.

Next: [release-check](../release-check/SKILL.md).
