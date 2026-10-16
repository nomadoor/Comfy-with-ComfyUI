---
layout: page.njk
lang: en
section: basic-workflows
slug: sd15-hires-fix
navId: sd15-hires-fix
title: "Hires.fix"
created: 2025-12-07
updated: 2026-03-02
summary: "High-Resolution Image Generation with Hires.fix"
seoTitle: "Hires.fix in ComfyUI: Generate High-Resolution Images"
seoDescription: "Hires.fix enlarges a generated image and redraws it with image2image. Why it exists and how to build it in ComfyUI, including latent upscaling."
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: ""
---

## What is Hires.fix?

![](/media/basic-workflows/sd15-hires-fix/legacy_gyazo_a63d1a6610c9928b6c21ba39a0d533d0.png){media=image}

It has a cool name, but what it does isn't all that complicated.

First, generate an image with text2image, then resize it to 1.5–2x.
Feed the enlarged image into image2image and have it redrawn once more.

That's all it is: these steps bundled together.

---

## Why Did This Method Come About?

The recommended resolution for Stable Diffusion 1.5 was 512 × 512px, and it couldn't generate large images.

There are two main reasons for this.

### Computational Cost

As resolution goes up, the VRAM and compute time you need shoot up.
When image generation first appeared, things weren't as optimized as they are now, and generating a large image in one go was very heavy.


### The Image Size Used for Training

The more fundamental issue is **"what size of images the model was trained on"**.

![](/media/basic-workflows/sd15-hires-fix/legacy_gyazo_a5fee7589b0c712f6db86426d8f1cc72.png){media=image}

Stable Diffusion 1.5 was trained almost entirely on 512 × 512px images.
So it's good at drawing around that size, but **it never practiced other resolutions in the first place.**

Imagine asking a manga artist to suddenly fill an entire gym wall with a drawing.
They usually draw on manuscript pages, so they'd probably keep that same sense of scale and pack the wall with small panels and characters.

They've never practiced drawing "one huge picture across the whole wall". The idea wouldn't even occur to them.


### The Birth of Hires.fix

So first, have the model draw at around 512 × 512px, where it's comfortable, enlarge that, and then have it redraw using the enlarged image as a draft.

That's how this two-stage approach came about.
This trick of "passing through the model's comfortable resolution first, then lifting it to high resolution" is the idea behind Hires.fix.


---

## Basic Method

![](/media/basic-workflows/sd15-hires-fix/legacy_gyazo_96cd5924bcaef159a79e2fb5fa991665.png){media=image}

[](/workflows/basic-workflows/sd15-hires-fix/sd1_5_hires_fix.json)

- 🟪 text2image
- 🟦 Enlarge the decoded image 1.5x with the `Upscale Image By` node
- 🟨 Feed the enlarged image into image2image


---

## Upscaling as a Latent

In the previous workflow, the text2image result was decoded into a pixel image, enlarged, converted back into a latent, and then run through image2image.

That raises an idea: "Couldn't we just enlarge it as a latent, without bothering to turn it back into pixels?"

However, simply enlarging the latent causes unacceptable degradation.
So for a long time it wasn't practical, but then a custom node appeared that does "latent upscaling with less degradation".

- [Goktug/ComfyUI_NNLatentUpscale (forked from Ttl)](https://github.com/Goktug/ComfyUi_NNLatentUpscale)
  - Upscales the latent using a neural network.

![](/media/basic-workflows/sd15-hires-fix/legacy_gyazo_545160bee6b5c66fd91b32e917ada79c.png){media=image}

[](/workflows/basic-workflows/sd15-hires-fix/sd1_5_hires_fix_nnlatentupscale.json)

- 🟩 Enlarge the latent from text2image as-is with the `NNLatentUpscale` node
- 🟨 Feed the enlarged latent straight into image2image
