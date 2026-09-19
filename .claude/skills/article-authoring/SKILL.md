---
name: article-authoring
description: Use when creating or substantially editing documentation articles in src/content, including frontmatter, headings, media embeds (R2/Gyazo), workflow links, tags, summaries, and preserving the owner's Japanese writing voice.
---

# Article Authoring

## Pipeline

This skill is the entry point for a new article. The steps after it are separate skills; read the one you need when you reach it, and tell the owner what is still outstanding.

1. [external-model-research](../external-model-research/SKILL.md) — before writing, when the page covers a model or node you have not verified
2. **article-authoring** (here) — the Japanese page. JA is always the source
3. [workflow-json](../workflow-json/SKILL.md) / [ia-nav-adr](../ia-nav-adr/SKILL.md) — when the page ships workflow files, or changes placement, slug or nav
4. [preview-site](../preview-site/SKILL.md) — check it on localhost before anything is uploaded
5. [localization](../localization/SKILL.md) — EN/ZH, only when the owner asks
6. [news-readme-update](../news-readme-update/SKILL.md) — one news row per language that exists
7. [release-check](../release-check/SKILL.md) — checks before commit
8. [publish-pr](../publish-pr/SKILL.md) — only on an explicit request

Do not run steps 5-8 on your own initiative. Finish the step you are on, then say which steps remain.

## Read First

- Read `/ops/style-writing.md` for style, structure, media embeds, mediaRow, tags, and translation-adjacent rules.
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
6. Use media markup consistently. `{media=...}` is the display mode and works for R2 and Gyazo URLs; `{gyazo=...}` is a compatible alias:
   - static image: `{media=image}`
   - loop: `{media=loop}`
   - player: `{media=player}`
   - R2 media is referenced only as `/media/<logical name>` (for example `/media/basic-workflows/minimax-h3/minimax_h3_audio_driven_i2va.png`: `<section>/<article slug>/<lowercase_snake_case file name>`), backed by an original in `COMFY_MEDIA_ORIGINALS`. Unuploaded originals preview on the dev server; the pre-commit hook runs `npm run media:sync` to upload and register them in `src/_data/media.json`. Never run uploads on the owner's behalf unless asked. Never write `media.comfyui.nomadoor.net` URLs directly, and never invent or rename logical names without the owner.
   - Gyazo and other external media URLs are written directly.
7. When linking workflow JSON, use paths under `/workflows/...`.

## Editing Owner Drafts

- Treat the facts, examples, and explanations present in the owner's draft as the content boundary. When asked to "整える" or fix a rough passage, repair wording and structure without inventing examples, recommendations, parameter values, or background explanations.
- Do not expand a shorthand statement merely because a generic tutorial would explain it more fully. Add prose only when the owner explicitly asks for an explanation, or when a sentence cannot be understood without it.
- Respect the page sequence. If the page says it continues from or shares behavior with an earlier page, explain only the difference here. Do not repeat inherited mechanics or settings unless the owner wrote them again for a reason.
- If research reveals a missing fact or dependency, report it to the owner before inserting it. Factual review is not permission to enlarge the draft.
- Read several nearby articles before editing and copy their site-specific conventions, not a generic documentation template. In particular, model download links include the displayed file size and are followed by the matching `ComfyUI/models/` placement tree.
- Preserve deliberate brevity, looseness, and author judgments. Do not replace them with textbook transitions, comprehensive lists, or polished marketing prose.

## Checks

- `git diff --check`
- `npm run check:content`
- `npm run build`
- Add or run `npm run test:playwright` when the edit affects UI behavior, nav, search, notes, or layout.
