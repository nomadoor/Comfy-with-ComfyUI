---
layout: page.njk
lang: en
section: ai-capabilities
slug: upscale-restoration
navId: upscale-restoration
title: Upscale & Restoration
created: 2025-11-13
updated: 2026-09-27
summary: Techniques for enlarging images or restoring degraded ones.
seoTitle: "AI Upscaling and Image Restoration: GAN to Diffusion"
seoDescription: "Upscale low-quality images and restore lost detail: GAN upscalers, face restoration models, diffusion-based methods, and image editing models."
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## Upscale & Restoration

Upscaling means making a low-resolution image bigger, but if bigger is all you want, even PowerPoint can do that.

But if you simply blow up a low-quality, blocky image 2x or 4x, all you get is a "big blocky image." No new information is added.

So when this page says upscaling, it means techniques that do two things together: **"enlarge the image"** and **"plausibly fill in lost detail to restore image quality"**.

Some tools focus more on restoration itself. Removing scratches from old photos or automatically colorizing black-and-white photos can also be thought of as kinds of "image restoration."

Let's go through the methods and models used, sticking to the main ones.

---

## GAN / Traditional Upscale

Upscaling using GANs or traditional super-resolution models.
This family predates Stable Diffusion and is still sometimes used when you want something lightweight.

![](/media/ai-capabilities/upscale-restoration/esrgan.png){media=image}

[](/workflows/ai-capabilities/upscale-restoration/esrgan.json)

- ESRGAN
- Real-ESRGAN
- SwinIR
- HYPIR

---

## Face Restoration Models (Specialized for Faces)

Models that specialize in faces, restoring ones that are blurry, distorted, or low-resolution.
ReActor, well known for face swapping, can only generate at low resolution, so these models are used to post-process its output.

- GFPGAN
- CodeFormer

---

## Diffusion Model-Based Upscale & Restoration

These methods use diffusion models such as Stable Diffusion to redraw the image while upscaling and restoring it.

- image2image
  - This generates an image using another image as a base, but if you keep `denoise` low, you can use it for "restoration" without changing the composition or content much.
- Ultimate SD upscale
  - Plain `image2image` is limited by the resolution the model can handle and by the size your PC can generate.
  - Ultimate SD upscale gets around this by splitting the image into tiles, running `image2image` on each one, and stitching them back together, so it can handle larger images.
- SUPIR
  - An SDXL-based model built specifically for upscaling and image restoration. Its goal is to recover natural high-resolution images from low-quality input.

> [!NOTE]
> In a sense, upscaling with a diffusion model means redrawing the image.
> So it tends to go beyond simple restoration and **"overdo it."**
> That can be a valid look in its own right, of course, but it is sometimes called **Enhance** to set it apart from upscaling that keeps the original image as intact as possible.

---

## Restoration by Instruction-Based Image Editing

Some recent instruction-based image editing models can handle much of what upscaling and restoration do, all from a text instruction.

You don't need a separate specialized model for each job: just say "clean up this photo," "reduce the noise," or "colorize this black-and-white photo," and it handles it all in one go.

![](/media/ai-capabilities/upscale-restoration/legacy_gyazo_70baa67331207740cbab838d153c990d.png){media=image}

[](/workflows/ai-capabilities/upscale-restoration/qwen_image_edit_2509.json)

The "[Instruction-Based Image Editing](/en/ai-capabilities/instruction-based-image-editing/)" page covers this in detail.

---

## Video Upscale & Restoration

If you apply image upscaling one frame at a time, you can technically upscale video too.

But this approach has no temporal consistency, so you may be left with flicker and shimmering.

Upscale and restoration models made for video also use information from the surrounding frames, aiming to improve quality while keeping flicker down.

The main families include:

- SeedVR2
- FlashVSR

It's perfectly fine to use these for upscaling still images, too. In fact, they're very popular for that.
