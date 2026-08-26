---
layout: page.njk
lang: en
section: basic-workflows
slug: sd15-outpainting
navId: sd15-outpainting
title: "outpainting"
created: 2025-12-07
updated: 2026-08-26
summary: "Drawing outside the image with outpainting"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: ""
---

## What is outpainting?

outpainting is a technique for **extending an image beyond its edges**.

It may sound like a special kind of generation, but it is not.

You deliberately add blank space outside the image, turn that space into a mask, then inpaint it.

Whether you fill an area inside the image or blank space added outside it—that is all that changes.

> If you have not read [inpainting](/en/basic-workflows/sd15-inpainting/) yet, take a look at it first.

---

## Inpainting model

One way is to use an inpainting model.

### workflow

![](https://gyazo.com/dc8564ec48c6ac898fa9f4f080e9bcfd){gyazo=image}

[](/workflows/basic-workflows/sd15-outpainting/SD1.5_outpainting_sd-v1-5-inpainting.json)

- 🟦 Use the `Pad Image for Outpainting` node to add blank space outside the image.
  - It outputs the padded image and a mask marking the added space.
- 🟩 From there, it is the same as [inpainting/Inpainting models](/en/basic-workflows/sd15-inpainting/#inpainting-models). Connect the image and mask to `InpaintModelConditioning`.

---

## ControlNet inpaint

Of course, you can also use ControlNet inpaint.

### workflow

![](https://gyazo.com/df7f466617d6c2bd773bedf0eeb03bb5){gyazo=image}

[](/workflows/basic-workflows/sd15-outpainting/SD1.5_outpainting_ControlNet_inpaint.json)

- 🟦 Use the `Pad Image for Outpainting` node to add blank space outside the image.
  - It outputs the padded image and a mask marking the added space.
- 🟨 From there, it is the same as [inpainting/ControlNet inpaint](/en/basic-workflows/sd15-inpainting/#controlnet-inpaint). Pass the image and mask to the ControlNet inpaint preprocessor.

---

## Image editing models

Image editing models make this even simpler.

Add a gray area outside the image—the color does not really matter—then feed the result to the image editing model. All you have to do is tell it to outpaint the gray area naturally.

### FLUX.2 [klein]

Let’s try [FLUX.2 \[klein\]](/en/basic-workflows/flux-2-klein/) 9B.

![](https://gyazo.com/15ea40eaf859773d5a1543e1aba4df0b){gyazo=image}

[](/workflows/basic-workflows/sd15-outpainting/Flux.2-klein-9b_image-edit_outpainting.json)

- 🟩 No mask is needed. Give it an image with added blank space and tell it to fill that area.
