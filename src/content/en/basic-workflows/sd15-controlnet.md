---
layout: page.njk
lang: en
section: basic-workflows
slug: sd15-controlnet
navId: sd15-controlnet
title: "ControlNet"
summary: "Controlling image generation using poses and line drawings"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/374d9112c26cc1098d9e7e11b5ca49fa.png"
---

## What is ControlNet?

The essence of Generative AI is **learning the "correspondence between two things"**.
In text2image, it learns the relationship "Noise ↔ Image", but the same can be done with things other than noise.

- Learn pairs of **Line Drawing ↔ Image** → Automatic coloring from line drawing
- Learn pairs of **Stick Figure ↔ Image** → Image generation with pose specification
- Learn pairs of **Depth Map ↔ Image** → Image generation from depth information

**ControlNet** is one of the technologies that realize this.

---

## SD1.5 × ControlNet Scribble

There are countless types of ControlNet, but let's try "scribble" first.
The scribble model is a ControlNet that generates images based on "rough doodles".

### Downloading ControlNet Model

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

- 🟩 Input ControlNet model and scribble image into `Apply ControlNet` node.
- 🟨 It is not an error if the ControlNet image and the generated image size are different, but let's keep them the same size.

> The scribble model is optimized for "white lines drawn on black background".
> Be careful as it often does not react well to black lines drawn on white background.

- Sample Image
  - ![](https://gyazo.com/fd112e311d4e0503fbb4df2044fc9325){gyazo=image}

---

## Balance of ControlNet Control

Diffusion models naturally have the **highest quality when generating without restriction**.
However, since it is useless if it is completely free, we control it with **Conditioning** such as text and ControlNet.
If the control is too strong, the quality drops —— this is the same for text prompts and LoRA.

So, how should we balance control and quality?

### start_percent / end_percent

![](https://gyazo.com/3c82ca8a7dcb51f2475d0451de727783){gyazo=loop}

In sampling, the rough shape is decided in the early stages, and details are drawn in the latter half.

Many ControlNets (pose / depth / scribble, etc.) are **types of control that determine the shape**.
This means that we can consider **applying ControlNet only in the early stages**.

In `Apply ControlNet`, you can specify **in which interval** ControlNet is effective.
- `start_percent`: Timing to start taking effect
- `end_percent`: Timing to stop taking effect

The lower `end_percent` is, the more the model's freedom returns in the second half, allowing quality improvement while maintaining the shape.

Combine `strength` and `start_percent / end_percent` to find a balance of "not too restricted, not too broken".

---

## Main Types of ControlNet

There are as many "concepts" that can be mapped to images as there are stars.
Here we will introduce only typical ones.

### Downloading Models

- [comfyanonymous/ControlNet-v1-1_fp16_safetensors](https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/tree/main)
- [monster-labs/control_v1p_sd15_qrcode_monster](https://huggingface.co/monster-labs/control_v1p_sd15_qrcode_monster/tree/main)

### List

{% mediaRow img="https://gyazo.com/be3200558982f020a124d2bc68276c16 {gyazo=image}", width=60, align="left" %}
### Canny
- Redraws in a different style while maintaining the contours of the photo or image.
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/debe9e414b688be1fa07bf01101ea2e0 {gyazo=image}", width=60, align="left" %}
### Lineart
- Similar to Canny, but more for illustrations.
- Used for line art coloring, etc.
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/cbe33c8ba39da19e249634a6e46ec13b {gyazo=image}", width=60, align="left" %}
### Depth
- Generates while maintaining the depth and composition of the original image using a depth map (foreground/background information).
- Suitable for cases where you do not want to destroy the three-dimensional effect, such as buildings and landscapes.
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/ae9a4fd7513b17114e2317b0da8dc14c {gyazo=image}", width=60, align="left" %}
### Normal
- Controls how light hits and the three-dimensional effect using a normal map.
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/8df713d0e8415ada994ad7c5f91d8ba9 {gyazo=image}", width=60, align="left" %}
### Pose
- Generates images of people/characters with the same pose from "stick figure pose information" extracted by OpenPose, etc.
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/fe7da06340c74791241cac5a482531bb {gyazo=image}", width=60, align="left" %}
### Inpaint
- A model used when you want to redraw only a part of an image.
- You can naturally rewrite only the range specified by the mask (erasing unnecessary objects, replacing small items, etc.).
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/ea6af6e0edcd04ffe43f032b8a10b4fb {gyazo=image}", width=60, align="left" %}
### QR Code Monster
- Creates an image that can be read as a QR code.
- Not limited to QR codes, it can also be used to transform a "black and white pattern image" into a favorite picture.
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/65e5e0ed5aaf2c87d363e6eb37e7d33b {gyazo=image}", width=60, align="left" %}
### Tile
- A model suitable for adding details and increasing resolution from highly blurry images or low-resolution images.
- Although it can be used alone, it is often used in combination with "super-resolution upscale" like Ultimate SD Upscale.
{% endmediaRow %}


## ControlNet Union

Talking about Flux and later, "ControlNet Union" is a model that integrates basic ControlNets such as Scribble, Pose, and Depth into one model.

It allows you to automatically recognize the features of the input image (pose, lines, depth, etc.) and reproduce the behavior of ControlNet close to it collectively.
