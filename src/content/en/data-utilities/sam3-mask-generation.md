---
layout: page.njk
lang: en
section: data-utilities
slug: sam3-mask-generation
navId: sam3-mask-generation
title: "SAM 3 / 3.1"
created: 2026-05-07
updated: 2026-05-07
summary: "AI mask generation with SAM 3 / 3.1"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## What is SAM 3 / 3.1?

[SAM 3](https://github.com/facebookresearch/sam3) is a newer model in Meta's Segment Anything Model series.

Earlier SAM workflows mainly used points or bounding boxes to say "around here." SAM 3 can use short text prompts, then detect and segment the matching object in one flow.

For example, prompts like `person`, `red car`, or `the dog` can be used to find the target and extract its shape as a mask.

[SAM 3.1](https://ai.meta.com/blog/segment-anything-model-3/) is an updated version of SAM 3. The main improvement is more efficient multi-object tracking for video. For still-image masking, it is easiest to think of SAM 3 / 3.1 as the first thing to try.

---

## When to Use It

In ComfyUI, masks are often used for inpainting, compositing, background processing, and partial generation.

SAM 3 / 3.1 is useful when:

- you want to mask only a person in an image
- you want to extract a text-describable target such as a car, clothing, or furniture
- you want a simpler first step before combining YOLO, Grounding DINO, and SAM

For still-image AI mask generation, starting with SAM 3 / 3.1 is the clearest path.

---

## Model Download

SAM 3 support is available on the ComfyUI side, so the basic flow is to download the needed model and use it in a workflow.

Look for the model from `Install Models` in ComfyUI Manager, or download it from Meta's Hugging Face pages.

- [facebook/sam3](https://huggingface.co/facebook/sam3)
- [facebook/sam3.1](https://huggingface.co/facebook/sam3.1)

> Hugging Face may require login or access approval.

---

## workflow

The workflow will be added later.

For now, think of SAM 3 / 3.1 as a model that creates masks from text-specified targets.

Before building a more complex mask generation pipeline, it is worth checking how far SAM 3 / 3.1 can get on its own.
