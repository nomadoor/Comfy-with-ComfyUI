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
seoTitle: "Generate Masks with AI in ComfyUI"
seoDescription: "Create masks for inpainting automatically: object detection with YOLO or Grounding DINO, matting with BiRefNet, and segmentation with SAM."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/data-utilities/ai-mask-generation/legacy_gyazo_499c4756e1b2adb1424f9cab9829806b.png"
---

## AI Mask Generation

Masks are often needed for inpainting and similar workflows, but drawing them by hand or preparing mask images every time is a lot of work. Above all, it cannot be automated.

But there aren't many techniques that let you just say "mask this part" and easily get a clean mask.

You need to think in terms of combining several AI techniques.

- **Object Detection** - Finds where the target is in the image.
- **Segmentation** - Cuts out the target shape as a mask.
- **Matting** - Handles the boundary between foreground and background in more detail.

For example, you might use object detection to find the target, then pass that result to segmentation to turn it into a mask.

Let's see what's out there.

---

## Object Detection

![](https://gyazo.com/1a10dcd7dcf8f72eee275a3d8484f882){gyazo=image}

As the name suggests, object detection identifies the position of a specific object in an image and outputs a rectangular area called a BBOX.

### YOLO Family

YOLO is an extremely fast detection technique designed for real-time object detection.

![](/media/data-utilities/ai-mask-generation/legacy_gyazo_e8b4e05d42db0b613aee4467a8dca633.png){media=image}

Basically, each model is made for one type of object you want to detect (faces only, hands only, and so on). If there's no model for your target, you have to train one yourself, and it's not a good fit when you want to detect several kinds of objects.

In exchange, it's very lightweight, so it's a good choice when you need speed.

### Grounding DINO and Others

Grounding DINO detects objects specified by text and outputs BBOXes.

Unlike YOLO, you can name any object you like in text, such as "white dog" or "red car," so it's easy to use, and it can also detect multiple objects at once.

### VLM / MLLM

VLM / MLLM are LLMs with the ability to see images.

They can do many things, such as caption generation, and some of them can also perform object detection.

![](/media/data-utilities/ai-mask-generation/legacy_gyazo_eac97524bcdcb395cdd5172c3694da41.png){media=image}

It's quite old now, but a well-known example is **Florence-2**.

It's slow, but it understands a lot, so you can describe the target with complex text such as "the woman on the right side of the screen wearing a blue hat."

---

## Matting

Much of what's called "background removal" is actually matting.

Matting separates the foreground from the background, and can handle fine boundaries such as hair and semi-transparent areas.

However, it is not for specifying and cutting out one particular object the way segmentation does.

### BiRefNet

![](/media/data-utilities/ai-mask-generation/legacy_gyazo_5ce4bac5b8c8dc13fbbb0468c44bf752.png){media=image}

The detailed usage is covered on the [BiRefNet](/en/data-utilities/birefnet/) page.

---

## Segmentation

### SAM (Segment Anything Model)

SAM is currently the most famous segmentation model.

It understands the shape of objects, so if you specify a car in a photo with text, points, or boxes, it can find the outline and turn it into a mask.

![](/media/data-utilities/ai-mask-generation/legacy_gyazo_cd6078ed81d850085144836e404754d5.png){media=image}

The current latest model is covered on the [SAM 3 / 3.1](/en/data-utilities/sam3/) page.

---

## Practical Examples

Let's combine the techniques above to generate masks for arbitrary text prompts or categories.

> [!NOTE]
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

![](/media/data-utilities/ai-mask-generation/legacy_gyazo_2c1fb7ed9c7fcc6242e48b9e6e405c27.png){media=image}

[](/workflows/data-utilities/ai-mask-generation/yolo_face_sam.json)

This combines fast face detection with YOLO and the original SAM.

### Grounding DINO x SAM

![](/media/data-utilities/ai-mask-generation/legacy_gyazo_c7b4ed29a8dae26fb9c666b137091ab4.png){media=image}

[](/workflows/data-utilities/ai-mask-generation/grounding_dino_hq_sam.json)

This combines Grounding DINO with HQ-SAM, an improved version of SAM.

You can pick the target with text and still get a high-precision mask, so it's one of the most commonly used combinations.

### Florence2 x SAM2

![](/media/data-utilities/ai-mask-generation/legacy_gyazo_677607c761c38defde753681398d6e1f.png){media=image}

[](/workflows/data-utilities/ai-mask-generation/florence2_sam2_1.json)

This combines Florence2 and SAM2.1.

For simple targets like people or animals, anything works, but when you want to specify something more complex, like "a man wearing sunglasses" or "a cat lying under a tree," LLM-based models like this really shine.

### SAM 3 x BiRefNet

![](/media/data-utilities/ai-mask-generation/legacy_gyazo_82c4c2d947a3ea9c98b46e05a05d542f.png){media=image}

[](/workflows/data-utilities/ai-mask-generation/sam3_birefnet.json)

Segmentation is about telling objects apart in the first place, not about making fine cutouts.

By contrast, matting can handle fine details like hair and semi-transparent objects like glass.

Combining the two lets each one make up for what the other lacks.
