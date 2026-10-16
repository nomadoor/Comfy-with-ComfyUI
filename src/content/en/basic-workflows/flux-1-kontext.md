---
layout: page.njk
lang: en
section: basic-workflows
slug: flux-1-kontext
navId: flux-1-kontext
title: "Flux.1 Kontext"
created: 2025-12-11
updated: 2026-03-02
summary: "Instruction-based image editing with Flux.1 Kontext."
seoTitle: "Flux.1 Kontext in ComfyUI: Instruction-Based Image Editing"
seoDescription: "Edit images with text using Flux.1 Kontext [dev] in ComfyUI: model download, the basic workflow, prompting, and style, removal, and text edits."
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "/media/basic-workflows/flux-1-kontext/legacy_gyazo_79c075e47d999e282c8a2cd3c05f10ef.png"
tags: ["instruction-based-image-editing","collage-refine"]
---

## What is Flux.1 Kontext?

Flux.1 Kontext is an instruction-based image editing model based on [Flux.1](/en/basic-workflows/flux-1/).

There's no doubt this was the model that kicked off the AI image editing boom that nano banana and others followed.

Like Flux.1, it comes in three variants, `pro`, `max`, and `dev`, but only `dev` can be run locally.


---

## What is Instruction-based Image Editing?

On this site, a model that takes an image plus a text instruction and edits the image to follow that instruction is called an **instruction-based image editing model**.

Say you want to make the hair of a woman in a photo red.
Until now, you'd mask the hair, add ControlNet Canny so the hairstyle wouldn't change, and then inpaint with a prompt like "photo of a woman with red hair."

With instruction-based image editing, it's easy. Just pass the image to the model and **instruct** it, "Make the woman's hair red," the way a producer would ask a designer.

Changing facial expressions, removing objects that get in the way, converting the art style.

You can do all of it with a single model and a prompt.

---

## Model Download

Kontext uses basically the same set of models as regular Flux.1.

* diffusion_models

  * [flux1-dev-kontext_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/flux1-kontext-dev_ComfyUI/blob/main/split_files/diffusion_models/flux1-dev-kontext_fp8_scaled.safetensors)

* clip / T5 / VAE

  * [clip_l.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/clip_l.safetensors)
  * [t5xxl_fp8_e4m3fn_scaled.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/t5xxl_fp8_e4m3fn_scaled.safetensors)
  * [ae.safetensors](https://huggingface.co/Comfy-Org/z_image/blob/main/split_files/vae/ae.safetensors)

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

The Kontext workflow itself is simple: it's just the regular Flux.1 workflow with `ReferenceLatent` added.

![](/media/basic-workflows/flux-1-kontext/legacy_gyazo_b872b5de146a585c0c9745168d5f1dae.png){media=image}

[](/workflows/basic-workflows/flux-1-kontext/flux_1_kontext.json)

* 🟪 Load `flux1-dev-kontext_fp8_scaled.safetensors`.
* 🟩 Resize the input image to a resolution suitable for Kontext with the `FluxKontextImageScale` node.
  - Flux has a set of recommended resolutions, and **the one with the closest aspect ratio is picked automatically**.
* 🟩 Convert the resized image to a latent and connect it to `ReferenceLatent`.

---

## How to write prompts

In general, follow the official prompting guide.
- [FLUX.1 Kontext Prompting Guide](https://docs.bfl.ai/guides/prompting_guide_kontext_i2i)

That said, there's no special syntax.
Just write what you want in plain English, along the lines of **"Make ◯◯ △△,"** and it'll usually work.

If things you wanted left alone change too (e.g., you only wanted a new hairstyle but the background changed), spell out what should stay the same, like this:

- e.g. `Keep the person's pose, position, and size the same.`

> [!NOTE]
> That said, the model itself often doesn't follow instructions very well.
> Don't expect too much from it just yet.

---

## Capabilities

{% mediaRow img="/media/basic-workflows/flux-1-kontext/legacy_gyazo_79c075e47d999e282c8a2cd3c05f10ef.png {media=image}", width=50, align="left" %}
### Image Editing

```text
Change the hair to a messy blonde bob.
```

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/flux-1-kontext/legacy_gyazo_677d45b54c4f1c9c278ae230e7b000b9.png {media=image}", width=50, align="left" %}
### Style Transfer

```text
This character is made out of Lego blocks.
```

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/flux-1-kontext/legacy_gyazo_7a409e39ee00b1766ee164df76b0ac7c.png {media=image}", width=50, align="left" %}
### Object Removal

```text
Remove the woman
```

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/flux-1-kontext/legacy_gyazo_49bb5579217513e0b774d0952579bd4f.png {media=image}", width=50, align="left" %}
### Text Replacement

```text
Replace [OPEN] with [FLUX]
```

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/flux-1-kontext/legacy_gyazo_6abbbb3aacaddf5df09d459f29466e93.png {media=image}", width=50, align="left" %}
### Subject Transfer

```text
A photo of a girl who received a stuffed elephant as a Christmas present.
```

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/flux-1-kontext/legacy_gyazo_84db6461613ef8253aa130778cdb4305.png {media=image}", width=50, align="left" %}
### Positioning by Guide

```text
Add a sailing ship to the box position.
```

{% endmediaRow %}


{% mediaRow img="/media/basic-workflows/flux-1-kontext/legacy_gyazo_dae38a4ef8ee07c4a5922992c585578a.png {media=image}", width=50, align="left" %}
### Refine Collage

An edit that **blends in** a collage you put together by hand.


```text
Transform the flat duck sticker into a realistic plush duck toy with the same blue hat and place it in the woman’s arms so she is naturally hugging it. Also turn the outlined pendant lamp into a realistic lamp, removing the white sticker edges and matching the scene’s lighting, color, and perspective.
```

There's also a LoRA that improves this ability.

- [Place it Flux Kontext LoRA](https://civitai.com/models/1780962/place-it-flux-kontext-lora)

{% endmediaRow %}
