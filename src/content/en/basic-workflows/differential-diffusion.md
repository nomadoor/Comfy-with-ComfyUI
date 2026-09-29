---
layout: page.njk
lang: en
section: basic-workflows
slug: differential-diffusion
navId: differential-diffusion
title: "Differential Diffusion"
created: 2025-12-07
updated: 2026-08-26
summary: "Control the amount of change with mask intensity"
seoTitle: "Differential Diffusion in ComfyUI: Mask-Based Denoise"
seoDescription: "Differential Diffusion sets denoise per area from mask intensity. Vary change by region, blend boundaries, and use depth maps as masks, with workflows."
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "/media/basic-workflows/differential-diffusion/legacy_gyazo_1f32a3d04b7ee26518803718151fc1d0.png"
---

## What is Differential Diffusion?

In normal inpainting, the white areas of the mask change while the black areas do not.

So does making an area gray change it just a little? Unfortunately, it does not give you that kind of control on its own.

That is where Differential Diffusion comes in.

It lets you **change denoise at each location according to the intensity of the mask**, so different areas can change by different amounts and blurred mask boundaries can work as expected.

> [!TIP]
> If you have not read [inpainting](/en/basic-workflows/sd15-inpainting/) yet, please start there.

---

## Usage

Add the `Differential Diffusion` node to an inpainting workflow, then give the mask different shades.

### workflow

![](/media/basic-workflows/differential-diffusion/legacy_gyazo_32341a2b91def8997072eb24dde93cce.png){media=image}

[](/workflows/basic-workflows/differential-diffusion/sd1_5_differential_diffusion.json)

- 🟩 Add the `Differential Diffusion` node
- This example is based on a workflow using the `Set Latent Noise Mask` node.
  - It also works with workflows using inpainting models or ControlNet models.

Whiter areas change more, while darker areas retain more of the original image.

---

## Using the Mask

### Change Different Areas by Different Amounts

The mask does not need to use a smooth gradient.

By **using different shades for different areas in a single mask image**, you can give each area a different amount of change in one sampling pass.

![](/media/basic-workflows/differential-diffusion/legacy_gyazo_4b3d0506456a4f1dc8aa062d4e445b17.png){media=image}

[](/workflows/basic-workflows/differential-diffusion/sd1_5_differential_diffusion_multi_obj.json)

- Paint each area you want to change with a different shade (for example, light gray for the face and white for the background)

### Soften the Boundaries

A common problem with inpainting is a clearly visible mask boundary.

Combine Differential Diffusion with a blurred mask to blend the boundary more naturally.

![](/media/basic-workflows/differential-diffusion/legacy_gyazo_e54a8d82e7dca29bf6ab19fdb20c3354.png){media=image}

[](/workflows/basic-workflows/differential-diffusion/sd1_5_differential_diffusion_blur.json)

- 🟪 This time, incorporate it into a workflow using an inpainting model.
- 🟨 Blur the mask boundary with the `Gaussian Blur Mask` node ([ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack))
  - Blurring effectively shrinks the mask, so enlarge it slightly beforehand.

### Use a Depth Map as a Mask

A depth map is represented as a black-to-white gradient.

This means it can be used directly as a Differential Diffusion mask.

![](/media/basic-workflows/differential-diffusion/legacy_gyazo_ac52958c32bb143910151029c53707d1.png){media=image}

[](/workflows/basic-workflows/differential-diffusion/sd1_5_differential_diffusion_depthmap.json)

- 🟦 Create a depth map with Depth Anything V2 ([comfyui_controlnet_aux](https://github.com/Fannovel16/comfyui_controlnet_aux))
  - The output is an IMAGE, so convert it to a mask with the `Convert Image to Mask` node.
- Adjust its range with `RemapMaskRange` ([ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes))

Honestly, SD1.5 is not quite capable enough, but using a depth map as a mask is still one of my favorite methods.

---

## Sample Images

![](/media/basic-workflows/differential-diffusion/legacy_gyazo_8d2eb48340cf6f6f99e539e11517d6a2.png){media=image} ![](/media/basic-workflows/differential-diffusion/legacy_gyazo_d8cd78b75de91ed4e9a1da1eedfcf21d.png){media=image} ![](/media/basic-workflows/differential-diffusion/legacy_gyazo_ff958820180efd9b316cb42ddd9c0276.png){media=image} ![](/media/basic-workflows/differential-diffusion/legacy_gyazo_2d0d14ad85109598f389e5ac0ad7b85f.png){media=image}
