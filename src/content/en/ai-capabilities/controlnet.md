---
layout: page.njk
lang: en
section: ai-capabilities
slug: controlnet
navId: controlnet
title: ControlNet Techniques
summary: Techniques to control image generation with additional information such as
  poses and line art.
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: https://i.gyazo.com/374d9112c26cc1098d9e7e11b5ca49fa.png
---
## What is ControlNet?

Roughly speaking, diffusion models learn the relationship between "noise" and "images" so that they can restore images from noise.

What if we added **"another piece of information corresponding to the image"** along with the noise?

- If we learn the relationship between line art and colored illustrations
  - → Just by passing line art, it automatically colors it
- If we learn the relationship between stick figures (pose images) and photos of people
  - → Just by passing a stick figure, you can create an image of a person doing that pose

We can create such AI.

In this way, **ControlNet** is one of the mechanisms for controlling generation results using "additional image conditions (pose, line art, depth, etc.)" as clues.

---

## Typical Types of ControlNet

The "additional information" that ControlNet can handle can be increased as much as ideas allow, but there are certain patterns in commonly used ones.
I will list only the representative ones.

### openpose (Pose / Stick Figure)
Specifies the pose of a person or character with a stick figure or skeleton.

![](https://gyazo.com/637abbf2514e4c973b519053ae5809cd){gyazo=image} ![](https://gyazo.com/aa98af3564647910d9c8b647a9ecbd16){gyazo=image}

### depth (Depth Map)
Fixes the composition and depth using a depth map.

![](https://gyazo.com/0c12343e13526e4ac28edf9258e5ad23){gyazo=image} ![](https://gyazo.com/f9fa9577d3e0569f18057da32c50c95a){gyazo=image}

### scribble (Doodle)
Passes only a rough doodle and generates an image based on it.

![](https://gyazo.com/add872b3de994b2b07852f0304ca9d47){gyazo=image} ![](https://gyazo.com/277213578f705e57a2c9a90adaf135c5){gyazo=image}

### lineart / anime (Line Art)
Passes line art and generates coloring.

![](https://gyazo.com/5ddbfb2110194fca853a74641efd4f87){gyazo=image} ![](https://gyazo.com/6905030224a42fdc28d2c85cf431b0a4){gyazo=image}

### inpaint (For Inpainting)
Naturally fills in masked areas.

![](https://gyazo.com/69794d94d649836b33e3110b57bd9272){gyazo=image} ![](https://gyazo.com/18ae31a6d8972fdb966f49275248dd3e){gyazo=image}

Besides these, there are various variations such as edge extraction (Canny), segmentation, QR codes, etc., but any ControlNet can be created as long as "images" and "corresponding representations" can be prepared.

---

## Instruction-Based Image Editing

In recent image editing models, cases where things traditionally done with ControlNet are treated as "[Instruction-Based Image Editing](/en/ai-capabilities/instruction-based-image-editing/)" are increasing.

Instruction-based image editing allows image editing by giving instructions such as "zoom out" or "make it night" to the given image.

This means that ControlNet-like operations can also be treated as "image editing."

- Pose image + "Draw a character in black clothes with this pose"
- Depth map + "Make it a night view photo with the same composition"
- Rough image + "Make this rough sketch into a beautiful illustration"
