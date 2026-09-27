# ADR: Temporary Gyazo outage notice

- Date: 2026-09-16
- Status: Superseded (notice removed 2026-09-27)

## Context

Some Gyazo-hosted images used throughout the site are temporarily unavailable. Readers need a clear explanation while the images are moved to another delivery environment.

## Decision

- Show one compact, localized notice immediately above the shared hero on page layouts.
- State that the missing images are caused by Gyazo-side image delivery being unavailable, apologize for the inconvenience, and explain that images will be migrated gradually.
- Reuse the article blockquote layout and typography with a warm status surface and a decorative 🚨 icon, so the notice remains visible without looking like a promotional banner.
- Keep the notice controlled by shared site data so it can be removed cleanly after the migration.

## Scope

- `src/_data/site.json`
- `src/includes/hero.njk`
- `src/assets/css/site.css`
- `ops/style-design.md`
- `tests/layout.spec.ts`

## Outcome

The owner removed the notice on 2026-09-27 after Gyazo delivery resumed and the site-used media migration was completed. The shared data, template markup, CSS, and dedicated regression test were removed together.
