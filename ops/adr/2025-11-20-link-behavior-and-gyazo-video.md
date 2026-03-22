# ADR: Link Classification & Gyazo Video Aspect Support (2025-11-20)

## Context
- Markdown/Eleventy output treated every `<a>` tag identically, so internal and external links shared the same styling/behavior. The site defaulted to browser blue underlines, provided no external indicator, and left it up to authors to add `target="_blank"` or `rel` attributes. This was causing inconsistent UX, duplicates in the nav, and accessibility concerns (new tabs without `noopener`).
- The Gyazo metadata cache only parsed `https://i.gyazo.com/<id>.(jpg|png|gif)` references. Gyazo videos are authored via `https://gyazo.com/<id>` page URLs or `.mp4` embeds, so their dimensions never entered `.cache/gyazo-images.json`. As a result, `gyazoVideoLoop/gyazoVideoPlayer` fell back to the default `16 / 9` aspect, stretching/cropping wide clips across the docs.

## Decision
1. Extend `/ops/requirements.md` with a dedicated "Link Behavior" contract:
   - Every anchor receives `data-link-type="internal|external"` plus `.link--internal/.link--external`.
   - External links (different origin, protocol-relative, `mailto:`, `tel:`) always open in a new tab with `rel="noopener noreferrer"` unless `download` is present.
2. Implement an ESM helper (`src/assets/js/link-behavior.js`) that runs at boot + via MutationObserver to classify anchors, normalize `rel`, and, for article body links, append an inline SVG indicator. CSS resets article link color/underline weight to match body text and targets the inserted `.article-link__icon`.
3. Rewrite the Gyazo metadata crawler:
   - New regex scans *all* `gyazo.com` / `i.gyazo.com` URLs regardless of extension.
   - Each match extracts the asset ID, normalizes it to `https://i.gyazo.com/<id>.jpg` for caching, and fetches dimensions from the canonical Gyazo page.
   - The refreshed cache now includes video IDs, so the `gyazoVideo*` shortcodes emit per-video `--article-video-aspect` tokens instead of forcing `16 / 9`.

## Consequences
- Authors no longer have to remember target/rel semantics; CI can lint against the structured data attributes, and theming can rely on `.link--external`. Article readers see consistent underlines and an inline icon for outbound references.
- Playwright/search-injected links inherit the same classification because the JS enhancer monitors DOM mutations.
- The Gyazo cache now captures any clip referenced in markdown/Nunjucks files. Running `npm run build` refreshes `.cache/gyazo-images.json` before build, so videos render at their native aspect without manual options.
- Future link or media rules must be reflected in `/ops` + ADR before implementation; this ADR documents the new baseline.
