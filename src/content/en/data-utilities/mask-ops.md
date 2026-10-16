---
layout: page.njk
lang: en
section: data-utilities
slug: mask-ops
navId: mask-ops
title: "Mask Operations"
created: 2025-11-25
updated: 2026-09-27
summary: "How to create and edit masks"
seoTitle: "Mask Operations in ComfyUI: Create, Convert, Edit"
seoDescription: "Create, preview, and edit masks in ComfyUI: masks from images or colors, Create Solid Mask, the Mask Editor, depth maps, and grow, blur, and combine nodes."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## Checking Masks

### MaskPreview Node

![](/media/data-utilities/mask-ops/legacy_gyazo_a9dd4acbc14438fd7edfe85d3a14c6f3.png){media=image}

[](/workflows/data-utilities/mask-ops/maskpreview.json)

This is the mask version of the `Preview Image` node.

### Convert Mask to Image Node

![](/media/data-utilities/mask-ops/legacy_gyazo_28a1d381f0697c598db58f1e4c5648c6.png){media=image}

[](/workflows/data-utilities/mask-ops/convert_mask_to_image.json)

Converts a mask into a black-and-white `Image`.

---

## Creating Masks

### Load Image (as Mask) Node

![](/media/data-utilities/mask-ops/legacy_gyazo_49e0e05fc6511b8e37a16439afad6fed.png){media=image}

[](/workflows/data-utilities/mask-ops/load_image_as_mask.json)

Loads an image file directly as mask data.

- **channel**:
  - `red`/`green`/`blue`: For a black-and-white image, any of these works.
  - `alpha`: Choose this to use the transparent areas of a transparent PNG as the mask.

### Convert Image to Mask Node

![](/media/data-utilities/mask-ops/legacy_gyazo_aa0f427a4464958a9ebea27ac925294a.png){media=image}

[](/workflows/data-utilities/mask-ops/convert_image_to_mask.json)

Converts an `IMAGE` (RGB image) in the workflow to a `MASK`.

Think of it as the `Load Image (as Mask)` node split into its parts.

### 🪢 Color To Mask Node

![](/media/data-utilities/mask-ops/legacy_gyazo_c38c27135c901d0db5927d493b5b8650.png){media=image}

[](/workflows/data-utilities/mask-ops/color_to_mask.json)

Converts a specific color in an image (such as a green screen) into a mask. In other words, chroma keying.

There is a core node with the same kind of function, `ImageColorToMask`, but you can't adjust its threshold, which makes it awkward to use, so I use the following custom node instead.

- **[Kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)**: `Color To Mask` node

Specify the target color in RGB, and use `threshold` (tolerance) to set how far the color can be off.

### Create Solid Mask Node

![](/media/data-utilities/mask-ops/create_solid_mask.png){media=image}

[](/workflows/data-utilities/mask-ops/create_solid_mask.json)

Creates a rectangular mask of the specified size.

Use this when you need a fully filled (or empty) mask.

### Mask Editor

A tool for painting parts of an image as a mask (black-and-white image) right inside ComfyUI.

- **How to launch**: Select a `Load Image` node etc. → Click `🌔` (Open Mask Editor) in the `Node Selection Toolbox`.

![](/media/begin-with/mask-editor/legacy_gyazo_05a4f6930a6d074435ac29b77c97e82e.mp4){media=loop}

Switch functions with the tabs on the left edge.

- **Draw Mask**: Draw a mask with a brush.
- **Fill**: Fills an area enclosed by a hand-drawn mask.
- **Auto Select**: Automatically masks areas with colors similar to the spot you click.

When you're done, click `Save` in the header to apply it.

For details on how to use it, see [Mask Editor](/en/begin-with/mask-editor/).

---

## Utilizing Depth Maps

### 🪢 Depth Map

![](/media/data-utilities/mask-ops/legacy_gyazo_f2313d12383bc625fbf7f0c16cb8ba34.png){media=image}

[](/workflows/data-utilities/mask-ops/depthmapasmask.json)

A depth map is a black-and-white gradient image, which means you can use it directly as a mask.

