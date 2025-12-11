---
layout: page.njk
lang: en
section: basic-workflows
slug: flux1
navId: flux1
title: "Flux.1"
summary: "Flux.1 basics and usage in ComfyUI"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/9fd52a56e1f6b7cbf8cd96ca78484d02.png"
tags: []
---

## What is Flux.1?

**Flux.1** is an image generation model by Black Forest Labs, launched by members who developed Stable Diffusion.
It is not just a "high-performance version" but also a model that marked a major turning point in terms of architecture.

- The core of image generation was replaced from the conventional UNet to Transformer (DiT) base.
- A T5-based LLM was adopted as the text encoder.

This combination made it possible to learn efficiently from large-scale datasets, and by making it easier to utilize LLM's text understanding ability as is, it became a branching point to the group of image generation models currently becoming mainstream.

Flux.1 has three variations:

- **Flux.1 pro**
  - A version available only via API, and model weights are not public.
- **Flux.1 dev**
  - A research/verification model distilled from pro. This is the most commonly used one in local environments.
- **Flux.1 schnell**
  - A model further distilled from dev, released under the relatively permissive Apache-2.0 license.

---

## Model Download

Here, we will use the fp8 versions of `dev` / `schnell`.

- diffusion model
  - [flux1-dev-fp8.safetensors](https://huggingface.co/Comfy-Org/flux1-dev/blob/main/flux1-dev-fp8.safetensors)
  - [flux1-schnell-fp8.safetensors](https://huggingface.co/Comfy-Org/flux1-schnell/blob/main/flux1-schnell-fp8.safetensors)
- CLIP / T5
  - [clip_l.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/clip_l.safetensors)
  - [t5xxl_fp8_e4m3fn_scaled.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/t5xxl_fp8_e4m3fn_scaled.safetensors)
- VAE
  - [ae.safetensors](https://huggingface.co/black-forest-labs/FLUX.1-schnell/blob/main/ae.safetensors)

- ```text
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
  ````

---

## text2image - Flux.1 [dev]

![](https://gyazo.com/2b89975e1b96fcbbd56880d31a0cd9c4){gyazo=image}

[](/workflows/basic-workflows/flux1/flux1-dev.json)

Flux.1 dev / schnell are **models distilled with CFG fixed at 1.0**.
Therefore, adjustments to `CFG scale` and Negative Prompt like in conventional Stable Diffusion are not assumed, and **Negative Prompt has no effect at all**.

* cf. [Special Meaning of CFG / CFG = 1](/en/ai-capabilities/cfg/#special-meaning-of-cfg--1)

I leave the Negative side prompt empty, but other workflows may use a `ConditioningZeroOut` node instead of a `CLIP Text Encode` node for Negative.

In either case, since the Negative side condition is multiplied by 0, **writing anything will not affect the output**.

---

## text2image - Flux.1 [schnell]

It is further distilled from Flux.1 [dev] and can generate images in 4 to 6 steps.

![](https://gyazo.com/365108a45e0039af1ce0d35cf2cdcfa6){gyazo=image}

[](/workflows/basic-workflows/flux1/flux1-schnell.json)
- Set `steps` to 4 to 6.

---

## LoRA - Flux.1 [dev]

Let's use a LoRA that improves the quality of portrait images.

* [AWPortrait-FL-lora.safetensors](https://huggingface.co/Shakker-Labs/AWPortrait-FL/blob/main/AWPortrait-FL-lora.safetensors)

![](https://gyazo.com/292030d5a8ffc53619232546c7ce750b){gyazo=image}

[](/workflows/basic-workflows/flux1/flux1-dev_lora.json)

* 🟪 As mentioned in [LoRA](/en/basic-workflows/sd15-lora/), since Flux and later models no longer train the text encoder, use the `LoraLoaderModelOnly` node which **applies only to weights**, instead of the `Load LoRA` node.

---

## ControlNet - Flux.1 [dev]

Several ControlNet models for Flux.1 have been published, but here we will introduce a Union type model as an example.

### Model Download

* [FLUX.1-dev-ControlNet-Union-Pro-2.0-fp8/diffusion_pytorch_model.safetensors](https://huggingface.co/ABDALLALSWAITI/FLUX.1-dev-ControlNet-Union-Pro-2.0-fp8/blob/main/diffusion_pytorch_model.safetensors)

  * Since it's confusing, please rename it to something like `FLUX.1-dev-ControlNet-Union-Pro-2.0-fp8.safetensors`.

- ```text
  📂ComfyUI/
  └── 📂models/
      └── 📂controlnet/
          └── FLUX.1-dev-ControlNet-Union-Pro-2.0-fp8.safetensors
  ```

### Workflow

ControlNet-Union incorporates several representative ControlNets into one model.

![](https://gyazo.com/9e7cb79f7ca50fe5946ac9f232a552c6){gyazo=image}

[](/workflows/basic-workflows/flux1/FLUX.1-dev-ControlNet-Union-Pro_depth.json)

* 🟩 ControlNet is just inserted into the image2image workflow using Flux.

  * Even though it's image2image, since `denoise` is 1.0, the behavior is almost the same as text2image.
  * I often use this form because an image of the same size as the input image can be created with few nodes.
* 🟩 Input the type of ControlNet you want to use into `SetUnionControlNetType`.

  * Basically `auto` is fine.

---

## GGUF (Lightweighting Flux.1)

Finally, let me touch a little on **GGUF version of Flux.1**.

Originally GGUF is a format for lightweighting LLMs (quantized weight format), but by applying this to Flux.1, you can **run it at a reasonable speed while reducing VRAM usage**.

### Custom Node

* [city96/ComfyUI-GGUF](https://github.com/city96/ComfyUI-GGUF)

### Model Download

There are several variations depending on the balance between performance and model size.
Please choose according to your PC specs and usage.

* [FLUX.1-dev-gguf](https://huggingface.co/city96/FLUX.1-dev-gguf/tree/main)
* [FLUX.1-schnell-gguf](https://huggingface.co/city96/FLUX.1-schnell-gguf/tree/main)

- ```text
  📂ComfyUI/
  └── 📂models/
      └── 📂unet/
          └── flux1-dev.gguf
  ```

### Workflow

![](https://gyazo.com/f465ff82b48c4c7b5d5b9ce144f3dc8d){gyazo=image}

[](/workflows/basic-workflows/flux1/FLUX.1-dev-gguf.json)

* 🟪 Replace the `Load Diffusion Model` node with the `Unet Loader (GGUF)` node.
* Other parts like CLIP / T5 / VAE remain the same.

  * You can change T5 to GGUF, but in my experience, it doesn't have that big of an effect.

Many current models have GGUF versions available.
Since **there are almost no downsides to using GGUF**, please try using it positively when VRAM is insufficient.
