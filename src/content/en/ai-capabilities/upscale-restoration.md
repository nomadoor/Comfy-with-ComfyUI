---
layout: page.njk
lang: en
section: ai-capabilities
slug: upscale-restoration
navId: upscale-restoration
title: Upscale & Restoration
summary: Technologies to enlarge images or restore degraded ones.
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## Upscale & Restoration

Upscaling is the task of enlarging a low-resolution image, but if you just want to make it bigger, you can do it with PowerPoint.

However, simply enlarging a low-quality, pixelated image by 2x or 4x will only result in a "large pixelated image" and will not increase the amount of information.

Therefore, upscaling here refers to a technology that performs these two sets: **"enlarging the image"** and **"plausibly supplementing lost details and restoring image quality"**.

There are also those more specialized in image restoration. Processes such as removing scratches from old photos or automatically coloring black-and-white photos can also be considered a type of "image restoration."

Let's look at what kind of methods and models are used, focusing on representative ones.

---

## GAN / Traditional Upscale

Upscaling using GANs or traditional super-resolution models.
This lineage has existed since before Stable Diffusion and is still used as a lightweight process.

![](https://gyazo.com/072c6cd7f09d777141293f6cf619ad83){gyazo=image}

[](/workflows/ai-capabilities/upscale-restoration/ESRGAN.json)

- ESRGAN
- Real-ESRGAN
- SwinIR
- HYPIR

---

## Face Restoration Models (Specialized for Faces)

Models specialized for restoring blurred, collapsed, or low-resolution faces.
There is a technology called ReActor famous for FaceSwap, but since it can only generate low-resolution images, these are used as post-processing.

- GFPGAN
- CodeFormer

---

## Diffusion Model-Based Upscale & Restoration

A method of performing upscale and restoration while redrawing the image using diffusion models like Stable Diffusion.

- image2image
  - A function to generate an image based on an image, but by suppressing the `denoise` amount, it can be used as "restoration" without changing the composition or content much.
- Ultimate SD upscale
  - With simple `image2image`, there are limits to the resolution the model can handle and the size that can be generated due to PC specs.
  - Therefore, this mechanism divides the image into tiles, performs `image2image` on each one, and then combines them again to handle larger images.
- SUPIR
  - An SDXL-based model specialized for upscale and image restoration. It aims to restore natural high-resolution images from low-quality inputs.

> Upscaling with diffusion models is redrawing in a sense.
> Therefore, it tends to go beyond simple restoration and **"overdo it."**
> Of course, this is also a form of expression, but it is sometimes distinguished from upscaling that preserves the original image as much as possible and expressed as **Enhance**.

---

## Restoration by Instruction-Based Image Editing

Some recent "Instruction-Based Image Editing" models can perform processing close to upscale and restoration collectively just by instructing with text.

Even without preparing specialized models individually, if you instruct "clean up this photo," "reduce noise," or "color this black and white photo," it will do those processes together.

![](https://gyazo.com/70baa67331207740cbab838d153c990d){gyazo=image}

[](/workflows/ai-capabilities/upscale-restoration/Qwen-Image-Edit-2509.json)

Details are covered on the "[Instruction-Based Image Editing](/en/ai-capabilities/instruction-based-image-editing/)" page.

---

## Video Upscale & Restoration

If you apply image upscaling frame by frame, video upscaling is technically possible.

However, since this method lacks temporal consistency, flickering may remain.

Upscale and restoration models dedicated to video aim to improve image quality while suppressing flickering by using information from preceding and succeeding frames.

Representative lineages include:

- SeedVR2
- FlashVSR

There is no problem using these for still image upscaling. In fact, they are popular for that use as well.
