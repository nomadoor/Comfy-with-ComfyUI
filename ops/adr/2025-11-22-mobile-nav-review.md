# ADR: Review of Mobile Navigation Implementation (2025-11-22)

## Context
- Mobile nav/assistant overlay was implemented by another agent (Gemini). Desktop must remain unchanged; mobile spec (per 2025-11-21 ADR) expected a hamburger that opens the sidebar with search＋actions remaining accessible, a visible backdrop, and assistant-rail availability.
- Current code base (branch `feature/mobile-nav`, commit 150579c baseline) now includes the Gemini implementation; we reviewed it to surface regressions and deltas from the agreed plan.

## Findings
1) Missing menu icon  
   - `header.njk` renders `icon("menu")`, but `icon.njk` has no `"menu"` glyph. Result: hamburger button has no visible icon.
2) Search & actions disappear on mobile  
   - `@media (max-width: 1100px)` sets `.site-header__search, .site-header__actions { display: none; }`, contrary to the spec that wanted actions moved next to search, not hidden. Mobile users lose search and header actions entirely.
3) No backdrop element wired  
   - CSS defines `.nav-backdrop`, but the DOM adds none and JS never toggles it. Overlay opens without a scrim; outside-click detection relies on document-level click, which is brittle and gives no visual affordance.
4) Sidebar overlay covers 85% without safe margins  
   - Sidebar is fixed `left:0`, `width:85%`, no top padding for system bars, no focus trap, and no inert on background; keyboard users can tab into hidden content.
5) Assistant rail not exposed on mobile  
   - CSS introduces `.sidebar__mobile-assistant` but no template places assistant content there; assistant remains unavailable when TOC is hidden.
6) ARIA and focus behavior incomplete  
   - `aria-expanded` toggles on the button but no `aria-controls` target exists (`aria-controls="sidebar"` points to a non-existent id). Escape closes, but focus is not returned to the toggle; no body scroll lock on older iOS.

## Impact
- Mobile UX: navigation button invisible; search/notifications inaccessible; no backdrop leads to accidental clicks; assistant absent.  
- Accessibility: broken `aria-controls`, missing focus management, and no visual indicator of modal state.  
- Spec drift: diverges from ADR 2025-11-21 (keep search, actions; add backdrop; keep DOM stable but add safe overlay).

## Recommendations
- Add `"menu"` glyph to `icon.njk` or embed the provided SVG file; ensure visible hit target.
- Keep search and actions visible on mobile; reposition via flex instead of `display:none`.
- Add a real backdrop element, toggle its visibility with `nav-open`, and stop propagation appropriately.
- Constrain overlay width with side margins (e.g., `left/right: 48px`) and apply `overflow: hidden` to body while open; consider focus trap and restoring focus to the toggle on close.
- Expose assistant-rail inside the mobile overlay or provide a mobile entry point; if out-of-scope, explicitly disable via ADR.
- Fix ARIA (`aria-controls` to actual sidebar id) and add keyboard escape + focus return.

## Status
- Proposed: Needs remediation to align with spec and to restore mobile usability.
