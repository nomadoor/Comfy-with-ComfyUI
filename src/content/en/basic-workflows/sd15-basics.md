---
layout: page.njk
lang: en
section: basic-workflows
slug: sd15-basics
navId: sd15-basics
title: "Basics of Image Generation (SD1.5)"
created: 2025-11-13
updated: 2026-03-02
summary: "Learn the basics of image generation with Stable Diffusion 1.5"
seoTitle: "Image Generation Basics: Learn ComfyUI Workflows with SD1.5"
seoDescription: "Almost every model shares the same ComfyUI workflow shape. Learn it with Stable Diffusion 1.5: prepare inputs, pass them to KSampler, and what \"modular\" means."
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  gradient:
  image: ""
---

## Workflows are roughly the same for any model

![](/media/basic-workflows/sd15-basics/legacy_gyazo_55ef8fc59cbcbc5093b9e1b3d15dceb5.png){media=image}

![](/media/basic-workflows/sd15-basics/legacy_gyazo_bc7fe8fc68bbc2fb408314e8acee9ab1.png){media=image}

The top is the workflow for **Stable Diffusion 1.5**, and the bottom is for **Z-Image**, one of the latest models.

There are small differences, like the number of nodes, but can you see they're mostly the same?
However new the image or video generation model, the flow of **"prepare the ingredients and throw them at KSampler"** stays the same.

I totally get wanting to jump into the new models right away, but hold that urge for a moment and work through the Stable Diffusion 1.5-based workflows once.

It should make the rest of your ComfyUI life a lot more fun.

---

## What does "Modular" mean?

Node-based tools like ComfyUI are often said to have the advantage of being "modular".

So what does "modular" actually mean?
And how does it help with image generation?

### Modular System

Modular means a structure where, like LEGO blocks, you can add the features you need later on.

- There's a base to build on
- When you need a feature, add a block for just that part
- When you want more features, add more blocks

This "keep adding on" approach applies directly to ComfyUI workflows.

### How it works in ComfyUI

Let's set specific node names aside for now and watch a workflow grow step by step.
As you go, check which parts are being added as modules.

- 1. **text2image**
  - The basics. You just enter a prompt and throw it at KSampler.
  - ![](/media/basic-workflows/sd15-basics/legacy_gyazo_10c6a84174c94fbd6b66fbed2bd2a4c3.png){media=image}
  - [](/workflows/basic-workflows/sd15-basics/sd1_5_text2image.json)

- 2. **image2image**
  - Generates an image using the input image as a rough draft.
  - ![](/media/basic-workflows/sd15-basics/legacy_gyazo_8426a110f038cddb3907e51d155ed9b3.png){media=image}
  - [](/workflows/basic-workflows/sd15-basics/sd1_5_image2image.json)
  - 🟩 Add a node to load an image and a node to convert it into a latent.

- 3. **inpainting**
  - Performs image2image on only a part of the input image.
  - ![](/media/basic-workflows/sd15-basics/legacy_gyazo_a9bd94b38c77cca3acb5b6a5b9d894a6.png){media=image}
  - [](/workflows/basic-workflows/sd15-basics/sd1_5_inpainting.json)
  - 🟥 Add nodes to make image2image happen only in the masked area.

- 4. **ControlNet**
  - ControlNet lets you guide image generation with an input image.
  - ![](/media/basic-workflows/sd15-basics/legacy_gyazo_46553948d7e458ed19a69b0a5a8f5141.png){media=image}
  - [](/workflows/basic-workflows/sd15-basics/sd1_5_inpainting_controlnet.json)
  - 🟦 Add a node that applies ControlNet, plus nodes that create the image it uses for control.
  
- 5. **Add another ControlNet**
  - You're not limited to one ControlNet. Let's add another.
  - ![](/media/basic-workflows/sd15-basics/legacy_gyazo_daa261583657abf6c25d2003581d1610.png){media=image}
  - [](/workflows/basic-workflows/sd15-basics/sd1_5_inpainting_controlnet2.json)
  - 🟦 Just create another set of ControlNet and its preprocessing nodes and connect them.

---

This is just one example, but I think it shows how flexible ComfyUI is.

Besides the official templates, lots of people share their workflows, but even so, the perfect workflow you want may not exist anywhere.
But don't worry. Delete what you don't need, and add whatever else you want.
