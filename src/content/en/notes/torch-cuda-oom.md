---
layout: page.njk
lang: en
section: notes
slug: torch-cuda-oom
navId: torch-cuda-oom
title: "torch.cuda.OutOfMemoryError"
created: 2025-12-13
updated: 2026-03-02
noteTags: ["troubleshoot", "vram"]
summary: "torch.cuda.OutOfMemoryError"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: ""
---

## Symptom

- A red error screen appears and processing stops instantly when executing processing or during sampling.

- A message regarding `torch.cuda.OutOfMemoryError` and VRAM usage appears in the terminal.

## Timing of occurrence

- When running heavy models such as Flux / video models with large resolution or large batch size.


## Cause

- The combination of model + image size + batch size is too large for the GPU's VRAM capacity.

## Solution

- Set batch size to 1, and lower resolution to the model's recommended value (around 512-768px for SD1.5, around 1024px for SDXL).
- If that doesn't work, consider using lighter models or quantized models (gguf / nf4 etc.).
- If that still doesn't work, upgrade your GPU honestly.
