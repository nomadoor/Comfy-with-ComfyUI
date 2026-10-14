# STYLE-DESIGN — Visual Tokens And UI Rules

## 0. Identity
- JA site title: **「Comfyに使うComfyUI」** / EN: **“Comfy with ComfyUI”**. Strings live in `site.json`.
- IA sections remain `begin-with`, `data-utilities`, `ai-capabilities`, `basic-workflows`, `notes`.
- Design intent: full-bleed black canvas, single-column article, chrome anchored on the left and top.
- Dark theme is canonical. The light theme reuses the same token keys under `:root[data-theme="light"]`.
- The values below describe what the site stylesheet (`src/styles/*.css`, served as `/assets/css/site.css`) renders today. When the two disagree, the rendered CSS is the reference and this file is corrected to match (owner decision, 2026-10-14).

## 1. Color Tokens
| Token | Dark | Light | Usage |
| --- | --- | --- | --- |
| `--color-bg` | `#040404` | `#f1f1f1` | Body background. |
| `--color-panel` | `#111111` | `#d9d9d9` | Sidebar and cards. |
| `--color-panel-strong` | `#1d1d1d` | `#d9d9d9` | Code blocks, footer link icons, workflow controls. |
| `--color-panel-alt` | `#1a1a1a` | `#d9d9d9` | Active nav rows, hero fallback, search input. |
| `--color-reader` | `#101010` | `#ffffff` | Central reading surface behind `app-shell__content`. |
| `--color-sidebar-surface` | `#101010` | `#e8e8e8` | Sidebar and TOC column surface. |
| `--color-border` | `#292929` | `#d8d8e0` | Default 1px lines (`<hr>`, footer top line). |
| `--color-border-strong` | `#3a3a3a` | `#bebec7` | Nav child indent line, media step corner square for `Workflows` / `Walkthrough`. |
| `--color-text` | `#B0B0B0` | `#181818` | Article text, recommended-model nav labels. |
| `--color-text-muted` | `#636363` | `#51515a` | Body default, supporting text, controls. |
| `--color-heading` | `#dfdfdf` | `#222222` | Headings, top-level nav rows, popup data text. |
| `--color-highlight` | `#9458A3` | (same) | Accent bar (active nav/tab), list markers, TIP callout. |
| `--color-link` | `#cfc6ff` | (same) | Language toggle gradient, contact form description. |
| `--color-danger` | `#ff7a7a` | `#b42318` | Error and validation text. |
| `--color-chip-bg` | `#1d1d1d` | `#ffffff` | Tag chips, language toggles. |
| `--color-chip-border` | `#3d3d3d` | `#d8d8e0` | Chip outline, inline code background (dark). |
| `--color-section-strong` | `#DEDEDE` | `#2f2f2f` | Strong labels in tooltips and popups (code copy, contact form, assistant rail). |
| `--color-tav-strong` | `#2f2f2f` | `#f1f1f1` | Active / hover surface of section buttons, focused search inputs. |
| `--color-hero-title` | `var(--color-heading)` | `var(--color-bg)` | Hero タイトル専用前景色。背景画像の明度に依らず可読性を確保する。 |
| `--color-code-text` | `#e9e9e9` | `#1f2430` | コードブロック／インラインコードのデフォルト文字色。 |
| `--token-comment` | `#6c7394` | `#6e7781` | コメント、DOCTYPE。背景に対して WCAG AA 目安を満たす。 |
| `--token-punctuation` | `#c3c8ff` | `#5b6476` | 記号・句読点。 |
| `--token-property` | `#ffb86c` | `#c8551d` | プロパティ名・タグ・定数。 |
| `--token-number` | `#ff6cf6` | `#7b2cbf` | 数値・boolean。 |
| `--token-string` | `#8bf8d8` | `#1f7a3e` | 文字列、属性値。 |
| `--token-operator` | `#fef0a5` | `#7a5f00` | 演算子、entity、url。 |
| `--token-atrule` | `#9eb0ff` | `#2f6fda` | @規則、関数、class 名。 |
| `--token-keyword` | `#db8bff` | `#af52de` | 言語キーワード。 |
| `--token-regex` | `#ffc8dd` | `#c02c5a` | 正規表現、important。 |

