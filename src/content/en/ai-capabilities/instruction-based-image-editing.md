---
layout: page.njk
lang: en
section: ai-capabilities
slug: instruction-based-image-editing
navId: instruction-based-image-editing
title: Instruction-Based Image Editing
created: 2025-12-01
updated: 2026-03-02
summary: Models that handle all kinds of image editing tasks from text instructions
  alone
seoTitle: "What Is Instruction-Based Image Editing?"
seoDescription: "Models that edit images from text instructions. Their history from InstructPix2Pix through DiT and in-context models to multi-reference and video editing."
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## What is Instruction-Based Image Editing?

On this site, **instruction-based image editing models** means models that take an image plus text instructions (and reference images if needed) and edit the image according to those instructions.

Previously, you needed a different technique or workflow for each task:

- Style Transfer → LoRA or IP-Adapter
- Object Removal/Replacement → Inpainting
- Virtual Try-On → Dedicated Models

Instruction-based image editing models move toward **"handling all of these with text instructions."**
nano banana, the current SOTA, falls into this category too.

---

## History of Development

Let's get a rough picture of how instruction-based image editing developed.

### InstructPix2Pix — The Starting Point of Editing by Instruction

**InstructPix2Pix**, released in 2023, opened the door to "instruction-based image editing."

![](https://gyazo.com/09fac2eec2d2fba279e9f4f185522964){gyazo=image} ![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_afbd89b61246690907e2bfde3bb0b8fa.png){media=image}
> Turn the car red

It was trained on pairs of images and text instructions for editing them, with the goal of editing images according to whatever the user writes.

### DiT and In-Context Approaches

It was only discovered later, but DiT models like Flux already had the **ability to create images that stay consistent across multiple pictures**.

**IC-LoRA / ACE++** are frameworks that apply this property to editing.

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_4d84f2e35f1c7fe99a322d8ee3eaec43.png){media=image}

[](/workflows/ai-capabilities/instruction-based-image-editing/ace_plus_portrait_face_swap.json)

- Place a "reference image" on the left side of the image canvas.
- Mask the right side and have the model generate it.
- Add text instructions so it "edits the right side while looking at the left."

This so-called **side-by-side technique** showed that you could "edit while keeping the features of the reference image" without any special adapter.

### Emergence of Image Editing Models

After that, dedicated image editing models derived from text2image models appeared, such as **FLUX.1 Kontext**, **Qwen-Image-Edit**, and **OmniGen**, and "image editing" started to be treated as its own category, separate from text2image.

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_5a7d5ddf5327f52ccc01acb5aae79a4a.png){media=image}

[](/workflows/ai-capabilities/instruction-based-image-editing/flux_1_kontext.json)

What they share is the aim of handling editing tasks (understanding the input image and deciding "what to change, and how much" based on the text instructions) in a single, (fairly) general-purpose model.

### The Multi-Reference Era

Early instruction-based image editing assumed one input image: "1 image" + "text instruction" → edited result.

Starting with **Qwen-Image-Edit-2509** and **Flux.2**, handling multiple reference images at once has become the clear trend.

![](/media/ai-capabilities/instruction-based-image-editing/qwen_image_edit_2509_object_swap.png){media=image}

[](/workflows/ai-capabilities/instruction-based-image-editing/qwen_image_edit_2509_object_swap.json)

- Image A: Person (Subject)
- Image B: Clothes (For Try-On)
- Image C: Background or Style

You can now edit while "mixing" several references like this, so tasks such as subject transfer, ID transfer, virtual try-on, and style or lighting transfer are starting to overlap heavily with instruction-based editing.

### Video Model-Based Editing

Another line of work repurposes video generation models for editing. **FramePack's 1-frame inference** and **ChronoEdit** are the main examples.

The idea: video models are built to keep multiple frames consistent, so if you treat the before and after images as a "short video," even big changes can be bridged naturally.

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_dbf2c60d457434bccb4428108bb31164.png){media=image}
> [!NOTE]
> The idea itself is old. Back when AnimateDiff was the main thing, I used to make animations of a character pulling different expressions and use them as character variations.

