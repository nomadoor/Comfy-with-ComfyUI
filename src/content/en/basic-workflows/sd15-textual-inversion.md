---
layout: page.njk
lang: en
section: basic-workflows
slug: sd15-textual-inversion
navId: sd15-textual-inversion
title: "Textual Inversion"
created: 2025-12-05
updated: 2026-08-26
summary: "Textual Inversion in Stable Diffusion 1.5"
seoTitle: "Textual Inversion (Embeddings) in ComfyUI"
seoDescription: "Textual Inversion teaches a model a new word for a hard-to-describe look. Use embeddings in ComfyUI: download one and add it to text2image."
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: ""
---

## What is Textual Inversion?

Often you want to generate something but can't describe it well in text.

**Textual Inversion** is a technique that teaches the model such "looks or concepts that are hard to express in text" as a new word.

- First, prepare one dummy word like `<my_keyword>`.
- Show the model a handful to a few dozen images with a similar feel, paired with that word.
- The model learns the "features common to these images" and embeds that information into the single word `<my_keyword>`.

Well-known examples include `easynegative` and `badhandv4`.
They were made by collecting lots of "failed images" and training on them, packing the concept of "common image generation failures" into a single word.

However, it can't make the model draw something from scratch that the original model can't draw at all.
It only works for **things the model already knew, but you didn't know how to ask for**.

For those cases, you need methods that retrain the model itself, such as LoRA or full fine-tuning.

> [!NOTE]
> This one-word data created by Textual Inversion is conventionally called an *embedding*.

---

## Hardly Used Anymore

Textual Inversion does have the advantage of being light to train, but these days it has mostly been replaced by LoRA.

`easynegative`, `badhandv4`, and the like are basically unnecessary now too, partly because the models themselves have improved.

One exception: checkpoint or LoRA authors sometimes ship dedicated embeddings alongside their models to get closer to the output they have in mind.

To get the most out of a model, users need to enter "the prompt the author had in mind" correctly. But not every user will follow it, and writing a detailed prompt every time is a hassle.

So the author prepares embeddings in advance and has users add that word, which makes it easier to get close to the intended output.


---

## text2image with an Embedding

### Downloading the Embedding

Let's use an embedding called `Porsche 911 Turbo`.

- [Porsche 911 Turbo](https://civitai.com/models/54528/porsche-911-turbo?modelVersionId=58895)
-  ```text
    📂ComfyUI/
      └── 📂models/
          └── 📂embeddings/
              └── porsche911_ti.pt
    ``` 

### workflow

![](/media/basic-workflows/sd15-textual-inversion/legacy_gyazo_4631607c66ac4a2f6edfb442a786b79e.png){media=image}

[](/workflows/basic-workflows/sd15-textual-inversion/sd1_5_embedding.json)

- Call the embedding by writing `embedding:filename` in CLIP Text Encode.
  - e.g. `embedding:porsche911_ti`
