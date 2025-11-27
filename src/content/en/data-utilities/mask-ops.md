---
layout: page.njk
lang: en
section: data-utilities
slug: mask-ops
navId: mask-ops
title: "Mask Operations"
summary: "How to create and edit masks"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## Checking Masks

### MaskPreview Node

![](https://gyazo.com/a9dd4acbc14438fd7edfe85d3a14c6f3){gyazo=image}

[](/workflows/data-utilities/mask-ops/MaskPreview.json)

This is the mask version of the `Preview Image` node.

### Convert Mask to Image Node

![](https://gyazo.com/28a1d381f0697c598db58f1e4c5648c6){gyazo=image}

[](/workflows/data-utilities/mask-ops/Convert_Mask_to_Image.json)

Converts a mask to a black and white `Image`.

---

## Creating Masks

### Load Image (as Mask) Node

![](https://gyazo.com/49e0e05fc6511b8e37a16439afad6fed){gyazo=image}

[](/workflows/data-utilities/mask-ops/Load_Image_(as_Mask).json)

Loads an image file directly as mask data.

- **channel**:
  - `red`/`green`/`blue`: If using a black and white image, any choice is OK.
  - `alpha`: Select this if you want to use the "transparent part" of a transparent PNG as a mask.

### Convert Image to Mask Node

![](https://gyazo.com/aa0f427a4464958a9ebea27ac925294a){gyazo=image}

[](/workflows/data-utilities/mask-ops/Convert_Image_to_Mask.json)

Converts an `IMAGE` (RGB image) in the workflow to a `MASK`.

It's like breaking down the `Load Image (as Mask)` node.

### 🪢 Color To Mask Node

![](https://gyazo.com/c38c27135c901d0db5927d493b5b8650){gyazo=image}

[](/workflows/data-utilities/mask-ops/Color_To_Mask.json)

Converts a specific color of an image (such as a green screen) to a mask. This is so-called chroma key processing.

There is a core node called `ImageColorToMask` with similar functionality, but it is difficult to use because the threshold cannot be adjusted, so we use the following custom node.

- **[Kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)**: `Color To Mask` node

Specify the target color in RGB and adjust the color error with `threshold`.

### SolidMask Node

![](https://gyazo.com/088fbef6cdf9175a1a5bb0c08cfc9d8f){gyazo=image}

[](/workflows/data-utilities/mask-ops/SolidMask.json)

Creates a rectangular mask of the specified size.

Use this when you need a fully filled (or empty) mask.

### Mask Editor

A tool that allows you to draw specific parts of an image as a mask (black and white image) on ComfyUI.

- **How to launch**: Select a `Load Image` node etc. → Click `🌔` (Open Mask Editor) in the `Node Selection Toolbox`.

![](https://gyazo.com/05a4f6930a6d074435ac29b77c97e82e){gyazo=loop}

Switch functions with the tabs on the left edge.

- **Draw Mask**: Draw a mask with a brush.
- **Fill**: Fills the area enclosed by the handwritten mask.
- **Auto Select**: Automatically masks the range of colors similar to the clicked point.

When editing is complete, click `Save` in the header to apply.

For detailed operation instructions, please see [Mask Editor](/en/begin-with/mask-editor/).

---

## Utilizing Depth Maps

### 🪢 Depth Map

![](https://i.gyazo.com/f2313d12383bc625fbf7f0c16cb8ba34.png){gyazo=image}

[](/workflows/data-utilities/mask-ops/DepthmapAsMask.json)

A depth map is a black and white gradient image. This means it can be diverted as a mask as it is.

Smartphone apps have processing to blur the background of photos later, and basically, it is the same mechanism.

For how to create depth maps, please see [How to create control images (TBD)]().

---

## Editing Masks

### CropMask Node

![](https://gyazo.com/aa6a319345beedb98ad7d873633df500){gyazo=image}

[](/workflows/data-utilities/mask-ops/CropMask.json)

Crops the mask to the specified range.

### GrowMask Node

![](https://gyazo.com/395ae15fa99d4b099e80b006dc1c2d7b){gyazo=image}

[](/workflows/data-utilities/mask-ops/GrowMask.json)

Expands the outline of the mask. If the value is negative, you can also narrow (thin) it.

### 🪢 Gaussian Blur Mask Node

![](https://gyazo.com/447edb124127718662b35089effdcfa3){gyazo=image}

[](/workflows/data-utilities/mask-ops/Gaussian_Blur_Mask.json)

Blurs the mask. Important for blending boundaries during composition.

- Included in [ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack) etc.

### InvertMask Node

![](https://gyazo.com/c8ca1c37aa1e2bf3dd4581028e5ab8b9){gyazo=image}

[](/workflows/data-utilities/mask-ops/InvertMask.json)

Inverts the black and white of the mask.

### ThresholdMask Node

![](https://gyazo.com/08a267a2826ab83e8ba872298c3974ff){gyazo=image}

[](/workflows/data-utilities/mask-ops/ThresholdMask.json)

Converts a mask with intermediate values (gradients) into a binary (white or black) mask at the specified threshold.

### 🪢 Remap Mask Range Node

![](https://i.gyazo.com/fc933c9858f06298ea6524fc6ed0ca5b.png){gyazo=image}

[](/workflows/data-utilities/mask-ops/Remap_Mask_Range.json)

Adjusts how the gradient mask is applied.
Combining with the aforementioned "Depth Map", you can change "which position" in the depth to focus on, obtaining interesting effects.

---

## Compositing Masks

### MaskComposite Node

![](https://gyazo.com/564ef15662a33280a1ec6708104833ce){gyazo=image}

[](/workflows/data-utilities/mask-ops/MaskComposite.json)

Composites two masks in various modes (addition, subtraction, multiplication, etc.).

---

## Sample Images

![](https://gyazo.com/a4f60a62fa0aec62796ab908f16d9eaa){gyazo=image} ![](https://gyazo.com/20ca6b1922830c8864f755bc695d5c80){gyazo=image} ![](https://gyazo.com/727e5c4b9b80304adabccd3b36fbfcfe){gyazo=image} ![](https://gyazo.com/8c08c2615b3a741e711d3c11485d4d93){gyazo=image} ![](https://gyazo.com/96ab673a43e5b23bd666d1889360c981){gyazo=image} ![](https://gyazo.com/bb5bd997733867c5c07a986d5793c63a){gyazo=image}
