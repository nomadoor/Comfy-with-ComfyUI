---
name: external-model-research
description: Use when researching current model, paper, GitHub, Hugging Face, ModelScope, ComfyUI, or custom-node information before writing or correcting docs.
---

# External Model Research

## Rules

- Prefer official sources: project page, paper, GitHub, Hugging Face, ModelScope, ComfyUI docs or PRs.
- Verify current filenames, model placement, license-sensitive notes, and release dates.
- Clearly separate sourced facts from inference.
- Do not over-import upstream marketing language.
- Capture only the facts needed for this docs repo.

## Output Into Articles

- Keep download/model placement instructions practical.
- Link to stable source pages when useful.
- Avoid claiming support exists unless ComfyUI/workflow evidence supports it.

## Checks

- `npm run check:content`
- `npm run build`