The hero fallback stays solid charcoal (no gradient).

**Code color guidance:** Code blocks keep the existing backgrounds (`--color-panel-strong` for block, `--color-chip-border` for inline). Syntax colors must come from the `--color-code-text` / `--token-*` tokens listed above. When changing any code color, update this table first, then adjust CSS to match. Target contrast is roughly WCAG AA (≥4.5:1) against the block background for both themes.

## 2. Typography
- Base font stack (all locales), `--font-base`: `"Plus Jakarta Sans", "Zen Kaku Gothic New", "Hiragino Sans", system-ui, sans-serif`. Both web fonts load from Google Fonts in `base.njk`; there is no `@font-face` in the site CSS.
  - Latin glyphs render via Plus Jakarta Sans, Japanese via Zen Kaku Gothic New.
- Headings use 600 weight; body 400.
- Line height: `1.7`.

## 3. Layout & Spacing
- Spacing scale: `--space-2xs` 0.25rem, `--space-xs` 0.5rem, `--space-sm` 0.75rem, `--space-md` 1rem, `--space-lg` 1.5rem, `--space-xl` 2rem, `--space-2xl` 4rem.
- Border radii: `--radius-md` (0.5rem) for components, `--radius-sm` (0.25rem) for small parts inside them, `--radius-pill` for pills.
- Breakpoints in use: width 1400, 1100 (mobile layout below, desktop from 1101), 900, 800, 768, 700; height 1080, 950, 720. They are recorded as they are; merging them changes rendering.
- Grid: sidebar `15rem`, content `50rem` max, TOC `15rem`. Side rails add internal padding without reducing their content width. Column gap is `1.5rem`; outer padding is `--shell-padding = --space-xl = 2rem`; and `--layout-max = sidebar + content + toc + (gap * 2) + (--shell-padding * 2)`. Header uses the same width.
- Header height `72px`, sticky at the top. Logo / search / actions stay centered within their columns; search input maxes at 80% width (竕､520px).
- On desktop, search, theme, and language controls live in the top-right header actions area. Header actions may use their own compact width instead of being constrained to the TOC column. On mobile, keep the existing search toggle and sidebar footer controls.
- The desktop search dropdown stays aligned to the search input width. Do not widen it independently of the input or use scrollbars for the capped result list.
- Search inputs suppress browser-native search decorations such as WebKit cancel buttons; use only the site's own search icon/control styling.
- Header search and Notes finder search use the same compact surface behavior: `--color-panel-alt` normally and `--color-tav-strong` while focused.
- Notes finder keeps exactly `--space-md` (`1rem`) between its local search input and tag buttons.
- Desktop rails sit in the grid columns with `height = 100vh - header - bottom padding`, stay sticky below the fixed header, and scroll internally without drift. The app shell has no top padding on desktop; mobile reverts to stacked layout.
- On desktop, the document/body is the native scroll root. The central reader surface is part of normal document flow, with a zero-height sticky corner mask that preserves the upper radius below the fixed header without creating a persistent top gap. Wheel, keyboard, and middle-button scrolling use browser-native document behavior instead of JavaScript proxying.
- The root `html` element reserves scrollbar space with `scrollbar-gutter: stable` so header and content widths do not shift as pages move between scrollable and non-scrollable states.

