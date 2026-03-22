---
layout: page.njk
lang: en
section: ai-capabilities
slug: prompt-generation
navId: prompt-generation
title: Prompt Generation & Editing
summary: "Techniques to refine roughly written instructions into prompts that models can easily understand"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---

## What is Prompt Generation & Editing?

Back when prompts were the only parameter we could really touch, terms like "prompt engineering" and "spells" were popular (nostalgic, isn't it?).

Compared to current natural language prompts, prompts for Stable Diffusion 1.5 were like spells listing tags. The model's comprehension was low, and it was necessary to trial and error prompts while looking at the actual output.

However, writing this by hand every time is tedious, and it inevitably becomes a craftsmanship. The attempt to offload this to LLMs is what we call "Prompt Generation & Editing" on this page.

---

## Prompt Generation in the Stable Diffusion Era

Models of the Stable Diffusion / SDXL generation could not understand natural language well, and writing comma-separated tags was the basic style.

> masterpiece, (best quality:1.05), 1girl, blue hair, …

We devised ways such as lining up words with similar meanings or aligning with the quirks of the text used for model training... but it is troublesome to assemble "AI-oriented writing" by hand every time.

So, dedicated models appeared that "convert roughly written prompts into Stable Diffusion-style tag sequences."

### Representative Examples

- **[dart](https://github.com/nkchocoai/ComfyUI-Dart/)**
  - A lightweight model that generates Danbooru tag sequences. If you pass rough tags or descriptions, it turns them into dense tag sequences suitable for Stable Diffusion.

- **[Qwen 1.8B Stable Diffusion Prompt](https://huggingface.co/hahahafofo/Qwen-1_8B-Stable-Diffusion-Prompt)**
  - A smaller Qwen-based model specialized for SD prompt generation (Japanese -> English tag sequences, etc.).

Both are tools specialized in **vomiting prompts in a format that SD1.5 / SDXL can easily handle**, not whether they are easy for humans to read.

---

## Recent Models and Prompts

DiT-based models like FLUX and recent image editing models use **LLM-based text encoders** like T5 and Qwen for their text encoders.

Thanks to this, the ability to interpret natural language has improved far more than in the Stable Diffusion era, and techniques like so-called "spell prompts" have become almost unnecessary.

On the other hand, it does not mean that "you can stably get good results even if you write roughly."

The same goes for dealing with humans. It can be said that a good director's job is to concisely explain elements like the below.

- **Quantitative information such as distance, angle of view, focal length, time of day, number of sheets**
- **Specification for each element such as background, composition, lighting, style, facial expression**

However, writing this by hand every time is troublesome, so we use LLMs like ChatGPT. Even smooth requests like "Detail this Japanese prompt for FLUX.1," "Format it by adding composition, lighting, and camera information," or "Format this prompt for Qwen-Image" are enough to boost the density of the prompt.

Some image generation models have dedicated LLMs prepared, but it does not mean that they are improved that significantly. The performance of the image generation model itself is more important.

---

## Operation in ComfyUI

There are several LLMs that can be run locally in ComfyUI, but please also consider **calling Gemini or ChatGPT with API nodes**.

![](https://gyazo.com/94496f33d758475aa62f614978ea2252){gyazo=image}

[](/workflows/ai-capabilities/prompt-generation/Z-Image_Gemini-3.json)

I am one of those who want to stick to local models, but honestly, speaking of PC specs, it is often more severe to use a decent quality LLM locally on a regular basis than to run an image generation model.

Thankfully, LLM API usage fees are quite cheap. I still haven't used up the $5 credit I bought a long time ago (´・ω・｀)
