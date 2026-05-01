---
layout: page.njk
lang: en
section: notes
slug: why-512px
navId: why-512px
title: "Why generate at 512px × 512px?"
created: 2025-12-13
updated: 2026-03-02
noteTags: ["faq", "sd15"]
summary: "Why sizes around 512px are recommended for Stable Diffusion 1.5"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: ""
---

## Why does everyone generate around 512px?

In Stable Diffusion 1.5, images are basically generated at 512px × 512px.

Recent YouTube resolution is 1920×1080 (1080p), and those who usually draw might prepare a canvas around 3000px.
Yet, everyone generates around 512px in image generation. Why such low resolution?

There are two main reasons.

- Because it is trained on images around 512px
- Because computational cost jumps up at once when resolution is increased

---

## 1. The model is trained around 512px

Stable Diffusion 1.5 is trained mostly on **square images of 512px × 512px**.

- Vertical and horizontal images are also trimmed to 512px squares for training.
- As a result, it is good at "drawing squares around 512px", but it has not practiced "larger pictures" or "extreme vertical/horizontal shapes" in the first place.

![](https://gyazo.com/a5fee7589b0c712f6db86426d8f1cc72){gyazo=image}

In fact, if you generate at 768px or 1024px, dogs might split and appear as multiple dogs even though you wrote `a single dog`.

Rather than **"generating at 512px"**, strictly speaking, **"it can only generate well around 512px"** is the essential reason.

### Solution: Hires.fix

One solution is Hires.fix.

- First, generate an image around 512 × 512px which the model is good at.
- Enlarge that image and have it redrawn again using the enlarged image as a draft (image2image).

The idea is not to make it draw sizes it is not good at suddenly, but **"to go through the size it is good at once, and then make it a large picture"**.

---

## 2. Computational complexity increases at once when resolution is increased

The other is simply **a problem of computational complexity**.

- If width/height is doubled, the number of pixels becomes quadrupled.
- Since the number of Diffusion steps and model size are the same, VRAM and calculation time become a world close to "×4".

The Stable Diffusion 1.5 model itself is relatively compact, but still, if you make it draw a large resolution like 1024px or 2000px as a single image suddenly, the load becomes quite heavy.

### Solution: VRAM saving and Tiled methods

There are several options for dealing with when you want to increase resolution.

- **Save VRAM**
  - Use techniques from [Speed and Efficiency](/en/basic-workflows/speed-and-efficiency/) to adjust models and precision to suppress VRAM consumption.

- **Use Tiled methods**
  - Instead of generating one sheet as a whole, use [Ultimate SD upscale](/en/basic-workflows/ultimate-sd-upscale/) which divides and combines.
  - If you increase the number of divisions like 4 divisions, 8 divisions, theoretically you can make ultra-high resolution images as much as you want.

---

## Story after SDXL

The story so far is basically **a premise of the SD1.5 generation**.
In subsequent models, the handling of training resolution and aspect ratio has been changing little by little.

- **After NovelAI Diffusion**
  - NovelAI is an image generation service specialized in anime style in the early days, but they devised the dataset and used vertical/horizontal images for training. This made it easier to generate with various aspect ratios.
  - Many models that appeared after this generally mix and learn images of various resolutions.

- **SDXL**
  - The standard for training resolution has risen to **1024px × 1024px**.
  - Furthermore, in newer models, those that can output relatively stably from low resolution images to higher resolution images (1-2 megapixel class) remain increasing.
  - Due to improvements in architecture, extremes like "computational complexity explodes the moment resolution is raised" like in the past are decreasing.

However, the following thinking still does not change.

- Try generating at the "recommended resolution" that the model is best at.
- Based on that, expand with Hires.fix, upscale, or tiled methods as needed.

First, **"generate one sheet in the resolution band the model is practicing"**.
512px was just the starting point for SD1.5.
