---
layout: page.njk
lang: en
section: basic-workflows
slug: sd15-ip-adapter
navId: sd15-ip-adapter
title: "IP-Adapter"
summary: "The original mechanism for transferring style and subject from a reference image"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/64fdcae074a2a01943d7f5fff3aaa418.png"
tags: ["subject-transfer", "style-transfer"]
---

## What is IP-Adapter?

When looking at a picture or photo and thinking "I want it drawn with this same vibe," it is almost impossible to explain every detail using only text.

Therefore, several mechanisms have been proposed to "let the AI look directly at the image without going through text."
Among them, **IP-Adapter** is one of the classic methods used for **"transferring" style and subject**.

Think of it as the pioneer of "reference2image" and "[Subject Transfer](/en/ai-capabilities/subject-transfer/)".

---

## SD1.5 × IP-Adapter

There are several types of IP-Adapter, but let's start by trying the most standard one.

### Download Models

- IP-Adapter Main Model (for SD1.5)
  - [ip-adapter_sd15.safetensors](https://huggingface.co/h94/IP-Adapter/blob/main/models/ip-adapter_sd15.safetensors)
- CLIP Vision Model
  - [model.safetensors](https://huggingface.co/h94/IP-Adapter/blob/main/models/image_encoder/model.safetensors)
    - Rename this to `OpenCLIP-ViT-H-14` to avoid confusion.
- ```
  📂ComfyUI/
    └── 📂models/
        ├── 📂clip_vision/
        │   └── OpenCLIP-ViT-H-14.safetensors
        └── 📂ip_adapter/
            └── ip-adapter_sd15.safetensors
  ```

### workflow

![](https://gyazo.com/6e8376130553997cbd30696c6700a601){gyazo=image}

[](/workflows/basic-workflows/sd15-ip-adapter/ip-adapter_sd15.json)

- 🟩 Connect various models and the reference image you want to use to the `IPAdapter Advanced` node.
- 🟦 Crop the reference image with the `Prep Image For ClipVision` node.
  - Details below.

---

## What is it "Looking" At?

![](https://gyazo.com/302c47a4eb43f19e7e8535ca40e8ed5c){gyazo=image}

The CLIP ViT-H-14, which acts as the "eye" for IP-Adapter, basically only sees a **224 × 224 square area**.
Therefore, if you pass a portrait photo as is, the face or feet might be cut off, or it might only pick up features from the middle of the body.

If you want to decide which part should be the standard, resize and crop it first as shown in the workflow above.

---

## Main IP-Adapter Models

There are several derivative models, and "what and how much they borrow" from the reference image varies greatly from model to model.

### ip-adapter-plus_sd15

A model that strongly transfers composition and object positions.

![](https://gyazo.com/ecbbe99d3410a850767aaf506645952b){gyazo=image}

[](/workflows/basic-workflows/sd15-ip-adapter/ip-adapter-plus_sd15.json)

- [ip-adapter-plus_sd15.safetensors](https://huggingface.co/h94/IP-Adapter/blob/main/models/ip-adapter-plus_sd15.safetensors)
- The composition will be very close to the reference image.


### ip-adapter_sd15_light

A model that prioritizes text prompts.

![](https://gyazo.com/422b44322caef6fe6fdec8c7d37f54e3){gyazo=image}

[](/workflows/basic-workflows/sd15-ip-adapter/ip-adapter_sd15_light.json)

- [ip-adapter_sd15_light.safetensors](https://huggingface.co/h94/IP-Adapter/blob/main/models/ip-adapter_sd15_light.safetensors)
- Leaves text instructions strongly.
- The reference image is mainly used as a hint for "style/atmosphere".

### ip-adapter-plus-face_sd15

An IP-Adapter specialized for faces (head).

![](https://gyazo.com/bba6f8053f411bee64044c141d4632c0){gyazo=image}

[](/workflows/basic-workflows/sd15-ip-adapter/ip-adapter-plus-face_sd15.json)

- [ip-adapter-plus-face_sd15.safetensors](https://huggingface.co/h94/IP-Adapter/blob/main/models/ip-adapter-plus-face_sd15.safetensors)
- Fixes facial features, contours, etc. quite strongly.

### ip-adapter-faceid-plusv2_sd15

A model that combines not only CLIP but also the face recognition model of insightface.

![](https://gyazo.com/ded09a4d7a09bb7cfca5ccfa684951dc){gyazo=image}

[](/workflows/basic-workflows/sd15-ip-adapter/ip-adapter-faceid-plusv2_sd15.json)

- [ip-adapter-faceid-plusv2_sd15.bin](https://huggingface.co/h94/IP-Adapter-FaceID/blob/main/ip-adapter-faceid-plusv2_sd15.bin)
- Transfers ID more flexibly than plus-face.
- 🟨 Uses the `IPAdapter FaceID` node.

---

## SDXL Model Links

For those who want to try SDXL as well, here is a list of model links for SDXL.

- [ip-adapter_sdxl_vit-h](https://huggingface.co/h94/IP-Adapter/blob/main/sdxl_models/ip-adapter_sdxl_vit-h.safetensors)
- [ip-adapter-plus-face_sdxl_vit-h](https://huggingface.co/h94/IP-Adapter/blob/main/sdxl_models/ip-adapter-plus-face_sdxl_vit-h.safetensors)
- [ip-adapter-plus_sdxl_vit-h](https://huggingface.co/h94/IP-Adapter/blob/main/sdxl_models/ip-adapter-plus_sdxl_vit-h.safetensors)
- [ip-adapter-faceid-plusv2_sdxl](https://huggingface.co/h94/IP-Adapter-FaceID/blob/main/ip-adapter-faceid-plusv2_sdxl.bin)
