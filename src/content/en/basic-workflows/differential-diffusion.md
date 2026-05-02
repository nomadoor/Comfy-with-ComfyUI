---
layout: page.njk
lang: en
section: basic-workflows
slug: differential-diffusion
navId: differential-diffusion
title: "Differential Diffusion"
created: 2025-12-07
updated: 2026-03-02
summary: "Control the amount of change with mask density"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/1f32a3d04b7ee26518803718151fc1d0.png"
---

## What is Differential Diffusion?

In normal inpainting, the mask is treated as a binary choice of "white or black".
If it becomes even slightly gray, it is considered "not masked" and only pure white parts are inpainted.

Differential Diffusion is a mechanism to **continuously change the strength of denoise according to the density of the mask**.
Thanks to this, it is possible to perform inpainting with different amounts of change for each location in a single sampling.

> It is assumed that you have read [inpainting](/en/basic-workflows/sd15-inpainting/) first.
> For how to create masks, please refer to [Mask Operations](/en/data-utilities/mask-ops/) and [AI Mask Generation](/en/data-utilities/ai-mask-generation/).

---

## Usage

Just prepare a gradient mask and add the `Differential Diffusion` node to the inpainting workflow.

### workflow

![](https://gyazo.com/32341a2b91def8997072eb24dde93cce){gyazo=image}

[](/workflows/basic-workflows/differential-diffusion/SD1.5_Differential_Diffusion.json)

- The base is a workflow using the `Set Latent Noise Mask` node.
  - Of course, it can also be used in workflows using inpainting models or ControlNet models.
- 🟩 Add the `Differential Diffusion` node

The whiter part of the mask relies more on the prompt, and the darker part leaves more of the "original picture".

---

## Interesting Uses

### Changing the Amount of Change for Each Part

The mask does not have to be a gradient.
By **changing the density for each location within a single mask**, you can specify different amounts of change for each part in a single sampling.

![](https://gyazo.com/4b3d0506456a4f1dc8aa062d4e445b17){gyazo=image}

[](/workflows/basic-workflows/differential-diffusion/SD1.5_Differential_Diffusion_multi-obj.json)

- Draw different mask densities for each part you want to change (e.g., light gray for the face, white for the background, etc.)

### Blending Mask Boundaries

A common problem with inpainting is that the boundaries of the mask appear clearly.
Let's blend this boundary naturally by combining Differential Diffusion and a blurred mask.

![](https://gyazo.com/e54a8d82e7dca29bf6ab19fdb20c3354){gyazo=image}

[](/workflows/basic-workflows/differential-diffusion/SD1.5_Differential_Diffusion_blur.json)

- 🟪 This time, incorporate it into a workflow using an inpainting model.
- Blur the boundaries of the mask with the `Gaussian Blur Mask` node ([ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack)).
  - Since blurring effectively shrinks the mask, make the mask slightly larger as a pre-processing step.

### Using Depth Map as Mask

A depth map is represented by a black and white gradient.
In other words, it can be used as a mask compatible with Differential Diffusion.

![](https://gyazo.com/ac52958c32bb143910151029c53707d1){gyazo=image}

[](/workflows/basic-workflows/differential-diffusion/SD1.5_Differential_Diffusion_depthmap.json)

- 🟦 Create a depth map with Depth Anything V2.
  - Since this is an IMAGE, convert it to a mask with the `Convert Image to Mask` node.

Honestly, performance is lacking with SD1.5, but using a depth map as a mask itself is a favorite method.

---

## Sample Images

![](https://gyazo.com/8d2eb48340cf6f6f99e539e11517d6a2){gyazo=image} ![](https://gyazo.com/d8cd78b75de91ed4e9a1da1eedfcf21d){gyazo=image} ![](https://gyazo.com/ff958820180efd9b316cb42ddd9c0276){gyazo=image} ![](https://gyazo.com/2d0d14ad85109598f389e5ac0ad7b85f){gyazo=image}
