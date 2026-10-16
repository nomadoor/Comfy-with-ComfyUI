---
layout: page.njk
lang: en
section: ai-capabilities
slug: matting
navId: matting
title: Matting
created: 2025-12-03
updated: 2026-03-02
summary: "Cutting the foreground out of an ordinary image and separating it from the background"
seoTitle: "What Is Image Matting? AI Background Removal"
seoDescription: "Image matting separates foreground from background in ordinary photos, down to single hairs, with alpha mattes. Introduces BiRefNet and SDMatte."
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: '/media/ai-capabilities/matting/legacy_gyazo_38630075ecd6336a630da0fe5b8ba130.mp4'
---

## What is Matting?

Image matting is the task of **separating the foreground from the background** in ordinary photos or images, without any special setup like shooting on a green screen.

Most so-called "background removal services" are built on matting.

The goal is to cut out even fine details like hair as naturally as possible. Instead of a simple binary (black-and-white) mask, it produces a mask that also carries semi-transparency, called an **alpha matte**.

---

## BiRefNet

[BiRefNet](https://github.com/ZhengPeng7/BiRefNet) is a family of foreground extraction models: high-accuracy models specialized for background removal and matte generation.

It's lightweight and performs well, so for matting you can't go wrong with BiRefNet.

![](/media/ai-capabilities/matting/legacy_gyazo_131fe705fd29ddd98391fb4e78b608ab.png){media=image}

[](/workflows/ai-capabilities/matting/birefnet_general.json)

There are several variants, but start with **general**. It handles a wide range of subjects, including people, objects, and animals.

---

## SDMatte

[SDMatte](https://github.com/vivoCameraResearch/SDMatte) is a matting model that draws on what Stable Diffusion knows.

![](/media/ai-capabilities/matting/legacy_gyazo_317da8e987179adbe6e02f0eb40a4a07.png){media=image}

[](/workflows/ai-capabilities/matting/sdmatte.json)

It can cut out the foreground just like BiRefNet, but what sets it apart is that it can handle **see-through things** like glass bottles, liquids, and thin fabric, at least to some extent.

Like any diffusion-based model, it's computationally expensive, but give it a try when you need to cut out transparent or semi-transparent objects, or extremely fine things like the tips of hair.
