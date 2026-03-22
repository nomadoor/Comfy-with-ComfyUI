---
layout: page.njk
lang: en
section: ai-capabilities
slug: object-removal
navId: object-removal
title: Object Removal
summary: The task of removing specific things from an image and typical methods for
  doing so.
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: https://i.gyazo.com/e06eeccf0efa2e91773bb54acb31560a.gif
---
## What is Object Removal?

As the name suggests, it is the task of removing only specific objects from an image.

It naturally removes things you don't want in the picture, such as people, signs, power lines, trash, and passersby, and smoothly fills in the background.

---

## LaMa

Before the advent of diffusion models, CNN-based inpainting models like LaMa were often used as SOTA.

![](https://gyazo.com/4c0b962c3983bc3296da9b994c07f3b6){gyazo=image}

[](/workflows/ai-capabilities/object-removal/LaMa.json)

It specializes in filling masked areas with surrounding textures and was also used for watermark removal.

---

## Removal by Inpainting

The most primitive method is to prepare a mask and fill it with ordinary inpainting.

Draw a mask on the object you want to remove, write a prompt that matches the background (e.g., "background lawn only", "empty floor"), and inpaint.

![](https://gyazo.com/2cad88edab0d74b24f0fc78f528a320d){gyazo=image}

[](/workflows/ai-capabilities/object-removal/Remake_for_SDXL-Removing_Object_and_Filling_with_Background.json)

However, sometimes it adds another object instead of removing it, so it was sometimes unstable as object removal.

Therefore, LaMa was sometimes used for preprocessing inpainting in the past, but it is probably unnecessary for current models.

---

## Object Removal with Instruction-Based Image Editing

With recent [Instruction-Based Image Editing](/en/ai-capabilities/instruction-based-image-editing/) models, object removal is becoming a fairly simple task.

Just instruct "remove this person," "remove this sign," "remove the logo on the bottom right," etc.

![](https://gyazo.com/84af7edfab7cd344f7654090b7957166){gyazo=image}

[](/workflows/ai-capabilities/object-removal/Qwen-Image-Edit-2509_object-removal.json)

### Advantage: No Mask Required

A clear advantage over inpainting is that **you don't have to draw a mask**.

If you try to automate object removal, you need to create a mask of the object by segmentation, but originally you have to remove not only the target object but also **shadows and reflections in glass**. This is difficult.

Instruction-based image editing models will remove those as well.
