---
layout: page.njk
lang: en
section: notes
slug: sd15-sdxl-asset-compatibility
navId: sd15-sdxl-asset-compatibility
title: "Can you use SD1.5 LoRAs / ControlNets with SDXL?"
created: 2025-12-13
updated: 2026-03-02
noteTags: ["faq", "sd15", "sdxl"]
summary: "Compatibility between models and why SD1.5 assets cannot be used with SDXL."
seoTitle: "Can You Use SD1.5 LoRA or ControlNet with SDXL?"
seoDescription: "Why Stable Diffusion 1.5 LoRAs and ControlNets do not work with SDXL, explained with a power plug analogy, and what happens if you try."
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: ""
---

## Can you use SD1.5 LoRAs / ControlNets with SDXL?

Short answer: **no, you can't.**
And this isn't just about SD1.5 and SDXL. It's safe to assume that **different models are almost never compatible with each other**.

Think of it like power outlets.
- SD1.5 is a Japanese outlet (Type A)
- SDXL is a US outlet (Type B)

Appliances (LoRA / ControlNet) made for one country only work in that country.
They may do similar things, but the plugs are shaped differently, so they physically won't fit.

---

## Why aren't they compatible?

Roughly speaking, the technical reasons are:

- **They are built for different models**
  - SD1.5 and SDXL have different UNet structures, channel counts, latent resolutions, etc., so the assumption a LoRA / ControlNet relies on, "which layer gets which difference added", no longer holds.

- **Text encoders are also different**
  - SD1.5 uses CLIP, while SDXL uses a text encoder with a different configuration. What was learned about "how this word should shift the result" doesn't carry over to a different model.


It's fine to think of an adapter as working only with the model it was made for.

- LoRA / ControlNet for SD1.5 → **SD1.5-family models only**
- LoRA / ControlNet for SDXL → **SDXL-family models only**
- LoRA / ControlNet for Flux → **Flux-family models only**

---

## Do you actually get an error?

![](/media/notes/sd15-sdxl-asset-compatibility/legacy_gyazo_3d13852e4d5921d17dd6e6c1835bfafa.png){media=image}

If you plug an SDXL ControlNet model into an SD1.5 ControlNet workflow, you get an error like the one above:

```
y is None, did you try using a controlnet for SDXL on SD1?
```

So ComfyUI itself detects the mismatch and returns an error.
