# ADR: Global Image Fade & Related Hero Loader (2025-12-10)

- Status: Accepted  
- Date: 2025-12-10

## Context
- Existing fade-in (ADR 2025-11-14-lazy-image-fade) covered only `.article-body img` via an inline script; SPA view-transition routing skipped that inline code on client-side navigations, so cached/linked images appeared instantly.
- Related workflow thumbnails relied on an inline loader inside `page.njk`; under SPA navigations that script did not re-run, leaving `--hero-image` unset and thumbnails blank.
- We also standardized the default transition timing to the design token (100 ms cubic-bezier(0.2, 0.91, 0.85, 0.96)), then relaxed to ~400 ms for better perceptual smoothing, and need a single source of truth.

## Decision
1) Move image fade-in to a global, idempotent enhancer (`src/assets/js/image-fade.js`):
   - Apply `.img-fade` to **all** `<img>` elements (not just article body) on load, SPA navigation, DOM insertions, and bfcache restores.
   - Use keyframe animation triggered by `is-loaded` to ensure cached images still fade.
2) Add a dedicated related-hero loader (`src/assets/js/related-hero.js`) and invoke it from `page.js` every navigation so workflow cards always hydrate their preview background and fade in.
3) Remove page-level inline scripts for these behaviors to avoid duplication; keep timing aligned with the site’s default transition token (now 400 ms ease for better comfort while loading lightweight previews).

## Consequences
- Fade-in now works consistently on reloads, SPA navigations, and cached returns; no reliance on inline page scripts.
- Related workflow thumbnails render reliably after client-side navigations; blank previews are avoided.
- Any future transition timing changes should be reflected in the shared CSS token/animation to stay consistent across components.
- Slight extra JS runs per navigation (querying imgs and related heroes), but bounded and idempotent; acceptable for current perf budget.
