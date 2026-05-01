---
layout: page.njk
lang: en
section: notes
slug: duplicate-objects
navId: duplicate-objects
title: "People or objects are duplicating in generated images"
created: 2025-12-13
updated: 2026-03-02
tags: ["troubleshoot", "prompt"]
summary: "What to do when characters or objects multiply unnaturally"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: ""
---

## Symptom

- Even though specified as `a single person` or `a single dog`, multiple figures appear.
- Parts like hands and faces seem to be multiplying.

## Timing of occurrence

- When generating with too high resolution such as 1024px or more in Stable Diffusion 1.5.
- When generating with extreme vertical or horizontal resolution.

## Cause

- SD1.5 is trained on square images around 512px, so composition is difficult to stabilize at resolutions larger than that.
  - For detailed background, refer to → [Why generate at 512px × 512px?](/en/notes/why-512px/).

## Solution

- **Generate at a size close to the model's recommended resolution**
  - For SD1.5, try around 512-768px.
