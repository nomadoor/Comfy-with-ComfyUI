# STYLE-DESIGN 窶・Visual Tokens And UI Rules

## 0. Identity
- JA site title: **縲靴omfy縺ｫ菴ｿ縺・ComfyUI縲・* / EN: **窶廚omfy with ComfyUI窶・*. Strings live in `site.json`.
- IA sections remain `begin-with`, `data-utilities`, `ai-capabilities`, `basic-workflows`, `faq`.
- Design intent follows `src/assets/mock/繝帙・繝繝・じ繧､繝ｳ_v01.png`: full-bleed black canvas, single-column article, chrome anchored on the left and top.
- Dark theme is canonical. Light mode will reuse the same token keys with different values.

## 1. Color Tokens
| Token | Value | Usage |
| --- | --- | --- |
| `--color-bg` | `#040404` | Body background. |
| `--color-panel` | `#111111` | Sidebar and cards. |
| ``--color-panel-alt`` | `#1a1a1a` | Active nav rows, hero fallback, search input. |
| `--color-border` | `#292929` | Default 1px borders. |
| `--color-border-strong` | `#3a3a3a` | Active nav highlight, chip border. |
| `--color-text` | `#f1f1f1` | Primary text. |
| `--color-text-muted` | `#a3a3a3` | Supporting text, controls. |
| `--color-highlight` | `#9b8cff` | Accent bar (active nav/tab) and links. |
| `--color-chip-bg` | `#1d1d1d` | Tag chips, language toggles. |
| `--color-chip-border` | `#3d3d3d` | Chip outline. |
| `--color-hero-title` | Dark `#dfdfdf` / Light `#f1f1f1` (=`--color-bg`) | Hero タイトル専用前景色。背景画像の明度に依らず可読性を確保する。 |
| `--color-code-text` | Dark `#e9e9e9` / Light `#1f2430` | コードブロック／インラインコードのデフォルト文字色。 |
| `--token-comment` | Dark `#6c7394` / Light `#6e7781` | コメント、DOCTYPE。背景に対して WCAG AA 目安を満たす。 |
| `--token-punctuation` | Dark `#c3c8ff` / Light `#5b6476` | 記号・句読点。 |
| `--token-property` | Dark `#ffb86c` / Light `#c8551d` | プロパティ名・タグ・定数。 |
| `--token-number` | Dark `#ff6cf6` / Light `#7b2cbf` | 数値・boolean。 |
| `--token-string` | Dark `#8bf8d8` / Light `#1f7a3e` | 文字列、属性値。 |
| `--token-operator` | Dark `#fef0a5` / Light `#7a5f00` | 演算子、entity、url。 |
| `--token-atrule` | Dark `#9eb0ff` / Light `#2f6fda` | @規則、関数、class 名。 |
| `--token-keyword` | Dark `#db8bff` / Light `#af52de` | 言語キーワード。 |
| `--token-regex` | Dark `#ffc8dd` / Light `#c02c5a` | 正規表現、important。 |

PNG mock does **not** use gradients; hero fallback stays solid charcoal.

**Code color guidance:** Code blocks keep the existing backgrounds (`--color-panel-strong` for block, `--color-chip-border` for inline). Syntax colors must come from the `--color-code-text` / `--token-*` tokens listed above. When changing any code color, update this table first, then adjust CSS to match. Target contrast is roughly WCAG AA (≥4.5:1) against the block background for both themes.

## 2. Typography
- Base font stack (all locales): `"Berlin Type", "Zen Kaku Gothic New", "Hiragino Sans", system-ui, sans-serif`
  - Latin glyphs render via Berlin Type, Japanese via Zen Kaku (fallback).
- `--font-jp` used only for body copy that must stay purely Japanese.
- Headings use 600 weight; body 400.
- Line height: `1.7`.
- `@font-face` declared for Berlin Type regular + bold (woff2 + woff) under `src/assets/fonts/berlin-type/`.

## 3. Layout & Spacing
- Spacing scale (`rem`): `0.25, 0.5, 0.75, 1, 1.5, 2, 3`.
- Border radii: use `--radius-md = 0.5rem` for every component (pill shapes use `--radius-pill`).
- Grid: sidebar `16em`, content `60rem` max, TOC `16em`. Column gap is `4.5rem`, outer padding is a separate token, and `--layout-max = sidebar + content + toc + (gap ﾃ・2) + (padding ﾃ・2)`; header uses the same width.
- Header height `72px`, sticky at the top. Logo / search / actions stay centered within their columns; search input maxes at 80% width (竕､520px).
- Desktop rails are `position: fixed` with `height = 100vh - header` and scroll internally without drift; mobile reverts to stacked layout.

