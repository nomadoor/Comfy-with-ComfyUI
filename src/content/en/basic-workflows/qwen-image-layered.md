---
layout: page.njk
lang: en
section: basic-workflows
slug: qwen-image-layered
navId: qwen-image-layered
title: "Qwen-Image-Layered"
summary: "Decompose input image into multiple RGBA layers"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/bfc9ecbc781e79e29f0a9b1df0597bbb.png"
tags: []
---

## What is Qwen-Image-Layered?

It is a diffusion model that decomposes an input image into an arbitrary number of **layers**.

In recent trending image editing, parts unrelated to the instructions sometimes change.
So, the motivation was "why not separate layers like designers have done so far, and edit only the target layer?", right?

It is also noteworthy that it is the first general-purpose method to handle transparent images (RGBA).
Previous methods required post-processing or special processing only during decoding, but this one takes a more straightforward approach of "handling as RGBA images".


---

## Model Download


* diffusion_models

  * [qwen_image_layered_fp8mixed.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image-Layered_ComfyUI/blob/main/split_files/diffusion_models/qwen_image_layered_fp8mixed.safetensors) (20.5 GB)
* text_encoders

  * [qwen_2.5_vl_7b_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/blob/main/split_files/text_encoders/qwen_2.5_vl_7b_fp8_scaled.safetensors) (9.38 GB)
* vae

  * [qwen_image_layered_vae.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image-Layered_ComfyUI/blob/main/split_files/vae/qwen_image_layered_vae.safetensors) (254 MB)
* gguf (Optional)

  * [QuantStack/Qwen-Image-Layered-GGUF](https://huggingface.co/QuantStack/Qwen-Image-Layered-GGUF/tree/main)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── qwen_image_layered_fp8mixed.safetensors
    ├── 📂text_encoders/
    │   └── qwen_2.5_vl_7b_fp8_scaled.safetensors
    ├── 📂unet/
    │   └── Qwen_Image_Layered-XXXX.gguf          ← Only when using gguf
    └── 📂vae/
        └── qwen_image_layered_vae.safetensors
```

---

## workflow

![](https://gyazo.com/f395431169623129f7888c42b0fcadfb){gyazo=image}

[](/workflows/basic-workflows/qwen-image-layered/Qwen-Image-Layered.json)


* Resize input image

  * It can handle up to 1024px, but since it tends to get heavier as the number of layers increases, it is set to 0.5M pixels here.
* 🟩`Empty Qwen Image Layered Latent`

  * `layers`: Number of layers you want to split
  * Increasing this also increases memory and time costs.

* 🟫`LatentCutToBatch`

  * It might be hard to understand what it is doing, but please think of it as "formatting" for implementation convenience.
  * As the name suggests, this model outputs multiple images as "layers", but the current `VAE Decode` cannot understand the concept of layers well, so it converts them into a simple batch of N images.

* 🟦 Synthesize images again (Optional)
  - If split into 2 layers, a total of 3 RGBA images (original image + decomposition results) are output.
  * You can return to the original single image by continuing to overlay the 2nd and subsequent images with `ImageCompositeMasked`.
    - However, since this node can only handle RGB images, it is necessary to convert it to the form of RGB image + mask.
    - cf. [Mask and Alpha Channel](/en/data-utilities/mask-alpha/)

  * I think it's troublesome, but node-based UIs and layer systems are not very compatible, not limited to ComfyUI 😥


---

## Reference

* [Qwen Image Edit 2511 & Qwen Image Layered in ComfyUI](https://blog.comfy.org/p/qwen-image-edit-2511-and-qwen-image)
