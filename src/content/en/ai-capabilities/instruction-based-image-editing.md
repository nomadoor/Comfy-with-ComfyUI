---
layout: page.njk
lang: en
section: ai-capabilities
slug: instruction-based-image-editing
navId: instruction-based-image-editing
title: Instruction-Based Image Editing
created: 2025-12-01
updated: 2026-03-02
summary: A group of models that perform various image editing tasks simply by following
  text instructions.
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## What is Instruction-Based Image Editing?

Models that take an image and text instructions (and reference images if necessary) as input and edit the image according to those instructions are referred to as **Instruction-Based Image Editing Models** on this site.

Previously, it was necessary to build separate technologies and workflows for each task, such as:

- Style Transfer → LoRA or IP-Adapter
- Object Removal/Replacement → Inpainting
- Virtual Try-On → Dedicated Models

Instruction-based image editing models have evolved to handle all these tasks **"collectively with text instructions."**
Currently, **nano banana**, which can be considered SOTA, also falls into this category.

---

## History of Development

Let's briefly look at how instruction-based image editing has developed.

### InstructPix2Pix — The Starting Point of Editing by Instruction

**InstructPix2Pix**, announced in 2023, opened the path for "Instruction-Based Image Editing."

![](https://gyazo.com/09fac2eec2d2fba279e9f4f185522964){gyazo=image} ![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_afbd89b61246690907e2bfde3bb0b8fa.png){media=image}
> Turn the car red

This model was trained on pairs of "images" and "text instructions for editing them," aiming to edit images according to user-written instructions.

### DiT and In-Context Approaches

It was later discovered that DiT-based models like Flux originally possessed the **ability to create consistent images across multiple frames/inputs**.

The framework that applied this property to editing is **IC-LoRA / ACE++**.

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_4d84f2e35f1c7fe99a322d8ee3eaec43.png){media=image}

[](/workflows/ai-capabilities/instruction-based-image-editing/ace_plus_portrait_face_swap.json)

- Place a "reference image" on the left side of the image canvas.
- Mask the right side and generate it.
- Combine with text instructions to "edit the right side while looking at the left side."

By using this so-called **side-by-side technique**, it was shown that "editing while retaining the features of the reference image" is possible without using special adapters.

### Emergence of Image Editing Models

Subsequently, as derivatives of text2image models, dedicated "image editing" models such as **FLUX.1 Kontext**, **Qwen-Image-Edit**, and **OmniGen** appeared, and "image editing" began to be treated as a separate category from text2image.

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_5a7d5ddf5327f52ccc01acb5aae79a4a.png){media=image}

[](/workflows/ai-capabilities/instruction-based-image-editing/flux_1_kontext.json)

What they have in common is that they attempt to handle editing tasks—understanding the content of the input image and adjusting "where and how much to change" according to text instructions—generically within a single model.

### The Multi-Reference Era

Early instruction-based image editing assumed a single input image: "1 Image" + "Text Instruction" → Editing Result.

Since **Qwen-Image-Edit-2509** and **Flux.2**, the trend of handling multiple reference images simultaneously has become stronger.

![](/media/ai-capabilities/instruction-based-image-editing/qwen_image_edit_2509_object_swap.png){media=image}

[](/workflows/ai-capabilities/instruction-based-image-editing/qwen_image_edit_2509_object_swap.json)

- Image A: Person (Subject)
- Image B: Clothes (For Try-On)
- Image C: Background or Style

Like this, it is now possible to edit while "mixing" multiple references, and tasks such as Subject Transfer, ID Transfer, Virtual Try-On, and Style/Lighting Transfer are beginning to overlap significantly with instruction-based editing.

### Video Model-Based Editing

Another trend involves diverting video generation models for editing. **FramePack's 1-frame inference** and **ChronoEdit** are representative examples.

The idea is that since video models can handle "consistency across multiple frames" to begin with, if we consider the pre-edit and post-edit states as a "short video," even large changes can be connected naturally.

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_dbf2c60d457434bccb4428108bb31164.png){media=image}
> This idea itself has been around for a long time. Even when AnimateDiff was mainstream, I used to create animations of characters with various expressions to create character variations.

