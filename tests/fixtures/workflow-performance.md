---
layout: page.njk
lang: ja
section: basic-workflows
slug: workflow-performance-fixtures
title: "Workflow performance fixtures"
created: 2026-09-21
updated: 2026-09-21
permalink: "/internal/workflow-performance-fixtures/"
searchExclude: true
workflowPerformance:
  sd1_5_text2image.json:
    level: 1
    runs:
      - { gpu: "RTX 4070 Ti 12GB", ram: "DDR5 64GB", time: "51s", tags: [Sage] }
      - { gpu: "RTX 4090 24GB", ram: "DDR5 32GB", time: "22s" }
  sd1_5_image2image.json:
    level: 3
    runs:
      - { gpu: "RTX 4090 24GB", ram: "DDR5 64GB", time: "13s", tags: [FP8, Sage, INT8] }
---

## Inline with performance

[](/workflows/basic-workflows/sd15-basics/sd1_5_text2image.json)

## Inline without performance

[](/workflows/basic-workflows/sd15-basics/sd1_5_inpainting.json)

## Picker

{% workflowPicker
  "!/workflows/basic-workflows/sd15-basics/sd1_5_text2image.json",
  "/workflows/basic-workflows/sd15-basics/sd1_5_image2image.json",
  "/workflows/basic-workflows/sd15-basics/sd1_5_inpainting.json"
%}
