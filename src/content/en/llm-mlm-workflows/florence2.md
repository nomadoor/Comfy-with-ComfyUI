---
layout: page.njk
lang: en
section: llm-mlm-workflows
slug: florence2
navId: florence2
title: "Florence-2"
summary: "High-spec yet lightweight VLM from Microsoft"
permalink: "/{{ lang }}/llm-mlm-workflows/{{ slug }}/"
hero:
  image: ""
tags: ["object-detection"]
---

## What is Florence-2?

**Florence-2** is an open-source vision language model (VLM) developed by Microsoft.
Despite being lightweight enough to run comfortably on consumer GPUs, it boasts high performance.

This model is not just for "creating captions."
It can multitask, handling various image recognition tasks such as object detection, segmentation, and OCR with a single model.

---

## Custom Node

- [kijai/ComfyUI-Florence2](https://github.com/kijai/ComfyUI-Florence2)

* Since models are downloaded automatically, explicit download is unnecessary.
* Models are saved in `ComfyUI/models/LLM`.

---

## Basic Workflow (Task Switching)

In Florence-2, you can switch between what you want to do (Task) using a prompt.
In ComfyUI, you can easily switch tasks by selecting from the menu of the `Florence2Run` node.

![](https://gyazo.com/95b9cdddc8f352136e1f0e42718749a3){gyazo=image}

[](/workflows/llm-mlm-workflows/florence2/Florence2_Task.json)

### Caption Generation

Generate a description of the image.

- **caption**: Simple caption.
- **detailed_caption**: Detailed caption.
- **more_detailed_caption**: Even more detailed caption.

> **Note:**
> While it is high-performance, it tends to be a "description of the situation" rather than a prompt for image generation.
> For creating prompts for image generation (danbooru tags, etc.), tools like **JoyCaption** or **WD14 Tagger** might be more suitable.

### Object Detection (Grounding)

Detects the location of objects in the image.

- **caption_to_phrase_grounding**
  - Detects the object specified in the `text_input` field (e.g., "cat", "girl").
  - Returns coordinate data (`bbox`) and a preview image with the bounding box drawn.

### Creating Masks from Coordinates

If you convert the detected coordinates (`bbox`) to a mask using the **`Florence2Mask`** node, you can use it for masking specific objects.

It is lighter than connecting a detection model like YOLO separately, and since it is a language model, it has the advantage of being able to specify objects flexibly with text.

* Note: Coordinates are rectangles (Box), so the mask will also be a rectangle.
   If you want to cut out precisely along the shape of the object, pass these coordinates to **SAM2** (Segment Anything Model 2).

### OCR (Text Recognition)

- **ocr**: Reads text in the image.
- **ocr_with_region**: Reads text and also outputs its location (coordinates).

### DocVQA (Visual Question Answering)

- **docvqa**: Accepts questions about the image content in `text_input`.
  - Example: "What is written on the sign?" "What color is the car?"
  - It is particularly strong in reading diagrams and documents, but it performs reasonably well with normal photos too.

Comparison with pure LLMs (ChatGPT, Gemini, etc.):
Since it runs locally, "privacy is protected" and "no API fee is required" are strong advantages.
