---
layout: page.njk
lang: en
section: basic-workflows
slug: flux-1
navId: flux-1
title: "Flux.1"
summary: "Basics of Flux.1 and usage in ComfyUI"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/9fd52a56e1f6b7cbf8cd96ca78484d02.png"
tags: []
---

## What is Flux.1?

**Flux.1** is an image generation model by Black Forest Labs, launched by members who developed Stable Diffusion.
It is a model that became a major turning point in terms of architecture, not just a "high-performance version".

- The core of image generation was replaced from the traditional UNet to Transformer (DiT) base.
- T5-based LLM was adopted as a text encoder.

This combination made it possible to learn efficiently from large-scale datasets, and by utilizing the sentence comprehension ability of LLM as is, it became a branching point to the group of image generation models that are currently mainstream.

There are 3 variations of Flux.1.

- **Flux.1 pro**
  - A version available only via API; model weights are not public.
- **Flux.1 dev**
  - A research/verification model distilled from pro. This is the most commonly used version in local environments.
- **Flux.1 schnell**
  - A model further distilled from dev, released under the relatively loose Apache-2.0 license.

---

## Model Download

Here, we use the fp8 version of `dev` / `schnell`.

- diffusion model
  - [flux1-dev-fp8.safetensors](https://huggingface.co/Comfy-Org/flux1-dev/blob/main/flux1-dev-fp8.safetensors)
  - [flux1-schnell-fp8.safetensors](https://huggingface.co/Comfy-Org/flux1-schnell/blob/main/flux1-schnell-fp8.safetensors)
- CLIP / T5
  - [clip_l.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/clip_l.safetensors)
  - [t5xxl_fp8_e4m3fn_scaled.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/t5xxl_fp8_e4m3fn_scaled.safetensors)
- VAE
  - [ae.safetensors](https://huggingface.co/black-forest-labs/FLUX.1-schnell/blob/main/ae.safetensors)

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

![](https://gyazo.com/2b89975e1b96fcbbd56880d31a0cd9c4){gyazo=image}

[](/workflows/basic-workflows/flux1/flux1-dev.json)

Flux.1 dev / schnell are **models distilled with CFG fixed at 1.0**.
Therefore, adjustment of `CFG scale` and Negative Prompt like in traditional Stable Diffusion is not assumed, and **Negative Prompt has no effect at all**.

* cf. [CFG / Special meaning of CFG = 1](/en/ai-capabilities/cfg/#special-meaning-of-cfg-1)

I leave the Negative side prompt empty, but in other workflows, `ConditioningZeroOut` node is sometimes inserted instead of the `CLIP Text Encode` node for Negative.

In either case, since the condition on the Negative side is multiplied by 0, **writing anything will not affect the output**.

---

## text2image - Flux.1 [schnell]

This is a further distilled version of Flux.1 [dev], capable of generating images in 4-6 steps.

![](https://gyazo.com/365108a45e0039af1ce0d35cf2cdcfa6){gyazo=image}

[](/workflows/basic-workflows/flux1/flux1-schnell.json)
- Set `steps` to 4-6.

---

## LoRA - Flux.1 [dev]

Let's use LoRA to improve the quality of portrait images.

* [AWPortrait-FL-lora.safetensors](https://huggingface.co/Shakker-Labs/AWPortrait-FL/blob/main/AWPortrait-FL-lora.safetensors)

![](https://gyazo.com/292030d5a8ffc53619232546c7ce750b){gyazo=image}

[](/workflows/basic-workflows/flux1/flux1-dev_lora.json)

* 🟪 As written in [LoRA](/en/basic-workflows/sd15-lora/), since Flux and later models no longer train the text encoder, use the `LoraLoaderModelOnly` node which **applies only to weights**, instead of the `Load LoRA` node.

---

## ControlNet - Flux.1 [dev]

Several ControlNet models for Flux.1 have been released, but here we introduce a Union type model as an example.

### Model Download

* [FLUX.1-dev-ControlNet-Union-Pro-2.0-fp8/diffusion_pytorch_model.safetensors](https://huggingface.co/ABDALLALSWAITI/FLUX.1-dev-ControlNet-Union-Pro-2.0-fp8/blob/main/diffusion_pytorch_model.safetensors)

  * Rename it to something like `FLUX.1-dev-ControlNet-Union-Pro-2.0-fp8.safetensors` as the original name is confusing.

```text
📂ComfyUI/
└── 📂models/
    └── 📂controlnet/
        └── FLUX.1-dev-ControlNet-Union-Pro-2.0-fp8.safetensors
```

### workflow

ControlNet-Union incorporates multiple typical ControlNets into a single model.

![](https://gyazo.com/9e7cb79f7ca50fe5946ac9f232a552c6){gyazo=image}

[](/workflows/basic-workflows/flux1/FLUX.1-dev-ControlNet-Union-Pro_depth.json)

* 🟩 It is simply a workflow where ControlNet is inserted into an image2image workflow using Flux.

  * Although it is image2image, since `denoise` is 1.0, the behavior is almost the same as text2image.
  * I often use this form because an image of the same size as the input image can be created with fewer nodes.
* 🟩 Input the type of ControlNet you want to use in `SetUnionControlNetType`.

  * Basically `auto` is fine.

---

## GGUF (Lightweighting Flux.1)

Finally, let's touch a little on the **GGUF version of Flux.1**.

Originally GGUF is a format for lightweighting LLMs (quantized weight format), but by applying this to Flux.1, you can **run it at a reasonable speed while reducing VRAM usage**.

### Custom Nodes

* [city96/ComfyUI-GGUF](https://github.com/city96/ComfyUI-GGUF)

### Model Download

There are several variations depending on the balance between performance and model size.
Please choose according to your PC specs and usage.

* [FLUX.1-dev-gguf](https://huggingface.co/city96/FLUX.1-dev-gguf/tree/main)
* [FLUX.1-schnell-gguf](https://huggingface.co/city96/FLUX.1-schnell-gguf/tree/main)

```text
📂ComfyUI/
└── 📂models/
    └── 📂unet/
        └── flux1-dev.gguf
```

### workflow

![](https://gyazo.com/f465ff82b48c4c7b5d5b9ce144f3dc8d){gyazo=image}

[](/workflows/basic-workflows/flux1/FLUX.1-dev-gguf.json)

* 🟪 Replace the `Load Diffusion Model` node with the `Unet Loader (GGUF)` node.
* Other CLIP / T5 / VAE parts remain the same.

  * You can also change T5 to GGUF, but in my experience, the effect is not that significant.

GGUF versions are available for many current models.
Since **there are almost no downsides to using GGUF**, please try using it actively when VRAM is insufficient.
