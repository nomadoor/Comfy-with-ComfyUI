---
layout: page.njk
lang: en
section: ai-capabilities
slug: tag-caption-generation
navId: tag-caption-generation
title: Tag & Caption Generation
summary: "Technology to automatically add tags and descriptions (captions) from images."
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---

## What is Tag & Caption Generation?

It is a task to automatically add tags and descriptions (captions) from images.

It is used for creating datasets for LoRA and fine-tuning, and for generating prompts to create images similar to reference images.

---

## Tag Generation (Tagger)

This automatically assigns Danbooru-style tags and genre labels.

### WD Family Taggers

- **WD14-tagger / WD-tagger-v3 family**
  - ![](https://gyazo.com/a97fe3f3a2e72a2396df6ebc8c005b72){gyazo=image}
  - [](/workflows/ai-capabilities/tag-caption-generation/WD-tagger-v3.json)
  - Tagging models for illustration and anime images.
  - They provide very detailed tags such as characters, hair color, clothing, facial expressions, and composition.

### JoyTagger

- While the WD family is specialized for anime, this tagger supports more general images.
- It is by the same author as **JoyCaption** mentioned later, which is convenient if you want to align tagging and caption generation with the same family of tools.

---

## Local Caption Generation Models

When LLMs (VLMs) that could handle images were rare, many caption generation models running locally were proposed.
Moondream, LLaVA family, InternLM-XComposer2-VL, etc., the list goes on.

Looking at them from current standards, many are tough in terms of the balance between accuracy, stability, and cost, and those worth introducing anew are becoming limited.

Here, I will list only those that are still relatively easy to use.

### JoyCaption

- [JoyCaption](https://github.com/fpgaminer/joycaption)
- A **lightweight model specialized for caption generation** created by the same author as JoyTagger.
- Unlike VLMs aiming for general-purpose use, it specializes in "Image → Description," so you don't need to be particular about prompts and can use it casually.
- Being lightweight is the best part.

### Qwen-2.5 / Qwen3-VL Family

- As a lightweight local MLLM, this series can be said to be SoTA class at the moment.
- It supports not only general caption generation but also slightly more in-depth instructions like "Make it a writing style suitable for training captions."
- If you want to run an LVLM like ChatGPT locally, try using this for now.

---

## APIs like ChatGPT / Gemini

Just like with prompt generation, using closed models via API is also a good choice.

- Setup is very easy.
- Japanese captions can be handled as is.
- You can ask for post-processing together, like "Make it a slightly more technical description for LoRA training."

Setting up an MLLM is difficult, and computational costs tend to be high...
Being able to use it casually is the happiest thing above all.

---

## Reasons to Use Local Models

Not limited to LLMs, a big reason to use local models is **whether they can handle NSFW data**.

- Public APIs often blur or reject NSFW content.
- On the other hand, training datasets sometimes require "captions as they are" regardless of content.
- Even local models are often censored.

I think this is the sole reason why WD family taggers and JoyCaption still maintain a certain demand.

If you need completely local operation or are creating a dataset including NSFW, please use these local models in combination.