## 4. Sidebar
- Section icon tabs (`sidebar__section-tabs`): compact icon-only shortcuts inside `sidebar__section-panel`. Active state is indicated by icon color only, without a filled background.
- The left sidebar is split into two visible blocks: `sidebar__sections` for the labeled section selector/dropdown and `sidebar__section-panel` for icon-tabbed navigation plus sidebar controls. The TOC rail remains a single visible block.
- Section selector buttons (`sidebar__sections` / `sidebar__section-btn`) keep inactive labels muted. Active and hover surfaces use `--color-tav-strong`; active selector text remains heading-colored.
- Nav list: single column, children indented with border-left. Active link shows a 2px highlight bar (mock’s purple line).
- Recommended models: a nav link whose URL is in the home page `picks` of the same language gets a 1.25rem `sparkles` icon in `--color-highlight` before its label, and its label uses `--color-text`. Sidebar rows use three brightness steps: top-level rows `--color-heading`, recommended models `--color-text`, other children `--color-text-muted`. The home `picks` frontmatter is the only list; there is no separate flag in nav data.
- Footer: `About` link + language chips (JA/EN) + theme toggle stub. Chips use pill style with accent border when active.
  - Language chip opens a dropdown **upward** so it never falls off-screen; each option links to the same slug in the chosen locale.

## 5. Hero & Tags
- Hero height is fixed at `12rem`. Use a grayscale image (fallback `--color-panel-alt`) with a dark scrim.
- Hero H1 uses `2rem` on all desktop/tablet widths; do not scale it with viewport width.
- Hero content is flex-centered both vertically and horizontally; remove all default margins (H1 included).
- Apply `--radius-md` to the hero container and imagery. Tag chips still appear only on **basic-workflows** pages and link to the AI Capabilities slug.
- Images remain tinted with `filter: grayscale(1) brightness(0.6)` inside the hero.
## 6. Article Body
- The central content column may use a subtle reader surface drawn in normal document flow. It is not a card: avoid borders, shadows, and decorative paper motifs.
- On desktop, `.app-shell__content-corner-mask` keeps only the upper reader corners visible below the header while the document scrolls. It must not reserve vertical space; `.app-shell__content-scroll` is a structural padding and width wrapper, not an independent page scroller.
- The central surface may grow when side rails collapse, but article content inside `.app-shell__content-scroll` stays centered at the content max width.
- Article body content remains transparent inside that surface. Content width follows `--content-max` (`50rem`).
- Article typography follows the calmer blog rhythm: body letter spacing stays `0`, body line-height is about `1.7`, `h2` is around `1.4rem`, and `h3` is around `1.1rem` without accent coloring.
- Plain blockquotes are quotations: no fill, no icon, only an indent and a quieter text colour. Do not use borders, a left accent bar, or italic styling.
- Callouts (`> [!NOTE]`, `[!TIP]`, `[!WARNING]`, see `ops/adr/2026-09-29-callouts.md`) are filled blocks with small radius and a Tabler-style icon, no borders. NOTE: the card fill (text 6% into the reader) and a muted info icon. TIP: `--color-highlight` 14% fill and a purple bulb. WARNING: amber `#c98a32` 20% fill and an amber alert triangle; the only callout meant to stand out.
- Inline images are centered, `max-width: 720px`, `max-height: 320px`, and `object-fit: contain` so portrait assets never force extra scrolling.
- Inline article media (R2 or Gyazo) stays completely flat: **no borders / box-shadows**. When contrast is needed, rely on `--color-panel-alt` as the single backing surface.
- Output examples (`{% outputs %}`) sit in a tray with the media step card fill and no border. Its header is only a small muted image icon and an uppercase "Outputs" label in the card kicker type (no corner square), so it stays quieter than the workflow above. The tray shrinks to the width of the media it holds (capped at the column width), so one or two examples do not sit in a full-width tray. The label is not a heading and stays out of the TOC. `{% outputs "samples" %}` is the same tray for input images readers can use, labelled "Samples" with a download icon.
- Image comparison tables must stay within the article content width. Tables that contain article media use fixed column layout, compact cell padding, and equal-size square media frames; images preserve their own aspect ratio with `object-fit: contain`.
- 全ページで同一トーンを保つため、本文中の画像・動画もデフォルトで減光フィルタ（例：`filter: brightness(0.85)`）を適用する。
- ダークモードでは、本文中のコード（コードブロックの文字と構文色、インラインコードの文字色）と絵文字も同じ 0.85 で減光する。絵文字は文字色が効かないため、Markdown レンダラーが `.emoji` で包む（U+1F000 以降の絵文字と、U+FE0F 付きの記号のみ。`↔` などの文字記号は対象外）。
- Lists use custom markers: first-level unordered lists use small accent dots, nested unordered lists use muted hollow accent dots, and ordered lists use accent numbers.
- Article list markers apply only to authored list content; list-based interface components such as Workflow picker options must reset generated markers.
- `.placeholder` component is a softly filled block (no border) for “まだページがありません” states and the 404 page.
- Media step cards (`mediaRow`) follow `ops/adr/2026-09-29-media-step-cards.md`: every step is its own filled card (one fill step above the reader, no border) listed vertically with a small gap; the first card of a run carries the header with a kind-colored top-left corner square. Inside, the image (about 40%, vertically centred) sits beside the explanation, which is one step smaller and quieter than the body. Only `Deep dive` uses `--color-highlight`; `Workflows` / `Walkthrough` use `--color-border-strong`. Card images alone carry a soft shadow (an exception to flat inline media); parts inside the card use one fill step lighter than the card, never darker.
- Runpod launch card (`{% runpod %}`, see `ops/adr/2026-09-30-runpod-poc.md`): one filled row with the card fill (text 6% into the reader), no border. Left: Runpod's official cube logo, a title saying what the link does, and the recommended GPUs as separate pill chips (text 20% fill, body text colour). Right edge: a muted ↗ centred vertically, then a separate "?" panel one fill step darker that links to `notes/runpod-card` and shows the site's existing popup (`.workflow-performance__popup`) on hover. When the profile has a referral code, a muted "紹介リンクが含まれています" line sits right-aligned just under the card. Placed near the top of the article (Qwen-Image-2.1: before 推奨設定値).
- Lightbox: step-card media opens in a floating window with the step's explanation beside it and zooms inside the window; other media floats frameless at the window's size and zooms across the screen. Previous / next are glass circles just outside the window; close and zoom controls sit in the screen corners, in the same place for every item. No hover movement on the arrows.

