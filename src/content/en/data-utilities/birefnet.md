---
layout: page.njk
lang: en
section: data-utilities
slug: birefnet
navId: birefnet
title: "BiRefNet"
created: 2026-05-30
updated: 2026-06-24
summary: "Background removal and mask generation with BiRefNet"
seoTitle: "BiRefNet in ComfyUI: High-Quality Background Removal"
seoDescription: "Use BiRefNet in ComfyUI to cut out subjects cleanly, even hair and plants: model download, foreground extraction, and background fill workflows."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/data-utilities/birefnet/legacy_gyazo_2e42734281821aa3f28153af9ba6a08e.png"
---

## What is BiRefNet?

BiRefNet is a model used for background removal and matting.

Formally, it is a model for **Dichotomous Image Segmentation (DIS)**, which means splitting an image into **foreground** and **background**.

It is not like SAM, where you specify "this point", "this box", or "this object" to create a mask. Instead, it is good at producing high-quality cutout masks from subjects with complex details, such as hair or plants.

---

## Model Download

- [birefnet.safetensors](https://huggingface.co/Comfy-Org/BiRefNet/blob/main/background_removal/birefnet.safetensors) (444 MB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂background_removal/
        └── birefnet.safetensors
```

---

## workflow

### Cut Out the Foreground

![](/media/data-utilities/birefnet/legacy_gyazo_57972a01d12b0d8e88ef705c18344651.png){media=image}

[](/workflows/data-utilities/birefnet/birefnet.json)

- Use `Load Background Removal Model` to load `birefnet.safetensors`.
- Input the image and model into `Remove Background` to output a background-removal `MASK`.
- Use `Join Image with Alpha` when you want an image with a transparent background.
  - If you use the mask as-is, the foreground becomes transparent, so insert `Invert Mask` first.

### Fill the Background

The workflow above makes the background transparent, but for preprocessing in image generation or analysis, it is often easier to fill the background with a solid color.

![](/media/data-utilities/birefnet/legacy_gyazo_5d22ae3e905a8ccd3c1b8c63f615bb4e.png){media=image}

[](/workflows/data-utilities/birefnet/birefnet_fill.json)

- Input the original image, inverted mask, and solid-color image into `Image Composite Masked`.
- Only the masked background area is replaced with the solid-color image.
- See [Layer Composite](/en/data-utilities/layer-composite-blend/) for details.
