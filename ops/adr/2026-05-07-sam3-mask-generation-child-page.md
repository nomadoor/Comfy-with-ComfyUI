# ADR: Add SAM 3 / 3.1 child page under AI mask generation

## Context

The AI mask generation page has grown into a broad overview that covers detection, matting, segmentation, and combined workflows. SAM 3 / 3.1 is now the recommended first stop for many static-image mask generation cases because it can handle text-prompted detection and segmentation in one flow.

## Decision

Keep the existing `ai-mask-generation` page in place and add a focused child page for SAM 3 / 3.1 under Data & Image Utilities.

- Parent page: `/<lang>/data-utilities/ai-mask-generation/`
- New child page: `/<lang>/data-utilities/sam3-mask-generation/`

The parent page should link near the top to the SAM 3 / 3.1 page as the simple default path. The child page can stay lightweight at first and later receive workflow JSON once the workflow is ready.

## Consequences

- Navigation gains a child entry below `ai-mask-generation` in each locale.
- The existing overview article remains stable and can be decomposed gradually.
- Future AI mask generation topics may be split out in the same style when they become too large for the parent page.
