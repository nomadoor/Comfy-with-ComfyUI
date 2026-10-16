---
layout: page.njk
lang: en
section: basic-workflows
slug: detailer
navId: detailer
title: "Detailer"
created: 2025-12-09
updated: 2026-03-02
summary: "Cropping out just a small face or detail and inpainting it"
seoTitle: "Detailer in ComfyUI: Fix Small Faces and Details"
seoDescription: "Fix small, broken faces and details by cropping and redrawing them: a manual detailer with Inpaint Crop and Stitch, then automated with object detection."
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "/media/basic-workflows/detailer/legacy_gyazo_5904f9e96c234cd6bec18b10af263838.png"
tags: ["upscale-restoration"]
---

## What is Detailer?

![](/media/basic-workflows/detailer/legacy_gyazo_eb9c93e225419a1fe7574451d7cd94e1.png){media=image}

Stable Diffusion 1.5 works best with images around 512-768px.
If you draw a full-body shot at that resolution, each person's "face" only gets about 30-50px.

Resolution is part of the problem, but the face is also just tiny relative to the whole image,
so for the AI it becomes overly "fiddly work." Just like people, AI isn't good at fiddly work.

So someone had an idea: why not just cut out the face, redraw it, and paste it back into the original image?

This sequence of **"crop → enlarge → inpaint → paste back into the original"** is called a **Detailer**.

---

## Why is Detailer necessary?

You might think, "Why not just upscale the whole image and inpaint it?"

However, the computational cost of inpainting is determined by the **size of the original image**, not the size of the mask.
With a 4K image, even if you only want to repaint the face, you pay for computing the entire 4K image, which is very wasteful.

A Detailer crops out only the area around what you want to inpaint, so nothing is wasted.

---

## Custom Node

- [lquesada/ComfyUI-Inpaint-CropAndStitch](https://github.com/lquesada/ComfyUI-Inpaint-CropAndStitch)

> [!NOTE]
> Most people use the Detailer node from the Impact Pack.
> It does more, since it can automate everything up to object detection, but it has lots of its own parameters and is hard to learn, so I'll cover it separately.

---

## Mask and Crop Region

First, let's go over the difference between the mask and the crop region.

![](/media/basic-workflows/detailer/legacy_gyazo_e52ea814ccd051de4c939bb7e90eb941.png){media=image}

- Mask: The part you actually want to redraw (the face itself, etc.)
- Crop region: A "working canvas" made by expanding the mask or BBOX a little

A Detailer is inpainting done only within this crop region.


## ✂️ Inpaint Crop

![](/media/basic-workflows/detailer/legacy_gyazo_52c85301e868fe14f7bb729508206078.png){media=image}

[](/workflows/basic-workflows/detailer/inpaint_crop_improved.json)

As you can see from the workflow, when you pass in a **mask + original image**, it automatically builds a crop region from the mask with a bit of margin added, and resizes just that part to the size you specify.

There are quite a few parameters, but usually you only need to pay attention to these.

| Parameter Name         | Role/Meaning                                                                 |
|------------------------|------------------------------------------------------------------------------|
| `mask_fill_holes`      | Automatically fills small holes (missed spots) in the mask                   |
| `mask_expand_pixels`   | Expands the boundary of the mask outward by specified pixels                 |
| `mask_invert`          | Inverts the mask                                                             |
| `mask_blend_pixels`    | Blurs the mask boundary.                                                     |
| 🔥`context_from_mask_extend_factor` | Sets how much margin to add, as a multiplier, when building the crop region from the mask |
| 🔥`output_target_width`  | Output width after cropping (pixels). For example, the width of the face canvas |
| 🔥`output_target_height` | Output height after cropping (pixels). For example, the height of the face canvas |
| `output_padding`       | Adds padding when needed so the resolution is a multiple of this value |

---

## ✂️ Inpaint Stitch (Improved)

![](/media/basic-workflows/detailer/legacy_gyazo_c210a482208c8932e252b770b8b856bf.png){media=image}

[](/workflows/basic-workflows/detailer/inpaint_stitch_improved.json)

The `✂️ Inpaint Stitch (Improved)` node puts the edited crop back where it came from.

Only the masked part is written over the original image.

---

## Manual Detailer with Inpaint Crop and Stitch

Now let's actually try a Detailer.
That said, all you do is add it to the [inpainting](/en/basic-workflows/sd15-inpainting/) workflow.

![](/media/basic-workflows/detailer/legacy_gyazo_4246aded675f5267c9b5685486791390.png){media=image}

[](/workflows/basic-workflows/detailer/detailer_inpaint_crop.json)

- 🟩 Adjust `output_target_width/height` to suit the base model.
  - This one uses SD1.5, so 512px.
- 🟥 This isn't directly about Detailers, but Inpaint Crop outputs a "mask with blurred edges," so it pairs really well with [Differential Diffusion](/en/basic-workflows/differential-diffusion/), which can take advantage of that.

---

## Combining with Object Detection

Let's automate things a little by generating the face mask automatically.

![](/media/basic-workflows/detailer/legacy_gyazo_d65f393b285ec6c84a17a6a6ef438f14.png){media=image}

[](/workflows/basic-workflows/detailer/detailer_inpaint_crop_sam3.json)

- 🟦 Create a face mask using SAM 3.

That's all there is to Detailer basics, so you should be able to put it to good use now.
But if you want to detect several people in an image and process them all in one go... you'll need ImpactPack.

→ [Detailer ImpactPack (WIP)](still)

---

{% outputs "samples" %}
![](/media/basic-workflows/detailer/legacy_gyazo_7564534ad31facc3d0c91bc36606c930.jpg){media=image}
{% endoutputs %}
