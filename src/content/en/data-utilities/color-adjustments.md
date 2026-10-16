---
layout: page.njk
lang: en
section: data-utilities
slug: color-adjustments
navId: color-adjustments
title: "Color Adjustments & Effects"
created: 2025-11-25
updated: 2026-03-02
summary: "Adjusting brightness, blurring, and other image effects"
seoTitle: "Color Adjustment and Effect Nodes in ComfyUI"
seoDescription: "ComfyUI nodes for color and effects: invert, sharpen, blur, quantize, add noise, morphology, and custom nodes for full color grading."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/data-utilities/color-adjustments/legacy_gyazo_e1ecb574e0c11da63b0c6f8cee7a9f87.png"
---

## Color Adjustments & Effects

Brightening an image, boosting contrast, adding a glow to make it look cool... these are everyday steps for designers and illustrators.

In image generation, these features are sometimes used as "preprocessing" to get images into a shape that's easier for AI to work with.

There are plenty of image-processing custom nodes, and they can do much more advanced things, but honestly, a lot of the time it's just easier to use the paint tool you already know.

**You don't have to do everything in ComfyUI.**

---

## Basic Processing

### Invert Image Node

![](/media/data-utilities/color-adjustments/legacy_gyazo_79ea23575a35a9e8957853294e4f4e7e.png){media=image}

[](/workflows/data-utilities/color-adjustments/invert_image.json)

Generates a negative image with inverted RGB values.

### Image Sharpen Node

![](/media/data-utilities/color-adjustments/legacy_gyazo_0296ddc8958f0b0ee358afbdd449424b.png){media=image}

[](/workflows/data-utilities/color-adjustments/imagesharpen.json)

Sharpens the outlines.

### Image Blur Node

![](/media/data-utilities/color-adjustments/legacy_gyazo_b3ae153b9b69063b83e3fb1eeb9bd335.png){media=image}

[](/workflows/data-utilities/color-adjustments/imageblur.json)

Blurs the image.

### Image Quantize Node

![](/media/data-utilities/color-adjustments/legacy_gyazo_08652b0b1815b616f8e644ed9067c56a.png){media=image}

[](/workflows/data-utilities/color-adjustments/imagequantize.json)

Reduces the number of colors (posterization).

### ImageAddNoise Node

![](/media/data-utilities/color-adjustments/legacy_gyazo_e57bf28e9d62134222cce8daaab0079e.png){media=image}

[](/workflows/data-utilities/color-adjustments/imageaddnoise.json)

Adds noise to the image.

It's a bit niche, but there's a technique where you deliberately add noise before image2image to get more detail even at a low denoise setting.

cf. [Adding noise to pixel images to increase details in image2image with low denoise](https://scrapbox.io/work4ai/%E3%83%94%E3%82%AF%E3%82%BB%E3%83%AB%E7%94%BB%E5%83%8F%E3%81%AB%E3%83%8E%E3%82%A4%E3%82%BA%E3%82%92%E8%BF%BD%E5%8A%A0%E3%81%97%E3%81%A6%E3%80%81%E4%BD%8Edenoise%E3%81%A7%E3%81%AEimage2image%E3%81%AE%E3%83%87%E3%82%A3%E3%83%86%E3%83%BC%E3%83%AB%E3%82%92%E5%A2%97%E3%82%84%E3%81%99)

---

## Morphological Transformation

![](/media/data-utilities/color-adjustments/legacy_gyazo_db828b756ce851d763f9589b267f6002.png){media=image}

[](/workflows/data-utilities/color-adjustments/imagemorphology.json)

It may not be a term you hear often, but it's mainly used on black-and-white mask images.
It lets you do things like "thicken lines (dilation)" or "remove noise (erosion)."

cf. [OpenCV-Python/Morphological Transformations](https://docs.opencv.org/4.x/d9/d61/tutorial_py_morphological_ops.html)

---

## Full-scale Color Correction (Custom Nodes)

There are countless custom nodes that add more practical, Photoshop-style image editing features.
Here's one that covers the basics while staying simple and easy to use.

### ComfyUI-Image-Effects

- **[orion4d/ComfyUI-Image-Effects](https://github.com/orion4d/ComfyUI-Image-Effects)**

![](/media/data-utilities/color-adjustments/legacy_gyazo_e1ecb574e0c11da63b0c6f8cee7a9f87.png){media=image}

It includes most of the adjustments a person would want to make, such as hue/saturation/value (HSV) adjustment, tone-curve-style adjustment, and various filters.
See the repository's documentation for the full list of features.
