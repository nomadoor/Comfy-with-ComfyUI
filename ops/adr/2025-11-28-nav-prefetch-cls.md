# ADR: Navigation Prefetch & CLS Guardrails

## Status
Accepted — implemented on `perf/nav-lag-investigation`

## Context
- First-page navigations felt slow on constrained networks (~2–2.5s HTML fetch); view-transition adds ~300ms.
- JSON inline copy is negligible; main cost is network fetch plus init.
- Occasional CLS was observed on Gyazo media despite width/height being available.

## Decision
- Add client-side HTML prefetch for same-origin nav links:
  - Triggers on hover/focus and when links enter viewport (IntersectionObserver).
  - Capped to 3 concurrent requests; responses cached in-memory and used on navigation.
- Defer TOC initialization with `requestIdleCallback` (fallback `setTimeout(0)`).
- Strengthen Gyazo placeholders:
  - When metadata is missing, fall back to a 16:9 box instead of a square.
  - Add `min-height` to `.article-media__frame` so the gray block remains during load.
  - Build logs warn if any Gyazo entries are missing dimensions.

## Consequences
- Prefetch reduces perceived latency after brief hover/viewport exposure; no change when browsing directly.
- TOC no longer blocks the swap path; small reduction in main-thread work during navigation.
- CLS risk is reduced even if Gyazo metadata fetch fails; real dimensions still used when present.
- Slightly more network activity from prefetch; limited by in-flight cap.

## Ops / How-to
- Profiling (manual): `window.__CW_PROFILE_NAV__ = true;` in Console to log fetch/swap/init timings.
- Prefetch behavior lives in `src/assets/js/router.js`; TOC idle defer in `src/assets/js/page.js`.
- Gyazo pipeline and fallbacks in `.eleventy.js`; metadata cache: `.cache/gyazo-images.json`.
- Deploy as usual; no new env vars required.

## References
- Code: `src/assets/js/router.js`, `src/assets/js/page.js`, `.eleventy.js`, `src/assets/css/site.css`
- Branch: `perf/nav-lag-investigation`
