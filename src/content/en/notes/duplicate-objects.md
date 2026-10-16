---
layout: page.njk
lang: en
section: notes
slug: duplicate-objects
navId: duplicate-objects
title: "People or objects are duplicating in generated images"
created: 2025-12-13
updated: 2026-03-02
noteTags: ["troubleshoot", "prompt"]
summary: "What to do when people or objects multiply unnaturally"
seoTitle: "Duplicated People or Objects in AI Images: Fixes"
seoDescription: "Why generated images repeat people or objects, and how to fix it: models like Stable Diffusion 1.5 at too high a resolution or an extreme aspect ratio."
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: ""
---

## Symptom

- You specify `a single person` or `a single dog`, but several people or objects appear.
- Only certain parts, like hands or faces, seem to multiply.

## When it happens

- When generating with Stable Diffusion 1.5 at too high a resolution, such as 1024px or more.
- When generating at an extremely tall or wide resolution.

## Cause

- SD1.5 was trained on square images around 512px, so its compositions tend to fall apart at larger resolutions.
  - For the background, see → [Why generate at 512px × 512px?](/en/notes/why-512px/).

## Solution

- **Generate at a size close to the model's recommended resolution**
  - For SD1.5, try around 512-768px.
