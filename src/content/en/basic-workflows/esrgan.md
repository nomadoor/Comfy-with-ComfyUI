---
layout: page.njk
lang: en
section: basic-workflows
slug: esrgan
navId: esrgan
title: "ESRGAN"
created: 2025-12-09
updated: 2026-03-02
summary: "Image upscaling and face restoration"
seoTitle: "ESRGAN in ComfyUI: Upscale Images and Restore Faces"
seoDescription: "Use ESRGAN in ComfyUI to upscale images: model download, adjusting the scale, and restoring only faces with GFPGAN, with workflows."
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: ""
tags: ["upscale-restoration"]
---

## What is ESRGAN?

Before diffusion models (like Stable Diffusion) took off, **GANs** were the stars of image generation.
ESRGAN is an upscaling model handed down from that GAN era.

ESRGAN is a **super-resolution GAN** that upscales low-resolution images to high resolution.
Rather than just enlarging, it adds "plausible-looking detail" as it scales the image up 2-4x.

It's very lightweight compared with diffusion-based upscaling, so it still gets plenty of use.

## Model Download

There's a ridiculous number of models for different uses, but for now, let's try this one.

**RealESRGAN**
- `ComfyUI Manager` → `Model Manager`
- Search for `RealESRGAN x4` and `Install` it.

[OpenModelDB](https://openmodeldb.info/)
  - A place where community-made models are shared.
  - There are even models specialized for cleanup, and it's fun just to browse.

## Upscaling with ESRGAN

![](/media/basic-workflows/esrgan/legacy_gyazo_daebc07f85601b354c872a0a27f3fec1.png){media=image}

[](/workflows/basic-workflows/esrgan/realesrgan.json)

- 🟩 Load any model into the `Load Upscale Model` node.

### Adjusting the scale

Most upscalers have something like `x4` in their name, as in `RealESRGAN x4`.
That's the scale factor: upscaling with this model **always** makes the image 4x larger.

But 4x is too big for some uses, such as when you add it to a Hires.fix workflow.
In that case, add a step that shrinks the upscaled image back down.

### workflow

![](/media/basic-workflows/esrgan/legacy_gyazo_c05fc016293e3f1ae55b153cf1adaaae.png){media=image}

[](/workflows/basic-workflows/esrgan/realesrgan_x0_5.json)

- 🟨 Change the `scale_by` value to adjust the scale.

---

## Fixing just the faces with GFPGAN

There's a **face-specific restoration GAN** called GFPGAN.
It detects faces distorted by noise and redraws them toward the "clean faces" it learned in training.

You'll sometimes see it in post-processing, such as after FaceSwap nodes, to "clean up the face while you're at it."

I won't go into how to use it here. It's enough to remember that **"there's a finishing GAN just for fixing faces."**