## 7. News Rows
- News rows (the News page and the home "latest updates") show `date · section · title`. The section is the nav section label, never the internal key, rendered small in `--color-text-muted` with a small colored dot before it; no chip background.
- Dot colors per section: `begin-with` #4f86e0 (blue), `data-utilities` #3a9d72 (green), `ai-capabilities` #c98a32 (amber), `basic-workflows` `--color-highlight` (purple), `notes` #8a8f98 (gray). Rows without a section keep an empty cell so titles stay aligned.
- In-article `<hr>` and the footer top border are one 2px `--color-border` line of the same width as the article column.

## 8. TOC
- The TOC and the assistant rail (Tips) sit in the right sidebar column. Neither has a border.
- TOC links do not show a guide line by default. Only the active item shows a left accent line.
- The assistant rail bubble list stays transparent. Each bubble button owns its surface, so the gaps between suggestions reveal the underlying rail.

## 9. Workflow Assets
- **Workflow JSON**: render as `filename | Copy | Download` rows (chips). Copy buttons read from hidden `<pre>` nodes to avoid DOM pollution; download links point at `/workflows/<slug>.json`. Align the lower edge of the Copy/Download feedback tooltips with the lower edge of the Performance popup by using the same action-to-popup gap.
- **Workflow performance**: when reference data exists, use the supplied `Performance 1 SVG.svg` through `Performance 3 SVG.svg` assets beside the unchanged Copy and Download controls. Preserve the existing zero-gap placement between Copy and Download, then separate only the Performance control with the compact action gap. Center the compact popup over the meter on desktop and include a small localized Performance label at its top so the unfamiliar meter remains as identifiable as the Copy and Download actions. Match that label's font size, weight, and line height to the Copy and Download tooltip labels, but use `--color-text-muted` to keep it subordinate. Keep `GPU` on the first line and `RAM + tags` on the second. Put Workflow total time at the upper right and optional ComfyUI Sampler speeds below it. Accept authored `s/it` or `it/s`, but normalize popup output to `s/it`; convert `it/s` by reciprocal and show two significant digits. When more than one Sampler speed is shown, require a short identifying name for each. Let the popup shrink-wrap its contents instead of imposing a minimum width. Each environment row uses a two-column grid with the environment data followed by the metrics at exactly `var(--space-sm)`; do not add auto margins, `space-between`, or one-off spacing values. The widest metric ends at the popup's right content edge. Prefix GPU and RAM values with the official Lucide `microchip` and `memory-stick` icons respectively; keep them decorative, monochrome, and smaller than the label text. Keep the popup type at medium weight with enough chip padding to separate icon and text, subordinate to the Workflow row, render upright chip text vertically centered inside each pill, and use `--color-heading` for all data text. Show the measurement condition as a short, always-visible muted note at the bottom rather than a nested tooltip. Show `GPU + RAM + optional tags + total time + optional Sampler speeds` on hover, focus, or tap; Escape, a second tap, and an outside tap dismiss it even while the trigger retains focus. Use existing monochrome tokens rather than warning colors. Hide the meter when the current Workflow has no data.
- **Related pages**: render below article content on section pages. Separate the block from the article with the same quiet horizontal boundary rhythm used by article `<hr>` rules: `--space-2xl` before and after the line. Show only pages in the same locale that share the same tag channel: `tags` match `tags`, and `noteTags` match `noteTags`. If a page has both, score both channels independently and add the matches. Do not fall back to same-section pages without a shared tag; unrelated cards make the footer misleading. Cap the visible set so the footer stays scannable.
- Shared related cards do not lift, draw borders, or cast shadows on hover. Hover / focus feedback belongs inside the thumbnail area: real images zoom subtly. Image-less cards use a quiet `--color-panel-alt` thumbnail with one subdued centered Tabler-style IT icon. The icon stays straight at rest and may add a tiny deterministic rotation while zooming on hover; do not use gradients or patterned placeholder art.
- Images in these sections obey the same `max-height: 300px` rule; JSON data stays pure text (never embedded screenshots).