## 4. Sidebar
- Section tabs: stacked buttons matching mock icons (icon stub optional). Active tab uses ``--color-panel-alt`` background and bold label.
- Nav list: single column, children indented with border-left. Active link shows a 2px highlight bar (mock窶冱 purple line).
- Footer: `About` link + language chips (JA/EN) + theme toggle stub. Chips use pill style with accent border when active.
  - Language chip opens a dropdown **upward** so it never falls off-screen; each option links to the same slug in the chosen locale.

## 5. Hero & Tags
- Hero height is fixed at `12rem`. Use a grayscale image (fallback ``--color-panel-alt``) with a dark scrim.
- Hero content is flex-centered both vertically and horizontally; remove all default margins (H1 included).
- Apply `--radius-md` to the hero container and imagery. Tag chips still appear only on **basic-workflows** pages and link to the AI Capabilities slug.
- Images remain tinted with `filter: grayscale(1) brightness(0.6)` inside the hero to match the mock.

## 6. Article Body
- Transparent background (no cards). Content width max 60ch.
- Heading rhythm: `h2` margin-top `3rem`, `h3` `1.5rem`.
- Inline images are centered, `max-width: 720px`, `max-height: 300px`, and `object-fit: contain` so portrait assets never force extra scrolling.
- Inline Gyazo media stays completely flat: **no borders / box-shadows**. When contrast is needed, rely on `--color-panel-alt` as the single backing surface.
- 蜈ｨ繝壹・繧ｸ縺ｧ蜷御ｸ繝医・繝ｳ繧剃ｿ昴▽縺溘ａ縲∵悽譁・ｸｭ縺ｮ逕ｻ蜒上・蜍慕判繧ゅョ繝輔か繝ｫ繝医〒貂帛・繝輔ぅ繝ｫ繧ｿ・井ｾ具ｼ啻filter: brightness(0.85)`・峨ｒ驕ｩ逕ｨ縺吶ｋ縲・
- Lists use default bullets; ensure `padding-left: 1.5rem`.
- `.placeholder` component is dashed border block for 窶懊∪縺繝壹・繧ｸ縺後≠繧翫∪縺帙ｓ窶・states and 404 page.

## 8. TOC
- Place TOC and the future Tips block inside the right sidebar column. Apply the border only to the TOC body, not the entire sidebar.
- Each link carries a subtle guide line; the active item also shows a border highlight with the accent color.
- Reserve a grey rectangular placeholder beneath the TOC for character/Tips content.

## 9. Workflow Assets
- **Workflow JSON**: render as `filename | Copy | Download` rows (chips). Copy buttons read from hidden `<pre>` nodes to avoid DOM pollution; download links point at `/workflows/<slug>.json`.
- **髢｢騾｣繝ｯ繝ｼ繧ｯ繝輔Ο繝ｼ**: only on `basic-workflows/*` pages. Gather other workflow pages sharing at least one AI-capability tag and render them in a Cosense-style grid (`repeat(auto-fill, minmax(146px, 1fr))`). Each card shows title + summary 窶・no screenshots.
- Images in these sections obey the same `max-height: 300px` rule; JSON data stays pure text (never embedded screenshots).

## 10. Tags & Navigation Data
- `nav.ja.yml` / `nav.en.yml` store sections + page IDs. Every tag slug **must** exist in these files so tag chips can build canonical links.
- Missing page slugs auto-generate placeholders via `src/content/placeholders.11ty.js`. Placeholder copy: 窶懊∪縺繝壹・繧ｸ縺後≠繧翫∪縺帙ｓ窶ｦ窶・

## 11. Fonts & Language Rules
- Always list Berlin Type **before** Zen Kaku Gothic in CSS so Latin glyphs render in Berlin Type, even on JA pages.
- `body[lang="ja"]` is still allowed for locale-specific tweaks (date format, etc.) but **not** to change typeface order.

## 12. Assets
- Mock hero image tinted grayscale; when no asset, fill with ``--color-panel-alt``.
- Icons remain monochrome, `currentColor`, 24px viewBox.
- Placeholder cat illustration (mock bottom-right) will be added later; for now reserve space in layout for helper popover.

> Follow the mock first. If a token or component is missing, update `/ops/style-design.md` before touching `/src`.

