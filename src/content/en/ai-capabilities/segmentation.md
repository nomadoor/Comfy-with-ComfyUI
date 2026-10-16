---
layout: page.njk
lang: en
section: ai-capabilities
slug: segmentation
navId: segmentation
title: "Segmentation"
created: 2025-12-01
updated: 2026-03-02
summary: "Splitting an image up to make masks (mainly the SAM family)"
seoTitle: "What Is Segmentation? Making Masks with SAM"
seoDescription: "Segmentation makes a mask in the shape of an object picked by points, boxes, or text. How it differs from matting, the SAM family, and ComfyUI use."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/ai-capabilities/segmentation/legacy_gyazo_4a56caa5986a2c2403dcad74d1bf1874.png"
---

## What is Segmentation?

There are actually many kinds of segmentation, but in the ComfyUI context it means **making a mask in the shape of an object you pick with points, a BBOX, a mask, or text**.

---

## Difference from Matting

It may sound similar to matting, but there are some big differences.

- **Matting**
  - Makes a mask by deciding between just two options: "foreground" or "background"

- **Segmentation**
  - The goal is to cut out (make a mask for) any object you choose

So is matting just a weaker version of segmentation? Not at all. They do different jobs in the first place.

- Segmentation is closer to a classification task
- Matting gives high-quality cutouts that can even represent transparency

---

## SAM

> ![](/media/ai-capabilities/segmentation/legacy_gyazo_109335e3e675b7bd8beb9f77bc489829.mp4){media=loop}
> [Introducing Meta Segment Anything Model 3 and Segment Anything Playground](https://ai.meta.com/blog/segment-anything-model-3/)

When people say "segmentation" in ComfyUI, what they're actually using is almost always a **SAM (Segment Anything) family model**.

I said the goal is to cut out (make a mask for) any object, but to do that, the AI has to understand "the shape of that object" to some degree.

Say there's a fruit basket on a desk and you want to cut out an apple. If the AI doesn't know what an apple looks like, it can't tell where the apple ends. **SAM** is what made this possible.

### Main Models

- **SAM**
  - The original model released by Meta.
  - Just click anywhere, and it returns a mask for that region.

- **[HQ-SAM](https://github.com/SysCV/SAM-HQ)**
  - A spin-off of SAM with better mask quality.

- **SAM 2 / 2.1**
  - Adds video support. It can track the same object through a video and output masks for it.

- **SAM 3**
  - You can now specify the target with text.
  - Before this, you had to pick the target with points or a BBOX, so making masks automatically meant pairing it with object detection.

---

## Use Cases in ComfyUI

It comes up everywhere, from cutouts to inpainting.

The [Segment Anything Playground](https://aidemos.meta.com/segment-anything/gallery) also has lots of examples, like blurring faces or turning the background black and white. (By the way, you can recreate most of them in ComfyUI.)

![](/media/ai-capabilities/segmentation/legacy_gyazo_8a13dabaec7771795dc4028d6e40abff.png){media=image}

[](/workflows/ai-capabilities/segmentation/sam3.json)

Up through SAM 2.1, you couldn't specify objects with text, so it was often paired with [object detection](/en/ai-capabilities/object-detection) models like Grounding DINO or Florence2.

SAM 3 does take text, but when it comes to object detection, models better than SAM will probably keep coming out, so this combination is worth remembering.

---

## Side Note: Segmentation Before SAM

The textbook categories of segmentation are:

> ![](/media/ai-capabilities/segmentation/legacy_gyazo_010576fd5cce11b2da01333c92d39ae7.png){media=image}
> [Instance Segmentation](https://cvml-expertguide.net/terms/dl/instance-segmentation/)

- **Semantic Segmentation**
  - Gives every pixel a "class label."
  - person / sky / road / building, and so on. However many people there are, they're all lumped together as the "person" class.

- **Instance Segmentation**
  - On top of semantic labels, it separates "a mask for each individual."
  - Splits them up as person_1 / person_2 / person_3 ...

SAM is sort of doing both at once, but these are still important tasks in fields like self-driving cars and security cameras.
