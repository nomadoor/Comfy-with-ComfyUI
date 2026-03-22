# ADR: Replace Swup with View-Transition Router (2025-11-23)

## Status
Accepted – to be implemented on `main` immediately.

## Context
- Swup-based PJAX layer introduced CLS/flicker issues and duplicated lifecycle handling.
- CDN dependency (`unpkg`) occasionally fails; graceful fallback still flashes full reload.
- We want to keep Eleventy static generation, avoid heavy frameworks (Next.js), but still get smoother in-page transitions and reuse the existing shell (header / sidebar / TOC).

## Decision
- Remove Swup entirely from the runtime.
- Introduce a lightweight, custom router that:
  - Intercepts same-origin navigations (left-click, no modifiers) unless `data-router-ignore` or `download`/`target` is present.
  - Fetches the destination HTML, extracts `#page` content, and swaps it with `document.startViewTransition` when available (progressive enhancement).
  - Updates document title, `html`/`body` `lang`, and meta description; re-initialises per-page scripts via `initPage()` and refreshes active nav state.
  - Falls back to a normal navigation on any fetch/parse error or when View Transitions are not supported.
  - Clears `nav-open`/`search-open` classes on each navigation and restores scroll/focus to the new content or hash target.
- Add `data-router-ignore` as the standard opt-out attribute for links that must perform default navigation (e.g., downloads).

## Consequences / Tasks
- Delete Swup bootstrap from `src/assets/js/app.js`; no external CDN load.
- Add `src/assets/js/router.js` implementing the above lifecycle.
- Update templates/components to replace `data-no-swup` with `data-router-ignore` where needed (workflow downloads, etc.).
- Keep progressive enhancement: JS disabled → normal MPA reloads; View Transitions unsupported → fetch swap without animation.
- QA: verify CLS reduction on nav, ensure language switch and hash links remain correct, and confirm downloads/forms are not intercepted.

## Alternatives Considered
- Full SPA rewrite (Next.js or similar): rejected as too heavy and misaligned with Eleventy content pipeline.
- Keeping Swup but customising hooks/CSS: insufficient to fix CLS and still depends on CDN.

