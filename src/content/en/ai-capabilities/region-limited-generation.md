---
layout: page.njk
lang: en
section: ai-capabilities
slug: region-limited-generation
navId: region-limited-generation
title: "Region-Limited Generation"
summary: "Techniques to generate only parts of an image with different conditions, and their limitations."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## What is Region-Limited Generation?

Layout is an important element in design.

Simply generating an image with the prompt "a woman leaning against a wall in the city" will not create an attractive work.

A brick wall on the right edge of the screen, a woman leaning against it, a street lamp right in front of it, and reducing objects on the left side of the screen to create white space...

The technology for generating images with objects placed where you want them is "Region-Limited Generation."

---

## Instructing Position with Prompts

The simplest method is to write the positional relationship directly in the prompt.

![](https://gyazo.com/70bc945855f5eb1162bba1cbd2babb60){gyazo=image}

[](/workflows/ai-capabilities/region-limited-generation/Flux.1_dev.json)

> "Banana on the left, apple on the right"

Stable Diffusion's text encoder could hardly understand positional relationships, but models since Flux have started to reflect positional relationships to some extent.

Still, it tends to break down with complex compositions, and it is a means of conveying loose layout wishes rather than strict region specification.

---

## Repeating Inpainting

A method of generating an image once and then repeating Inpainting many times.

![](https://gyazo.com/2c5b6e3fd8491c24da35f6c5d8d825c9){gyazo=image}

[](/workflows/ai-capabilities/region-limited-generation/Flux.1_fill.json)

- 1. Generate a base image
- 2. Mask the area you want to edit and Inpaint
- 3. Change the mask to another area and Inpaint as needed

You might think it's not very smart, but it is a **reliable and stable method**. Prompts do not mix, and LoRA basically does not affect outside the mask. Each region can be treated as a completely independent step.

The weakness is that since they are generated separately, interactions between subjects are not possible. Images of people shaking hands, for example, tend to have mismatched lines of sight or look unnatural.

---

## Conditioning Set Area (Regional Prompting)

A method that attempts to apply different text conditions to each position of the image. It uses the Cross-Attention layer to use different prompts for each region.

![](https://gyazo.com/bca9aa6c5425ee4f7e4294d081d04e18){gyazo=image}

[](/workflows/ai-capabilities/region-limited-generation/Conditioning_(Set_Mask).json)

The theory is beautiful, but in reality, boundaries often blur or do not switch cleanly, and **practicality is not high**.

Also, you cannot specify LoRA by region.

---

## Latent Composite (Composition in Latent Space)

A method of synthesizing images at the latent space stage.

![](https://gyazo.com/87c4aa926f36889c2987cf5fc827c4e9){gyazo=image}

[](/workflows/ai-capabilities/region-limited-generation/Latent_Composite.json)

- 1. First, generate multiple images (banana image, apple image, background image, etc.)
- 2. Paste each latent onto a single latent using masks
- 3. Run the remaining sampling steps on the synthesized latent

Each object can be generated with separate conditions, and finally blended as a "single image."

However, there are many situations where it is more reliable to Inpaint multiple times and finally image2image the whole thing than to use this.

---

## Latent Couple / Attention Couple

### Latent Couple

A method where the latent space is completely divided for each region, generated with separate settings (prompts, LoRA, etc.), and then combined.

- Ideal in that completely different settings can be used for each region
- Computational complexity is high because it is the same as generating as many images as there are regions

There is no direct implementation in ComfyUI at the moment.

### Attention Couple

While Latent Couple calculated the entire UNet, this calculates only the Cross-Attention layer.

The computational complexity is much lower, but LoRA cannot be specified by region.

![](https://gyazo.com/efd7424ffea10f0eed2ef0f4b744636d){gyazo=image}

[](/workflows/ai-capabilities/region-limited-generation/Attention_Couple.json)

---

## Refining Rough Collages (Recommended)

A method of creating a rough collage image and having it remade into a natural picture based on it.

![](https://gyazo.com/be997efbbc0c0802513bfab1e8ebe585){gyazo=image}

You can specify the position very intuitively, and since you just need to paste appropriate objects for what you want to generate, it is actually a highly recommended method.

Details → [Refining Rough Collages](/en/ai-capabilities/collage-refine/)
