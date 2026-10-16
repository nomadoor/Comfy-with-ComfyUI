---
layout: page.njk
lang: en
section: basic-workflows
slug: reactor
navId: reactor
title: "ReActor"
created: 2025-12-09
updated: 2026-03-02
summary: "FaceSwap using ReActor"
seoTitle: "ReActor in ComfyUI: Face Swap with One Photo"
seoDescription: "Swap faces in images and videos from one photo with ReActor in ComfyUI: installation, inswapper vs. HyperSwap, and the NSFW filter."
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "/media/basic-workflows/reactor/legacy_gyazo_c75a0142055d05c154f7d8cf03b3ca56.png"
tags: ["id-transfer"]
---

## What is ReActor?

**Face swap** has been around for years in the form of deepfakes, but back then you had to collect hundreds of face images of the same person and train on them.

ReActor (more precisely, its core, **InsightFace**) can swap the face in another image or video using just one face photo as a reference.

More flexible diffusion-based ID transfer methods have appeared since then, but ReActor is still widely used because it's relatively lightweight and, in a good way, inflexible and stable.

---

## Custom Node & Installation

- [Gourieff/ComfyUI-ReActor](https://github.com/Gourieff/ComfyUI-ReActor?tab=readme-ov-file#installation)

### Installation Method

This node is a bit tricky to set up: installing it from ComfyUI Manager alone won't make it work.

1. Install the ReActor node from **ComfyUI Manager**.
2. Run `install.bat` located in `ComfyUI/custom_nodes/ComfyUI-ReActor`.
3. **For Windows users**: This alone isn't enough; you also need to install **InsightFace** separately.
    - For details, see [How to install InsightFace](/en/notes/insightface-install/)
4. Restart ComfyUI.

---

## FaceSwap (inswapper)

For a basic FaceSwap, you just feed the "original image" and a "reference face image" into the ReActor node.

![](/media/basic-workflows/reactor/legacy_gyazo_bc67dfff78c431c688d8ec1a4937969e.png){media=image}

[](/workflows/basic-workflows/reactor/reactor_fast_face_swap.json)

- **`input_image`**
    - Connect the original image whose face you want to swap.
- **`source_image`**
    - Connect the reference face image (e.g., a single face photo).

### Key Parameters

- **`face_restore_model`**
    - If you select `GFPGANv1.3`, GFPGAN face restoration will be applied after FaceSwap.
    - `inswapper` resizes the face to a 128px square for processing, so details get lost easily on their own. That's why post-processing like this matters.
    - *That said, keep in mind that the face tends to end up looking flat and featureless.*
- **`detect_gender_input` / `detect_gender_source`**
    - Whether to automatically detect the gender of the input/source images.
    - If the result looks unnatural due to gender differences, try toggling these ON/OFF.
- **`input_faces_index`**
    - If there are multiple faces in the `input_image`, specify which face to target.
    - Think of `0` as the first face found, `1` as the second, and so on.
    - List several separated by commas, like `0,1`, to swap multiple people at once.
- **`source_faces_index`**
    - If there are multiple faces in the `source_image`, specify which face to use, similar to `input_faces_index`.

---

## Using Another FaceSwap Model (HyperSwap)

The `inswapper` model used above is fairly old, and on top of that, its developer has withheld the high-resolution version out of concern for its social impact.
There are several alternative models, but let's try **HyperSwap** developed by FaceFusion Labs.

Here is an example using `hyperswap_1a_256.onnx`.

### Model Download

1. Download [hyperswap_1a_256.onnx](https://huggingface.co/facefusion/models-3.3.0/blob/main/hyperswap_1a_256.onnx).
2. Place it in the following location:
    ```text
    📂ComfyUI/
      └── 📂models/
          └── 📂hyperswap/  <-- Create this folder
              └── hyperswap_1a_256.onnx
    ```

### Workflow Settings

![](/media/basic-workflows/reactor/legacy_gyazo_bab77e7c89d65dff9a4ebedb17a46375.png){media=image}

[](/workflows/basic-workflows/reactor/reactor_hyperswap.json)

- Change the `swap_model` of the ReActor node to `hyperswap_1a_256`.

---

## About NSFW Filter

To keep the repository from being taken down, ReActor has a built-in filter for NSFW images.
So if you use an image with NSFW content, it gets rejected.

I won't go into detail, but there are simple ways around it.
( [Detailer](/en/basic-workflows/detailer/) might come in handy... maybe. )
