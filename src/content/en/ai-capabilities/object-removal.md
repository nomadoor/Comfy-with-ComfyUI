---
layout: page.njk
lang: en
section: ai-capabilities
slug: object-removal
navId: object-removal
title: Object Removal
created: 2025-12-01
updated: 2026-03-02
summary: Removing specific things from an image, and the usual ways to do it
seoTitle: "Remove Objects from Images with AI: LaMa to Editing"
seoDescription: "Erase unwanted people, wires, or signs from images: LaMa, diffusion inpainting, and mask-free removal with instruction-based editing models."
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: /media/ai-capabilities/object-removal/legacy_gyazo_e06eeccf0efa2e91773bb54acb31560a.mp4
---
## What is Object Removal?

Just what it sounds like: the task of erasing specific objects from an image.

It cleanly removes things you don't want in the shot, like people, signs, power lines, trash, or passersby, and fills in the background seamlessly.

---

## LaMa

Before diffusion models, CNN-based inpainting models like LaMa were the SOTA and widely used.

![](/media/ai-capabilities/object-removal/legacy_gyazo_4c0b962c3983bc3296da9b994c07f3b6.png){media=image}

[](/workflows/ai-capabilities/object-removal/lama.json)

It specializes in filling masked areas with the surrounding texture, and it was also popular for removing watermarks.

---

## Removal by Inpainting

The most straightforward approach is to make a mask and fill it in with regular inpainting.

Draw a mask on the object you want to remove, write a prompt that matches the background (e.g., "background lawn only", "empty floor"), and inpaint.

![](/media/ai-capabilities/object-removal/legacy_gyazo_2cad88edab0d74b24f0fc78f528a320d.png){media=image}

[](/workflows/ai-capabilities/object-removal/remake_for_sdxl_removing_object_and_filling_with_background.json)

But instead of removing the object, it would sometimes add a new one, so it wasn't always reliable for object removal.

That's why LaMa was sometimes used as a preprocessing step before inpainting, but current models probably don't need it.

---

## Object Removal with Instruction-Based Image Editing

With recent [instruction-based image editing](/en/ai-capabilities/instruction-based-image-editing/) models, object removal is becoming a pretty simple task.

You just say "remove this person," "remove this sign," "remove the logo in the bottom right," and so on.

![](/media/ai-capabilities/object-removal/legacy_gyazo_84af7edfab7cd344f7654090b7957166.png){media=image}

[](/workflows/ai-capabilities/object-removal/qwen_image_edit_2509_object_removal.json)

### Advantage: No Mask Required

The clear advantage over inpainting is that **you don't have to draw a mask**.

To automate object removal, you'd need segmentation to mask the object, but really you need to remove not just the object itself but also **its shadow and its reflection in glass**. That's the hard part.

Instruction-based image editing models remove those too.
