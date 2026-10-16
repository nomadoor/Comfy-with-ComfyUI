---
layout: page.njk
lang: en
section: basic-workflows
slug: joycaption
navId: joycaption
title: "JoyCaption"
created: 2025-12-09
updated: 2026-03-02
summary: "Image captioning with JoyCaption"
seoTitle: "JoyCaption in ComfyUI: Accurate Image Captioning"
seoDescription: "Use JoyCaption in ComfyUI, a VLM that writes accurate captions for photos, anime, and illustrations: installing and configuring the node."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
tags: ["tag-caption-generation"]
---

## What is JoyCaption?

[JoyCaption](https://github.com/fpgaminer/joycaption) is a VLM (Visual Language Model) for generating captions from images.

It generates accurate captions for a wide range of images, from photos to anime and digital art. Above all, it handles NSFW images without censoring them, so it's still popular as a "dedicated captioning model" even now that more capable general-purpose MLLMs are around.

It's built on a LLaVA-family multimodal model, so it isn't exactly lightweight compared with taggers, but as a ComfyUI node it's easy to drop into a local image generation pipeline.


---

## Custom Node

- [1038lab/ComfyUI-JoyCaption](https://github.com/1038lab/ComfyUI-JoyCaption)

---

## JoyCaption Node

Generates a caption from the input image.

![](/media/basic-workflows/joycaption/legacy_gyazo_c14e87a362f349d3e649af28622262f1.png){media=image}

[](/workflows/basic-workflows/joycaption/joycaption.json)

- `prompt_style`
    - **Descriptive**
        - Writes fairly long, formal prose.
        - Handy when you want a detailed record of what's in the image, but tends to be too wordy to use as a prompt as is.
    - **Straightforward**
        - Writes in a concise, objective style.
        - Easy to reuse as is for prompts or LoRA training captions.
    - **Stable Diffusion Prompt**
        - Writes in Stable Diffusion prompt format.
    - **Danbooru tag list**
        - Lists tags in Danbooru tag format (e.g., `1girl`, `blue_hair`).

- `caption_length`
    - Sets how long the caption should be (shorter/longer).

- `Extra Options`
    - Adds extra instructions to guide the captioning.
    - For example, you can tell it whether to "describe in detail" or "barely mention" things like camera angle, image quality/resolution, or NSFW elements.
