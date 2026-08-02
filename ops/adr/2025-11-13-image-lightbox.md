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

## 2026-08-02 Extension: Pan And Continuous Zoom

- Replace the two-step-only image zoom with continuous zoom from 100% to a per-image maximum calculated as 1.5 times the raw-intrinsic-to-fitted-size ratio. Do not impose a fixed 500% floor or a device-specific maximum: use the same calculation for every viewport and recalculate after viewport changes. This makes the maximum percentage vary while every image can reach 150% of its raw native rendered size.
- At 100%, clicking the zoom-in cursor image zooms to 200% around the click point. The cursor then becomes a grab hand and dragging pans the enlarged image.
- Support wheel zoom around the pointer, `+` / `-` controls, keyboard `+` / `-`, and touch pinch zoom.
- Allow pointer/touch dragging while zoomed and constrain the image so it cannot be moved completely out of view.
- Keep the fitted 100% state out of a compositor transform layer (`transform: none`, no `will-change`). Apply the translated scale transform and `will-change: transform` only while zoomed.
- Provide a compact percentage and a separate reset icon before the `- / percentage / +` zoom trio. Use a nested flex layout: the outer row centers the reset control against the zoom trio with no gap, and the inner row centers `- / percentage / +` with tight spacing and no transform or pixel offsets. Keep the minus/plus controls symmetric around the percentage. Disable and mute the reset control at 100%; enable it only when scale or position can be reset. Changing media or closing the lightbox resets scale and position.
- Clicking the backdrop while zoomed resets scale and position; clicking it at 100% closes the lightbox. `Escape` always closes immediately.
- Keep previous/next buttons and arrow-key navigation available at every zoom level. Video lightbox behavior remains unchanged.
- Keep the viewer image-first: the media canvas uses the full viewport, the image at 100% fits between the previous/next buttons without covering them, zoom controls and help sit at the bottom right, and a clearly visible close `×` sits at the top right. Do not reserve a bottom row or use a prominent pill-shaped zoom bar.
- The full browser viewport is the pan canvas. At 100% the image is fitted inside it; zoomed pixels may extend beyond the fitted image rectangle and are clipped only at the browser viewport edge, never at the original 100% image bounds.
- Lightbox chrome is flat and borderless. Do not wrap the help or controls in a bordered panel, and do not draw separators between controls.
- Show one quiet, localized interaction hint beside the bottom-right zoom controls. Do not switch the hint by device or input capability: the same text must list click, `+` / `-`, wheel, pinch, and drag operations and remain unchanged across zoom states. Hide the hint for video.