## 10. Tags & Navigation Data
- `nav.<lang>.yml` stores sections + page IDs. Every regular `tags` slug **must** exist in these files so tag chips can build canonical links. `noteTags` are local Notes finder facets and do not require nav entries.
- Missing page slugs auto-generate placeholders via `src/content/placeholders.11ty.js`. Placeholder copy: “まだページがありません…”.

## 11. Fonts & Language Rules
- Always list the Latin face (Plus Jakarta Sans) **before** Zen Kaku Gothic New so Latin glyphs use it, even on JA pages.
- `body[lang="ja"]` is still allowed for locale-specific tweaks (date format, etc.) but **not** to change typeface order.

## 12. Assets
- Hero image tinted grayscale; when no asset, fill with `--color-panel-alt`.
- Icons remain monochrome, `currentColor`, 24px viewBox. Closed shapes inside a line icon (a frame, a circle, a body) carry a translucent fill of the same colour: mark the element `icon__fill` (CSS sets `fill-opacity` 0.3), or for CSS-mask icons write `fill="currentColor" fill-opacity="0.3"` in the SVG file. Open strokes (chevrons, arrows, crosses, menu, link, download, translate, search) and brand marks stay unfilled. When an icon mixes open and closed strokes in one path, add a separate stroke-less `icon__fill` path for the closed area instead of filling the mixed path.

> If a token or component is missing, update `/ops/style-design.md` before touching `/src`.
