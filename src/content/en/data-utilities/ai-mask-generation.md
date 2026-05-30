---
layout: page.njk
lang: en
section: data-utilities
slug: ai-mask-generation
navId: ai-mask-generation
title: "AI Mask Generation"
created: 2025-11-26
updated: 2026-05-30
summary: "About matting, segmentation, and object detection"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/499c4756e1b2adb1424f9cab9829806b.png"
---

## AI Mask Generation

Masks are often needed for inpainting and similar workflows, but drawing them by hand or preparing mask images every time is a lot of work. Above all, it cannot be automated.

However, there are not many techniques that can simply take "mask this part" and always produce a clean mask.

You need to think in terms of combining several AI techniques.

- **Object Detection** - Finds where the target is in the image.
- **Segmentation** - Cuts out the target shape as a mask.
- **Matting** - Handles the boundary between foreground and background in more detail.

For example, you might use object detection to find the target, then pass that result to segmentation to turn it into a mask.

Let's look at the main techniques.

---

## Object Detection

![](https://gyazo.com/1a10dcd7dcf8f72eee275a3d8484f882){gyazo=image}

As the name suggests, object detection identifies the position of a specific object in an image and outputs a rectangular area called a BBOX.

### YOLO Family

YOLO is an extremely fast detection technique designed for real-time object detection.

![](https://gyazo.com/e8b4e05d42db0b613aee4467a8dca633){gyazo=image}

Basically, one model is made for each type of object you want to detect, such as faces or hands. If there is no model for your target, you need to make one yourself, and it is not suitable when you want to detect many different categories at once.

In exchange, it is very light, so it is suitable when high-speed processing is needed.

### Grounding DINO and Others

Grounding DINO detects objects specified by text and outputs BBOXes.

Unlike YOLO, you can specify objects with text such as "white dog" or "red car", so it is easy to use and can detect multiple objects at the same time.

### VLM / MLLM

VLM / MLLM are LLMs with the ability to see images.

They can do many things, such as caption generation, and some of them can also perform object detection.

![](https://gyazo.com/eac97524bcdcb395cdd5172c3694da41){gyazo=image}

A representative older example is **Florence-2**.

It is slow, but because it has strong understanding ability, you can specify targets with complex text such as "the woman on the right side of the screen wearing a blue hat."

---

## Matting

Many processes called "background removal" are matting.

Matting separates the foreground from the background, and can handle fine boundaries such as hair and semi-transparent areas.

However, it is not for specifying and cutting out one particular object the way segmentation does.

### BiRefNet

![](https://gyazo.com/5ce4bac5b8c8dc13fbbb0468c44bf752){gyazo=image}

The detailed usage is covered on the [BiRefNet](/en/data-utilities/birefnet/) page.

---

## Segmentation

### SAM (Segment Anything Model)

SAM is currently the most famous segmentation model.

It understands the shape of objects, so if you specify a car in a photo with text, points, or boxes, it can find the outline and turn it into a mask.

![](https://gyazo.com/cd6078ed81d850085144836e404754d5){gyazo=image}

The current latest model is covered on the [SAM 3 / 3.1](/en/data-utilities/sam3/) page.

---

## Practical Examples

Let's combine the techniques above to generate masks for arbitrary text prompts or categories.

> The workflows below were commonly used before SAM 3. If your goal is target-specified segmentation, start with [SAM 3 / 3.1](/en/data-utilities/sam3/) now.
>
> They remain here as references for understanding older workflows or reproducing the same setup in an existing environment.

### Required Custom Nodes

These custom nodes may be needed to run the practical examples on this page.

- **[1038lab/ComfyUI-RMBG](https://github.com/1038lab/ComfyUI-RMBG)**
  - This used to be used widely, from matting to segmentation.
  - BiRefNet-style background removal is now also available in ComfyUI core, so check the core nodes first.
- **[ltdrdata/ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack)**
- **[ltdrdata/ComfyUI-Impact-Subpack](https://github.com/ltdrdata/ComfyUI-Impact-Subpack)**
  - These are often used around Detailer workflows. They have some quirks when used only for simple mask generation.
- **[kijai/ComfyUI-Florence2](https://github.com/kijai/ComfyUI-Florence2)**
  - Runs Florence2, an MLLM.
- **[kijai/ComfyUI-segment-anything-2](https://github.com/kijai/ComfyUI-segment-anything-2)**
  - Runs SAM 2 / 2.1 segmentation models.

### YOLO x SAM

![](https://gyazo.com/2c1fb7ed9c7fcc6242e48b9e6e405c27){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/YOLO_face-SAM.json)

This combines fast face detection with YOLO and the original SAM.

### Grounding DINO x SAM

![](https://gyazo.com/c7b4ed29a8dae26fb9c666b137091ab4){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/Grounding_DINO_HQ-SAM.json)

This combines Grounding DINO with HQ-SAM, an improved version of SAM.

It can specify targets by text and generate high-precision masks, so it was one of the most commonly used combinations.

### Florence2 x SAM2

![](https://gyazo.com/677607c761c38defde753681398d6e1f){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/Florence2_SAM2.1.json)

This combines Florence2 and SAM2.1.

For easy targets such as people or animals, many methods work fine. But when you want to specify a complex condition like "a man wearing sunglasses" or "a cat lying under a tree", this kind of LLM-based model is useful.

### SAM 3 x BiRefNet

![](https://gyazo.com/82c4c2d947a3ea9c98b46e05a05d542f){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/SAM3_BiRefNet.json)

Segmentation is for distinguishing objects, not for fine cutouts.

By contrast, matting can handle fine details like hair and semi-transparent objects like glass.

Combining them lets you take advantage of both.