Smartphone apps that let you blur a photo's background after the fact work in basically the same way.

For how to create depth maps, see [ControlNet Preprocessor](/en/basic-workflows/controlnet-prep/#frequently-used-preprocessors).

---

## Editing Masks

### Resize Image/Mask Node

This is covered in detail in [Resize Image/Mask Node](/en/data-utilities/resize-crop-pad/#resize-image-mask-node), so see that page.

![](/media/data-utilities/mask-ops/legacy_gyazo_fd9f3fab0b5ead47c84ce51f9ec3325a.png){media=image}

[](/workflows/data-utilities/mask-ops/resize_imagemask_match_size.json)

Here, I'll only cover `match size`.
When you resize an image, the image and mask sizes can end up out of sync, so they no longer line up.

With `match size`, you can resize the mask to match a reference image, so the two line up while keeping the shape (and positions) intact.

### CropMask Node

![](/media/data-utilities/mask-ops/legacy_gyazo_aa6a319345beedb98ad7d873633df500.png){media=image}

[](/workflows/data-utilities/mask-ops/cropmask.json)

Crops the mask to the specified range.

### GrowMask Node

![](/media/data-utilities/mask-ops/legacy_gyazo_395ae15fa99d4b099e80b006dc1c2d7b.png){media=image}

[](/workflows/data-utilities/mask-ops/growmask.json)

Expands the edges of the mask. A negative value shrinks it instead.

### 🪢 Gaussian Blur Mask Node

![](/media/data-utilities/mask-ops/legacy_gyazo_447edb124127718662b35089effdcfa3.png){media=image}

[](/workflows/data-utilities/mask-ops/gaussian_blur_mask.json)

Blurs the mask. This matters for blending edges when compositing.

- Included in [ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack) etc.

### InvertMask Node

![](/media/data-utilities/mask-ops/legacy_gyazo_c8ca1c37aa1e2bf3dd4581028e5ab8b9.png){media=image}

[](/workflows/data-utilities/mask-ops/invertmask.json)

Inverts the mask, swapping black and white.

### ThresholdMask Node

![](/media/data-utilities/mask-ops/legacy_gyazo_08a267a2826ab83e8ba872298c3974ff.png){media=image}

[](/workflows/data-utilities/mask-ops/thresholdmask.json)

Converts a mask with intermediate values (gradients) into a binary (white or black) mask at the specified threshold.

### 🪢 Remap Mask Range Node

![](/media/data-utilities/mask-ops/legacy_gyazo_fc933c9858f06298ea6524fc6ed0ca5b.mp4){media=loop}

[](/workflows/data-utilities/mask-ops/remap_mask_range.json)

Adjusts how a gradient mask is applied.
Combine it with the depth map from earlier, and you can shift which depth the effect focuses on, which gives some fun results.

---

## Compositing Masks

### MaskComposite Node

![](/media/data-utilities/mask-ops/legacy_gyazo_564ef15662a33280a1ec6708104833ce.png){media=image}

[](/workflows/data-utilities/mask-ops/maskcomposite.json)

Composites two masks in various modes (addition, subtraction, multiplication, etc.).

---

{% outputs "samples" %}
![](/media/data-utilities/mask-ops/legacy_gyazo_a4f60a62fa0aec62796ab908f16d9eaa.png){media=image} ![](/media/data-utilities/mask-ops/legacy_gyazo_20ca6b1922830c8864f755bc695d5c80.png){media=image} ![](/media/data-utilities/mask-ops/legacy_gyazo_727e5c4b9b80304adabccd3b36fbfcfe.png){media=image} ![](/media/data-utilities/mask-ops/legacy_gyazo_8c08c2615b3a741e711d3c11485d4d93.png){media=image} ![](/media/data-utilities/mask-ops/legacy_gyazo_96ab673a43e5b23bd666d1889360c981.png){media=image} ![](/media/data-utilities/mask-ops/legacy_gyazo_bb5bd997733867c5c07a986d5793c63a.png){media=image}
{% endoutputs %}
