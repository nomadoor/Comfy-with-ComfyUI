---
layout: page.njk
lang: en
section: basic-workflows
slug: reactor
navId: reactor
title: "ReActor"
summary: "FaceSwap using ReActor"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/c75a0142055d05c154f7d8cf03b3ca56.png"
tags: ["id-transfer"]
---

## What is ReActor?

**Face swap** (Deepfake) has existed for years, but back then, it required collecting hundreds of face images of the same person for training.

ReActor (more precisely, its core **InsightFace**) allows you to swap a face in an image or video using just **one single face photo** as a reference.

Although more flexible ID transfer methods based on diffusion models have appeared recently, ReActor is still widely used because it is "relatively lightweight" and "stable due to its lack of flexibility (in a good way)."

---

## Custom Node & Installation

- [Gourieff/ComfyUI-ReActor](https://github.com/Gourieff/ComfyUI-ReActor?tab=readme-ov-file#installation)

### Installation Method

This node is a bit tricky to install and often doesn't work just by installing it from ComfyUI Manager.

1. Install the ReActor node from **ComfyUI Manager**.
2. Run `install.bat` located in `ComfyUI/custom_nodes/ComfyUI-ReActor`.
3. **For Windows users**: This alone is usually not enough; you need to install **InsightFace** separately.
    - See details: [How to install InsightFace](/en/notes/insightface-install/)
4. Restart ComfyUI.

---

## FaceSwap (inswapper)

Basic FaceSwap simply involves inputting a "Source Image" and a "Reference Face Image" into the ReActor node.

![](https://gyazo.com/bc67dfff78c431c688d8ec1a4937969e){gyazo=image}

[](/workflows/basic-workflows/reactor/ReActor_Fast_Face_Swap.json)

- **`input_image`**
    - Connect the original image where you want to swap the face.
- **`source_image`**
    - Connect the reference face image (e.g., a single face photo).

### Key Parameters

- **`face_restore_model`**
    - If you select `GFPGANv1.3`, GFPGAN face restoration will be applied after FaceSwap.
    - Since `inswapper` resizes the face part to 128px square for processing, details are easily lost, so this post-processing is important.
    - *Note: It tends to give a somewhat "smooth/flat" impression.*
- **`detect_gender_input` / `detect_gender_source`**
    - Settings to automatically detect the gender of the input/source images.
    - If the result looks unnatural due to gender differences, try toggling these ON/OFF.
- **`input_faces_index`**
    - If there are multiple faces in the `input_image`, specify which face to target.
    - `0` is the first found face, `1` is the second, and so on.
    - You can specify multiple faces with comma separation like `0,1` to swap multiple people at once.
- **`source_faces_index`**
    - If there are multiple faces in the `source_image`, specify which face to use, similar to `input_faces_index`.

---

## Using Another FaceSwap Model (HyperSwap)

The `inswapper` model used above is an older model, and the high-resolution version has been sealed by the developer due to social impact concerns.
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

![](https://gyazo.com/bab77e7c89d65dff9a4ebedb17a46375){gyazo=image}

[](/workflows/basic-workflows/reactor/ReActor_hyperswap.json)

- Change the `swap_model` of the ReActor node to `hyperswap_1a_256`.

---

## About NSFW Filter

To prevent the repository from being deleted, ReActor has a built-in filter for NSFW images.
Therefore, if you use an image containing NSFW content, it will be rejected.

I won't go into detail, but there are simple ways to bypass this.
( [Detailer](/en/upscale-fix/detailer/) might be useful... maybe. )
