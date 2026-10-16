---
layout: page.njk
lang: en
section: basic-workflows
slug: florence2
navId: florence2
title: "Florence-2"
created: 2025-12-09
updated: 2026-03-02
summary: "Image captioning and object detection with Florence-2"
seoTitle: "Florence-2 in ComfyUI: Captioning, Object Detection, OCR"
seoDescription: "Use Florence-2 in ComfyUI, one model for captioning, object detection, OCR, and visual question answering, with a workflow for each task."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
tags: ["tag-caption-generation","object-detection"]
---

## What is Florence-2?

Florence-2 is a general-purpose VLM (Visual Language Model) that looks at an image and handles many tasks with a single model: captioning, object detection, segmentation, OCR, and more.

This page sticks to the four tasks that come up most in ComfyUI: "captioning," "object detection (getting coordinates)," "OCR," and "Q&A about an image."

---

## Custom Node

- [kijai/ComfyUI-Florence2](https://github.com/kijai/ComfyUI-Florence2?tab=readme-ov-file)
  - The model downloads automatically the first time you run it.

---

## Florence2Run Node

Florence2Run is the main node for having Florence-2 run a task on the input image. Switch `task` to choose between captioning, object detection, OCR, and so on.

### caption, detailed caption

Generates a natural language caption from the image.

![](/media/basic-workflows/florence2/legacy_gyazo_b364e8bc1ba2799ad953384f4dfe2079.png){media=image}

[](/workflows/basic-workflows/florence2/florence2_detailed_caption.json)

- `caption`
  - Gives a simple overview of the image.
- `detailed caption`
  - Describes the composition and look in a bit more detail.

That said, if all you want is "captions to use as prompts," a dedicated captioning model like [JoyCaption](/en/basic-workflows/joycaption/) gives you far more flexible, higher-quality results.

### caption_to_phrase_grounding

For each phrase in the caption you give it, this outputs where the object is as a rectangle (bounding box).

![](/media/basic-workflows/florence2/legacy_gyazo_0acc3146eed131b9642857ebc1edcce1.png){media=image}

[](/workflows/basic-workflows/florence2/florence2_caption_to_phrase_grounding.json)

- Its strength is that it can find positions even from slightly more complex phrases like "left tree" or "red car."
- Pull out the coordinates with the 🟨 `Florence2 Coordinates` node and combine them with a segmentation model such as SAM2, and you can mask just a specific object.

### ocr

Reads the text in an image and outputs it as text.

![](/media/basic-workflows/florence2/legacy_gyazo_e701757ab4dfe4056a74a5290d52edbb.png){media=image}

[](/workflows/basic-workflows/florence2/florence2_ocr.json)


### docvqa

Answers questions about the image.

![](/media/basic-workflows/florence2/legacy_gyazo_614f705d137c7d5a19015b5a9aaa4f17.png){media=image}

[](/workflows/basic-workflows/florence2/florence2_docvqa.json)

- You can ask things like "Where is XX in this image?" or "What's the value in this table?" and get the answer back as text.
- Think of it like sending an image to ChatGPT and asking about it.
