---
layout: page.njk
lang: en
section: ai-capabilities
slug: depth-normal-map
navId: depth-normal-map
title: "Depth Estimation & Normal Map"
created: 2025-12-01
updated: 2026-03-02
summary: "Pulling depth and 3D form out of an image"
seoTitle: "Depth Estimation and Normal Maps: Depth Anything and More"
seoDescription: "Estimate depth and normals from a single image: MiDaS, ZoeDepth, and Depth Anything compared with diffusion-based Marigold, Lotus, and LBM."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/ai-capabilities/depth-normal-map/legacy_gyazo_f6033924229b0ea961d8f22eb38bd6b2.png"
---

## What are Depth Maps and Normal Maps?

**Depth Map**
- An image where each pixel stores its "distance from the camera."
- Usually, closer things are whiter and farther things are darker.

**Normal Map**
- An image where each pixel's "surface orientation (normal vector)" is encoded as RGB.
- Because it shows which way each surface faces, it's used for relighting and 3D-style deformation.

**Monocular Depth Estimation**
- The task of estimating a depth map from a single RGB image.
- For truly accurate depth you'd need LiDAR, stereo cameras, or other multiple sensors. Monocular depth estimation is an attempt to "recover approximate depth from just one photo."
- Depth and normals carry closely related information, so many models can estimate both at once.

---

## Representative Models for Monocular Depth Estimation

### MiDaS / ZoeDepth (The Standards Before Diffusion Models)

Before diffusion models became widespread, MiDaS and ZoeDepth were the go-to models for monocular depth estimation.

![](/media/ai-capabilities/depth-normal-map/legacy_gyazo_8471cde6727e271aa05f0bad44797144.png){media=image}

[](/workflows/ai-capabilities/depth-normal-map/midas_depth_normal_map.json)

- **MiDaS**
  - Trained to estimate relative depth even from a messy mix of images with all sorts of camera parameters.
  - Widely used whenever it's enough to know "what's in front of what."

- **ZoeDepth**
  - Aims to handle both relative depth and metric depth (in meters) in one model.

There's little reason to use these in new workflows, but they show up in older ones, so it's worth knowing the names.

### Depth Anything Family

These days, the mainstream choice is depth estimation foundation models like **Depth Anything / Depth Anything V2 / V3**.

![](/media/ai-capabilities/depth-normal-map/legacy_gyazo_69b8c5331c693c699d389f1c95935fff.png){media=image}

[](/workflows/ai-capabilities/depth-normal-map/depth_anything_v2.json)

In ComfyUI, you'll mostly be making depth maps as preprocessing for ControlNet, and for that, just using this is fine.

---

## Depth/Normal Estimation Derived from Diffusion Models

Once diffusion models caught on, research also started on "putting the world knowledge inside generative models to use for other tasks."

To put it crudely, it's like **"style-transferring the image into a depth map."**

### Marigold

Marigold is Stable Diffusion 2 "fine-tuned for depth estimation."

It got a lot of attention at the time, since hardly anyone else had thought of using an image generation model for something other than generating images.
But it costs about as much compute as generating a whole image, which is a bit heavy for a simple preprocessing step.

### Lotus

Lotus is a dense prediction model that "uses a diffusion model architecture but outputs depth or normals directly instead of predicting noise."

### LBM (Latent Bridge Matching)

LBM is a framework for "one-step image-to-image" built on Stable Diffusion XL, and it includes spin-off models for depth estimation and normal estimation.
