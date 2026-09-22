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
---

## Inline with performance

{% workflow "/workflows/basic-workflows/sd15-basics/sd1_5_text2image.json",
  level=1,
  runs=[
    {
      gpu: "RTX 4070 Ti 12GB",
      ram: "DDR5 64GB",
      time: "51s",
      tags: ["Sage"],
      samplers: [{ speed: "2.3 s/it" }]
    },
    {
      gpu: "RTX 4090 24GB",
      ram: "DDR5 32GB",
      time: "22s",
      samplers: [
        { name: "Base", speed: "1.2 s/it" },
        { name: "Refiner", speed: "1.72 it/s" },
        { name: "Slow pass", speed: "0.0081 it/s" }
      ]
    }
  ]
%}

## Duplicate basename A

{% workflow "/workflows/data-utilities/simple-math/math_expression.json",
  level=1,
  gpu="RTX 4070 Ti 12GB",
  ram="DDR5 64GB",
  time="1s",
  samplers=[{ speed: "2.3 s/it" }, { speed: "1.1 s/it" }]
%}

## Duplicate basename B

{% workflow "/workflows/data-utilities/conditional-branching/math_expression.json",
  level=1,
  gpu="RTX 4070 Ti 12GB",
  ram="DDR5 64GB",
  time="1s"
%}

## Inline without performance

[](/workflows/basic-workflows/sd15-basics/sd1_5_inpainting.json)

## Picker

{% workflowPicker
  {
    file: "!/workflows/basic-workflows/sd15-basics/sd1_5_text2image.json",
    level: 1,
    runs: [
      { gpu: "RTX 4070 Ti 12GB", ram: "DDR5 64GB", time: "51s", tags: ["Sage"] },
      { gpu: "RTX 4090 24GB", ram: "DDR5 32GB", time: "22s" }
    ]
  },
  {
    file: "/workflows/basic-workflows/sd15-basics/sd1_5_image2image.json",
    level: 3,
    gpu: "RTX 4090 24GB",
    ram: "DDR5 64GB",
    time: "13s",
    tags: ["FP8", "Sage", "INT8"]
  },
  "/workflows/basic-workflows/sd15-basics/sd1_5_inpainting.json"
%}
