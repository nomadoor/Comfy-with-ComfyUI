---
layout: page.njk
lang: en
section: basic-workflows
slug: qwen-image
navId: qwen-image
title: "Qwen-Image"
created: 2025-12-11
updated: 2026-03-02
summary: "How to use Qwen-Image"
seoTitle: "Qwen-Image in ComfyUI: ControlNet and Lightning"
seoDescription: "Use Qwen-Image, with Qwen2.5-VL as its text encoder, in ComfyUI: recommended resolutions, text2image, InstantX ControlNet, and the Lightning LoRA."
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "/media/basic-workflows/qwen-image/legacy_gyazo_4f6ca42890bb8717fa4668d8c56bcbc5.png"
tags: []
---

## What is Qwen-Image?

[Qwen-Image](https://github.com/QwenLM/Qwen-Image) is an image generation model developed by the Qwen team at China's Alibaba.

It uses the multimodal LLM **Qwen2.5-VL** as its text encoder, and its prompt understanding is a cut above models that use T5 or Gemma.

On top of that, unlike [Flux.1 dev](/en/basic-workflows/flux-1/), the base isn't a distilled model, so it's easy to train. Together with its sister model [Qwen-Image-Edit](/en/basic-workflows/qwen-image-edit/), it has a rich ecosystem around it, from LoRAs to Lightning models.

---

## Recommended Resolution

For Qwen-Image, around 1.5M to 1.8M pixels is recommended.

* 1:1 ... 1328 × 1328
* 4:3 ... 1472 × 1104
* 3:2 ... 1584 × 1056
* 16:9 ... 1664 × 928

---

## Model Download

* diffusion_models

  * [qwen_image_fp8_e4m3fn.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/blob/main/split_files/diffusion_models/qwen_image_fp8_e4m3fn.safetensors)
* text_encoders

  * [qwen_2.5_vl_7b_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/blob/main/split_files/text_encoders/qwen_2.5_vl_7b_fp8_scaled.safetensors)
* vae

  * [qwen_image_vae.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/blob/main/split_files/vae/qwen_image_vae.safetensors)

- gguf (Optional)

  * [city96/Qwen-Image-gguf](https://huggingface.co/city96/Qwen-Image-gguf/tree/main)
  * [unsloth/Qwen2.5-VL-7B-Instruct-GGUF](https://huggingface.co/unsloth/Qwen2.5-VL-7B-Instruct-GGUF/tree/main)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── qwen_image_fp8_e4m3fn.safetensors
    ├── 📂text_encoders/
    │   ├── qwen_2.5_vl_7b_fp8_scaled.safetensors
    │   └── Qwen2.5-VL-7B.gguf    ← Only when using gguf
    ├── 📂unet/
    │   └── qwen-image.gguf       ← Only when using gguf
    └── 📂vae/
        └── qwen_image_vae.safetensors
```

---

## text2image

![](/media/basic-workflows/qwen-image/legacy_gyazo_c06f913435b344d929cb0ec8e94d20c3.png){media=image}

[](/workflows/basic-workflows/qwen-image/qwen_image.json)

* For the sampler, `euler` or `res_multistep` is the common choice.

---

## ControlNet (InstantX)

There are several ControlNet models for Qwen-Image, but here I'll introduce the InstantX one released as **ControlNet-Union**, since it's easy to use.

### Model Download

* controlnet

  * [Qwen-Image-InstantX-ControlNet-Union.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image-InstantX-ControlNets/blob/main/split_files/controlnet/Qwen-Image-InstantX-ControlNet-Union.safetensors)
  * [Qwen-Image-InstantX-ControlNet-Inpainting.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image-InstantX-ControlNets/blob/main/split_files/controlnet/Qwen-Image-InstantX-ControlNet-Inpainting.safetensors)

```text
📂ComfyUI/
└── 📂models/
    └── 📂controlnet/
        ├── Qwen-Image-InstantX-ControlNet-Union.safetensors
        └── Qwen-Image-InstantX-ControlNet-Inpainting.safetensors
```

### workflow

![](/media/basic-workflows/qwen-image/legacy_gyazo_dd47c0c42514446cddc587561e073e0d.png){media=image}

[](/workflows/basic-workflows/qwen-image/qwen_image_instantx_controlnet_union.json)

![](/media/basic-workflows/qwen-image/legacy_gyazo_26cde876245eaa2fb914859216fc66a4.png){media=image}

[](/workflows/basic-workflows/qwen-image/qwen_image_instantx_controlnet_inpainting.json)

---

## Lightning (High Speed Generation LoRA)

**Qwen-Image-Lightning** is **a set of LoRAs distilled so that Qwen-Image runs in 4 / 8 steps**.

It cuts the step count dramatically with almost no loss in quality, so a lot of workflows use it.

### Model Download

* loras

  * [Qwen-Image-Lightning-4steps-V2.0-bf16.safetensors](https://huggingface.co/lightx2v/Qwen-Image-Lightning/blob/main/Qwen-Image-Lightning-4steps-V2.0-bf16.safetensors)
  * [Qwen-Image-Lightning-8steps-V2.0-bf16.safetensors](https://huggingface.co/lightx2v/Qwen-Image-Lightning/blob/main/Qwen-Image-Lightning-8steps-V2.0-bf16.safetensors)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        ├── Qwen-Image-Lightning-4steps-V2.0-bf16.safetensors
        └── Qwen-Image-Lightning-8steps-V2.0-bf16.safetensors
```

### workflow

![](/media/basic-workflows/qwen-image/qwen_image_lightning_8steps.png){media=image}

[](/workflows/basic-workflows/qwen-image/qwen_image_lightning_8steps.json)

* Load the Lightning LoRA with the `LoraLoaderModelOnly` node.
* Set `steps` in `KSampler` to 4 or 8, and `CFG` to 1.0.
