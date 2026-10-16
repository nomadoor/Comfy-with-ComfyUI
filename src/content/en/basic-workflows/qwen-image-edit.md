---
layout: page.njk
lang: en
section: basic-workflows
slug: qwen-image-edit
navId: qwen-image-edit
title: "Qwen-Image-Edit"
created: 2025-12-11
updated: 2026-03-02
summary: "Instruction-based image editing with Qwen-Image-Edit"
seoTitle: "Qwen-Image-Edit in ComfyUI: Original, 2509, 2511"
seoDescription: "Use Qwen-Image-Edit for instruction-based editing in ComfyUI: downloads for the original, 2509, and 2511, and edits with one or several images."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/qwen-image-edit/legacy_gyazo_14e608fdb6033e436570157da4645e34.png"
tags: ["instruction-based-image-editing","collage-refine"]
---

## What is Qwen-Image-Edit?

[Qwen-Image-Edit](https://github.com/QwenLM/Qwen-Image) is an [instruction-based image editing model](/en/ai-capabilities/instruction-based-image-editing/) based on [Qwen-Image](/en/basic-workflows/qwen-image/).

Roughly speaking, you can think of it as the **Qwen-Image version of Flux.1 Kontext**.

Flux.1 Kontext could only edit through the VAE, but Qwen-Image-Edit uses an MLLM to actually "see" the reference image, so it can make more flexible edits.

A while later, **Qwen-Image-Edit-2509** came out with multi-reference support.

Until then, you could only edit a single image, but with Qwen-Image-Edit-2509 you can do things like:

* "Change the clothes of the person in Image 1 to those in Image 2"
* "Generate an image where Image 1 and Image 2 are standing on the same stage"

> [!TIP]
> Because it was trained differently, 2509 isn't strictly an upgrade over the original, but if you're unsure, just go with 2509.

---

## Qwen-Image-Edit (Original)

For what it can do, the [Official GitHub](https://github.com/QwenLM/Qwen-Image#showcase-of-qwen-image-edit-2509) or [Flux.1 Kontext / What it can do](/en/basic-workflows/flux-1-kontext/#what-it-can-do) should give you a good idea.

### Model Download

* diffusion_models

  * [qwen_image_edit_fp8_e4m3fn.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image-Edit_ComfyUI/blob/main/split_files/diffusion_models/qwen_image_edit_fp8_e4m3fn.safetensors)
* text_encoders

  * [qwen_2.5_vl_7b_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/blob/main/split_files/text_encoders/qwen_2.5_vl_7b_fp8_scaled.safetensors)
* vae

  * [qwen_image_vae.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/blob/main/split_files/vae/qwen_image_vae.safetensors)
* gguf (Optional)

  * [QuantStack/Qwen-Image-Edit-GGUF](https://huggingface.co/QuantStack/Qwen-Image-Edit-GGUF/tree/main)

    * Choose Q4_K_M or higher. Below that, quality drops off sharply.
    * cf. [Qwen-Image-Edit GGUF model comparison](https://scrapbox.io/work4ai/Qwen-Image-Edit_GGUF%E3%83%A2%E3%83%87%E3%83%AB%E6%AF%94%E8%BC%83)
  * [unsloth/Qwen2.5-VL-7B-Instruct-GGUF](https://huggingface.co/unsloth/Qwen2.5-VL-7B-Instruct-GGUF/tree/main)
  * [Qwen2.5-VL-7B-Instruct-mmproj-BF16.gguf](https://huggingface.co/QuantStack/Qwen-Image-Edit-GGUF/blob/main/mmproj/Qwen2.5-VL-7B-Instruct-mmproj-BF16.gguf)

    * This mmproj file is required when using gguf.

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── qwen_image_edit_fp8_e4m3fn.safetensors
    ├── 📂text_encoders/
    │   ├── qwen_2.5_vl_7b_fp8_scaled.safetensors
    │   ├── Qwen2.5-VL-7B-Instruct.gguf               ← Only when using gguf
    │   └── Qwen2.5-VL-7B-Instruct-mmproj-BF16.gguf    ← Only when using gguf
    ├── 📂vae/
    │   └── qwen_image_vae.safetensors
    └── 📂unet/
        └── qwen-image-edit.gguf                       ← Only when using gguf
```

### workflow

![](/media/basic-workflows/qwen-image-edit/legacy_gyazo_79b84b74171ddd5c9cfdb57bccc69f13.png){media=image}

[](/workflows/basic-workflows/qwen-image-edit/qwen_image_edit.json)

🟩 A quick note on how the `TextEncodeQwenImageEdit` node behaves.

Internally, it roughly does the following:

* 1. Resize the input image to about 1M pixels
* 2. Create a latent from that image
* 3. Pass text + image together to Qwen2.5-VL

Because this resize happens automatically, **if the output image size is far from 1M pixels, you may get unexpected results.**

So this workflow prepares the image size beforehand.

* Resize to 1M pixels with the `ImageScaleToTotalPixels` node
* Crop with the `Resize Image v2` node so the resolution is a multiple of 8

> [!NOTE]
> No matter what you try, Qwen-Image-Edit can't make the edited image match the input image pixel-perfectly.
> A few workarounds have been suggested, but it's worth keeping in mind that the model simply isn't designed for that kind of use.

---

## Qwen-Image-Edit-2509

Qwen-Image-Edit-2509 is an extended version of the original.
The biggest difference is that it **accepts multiple reference images**.

### Model Download

* diffusion_models

  * [qwen_image_edit_2509_fp8_e4m3fn.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image-Edit_ComfyUI/blob/main/split_files/diffusion_models/qwen_image_edit_2509_fp8_e4m3fn.safetensors)
* gguf (Optional)

  * [QuantStack/Qwen-Image-Edit-2509-GGUF](https://huggingface.co/QuantStack/Qwen-Image-Edit-2509-GGUF/tree/main)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── qwen_image_edit_2509_fp8_e4m3fn.safetensors
    └── 📂unet/
        └── qwen-image-edit-2509.gguf      ← Only when using gguf
```

### workflow (Single Image)

![](/media/basic-workflows/qwen-image-edit/legacy_gyazo_456e6aec210ae38313aa25f83ce236df.png){media=image}

[](/workflows/basic-workflows/qwen-image-edit/qwen_image_edit_2509.json)

- The basic flow is the same as the original; just replace the `TextEncodeQwenImageEdit` node with the `TextEncodeQwenImageEditPlus` node.

### workflow (Multiple Images)

![](/media/basic-workflows/qwen-image-edit/legacy_gyazo_e33abcb42d03c53f3171a8fb12d7eca0.png){media=image}

[](/workflows/basic-workflows/qwen-image-edit/qwen_image_edit_2509_multi_ref.json)

- 🟩 Because it really looks at the images, fairly loose instructions work, but you can also say explicitly which image you mean, like "the XX in image1" or "the XX in image2".

So far, we wanted the input and edited images to come out at roughly the same size, so we resized first and fed the result into `latent_image`.

If you just want to generate a new image using the reference images as hints, though, it's fine to use the `EmptySD3LatentImage` node, as in text2image.

---

## Qwen-Image-Edit-2511

Qwen-Image-Edit-2511 is a new model that improves on 2509.

The jump isn't as big as the one from the original to 2509, but it's a solid step forward: better character consistency, and popular LoRAs such as the Relighting LoRA built into the model.

### Model Download

* diffusion_models

  * [qwen_image_edit_2511_fp8mixed.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image-Edit_ComfyUI/blob/main/split_files/diffusion_models/qwen_image_edit_2511_fp8mixed.safetensors)

* gguf (Optional)

  * [unsloth/Qwen-Image-Edit-2511-GGUF](https://huggingface.co/unsloth/Qwen-Image-Edit-2511-GGUF/tree/main)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── qwen_image_edit_2511_fp8mixed.safetensors
    └── 📂unet/
        └── qwen-image-edit-2511-XXXX.gguf      ← Only when using gguf
```

### workflow

![](/media/basic-workflows/qwen-image-edit/legacy_gyazo_6d45ea40c1194384fb75c383c43a116b.png){media=image}

[](/workflows/basic-workflows/qwen-image-edit/qwen_image_edit_2511.json)

It works with exactly the same workflow as 2509.

---


## Lightning

**Qwen-Image-Edit-Lightning** is a set of LoRAs distilled so that Qwen-Image-Edit runs in 4 / 8 steps.

It cuts the step count dramatically with almost no loss in quality, so many workflows use it.

### Model Download

* loras

  * [Qwen-Image-Edit-2509-Lightning-4steps-V1.0-bf16.safetensors](https://huggingface.co/lightx2v/Qwen-Image-Lightning/blob/main/Qwen-Image-Edit-2509/Qwen-Image-Edit-2509-Lightning-4steps-V1.0-bf16.safetensors)
  * [Qwen-Image-Edit-2509-Lightning-8steps-V1.0-bf16.safetensors](https://huggingface.co/lightx2v/Qwen-Image-Lightning/blob/main/Qwen-Image-Edit-2509/Qwen-Image-Edit-2509-Lightning-8steps-V1.0-bf16.safetensors)
  - [Qwen-Image-Edit-2511-Lightning-4steps-V1.0-bf16.safetensors](https://huggingface.co/lightx2v/Qwen-Image-Edit-2511-Lightning/blob/main/Qwen-Image-Edit-2511-Lightning-4steps-V1.0-bf16.safetensors)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        ├── Qwen-Image-Edit-2509-Lightning-4steps-V1.0-bf16.safetensors
        ├── Qwen-Image-Edit-2509-Lightning-8steps-V1.0-bf16.safetensors
        └── Qwen-Image-Edit-2511-Lightning-4steps-V1.0-bf16.safetensors
```

### Qwen-Image-Edit-2509

![](/media/basic-workflows/qwen-image-edit/legacy_gyazo_c91a20239e3cb536dfc931a30562f19f.png){media=image}

[](/workflows/basic-workflows/qwen-image-edit/qwen_image_edit_lightning_8steps.json)

* Load the Lightning LoRA with the `LoraLoaderModelOnly` node.
* Set `steps` in `KSampler` to 4 or 8, and `CFG` to 1.0.

### Qwen-Image-Edit-2511

![](/media/basic-workflows/qwen-image-edit/legacy_gyazo_cc8cbe2a940d686092555896d4b3f067.png){media=image}

[](/workflows/basic-workflows/qwen-image-edit/qwen_image_edit_2511_lightning_4steps.json)

* Load the Lightning LoRA with the `LoraLoaderModelOnly` node.
