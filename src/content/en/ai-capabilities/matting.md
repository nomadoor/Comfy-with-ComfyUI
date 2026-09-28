---
layout: page.njk
lang: en
section: ai-capabilities
slug: matting
navId: matting
title: Matting
created: 2025-12-03
updated: 2026-03-02
summary: "Technology to cut out the foreground from a natural image and separate it from the background"
seoTitle: "What Is Image Matting? AI Background Removal"
seoDescription: "Image matting separates foreground from background in ordinary photos, down to single hairs, with alpha mattes. Introduces BiRefNet and SDMatte."
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: '/media/ai-capabilities/matting/legacy_gyazo_38630075ecd6336a630da0fe5b8ba130.mp4'
---

## What is Matting?

Image Matting is a task to **separate the foreground and background** from ordinary photos or images without special preparations like green screen shooting.

Many so-called "background removal services" are based on this matting technology.

The goal of matting is to cut out even fine parts like hair as naturally as possible. Instead of a simple binary mask (black and white only), it generates a mask that includes semi-transparent information called an **alpha matte**.

---

## BiRefNet

[BiRefNet](https://github.com/ZhengPeng7/BiRefNet) is a model family for foreground extraction, a high-precision model specialized for background removal and matte generation.

It is lightweight and high-performance, so if you choose BiRefNet for matting, you can't go wrong.

![](/media/ai-capabilities/matting/legacy_gyazo_131fe705fd29ddd98391fb4e78b608ab.png){media=image}

[](/workflows/ai-capabilities/matting/birefnet_general.json)

There are several derivative models, but please try **general** first. It supports a wide range of subjects such as people, objects, and animals.

---

## SDMatte

[SDMatte](https://github.com/vivoCameraResearch/SDMatte) is a matting model that utilizes the knowledge of Stable Diffusion.

![](/media/ai-capabilities/matting/legacy_gyazo_317da8e987179adbe6e02f0eb40a4a07.png){media=image}

[](/workflows/ai-capabilities/matting/sdmatte.json)

Like BiRefNet, it can cut out the foreground, but it is characterized by being able to handle **transparent things** such as glass bottles, liquids, and thin fabrics to some extent.

As a fate of diffusion-based models, the computational cost is high, but please try it when you want to cut out transparent/semi-transparent objects or extremely fine things like hair tips.
