---
layout: page.njk
lang: en
section: ai-capabilities
slug: diffusion-models
navId: diffusion-models
title: "Diffusion Models"
summary: "The mechanism of diffusion models."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## Beautiful Images Created from Noise

![](https://gyazo.com/3c82ca8a7dcb51f2475d0451de727783){gyazo=loop}

When you preview the image generation process in ComfyUI, you can see that although initially only noise like a sandstorm is visible, as the steps progress, outlines appear, and finally, it becomes a reasonably organized image.

"How is a meaningful image born from mere noise?"

The entity performing this mysterious movement is the **Diffusion Model**.

---

## What is a Diffusion Model?

We consider the noise image in front of us not as something completely meaningless, but as "a clean original image that has been dirtied with extra noise."

If we think so, then **if we can successfully remove only the extra noise, we should be able to return it to the original clean image.**

So, let's have AI play the role of that "noise remover."

---

## Training of Diffusion Models

AI is good at remembering "relationships."
In diffusion models, we show and train it with a large number of pairs like the following:

- **Clean image**
- **"Dirty image"** with noise added to that image

Through these pairs, the AI learns how to fix it:

> "If I fix it like this, it seems to get a little closer to the original clean image."

when it sees a dirty image.

---

## Creating Images from Noise

Once this "AI that reduces noise a little" is created, the rest is simple.

- 1. Prepare a random noise image.
- 2. Pass it to the AI and ask it to "reduce the noise just a little."
- 3. Pass the slightly improved image to the AI again... and repeat.

What was initially just noise is gradually stripped of noise by the AI, and gradually grows into a "reasonably meaningful image."

---

## Isn't It Just Generating Random Images?

Now, images are generated from noise, but you might have this question:

> Doesn't it just output "something that looks like an image" randomly?
> How do I convey instructions like "draw a dog" or "I want an autumn forest"?

Exactly. With just the diffusion model so far, although it can create "something that looks like a natural image," it cannot specify specific contents.

If you have touched image generation a little, you probably know that there are control methods such as:

-   **Text Prompts**
-   **ControlNet**
-   **Reference Images** (IP-Adapter, etc.)

In ComfyUI, the mechanism that teaches the diffusion process **"under what conditions you want it generated"** is collectively called **Conditioning**.

Next, let's look at this Conditioning.
