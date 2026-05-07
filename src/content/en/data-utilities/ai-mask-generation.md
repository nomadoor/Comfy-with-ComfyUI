---
layout: page.njk
lang: en
section: data-utilities
slug: ai-mask-generation
navId: ai-mask-generation
title: "AI Mask Generation"
created: 2025-11-26
updated: 2026-05-07
summary: "About matting, segmentation, and object detection"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/499c4756e1b2adb1424f9cab9829806b.png"
---

## AI Mask Generation

Masks are often needed for inpainting and similar workflows, but drawing them by hand or preparing mask images every time is a lot of work. Above all, it cannot be automated.

That said, you cannot always get a clean mask just by saying "mask this part."  
You need to use different AI techniques depending on the goal.

- **Object Detection**
  - Detects objects in an image with a **Bounding Box** based on instructions such as text.
- **Matting**
  - Separates the **foreground** and **background** with a soft mask called an Alpha Matte. In ComfyUI, this often becomes a binary mask.
- **Segmentation**
  - Extracts the **shape of an object** as a black-and-white mask.

---

## Required Custom Nodes

> As of May 2026, if you want to create a mask by specifying a target, it is best to start with the core [SAM 3 / 3.1](/en/data-utilities/sam3/) implementation.  
> The techniques below were commonly used before SAM 3. There is not much reason to start using them from scratch now.

- **[1038lab/ComfyUI-RMBG](https://github.com/1038lab/ComfyUI-RMBG)**
  - Supports many techniques from matting to segmentation, and is easy to use.
  - As of May 2026, updates seem to have slowed down, so it may not work well in some environments.
- **[ltdrdata/ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack)**
- **[ltdrdata/ComfyUI-Impact-Subpack](https://github.com/ltdrdata/ComfyUI-Impact-Subpack)**
  - These are mainly for Detailer workflows, so they have some quirks when used simply for mask generation.
- **[kijai/ComfyUI-Florence2](https://github.com/kijai/ComfyUI-Florence2)**
  - Runs Florence2, an MLLM.
- **[kijai/ComfyUI-segment-anything-2](https://github.com/kijai/ComfyUI-segment-anything-2)**
  - Runs the SAM 2 segmentation model, usually together with Florence2.

---

## Object Detection

![](https://gyazo.com/1a10dcd7dcf8f72eee275a3d8484f882){gyazo=image}

As the name suggests, this identifies the position of a specific object in an image and outputs a rectangular area called a BBOX.

There are many techniques, each with different strengths in accuracy, flexibility, and speed.

### YOLO Family

YOLO is an extremely fast detection technique designed for real-time object detection.

Basically, one model is made for each type of object you want to detect, such as faces or hands. If there is no model for your target, you need to make one yourself, and it is not suitable when you want to detect many different categories at once.

![](https://gyazo.com/e8b4e05d42db0b613aee4467a8dca633){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/Simple_Detector_(SEGS)-YOLO_face.json)

It is suitable when high-speed processing is needed, such as when the target is fixed to face detection.

- **How to get models**: `ComfyUI Manager` -> `Install Models` -> search for YOLO. You can find various YOLO models besides face models.
- I will not link them here, but if you search for Adetailer on Civitai, you can also find models specialized for NSFW.

### Grounding DINO

Grounding DINO detects objects specified by text and outputs BBOXes.

Unlike YOLO, you can specify objects with arbitrary text such as "white dog" or "red car", so it is easy to use and can detect multiple objects at the same time.

There is no node here that runs Grounding DINO alone, so the workflow below introduces it together with segmentation.

### VLM / MLLM

VLM / MLLM are LLMs with the ability to see images.

They can do many things, such as caption generation, and some of them can also perform object detection.

**Florence-2** appeared relatively early, but it is still one of the most versatile and convenient vision language models.

![](https://gyazo.com/eac97524bcdcb395cdd5172c3694da41){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/Florence2Run.json)

- **Model**: I do not feel a big difference between them, but try a few. The model is downloaded automatically.
- **Prompt**: Describe the object you want to detect.
- **task**: caption_to_phrase_grounding
- **output_mask_select**: If several items are detected, choose which output to use. If blank, all are output.

This is suitable when you want to specify the target with a complex expression, or when you want to use the understanding ability of an LLM. It is slow, though.

---

## Matting

Services and features called "background removal" are basically doing this.

You cannot specify a particular object, and the AI decides what "background" means. It is best when you simply want to remove the background, or when the boundary between foreground and background is clear.

### BiRefNet

Probably the most commonly used model. Its speed and quality are both good enough, so this is the one to try first for matting.

![](https://gyazo.com/5ce4bac5b8c8dc13fbbb0468c44bf752){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/BiRefNet_Remove_Background_(RMBG).json)

- If you set `Background` to `Alpha`, it outputs a transparent image with an alpha channel.
- **Note**: This output is **RGBA**, so it may cause errors when used in image2image and similar workflows. See [Mask & Alpha Channel](/en/data-utilities/mask-alpha/).

There are several derivative models depending on the use case, such as ToonOut for anime images. Try a few.

---

## Segmentation

### SAM (Segment Anything Model)

SAM is currently the most famous segmentation model.

It understands the "shape of things", so if you specify a car in a photo with a point or box, it can find the outline accurately and turn it into a mask.

![](https://gyazo.com/ae3a00df59eb97f8612b700ff90aac3b){gyazo=image}

This is the function where you click points and segment the specified object, but in practice it is often combined with object detection.

- 1. Right-click an image node -> `Open in SAM Detector`
- 2. Left-click the object you want to extract. Right-click areas you want to exclude.
- 3. Press `Detect` to generate the mask.

> SAM is still being developed, and there are the original SAM / SAM 2 / SAM 2.1 / SAM 3.
>
> SAM 3 supports not only point and BBOX prompts, but also text prompts.

### Clothing / Body Part Segmentation

This segments specific parts such as "upper body", "skirt", "face", and "hair".

![](https://gyazo.com/3221f2c1bfc5b2a0f4db328c820f5235){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/Clothing_Segmentation_(RMBG).json)

- Select the category you want to segment.

I used to use this often for tasks such as virtual try-on, but now object detection + segmentation may be more flexible and perform better.

---

## Practical Examples

By combining object detection, segmentation, and matting, you can generate more precise masks.

> Again, start with [SAM 3 / 3.1](/en/data-utilities/sam3/) first, since mask generation can now be completed with a single model.

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
