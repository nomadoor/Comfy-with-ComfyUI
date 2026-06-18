---
name: ia-nav-adr
description: Use when changing information architecture, section placement, navigation YAML, slugs, URLs, page identity, /ops rules, ADRs, or contribution rules.
---

# IA, Nav, And ADR

## Read First

- `/ops/ia.md`
- `/ops/requirements.md`
- Relevant existing ADRs under `/ops/adr/`
- `src/_data/nav.ja.yml` and matching locale nav files when localization is in scope.

## Rules

- `/ops` is the source of truth.
- Slugs, `navId`, and public URLs are stable IDs.
- Renames need owner approval, nav updates, redirect consideration, and ADR coverage.
- Do not add EN/ZH nav entries unless matching localized pages are part of the requested task.
- Parent grouping changes and sidebar order changes are IA changes.

## Workflow

1. Update `/ops` or add an ADR before implementation.
2. Update nav YAML only for the requested locales.
3. Add or move content files only after IA is documented.
4. Validate nav and content integrity.

## Checks

- `npm run check:content`
- `npm run build`
- `npm run test:playwright` for sidebar, search, language switch, previous/next, or notes changes.