Although there are still many issues, such as consistency being too strong making large changes difficult, or outputting dozens of frames as a video when only one image is needed for editing, I think this is a technology to watch in the future.

---

## What Instruction-Based Image Editing Can Do

There are quite a few tasks that instruction-based image editing models can handle. Since this site covers details on individual pages, I will just organize the names here.

### Style Transfer

Performs conversions such as changing the art style or taste, like "oil painting style" or "anime style."

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_9cb22fffbc3c4252d73d8126b551112c.png){media=image} ![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_e1525d66b933d4a87fc5d4ee612ee7f0.png){media=image}

### Object Replacement

Performs replacements such as "change this cup to a mug" or "change the car to a motorcycle."

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_53f14e6d461b52d124d1f269ebf9663e.jpg){media=image} ![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_01ad4af4f435f48394b2a7a1af4bbd20.png){media=image}

### Object Removal

A task to remove "unwanted things" such as passersby, signs, and trash.

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_a573409de28653a2cf68d6d86bf3e17c.jpg){media=image} ![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_b8d68c03b7ca8f9e7baece3700323ea9.png){media=image}

### Background Change

Editing that changes only the background, such as Indoor → Seaside, Day → Night.

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_e19dc759345f54e3115ca7518c5af7e7.jpg){media=image} ![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_937a2c1d9fe5f071582c984fccf6063e.png){media=image}

### Text Editing

Changes text on signs or packages, replaces typography, etc.

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_ac1594d861c1357dad7ed73d229ffef2.png){media=image} ![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_c91c136c690e7a82c1f964b1659d370b.png){media=image}

### Camera Angle Change

Performs composition-oriented changes such as "zoom out a bit," "low angle," or "side view."

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_eaea9d1804747fc905f3289ed6492d91.png){media=image} ![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_ba1a72c2649068502251de53d04e1483.png){media=image}

### Virtual Try-On

A task to change the clothes of a person or character.

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_6c347851817bca776c29adb85120ad90.png){media=image} ![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_8ab258d34095ebfe4c44f4df38daf7c0.png){media=image}

### ControlNet-like Generation

ControlNet generated images with conditions like stick figures or depth maps + text, but this can be considered a type of "Instruction-Based Image Editing."
Current instruction-based image editing models are trained to perform basic ControlNet-like image generation.

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_25e1001b36c95236106af1cfb293444d.png){media=image} ![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_cce6069cd28da9b8ea71dc546cc6e0c4.png){media=image}

### Refining Rough Collages

A task where you create a collage image (rough collage) and have it "edited" to look natural.

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_5771f27e35298b919e3f216847214e6f.png){media=image}

- You decide the position and size yourself and paste the objects.
- Then, instruct it to "make it a natural photo" or "make it look seamless as a single picture."

In this way, you can combine intuitive layout specification with instruction-based editing.
Details are covered on the "[Refining Rough Collages](/en/ai-capabilities/collage-refine/)" page.

### Scribble Instructions

Instructions are given by combining rough drawings with text, such as "Make the face look in the direction of the arrow" or "Place a bus at the location of this red circle."

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_378ec283b1acabfe3bc9af5fc02b013f.png){media=image} ![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_3275c49767be7cf8487af00a41a9cc52.png){media=image}

The weakness of instruction-based image editing is that it is difficult to express specific positions and amounts of change with text alone.
Just as a producer gives instructions to a designer with a pen, it would be ideal if we could "give instructions with a pen" to AI as well.

There are not many open-source models that can do this sufficiently yet, but if completed, it will be the ideal UI/UX for collaboration with AI.

## Easy to Create LoRAs

Thanks to the community preparing the training environment, it is relatively easy to create LoRAs for editing.

If it's a LoRA that converts to your illustration style, you can create a LoRA of decent quality by preparing about 10 pairs of pre-edit and post-edit images.

"Refining Rough Collages" is exactly that, but "what is considered image editing?" is actually a question with a high degree of freedom.
There may be innovative edits that haven't been found yet. Please give it a try!
