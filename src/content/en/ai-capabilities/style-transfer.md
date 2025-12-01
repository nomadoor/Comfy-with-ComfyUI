---
layout: page.njk
lang: en
section: ai-capabilities
slug: style-transfer
navId: style-transfer
title: "Style Transfer"
summary: "The task of trying to transfer 'style' from a reference image, and its ambiguity."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## What is Style Transfer?

Honestly, "Style Transfer" is quite ambiguous as a task name.

Some common "Style Transfer" technologies only result in similar color tones to the reference image, or just change what is drawn in the reference image. But can we call that "style"?

Ideally, what should be called "style" should include many more elements.

- **For drawings**: What kind of pen or brush, brush strokes, character design, line thickness, habits of omission...
- **For photos**: Camera and lens, exposure, contrast, color reproduction, development/retouching trends...

Currently, what is called "Style Transfer" can be seen as **just a collective term for "reference-based operations that are hard to call Subject Transfer."**

---

## Texture/Touch Matching

> ![](https://gyazo.com/eb073a78be8340c24c61048066d877b9){gyazo=image}
> [cysmith/neural-style-tf](https://github.com/cysmith/neural-style-tf)

Classical Neural Style Transfer and filters/LoRAs like "oil painting style" or "watercolor style" fall into this category.

It's like an effect in video software.
It mimics the brush strokes and texture of the paint of another picture while maintaining the composition and shape of the original image.

Here, **touch and texture** are the main targets, and it does not step into Subject or character design.

---

## Art Style/Authorship Matching ("XX Style" Models)

Generation of "XX style" by LoRA or fine-tuned models trained on specific authors or groups of works.

It is an image of "copying together" including character design to some extent, such as how to draw lines, how to place colors, character faces, and how to draw backgrounds.

At this point, the boundary with Subject Transfer becomes quite suspicious. If it resembles too much, it approaches "copying the person (work)" rather than "style," and if it includes character design, it can be said that it is stepping into Subject.

---

## Using Only the "Atmosphere" of Reference Images (IP-Adapter, etc.)

This is a pattern where reference image-based methods used in Subject Transfer are used to bring the art style, color, and lighting closer while changing the Subject to something else.

Typically, you use a single picture of a favorite painter as a reference image, specify a scene with different content (different character, different composition) with a prompt, and inject only the "atmosphere of the reference image" with IP-Adapter or similar.

At this point, it becomes style transfer in the sense of "changing the Subject but borrowing only the atmosphere." However, where the Subject starts and where the style ends remains ambiguous.

---

## Summary

I apologize that my personal opinion has become strong regarding this page.

When drawing manga using image generation AI, there are many problems, but among them, specifying the art style is a very difficult problem.

Of course, there may be aspects where technology has not yet reached, but I feel that a definition of "art style" in image generation AI is necessary in the first place.
