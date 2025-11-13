# ADR: Image Lightbox Interaction (2025-11-13)

## Context
- Article images needed zoom + navigation without mixing JSON/workflow UI.
- Previous implementation used placeholder script and produced no overlay or consistent UX.

## Decision
- Add full lightbox behavior: overlay with left/right nav, ESC, arrow keys, and two-step zoom (1x/2x toggled by clicking the popup image).
- No drag-to-pan requirement; controls stay visible by pinning on top of the image. New SVG icons (Chevron Left/Right, Cross) provide consistent look.
- Hero + inline images are capped at 720×300 and show zoom-in cursor, making interactivity obvious.
- Condition pages include multiple sample images so the carousel can be tested.
- Documented rules in `ops/style-design.md` (already aligned in previous ADR); no further /ops updates beyond ADR entry.

## Consequences
- All article images share the same zoom/navigation experience; keyboard users can close with ESC and navigate via arrow keys.
- Workflow JSON UI remains separate; the lightbox implementation lives entirely in `src/assets/js/lightbox.js` + CSS.
- Any future component touching images must respect the new cursor/size constraints.
