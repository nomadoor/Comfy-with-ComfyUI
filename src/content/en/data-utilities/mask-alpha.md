---
layout: page.njk
lang: en
section: data-utilities
slug: mask-alpha
navId: mask-alpha
title: "Mask & Alpha Channel"
created: 2025-11-25
updated: 2026-03-02
summary: "What masks are and how transparent images are handled"
seoTitle: "Masks and Alpha Channels in ComfyUI"
seoDescription: "How ComfyUI handles masks and transparency: what masks mean, the alpha channel, differences from other apps, joining and splitting RGBA, and common errors."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/data-utilities/mask-alpha/legacy_gyazo_bd1a30f0d9562418f2fd74c7d9dd6f1e.png"
---

## What is a Mask?

![](/media/data-utilities/mask-alpha/legacy_gyazo_bd1a30f0d9562418f2fd74c7d9dd6f1e.png){media=image}

A mask is a black-and-white image that tells a process which parts of an image to **include or exclude**.

- **White**: Process (Apply)
- **Black**: Do not process (Protect)
- **Gray**: Adjusts the strength (*depends on the feature)

### Masks in AI

![](/media/data-utilities/mask-alpha/legacy_gyazo_3b4d37c9bb4a46d514f2fc77234718f8.png){media=image}

In image generation AI, masks are mainly used for **Inpainting**, which redraws only part of an image.

The AI regenerates only the white areas and leaves the black areas as they were in the original image.

> [!WARNING]
> Regular Inpainting can't handle gray (semi-transparent) masks, so they get treated as either white or black anyway.
>
> If you want to use a gradient mask to, say, "change things just slightly," you need a special technique called **Differential Diffusion**.

---

## What is an Alpha Channel?

![](/media/data-utilities/mask-alpha/legacy_gyazo_cf9be566f77d85571b29a2b5597121cb.png){media=image}

Regular images represent color with three channels, **R (Red), G (Green), and B (Blue)**, but images with a transparent background (such as PNGs) also contain a channel called **A (Alpha)**.
This is the channel that holds transparency.

### How ComfyUI Handles Transparent Images

This is where it gets a little confusing: Stable Diffusion itself can't work with transparent images directly.
So when you load a transparent PNG into ComfyUI, it is split internally into two parts: an **RGB image and a mask**.

![](/media/data-utilities/mask-alpha/legacy_gyazo_dbe187645fd186d20f936f226a79b926.png){media=image}

Let's look at the output of the `Load Image` node.

- **IMAGE (RGB)**
  - The alpha channel is dropped, so transparent areas are filled with **black**.
- **MASK**
  - The alpha channel (transparency) is extracted.
  - In ComfyUI, **transparent areas become white**.

### How This Differs from Other Software

![](/media/data-utilities/mask-alpha/legacy_gyazo_e3ba8dcc1452e3ed88512250b0c81d06.png){media=image}


Many apps create masks with transparent areas as black, so if you're used to image editors like Photoshop or Affinity Photo, this may be confusing. Just think of it as a different convention.

It's easier to follow if you think of it as a flow: the white part of the mask is what gets processed → the alpha channel is applied to the white part, making it transparent.

---

## Joining and Splitting RGBA

So what if you want to save the result with a transparent background again after processing?

![](/media/data-utilities/mask-alpha/legacy_gyazo_b05103b1633b9a4b0fbfdd96063499c2.png){media=image}

[](/workflows/data-utilities/mask-alpha/join_split_image_with_alpha.json)

### 🟨Join Image With Alpha Node

Combines an `IMAGE` (RGB image) and a `MASK` into a single **RGBA image (transparent image)**.
Connect it to a `Save Image` node to save it as a transparent PNG.

### 🟪Split Image With Alpha Node

The reverse: this node splits an RGBA image into RGB and MASK.

---

## 🚨 Error Trap: Mixing Up RGBA and RGB

On ComfyUI wires, RGB images (3 channels) and RGBA images (4 channels) both travel as the same **`IMAGE`** type. You can't tell them apart by looking.

But the AI parts (KSampler and VAE) basically only accept 3-channel RGB images.
So if you accidentally connect an RGBA image from `Join Image With Alpha` to something like `VAE Encode`, you'll get an error like this:

```bash
RuntimeError: Given groups=1, ... expected input to have 3 channels, but got 4 channels instead
```

If ComfyUI yells at you with "I expected 3 channels but got 4!", check whether your image turned into RGBA somewhere along the way.

Custom nodes for things like background removal sometimes output RGBA without warning.
