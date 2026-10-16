---
layout: page.njk
lang: en
section: ai-capabilities
slug: id-transfer
navId: id-transfer
title: ID Transfer & FaceSwap
created: 2025-12-01
updated: 2026-03-02
summary: Creating images of a person in new scenes while keeping their face and identity,
  plus face swapping
seoTitle: "ID Transfer and FaceSwap: Keep a Face Across Images"
seoDescription: "Keep a person's face and identity in new scenes, plus FaceSwap: LoRA, IP-Adapter, InstantID, PuLID-FLUX, InfiniteYou, and instruction-based editing."
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: /media/ai-capabilities/id-transfer/legacy_gyazo_877d8862f6e7f6dd3ec7fbeac5331cd9.png
---
## What Are ID Transfer and FaceSwap?

ID transfer is the people-specific branch of subject transfer. Most methods focus especially on keeping the **face** consistent (personally, I wish they'd treat hair and body as part of the ID too).

FaceSwap has been around since before generative AI. The classic approach puts a "mask" of the reference person's face over the target person's face, but if you use ID transfer to inpaint just the target's face, you get a much more flexible FaceSwap.

---

## LoRA

LoRA is a way to "teach a model to draw things it couldn't draw before," and you can train it on images of a person too.

If you can live with the downside of having to train it, its flexibility and stability are top-notch.

---

## IP-Adapter Family

There are several offshoots that take the IP-Adapter technique covered in subject transfer and specialize it for ID.

### IP-Adapter (Original)

IP-Adapter is an adapter that adds "image-based conditioning" to existing text2image models.

It extracts feature vectors from an image and injects them into the UNet so they show up in the output. It can transfer people, but it's mainly for roughly carrying over a subject or style.

### IP-Adapter-plus-face

The official face-specialized IP-Adapter model.

![](/media/ai-capabilities/id-transfer/legacy_gyazo_afe7232d9dd3cc54f5d8a2f1d956e15f.png){media=image}

[](/workflows/ai-capabilities/id-transfer/ip_adapter_faceid_plusv2_sd15.json)

### IP-Adapter-FaceID

The IP-Adapter-FaceID models work with a face recognition model (InsightFace) to lock in identity more strongly.

**FaceID** uses "Face ID embeddings from a face recognition model" instead of CLIP image embeddings, and adds a LoRA to further improve ID consistency.

The improved **FaceID-Plus** uses both "Face ID embeddings for identity" and "CLIP image embeddings for facial structure," getting a good likeness while keeping the face shape and structure stable.

### InstantID

Strictly speaking it isn't part of the IP-Adapter family, but like those, it's an ID transfer method you can use just by plugging in an extra adapter.

![](/media/ai-capabilities/id-transfer/legacy_gyazo_a4213b144081a1267432874bfc09c1f4.png){media=image}

[](/workflows/ai-capabilities/id-transfer/instantid_simple.json)

It combines an IP-Adapter-style image adapter with an extra network (IdentityNet) that uses ID embeddings and facial landmarks from a face recognition model. This gives a better balance between keeping the identity from a single face photo and following text edits.

Personally, I think InstantID is the best option for SDXL.

### PuLID-FLUX / InfiniteYou

Over time, the main arena for base models moved from SDXL to Diffusion Transformers (the FLUX family). ID transfer methods built for Flux.1 followed.

**PuLID-FLUX** is an ID-focused customization method built on FLUX1-dev. Thanks to tricks like Lightning T2I, you can change the art style while keeping the identity from just "reference face + text," with no extra training.

- ![](/media/ai-capabilities/id-transfer/legacy_gyazo_7a87706872f7b195d46aeabafa6a399e.png){media=image}

- [](/workflows/ai-capabilities/id-transfer/pulid_flux_ll.json)

**InfiniteYou** is an identity-preserving framework built on FLUX-family Diffusion Transformers. With a module that injects identity features into the DiT itself (InfuseNet) and a multi-stage training strategy, it aims to improve likeness, text alignment, and image quality all at once.

---

## Instruction-Based Image Editing and ID Transfer

Since they can do subject transfer, it goes without saying that "[instruction-based image editing models](/en/ai-capabilities/instruction-based-image-editing/)" work for ID transfer too.

---

## FaceSwap

FaceSwap replaces the target person's face with the reference person's face.

### Classical FaceSwap (ReActor / InsightFace based)

Rather than ID transfer, the idea is closer to "making a mask and putting it on."

It uses face detection and landmark detection to estimate the face's position, angle, and outline, aligns the source and target faces with affine transforms and the like, then replaces the target's face with the source face using masks and blending.

![](/media/ai-capabilities/id-transfer/legacy_gyazo_1a0a81f044bd264db835ef99d40a37d1.png){media=image}

[](/workflows/ai-capabilities/id-transfer/reactor_fast.json)

The best-known option in ComfyUI is ReActor (InsightFace-based FaceSwap), but it's also a shaky technology to rely on; its repository has been taken down over ethical concerns, for example.

### Face Inpainting using ID Transfer

Here you mask the target person's face and inpaint it, using ID transfer to redraw it as the reference face.

Back when ID transfer was still immature, one approach was to FaceSwap with ReActor first, then refine with ID transfer inpainting (it's one of the most popular workflows I've made).

[Refining with InstantID after Face Swapping with ReActor](https://scrapbox.io/work4ai/ReActor%E3%81%A7Face_Swap%E3%81%97%E3%81%9F%E3%81%82%E3%81%A8%E3%81%ABInstantID%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%83%AA%E3%83%95%E3%82%A1%E3%82%A4%E3%83%B3%E3%81%99%E3%82%8B)

![](/media/ai-capabilities/id-transfer/legacy_gyazo_877d8862f6e7f6dd3ec7fbeac5331cd9.png){media=image}

[](/workflows/ai-capabilities/id-transfer/reactor_w_instantid2.json)
