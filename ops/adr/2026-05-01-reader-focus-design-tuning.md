# ADR: Reader Focus Design Tuning

Date: 2026-05-01
Status: Proposed

## Context

The current documentation layout is useful, but the side rails can attract more attention than the article column. The owner wants to refine the visual hierarchy without adopting the decorative bound-paper treatment from the related blog project.

## Decision

Test the design in small reversible steps on a feature branch.

1. First trial: reduce side-rail visual weight and tighten the article reading rhythm.
2. Second trial, only if needed: add a subtle central reading surface behind the article column.
3. Keep the current dark identity and overall Comfy with ComfyUI visual direction.
4. Do not introduce blog-specific decoration, large shadows, or paper-binding motifs.

## Initial Trial Criteria

- Sidebar and TOC should recede behind the article.
- Article text should feel less scattered by removing broad tracking.
- Body copy should be easier to scan with a narrower measure and a calmer line height.
- Hero treatment should be less dominant so documentation content becomes the first visual priority.

## Follow-Up

If the first trial still leaves the rails too prominent, evaluate a central reading surface as a separate patch.
