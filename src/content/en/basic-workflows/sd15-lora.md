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
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: ""
---

## What is LoRA?

[Textual Inversion](/en/basic-workflows/sd15-textual-inversion/) was a technique to compress "appearances difficult to explain in text" into a single word, but it does not have the power to make the model draw something it doesn't know from scratch.

When you wanted to "make the model draw something it originally couldn't!", conventionally you needed to fine-tune the entire model.
However, training costs are quite high.

So, **LoRA (Low-Rank Adaptation)**, which was originally used in LLMs, came to be used.

LoRA uses a method where instead of rewriting the weights of the model itself, only the "difference" is saved externally as small additional data.
You can add new styles and characters to the base model as if loading an expansion pack later.

---

## text2image Applying LoRA

### Downloading LoRA

This time, as an example, let's use a LoRA that makes it look like pixel art.

- [8bitdiffuser 64x](https://civitai.com/models/185743)

- ```text
    📂ComfyUI/
      └── 📂models/
          └── 📂loras/
              └── PX64NOCAP_epoch_10.safetensors
    ```

### workflow

![](https://gyazo.com/6f275d3cbc6c8487bf1645af06763aea){gyazo=image}

[](/workflows/basic-workflows/sd15-lora/SD1.5_lora.json)

- 🟩 Add a `Load LoRA (Model and CLIP)` node.
  - Connect it so that it is sandwiched between `Load Checkpoint` and `CLIP Text Encode` / `KSampler`.
  - Pass both **MODEL** and **CLIP** through `Load LoRA (Model and CLIP)`.
- `strength_model` / `strength_clip` : The application strength of LoRA. Basically `1.0`, but lower it if it works too strongly.
- 🟨 Trigger Word
  - Just applying LoRA adds the ability to draw pixel art to the base model internally.
  - However, to ensure that ability is brought out, you need to include the word the author used during training in the prompt.
  - This is called a trigger word. In this LoRA, `pixel_art` is the trigger word.

---

## Recent Models and LoRA

In the days of Stable Diffusion 1.5 and SDXL, LoRAs were often trained on both the diffusion model that creates the image and the text encoder that understands the prompt.

However, training the text encoder is difficult and can actually make prompts work less effectively.

SDXL has two text encoders, and later models began using large language models such as T5 and Qwen.

Today, it is more common to leave prompt understanding to the base text encoder and train only the diffusion model.

### ComfyUI workflow

A LoRA trained only on the diffusion model contains nothing to apply to the text encoder, so use the `Load LoRA` node instead of `Load LoRA (Model and CLIP)`.

![](https://gyazo.com/975300eed9cca90f7086dda53c1ca413){gyazo=image}

[](/workflows/basic-workflows/sd15-lora/Flux.1_lora.json)
