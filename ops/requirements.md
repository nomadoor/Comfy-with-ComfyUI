# REQUIREMENTS.md - Site Implementation Summary

## 0. Stack & General Rules
- Eleventy + Nunjucks. JavaScript must stay ESM (`<script type="module">`).
- Style with plain CSS; follow `/ops/style-design.md` tokens and transitions.
- Deploy to Cloudflare Pages; treat `/assets/*` as immutable.

## 1. Content & Routing
- Routes follow `/<lang>/<section>/<slug>/` with kebab-case slugs that match nav/data.
- Markdown lives under `src/content/<lang>/`; workflows sit in `src/workflows/<slug>/*.json`; shared data under `_data`.
- Front matter requires `slug`, `title`, and up to 5 `tags`. Use `draft: true` for hidden work.

## 2. Navigation & Tags
- Locale menus come from `_data/nav.<lang>.yml`; keep IDs aligned with folders and front matter.
- Every page begins with one H1. Section badges and chip styles come from `/ops/style-design.md`.

## 3. Related Workflows
- Only render related cards inside `basic-workflows` using the existing helper.
- Limit to 12 cards; stack vertically on narrow layouts.

## 4. Workflow JSON Block
- Render `<filename>.json  [Copy]  [Download]` for each workflow entry.
- Copy button uses the tooltip cycle: default -> "Copy" -> "Copied".
- Download link forces `Content-Disposition: attachment`.

## 5. Media & Lightbox
- Normalize Gyazo URLs to `https://i.gyazo.com/<id>/max_size/1000` and cache width/height to avoid CLS.
- Default media brightness: `filter: brightness(0.85)`. Obey the 300px article media height cap unless overridden.
- Lightbox must support Esc close, +/- zoom, and arrow keys or buttons for navigation.

## 6. Search
- `search/index-<lang>.json` feeds client search with `title`, `tags`, and H2/H3 snippets.
- Inputs need localized label, placeholder, and ARIA text.

## 7. JavaScript
- All scripts are ESM modules in `src/assets/js/`. No CommonJS.
- Use import maps for shared helpers; no bundlers.

## 8. Icons / SVG
- Store SVG sources in `src/assets/icons` with kebab-case filenames.
- Keep `viewBox` and rely on `currentColor` for strokes/fills.

## 9. CSS
- Use the shared design tokens; prefer BEM-like selectors and `var(--transition-fast)` (100ms cubic-bezier(0.2,0.91,0.85,0.96)).
- Reference `/ops/style-design.md` for typography, spacing, and elevation rules.

## 10. Accessibility & Performance
- Provide descriptive `alt` text (describe Gyazo actions too).
- Ensure keyboard support: focus states, Esc handlers, Enter/Space activations.
- Serve `/assets/*` with `Cache-Control: public, max-age=31536000, immutable`.

## 11. CI & Quality Gates
- Every slug must exist in nav files and directories.
- `tags[]` stays <= 5 entries pulled from `_data/tagIndex.js`.
- All `<img>` elements need width/height attributes or CSS aspect enforcement.
- Update README/ADRs whenever IA or UX changes.

## 12. Deliverables
- Required folders: `.eleventy.js`, `layouts/`, `includes/`, `assets/js/`, `_data/`, `src/content/**`.
- Tests live in `tests/` (Playwright). Update or add tests for behavior changes.

## 13. Change Control
- IA/nav, hero, sidebar, or major UX shifts require an ADR before merge plus reviewer approval.
- Weekly rollups summarize ADR decisions.

## 14. Right-Rail Tips Widget
- States: `collapsed`, `hover-expanded`, `json-help`, `form-correction`, `form-request`, `submitted`.
- `collapsed`: tiny square anchored bottom-right with character peek.
- `hover-expanded`: on hover (desktop) or tap (mobile) the card grows, character appears more, and three CTA buttons show.
- CTA buttons:
  1. "What is the JSON copy button?" -> `json-help` (Gyazo animation, no form).
  2. "This page has a mistake!" -> `form-correction` (textarea + submit).
  3. "Please explain more!" -> `form-request` (textarea + submit).
- Forms submit into `submitted` state with a thank-you message and subtle character change.
- Provide a visible close/back control in every expanded state to return to `hover-expanded` (desktop) or collapse (mobile).
- Mobile: tap toggles expansion, lock body scroll while open, make CTA buttons large.
- Gyazo embeds inside the bubble must reuse article media frame rules (max-height, fade-in) and keep flat design (no borders/shadows).
