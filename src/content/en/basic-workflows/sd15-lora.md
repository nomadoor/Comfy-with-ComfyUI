---
layout: page.njk
lang: en
section: basic-workflows
slug: sd15-lora
navId: sd15-lora
title: "LoRA"
created: 2025-12-05
updated: 2026-08-26
summary: "LoRA in Stable Diffusion 1.5"
seoTitle: "How to Use LoRA in ComfyUI"
seoDescription: "How LoRA teaches a model new things and how to apply it in ComfyUI: downloading a LoRA, the text2image workflow, and LoRA with recent models."
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: ""
---

## What is LoRA?

[Textual Inversion](/en/basic-workflows/sd15-textual-inversion/) was a technique for packing "a look that's hard to describe in text" into a single word, but it can't make the model draw something it doesn't already know from scratch.

When you wanted the model to "draw things it couldn't draw before!", you used to have to fine-tune the entire model.
But that training is quite expensive.

That's where **LoRA (Low-Rank Adaptation)**, originally used for LLMs, came in.

Instead of rewriting the model's weights themselves, LoRA stores only the "changes" separately, as small add-on data.
It feels like loading an expansion pack onto the base model afterward: you can add new styles and characters.

---

## text2image with LoRA

### Downloading the LoRA

As an example, let's use a LoRA that gives images a pixel-art look.

- [8bitdiffuser 64x](https://civitai.com/models/185743)

- ```text
    📂ComfyUI/
      └── 📂models/
          └── 📂loras/
              └── PX64NOCAP_epoch_10.safetensors
    ```

### workflow

![](/media/basic-workflows/sd15-lora/legacy_gyazo_6f275d3cbc6c8487bf1645af06763aea.png){media=image}

[](/workflows/basic-workflows/sd15-lora/sd1_5_lora.json)

- 🟩 Add a `Load LoRA (Model and CLIP)` node.
  - Connect it in between `Load Checkpoint` and `CLIP Text Encode` / `KSampler`.
  - Both **MODEL** and **CLIP** need to go through `Load LoRA (Model and CLIP)`.
- `strength_model` / `strength_clip` : How strongly the LoRA is applied. `1.0` is the usual value, but lower it if the effect is too strong.
- 🟨 Trigger Word
  - Simply applying the LoRA already adds the ability to draw pixel art to the base model internally.
  - However, to reliably bring that ability out, you need to include the word the author used during training in your prompt.
  - This is called a trigger word. In this LoRA, `pixel_art` is the trigger word.

---

## Recent Models and LoRA

In the days of Stable Diffusion 1.5 and SDXL, LoRAs were often trained on both the diffusion model that creates the image and the text encoder that understands the prompt.

However, training the text encoder is difficult and can actually make prompts work less effectively.

SDXL has two text encoders, and later models began using large language models such as T5 and Qwen.

So today, the mainstream approach is to leave prompt understanding to the base text encoder and train only the diffusion model.

### ComfyUI workflow

A LoRA trained only on the diffusion model contains nothing to apply to the text encoder, so use the `Load LoRA` node instead of `Load LoRA (Model and CLIP)`.

![](/media/basic-workflows/sd15-lora/legacy_gyazo_975300eed9cca90f7086dda53c1ca413.png){media=image}

[](/workflows/basic-workflows/sd15-lora/flux_1_lora.json)
