---
layout: page.njk
lang: en
section: basic-workflows
slug: flux-1
navId: flux-1
title: "Flux.1"
created: 2025-12-12
updated: 2026-03-02
summary: "Flux.1 basics and how to use it in ComfyUI"
seoTitle: "Flux.1 in ComfyUI: dev, schnell, LoRA, ControlNet"
seoDescription: "Use Black Forest Labs' Flux.1 in ComfyUI: [dev] and [schnell] text2image, LoRA, ControlNet, and lighter GGUF models, with easy-to-read workflows."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/flux-1/legacy_gyazo_9fd52a56e1f6b7cbf8cd96ca78484d02.png"
tags: []
---

## What is Flux.1?

**Flux.1** is an image generation model from Black Forest Labs, a company founded by members of the team behind Stable Diffusion.
It's more than just a "better-performing version": it also marked a major turning point in architecture.

- The core of the image generator moved from the traditional UNet to a Transformer (DiT).
- A T5-family LLM was adopted as the text encoder.

Together, these made it possible to train efficiently on large datasets and to tap directly into an LLM's language understanding, and Flux.1 became the point where today's mainstream image generation models branched off.

Flux.1 comes in 3 variants.

- **Flux.1 pro**
  - A version available only via API; model weights are not public.
- **Flux.1 dev**
  - A model distilled from pro, intended for research and testing. This is the one most people use locally.
- **Flux.1 schnell**
  - A model further distilled from dev, released under the relatively loose Apache-2.0 license.

---

## Model Download

Here, we use the fp8 versions of `dev` / `schnell`.

- diffusion model
  - [flux1-dev-fp8.safetensors](https://huggingface.co/Comfy-Org/flux1-dev/blob/main/flux1-dev-fp8.safetensors)
  - [flux1-schnell-fp8.safetensors](https://huggingface.co/Comfy-Org/flux1-schnell/blob/main/flux1-schnell-fp8.safetensors)
- CLIP / T5
  - [clip_l.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/clip_l.safetensors)
  - [t5xxl_fp8_e4m3fn_scaled.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/t5xxl_fp8_e4m3fn_scaled.safetensors)
- VAE
  - [ae.safetensors](https://huggingface.co/Comfy-Org/z_image/blob/main/split_files/vae/ae.safetensors)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   ├── flux1-dev-fp8.safetensors
    │   └── flux1-schnell-fp8.safetensors
    ├── 📂clip/
    │   ├── clip_l.safetensors
    │   └── t5xxl_fp8_e4m3fn_scaled.safetensors
    └── 📂vae/
        └── ae.safetensors
```

---

## text2image - Flux.1 [dev]

![](/media/basic-workflows/flux-1/legacy_gyazo_2b89975e1b96fcbbd56880d31a0cd9c4.png){media=image}

[](/workflows/basic-workflows/flux1/flux1_dev.json)

Flux.1 dev / schnell are **distilled with CFG fixed at 1.0**.
So they aren't designed for tuning `CFG scale` or the negative prompt the way you would with Stable Diffusion, and **the negative prompt has no effect at all**.

* cf. [CFG / Special meaning of CFG = 1](/en/ai-capabilities/cfg/#special-meaning-of-cfg-1)

I just leave the negative prompt empty, but some other workflows plug in a `ConditioningZeroOut` node instead of the negative `CLIP Text Encode` node.

Either way, the negative conditioning gets multiplied by 0, so **nothing you write there affects the output**.

---

## text2image - Flux.1 [schnell]

A further distilled version of Flux.1 [dev] that can generate images in 4-6 steps.

![](/media/basic-workflows/flux-1/legacy_gyazo_365108a45e0039af1ce0d35cf2cdcfa6.png){media=image}

[](/workflows/basic-workflows/flux1/flux1_schnell.json)
- Set `steps` to 4-6.

---

## LoRA - Flux.1 [dev]

Let's try a LoRA that improves the quality of portraits.

* [AWPortrait-FL-lora.safetensors](https://huggingface.co/Shakker-Labs/AWPortrait-FL/blob/main/AWPortrait-FL-lora.safetensors)

![](/media/basic-workflows/flux-1/legacy_gyazo_292030d5a8ffc53619232546c7ce750b.png){media=image}

[](/workflows/basic-workflows/flux1/flux1_dev_lora.json)

* 🟪 As mentioned in [LoRA](/en/basic-workflows/sd15-lora/), from Flux onward LoRAs no longer train the text encoder, so instead of the `Load LoRA` node, use the `LoraLoaderModelOnly` node, which **applies only to the model weights**.

---

## ControlNet - Flux.1 [dev]

Several ControlNet models have been released for Flux.1. Here, we'll use a Union-type model as the example.

### Model Download

* [FLUX.1-dev-ControlNet-Union-Pro-2.0-fp8/diffusion_pytorch_model.safetensors](https://huggingface.co/ABDALLALSWAITI/FLUX.1-dev-ControlNet-Union-Pro-2.0-fp8/blob/main/diffusion_pytorch_model.safetensors)

  * The original name is confusing, so rename it to something like `FLUX.1-dev-ControlNet-Union-Pro-2.0-fp8.safetensors`.

```text
📂ComfyUI/
└── 📂models/
    └── 📂controlnet/
        └── FLUX.1-dev-ControlNet-Union-Pro-2.0-fp8.safetensors
```

### workflow

ControlNet-Union packs several common ControlNets into a single model.

![](/media/basic-workflows/flux-1/legacy_gyazo_9e7cb79f7ca50fe5946ac9f232a552c6.png){media=image}

[](/workflows/basic-workflows/flux1/flux_1_dev_controlnet_union_pro_depth.json)

* 🟩 This is just a Flux image2image workflow with ControlNet added.

  * It's image2image, but `denoise` is 1.0, so it behaves almost exactly like text2image.
  * I use this setup a lot because it gives you an image the same size as the input with fewer nodes.
* 🟩 Set the ControlNet type you want to use in `SetUnionControlNetType`.

  * Basically `auto` is fine.

---

## GGUF (Making Flux.1 Lighter)

Finally, a quick word on the **GGUF version of Flux.1**.

GGUF was originally a format for shrinking LLMs (a quantized weight format), but applying it to Flux.1 lets you **cut VRAM usage while still running at a decent speed**.

### Custom Nodes

* [city96/ComfyUI-GGUF](https://github.com/city96/ComfyUI-GGUF)

### Model Download

There are several variants trading off quality against model size.
Pick one that suits your PC and what you're doing.

* [FLUX.1-dev-gguf](https://huggingface.co/city96/FLUX.1-dev-gguf/tree/main)
* [FLUX.1-schnell-gguf](https://huggingface.co/city96/FLUX.1-schnell-gguf/tree/main)

```text
📂ComfyUI/
└── 📂models/
    └── 📂unet/
        └── flux1-dev.gguf
```

### workflow

![](/media/basic-workflows/flux-1/legacy_gyazo_f465ff82b48c4c7b5d5b9ce144f3dc8d.png){media=image}

[](/workflows/basic-workflows/flux1/flux_1_dev_gguf.json)

* 🟪 Replace the `Load Diffusion Model` node with the `Unet Loader (GGUF)` node.
* The CLIP / T5 / VAE parts stay the same.

  * You can switch T5 to GGUF too, but in my experience it doesn't make a big difference.

Many current models have GGUF versions.
**There's hardly any downside to using GGUF**, so don't hesitate to try it when you're short on VRAM.
