---
layout: page.njk
lang: en
section: basic-workflows
slug: flux-1-kontext
navId: flux-1-kontext
title: "Flux.1 Kontext"
summary: "Instruction-based image editing with Flux.1 Kontext."
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/79c075e47d999e282c8a2cd3c05f10ef.png"
tags: ["instruction-based-image-editing","collage-refine"]
---

## What is Flux.1 Kontext?

Flux.1 Kontext is an instruction-based image editing model based on [Flux.1](/en).

It is undoubtedly this model that sparked the popularity of the task of AI image editing such as nano banana.

Like Flux.1, there are three variations: `pro`, `max`, and `dev`, but only `dev` is available for local use.


---

## What is Instruction-based Image Editing?

A model that edits an image according to instructions when you input an image and text instructions is called an **instruction-based image editing model** on this site.

For example, suppose you want to dye the hair of a woman in a photo red.
Until now, you would mask the hair, add ControlNet Canny because you don't want to change the hairstyle, and then perform inpainting with a prompt like "photo of a woman with red hair".

It is easy with instruction-based image editing. Just pass the image to the model and **instruct** it like a producer asking a designer, "Make the woman's hair red."

Change facial expressions, remove disturbing objects, change the art style.

Everything can be achieved with just one model and prompt.

---

## Model Download

Even with Kontext, the basic configuration is the same as the regular Flux.1.

* diffusion_models

  * [flux1-dev-kontext_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/flux1-kontext-dev_ComfyUI/blob/main/split_files/diffusion_models/flux1-dev-kontext_fp8_scaled.safetensors)

* clip / T5 / VAE

  * [clip_l.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/clip_l.safetensors)
  * [t5xxl_fp8_e4m3fn_scaled.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/t5xxl_fp8_e4m3fn_scaled.safetensors)
  * [ae.safetensors](https://huggingface.co/black-forest-labs/FLUX.1-schnell/blob/main/ae.safetensors)

* gguf (Optional)

  * [flux1-kontext-dev.gguf](https://huggingface.co/QuantStack/FLUX.1-Kontext-dev-GGUF/blob/main/flux1-kontext-dev.gguf)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── flux1-dev-kontext_fp8_scaled.safetensors
    ├── 📂clip/
    │   ├── clip_l.safetensors
    │   └── t5xxl_fp8_e4m3fn_scaled.safetensors
    ├── 📂vae/
    │   └── ae.safetensors
    └── 📂unet/
        └── flux1-kontext-dev.gguf      ← Only when using gguf
```

---

## Workflow (Basic)

The workflow of Kontext itself is a simple configuration that just adds `ReferenceLatent` to the regular Flux.1.

![](https://gyazo.com/b872b5de146a585c0c9745168d5f1dae){gyazo=image}

[](/workflows/basic-workflows/flux-1-kontext/Flux.1-Kontext.json)

* 🟪 Load `flux1-dev-kontext_fp8_scaled.safetensors`.
* 🟩 Resize the input image to a resolution suitable for Kontext with the `FluxKontextImageScale` node.
  - There are resolutions recommended by Flux, and **a resolution with a close aspect ratio is automatically selected** from them.
* 🟩 Convert the resized image to latent and connect it to `ReferenceLatent`.

---

## How to write prompts

Basically, follow the official prompting guide.
- [FLUX.1 Kontext Prompting Guide](https://docs.bfl.ai/guides/prompting_guide_kontext_i2i)

However, there is no special notation.
If you write what you want to do in English in the form of **"Do △△ to ◯◯"**, it will generally work.

If something changes that you don't want to change (e.g., the background changes even though you only want to change the hairstyle), explicitly state the "conditions you don't want to change" as follows:

- e.g. `Keep the person's pose, position, and size the same.`

> However, due to the performance of the model, it often does not follow instructions well.
> You shouldn't ask for too much yet.

---

## Capabilities

{% mediaRow img="https://gyazo.com/79c075e47d999e282c8a2cd3c05f10ef {gyazo=image}", width=50, align="left" %}
### Image Editing

```text
Change the hair to a messy blonde bob.
```

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/677d45b54c4f1c9c278ae230e7b000b9 {gyazo=image}", width=50, align="left" %}
### Style Transfer

```text
This character is made out of Lego blocks.
```

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/7a409e39ee00b1766ee164df76b0ac7c {gyazo=image}", width=50, align="left" %}
### Object Removal

```text
Remove the woman
```

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/49bb5579217513e0b774d0952579bd4f {gyazo=image}", width=50, align="left" %}
### Text Replacement

```text
Replace [OPEN] with [FLUX]
```

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/6abbbb3aacaddf5df09d459f29466e93 {gyazo=image}", width=50, align="left" %}
### Subject Transfer

```text
A photo of a girl who received a stuffed elephant as a Christmas present.
```

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/84db6461613ef8253aa130778cdb4305 {gyazo=image}", width=50, align="left" %}
### Positioning by Guide

```text
Add a sailing ship to the box position.
```

{% endmediaRow %}


{% mediaRow img="https://gyazo.com/dae38a4ef8ee07c4a5922992c585578a {gyazo=image}", width=50, align="left" %}
### Refine Collage

It edits to **blend** manually created collage images.


```text
Transform the flat duck sticker into a realistic plush duck toy with the same blue hat and place it in the woman’s arms so she is naturally hugging it. Also turn the outlined pendant lamp into a realistic lamp, removing the white sticker edges and matching the scene’s lighting, color, and perspective.
```

There is also a LoRA that boosts this ability.

- [Place it Flux Kontext LoRA](https://civitai.com/models/1780962/place-it-flux-kontext-lora)

{% endmediaRow %}
