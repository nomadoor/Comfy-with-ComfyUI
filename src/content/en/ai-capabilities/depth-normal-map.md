---
layout: page.njk
lang: en
section: ai-capabilities
slug: depth-normal-map
navId: depth-normal-map
title: "Depth Estimation & Normal Map"
summary: "Technology to extract depth and three-dimensionality from images"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/f6033924229b0ea961d8f22eb38bd6b2.png"
---

## What are Depth Maps and Normal Maps?

**Depth Map**
- An image comprising values of "distance from the camera" for each pixel.
- Generally, closer objects are whiter, and farther objects are blacker.

**Normal Map**
- An image where "surface orientation (normal vector)" for each pixel is encoded in RGB.
- Since it tells which direction a surface is facing, it is used for relighting and 3D-like deformation.

**Monocular Depth Estimation**
- A task to estimate a depth map from a single RGB image.
- If you want truly accurate depth, you need multiple sensors like LiDAR or stereo cameras, but monocular depth estimation attempts to "restore pseudo depth information from just one photo."
- Since depth and normal are similar information, many models can estimate both simultaneously.

---

## Representative Models for Monocular Depth Estimation

### MiDaS / ZoeDepth (Standard before Diffusion Models)

Before diffusion models became generalized, MiDaS and ZoeDepth were the standard models for monocular depth estimation.

![](https://gyazo.com/8471cde6727e271aa05f0bad44797144){gyazo=image}

[](/workflows/ai-capabilities/depth-normal-map/MiDaS_Depth-Normal_Map.json)

- **MiDaS**
  - A model trained to estimate relative depth even from "miscellaneous images" with varied camera parameters.
  - It has been widely used for purposes where knowing "relatively which is front or back" is sufficient.

- **ZoeDepth**
  - A model aiming to uniformly handle relative depth and metric depth (meters).

There is not much point in using these in new workflows, but you may see them in old workflows, so just remember the names.

### Depth Anything Family

The current mainstream is foundation models for depth estimation like **Depth Anything / Depth Anything V2 / V3**.

![](https://gyazo.com/69b8c5331c693c699d389f1c95935fff){gyazo=image}

[](/workflows/ai-capabilities/depth-normal-map/Depth_Anything_V2.json)

When creating depth maps in ComfyUI, you will mostly use them as preprocessing for ControlNet, so for now, using this is OK.

---

## Depth/Normal Estimation Derived from Diffusion Models

Since diffusion models became widespread, research has also emerged in the direction of "using the world knowledge possessed by generative models for other tasks."

Without fear of misunderstanding, it is like **"converting style to depth map style."**

### Marigold

Marigold is a model based on Stable Diffusion 2, "fine-tuned for depth estimation tasks."

It attracted a lot of attention at the time because there were few other ideas of using image generation models for purposes other than image generation.
However, since it requires almost the same computational cost as generating one image, it is a bit heavy as mere preprocessing.

### Lotus

Lotus is a dense prediction model of the type that "uses the architecture of diffusion models but outputs depth or normal itself instead of predicting noise."

### LBM (Latent Bridge Matching)

LBM is a framework for "1-step image-to-image" based on Stable Diffusion XL, but it has derivative models for depth estimation / normal estimation within it.
