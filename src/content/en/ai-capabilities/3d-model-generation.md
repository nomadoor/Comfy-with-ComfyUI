---
layout: page.njk
lang: en
section: ai-capabilities
slug: 3d-model-generation
navId: 3d-model-generation
title: 3D Model Generation
summary: "From multi-view to world models"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---

## 3D Generation

3D generation, as the name suggests, is a task to create a 3D model based on a text prompt or a reference image.

Like text2image, it would be nice if a model simply appeared from noise, but just as video has one more dimension in the time axis, 3D generation increases dimensions in the spatial direction, so it cannot be realized easily.

Let me tell you first, 3D generation has not yet reached a performance level for professional use.
However, the technology to create models from images and eventually create a walkable world is growing steadily.

Let's follow the flow of this technology, which is in the midst of development.

*Note: The chronological order and technical connections are quite loose. Please look at it broadly.*

---

## Multi-View Generation

Originally, technologies like NeRF to create 3D spaces/models from images existed.
However, to build 3D with NeRF, images of the same object viewed from various viewpoints are required.

Multi-view generation was born from this perspective.

### Zero-1-to-3

> ![](https://gyazo.com/8f4d195ac2daffffc7356a036d4a3c98){gyazo=image}
> [Zero-1-to-3: Zero-shot One Image to 3D Object](https://zero123.cs.columbia.edu/)

One of the earliest multi-view generations based on diffusion models, it generates an image from a new viewpoint by changing the camera composition of the input image.

At the time, I thought it looked useful regardless of 3D generation, but the required specs were high and I couldn't use it.
Now, similar things can be easily done with instruction-based image editing.

### Zero123++

Zero-1-to-3 was used as "Make one image of another angle of the input image → Rotate the angle and repeat", but **[Zero123++](https://github.com/SUDO-AI-3D/zero123plus)** generates multiple viewpoints simultaneously.

![](https://gyazo.com/b6b4e05ace668acfd75449b8252b139f){gyazo=image} ![](https://gyazo.com/59359f3b3b6f250358211d2044d207fe){gyazo=image}

Originally, it was known that when diffusion models generate multiple images in batch (cf. [Batch & Video](/en/data-utilities/batch-video)), the generated images have some consistency with each other.

3D generation requires images from all directions from the beginning.
Zero123++ can be said to be a model that utilized this property and swung in the direction of "making as consistent multi-views as possible in one generation".

---

## Emergence of Video Generation Models

A little later, models capable of video generation began to appear.

Here, instead of treating multi-view generation as "a type of image editing", the idea comes up:

> A video shot while going around the target object
> = Very finely chopped multi-view

Why not treat it as such?

### Stable Video 3D

[Introducing Stable Video 3D](https://stability.ai/news/introducing-stable-video-3d)

It is a flow of image2model based on Stable Video Diffusion.

![](https://gyazo.com/49e94de4d1476e100761e2e6be7a2f6e){gyazo=image}

[](/workflows/ai-capabilities/3d-model-generation/SV3D.json)

* Input one still image
* Generate a 360-degree video where the object rotates
* Treat each frame of the video as a separate viewpoint image and restore 3D from there

The flow of applying video generation models to 3D model generation continues to this day.

Current video generation models are much higher performance than at this time, so you can generate high-definition 360-degree rotation videos without specialized fine-tuning.

---

## Models Aiming Directly for image→3D Model

Up to this point, the premise was a "two-stage configuration":

* First collect multi-views (or rotation videos)
* Create 3D with another mechanism

From there, models are emerging that go one step further and aim directly for the form:

> Input is image (or text), output is suddenly 3D model

### Hunyuan3D-2.1

Hunyuan3D-2.1 is a large-scale model for creating 3D assets from images or text.

* First stage to output only the "shape" part (rough 3D shape)
* Second stage to apply high-resolution appearance including PBR textures

It has a two-stage configuration like this.

### SAM 3D Objects

SAM 3D Objects is a model that restores 3D objects from a single real photo.

* On the 2D side, use SAM-based segmentation to firmly cut out the target object
* Using the cut-out area as a clue, estimate the 3D shape and texture while complementing the hidden parts

It follows this flow.

Although the technical contents are completely different, both are trying to solve "image → 3D model" head-on.

---

## World Models

So far, we have discussed modeling a single object.
On the other hand, attempts to create a whole world from photos are also progressing.

> The "World Model" here means a **model that constructs a 3D world (scene)**, rather than a world model (prediction of physics).

### 360-degree Panorama Generation

The start is 360-degree panorama generation.

Tools from Latent Labs and [HunyuanWorld-1.0](https://github.com/Tencent-Hunyuan/HunyuanWorld-1.0) correspond to this.

* Paste the input image onto a panoramic sphere
* Supplement the directions not shown with outpainting

With this simple idea, create a "look that is filled 360 degrees for now".

At this stage, it cannot be called 3D yet, but
by combining depth maps and mesh restoration here, they are trying to build a 3D space with depth.

### HunyuanWorld-Mirror

When it comes to [HunyuanWorld-Mirror](https://github.com/Tencent-Hunyuan/HunyuanWorld-Mirror), it gets closer to creating a world that you can essentially walk around in.

> ![](https://gyazo.com/47ddf0aa2f5bc667b43be75d2ed1223c){gyazo=player}

* It consists of components such as estimating camera information, depth, and 3D representation (3D Gaussian, etc.) collectively with an image (or video) as input.
