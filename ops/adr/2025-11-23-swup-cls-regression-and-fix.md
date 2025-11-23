# ADR: Swup CLS Regression & Fade-In-Only Fix (2025-11-23)

## Status
Accepted (implemented on branch `fix/gyazo-placeholder`, commit `7505806`)

## Context
- Navigations were showing large CLS: the 3-column grid (sidebar / #page / TOC) collapsed inward during Swup page swaps.
- Gyazo placeholders were already CLS-safe; the shift came from Swup emptying or hiding `#page` during the fetch/out phase.
- A prior working state existed where CSS handled only a fade-in (`opacity:0` → `1` via `.is-visible`), while `#page` stayed mounted and visible in layout. Later refactors removed the `transition-fade` class from `#page` and let Swup animations interfere, reintroducing CLS and “black frames”.

## Decision
1) **Disable Swup’s built-in animations**  
   - `animationSelector: null` so Swup doesn’t run its own out/in steps or clear the container.
2) **Keep #page in the layout at all times**  
   - `#page` retains its DOM node; only its contents are replaced by Swup.
3) **Fade-in only, driven by our CSS/JS**  
   - CSS:  
     ```css
     .transition-fade { opacity: 0; transition: opacity 260ms cubic-bezier(0.4, 0.0, 0.2, 1); }
     .transition-fade.is-visible { opacity: 1; }
     @media (prefers-reduced-motion: reduce) { .transition-fade, .transition-fade.is-visible { transition: none; opacity: 1; } }
     ```
   - Layout: `#page` has `class="app-shell__content transition-fade"`.
   - JS: after initial load and after every `content:replace/page:view`, add `.is-visible` to `#page`.
4) **Hooks API only**  
   - Use `swup.hooks.on` plus minimal `swup.on` for compatibility, avoiding duplicate logic.
5) **No height locks / overlays**  
   - We rely solely on keeping the container mounted; no min-height hacks or blocking layers.

## Consequences
- CLS is effectively eliminated because the grid’s center column never disappears; only opacity toggles.
- UX shows a short fade-in (260ms) of new content; no dark blank screen between pages.
- Approach is minimal and matches /ops principles (no hidden layout hacks, no extra overlays).
- Future regressions: if `transition-fade` is removed from `#page`, or if `animationSelector` is changed to a selector, CLS may return.
- **Gyazo等のメディア枠が初期描画に乗ることが決定的に重要**  
  - `.article-media__frame` などのプレースホルダーは width/height/aspect-ratio を持つが、`#page` が透明/未表示のままだと初回レイアウトに参加できず、画像ロード後に下方向へ押し出し（CLS様の伸び）が発生する。  
  - `#page` を常時DOMに残し、初期ロードで `is-visible` を必ず付与することで、メディア枠が最初のレイアウト段階で確保され、画像が遅延しても押し出しが起きない。  
  - 今後UI改善時は「プレースホルダーが初回レイアウトに乗るか」を必ず確認すること（Swup設定変更時・transitionクラス変更時は要チェック）。

## Changes
- `src/layouts/base.njk`: add `transition-fade` to `#page`.
- `src/assets/css/site.css`: fade-in-only rules (`opacity:0` base, `.is-visible` → `1`, 260ms easing).
- `src/assets/js/app.js`: Swup init with `animationSelector: null`; ensure `.is-visible` is set on initial load and after `content:replace/page:view`; cleanup remains minimal.

## References
- Commit: `7505806` (branch `fix/gyazo-placeholder`).
- Related prior ADRs: 2025-11-22-swup-transition-plan.md (superseded by this focused fix for CLS regression).
