---
layout: page.njk
lang: en
section: notes
slug: why-multiple-of-8
navId: why-multiple-of-8
title: "Why can you only generate at resolutions that are multiples of 8?"
created: 2025-12-13
updated: 2026-03-02
noteTags: ["faq", "resolution", "vae"]
summary: "Why resolution is limited to multiples of 8, and how that relates to the VAE's compression ratio"
seoTitle: "Why Image Resolution Must Be a Multiple of 8"
seoDescription: "Why ComfyUI's Empty Latent Image uses steps of 8: latent diffusion and VAE compression, other VAE ratios, video frame counts, and editing caveats."
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: ""
---

## Why can you only generate at resolutions that are multiples of 8?

![](/media/notes/why-multiple-of-8/legacy_gyazo_74438e54d131fb86c2f02e889a9fad7b.mp4){media=loop}

If you look at ComfyUI's `Empty Latent Image` node, width and height can only be set in steps of 8.
Even if you force in something like 513px, the output is always rounded to a multiple of 8.

This comes from **a structural constraint of latent diffusion models and the VAE**.

---

## Latent diffusion models and the VAE's compression ratio

Latent diffusion models such as Stable Diffusion **first compress the image into a low-resolution latent space and then do their calculations there**.
The VAE is what handles this "compression" and "restoration".

Commonly used VAEs (the SD1.5 family and many derived models) are built to:

- Compress height and width to **1/8** (1/64 in area)

Since the latent resolution has to be a whole number, any remainder that is not divisible by 8 is dropped.

For example, if you input a 513px image, the extra 1px is ignored and it is effectively processed as 512px.

---

## VAEs with other compression ratios

Not every VAE compresses by 8x. Depending on the model, it can be **4 / 8 / 16 / 32**, and so on.

When you use a new model, it is a good idea to check which VAE (and which compression ratio) it uses.

---

## Video model VAEs and frame counts

Some video VAEs **also compress along the time axis (the number of frames)**.

- `Wan 2.1 VAE`: a VAE that packs 4 frames into one latent

In this case, the number of frames you can generate takes a form like "1 + 4n", and fine-grained choices such as outputting just 2 frames may simply not be possible.

Just as the spatial dimensions (width and height) are tied to multiples of 8, the time axis can also come with a "only in multiples of this number" constraint. Just keep that in the back of your mind.

---

## Caveats for image2image and image editing models

You can use a resolution that is not a multiple of 8, and generation will still work without errors.
In that case, though, watch out for misalignment.

- Input image: the original resolution (e.g. 513px × 769px)
- Output image: the resolution rounded to a multiple of 8 (e.g. 512px × 768px)

Because **input and output pixels no longer line up 1-to-1**, if you need pixel-perfect edits, crop or pad the image to a multiple of 8 first.

If something feels off, like "the edge seems to be cut off" or "the size is slightly different",
check whether the resolution is a multiple of the VAE's compression ratio.
