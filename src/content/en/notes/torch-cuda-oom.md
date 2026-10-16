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
seoTitle: "torch.cuda.OutOfMemoryError in ComfyUI: Causes and Fixes"
seoDescription: "Fix torch.cuda.OutOfMemoryError (out of VRAM) in ComfyUI: how model size, resolution, and batch size use VRAM, and ways to avoid the error."
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: ""
---

## Symptom

- As soon as you run the workflow, or partway through sampling, a red error screen appears and processing stops.

- The terminal shows `torch.cuda.OutOfMemoryError` along with a message about VRAM usage.

## When it happens

- When running heavy models such as Flux or video models at a high resolution or with a large batch size.


## Cause

- The combination of model + image size + batch size is too large for the GPU's VRAM capacity.

## Solution

- Set batch size to 1, and lower resolution to the model's recommended value (around 512-768px for SD1.5, around 1024px for SDXL).
- If that still doesn't work, use a lighter model or consider a quantized model (gguf / nf4, etc.).
- If even that doesn't help, just accept it and upgrade your GPU.
