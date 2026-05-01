---
layout: page.njk
lang: en
section: data-utilities
slug: color-adjustments
navId: color-adjustments
title: "Color Adjustments & Effects"
summary: "About image brightness adjustment, blur, and effects"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/e1ecb574e0c11da63b0c6f8cee7a9f87.png"
---

## Color Adjustments & Effects

Brightening images, increasing contrast, adding glow to make them look cool... these are familiar processes for designers and artists.

In image generation, these functions are sometimes used as "preprocessing" to make images easier for AI to use.

There are many custom nodes related to image processing, and more advanced processing is possible, but honestly, there are many situations where it feels easier to use a familiar paint tool.

**You don't have to do everything in ComfyUI.**

---

## Basic Processing

### Invert Image Node

![](https://gyazo.com/79ea23575a35a9e8957853294e4f4e7e){gyazo=image}

[](/workflows/data-utilities/color-adjustments/Invert_Image.json)

Generates a negative image with inverted RGB values.

### Image Sharpen Node

![](https://gyazo.com/0296ddc8958f0b0ee358afbdd449424b){gyazo=image}

[](/workflows/data-utilities/color-adjustments/ImageSharpen.json)

Sharpens the outlines.

### Image Blur Node

![](https://gyazo.com/b3ae153b9b69063b83e3fb1eeb9bd335){gyazo=image}

[](/workflows/data-utilities/color-adjustments/ImageBlur.json)

Blurs the image.

### Image Quantize Node

![](https://gyazo.com/08652b0b1815b616f8e644ed9067c56a){gyazo=image}

[](/workflows/data-utilities/color-adjustments/ImageQuantize.json)

Reduces the number of colors (posterization).

### ImageAddNoise Node

![](https://gyazo.com/e57bf28e9d62134222cce8daaab0079e){gyazo=image}

[](/workflows/data-utilities/color-adjustments/ImageAddNoise.json)

Adds noise to the image.

Although a bit niche, there is a technique to increase details even with low denoise settings by intentionally adding noise when performing image2image.

cf. [Adding noise to pixel images to increase details in image2image with low denoise](https://scrapbox.io/work4ai/%E3%83%94%E3%82%AF%E3%82%BB%E3%83%AB%E7%94%BB%E5%83%8F%E3%81%AB%E3%83%8E%E3%82%A4%E3%82%BA%E3%82%92%E8%BF%BD%E5%8A%A0%E3%81%97%E3%81%A6%E3%80%81%E4%BD%8Edenoise%E3%81%A7%E3%81%AEimage2image%E3%81%AE%E3%83%87%E3%82%A3%E3%83%86%E3%83%BC%E3%83%AB%E3%82%92%E5%A2%97%E3%82%84%E3%81%99)

---

## Morphological Transformation

![](https://gyazo.com/db828b756ce851d763f9589b267f6002){gyazo=image}

[](/workflows/data-utilities/color-adjustments/ImageMorphology.json)

It may be an unfamiliar term, but it is mainly used to process black and white mask images.
Processing such as "thickening lines (dilation)" and "removing noise (erosion)" is possible.

cf. [OpenCV-Python/Morphological Transformations](https://docs.opencv.org/4.x/d9/d61/tutorial_py_morphological_ops.html)

---

## Full-scale Color Correction (Custom Nodes)

There are countless custom nodes that add more practical image editing functions like those done in Photoshop.
Among them, we will introduce one that covers basic functions and is simple and easy to use.

### ComfyUI-Image-Effects

- **[orion4d/ComfyUI-Image-Effects](https://github.com/orion4d/ComfyUI-Image-Effects)**

![](https://i.gyazo.com/e1ecb574e0c11da63b0c6f8cee7a9f87.png){gyazo=image}

It includes many functions that humans would want to adjust, such as Hue/Saturation/Value adjustment (HSV adjustment), tone curve-like adjustment, and various filters.
Please check the repository documentation for a detailed list of functions.
