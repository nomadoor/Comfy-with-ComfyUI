---
layout: page.njk
lang: en
section: ai-capabilities
slug: object-detection
navId: object-detection
title: Object Detection
summary: "Technology to find 'what' is 'where' in an image"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: 'https://i.gyazo.com/1a10dcd7dcf8f72eee275a3d8484f882.png'
---

## What is Object Detection?

Object Detection is a task to find "what is in the image (class)" and "where it is (location)".

Generally, it outputs a bounding box (rectangle) and a label for each object.

In ComfyUI, it is used almost exclusively as an entry point for mask generation.
Detecting a dog to remove it, detecting only a face to refine it... It is a technology that comes into play very often.

---

## Representative Methods

There are various lineages in the world of object detection proper, but from a ComfyUI perspective, the following are representative.

### YOLO Family

A traditional and powerful group of models for detecting specific objects (cars, people, dogs, etc.).

![](https://gyazo.com/2b694eacfaee03e50818eb87174f0ef9){gyazo=image}

[](/workflows/ai-capabilities/object-detection/yolo8.json)

* It is overwhelmingly fast and light enough to be used for real-time processing.
* It detects from a pre-determined set of classes such as "person" or "car".
* If there is no model, you need to train it yourself.

### DETR Family

Detection models using Transformers instead of CNNs.
You rarely have the opportunity to handle them directly in ComfyUI, but you may see the name in the context of object detection.

---

## Object Detection by Text

The detectors above can only detect pre-determined classes, so they suddenly become difficult to use when trying to detect things other than representative ones like people or cars.

What is important for ComfyUI is detection of the type where **objects can be specified by text**.

### Grounding DINO

* A model that associates image and text features with an image encoder + text encoder.
* It can detect anything instructed by a prompt (text), such as "red car" or "traffic light".

### Florence-2

![](https://gyazo.com/9efa0561eb445e5b300aaf3abb76f526){gyazo=image}

[](/workflows/ai-capabilities/object-detection/Florence-2.json)

* A general-purpose VLM that performs multiple roles in one model, such as caption generation, object detection, and segmentation by looking at an image.
* Since it has a structure close to an LLM, its strength is that it can be instructed with more complex sentences than Grounding DINO.

---

## Use Cases in ComfyUI (As Mask Generation)

In ComfyUI, object detection is used almost as an **entry point for mask generation**.

However, what is output from the object detection model is only a BBOX (rectangle).

This alone is useful for object removal by inpainting, etc., but for example, when a person is detected, most of that area is background, so it is a bit wasteful to use as a mask.

Therefore, these detection results are often not used alone but in combination with subsequent matting or segmentation. Let's look at those next.

## Related

- [AI Mask Generation](/en/data-utilities/ai-mask-generation/)
