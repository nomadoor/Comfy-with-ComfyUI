---
layout: page.njk
lang: en
section: ai-capabilities
slug: controlnet
navId: controlnet
title: ControlNet Techniques
created: 2025-12-01
updated: 2026-03-02
summary: Controlling image generation with extra inputs like poses and line art
seoTitle: "What Is ControlNet? Guide Generation with Poses and Lines"
seoDescription: "How ControlNet steers generation with poses, line art, or depth maps: the main types (openpose, depth, scribble, lineart, inpaint) and instruction-based editing."
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: https://i.gyazo.com/374d9112c26cc1098d9e7e11b5ca49fa.png
---
## What is ControlNet?

Roughly speaking, a diffusion model learns the relationship between noise and images, so it can recover an image from noise.

So what happens if, along with the noise, you also give it **"another piece of information that corresponds to the image"**?

- Train it on how line art relates to finished, colored illustrations
  - → Give it line art, and it colors it for you
- Train it on how stick figures (pose images) relate to photos of people
  - → Give it a stick figure, and it makes an image of a person in that pose

You can build AI like that.

**ControlNet** is one such mechanism: it controls the output using "additional image conditions" (pose, line art, depth, etc.) as guides.

---

## Typical Types of ControlNet

There's no real limit to the kinds of "additional information" ControlNet can use, as long as someone has the idea, but the commonly used ones fall into a few patterns.
Here are just the main ones.

### openpose (Pose / Stick Figure)
Sets the pose of a person or character with a stick figure or skeleton.

![](/media/ai-capabilities/controlnet/legacy_gyazo_637abbf2514e4c973b519053ae5809cd.png){media=image} ![](/media/ai-capabilities/controlnet/legacy_gyazo_aa98af3564647910d9c8b647a9ecbd16.png){media=image}

### depth (Depth Map)
Locks in the composition and depth using a depth map.

![](/media/ai-capabilities/controlnet/legacy_gyazo_0c12343e13526e4ac28edf9258e5ad23.png){media=image} ![](/media/ai-capabilities/controlnet/legacy_gyazo_f9fa9577d3e0569f18057da32c50c95a.png){media=image}

### scribble (Doodle)
Give it just a rough doodle and it generates an image from that.

![](/media/ai-capabilities/controlnet/legacy_gyazo_add872b3de994b2b07852f0304ca9d47.png){media=image} ![](/media/ai-capabilities/controlnet/legacy_gyazo_277213578f705e57a2c9a90adaf135c5.png){media=image}

### lineart / anime (Line Art)
Give it line art and it generates the coloring.

![](/media/ai-capabilities/controlnet/legacy_gyazo_5ddbfb2110194fca853a74641efd4f87.png){media=image} ![](/media/ai-capabilities/controlnet/legacy_gyazo_6905030224a42fdc28d2c85cf431b0a4.png){media=image}

### inpaint (For Inpainting)
Naturally fills in masked areas.

![](/media/ai-capabilities/controlnet/legacy_gyazo_69794d94d649836b33e3110b57bd9272.png){media=image} ![](/media/ai-capabilities/controlnet/legacy_gyazo_18ae31a6d8972fdb966f49275248dd3e.png){media=image}

There are many other variations too, such as edge detection (Canny), segmentation, and QR codes. In fact, you can build any kind of ControlNet as long as you can prepare images and their corresponding representations.

---

## Instruction-Based Image Editing

With recent image editing models, more and more of what used to be done with ControlNet is now handled as "[instruction-based image editing](/en/ai-capabilities/instruction-based-image-editing/)."

Instruction-based image editing lets you edit an image just by giving instructions like "zoom out" or "make it night."

That means ControlNet-style tasks can be treated as "image editing" too.

- Pose image + "Draw a character in black clothes with this pose"
- Depth map + "Keep the same composition and make it a night-time photo"
- Rough sketch + "Turn this rough sketch into a clean illustration"
