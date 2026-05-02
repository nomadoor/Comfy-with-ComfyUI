# REQUIREMENTS.md - Site Implementation Summary

## 0. Stack & General Rules
- Eleventy + Nunjucks. JavaScript must stay ESM (`<script type="module">`).
- Style with plain CSS; follow `/ops/style-design.md` tokens and transitions.
- Deploy to Cloudflare Pages; treat `/assets/*` as immutable.

## 1. Content & Routing
- Routes follow `/<lang>/<section>/<slug>/` with kebab-case slugs that match nav/data.
- `lang` is one of `ja`, `en`, `zh`.
- Exceptions: `about`, `news`, and `contact` are standalone pages and use `/<lang>/<slug>/` without `section`.
- The former `faq` section is replaced by `notes`. Old `/<lang>/faq/<slug>/` URLs must not keep duplicate content; redirect them with Cloudflare Pages `_redirects` to `/<lang>/notes/<slug>/`.
- Markdown lives under `src/content/<lang>/`; workflows sit in `src/workflows/<slug>/*.json`; shared data under `_data`.
- Front matter requires `slug`, `title`, `created`, and `updated`. `created` / `updated` use `YYYY-MM-DD`; when exact authorship dates are unknown, use the best available Git history date and adjust later if the owner provides a better date. `tags` は任意（最大5件）。ただし **`ai-capabilities` セクションは原則 tags なし**。例外的に付ける場合はオーナー指示と `/ops` 合意を先に取る。`draft: true` で非公開化。

## 2. Navigation & Tags
- Locale menus come from `_data/nav.<lang>.yml`; keep IDs aligned with folders and front matter.
- `nav.zh.yml` mirrors the same slug IDs as `ja/en` (titles can be placeholders until translation).
- Tags are **optional**. When present, they must be consistent with the slug/topic, specific but not spammy, and limited to **max 5** per page.
- The `notes` section is a flat collection. Its left sidebar panel uses a fixed `find` link, an independent Updated / Views segment control, and a flat title list. It must not render category headings or nested children.
- `/notes/find/` is a local note finder page. It filters only notes by title, summary, and tags; it does not change the global header search.
- Every page begins with one H1. Section badges and chip styles come from `/ops/style-design.md`.
- On short viewports, sidebar section switching uses a compact dropdown: show only the current section label by default and expand section choices on tap/click.
- Compact mode applies to:
  - mobile viewports (`max-width: 1100px` and `max-height: 720px`)
  - short touch devices (`hover: none`, `pointer: coarse`, `max-height: 900px`) such as iPad landscape, regardless of width.
  - any short viewport (`max-height: 950px`) so low-height landscape windows also collapse sections.

## 3. Related Pages
- Render related cards below article content with the shared related-card component.
- Relatedness is tag-channel based:
  - `tags` match only other `tags`.
  - `noteTags` match only other `noteTags`.
  - If a page has both channels, score both independently and add the matches.
- `ai-capabilities` pages normally omit `tags`; for related-page matching only, their `slug` is treated as an implicit `tags` key so matching workflow pages can surface.
- Do not fall back to same-section pages without a shared tag. A card without a shared tag is misleading.
- Keep results in the current locale and cap the visible set so the footer stays scannable.

## 3.5 Prev/Next Links (Article Footer)
- Render a previous/next page row beneath the related pages block on article pages.
- Ordering follows `_data/nav.<lang>.yml` within the current locale.
- Each link uses a simple caret + page title label.
- Hide the previous or next link if it does not exist.

## 3.6 Footer Navigation
- Footer primary navigation is fixed to four links:
  - How to use this site
  - Updates (route remains `/news/`)
  - Contact
  - GitHub
- `About` is not part of the primary footer navigation.

## 3.7 Contact Page (`/contact/`)
- `/contact/` is a standalone page and must provide two hubs under `#site`:
  - correction/bug reports
  - article requests
- Both forms remain mounted in the DOM to avoid layout jumps; toggling is done with visual state + disabled controls (no `display: none` for the form containers).
- Query handling:
  - `type=fix|request` sets the initial selected hub.
  - `url=<page-url>` prefills the correction URL input.
- Article pages provide a footer shortcut link to contact:
  - `/contact/?type=fix&url=<current_url>#site`

## 3.8 Contact Page (`/contact/`) Operator Form
- The operator form on `/contact/` must submit directly to `POST /api/contact` (no `mailto:` flow).
- Frontend requirements:
  - Use a two-step flow: input -> confirmation -> send.
  - Render Cloudflare Turnstile widget (`cf-turnstile`) on the confirmation state (not the initial input state).
  - Submit via `fetch("/api/contact", { method: "POST", body: new FormData(form) })`.
  - Disable the submit button while sending, show localized success/error status, and reset the form on success.
- Backend requirements (Cloudflare Pages Functions):
  - `functions/api/contact.ts` handles `POST /api/contact`.
  - Validate `cf-turnstile-response` against Turnstile `siteverify` with `TURNSTILE_SECRET`.
  - Send validated messages via Resend using `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`.

## 4. Workflow JSON Block
- Render `<filename>.json  [Copy]  [Download]` for each workflow entry.
- Copy button uses the tooltip cycle: default -> "Copy" -> "Copied".
- Download link forces `Content-Disposition: attachment`.

## 5. Media & Lightbox
- Default media brightness: `filter: brightness(0.85)`. Obey the 320px article media height cap unless overridden.
- Hero media may be an image or a Gyazo `.mp4` video URL. Hero videos autoplay muted loop and are purely decorative.
- Lightbox must support Esc close, +/- zoom, and arrow keys or buttons for navigation.

