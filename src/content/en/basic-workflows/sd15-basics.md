---
layout: page.njk
lang: en
section: basic-workflows
slug: sd15-basics
navId: sd15-basics
title: "SD1.5 Starter Workflow (Dummy)"
summary: "Sanity-check for workflow rail placement."
tags:
  - sd15-basics
  - conditioning
workflowJson:
  - id: sd15-basic
    title: "SD1.5 Basic Flow"
    json: "/workflows/sd15-basics/standard.json"
    image: "https://i.gyazo.com/f805391f1a7ae6b253440cf16168a763.jpg"
    copy: |
      {
        "workflow": "sd15-basic",
        "notes": "Dummy payload"
      }
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  gradient: "linear-gradient(135deg, #1a1f3f, #352c64)"
---

## Node stack
Outline of sampler → VAE pipeline.

### Text2Image
Config knobs go here.

## Upscale phase
Where hires.fix takes place.
