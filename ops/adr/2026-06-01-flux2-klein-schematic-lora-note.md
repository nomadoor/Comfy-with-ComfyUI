# 2026-06-01: Add FLUX.2 Klein Schematic LoRA Note

## Status

Accepted

## Context

The owner created a new LoRA experiment for FLUX.2 [klein] that learns RGB outputs resembling computer-vision task maps. The article is an experiment note rather than a reusable workflow recipe.

## Decision

Add a Japanese note at:

- `/ja/notes/flux2-klein-schematic-lora/`

Use the existing flat Notes structure and `noteTags`, without adding a sidebar navigation entry.

## Consequences

- The article is discoverable through Notes and Note finder.
- A workflow JSON was later delivered with the PR at `src/workflows/notes/flux2-klein-schematic-lora/Flux.2-klein-base-9b_image-edit.json`.
- English and Chinese versions were added after the owner explicitly requested translation sync.
