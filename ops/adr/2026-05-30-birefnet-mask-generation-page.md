# ADR: Add BiRefNet child page under AI mask generation

## Context

The AI mask generation overview now explains object detection, segmentation, and matting as technologies that are often combined. BiRefNet is a commonly used background-removal / matting model and should have its own focused page instead of being explained in depth on the overview page.

## Decision

Add a Japanese BiRefNet child page under Data & Image Utilities:

- Parent page: `/ja/data-utilities/ai-mask-generation/`
- New child page: `/ja/data-utilities/birefnet/`
- Navigation order under `ai-mask-generation`: `BiRefNet`, then `SAM 3 / 3.1`

The page should follow the lightweight structure of the SAM 3 / 3.1 page: a short explanation, model download location, and a workflow example.

## Consequences

- `ops/ia.md` records BiRefNet as an active child page under AI mask generation.
- Japanese navigation gains a `BiRefNet` child entry above `SAM 3 / 3.1`.
- EN/ZH translation and navigation are not created unless the owner explicitly requests them.
