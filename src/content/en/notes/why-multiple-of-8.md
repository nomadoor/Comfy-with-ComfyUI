---
layout: page.njk
lang: en
section: notes
slug: why-multiple-of-8
navId: why-multiple-of-8
title: "Why can only resolutions that are multiples of 8 be generated?"
created: 2025-12-13
updated: 2026-03-02
tags: ["concept", "resolution", "vae"]
summary: "Reason why resolution is limited to multiples of 8 and relation to VAE compression rate"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: ""
---

## Why can only resolutions that are multiples of 8 be generated?

![](https://gyazo.com/74438e54d131fb86c2f02e889a9fad7b){gyazo=loop}

Looking at the `Empty Latent Image` node in ComfyUI, you can only set width/height in increments of 8.
Even if you force input like 513px, the output is always rounded to a multiple of 8.

This is caused by **structural constraints of latent diffusion model and VAE**.

---

## Latent diffusion model and VAE compression rate

Latent diffusion models such as Stable Diffusion **compress images into a low-resolution latent space once before calculation**.
VAE is responsible for this "compression" and "restoration".

In commonly used VAEs (SD1.5 series and many derivative models), the structure is:

- Compresses height/width to **1/8** (1/64 in area)

At this time, since the latent resolution must be an integer, fractions indivisible by 8 are truncated.

For example, even if you input an image of 513px, the fraction of 1px is ignored and processed as effectively 512px.

---

## There are also VAEs with other compression rates

Not all VAEs have 8x compression, but vary by model, such as **4 / 8 / 16 / 32**.

When using a new model, it is a good idea to check once which VAE (which compression rate) that model uses.

---

## Video model VAE and frame count

In VAEs for video, there are those that **compress the time direction (number of frames) together**.

- `Wan 2.1 VAE`: VAE that summarizes 4 frames into one latent

In this case, the number of frames that can be generated becomes a form like "1 + 4n", and a structure where detailed specification such as outputting only 2 frames is impossible in the first place may be adopted.

Just as the spatial direction (vertical/horizontal) is bound to multiples of 8, please remember that there may be constraints that "can only be handled in multiples of this number" in the time direction as well.

---

## Points to note for image2image / image editing models

Even if you use a resolution other than a multiple of 8, generation is possible without error.
However, please note that misalignment occurs in that case.

- Input Image: Original resolution (e.g. 513px × 769px)
- Output Image: Resolution rounded to a multiple of 8 (e.g. 512px × 768px)

Since **input and output pixels do not correspond 1-to-1**, if pixel-perfect editing is required, it is necessary to crop/pad to a multiple of 8 first.

If you feel "somehow the edge is cut" or "size is slightly different", please check once if the resolution is a multiple of the VAE's compression rate.
