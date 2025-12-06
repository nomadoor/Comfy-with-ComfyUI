---
layout: page.njk
lang: en
section: basic-workflows
slug: sd15-basics
navId: sd15-basics
title: "Basics of Image Generation (SD1.5)"
summary: "Basics of Image Generation with Stable Diffusion 1.5"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  gradient:
  image: ""
---

## Workflows are roughly the same for any model

![](https://gyazo.com/55ef8fc59cbcbc5093b9e1b3d15dceb5){gyazo=image}

![](https://gyazo.com/bc7fe8fc68bbc2fb408314e8acee9ab1){gyazo=image}

The top is the workflow for **Stable Diffusion 1.5**, and the bottom is for the latest model **Z-Image** (hypothetical/example).

Can you see that although there are minor differences such as the number of nodes, they are roughly the same?
No matter what new image generation model or video generation model comes out, the flow of **"preparing materials and throwing them to KSampler"** does not change.

I understand very well the feeling of wanting to use new models quickly, but please suppress your impatience and cover the workflows based on Stable Diffusion 1.5 once.

Your future ComfyUI life should become much more enjoyable.

---

## What does "Modular" mean?

Node-based tools like ComfyUI are often explained as having the advantage of being "modular".

So, what is modular in the first place?
How is it useful in image generation?

### Modular System

A modular system is a structure where "necessary functions can be added later" like LEGO blocks.

- There is a base foundation
- When a necessary function comes up, add only that block
- If you want to increase functions further, add blocks again

This way of thinking of "adding on" applies directly to ComfyUI workflows.

### How it works in ComfyUI

Leaving aside specific node names for a moment, let's look at how a workflow expands little by little.
Let's check in the flow which parts are increasing as modules.

- 1. **text2image**
  - The basics. Just input a prompt and throw it to KSampler.
  - ![](https://gyazo.com/10c6a84174c94fbd6b66fbed2bd2a4c3){gyazo=image}
  - [](/workflows/basic-workflows/sd15-basics/SD1.5_text2image.json)

- 2. **image2image**
  - Generates an image using an input image as a draft.
  - ![](https://gyazo.com/8426a110f038cddb3907e51d155ed9b3){gyazo=image}
  - [](/workflows/basic-workflows/sd15-basics/SD1.5_image2image.json)
  - 🟩 Add a node to load an image and a node to convert it to latent.

- 3. **inpainting**
  - Performs image2image on only a part of the input image.
  - ![](https://gyazo.com/a9bd94b38c77cca3acb5b6a5b9d894a6){gyazo=image}
  - [](/workflows/basic-workflows/sd15-basics/SD1.5_inpainting.json)
  - 🟥 Add nodes to make image2image happen only in the masked area.

- 4. **ControlNet**
  - ControlNet is a function that allows you to control image generation by inputting an image.
  - ![](https://gyazo.com/46553948d7e458ed19a69b0a5a8f5141){gyazo=image}
  - [](/workflows/basic-workflows/sd15-basics/SD1.5_inpainting_controlnet.json)
  - 🟦 Add nodes to add ControlNet and nodes to create images used for ControlNet control.
  
- 5. **Add even more ControlNet**
  - There is no restriction that ControlNet must be only one. Let's add another one.
  - ![](https://gyazo.com/daa261583657abf6c25d2003581d1610){gyazo=image}
  - [](/workflows/basic-workflows/sd15-basics/SD1.5_inpainting_controlnet2.json)
  - 🟦 Just create another set of ControlNet and its preprocessing nodes and connect them.

---

This is just one example, but I think it showed the flexibility of ComfyUI.

In addition to official templates, many people publish workflows, but still, the perfect workflow you desire might not exist in this world.
But don't worry. If you don't need it, delete it, and if there are other functions you want, just add them.
