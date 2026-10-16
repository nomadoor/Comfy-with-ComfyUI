---
layout: page.njk
lang: en
section: ai-capabilities
slug: conditioning
navId: conditioning
title: Conditioning
created: 2025-11-13
updated: 2026-08-01
summary: How you tell a diffusion model "this is the image I want"
seoTitle: "What Is Conditioning in Diffusion Models?"
seoDescription: "How conditioning tells a diffusion model what you want: text encoders, CLIP-style vs. LLM-style encoders, and conditioning from images, pose, or depth."
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## Diffusion Models are Random if Left Alone

Diffusion models have made it possible to generate meaningful images from noise.

But on its own, it just produces "something plausible." You can't **specify what's in it**, like what kind of picture you want.

That's where **Conditioning** comes in.

---

## What is Conditioning?

In ComfyUI, **Conditioning** is the umbrella term for the extra information that tells a diffusion model, as it removes noise, "what kind of image you want" or "what to change, where, and how."

Simply put, it's a **signpost that sets the direction of generation**.

---

## Conditioning by Text

The most common way to control image generation is probably the **text prompt**.
Let's look at how plain text gets turned into Conditioning.

### What the Text Encoder Does

A diffusion model can't read sentences on its own.
To it, words like "dog," "forest," and "sunset" are just strings of characters.

That's where the **text encoder** comes in: it converts text into numbers (vectors) the diffusion model can work with.

- **Input**: Text (the prompt)
- **Output**: A vector representing its meaning (a bundle of numbers)

The diffusion model follows this vector as a signpost, removing noise so that the image ends up matching the text prompt.

### CLIP-type Text Encoder

Models like Stable Diffusion 1.5 mainly use a text encoder based on **CLIP**.

CLIP is a "seeing AI" trained on huge numbers of text–image pairs. Its key trait is that it can place images and text in the same "space of meaning."

- Show it a photo of a cat, and it can tell that the photo matches the text "a cat."
- Which means that, the other way around, if you give it the text "a cat," it outputs a vector representing "cat-ness."

The diffusion model (U-Net) uses this vector as a signpost to work out "which way should I remove noise so the image matches this text?"

### LLM / MLLM-type Text Encoder

Recent image and video models have started using text encoders based on **LLMs** or **MLLMs (multimodal LLMs)** instead of CLIP.

LLMs are the technology behind conversational AI such as ChatGPT and can process the context of a passage. MLLMs extend this ability to images and other types of input.

CLIP is good at matching short descriptions and concepts, but it has struggled to reflect long passages and complex spatial relationships in image generation.

LLMs and MLLMs can understand instructions like these more accurately.

{% mediaRow img="/media/ai-capabilities/conditioning/legacy_gyazo_21e83fc01b81ea693037ba3d17f39d5a.png{media=image}", width=50, align="left" %}

`A dog on a log with a frog in a bog`

It correctly understands the complex spatial relationship: a dog on a log and a frog in a bog.

{% endmediaRow %}

From ComfyUI's perspective, however, CLIP, LLMs, and MLLMs all have the same role: converting text into vectors that represent its meaning and passing them to the diffusion model.

## Other Conditioning (Roughly)

This page focused on text, but in practice there are many other kinds of Conditioning besides text.

### Reference Image-Based Conditioning

- **IP-Adapter family, etc.**
- Tells the model "lean toward this character, this coloring style, the mood of this photo"

### Structure-Based Conditioning

- **ControlNet, etc.** (Pose, Line Art, Depth Map, etc.)
- Tells the model "keep this pose, these outlines, this depth"

All of these are forms of Conditioning that tell the diffusion model what to prioritize and which direction to move toward.
