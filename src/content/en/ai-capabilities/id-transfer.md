---
layout: page.njk
lang: en
section: ai-capabilities
slug: id-transfer
navId: id-transfer
title: "ID Transfer & FaceSwap"
summary: "Techniques to create images of different scenes while maintaining the person's face or identity, and face replacement."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/877d8862f6e7f6dd3ec7fbeac5331cd9.png"
---

## What is ID Transfer and FaceSwap?

ID Transfer is a type of Subject Transfer specialized for people. It often focuses particularly on the consistency of the **face** (personally, I wish hair and body were also treated as ID).

FaceSwap is a task that existed before the advent of generative AI. The classical method involves putting a "mask" of the reference person's face on the target person's face, but by using ID Transfer technology and inpainting only the target face part, more flexible FaceSwap is possible.

---

## LoRA

LoRA is a mechanism to "enable the model to draw things it couldn't draw later," and it can also learn images of people.

If you can overcome the disadvantage of needing training, flexibility and stability are top-class.

---

## IP-Adapter Family

There are several lineages that specialized the IP-Adapter technology treated in Subject Transfer for ID.

### IP-Adapter (Original)

IP-Adapter is an adapter for adding "condition input from images" to existing text2image models.

It extracts feature vectors from images and injects them into the UNet to reflect them in the generation results. It can transfer people, but it is mainly used to roughly reflect the Subject or style.

### IP-Adapter-plus-face

The official IP-Adapter model specialized for faces.

![](https://gyazo.com/afe7232d9dd3cc54f5d8a2f1d956e15f){gyazo=image}

[](/workflows/ai-capabilities/id-transfer/ip-adapter-faceid-plusv2_sd15.json)

### IP-Adapter-FaceID

The IP-Adapter-FaceID series is a group of models for strongly fixing ID in combination with face recognition models (InsightFace).

In **FaceID**, "Face ID embeddings from face recognition models" are used instead of CLIP image embeddings, and ID consistency is further enhanced with LoRA.

In the improved version **FaceID-Plus**, both "Face ID embeddings for ID" and "CLIP image embeddings for facial structure" are used to achieve both facial resemblance and stability of facial shape/structure.

### InstantID

Strictly speaking, it is not a lineage of IP-Adapter, but it is a technique specialized for ID transfer that can be used just by pointing to an additional adapter.

![](https://gyazo.com/a4213b144081a1267432874bfc09c1f4){gyazo=image}

[](/workflows/ai-capabilities/id-transfer/InstantID-simple.json)

By combining an IP-Adapter type image adapter with an additional network (IdentityNet) that uses ID embeddings and facial landmarks obtained from face recognition models, it enhances the balance between ID retention from a single face photo and text editing.

Personally, I think InstantID is the strongest if using SDXL.

### PuLID-FLUX / InfiniteYou

As times progress, the main battlefield of base models has shifted from SDXL to Diffusion Transformer systems (FLUX systems). Accordingly, ID transfer methods assuming Flux.1 have also appeared.

**PuLID-FLUX** is an ID-specialized customization method based on FLUX1-dev. Thanks to innovations like Lightning T2I, you can change the art style while maintaining the ID with "reference face + text" without additional training.

- ![](https://gyazo.com/7a87706872f7b195d46aeabafa6a399e){gyazo=image}

- [](/workflows/ai-capabilities/id-transfer/PuLID_Flux_ll.json)

**InfiniteYou** is an ID retention framework based on FLUX-based Diffusion Transformers. It aims to improve ID resemblance, text consistency, and image quality simultaneously through a module (InfuseNet) that injects Identity features into the DiT body and a multi-stage learning strategy.

---

## Instruction-Based Image Editing and ID Transfer

Since Subject Transfer is possible, it goes without saying that "[Instruction-Based Image Editing Models](/en/ai-capabilities/instruction-based-image-editing/)" can also be used for ID Transfer.

---

## FaceSwap

FaceSwap is a technology that replaces the target person's face with the reference person's face.

### Classical FaceSwap (ReActor / InsightFace based)

It is an idea closer to "making a mask and putting it on" rather than ID Transfer.

It estimates the position, orientation, and contour of the face with face detection and landmark detection, aligns the source face and target face with affine transformation, etc., and replaces the target side face part with the source face using masks and blending.

![](https://gyazo.com/1a0a81f044bd264db835ef99d40a37d1){gyazo=image}

[](/workflows/ai-capabilities/id-transfer/ReActor_Fast.json)

Representative ones that can be used in ComfyUI include ReActor (InsightFace-based FaceSwap), but it is also a technology with strong anxiety factors, such as repositories being deleted from an ethical point of view.

### Face Inpainting using ID Transfer

A method of redrawing the target face using ID Transfer technology when inpainting with the target person's face as a mask.

When ID Transfer technology was immature, there was also a method of FaceSwapping with ReActor and then refining with inpainting using ID Transfer (this is one of the most popular workflows I made).

[Refining with InstantID after Face Swapping with ReActor](https://scrapbox.io/work4ai/ReActor%E3%81%A7Face_Swap%E3%81%97%E3%81%9F%E3%81%82%E3%81%A8%E3%81%ABInstantID%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%83%AA%E3%83%95%E3%82%A1%E3%82%A4%E3%83%B3%E3%81%99%E3%82%8B)

![](https://gyazo.com/877d8862f6e7f6dd3ec7fbeac5331cd9){gyazo=image}

[](/workflows/ai-capabilities/id-transfer/ReActor_w_InstantID2.json)
