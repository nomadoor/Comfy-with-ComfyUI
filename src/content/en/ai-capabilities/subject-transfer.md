---
layout: page.njk
lang: en
section: ai-capabilities
slug: subject-transfer
navId: subject-transfer
title: Subject Transfer
summary: Technology to make the same thing in a reference image appear in another
  scene.
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## What is Subject Transfer?

Officially, it is a task called "Subject-Driven Image Generation."

Subject refers not only to people but also to characters, stuffed animals, specific dogs, mascots, figures, etc., generally "that thing shown in this image."
Subject Transfer is a technology for generating images containing the same Subject shown in the reference image.

> Technology to transfer ID (person's face/identity) is included in Subject Transfer, but it is treated specially, and there are many technologies specialized for ID Transfer, so it is treated separately.

---

## LoRA

Needless to say, it is a method to learn and enable the model to draw things it cannot draw.

From its appearance to the present, nothing beats this in flexibility and stability.

The big problem is that **training is required**. There is no casualness.

---

## image2prompt

As the most primitive method, there is a method of "generating a caption from an image and running text2image with that caption."

You might think, "With such a primitive method?" but it is theoretically possible if there is an MLLM that can perfectly describe the reference image and an image generation model that can perfectly reproduce that description.

![](https://gyazo.com/26351f2e5d3eb17c623acd815ba8709c){gyazo=image}

[](/workflows/ai-capabilities/subject-transfer/Z-Image_Gemini-3.0.json)

The performance of recent models is making this possible. It is worth trying once as the "cheapest pseudo-Subject Transfer."

---

## SeeCoder / UnCLIP Family

image2prompt was a two-step process of "Image → Text → Embedding," but SeeCoder and UnCLIP systems **perform "Image → Embedding" directly**.

It creates a vector corresponding to text embedding from the image and uses it instead of the text encoder.

![](https://gyazo.com/d0196735e6162d464bd8764448d4088b){gyazo=image}

[](/workflows/ai-capabilities/subject-transfer/SeeCoder.json)

While there is less information loss in "textualization" than image2prompt, usability is inferior because it cannot be edited as text.

---

## IP-Adapter

It is the technology that first reached a practical level in business as a method of "doing Subject Transfer without training."

IP-Adapter is an adapter for inserting "conditions from images" into existing text2image models. It was widely used as a representative adapter following ControlNet.

It extracts feature vectors from the reference image and injects those features into the UNet (around Cross-Attention, etc.) to reflect them in the generated image. Since it can be used simultaneously with text prompts, you can use "Specify Subject by image" and "Specify scene and style by text" separately.

---

## IC-LoRA / ACE++

DiT-based models including Flux have the potential to "create consistent images."

Subject Transfer using this property is IC-LoRA / ACE++.

![](https://gyazo.com/8e01db8cebce51e7c47d9f958a94c61b){gyazo=image}

[](/workflows/ai-capabilities/subject-transfer/ACE_Plus_portrait.json)

Place the reference image (including the Subject) on the left side of the image canvas, mask the entire right side, and generate (inpaint). Since the model fills the right side while looking at the information on the left, it can "generate a new image using the same Subject as the left side."

---

## Instruction-Based Image Editing Models

"[Instruction-Based Image Editing Models](/en/ai-capabilities/instruction-based-image-editing/)" can also be used for Subject Transfer.

![](https://gyazo.com/358c8441ff70ee58135d8340bd691200){gyazo=image}

[](/workflows/ai-capabilities/subject-transfer/Qwen-Image-Edit_2509_multi-ref.json)

These models can edit images with text instructions like "put this dog in a different background" or "place this person in the forest."

Also, if it supports multiple reference images, you can do things like replacing "the clothes of the person in image A" with "the clothes of the person in image B."
