---
layout: page.njk
lang: en
section: ai-capabilities
slug: conditioning
navId: conditioning
title: "Conditioning"
summary: "A mechanism to tell the diffusion model 'what kind of image I want'."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## Diffusion Models are Random if Left Alone

Diffusion models have made it possible to generate meaningful images from noise.

However, as it is, it only outputs "something that looks like an image," and you cannot specify the contents, such as what kind of picture you want to output.

What is needed here is **Conditioning**.

---

## What is Conditioning?

In ComfyUI, the following are collectively called **Conditioning**:

> Additional information to convey
> "what kind of image you want" or "where and how you want it changed"
> when the diffusion model reduces noise.

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

### MLLM-type Text Encoder

In recent image and video models, there is a trend to use text encoders based on **MLLM (Multimodal LLM)** instead of CLIP.

MLLM is almost like ChatGPT. It can converse by itself and answer questions while looking at images.

Since CLIP only looks at the correspondence between words and images, it was not good at understanding long sentences or complex positional relationships and reflecting them in image generation.

On the other hand, MLLM can understand with much higher accuracy.

> ![Z-Image](https://gyazo.com/21e83fc01b81ea693037ba3d17f39d5a){gyazo=image}
> **Example**: `A dog on a log with a frog in a bog`
> (Accurately understands complex positional relationships such as a dog on a log and a frog in a bog)

However, from the perspective of ComfyUI, whether using CLIP or MLLM, the role itself of "converting Text → Vector representing meaning and passing it to the diffusion model" is the same.

## Other Conditioning (Roughly)

This page focused on text, but actually, there are various Conditionings other than text.

### Reference Image-Based Conditioning
- **IP-Adapter family, etc.**
- Convey "make it close to this character, this coloring, the atmosphere of this photo"

### Structure-Based Conditioning
- **ControlNet, etc.** (Pose, Line Art, Depth Map, etc.)
- Convey "keep this pose, outline, depth"

### Region-Based Conditioning
- **Masks for Inpainting, etc.**
- Convey "redraw only this part, don't change the surroundings much"

The role is the same for all of them.

> A **guidepost** that instructs what to prioritize and which direction to move towards
> when the diffusion model reduces noise.

Thinking of it this way is sufficient.
