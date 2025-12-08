---
layout: page.njk
lang: en
section: basic-workflows
slug: sd15-controlnet
navId: sd15-controlnet
title: "ControlNet"
summary: "Controlling image generation using poses and line drawings"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
tags: ["controlnet"]
hero:
  image: "https://i.gyazo.com/374d9112c26cc1098d9e7e11b5ca49fa.png"
---

## What is ControlNet?

The essence of generative AI is **learning the "correspondence between two things"**.
In text2image, it learns the relationship "Noise ↔ Image", but the same can be done with things other than noise.

- Learn **Line drawing ↔ Image** pair → Automatic coloring from line drawing
- Learn **Stick figure ↔ Image** pair → Image generation by specifying pose
- Learn **Depth map ↔ Image** pair → Image generation from depth information

**ControlNet** is one of the technologies that realize this.

---

## SD1.5 × ControlNet Scribble

There are countless types of ControlNet, but let's start by trying "scribble".
The scribble model is a ControlNet that generates images based on "rough doodles".

### Download ControlNet Model

- [control_v11p_sd15_scribble_fp16.safetensors](https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/blob/main/control_v11p_sd15_scribble_fp16.safetensors)
- ```
  📂ComfyUI/
    └── 📂models/
        └── 📂controlnet/
            └── control_v11p_sd15_scribble_fp16.safetensors
  ```

### workflow

![](https://gyazo.com/885feaa8a1857c09ce11977ad9d424c2){gyazo=image}

[](/workflows/basic-workflows/sd15-controlnet/SD1.5_ControlNet_scribble.json)

- 🟩 Input the ControlNet model and scribble image into the `Apply ControlNet` node.
- 🟨 It is not an error if the ControlNet image and the generated image size are not the same, but let's make them the same size.

> The scribble model is optimized for "white lines drawn on a black background".
> Please note that black lines drawn on a white background often do not react well.

- Sample Image
  - ![](https://gyazo.com/fd112e311d4e0503fbb4df2044fc9325){gyazo=image}

---

## Balance of ControlNet Control

Diffusion models originally have the **highest quality when generating without constraints**.
However, it is useless if it is completely free, so we control it with **Conditioning** such as text and ControlNet.
If the control is too strong, the quality drops —— this is the same for text prompts and LoRA.

So, how should we balance control and quality?

### start_percent / end_percent

![](https://gyazo.com/3c82ca8a7dcb51f2475d0451de727783){gyazo=loop}

In sampling, the rough shape is decided in the early stages, and details are drawn in the latter half.

Many ControlNets (pose / depth / scribble etc.) are controls of the **type that determines shape**.
This means that we can think **it is enough to apply ControlNet only in the early stages**.

In `Apply ControlNet`, you can specify **in which interval** ControlNet works.
- `start_percent`: Timing to start working
- `end_percent`: Timing to finish working

As you lower `end_percent`, the freedom of the model returns in the second half, and quality can be improved while maintaining the shape.

Combine `strength` (strength) and `start_percent / end_percent` to find a balance of "not too bound, not too broken".

---

## Main ControlNet Types

There are as many "concepts" that can be associated with images as there are stars.
Here we will introduce only representative ones.

### Download Models

- [comfyanonymous/ControlNet-v1-1_fp16_safetensors](https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/tree/main)
- [monster-labs/control_v1p_sd15_qrcode_monster](https://huggingface.co/monster-labs/control_v1p_sd15_qrcode_monster/tree/main)

### List

{% mediaRow img="https://gyazo.com/be3200558982f020a124d2bc68276c16 {gyazo=image}", width=60, align="left" %}
### Canny
- Redraws in a different style while keeping the outline of the photo or image.
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/debe9e414b688be1fa07bf01101ea2e0 {gyazo=image}", width=60, align="left" %}
### Lineart
- Similar to Canny, but more for illustrations.
- Used for coloring line drawings, etc.
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/cbe33c8ba39da19e249634a6e46ec13b {gyazo=image}", width=60, align="left" %}
### Depth
- Generates while maintaining the depth and composition of the original image using a depth map (information on front / back).
- Suitable when you do not want to break the three-dimensional effect of buildings or landscapes.
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/ae9a4fd7513b17114e2317b0da8dc14c {gyazo=image}", width=60, align="left" %}
### Normal
- Controls how light hits and three-dimensionality using a normal map.
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/8df713d0e8415ada994ad7c5f91d8ba9 {gyazo=image}", width=60, align="left" %}
### Pose
- Generates images of people/characters with the same pose from "stick figure pose information" extracted by OpenPose etc.
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/fe7da06340c74791241cac5a482531bb {gyazo=image}", width=60, align="left" %}
### Inpaint
- A model used when you want to redraw only a part of the image.
- You can redraw naturally only the range specified by the mask (erasing unnecessary objects, replacing small items, etc.).
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/ea6af6e0edcd04ffe43f032b8a10b4fb {gyazo=image}", width=60, align="left" %}
### QR Code Monster
- Creates an image that can be read as a QR code.
- Not limited to QR codes, it can also be used to transform "black and white pattern images" into any pattern you like.
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/65e5e0ed5aaf2c87d363e6eb37e7d33b {gyazo=image}", width=60, align="left" %}
### Tile
- Creates a beautiful image from a highly blurred image or low-resolution image.
- Can be used alone, but in practice, it is often used in combination with "super-resolution upscaling" such as Ultimate SD Upscale.
{% endmediaRow %}


## ControlNet Union

This is a story since Flux, but "ControlNet Union" is a model that incorporates basic ControlNets such as Scribble, Pose, and Depth into a single model.

It is enough to consider it as a model that automatically recognizes the features (pose, line, depth, etc.) of the input image and tries to reproduce the behavior of ControlNet closer to it collectively.
