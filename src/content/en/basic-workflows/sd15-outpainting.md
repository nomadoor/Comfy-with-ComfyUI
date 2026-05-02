---
layout: page.njk
lang: en
section: basic-workflows
slug: sd15-outpainting
navId: sd15-outpainting
title: "outpainting"
created: 2025-12-07
updated: 2026-03-02
summary: "Drawing outside the image with outpainting"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: ""
---

## What is outpainting?

outpainting is a technique to **draw the "outside" of an image**.

The content is exactly the same as inpainting's **"Type B: Fill the masked part naturally while looking at the surrounding information"**.

The only difference is whether the mask is inside the image or outside.

> We will proceed assuming you have read [inpainting](/en/basic-workflows/sd15-inpainting/) first.

---

## inpainting Model

A straightforward method using an inpainting model.

### workflow

![](https://gyazo.com/dc8564ec48c6ac898fa9f4f080e9bcfd){gyazo=image}

[](/workflows/basic-workflows/sd15-outpainting/SD1.5_outpainting_sd-v1-5-inpainting.json)

- Almost the same as [inpainting/inpainting Model](/en/basic-workflows/sd15-inpainting/#inpainting-model).
- 🟦 Expand the image outward with the `Pad Image for Outpainting` node.
  - The expanded part is output as a mask.
- 🟩 Just connect it to the `InpaintModelConditioning` node.

---

## ControlNet inpaint

If you want to use your favorite model as is, use ControlNet inpaint.

### workflow

![](https://gyazo.com/df7f466617d6c2bd773bedf0eeb03bb5){gyazo=image}

[](/workflows/basic-workflows/sd15-outpainting/SD1.5_outpainting_ControlNet_inpaint.json)

- The basic configuration is the same as [inpainting/ControlNet inpaint](/en/basic-workflows/sd15-inpainting/#controlnet-inpaint).
- 🟦 Expand the image outward with the `Pad Image for Outpainting` node.
  - Again, the expanded part becomes the mask.
- 🟨 Pass the image and mask after outpainting to the pre-processing node for ControlNet inpaint.
