---
layout: page.njk
lang: en
section: ai-capabilities
slug: conditioning
navId: conditioning
title: "Conditioning Primer (Dummy)"
summary: "Testing hero + TOC within the AI capabilities section."
tags:
  - conditioning
  - upscale-restoration
workflowJson:
  - id: clip-conditioning
    title: "CLIP Text Encoder"
    json: "/workflows/conditioning/clip-conditioning.json"
    image: "https://i.gyazo.com/f805391f1a7ae6b253440cf16168a763.jpg"
    copy: |
      {
        "workflow": "clip-conditioning",
        "notes": "Dummy payload"
      }
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/f805391f1a7ae6b253440cf16168a763.jpg"
  alt: "Conditioning walkthrough"
---

## What is conditioning?
High-level explanation of guidance vectors.

### Channels
- Positive prompt
- Negative prompt

## Practical notes
Balancing CFG against conditioning strength.

![Conditioning gyazo](https://i.gyazo.com/f805391f1a7ae6b253440cf16168a763.jpg)
