# ADR: Reader Focus Design Tuning

Date: 2026-05-01
Status: Proposed

## Context

The current documentation layout is useful, but the side rails can attract more attention than the article column. The owner wants to refine the visual hierarchy without adopting the decorative bound-paper treatment from the related blog project.

## Decision

Test the design in small reversible steps on a feature branch.

Companion token proposal: `/ops/style-design.md` defines the design primitives used by this trial, including `--color-reader`, `--color-sidebar-surface`, `--content-max`, column widths, column gap, rail padding, desktop scroll behavior, article rhythm, list markers, blockquote treatment, and TOC active-line behavior. Implementation in `/src` must follow those token definitions.

1. First trial: add a subtle central reading surface to `app-shell__content`.
2. Second trial, only if needed: tune article reading rhythm.
3. Third trial, only if needed: tune column grouping and side-rail spacing without adding borders.
4. Keep the current dark identity and overall Comfy with ComfyUI visual direction.
5. Do not introduce blog-specific decoration, large shadows, or paper-binding motifs.

## Initial Trial Criteria

- The central content column should read as the primary surface.
- Sidebar, article, and TOC should read as three related column blocks. Side rails may use the same surface color as the article, with internal padding and a narrower column gap to create a unified layout.
- On desktop, article reading should use the browser's native scrolling on `.app-shell__content`; the visible central surface must remain viewport-bound with surrounding space and border radius intact.
- Desktop rails should use the same grid column gap as the central column, not independent fixed-position offsets.
- The left sidebar should expose its information structure as two visible blocks: section switching and section navigation.
- Article typography, hero sizing, and layout rhythm should remain unchanged in this trial.
- The surface should be quiet: no border, no large shadow, no paper decoration, and no blog-specific binding motif.

## Follow-Up

If the first trial still leaves the rails too prominent, evaluate typography, hero, or rail contrast as separate patches.
