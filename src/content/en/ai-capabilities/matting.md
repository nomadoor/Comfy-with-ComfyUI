---
layout: page.njk
lang: en
section: ai-capabilities
slug: matting
navId: matting
title: Matting
summary: "Technology to cut out the foreground from a natural image and separate it from the background"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: 'https://i.gyazo.com/38630075ecd6336a630da0fe5b8ba130.gif'
---

## What is Matting?

Image Matting is a task to **separate the foreground and background** from ordinary photos or images without special preparations like green screen shooting.

Many so-called "background removal services" are based on this matting technology.

The goal of matting is to cut out even fine parts like hair as naturally as possible. Instead of a simple binary mask (black and white only), it generates a mask that includes semi-transparent information called an **alpha matte**.

---

## BiRefNet

[BiRefNet](https://github.com/ZhengPeng7/BiRefNet) is a model family for foreground extraction, a high-precision model specialized for background removal and matte generation.

It is lightweight and high-performance, so if you choose BiRefNet for matting, you can't go wrong.

![](https://gyazo.com/131fe705fd29ddd98391fb4e78b608ab){gyazo=image}

[](/workflows/ai-capabilities/matting/BiRefNet-general.json)

There are several derivative models, but please try **general** first. It supports a wide range of subjects such as people, objects, and animals.

---

## SDMatte

[SDMatte](https://github.com/vivoCameraResearch/SDMatte) is a matting model that utilizes the knowledge of Stable Diffusion.

![](https://gyazo.com/317da8e987179adbe6e02f0eb40a4a07){gyazo=image}

[](/workflows/ai-capabilities/matting/SDMatte.json)

Like BiRefNet, it can cut out the foreground, but it is characterized by being able to handle **transparent things** such as glass bottles, liquids, and thin fabrics to some extent.

As a fate of diffusion-based models, the computational cost is high, but please try it when you want to cut out transparent/semi-transparent objects or extremely fine things like hair tips.
