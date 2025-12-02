---
layout: page.njk
lang: en
section: data-utilities
slug: ai-mask-generation
navId: ai-mask-generation
title: "AI Mask Generation"
summary: "About Matting, Segmentation, and Object Detection"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/499c4756e1b2adb1424f9cab9829806b.png"
---

## AI Mask Generation

There are many situations where you create masks in inpainting, etc., but it is hard to draw them by hand or prepare mask images every time. Above all, it cannot be automated.

So let's use various AIs to automatically generate masks.

- **Object Detection**
  - Detects objects in an image with a **Bounding Box** according to instructions such as text.
- **Matting**
  - Separates the **foreground** and **background** with a mask with gradation (Alpha Matte) (often becomes a binary mask in ComfyUI).
- **Segmentation**
  - Extracts the **"shape of the object"** with a black and white mask (binary mask).

---

## Required Custom Nodes

There are many types of technologies to do these, and accordingly, there are various custom nodes, but for now, the following should suffice.

- **[1038lab/ComfyUI-RMBG](https://github.com/1038lab/ComfyUI-RMBG)**
  - Supports many technologies from matting to segmentation, and is easy to use.
- **[ltdrdata/ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack)**
- **[ltdrdata/ComfyUI-Impact-Subpack](https://github.com/ltdrdata/ComfyUI-Impact-Subpack)**
  - It is for doing work called Detailer, and it has some quirks to use simply as mask generation.
- **[kijai/ComfyUI-Florence2](https://github.com/kijai/ComfyUI-Florence2)**
  - Runs an MLLM called Florence2.
- **[kijai/ComfyUI-segment-anything-2](https://github.com/kijai/ComfyUI-segment-anything-2)**
  - Runs a segmentation model called SAM 2, used in a set with Florence2.

---

## Object Detection

![](https://gyazo.com/1a10dcd7dcf8f72eee275a3d8484f882){gyazo=image}

As the name suggests, it can identify the position of a specific object in an image and outputs a square range called BBOX.

There are various technologies with characteristics in accuracy, versatility, and speed.

### YOLO Family

An ultra-fast detection technology aimed at detecting objects in real time.

Basically, since one model (face only, hand only, etc.) is created for the type of object you want to detect, you need to make it yourself if there is no model, and it is unsuitable when you want to detect multiple types.

![](https://gyazo.com/e8b4e05d42db0b613aee4467a8dca633){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/Simple_Detector_(SEGS)-YOLO_face.json)

Suitable when high-speed processing is required (when a specific target is decided, such as face detection).

- **How to get models**: `ComfyUI Manager` -> `Install Models` -> Search for YOLO to find various YOLO models besides faces.
- I won't paste the link, but if you search for Adetailer on Civitai, you can also find models specialized for NSFW.

### Grounding DINO

Detects objects specified by text and outputs a BBOX.

Unlike YOLO, it is easy to use because you can specify objects with arbitrary text such as "white dog" or "red car", and you can also detect multiple objects at the same time.

Since there is no node that runs Grounding DINO alone, I will introduce a workflow combined with segmentation below.

### Florence-2

Florence-2 is a Vision Language Model that can understand images as text.

It can do various things such as caption generation, and one of them is object detection.

![](https://gyazo.com/eac97524bcdcb395cdd5172c3694da41){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/Florence2Run.json)

- **Model**: I don't feel much difference, but please try various ones. The model is downloaded automatically.
- **Prompt**: Describe the object you want to detect.
- **task**: caption_to_phrase_grounding
- **output_mask_select**: If there are several detected items, select which output to use (if blank, all are output).

Suitable when you want to specify the target with complex sentence expressions or utilize the understanding power of LLM (although the speed is slow).

---

## Matting

The contents of services and functions provided under the name "Background Removal" are basically the same as this.

You cannot specify objects, and "what exactly refers to the background?" is left to AI, so it is good to use when you simply want to remove the background or when the boundary between the foreground and background is clear.

### BiRefNet

Probably the most used model. Speed and performance are perfect, so you should use this for now.

![](https://gyazo.com/5ce4bac5b8c8dc13fbbb0468c44bf752){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/BiRefNet_Remove_Background_(RMBG).json)


- If you set `Background` to `Alpha`, a transparent image with an alpha channel added is output.
- **Note**: Since the output at this time is **RGBA**, an error may occur if used in image2image etc. (see [Mask & Alpha Channel](/en/data-utilities/mask-alpha/)).

There are several derivative models depending on the application, such as ToonOut which is good at anime images. Please try various ones.

---

## Segmentation

### SAM (Segment Anything Model)

Currently the most famous segmentation model.

It knows "shapes of things" well, and if you specify a car etc. in a photo with a point or box, it accurately finds the outline and makes it a mask.

![](https://gyazo.com/ae3a00df59eb97f8612b700ff90aac3b){gyazo=image}

This is a function to segment the specified object by pressing a point, but basically it is often combined with object detection.

- 1. Right-click on image node -> `Open in SAM Detector`
- 2. Specify the object you want to extract by clicking with the left mouse button (right click for the range you want to exclude)
- 3. Press `Detect` to generate a mask

> SAM is currently being developed, and there are Initial / SAM 2 / SAM 2.1 / SAM 3.
>
> The latest version, SAM 3, supports not only point and BBOX instructions but also text instructions. I will introduce it again below, but honestly, SAM 3 alone is enough for AI mask generation of still images.

### Clothing / Body Parts Segmentation

Performs segmentation of specific parts such as "upper body", "skirt", "face", "hair".

![](https://gyazo.com/3221f2c1bfc5b2a0f4db328c820f5235){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/Clothing_Segmentation_(RMBG).json)

- Select the category you want to segment.

I used to use it often for tasks such as changing clothes, but now object detection + segmentation might be more versatile and have better performance.


---

## Combining

By combining object detection, segmentation, and matting, more precise mask generation becomes possible.

### YOLO x SAM

![](https://gyazo.com/2c1fb7ed9c7fcc6242e48b9e6e405c27){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/YOLO_face-SAM.json)

A combination of high-speed face detection (YOLO) and SAM (initial).

### Grounding DINO x SAM

![](https://gyazo.com/c7b4ed29a8dae26fb9c666b137091ab4){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/Grounding_DINO_HQ-SAM.json)

A combination of Grounding DINO and HQ-SAM, an improved version of SAM.

It is one of the most used combinations because it can generate high-precision masks while specifying the target by text.

### Florence2 x SAM2

![](https://gyazo.com/677607c761c38defde753681398d6e1f){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/Florence2_SAM2.1.json)

A combination of Florence2 and SAM2.1.

Anything is fine if it is an easy-to-understand target such as a person or an animal, but when you want to specify with complex conditions such as "a man wearing sunglasses" or "a cat lying under a tree", such LLM-based models demonstrate their power.

### SAM 3

![](https://gyazo.com/5ab4819ba05efd277c18ae27046f7f58){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/SAM3_Segmentation_(RMBG).json)

The latest version of SAM, which also supports text instructions, allowing you to execute object detection and segmentation at once.

Accuracy, performance, and speed are all excellent, so let's use this for now (´ε｀ )

If you want to do something more complex, try custom nodes like [Ltamann/ComfyUI-TBG-SAM3](https://github.com/Ltamann/ComfyUI-TBG-SAM3?tab=readme-ov-file).

### SAM 3 x BiRefNet

![](https://gyazo.com/82c4c2d947a3ea9c98b46e05a05d542f){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/SAM3_BiRefNet.json)

Segmentation is originally for distinguishing objects and is not used for fine cutouts.

On the other hand, matting can handle fine things like hair and semi-transparent things like glass.

By combining these, you can multiply each other's abilities.
