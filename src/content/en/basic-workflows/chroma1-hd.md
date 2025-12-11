---
layout: page.njk
lang: en
section: basic-workflows
slug: chroma1-hd
navId: chroma1-hd
title: "Chroma1-HD"
summary: "Extending Flux.1-schnell with Chroma1-HD"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/326db88733896540f58ce60e7320824f.png"
tags: []
---

## What is Chroma1-HD?

[Flux.1 [dev]](/en/basic-workflows/flux1/) was a great model, but it had two major issues for widespread community use.

- Since it is strongly distilled, compatibility with LoRA and full fine-tuning is not very good.
- Non-commercial license.

Therefore, several attempts appeared to reconstruct "Undistilled Flux" starting from Flux.1 [schnell] which has a more generous license, and one of the most labor-intensive ones among them is [Chroma1-HD](https://huggingface.co/lodestones/Chroma1-HD) by LodestoneRock.

Since it has been re-trained including NSFW and anime images, it has a higher degree of freedom in style than the original Flux series, and it fits better to perceive it as a new general-purpose model based on Flux architecture rather than "Undistilled Flux".

---

## Model Download

Unlike Flux.1, Chroma1-HD does not use CLIP, but uses only T5.

- diffusion_models
  - [Chroma1-HD.safetensors](https://huggingface.co/lodestones/Chroma1-HD/blob/main/Chroma1-HD.safetensors)
- text_encoders
  - [t5xxl_fp8_e4m3fn_scaled.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/t5xxl_fp8_e4m3fn_scaled.safetensors)
- vae
  - [ae.safetensors](https://huggingface.co/black-forest-labs/FLUX.1-schnell/blob/main/ae.safetensors)

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

![](https://gyazo.com/319a7dc82aeea486d7f0912c830fb258){gyazo=image}

[](/workflows/basic-workflows/chroma1-hd/Chroma1-HD.json)

- The basic construction is almost the same as Flux.1.
- 🟦 `T5TokenizerOptions` is a node that fills with padding when the number of tokens is less than the set value. There is no big difference whether you put it in or not.
- CFG is specified as 4.0, but some say 6 to 7 is good. Please try various things.