There are still plenty of problems: the consistency can be so strong that big changes are hard, and it outputs dozens of video frames when an edit only needs one image. Still, I think it's a technology worth watching.

---

## What Instruction-Based Image Editing Can Do

Instruction-based image editing models can handle a lot of tasks. This site covers them in detail on their own pages, so here I'll just run through the names.

### Style Transfer

Changes the art style or feel, like "make it an oil painting" or "make it anime style."

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_9cb22fffbc3c4252d73d8126b551112c.png){media=image} ![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_e1525d66b933d4a87fc5d4ee612ee7f0.png){media=image}

### Object Replacement

Swaps things out, like "turn this cup into a mug" or "turn the car into a motorcycle."

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_53f14e6d461b52d124d1f269ebf9663e.jpg){media=image} ![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_01ad4af4f435f48394b2a7a1af4bbd20.png){media=image}

### Object Removal

Removes unwanted things like passersby, signs, and trash.

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_a573409de28653a2cf68d6d86bf3e17c.jpg){media=image} ![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_b8d68c03b7ca8f9e7baece3700323ea9.png){media=image}

### Background Change

Changes only the background, such as indoors → beach or day → night.

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_e19dc759345f54e3115ca7518c5af7e7.jpg){media=image} ![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_937a2c1d9fe5f071582c984fccf6063e.png){media=image}

### Text Editing

Changes the text on signs or packaging, swaps out typography, and so on.

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_ac1594d861c1357dad7ed73d229ffef2.png){media=image} ![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_c91c136c690e7a82c1f964b1659d370b.png){media=image}

### Camera Angle Change

Composition-type changes like "pull back a little," "from a low angle," or "seen from the side."

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_eaea9d1804747fc905f3289ed6492d91.png){media=image} ![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_ba1a72c2649068502251de53d04e1483.png){media=image}

### Virtual Try-On

Changes what a person or character is wearing.

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_6c347851817bca776c29adb85120ad90.png){media=image} ![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_8ab258d34095ebfe4c44f4df38daf7c0.png){media=image}

### ControlNet-like Generation

ControlNet generates images from a condition like a stick figure or depth map plus text, which you can think of as a kind of "instruction-based image editing."
Today's instruction-based image editing models are trained to handle basic ControlNet-style generation.

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_25e1001b36c95236106af1cfb293444d.png){media=image} ![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_cce6069cd28da9b8ea71dc546cc6e0c4.png){media=image}

### Refining Rough Collages

You make a rough collage and have the model "edit" it so it looks natural.

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_5771f27e35298b919e3f216847214e6f.png){media=image}

- Paste in objects, choosing their position and size yourself.
- Then tell it "make it a natural photo" or "make it look like one seamless picture."

This way, you can combine intuitive layout control with instruction-based editing.
Details are covered on the "[Refining Rough Collages](/en/ai-capabilities/collage-refine/)" page.

### Scribble Instructions

You give instructions by combining rough marks with text, like "turn the face toward the arrow too" or "put a bus where the red circle is."

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_378ec283b1acabfe3bc9af5fc02b013f.png){media=image} ![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_3275c49767be7cf8487af00a41a9cc52.png){media=image}

The weak point of instruction-based image editing is that text alone makes it hard to convey exact positions or how much to change.
Ideally, we'd be able to "give instructions with a pen" to AI, the way a producer marks up a draft for a designer.

Not many open-source models can do this well yet, but once it works, it'll be the ideal UI/UX for working together with AI.

## Easy to Create LoRAs

Thanks to the community building out training tools, making editing LoRAs is relatively easy.

For a LoRA that converts images into your own illustration style, about 10 before/after image pairs will get you a LoRA of decent quality.

"Refining rough collages" is a perfect example: what counts as "image editing" is actually a very open question.
There may be groundbreaking kinds of edits nobody has found yet. Give it a try!
