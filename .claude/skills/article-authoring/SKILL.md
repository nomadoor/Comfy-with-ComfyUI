---
name: article-authoring
description: Use when creating or substantially editing documentation articles in src/content, including frontmatter, headings, Gyazo embeds, workflow links, tags, summaries, and preserving the owner's Japanese writing voice.
---

# Article Authoring

## Read First

- Read `/ops/style-writing.md` for style, structure, Gyazo, mediaRow, tags, and translation-adjacent rules.
- Read `/ops/ia.md` when adding a page or changing page placement.
- Read nearby articles in the same section and language before writing.

## Workflow

1. Confirm the target language, section, slug, and scope.
2. Preserve the owner's authorship. Do not rewrite beyond the requested fix unless the text is factually wrong, confusing, or structurally broken.
3. Keep Japanese as the source for new content unless the owner requested localization.
4. Use frontmatter consistently:
   - `section`, `slug`, `navId`, `title`, `summary`, `created`, `updated`
   - `tags` are optional and max 5.
   - `notes` uses `noteTags`; do not substitute normal `tags`.
5. Use H2/H3 only for article body structure unless an existing page pattern requires otherwise.
6. Use Gyazo markup consistently:
   - static image: `{gyazo=image}`
   - loop: `{gyazo=loop}`
   - player: `{gyazo=player}`
7. When linking workflow JSON, use paths under `/workflows/...`.

## Checks

- `git diff --check`
- `npm run check:content`
- `npm run build`
- Add or run `npm run test:playwright` when the edit affects UI behavior, nav, search, notes, or layout.
