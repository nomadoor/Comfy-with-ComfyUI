---
layout: page.njk
lang: en
section: basic-workflows
slug: ideogram-4
navId: ideogram-4
title: "Ideogram 4.0"
created: 2026-06-10
updated: 2026-06-18
summary: "Image generation with Ideogram 4.0"
seoTitle: "Ideogram 4.0 in ComfyUI: Precise Control with JSON Prompts"
seoDescription: "Use Ideogram 4.0 in ComfyUI with JSON captions that set element positions and colors: building prompts, text2image, and the 8-step TurboTime LoRA."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/ideogram-4/legacy_gyazo_cb9116562b7693e120aa63eafef11769.png"
tags: []
---

## What is Ideogram 4.0?

[Ideogram 4.0](https://ideogram.ai/models/4.0/) is a 9.3B DiT-based model.

Its standout feature is JSON-format captions, which let you specify the elements in an image in quite a lot of detail.

[FIBO](https://github.com/Bria-AI/FIBO) took a similar approach, but Ideogram 4.0 is especially good at following BBOX coordinates and specified colors, which makes it a good fit for DTP-style design work like posters, logos, UI, and packaging.

The price of all that control is that it won't perform as intended unless you write prompts in its expected format, so it may not be the most casual model to use.

---

## Model Download

- diffusion_models
  - [ideogram4_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Ideogram-4/blob/main/diffusion_models/ideogram4_fp8_scaled.safetensors) (9.28 GB)
  - [ideogram4_nvfp4_mixed.safetensors](https://huggingface.co/Comfy-Org/Ideogram-4/blob/main/diffusion_models/ideogram4_nvfp4_mixed.safetensors) (5.49 GB)
  - [ideogram4_unconditional_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Ideogram-4/blob/main/diffusion_models/ideogram4_unconditional_fp8_scaled.safetensors) (9.28 GB)
  - [ideogram4_unconditional_nvfp4_mixed.safetensors](https://huggingface.co/Comfy-Org/Ideogram-4/blob/main/diffusion_models/ideogram4_unconditional_nvfp4_mixed.safetensors) (5.49 GB)
- text_encoders
  - [qwen3vl_8b_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Ideogram-4/blob/main/text_encoders/qwen3vl_8b_fp8_scaled.safetensors) (10.6 GB)
- vae
  - [flux2-vae.safetensors](https://huggingface.co/Comfy-Org/Ideogram-4/blob/main/vae/flux2-vae.safetensors) (336 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   ├── ideogram4_fp8_scaled.safetensors
    │   ├── ideogram4_nvfp4_mixed.safetensors
    │   ├── ideogram4_unconditional_fp8_scaled.safetensors
    │   └── ideogram4_unconditional_nvfp4_mixed.safetensors
    ├── 📂text_encoders/
    │   └── qwen3vl_8b_fp8_scaled.safetensors
    └── 📂vae/
        └── flux2-vae.safetensors
```

I'll explain the details later, but it loads two diffusion models, so it's quite heavy.

ComfyUI juggles memory internally, so running short on VRAM doesn't mean you can't generate at all, but it will take a very long time.

You can use `nvfp4` to lighten the load, but quality drops.

The `unconditional` side has less effect on quality, so using `fp8` for the main model and `nvfp4` for the `unconditional` one might be a good choice.

---

## Prompt

Plain natural-language prompts do work, but unless you follow the expected JSON schema, you won't get decent quality.

The basic form looks like this.

```json
{
  "high_level_description": "Overall 1-2 sentence description of the image.",
  "style_description": {
    "aesthetics": "Mood and aesthetic direction.",
    "lighting": "Lighting.",
    "medium": "illustration / photograph / graphic_design, etc.",
    "art_style": "Art style for non-photographic images.",
    "color_palette": ["#FFFFFF", "#000000"]
  },
  "compositional_deconstruction": {
    "background": "Background and environment description.",
    "elements": [
      {
        "type": "obj",
        "bbox": [100, 200, 800, 700],
        "desc": "Description of an object, person, or element.",
        "color_palette": ["#FFFFFF", "#000000"]
      },
      {
        "type": "text",
        "bbox": [820, 200, 920, 800],
        "text": "HELLO",
        "desc": "Description of the text appearance.",
        "color_palette": ["#000000"]
      }
    ]
  }
}
```

The structure itself is simple: an overall description, style, background, and a description for each element. But you can't be writing this by hand every time.

The coordinates are especially tedious. You have to specify with BBOXes which element goes where in the image, and picturing that in your head is next to impossible.

So here are a few ways to create the prompt.

### Let an LLM Handle It

The easiest way is to pass the official [Prompting Guide](https://github.com/ideogram-oss/ideogram4/blob/main/docs/prompting.md) and a description of the image you want to an LLM, and have it convert the request into a JSON caption.

You could also hand it a reference image or a rough sketch of your own.

Local models small enough to run in ComfyUI aren't up to this, so you're better off just relying on ChatGPT, Gemini, or similar.

![](/media/basic-workflows/ideogram-4/legacy_gyazo_b314abc36bec096b81fb3231a2687064.png){media=image}

- [Sample chat with ChatGPT](https://chatgpt.com/share/6a28f7cc-e934-8320-86d6-f790a5274389)

### Use a Dedicated Prompt Builder

Another option is to use a dedicated prompt builder and create the prompt visually.

For example, [ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes) includes a commonly used node called `Ideogram 4 Prompt Builder KJ`.

![](/media/basic-workflows/ideogram-4/legacy_gyazo_a1c3a269983b478c1f605e2f0a5c6e4f.png){media=image}

- Set the size of the image to generate, then fill in things like the background and style.
- Drag in the region area to create a BBOX, then set the prompt and color codes for what you want drawn there.

---

## text2image

![](/media/basic-workflows/ideogram-4/legacy_gyazo_c9a2cf1717e87cd1ba28c5d236a02b4d.png){media=image}

[](/workflows/basic-workflows/ideogram-4/ideogram_4_0_text2image.json)

Besides the prompt, a few parts differ a little from a typical workflow, so let's just go over those.

{% mediaRow img="/media/basic-workflows/ideogram-4/legacy_gyazo_c0d5e9131313e7c3c5255b4f54d55dbb.png {media=image}", width=33, align="left" %}
**Load Diffusion Model**

Ideogram 4.0 loads two diffusion models for its slightly unusual CFG.

- Normal [CFG](/en/ai-capabilities/cfg/) compares the result with the prompt against the result without it, and pushes the generation toward the prompt.
- Ideogram 4.0 does not pass an empty prompt to the unconditional side. Instead, it sends image-only input, without text tokens, through the unconditional model.
- You might wonder what difference that makes, but I guess it's a trick for handling the positive prompt with more finesse.

{% endmediaRow %}

---

## Ideogram 4 TurboTime LoRA

A LoRA released by Ostris that lets you generate in 2 to 8 steps.

### Model Download

- loras
  - [ideogram_4_turbotime_v1.safetensors](https://huggingface.co/ostris/ideogram_4_turbotime_lora/blob/main/ideogram_4_turbotime_v1.safetensors) (847 MB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        └── ideogram_4_turbotime_v1.safetensors
```

### text2image (8 step)

![](/media/basic-workflows/ideogram-4/legacy_gyazo_f75015885dc02060128725d779ce7d49.png){media=image}

[](/workflows/basic-workflows/ideogram-4/ideogram_4_0_text2image_turbotime.json)

- It generates with CFG 1.0, so the unconditional model is no longer needed.
- It's billed as a 2-8 step LoRA, but with too few steps the image clearly starts to fall apart.
- For now, 8 steps is the way to go.

{% mediaRow img="/media/basic-workflows/ideogram-4/legacy_gyazo_26ef78ed5bf868ab5ca9a62b643640ff.png {media=image}", width=33, align="left" %}
**CFG**

This is a small trick that's been around for ages: use a different CFG value for the first and second halves of sampling.

- In this workflow, the first half is CFG 7, and the second half is CFG 3.
- Lowering a high CFG partway through is more stable than keeping it high from start to finish.
- `CFG Override` is the node used for this.
- It overrides the CFG value only for the specified step range.
- In this workflow, `cfg` becomes 3 after 70% of the total steps.

{% endmediaRow %}
