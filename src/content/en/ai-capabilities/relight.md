---
layout: page.njk
lang: en
section: ai-capabilities
slug: relight
navId: relight
title: Relight
summary: "Task to adjust lighting of an image by changing light source or ambient light"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: 'https://i.gyazo.com/4c413909ac34f89df891a976fc660f70.png'
---

## What is Relighting?

Relighting is the task of adjusting the lighting of an image.

Broadly speaking, it can be divided into two types:

- **Relighting for compositing**: When combining foreground and background, adjusting the lighting of the foreground to blend in with the background.

- **Pseudo-light placement relighting**: Changing lighting by placing pseudo light sources and referring to depth maps and normal maps.

---

## Relighting for Compositing

When you paste a cut-out person or object onto a different background, the "direction of light," "color temperature," "contrast," etc., often do not match the background, making it look obviously composited.

Before AI, there were methods to fix this meticulously using Photoshop, etc., but let's do it quickly with generative AI!

### Diffusion model-based relighting like IC-Light / LBM

![](https://gyazo.com/5e8ab13bbf6385a8413fd8dfdb774a77){gyazo=image}

In the process of learning from a large number of images, diffusion models acquire not only the ability to "generate images" but also statistical knowledge like "this looks more natural" or "if light comes from here, shadows fall like this."

Methods like IC-Light and LBM utilize this property to perform relighting that brings only the lighting of the foreground closer to the background side.

### Instruction-based image editing models + Relighting LoRAs

This is close to the concept of [Refining Rough Collages](/en/ai-capabilities/collage-refine/), with the image of "editing" an object placed in the foreground to blend naturally into the background.

Of course, it is also possible to perform relighting in the sense of simply changing the scene (e.g., making it night or evening) rather than compositing.

Dedicated LoRAs have also been created.
- [dx8152/Qwen-Image-Edit-2509-Relight](https://huggingface.co/dx8152/Qwen-Image-Edit-2509-Relight)
- > ![](https://gyazo.com/74f605b5c212b69e7e0c269066665864){gyazo=image}

---

## Pseudo-light Placement Relighting

Another lineage is the type of relighting that **places pseudo light sources within the scene**.

> ![ClipDrop Relight](https://gyazo.com/1cfc90b511ed7c12e3cfcf9128c170e5){gyazo=loop}

It estimates depth maps and normal maps, places virtual lights such as "spotlight here" and "sunlight from here," and recalculates shades and highlights according to those lights.

This technology is closer to CG or image processing tasks. Things like [ClipDrop Relight](https://clipdrop.co/relight) and [LightLab](https://nadmag.github.io/LightLab/) fall into this category.

There are many studies, but unfortunately, there are not many that can be used practically in ComfyUI at the moment.