## 6. Search
- `search/index-<lang>.json` feeds client search with `title`, `tags`, and H2/H3 snippets.
- Inputs need localized label, placeholder, and ARIA text.
- Use `searchExclude: true` in front matter for test/internal pages that should remain routable but hidden from search results.
- Search results are capped at 5 items per query.
- Ranking prioritizes exact/partial title matches, then slug/tags/summary, then body text matches.
- When the search input is focused and empty, show up to 5 recent search terms from local storage.

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
- Provide a single JavaScript-unavailable fallback notice near the top of article content. Hide it by default when scripts run (`html.js` flag) so normal layouts are unaffected.

## 11. CI & Quality Gates
- Every slug must exist in nav files and directories.
- `tags[]` は **任意**。使う場合は `_data/tagIndex.js` 由来で最大5件。`ai-capabilities` は tags なしが既定。
- All standard markdown `<img>` elements need width/height attributes or CSS aspect enforcement.
- Exception: Gyazo-rendered embeds (`![](...){gyazo=image|loop}` and equivalent `mediaRow` Gyazo usage) are allowed without per-image width/height in Markdown because renderer/CSS enforces dimensions and media caps.
- Update README/ADRs whenever IA or UX changes.

## 12. Deliverables
- Required folders: `.eleventy.js`, `layouts/`, `includes/`, `assets/js/`, `_data/`, `src/content/**`.
- Tests live in `tests/` (Playwright). Update or add tests for behavior changes.

## 13. Change Control
- IA/nav, hero, sidebar, or major UX shifts require an ADR before merge plus reviewer approval.
- Weekly rollups summarize ADR decisions.

## 14. Right-Rail Tips Widget
- States remain `collapsed`, `hover-expanded`, `json-help`, `form-correction`, `form-request`, `submitted`. `data-view` controls which window renders while `data-expanded` only drives the avatar animation.
- `collapsed`: tiny square anchored bottom-right with character peek.
- `hover-expanded`: desktop hover or mobile tap reveals three CTA bubbles (panel view). Selecting a CTA hides the panel and swaps in a fixed-width window positioned in the exact same rail slot.
- Windows never close on hover-out/background clicks; the only exits are the circular close icon (Cross SVG asset) or the “send another request” CTA inside the submitted view.
- `json-help`: copy stack + Gyazo loop clip. Use the existing media tokens (brightness 0.85, 300px height cap) and autoplay muted loop.
- `form-correction` / `form-request`: two-step flow (`確認` -> preview -> `送信`). Confirm locks the textarea, shows the preview card, and exposes the Send + Edit buttons. The Send button posts to the Cloudflare Worker endpoint defined by `ASSISTANT_FEEDBACK_ENDPOINT`, always attaching `window.location.href` and `navigator.userAgent`.
- Successful POST responses transition the rail into the `submitted` state, echo the category label, and keep the avatar expanded so the panel can be reopened immediately.
- Mobile: tap toggles expansion, lock body scroll while any window is open, and keep CTA hit areas full width.
- Gyazo embeds inside the rail reuse article media filters (flat, no drop-shadows, explicit width/height).

## 15. Link Behavior
- Every anchor must be classified as internal or external so styles can target them (`data-link-type="internal|external"` plus `.link--internal` / `.link--external` classes).
- External links (different origin, protocol-relative URLs, or explicit `mailto:`/`tel:` schemes) always open in a new tab/window and append `rel="noopener noreferrer"` unless the anchor has a `download` attribute.
- Internal links keep in-app navigation; components must not override this unless an explicit spec requires a different behavior.

## 16. Heading Permalinks (Article)
- Article H2/H3 headings expose a permalink affordance: an icon appears on hover (and on keyboard focus).
- Clicking the icon copies the canonical URL including the `#<heading-id>` fragment to the clipboard.
- This is UI chrome (not authored content): do not add manual permalink markup inside Markdown.

## 17. Social Cards (OGP / Twitter)
- Add Open Graph and Twitter card meta tags in the base layout.
- Use `summary` for the card type (no large image cards).
- `og:title` / `twitter:title` should use page `title`.
- `og:description` / `twitter:description` should use page `summary` (fallback to site default).
- `og:url` should be absolute, built from `site.url` + `page.url`.
- `og:image` / `twitter:image` should use the page hero image if it is an image (not `.mp4`).
  - If the hero is a video or missing, fall back to `site.ogImage`.
- `site.url` and `site.ogImage` live in `src/_data/site.json`.

## 18. i18n SEO (Canonical / Hreflang / Sitemap)
- `link rel="canonical"` must be present for every page (`site.url + page.url`).
- `hreflang` must be emitted for `ja`, `en`, `zh`, plus `x-default`.
- Sitemaps should include alternate language references (`xhtml:link`) or equivalent per-locale sitemaps.
- Language-switch discoverability can be emphasized via a short-lived animated glow around `.sidebar__lang` only on initial page access, and only when page language differs from the browser-preferred supported language (`ja`/`en`/`zh`) (non-blocking, no popup/modal).
- Suppress repeated glow for 1 day via client storage.

## 19. Agent Discovery / AI Search
- The site's content is CC0 and should be broadly discoverable by search engines, AI search, agents, and reuse workflows.
- `/robots.txt` must return HTTP 200 as `text/plain`, include explicit crawler rules, and reference the canonical sitemap.
- AI crawler policy is permissive: allow crawling for search, AI input, and AI training unless a future owner directive narrows this policy.
- Publish machine-readable discovery files under `/.well-known/` only when they describe real site capabilities; do not advertise protected APIs, OAuth issuers, or MCP servers that do not exist.
- Prefer low-maintenance static discovery artifacts for this Eleventy site. Cloudflare-only features may be enabled operationally, but their intended behavior must be reflected here or in an ADR.
- WebMCP support, when present, must be progressive enhancement only. If `navigator.modelContext` is unavailable, the site must behave exactly as before.
