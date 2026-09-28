---
layout: page.njk
lang: en
section: ai-capabilities
slug: object-removal
navId: object-removal
title: Object Removal
created: 2025-12-01
updated: 2026-03-02
summary: The task of removing specific things from an image and typical methods for
  doing so.
seoTitle: "Remove Objects from Images with AI: LaMa to Editing"
seoDescription: "Erase unwanted people, wires, or signs from images: LaMa, diffusion inpainting, and mask-free removal with instruction-based editing models."
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: /media/ai-capabilities/object-removal/legacy_gyazo_e06eeccf0efa2e91773bb54acb31560a.mp4
---
## What is Object Removal?

As the name suggests, it is the task of removing only specific objects from an image.

It naturally removes things you don't want in the picture, such as people, signs, power lines, trash, and passersby, and smoothly fills in the background.

---

## LaMa

Before the advent of diffusion models, CNN-based inpainting models like LaMa were often used as SOTA.

![](/media/ai-capabilities/object-removal/legacy_gyazo_4c0b962c3983bc3296da9b994c07f3b6.png){media=image}

[](/workflows/ai-capabilities/object-removal/lama.json)

It specializes in filling masked areas with surrounding textures and was also used for watermark removal.

---

## Removal by Inpainting

The most primitive method is to prepare a mask and fill it with ordinary inpainting.

Draw a mask on the object you want to remove, write a prompt that matches the background (e.g., "background lawn only", "empty floor"), and inpaint.

![](/media/ai-capabilities/object-removal/legacy_gyazo_2cad88edab0d74b24f0fc78f528a320d.png){media=image}

[](/workflows/ai-capabilities/object-removal/remake_for_sdxl_removing_object_and_filling_with_background.json)

However, sometimes it adds another object instead of removing it, so it was sometimes unstable as object removal.

Therefore, LaMa was sometimes used for preprocessing inpainting in the past, but it is probably unnecessary for current models.

---

## Object Removal with Instruction-Based Image Editing

With recent [Instruction-Based Image Editing](/en/ai-capabilities/instruction-based-image-editing/) models, object removal is becoming a fairly simple task.

Just instruct "remove this person," "remove this sign," "remove the logo on the bottom right," etc.

![](/media/ai-capabilities/object-removal/legacy_gyazo_84af7edfab7cd344f7654090b7957166.png){media=image}

[](/workflows/ai-capabilities/object-removal/qwen_image_edit_2509_object_removal.json)

### Advantage: No Mask Required

A clear advantage over inpainting is that **you don't have to draw a mask**.

If you try to automate object removal, you need to create a mask of the object by segmentation, but originally you have to remove not only the target object but also **shadows and reflections in glass**. This is difficult.

Instruction-based image editing models will remove those as well.
