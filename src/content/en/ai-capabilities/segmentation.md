---
layout: page.njk
lang: en
section: ai-capabilities
slug: segmentation
navId: segmentation
title: "Segmentation"
summary: "Technology to divide images to create masks (mainly SAM family)"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/4a56caa5986a2c2403dcad74d1bf1874.png"
---

## What is Segmentation?

There are actually various types of segmentation, but in the context of ComfyUI, it is a technology to **create a mask of the shape of an object specified by points, BBOX, mask, or text**.

---

## Difference from Matting

You might feel it is similar to matting, but there are the following major differences.

- **Matting**
  - Creates a mask with a binary choice of "foreground" or "background"

- **Segmentation**
  - The purpose is to cut out (create a mask for) an arbitrary object

So, is matting a subset of segmentation? Not at all, their roles are fundamentally different.

- Segmentation is more like a classification task
- Matting is capable of high-quality cutouts that allow for transparency

---

## SAM

> ![](https://gyazo.com/109335e3e675b7bd8beb9f77bc489829){gyazo=loop}
> [Introducing Meta Segment Anything Model 3 and Segment Anything Playground](https://ai.meta.com/blog/segment-anything-model-3/)

When we say "segmentation" in ComfyUI, what is actually used is almost always **SAM (Segment Anything) family models**.

I said the purpose is to cut out (create a mask for) an arbitrary object, but for that, the AI needs to understand "the shape of that object" to some extent.

For example, if there is a fruit basket on a desk and you want to cut out an apple, if it doesn't know the shape of an "apple", it doesn't know how far to treat as an apple. **SAM** achieved this.

### Main Models

- **SAM**
  - The initial model announced by Meta.
  - Just click anywhere, and it returns the mask of that area.

- **[HQ-SAM](https://github.com/SysCV/SAM-HQ)**
  - A derivative model based on SAM with improved mask quality.

- **SAM 2 / 2.1**
  - Supports video as well. It can output a mask while tracking the same object in a video.

- **SAM 3**
  - It became possible to specify the target by text.
  - Until now, it was necessary to specify the target by points or BBOX, so if you wanted to create a mask automatically, you had to combine it with object detection.

---

## Use Cases in ComfyUI

It is used in all kinds of situations, from cutouts to inpainting.

In addition, [Segment Anything Playground](https://aidemos.meta.com/segment-anything/gallery) has many examples such as blurring faces or making the background black and white. (By the way, most of these can be reproduced with ComfyUI.)

![](https://gyazo.com/8a13dabaec7771795dc4028d6e40abff){gyazo=image}

[](/workflows/ai-capabilities/segmentation/SAM3.json)

Before SAM 2.1, text object specification was not possible, so it was often used in combination with [Object Detection](/en/ai-capabilities/object-detection) such as Grounding DINO or Florence2.

SAM 3 can specify by text, but in terms of object detection, models better than SAM will likely appear in the future, so let's remember this combination.

---

## Supplement: Segmentation Before SAM

Textbook-wise, segmentation has the following classifications.

> ![](https://gyazo.com/010576fd5cce11b2da01333c92d39ae7){gyazo=image}
> [Instance Segmentation](https://cvml-expertguide.net/terms/dl/instance-segmentation/)

- **Semantic Segmentation**
  - Assigns a "class label" to each pixel.
  - person / sky / road / building, etc. No matter how many people there are, they are all treated collectively as the "person" class.

- **Instance Segmentation**
  - In addition to semantic, it separates "masks for each individual".
  - Separates individually as person_1 / person_2 / person_3 ...

SAM is like doing these two at the same time, but these are still important tasks in fields like autonomous driving and surveillance cameras.
