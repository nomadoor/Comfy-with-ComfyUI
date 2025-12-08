---
layout: page.njk
lang: en
section: basic-workflows
slug: esrgan
navId: esrgan
title: "ESRGAN"
summary: "Image upscaling and face restoration"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: ""
tags: ["upscale-restoration"]
---

## What is ESRGAN?

Before diffusion models (like Stable Diffusion) became popular, the main player in image generation was **GANs**.
ESRGAN is an upscaling model inherited from that GAN generation.

ESRGAN is a **Super-Resolution GAN** for upscaling low-resolution images to high resolution.
It doesn't just enlarge; it draws "plausible details" while enlarging by 2-4 times.

It is very lightweight compared to upscaling with diffusion models, so there are still many opportunities for it to play an active role.

## Model Download

There are a ridiculous number of models depending on the use case, but for now, let's use the following models.

**RealESRGAN**
- `ComfyUI Manager` → `Model Manager`
- Search for `RealESRGAN x4` and `Install` it.

[OpenModelDB](https://openmodeldb.info/)
  - Models developed by volunteers are shared here.
  - There are models specialized for cleanup, so it's fun just to look around.

## Upscaling with ESRGAN

![](https://gyazo.com/daebc07f85601b354c872a0a27f3fec1){gyazo=image}

[](/workflows/basic-workflows/esrgan/RealESRGAN.json)

- 🟩 Load any model into the `Load Upscale Model` node.

### Correcting magnification

Most upscalers like `RealESRGAN x4` have text like `x4`.
This is the magnification, and using this model to upscale will **forcibly** make it 4 times larger.

However, for example, when incorporating it into a Hires.fix workflow, 4 times is too large.
In such cases, add a process to shrink the image enlarged by the upscaler.

### workflow

![](https://gyazo.com/c05fc016293e3f1ae55b153cf1adaaae){gyazo=image}

[](/workflows/basic-workflows/esrgan/RealESRGAN_x0.5.json)

- 🟨 You can adjust the magnification by changing the `scale_by` value.

---

## Correcting only faces with GFPGAN

There is **GFPGAN** as a **Face-specific restoration GAN**.
It is a type of model that detects faces collapsed by noise and redraws them close to "learned beautiful faces".

It sometimes appears for the purpose of "fixing only the face while you're at it" in post-processing such as FaceSwap nodes.

We won't cover detailed usage here, but it's enough to remember that there is **"a finishing GAN specifically for fixing faces"**.
