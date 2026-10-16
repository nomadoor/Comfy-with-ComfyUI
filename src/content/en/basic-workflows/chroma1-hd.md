---
layout: page.njk
lang: en
section: basic-workflows
slug: chroma1-hd
navId: chroma1-hd
title: "Chroma1-HD"
created: 2025-12-11
updated: 2026-03-02
summary: "Extending Flux.1-schnell with Chroma1-HD"
seoTitle: "Chroma1-HD in ComfyUI: A De-Distilled Flux"
seoDescription: "Use Chroma1-HD in ComfyUI, a de-distilled Flux rebuilt from Flux.1 [schnell] that trains well with LoRA. Model download and text2image workflow."
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "/media/basic-workflows/chroma1-hd/legacy_gyazo_326db88733896540f58ce60e7320824f.png"
tags: []
---

## What is Chroma1-HD?

[Flux.1 [dev]](/en/basic-workflows/flux-1/) was a great model, but it had two big problems when it came to wide use in the community.

- It's heavily distilled, so it doesn't work very well with LoRAs or full fine-tuning.
- Non-commercial license.

So several projects set out to rebuild a "de-distilled Flux" starting from Flux.1 [schnell], which has a more permissive license. One of the projects that put the most work in is [Chroma1-HD](https://huggingface.co/lodestones/Chroma1-HD) by LodestoneRock.

Because it was retrained on data that includes NSFW and anime images, it has much more stylistic freedom than the original Flux models. Rather than a "de-distilled Flux," it makes more sense to think of it as a new general-purpose model built on the Flux architecture.

---

## Model Download

Unlike Flux.1, Chroma1-HD doesn't use CLIP; it uses only T5.

- diffusion_models
  - [Chroma1-HD.safetensors](https://huggingface.co/lodestones/Chroma1-HD/blob/main/Chroma1-HD.safetensors)
- text_encoders
  - [t5xxl_fp8_e4m3fn_scaled.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/t5xxl_fp8_e4m3fn_scaled.safetensors)
- vae
  - [ae.safetensors](https://huggingface.co/Comfy-Org/z_image/blob/main/split_files/vae/ae.safetensors)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── Chroma1-HD.safetensors
    ├── 📂text_encoders/
    │   └── t5xxl_fp8_e4m3fn_scaled.safetensors
    └── 📂vae/
        └── ae.safetensors
```

## text2image

![](/media/basic-workflows/chroma1-hd/legacy_gyazo_319a7dc82aeea486d7f0912c830fb258.png){media=image}

[](/workflows/basic-workflows/chroma1-hd/chroma1_hd.json)

- The basic setup is almost the same as Flux.1.
- 🟦 `T5TokenizerOptions` pads the input when the token count is below the set value. It doesn't make much difference whether you use it or not.
- The default CFG is 4.0, but some people say 6-7 works better. Try a few values and see.
