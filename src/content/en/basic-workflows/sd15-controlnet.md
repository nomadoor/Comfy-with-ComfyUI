---
layout: page.njk
lang: en
section: basic-workflows
slug: sd15-controlnet
navId: sd15-controlnet
title: "ControlNet"
created: 2025-12-08
updated: 2026-08-26
summary: "Control image generation with poses and line art"
seoTitle: "ControlNet in ComfyUI with Stable Diffusion 1.5"
seoDescription: "Control generation with poses and line art using ControlNet on Stable Diffusion 1.5: the Scribble workflow, start and end percent, and the main types."
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
tags: ["controlnet"]
hero:
  image: "/media/basic-workflows/sd15-controlnet/legacy_gyazo_81753915732cf767995f1b35ac827b5d.png"
---

## What is ControlNet?

Generative AI is good at learning relationships between all kinds of things.
In text2image, we teach it the "noise ↔ image" relationship, but the same works with things other than noise.

- Train on **line art ↔ image** pairs → automatic coloring from line art
- Train on **stick figure ↔ image** pairs → image generation from a specified pose
- Train on **depth map ↔ image** pairs → image generation from depth information

**ControlNet** is one of the techniques that make this possible.

---

## SD1.5 × ControlNet Scribble

There are countless kinds of ControlNet, but let's start with "scribble".
The scribble model is a ControlNet that generates images from "rough doodles".

### Download ControlNet Model

- [control_v11p_sd15_scribble_fp16.safetensors](https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/blob/main/control_v11p_sd15_scribble_fp16.safetensors)
- ```
  📂ComfyUI/
    └── 📂models/
        └── 📂controlnet/
            └── control_v11p_sd15_scribble_fp16.safetensors
  ```

### workflow

![](/media/basic-workflows/sd15-controlnet/legacy_gyazo_885feaa8a1857c09ce11977ad9d424c2.png){media=image}

[](/workflows/basic-workflows/sd15-controlnet/sd1_5_controlnet_scribble.json)

- 🟩 Feed the ControlNet model and the scribble image into the `Apply ControlNet` node.
- 🟨 You won't get an error if the ControlNet image and the generated image are different sizes, but keep them the same.

> The scribble model is optimized for "white lines drawn on a black background".
> Note that black lines on a white background often don't work well.

- Sample Image
  - ![](/media/basic-workflows/sd15-controlnet/legacy_gyazo_fd112e311d4e0503fbb4df2044fc9325.png){media=image}

---

## Balancing ControlNet Control

Diffusion models naturally produce **their best quality when they generate without constraints**.
But complete freedom isn't useful, so we steer them with **Conditioning** such as text and ControlNet.
Too much control lowers quality —— and that's just as true for text prompts and LoRA.

So how do you balance control and quality?

### start_percent / end_percent

![](/media/ai-capabilities/diffusion-models/legacy_gyazo_3c82ca8a7dcb51f2475d0451de727783.mp4){media=loop}

In sampling, the rough shape is decided early on, and the details are drawn in during the second half.

Many ControlNets (pose / depth / scribble, etc.) are the **shape-defining** kind of control.
Which means you could argue that **ControlNet only needs to be active in the early stages**.

In `Apply ControlNet`, you can set **over which range** ControlNet takes effect.
- `start_percent`: when it starts taking effect
- `end_percent`: when it stops taking effect

The lower you set `end_percent`, the more freedom the model gets back in the second half, so you can raise quality while keeping the shape.

Combine `strength` with `start_percent / end_percent` to find a balance that "doesn't constrain too much, and doesn't fall apart".

---

## Main ControlNet Types

The "concepts" you can pair with images are as countless as the stars.
Here I'll introduce just the main ones.

### Download Models

- [comfyanonymous/ControlNet-v1-1_fp16_safetensors](https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/tree/main)
- [monster-labs/control_v1p_sd15_qrcode_monster](https://huggingface.co/monster-labs/control_v1p_sd15_qrcode_monster/tree/main)

### List

{% mediaRow img="/media/basic-workflows/sd15-controlnet/legacy_gyazo_be3200558982f020a124d2bc68276c16.png {media=image}", width=60, align="left" %}
### Canny
- Redraws in a different style while keeping the outline of the photo or image.
{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/sd15-controlnet/legacy_gyazo_debe9e414b688be1fa07bf01101ea2e0.png {media=image}", width=60, align="left" %}
### Lineart
- Similar to Canny, but more for illustrations.
- Used for coloring line drawings, etc.
{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/sd15-controlnet/legacy_gyazo_cbe33c8ba39da19e249634a6e46ec13b.png {media=image}", width=60, align="left" %}
### Depth
- Uses a depth map (near/far information) to generate while keeping the depth and composition of the original image.
- Good for buildings, landscapes, and other cases where you don't want to lose the sense of depth.
{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/sd15-controlnet/legacy_gyazo_ae9a4fd7513b17114e2317b0da8dc14c.png {media=image}", width=60, align="left" %}
### Normal
- Uses a normal map to control how light falls and the sense of volume.
{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/sd15-controlnet/legacy_gyazo_8df713d0e8415ada994ad7c5f91d8ba9.png {media=image}", width=60, align="left" %}
### Pose
- Generates people/characters in the same pose from "stick figure pose information" extracted with OpenPose, etc.
{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/sd15-controlnet/legacy_gyazo_fe7da06340c74791241cac5a482531bb.png {media=image}", width=60, align="left" %}
### Inpaint
- A model used when you want to redraw only a part of the image.
- Naturally redraws just the area you mask (removing unwanted objects, swapping small items, etc.).
{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/sd15-controlnet/legacy_gyazo_ea6af6e0edcd04ffe43f032b8a10b4fb.png {media=image}", width=60, align="left" %}
### QR Code Monster
- Creates an image that can be read as a QR code.
- It isn't limited to QR codes: you can also start from a "black-and-white pattern image" and turn it into any design you like.
{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/sd15-controlnet/legacy_gyazo_65e5e0ed5aaf2c87d363e6eb37e7d33b.png {media=image}", width=60, align="left" %}
### Tile
- Creates a clean image from a heavily blurred or low-resolution image.
- It works on its own, but in practice it's often combined with "super-resolution upscaling" such as Ultimate SD Upscale.
{% endmediaRow %}


## ControlNet Union

There is also a type of ControlNet called **ControlNet Union**.

It doesn't do any special new task. Instead, it combines ControlNets that used to require one model per task, such as Scribble, Pose, and Depth, into a single model.

You can use several tasks without swapping models, so give it a try if you come across one.
