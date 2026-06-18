# AGENTS.md - Comfy with ComfyUI

This repository is the Eleventy documentation site for ComfyUI workflows.

Keep the always-loaded rules small. Task-specific procedures live in `.claude/skills/`; durable project decisions live in `/ops`.

## Start Here

- Read `AGENT_STATE.md` if it exists.
- Check `git status --short --branch` before editing.
- Treat `/ops` as the single source of truth for IA, writing rules, design tokens, and contribution rules.
- New owner decisions that change behavior, IA, naming, writing rules, or design rules must be reflected in `/ops` or an ADR before implementation.
- Do not rely on chat history as durable memory. Update `AGENT_STATE.md` after meaningful work with current goal, files changed, checks run, next action, and blockers.
- `AGENT_STATE.md` is local working memory and must not be committed.

## Project Contract

- Canonical article URLs use `/<lang>/<section>/<slug>/`.
- `lang` is `ja`, `en`, or `zh`.
- Main section keys are `begin-with`, `ai-capabilities`, `basic-workflows`, `data-utilities`, and `notes`.
- Slugs, `navId`, and public URLs are stable IDs. Renames require owner approval, nav updates, and an ADR.
- Japanese is the source language for new content. Do not create or update EN/ZH pages or nav entries unless the owner explicitly asks for localization in the current task.
- The human owner is the author. Keep edits to requested changes, light proofreading, factual fixes, and structure that preserves the owner's voice.
- Workflow JSON files must stay complete enough to reproduce the documented result.

## Change Control

- No silent UX, IA, layout, or design-token changes. Propose and document them first.
- JavaScript in this repo is ESM. Do not add CommonJS.
- SVG icons in `src/assets/icons/` must define a `viewBox` and inherit `currentColor`.
- Files must remain UTF-8 without BOM. If encoding looks wrong, stop and ask.
- Do not push, force-push, open a PR, update a PR branch, or publish local changes unless the owner explicitly says to push/publish in the current work sequence.
- For new feature work, use a dedicated branch and record the intent first with a small `/ops` update or reversible scaffold commit.

## Skills

Use the project-local skills in `.claude/skills/` when the task matches:

- `article-authoring`: article creation or substantial article edits.
- `workflow-json`: workflow JSON additions, replacements, or article workflow links.
- `ia-nav-adr`: IA, nav, slug, URL, ADR, or `/ops` rule changes.
- `localization`: JA/EN/ZH translation or language-sync work.
- `release-check`: pre-merge or final verification.
- `ui-design-change`: layout, CSS, component, icon, or UX behavior changes.
- `news-readme-update`: news rows, README, or public update notes.
- `page-views`: Cloudflare page-view data updates.
- `external-model-research`: source research for models, papers, Hugging Face, ModelScope, GitHub, or ComfyUI changes.
- `english-reply`: English GitHub or maintainer replies.

## Checks

Run checks that match the blast radius:

- `git diff --check`
- `npm run build`
- `npm run check`
- `npm run test:playwright` when layout, client JS, search, notes, forms, or navigation behavior changes.

If Playwright fails in the sandbox because Eleventy cannot bind `0.0.0.0`, rerun with the required approval rather than treating it as an article failure.
