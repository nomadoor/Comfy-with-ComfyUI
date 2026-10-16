---
layout: page.njk
lang: en
section: ai-capabilities
slug: diffusion-models
navId: diffusion-models
title: Diffusion Models
created: 2025-12-01
updated: 2026-03-02
summary: How diffusion models work
seoTitle: "What Is a Diffusion Model? How Images Emerge from Noise"
seoDescription: "How diffusion models, the core of image AI, turn noise into images, explained through ComfyUI's live preview: how they are trained and how generation works."
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## Beautiful Images Created from Noise

![](/media/ai-capabilities/diffusion-models/legacy_gyazo_3c82ca8a7dcb51f2475d0451de727783.mp4){media=loop}

If you preview image generation in ComfyUI, you'll see that at first there's nothing but TV-static noise. As the steps go on, outlines start to appear, and in the end you get a reasonably clean image.

"How does a meaningful image come out of plain noise?"

The thing behind this strange process is the **diffusion model**.

---

## What is a Diffusion Model?

Instead of seeing the noise image in front of you as completely meaningless, think of it as "a clean original image that's been dirtied by extra noise."

Seen that way, **if you can remove just the extra noise, you should be able to get back to the clean original.**

So let's have AI do the job of "noise remover."

---

## Training a Diffusion Model

AI is good at learning relationships.
A diffusion model is trained by showing it huge numbers of pairs like these:

- A **clean image**
- A **"dirty image"**: the same image with noise added

From these pairs, the AI learns how to fix a dirty image when it sees one:

> "If I fix it like this, it should get a little closer to the clean original."

---

## Creating Images from Noise

Once you have this "AI that removes a little noise," the rest is simple.

- 1. Prepare a random noise image.
- 2. Pass it to the AI and ask it to "reduce the noise just a little."
- 3. Pass the slightly improved image to the AI again... and repeat.

What started as pure noise has its noise peeled away bit by bit by the AI,
and slowly grows into a "reasonably meaningful image."

---

## Isn't It Just Generating Random Images?

So now we can generate some kind of image from noise, but you might be wondering:

> Won't it just spit out random "plausible-looking images"?
> How do I tell it things like "draw a dog" or "I want an autumn forest"?

Exactly. The diffusion model as described so far can make "something that looks like a natural image," but you can't specify what's actually in it.

If you've played with image generation a bit, you probably know there are ways to control it, such as:

-   **Text Prompts**
-   **ControlNet**
-   **Reference Images** (IP-Adapter, etc.)

In ComfyUI, these mechanisms that tell the diffusion process **"what conditions to generate under"** are collectively called **Conditioning**.

Next, let's look at this Conditioning.
