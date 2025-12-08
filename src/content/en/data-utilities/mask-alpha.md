---
layout: page.njk
lang: en
section: data-utilities
slug: mask-alpha
navId: mask-alpha
title: "Mask & Alpha Channel"
summary: "Concept of mask and handling of transparent images"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/bd1a30f0d9562418f2fd74c7d9dd6f1e.png"
---

## What is a Mask?

![](https://i.gyazo.com/bd1a30f0d9562418f2fd74c7d9dd6f1e.png){gyazo=image}

A mask is a black and white image for instructing **"whether to target / exclude"** a part of the image for processing.

- **White**: Process (Apply)
- **Black**: Do not process (Protect)
- **Gray**: Adjust intensity (* Depending on the function)

### Mask in AI

![](https://i.gyazo.com/3b4d37c9bb4a46d514f2fc77234718f8.png){gyazo=image}

In image generation AI, it is mainly used in **Inpainting** to redraw only a part of the image.

AI regenerates only the white part, and leaves the black part as the original image.

> **Note:**
> Normal Inpainting cannot handle gray (translucent) masks, so it is arbitrarily processed as binary of white or black.
>
> If you want to do something like "change lightly" using a mask with gradation, you need a special technique called **Differential Diffusion**.

---

## What is Output Channel?

![](https://gyazo.com/cf9be566f77d85571b29a2b5597121cb){gyazo=image}

Normal images express colors with three channels: **R (Red), G (Green), B (Blue)**, but images with transparent backgrounds (such as PNG) contain an additional channel called **A (Alpha)**.
This is the information governing transparency.

### Handling of Transparent Images in ComfyUI

This is a slightly confusing point, but Stable Diffusion itself cannot directly handle transparent images.
Therefore, when you load a transparent PNG image into ComfyUI, it is internally separated into two: **"RGB Image" and "Mask"**.

![](https://i.gyazo.com/dbe187645fd186d20f936f226a79b926.png){gyazo=image}

Let's look at the output of the `Load Image` node.

- **IMAGE (RGB)**
  - Since the alpha channel information disappears, the transparent part is filled with **black**.
- **MASK**
  - The alpha channel (transparency) information is extracted.
  - In ComfyUI, **the transparent part is expressed as "White"**.

### Beware of differences from general software

![](https://i.gyazo.com/e3ba8dcc1452e3ed88512250b0c81d06.png){gyazo=image}


In many software, masks are created as "transparent part = black", so people accustomed to image editing software such as Photoshop and Affinity Photo may be confused, but please consider it as a different thing.

It will be easy to understand if you follow the flow: Part to process is white part of mask → Alpha channel is added to white part and becomes transparent image.

---

## Joining and Splitting RGBA

How can I save it with the background transparent again after processing is finished?

![](https://gyazo.com/b05103b1633b9a4b0fbfdd96063499c2){gyazo=image}

[](/workflows/data-utilities/mask-alpha/Join-Split_Image_with_Alpha.json)

### 🟨Join Image With Alpha Node

Combines `IMAGE` (RGB image) and `MASK` to convert it into a single **RGBA image (transparent image)**.
If you connect this to the `Save Image` node, you can save it as a transparent PNG.

### 🟪Split Image With Alpha Node

Conversely, it is a node that separates an RGBA image into RGB and MASK.

---

## 🚨 Error Trap: Confusion of RGBA and RGB

On the wire of ComfyUI, both RGB image (3 channels) and RGBA image (4 channels) flow as the same **`IMAGE`** type. You can't tell by looking.

However, AI (KSampler and VAE) basically accepts only 3-channel RGB images.
Therefore, if you inadvertently connect an RGBA image after `Join Image With Alpha` to `VAE Encode` etc., the following error will appear.

```bash
RuntimeError: Given groups=1, ... expected input to have 3 channels, but got 4 channels instead
```

If you get scolded saying "I expected 3 channels but 4 channels came!", please suspect if the image is RGBA somewhere.

Custom nodes for background clipping etc. may output RGBA suddenly.
