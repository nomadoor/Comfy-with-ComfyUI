---
layout: page.njk
lang: en
section: basic-workflows
slug: sd15-hires-fix
navId: sd15-hires-fix
title: "Hires.fix"
summary: "High-Resolution Image Generation with Hires.fix"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: ""
---

## What is Hires.fix?

![](https://gyazo.com/a63d1a6610c9928b6c21ba39a0d533d0){gyazo=image}

It has a cool name, but what it does is not that complex.

First, generate an image with text2image, then resize that image by 1.5 to 2 times.
Put that enlarged image into image2image and have it redrawn again.

It is simply a consolidation of this procedure.

---

## Why was this method born?

The recommended resolution for Stable Diffusion 1.5 was 512 × 512px, and it could not generate large images.

There are two main reasons for this.

### Problem of Calculation Cost

As the resolution increases, the required VRAM and calculation time increase dramatically.
When image generation first appeared, it was not as optimized as it is now, and generating large images suddenly was a very heavy process.


### Problem of Image Size Used for Training

More fundamentally, it is about **"what size images the model was trained with"**.

![](https://gyazo.com/a5fee7589b0c712f6db86426d8f1cc72){gyazo=image}

Stable Diffusion 1.5 is trained almost exclusively with 512 × 512px images.
In other words, it is good at drawing pictures around this size, but **it hasn't practiced other resolutions at all.**

Suppose you ask a manga artist to suddenly draw a picture filling a gymnasium wall.
Since they usually draw on manuscript paper size, they would probably blindly line up small panels and characters with that sense.

They haven't practiced drawing "one huge picture using the whole wall", and the idea doesn't even occur to them.


### Birth of Hires.fix

So, first have the model draw at around 512 × 512px, which it is good at, then enlarge it, and have it redraw again using the enlarged image as a draft.

This two-stage approach was born.
This idea of "going through the model's comfortable resolution once and then lifting it to high resolution" is the concept behind Hires.fix.


---

## workflow

### Basic Method

![](https://gyazo.com/96cd5924bcaef159a79e2fb5fa991665){gyazo=image}

[](/workflows/basic-workflows/sd15-hires-fix/SD1.5_Hires.fix.json)

- 🟪 text2image
- 🟦 Enlarge the decoded image by 1.5 times with the `Upscale Image By` node
- 🟨 Input the enlarged image into image2image


### Method of Enlarging as Latent

In the previous workflow, the flow was to decode the text2image image into a pixel image once, enlarge it, convert it back to latent, and then image2image.

Here, the idea comes up: "Can't we enlarge it as latent without bothering to return it to a pixel image?"

However, simply enlarging latent causes unacceptable degradation.
Therefore, it was not practical for a long time, but a custom node that performs "latent enlargement with suppressed degradation" has appeared.

- [Goktug/ComfyUI_NNLatentUpscale (forked from Ttl)](https://github.com/Goktug/ComfyUi_NNLatentUpscale)
  - Upscales latent using a neural network.

![](https://gyazo.com/545160bee6b5c66fd91b32e917ada79c){gyazo=image}

[](/workflows/basic-workflows/sd15-hires-fix/SD1.5_Hires.fix_NNLatentUpscale.json)

- 🟩 Enlarge the latent coming out of text2image directly with the `NNLatentUpscale` node
- 🟨 Flow the enlarged latent directly into image2image
