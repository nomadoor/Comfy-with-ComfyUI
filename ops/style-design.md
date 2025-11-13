# STYLE-DESIGN — Visual Tokens And UI Rules

## 0. Identity
- JA site title: **「Comfyに使う ComfyUI」** / EN: **“Comfy with ComfyUI”**. Strings live in `site.json`.
- IA sections remain `begin-with`, `data-utilities`, `ai-capabilities`, `basic-workflows`, `faq`.
- Design intent follows `src/assets/mock/ホームデザイン_v01.png`: full-bleed black canvas, single-column article, chrome anchored on the left and top.
- Dark theme is canonical. Light mode will reuse the same token keys with different values.

## 1. Color Tokens
| Token | Value | Usage |
| --- | --- | --- |
| `--color-bg` | `#040404` | Body background. |
| `--color-panel` | `#111111` | Sidebar and cards. |
| `--color-panel-alt` | `#1a1a1a` | Active nav rows, hero fallback, search input. |
| `--color-border` | `#292929` | Default 1px borders. |
| `--color-border-strong` | `#3a3a3a` | Active nav highlight, chip border. |
| `--color-text` | `#f1f1f1` | Primary text. |
| `--color-text-muted` | `#a3a3a3` | Supporting text, controls. |
| `--color-highlight` | `#9b8cff` | Accent bar (active nav/tab) and links. |
| `--color-chip-bg` | `#1d1d1d` | Tag chips, language toggles. |
| `--color-chip-border` | `#3d3d3d` | Chip outline. |

PNG mock does **not** use gradients; hero fallback stays solid charcoal.

## 2. Typography
- Base font stack (all locales): `"Berlin Type", "Zen Kaku Gothic New", "Hiragino Sans", system-ui, sans-serif`
  - Latin glyphs render via Berlin Type, Japanese via Zen Kaku (fallback).
- `--font-jp` used only for body copy that must stay purely Japanese.
- Headings use 600 weight; body 400.
- Line height: `1.7`.
- `@font-face` declared for Berlin Type regular + bold (woff2 + woff) under `src/assets/fonts/berlin-type/`.

## 3. Layout & Spacing
- Spacing scale (`rem`): `0.25, 0.5, 0.75, 1, 1.5, 2, 3`.
- Radii: `0.35`, `0.75`, `1.25`, pill = `999px`.
- Grid: sidebar `17rem`, content `60rem` max, TOC `14rem`, gutters `2rem`. `--layout-max` = sum of columns + gutters. Header uses the exact same grid so every column aligns vertically.
- Header height `72px`, sticky at the top. Logo / search / actions are centered within their columns; search input maxes at 80% width (≤520px).
- Sidebar & TOC sit on `position: sticky` with `top = header + space`. They may scroll internally when content exceeds the viewport, but the primary scrollbar belongs to the article column.

## 4. Sidebar
- Section tabs: stacked buttons matching mock icons (icon stub optional). Active tab uses `--color-panel-alt` background and bold label.
- Nav list: single column, children indented with border-left. Active link shows a 2px highlight bar (mock’s purple line).
- Footer: `About` link + language chips (JA/EN) + theme toggle stub. Chips use pill style with accent border when active.
  - Language chip opens a dropdown **upward** so it never falls off-screen; each option links to the same slug in the chosen locale.

## 5. Hero & Tags
- Hero height ≈ 220px, grayscale image (or `--color-panel-alt`). Add dark scrim gradient bottom-to-top.
- H1 aligns left. Tag chips appear beneath H1 only on **basic-workflows** pages; they link to the AI Capabilities slug.
- Images always tinted (`filter: grayscale(1) brightness(0.6)`) inside the hero to match the mock.

## 6. Article Body
- Transparent background (no cards). Content width max 60ch.
- Heading rhythm: `h2` margin-top `3rem`, `h3` `1.5rem`.
- Inline images are centered, `max-width: 720px`, `max-height: 300px`, and `object-fit: contain` so portrait assets never force extra scrolling.
- Lists use default bullets; ensure `padding-left: 1.5rem`.
- `.placeholder` component is dashed border block for “まだページがありません” states and 404 page.

## 8. TOC
- Thin column on the right. Border-left only, no container box. Links use muted grey; active link turns white.
- “Back to top” pushes below the list.

## 9. Workflow Assets
- **Workflow JSON**: render as `filename | Copy | Download` rows (chips). Copy buttons read from hidden `<pre>` nodes to avoid DOM pollution; download links point at `/workflows/<slug>.json`.
- **関連ワークフロー**: only on `basic-workflows/*` pages. Gather other workflow pages sharing at least one AI-capability tag and render them in a Cosense-style grid (`repeat(auto-fill, minmax(146px, 1fr))`). Each card shows title + summary — no screenshots.
- Images in these sections obey the same `max-height: 300px` rule; JSON data stays pure text (never embedded screenshots).

## 10. Tags & Navigation Data
- `nav.ja.yml` / `nav.en.yml` store sections + page IDs. Every tag slug **must** exist in these files so tag chips can build canonical links.
- Missing page slugs auto-generate placeholders via `src/content/placeholders.11ty.js`. Placeholder copy: “まだページがありません…”.

## 11. Fonts & Language Rules
- Always list Berlin Type **before** Zen Kaku Gothic in CSS so Latin glyphs render in Berlin Type, even on JA pages.
- `body[lang="ja"]` is still allowed for locale-specific tweaks (date format, etc.) but **not** to change typeface order.

## 12. Assets
- Mock hero image tinted grayscale; when no asset, fill with `--color-panel-alt`.
- Icons remain monochrome, `currentColor`, 24px viewBox.
- Placeholder cat illustration (mock bottom-right) will be added later; for now reserve space in layout for helper popover.

> Follow the mock first. If a token or component is missing, update `/ops/style-design.md` before touching `/src`.
