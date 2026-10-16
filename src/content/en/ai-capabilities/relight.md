---
layout: page.njk
lang: en
section: ai-capabilities
slug: relight
navId: relight
title: Relight
created: 2025-12-01
updated: 2026-03-02
summary: "Adjusting an image's lighting by changing the light sources or ambient light"
seoTitle: "What Is Relighting? Change Image Lighting with AI"
seoDescription: "Relighting changes the lighting of an image: IC-Light and LBM for composites, editing models with relight LoRAs, and placing virtual lights."
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: '/media/ai-capabilities/relight/legacy_gyazo_4c413909ac34f89df891a976fc660f70.png'
---

## What is Relighting?

Relighting is the task of adjusting the lighting of an image.

It falls into two broad types:

- **Relighting for compositing**: when you combine a foreground with a background, it adjusts the foreground's lighting to blend in with the background.

- **Virtual-light relighting**: you place virtual light sources, and the lighting is changed using depth maps and normal maps as a guide.

---

## Relighting for Compositing

When you paste a cut-out person or object onto a different background, things like the light direction, color temperature, and contrast don't match the background, so it looks obviously pasted in.

Before AI, you could painstakingly fix this in Photoshop and the like, but let's just knock it out quickly with generative AI!

### Diffusion model-based relighting like IC-Light / LBM

![](/media/ai-capabilities/relight/legacy_gyazo_5e8ab13bbf6385a8413fd8dfdb774a77.png){media=image}

By training on huge numbers of images, diffusion models pick up more than just the ability to "generate images." They also learn statistical knowledge like "this looks more natural" or "if the light comes from here, the shadow falls like this."

Methods like IC-Light and LBM use this to relight just the foreground so it matches the background.

### Instruction-based image editing models + Relighting LoRAs

The idea is close to [refining rough collages](/en/ai-capabilities/collage-refine/): you have the model "edit" whatever you placed in the foreground so it blends naturally into the background.

Of course, it can also relight in the simpler sense of changing the scene (making it night, evening, and so on) rather than compositing.

There are also dedicated LoRAs for this.
- [dx8152/Qwen-Image-Edit-2509-Relight](https://huggingface.co/dx8152/Qwen-Image-Edit-2509-Relight)
- > ![](/media/ai-capabilities/relight/legacy_gyazo_74f605b5c212b69e7e0c269066665864.mp4){media=loop}

---

## Virtual-Light Relighting

The other type of relighting **places virtual light sources in the scene**.

> ![ClipDrop Relight](/media/ai-capabilities/relight/legacy_gyazo_1cfc90b511ed7c12e3cfcf9128c170e5.mp4){media=loop}

It estimates depth and normal maps, lets you place virtual lights like "a spotlight here" or "sunlight from over there," and recalculates shading and highlights to match those lights.

It's closer to a CG or image processing task. Tools like [ClipDrop Relight](https://clipdrop.co/relight) and [LightLab](https://nadmag.github.io/LightLab/) fall into this group.

There's plenty of research, but unfortunately not much of it is practical to use in ComfyUI yet.
