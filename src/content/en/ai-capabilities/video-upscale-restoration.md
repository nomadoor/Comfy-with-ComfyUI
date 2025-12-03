---
layout: page.njk
lang: en
section: ai-capabilities
slug: video-upscale-restoration
navId: video-upscale-restoration
title: Video Upscale & Restoration
summary: Dedicated models to make videos larger and cleaner
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---

## Video Upscale & Restoration

The basic concept and methods are almost the same as [Upscale & Restoration](/en/ai-capabilities/upscale-restoration/).

* 1. Increase resolution
* 2. Complement lost details plausibly and adjust image quality

However, there is one major difference: in video, **temporal connection (no flickering)** is important.

Applying a still image upscaler "frame by frame" is technically video upscaling, but since it does not have **temporal consistency**, flickering may occur.

After all, it is better to use an upscaler dedicated to video.

I will introduce just two current SoTAs.

> You cannot use still image upscalers for video, but the reverse is not particularly problematic.
> In fact, they perform better than those dedicated to still images and are often used.

---

## SeedVR2

[numz/ComfyUI-SeedVR2_VideoUpscaler](https://github.com/numz/ComfyUI-SeedVR2_VideoUpscaler)

Specialized in video upscaling, enabling generation in 1 step.

It is extremely high performance enough to be used at the restoration level, but it is very heavy.

---

## FlashVSR

[lihaoyun6/ComfyUI-FlashVSR_Ultra_Fast](https://github.com/lihaoyun6/ComfyUI-FlashVSR_Ultra_Fast)

![](https://gyazo.com/70f862355eef1106d51e8068ef48a006){gyazo=image}

[](/workflows/ai-capabilities/video-upscale-restoration/FlashVSR.json)

It processes multiple frames together to suppress temporal blur and flickering.

It is designed to achieve processing speeds close to real-time, and is fast and lightweight, so it is good to try this one for now.
