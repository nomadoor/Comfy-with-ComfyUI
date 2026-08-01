---
layout: page.njk
lang: en
section: ai-capabilities
slug: conditioning
navId: conditioning
title: Conditioning
created: 2025-11-13
updated: 2026-08-01
summary: A mechanism to tell the diffusion model 'what kind of image I want'.
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## Diffusion Models are Random if Left Alone

Diffusion models have made it possible to generate meaningful images from noise.

However, as it is, it only outputs "something that looks like an image," and you cannot specify the contents, such as what kind of picture you want to output.

What is needed here is **Conditioning**.

---

## What is Conditioning?

In ComfyUI, the additional information that tells a diffusion model "what kind of image you want" or "where and how you want it changed" as it reduces noise is collectively called **Conditioning**.

Simply put, it's like a **guidepost that determines the direction of generation**.

---

## Conditioning by Text

The most common means of controlling image generation is probably the **text prompt**.
Let's see how to turn just text into Conditioning.

### Role of Text Encoder

The diffusion model cannot read sentences as they are.
Words like "dog," "forest," and "sunset" are just strings of characters.

Therefore, the **Text Encoder** plays the role of converting text into numerical values (vectors) that the diffusion model can easily handle.

- **Input**: Text (Prompt)
- **Output**: Vector representing its meaning (a set of numerical values)

The diffusion model uses this vector as a guidepost and reduces noise so that it becomes an image that matches the text prompt.

### CLIP-type Text Encoder

In models like Stable Diffusion 1.5, a text encoder based on a mechanism called **CLIP** is mainly used.

CLIP is a "seeing AI" that has learned a large number of "text and image pairs." It is characterized by being able to place images and text in the same "semantic space."

- If you show it a picture of a cat, it can judge that it is compatible with the sentence "a cat."
- This means that conversely, if you input the text "a cat," it will output a vector representing "cat-likeness."

The diffusion model (U-Net) uses this vector as a guidepost to judge "in which direction should I reduce the noise to make it an image that matches this text?"

### LLM / MLLM-type Text Encoder

Recent image and video models may use text encoders based on **LLMs** or **MLLMs (Multimodal LLMs)** instead of CLIP.

LLMs are the technology behind conversational AI such as ChatGPT and can process the context of a passage. MLLMs extend this ability to images and other types of input.

CLIP is good at matching short descriptions and concepts, but it has struggled to reflect long passages and complex spatial relationships in image generation.

LLMs and MLLMs can understand instructions like these more accurately.

{% mediaRow img="https://gyazo.com/21e83fc01b81ea693037ba3d17f39d5a{gyazo=image}", width=50, align="left" %}

`A dog on a log with a frog in a bog`

It correctly understands the complex spatial relationship: a dog on a log and a frog in a bog.

{% endmediaRow %}

From ComfyUI's perspective, however, CLIP, LLMs, and MLLMs all have the same role: converting text into vectors that represent its meaning and passing them to the diffusion model.

## Other Conditioning (Roughly)

This page focused on text, but actually, there are various Conditionings other than text.

### Reference Image-Based Conditioning

- **IP-Adapter family, etc.**
- Convey "make it close to this character, this coloring, the atmosphere of this photo"

### Structure-Based Conditioning

- **ControlNet, etc.** (Pose, Line Art, Depth Map, etc.)
- Convey "keep this pose, outline, depth"

All of these are forms of Conditioning that tell the diffusion model what to prioritize and which direction to move toward.
