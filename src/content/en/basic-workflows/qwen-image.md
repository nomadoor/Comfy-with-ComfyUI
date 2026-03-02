---
layout: page.njk
lang: en
section: basic-workflows
slug: qwen-image
navId: qwen-image
title: "Qwen-Image"
summary: "How to use Qwen-Image"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/4f6ca42890bb8717fa4668d8c56bcbc5.png"
tags: []
---

## What is Qwen-Image?

[Qwen-Image](https://github.com/QwenLM/Qwen-Image) is an image generation model developed by the Qwen team of Alibaba, China.

It uses the multimodal LLM **Qwen2.5-VL** for the text encoder, and its ability to understand prompts is one step ahead compared to models using T5 or Gemma.

Furthermore, unlike [Flux.1 dev](/en/basic-workflows/flux-1/), the base is not a distilled model, so it is easy to train, and along with its sister model [Qwen-Image-Edit](/en/basic-workflows/qwen-image-edit/) (available in Japanese), it is characterized by a rich surrounding ecosystem such as LoRA and Lightning systems.

---

## Recommended Resolution

Qwen-Image recommends around 1.5M to 1.8M pixels.

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

![](https://gyazo.com/c06f913435b344d929cb0ec8e94d20c3){gyazo=image}

[](/workflows/basic-workflows/qwen-image/Qwen-Image.json)

* `euler` or `res_multistep` is often used for the sampler.

---

## ControlNet (InstantX)

There are several ControlNet models for Qwen-Image, but I will introduce the one based on InstantX provided as **ControlNet-Union** because it is easy to use.

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

![](https://gyazo.com/dd47c0c42514446cddc587561e073e0d){gyazo=image}

[](/workflows/basic-workflows/qwen-image/Qwen-Image-InstantX-ControlNet-Union.json)

![](https://gyazo.com/26cde876245eaa2fb914859216fc66a4){gyazo=image}

[](/workflows/basic-workflows/qwen-image/Qwen-Image-InstantX-ControlNet-Inpainting.json)

---

## Lightning (High Speed Generation LoRA)

**Qwen-Image-Lightning** is a LoRA set distilled so that Qwen-Image can be run in **4 / 8 steps**.

Since it significantly reduces the number of steps with almost no degradation, it is adopted in quite a few workflows.

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

![](https://gyazo.com/08f16f6f84c2d76a7ad1d50c617d32ef){gyazo=image}

[](/workflows/basic-workflows/qwen-image/Qwen-Image_lightning_8steps.json)

* Load Lightning LoRA with some nodes such as `LoraLoaderModelOnly`.
* Set `steps` of `KSampler` to 4 or 8, and `CFG` to 1.0.
