---
layout: page.njk
lang: en
section: ai-capabilities
slug: video-upscale-restoration
navId: video-upscale-restoration
title: Video Upscale & Restoration
created: 2025-12-01
updated: 2026-03-02
summary: Dedicated models for making videos bigger and cleaner
seoTitle: "AI Video Upscaling and Restoration: SeedVR2, FlashVSR"
seoDescription: "Models for upscaling and restoring video: why frame-by-frame image upscalers flicker, and how SeedVR2 and FlashVSR stay consistent over time."
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---

## Video Upscale & Restoration

The basic idea and methods are almost the same as in [Upscale & Restoration](/en/ai-capabilities/upscale-restoration/).

* 1. Increase resolution
* 2. Plausibly fill in lost detail and clean up the image quality

There is one big difference, though: with video, **continuity over time (no flicker)** matters.

Applying a still-image upscaler "one frame at a time" does technically upscale a video, but it has no **temporal consistency**, so you may get flicker.

So you're better off using an upscaler made for video.

Here are just two of the current state-of-the-art options.

> [!NOTE]
> You can't use still-image upscalers for video, but the reverse works just fine.
> In fact, video upscalers often perform better than dedicated still-image ones, and they're widely used that way.

---

## SeedVR2

[numz/ComfyUI-SeedVR2_VideoUpscaler](https://github.com/numz/ComfyUI-SeedVR2_VideoUpscaler)

Built specifically for video upscaling, it generates in a single step.

It's powerful enough to use for proper restoration, but it's very heavy.

---

## FlashVSR

[lihaoyun6/ComfyUI-FlashVSR_Ultra_Fast](https://github.com/lihaoyun6/ComfyUI-FlashVSR_Ultra_Fast)

![](/media/ai-capabilities/video-upscale-restoration/legacy_gyazo_70f862355eef1106d51e8068ef48a006.mp4){media=loop}

[](/workflows/ai-capabilities/video-upscale-restoration/flashvsr.json)

It processes several frames at once to keep temporal jitter and flicker down.

It's designed for near-real-time processing speeds, and since it's fast and lightweight, it's a good one to try first.
