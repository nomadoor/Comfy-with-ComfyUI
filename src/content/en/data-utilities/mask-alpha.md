---
layout: page.njk
lang: en
section: data-utilities
slug: mask-alpha
navId: mask-alpha
title: "Mask and Alpha Channel"
summary: "Concept of masks and handling of transparent images"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/bd1a30f0d9562418f2fd74c7d9dd6f1e.png"
---

## What is a Mask?

![](https://i.gyazo.com/bd1a30f0d9562418f2fd74c7d9dd6f1e.png){gyazo=image}

A mask is a black and white image that indicates which parts of an image should be **"targeted / excluded"** from processing.

- **White**: Process (Apply)
- **Black**: Do not process (Protect)
- **Gray**: Adjust intensity (Depends on the function)

### Masks in AI

![](https://i.gyazo.com/3b4d37c9bb4a46d514f2fc77234718f8.png){gyazo=image}

In generative AI, it is mainly used in **Inpainting**, which redraws only a part of an image.

The AI regenerates only the white parts, leaving the black parts as the original image.

> **Note:**
> In normal Inpainting, gray (semi-transparent) masks cannot be handled and are automatically treated as binary white or black.
>
> If you want to use a gradient mask to "change slightly", you will need a special technique called **Differential Diffusion**.

---

## What is Alpha Channel?

![](https://gyazo.com/cf9be566f77d85571b29a2b5597121cb){gyazo=image}

Normal images express colors with three channels: **R (Red), G (Green), and B (Blue)**. However, images with transparent backgrounds (such as PNG) contain an additional channel called **A (Alpha)**.
This is the information that controls transparency.

### Handling Transparent Images in ComfyUI

This is a slightly confusing point, but Stable Diffusion itself cannot directly handle transparent images.
Therefore, when you load a transparent PNG image into ComfyUI, it is internally separated into two: **"RGB Image" and "Mask"**.

![](https://i.gyazo.com/dbe187645fd186d20f936f226a79b926.png){gyazo=image}

Let's look at the output of the `Load Image` node.

- **IMAGE (RGB)**
  - Since the alpha channel information is lost, the transparent parts are filled with **black**.
- **MASK**
  - The alpha channel (transparency) information is extracted.
  - In ComfyUI, **transparent parts are represented as "White"**.

### Note the Difference from General Software

![](https://i.gyazo.com/e3ba8dcc1452e3ed88512250b0c81d06.png){gyazo=image}


In many software, masks are created as "transparent part = black", so those who are used to image editing software like Photoshop or Affinity Photo may be confused, but please think of it as something different.

It is easier to understand if you follow the flow: Part to be processed is the white part of the mask → Alpha channel is added to the white part to make it a transparent image.

---

## Combining and Splitting RGBA

What should you do if you want to make the background transparent again and save it after processing?

### 🟨Join Image With Alpha Node

`IMAGE` (RGB image) and `MASK` are combined to convert into a single **RGBA image (transparent image)**.
If you connect this to the `Save Image` node, you can save it as a transparent PNG.

### 🟪Split Image With Alpha Node

Conversely, this is a node that separates an RGBA image into RGB and MASK.

![](https://gyazo.com/b05103b1633b9a4b0fbfdd96063499c2){gyazo=image}

[](/workflows/data-utilities/mask-alpha/Join-Split_Image_with_Alpha.json)

### 🚨 Error Trap: Confusion between RGBA and RGB

On ComfyUI wires, both RGB images (3 channels) and RGBA images (4 channels) flow as the same **`IMAGE`** type. You cannot tell them apart by looking.

However, AI (KSampler and VAE) basically only accepts 3-channel RGB images.
Therefore, if you inadvertently connect an RGBA image after `Join Image With Alpha` to `VAE Encode` etc., the following error will occur.

```bash
RuntimeError: Given groups=1, ... expected input to have 3 channels, but got 4 channels instead
```

If you get scolded saying "I expected 3 channels but got 4!", suspect that the image has become RGBA somewhere.

Custom nodes for background removal often output RGBA directly.
