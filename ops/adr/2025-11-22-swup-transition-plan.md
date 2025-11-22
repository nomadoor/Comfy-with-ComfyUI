# ADR: Swup Transition Lifecycle Refactor (2025-11-22)

## Status
Draft - in progress on branch `feature/swup-transition`.

## Context
- Goal: enable smooth PJAX-style page transitions using Swup while keeping Eleventy as the static generator and preserving progressive enhancement (full navigation without JS).
- Shell (header, sidebar, right rail) should stay persistent; only `#page` content swaps.
- Recent experiments left duplicated scripts and inconsistent module lifecycles; we need a controlled, idempotent init flow.

## Decision
Proceed with a structured refactor following the checklist below. Items will be checked as they are completed in this branch.

## Transition Refactor Checklist

1. Base template cleanup (Eleventy / Nunjucks)  
   - [x] Inspect `src/layouts/base.njk` for duplicate full HTML structure.  
   - [x] Ensure a single HTML document shell and a single `<script type="module" src="/assets/js/app.js">`.  
   - [x] Remove or migrate scattered inline `<script>` tags into modules or `app.js` where appropriate.

2. JS architecture: lifecycle + init contracts  
   - [x] Review and confirm responsibilities of `app.js` and `page.js`.  
   - [x] Define module roles:  
     - Content-scoped (re-run per navigation): `toc`, `lightbox`, `gyazo-toggle`, `code-copy`, etc.  
     - Global-once (init once, idempotent): `assistant-rail`, `lang-switcher`, `search`, `link-behavior`.

3. Module hardening (idempotency and scope)  
   - [x] `lang-switcher.js`: add init guard to prevent stacked document click listeners.  
   - [x] `lightbox.js`: guard control bindings; re-init only for new images.  
   - [x] `link-behavior.js`: expose `refreshActiveNav()` (or equivalent) callable after each navigation; keep MutationObserver singleton.  
   - [x] Confirm `toc.js`, `gyazo-toggle.js`, `code-copy.js`, `search.js`, `assistant-rail.js` match intended roles and are safe to call accordingly.

4. `app.js` refactor: single entry + Swup bootstrap  
   - [x] Single entry imports `initPage`; has `ENABLE_SWUP` flag.  
   - [x] `bootstrap()` calls `initPage()` once; when Swup present, sets up with `containers: ["#page"]`, `linkSelector: 'a[href^="/"]:not([data-no-swup])'`, hooks `contentReplaced` to `initPage()`, and clears overlay classes on transition out.  
   - [x] Use DOMContentLoaded/readyState to run once.  
   - [x] Disable Swup animations initially (instant PJAX) to reduce flicker.

5. `page.js` refactor: central init hub  
   - [x] Export `initPage(root)` default; `root` defaults to `#page` or `document`.  
   - [x] Call content-scoped modules with `root`; global-once modules as needed.  
   - [x] Call `linkBehavior.refreshActiveNav()` (or similar) after navigation.

6. Re-enable Swup and test  
   - [x] Set `ENABLE_SWUP = true`.  
   - [ ] Verify no double handlers, minimal flicker, active nav updates after navigation (with animations disabled).  
   - [ ] Only after stable, consider optional CSS transitions on `#page`.

7. Regression safety  
   - [ ] JS disabled: full reload navigation works; layout coherent.  
   - [ ] If Swup missing: graceful full reloads, no console errors.

## Notes
- All changes are confined to `feature/swup-transition` per owner instruction.  
- Checklist updates will be recorded here as steps complete.  
- Progressive enhancement is mandatory: Swup is an enhancement layer, not a hard dependency.  
- No additional branches will be created unless explicitly requested.
- Swup is now lazy-loaded and pinned to `https://unpkg.com/swup@4.0.0?module`; if the CDN fails, navigation automatically falls back to full reloads without console errors.
