---
layout: page.njk
lang: en
section: basic-workflows
slug: qwen-image-edit
navId: qwen-image-edit
title: "Qwen-Image-Edit"
summary: "Instruction-based image editing with Qwen-Image-Edit"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/14e608fdb6033e436570157da4645e34.png"
tags: ["instruction-based-image-editing","collage-refine"]
---

## What is Qwen-Image-Edit?

[Qwen-Image-Edit](https://github.com/QwenLM/Qwen-Image) is an [instruction-based image editing model](/en/ai-capabilities/instruction-based-image-editing/) based on [Qwen-Image](/en/basic-workflows/qwen-image/).

Roughly speaking, you can think of it as **the Qwen-Image version of Flux.1 Kontext**.

Flux.1 Kontext was only VAE-based editing, but Qwen-Image-Edit can actually "see" the reference image using MLLM, so flexible editing is possible accordingly.

Some time later, a model called **Qwen-Image-Edit-2509** which supports multi-reference was announced.

Until now, it was only "editing a single image", but with Qwen-Image-Edit-2509:

* "Change the clothes of the person in Image 1 to those in Image 2"
* "Generate an image where Image 1 and Image 2 are standing on the same stage"

Such things become possible.

> Since the training method is different, 2509 is not necessarily upward compatible with the plain version, but if you are unsure, you should use 2509.

---

## Qwen-Image-Edit (Plain)

Regarding what can be done, [Official GitHub](https://github.com/QwenLM/Qwen-Image#showcase-of-qwen-image-edit-2509) or [Flux.1 Kontext / Capabilities](/en/basic-workflows/flux-1-kontext/#capabilities) may also be helpful.


### Model Download

* diffusion_models

  * [qwen_image_edit_fp8_e4m3fn.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image-Edit_ComfyUI/blob/main/split_files/diffusion_models/qwen_image_edit_fp8_e4m3fn.safetensors)
* text_encoders

  * [qwen_2.5_vl_7b_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/blob/main/split_files/text_encoders/qwen_2.5_vl_7b_fp8_scaled.safetensors)
* vae

  * [qwen_image_vae.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/blob/main/split_files/vae/qwen_image_vae.safetensors)
* gguf (Optional)

  * [QuantStack/Qwen-Image-Edit-GGUF](https://huggingface.co/QuantStack/Qwen-Image-Edit-GGUF/tree/main)

    * Please choose a model of Q4_K_M or higher. Performance drops at once if it is less than this.
    * cf. [Qwen-Image-Edit GGUF Model Comparison](https://scrapbox.io/work4ai/Qwen-Image-Edit_GGUF%E3%83%A2%E3%83%87%E3%83%AB%E6%AF%94%E8%BC%83)
  * [unsloth/Qwen2.5-VL-7B-Instruct-GGUF](https://huggingface.co/unsloth/Qwen2.5-VL-7B-Instruct-GGUF/tree/main)
  * [Qwen2.5-VL-7B-Instruct-mmproj-BF16.gguf](https://huggingface.co/QuantStack/Qwen-Image-Edit-GGUF/blob/main/mmproj/Qwen2.5-VL-7B-Instruct-mmproj-BF16.gguf)

    * If you use gguf, this mmproj file is required.

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── qwen_image_edit_fp8_e4m3fn.safetensors
    ├── 📂text_encoders/
    │   ├── qwen_2.5_vl_7b_fp8_scaled.safetensors
    │   ├── Qwen2.5-VL-7B-Instruct.gguf                ← Only when using gguf
    │   └── Qwen2.5-VL-7B-Instruct-mmproj-BF16.gguf    ← Only when using gguf
    ├── 📂vae/
    │   └── qwen_image_vae.safetensors
    └── 📂unet/
        └── qwen-image-edit.gguf                       ← Only when using gguf
```

### workflow

![](https://gyazo.com/fa3508f1458f5a1ab951cab437387a84){gyazo=image}

[](/workflows/basic-workflows/qwen-image-edit/Qwen-Image-Edit.json)


🟩 I will supplement a little about the behavior of the `TextEncodeQwenImageEdit` node.

Internally, it does something like the following processing roughly.

* 1. Resize the input image to about 1M pixels
* 2. Generate latent from that image
* 3. Pass text + image together to Qwen2.5-VL

Since image resizing processing is automatically included, **if the generated image size deviates significantly from 1M pixels, unintended results may occur.**

Therefore, in this workflow, we preprocess the image size in advance.

* Resize to 1M pixels with `ImageScaleToTotalPixels` node
* Crop so that the resolution is a multiple of 8 with `Resize Image v2` node

> Qwen-Image-Edit cannot match "pixel perfect match between input image and edited image" no matter how hard you try.
> Several workarounds have been proposed, but it is better to keep in mind the premise that the model design is not suitable for such use in the first place.

---

## Qwen-Image-Edit-2509

Qwen-Image-Edit-2509 is a new version expanding the plain version.
The biggest difference is that **you can input multiple reference images**.

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

![](https://gyazo.com/0e873dd60f9897e044b9a51cb6c3f70b){gyazo=image}

[](/workflows/basic-workflows/qwen-image-edit/Qwen-Image-Edit-2509.json)

- The basic flow is the same as the plain version, but replace the `TextEncodeQwenImageEdit` node with the `TextEncodeQwenImageEditPlus` node.

### workflow (Multiple Images)

![](https://gyazo.com/85059ee6d9315d44729caebcb8b74f18){gyazo=image}

[](/workflows/basic-workflows/qwen-image-edit/Qwen-Image-Edit-2509_multi-ref.json)

- 🟩 Since it looks at the image properly, it works even with somewhat rough instructions, but you can also explicitly specify which image like "〇〇 of image1" "〇〇 of image2".

Until now, since we wanted to finish the input image and the edited image to be as same size as possible, we performed resizing processing first and input it to latent_image.

On the other hand, in the case of "just want to generate a new image with reference images as hints", there is no problem using the EmptySD3LatentImage node like text2image.

---

## Lightning (for Qwen-Image-Edit-2509)

**Qwen-Image-Edit-2509-Lightning** is a LoRA set distilled so that Qwen-Image-Edit-2509 can be run in 4 / 8 steps.

Since the number of steps can be significantly reduced with almost no degradation, it is adopted in many workflows.

### Model Download

* loras

  * [Qwen-Image-Edit-2509-Lightning-4steps-V1.0-bf16.safetensors](https://huggingface.co/lightx2v/Qwen-Image-Lightning/blob/main/Qwen-Image-Edit-2509/Qwen-Image-Edit-2509-Lightning-4steps-V1.0-bf16.safetensors)
  * [Qwen-Image-Edit-2509-Lightning-8steps-V1.0-bf16.safetensors](https://huggingface.co/lightx2v/Qwen-Image-Lightning/blob/main/Qwen-Image-Edit-2509/Qwen-Image-Edit-2509-Lightning-8steps-V1.0-bf16.safetensors)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        ├── Qwen-Image-Edit-2509-Lightning-4steps-V1.0-bf16.safetensors
        └── Qwen-Image-Edit-2509-Lightning-8steps-V1.0-bf16.safetensors
```

### workflow

![](https://gyazo.com/0410f92580f49cd0b9f4fd8556cd4acb){gyazo=image}

[](/workflows/basic-workflows/qwen-image-edit/Qwen-Image-Edit_lightning_8steps.json)

* Load Lightning LoRA with `LoraLoaderModelOnly` node.
* Set `steps` of `KSampler` to 4 or 8, and `CFG` to around 1.0.
