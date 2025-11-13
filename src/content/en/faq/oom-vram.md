---
layout: page.njk
lang: en
section: faq
slug: oom-vram
navId: oom-vram
title: "Quick VRAM Checklist (Dummy)"
summary: "FAQ placeholder for troubleshooting layout."
tags:
  - oom-vram
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  gradient: "linear-gradient(135deg, #1d1d1d, #2c2c2c)"
---

## Symptom
Look for `CUDA out of memory` in the console.

### Fast fixes
1. Reduce resolution.
2. Drop batch size.

## Long-term plan
Profile VRAM usage and clear caches.
