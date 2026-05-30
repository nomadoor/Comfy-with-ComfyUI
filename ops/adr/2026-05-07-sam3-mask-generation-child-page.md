# ADR: Add SAM 3 / 3.1 child page under AI mask generation

## Context

The AI mask generation page has grown into a broad overview that covers detection, matting, segmentation, and combined workflows. SAM 3 / 3.1 is now the current SAM-family route for target-specified segmentation because it can handle text-prompted detection and segmentation in one flow.

## Decision

Keep the existing Japanese `ai-mask-generation` page in place and add a focused Japanese child page for SAM 3 / 3.1 under Data & Image Utilities.

- Parent page: `/<lang>/data-utilities/ai-mask-generation/`
- New child page: `/ja/data-utilities/sam3/`

The parent page should keep the conceptual categories of object detection, matting, and segmentation. Within the segmentation section, it should route current SAM usage to the SAM 3 / 3.1 page. The child page can stay lightweight at first and later receive workflow JSON once the workflow is ready.

## Consequences

- Japanese navigation gains a child entry below `ai-mask-generation`.
- The existing overview article remains stable and can be decomposed gradually.
- Future AI mask generation topics may be split out in the same style when they become too large for the parent page.
- EN/ZH translation and nav entries are not created unless the owner explicitly requests them.

## 2026-05-30 Follow-up

The parent `ai-mask-generation` page should act as a lightweight overview and routing page, not a full catalog of legacy custom-node workflows.

- The SAM section should point readers to the dedicated SAM 3 / 3.1 page instead of documenting the old Impact Pack SAM Detector flow.
- SAM 3 / 3.1 must be presented as one segmentation implementation, not as a top-level replacement for object detection, matting, or the overall mask-generation taxonomy.
- Workflow JSON links should be kept mainly in practical examples, not in every concept section.
- Legacy examples can remain for historical/reference value, but must clearly tell readers that SAM 3 / 3.1 is the current route for target-specified segmentation workflows.
- Required custom nodes for legacy workflows should live near the practical examples that need them, instead of appearing as a general prerequisite for the whole page.
