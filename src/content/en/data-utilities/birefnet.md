---
layout: page.njk
lang: en
section: data-utilities
slug: birefnet
navId: birefnet
title: "BiRefNet"
created: 2026-05-30
updated: 2026-05-30
summary: "Background removal and mask generation with BiRefNet"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## What is BiRefNet?

BiRefNet is a model used for background removal and matting.

Formally, it is a model for **Dichotomous Image Segmentation (DIS)**, which means splitting an image into **foreground** and **background**.

It is not like SAM, where you specify "this point", "this box", or "this object" to create a mask. Instead, it is good at producing high-quality cutout masks from subjects with complex details, such as hair or plants.

---

## Model Download

- [birefnet.safetensors](https://huggingface.co/Comfy-Org/BiRefNet/blob/main/background_removal/birefnet.safetensors) (444 MB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂background_removal/
        └── birefnet.safetensors
```

---

## workflow

### Background Removal

![](https://gyazo.com/0c2c21a3dd7088141b67a66b44c80b3a){gyazo=image}

[](/workflows/data-utilities/birefnet/BiRefNet.json)

- Use `Load Background Removal Model` to load `birefnet.safetensors`.
- Input the image and model into `Remove Background` to output a background-removal `MASK`.
