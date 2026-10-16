---
layout: page.njk
lang: en
section: basic-workflows
slug: qwen-image-layered
navId: qwen-image-layered
title: "Qwen-Image-Layered"
created: 2025-12-31
updated: 2026-03-02
summary: "Split an input image into multiple RGBA layers"
seoTitle: "Qwen-Image-Layered in ComfyUI: Split Images into Layers"
seoDescription: "Use Qwen-Image-Layered to split an image into transparent RGBA layers and edit just one. The idea, model download, and workflow in ComfyUI."
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "/media/basic-workflows/qwen-image-layered/legacy_gyazo_bfc9ecbc781e79e29f0a9b1df0597bbb.png"
tags: []
---

## What is Qwen-Image-Layered?

It's a diffusion model that splits an input image into any number of **layers**.

Image editing is all the rage lately, but parts unrelated to your instruction sometimes change too.
So why not split the image into layers, the way designers always have, and edit only the layer you want? That's the idea behind this task.

It's also notable as the first general-purpose method that handles transparent (RGBA) images.
Earlier methods needed post-processing, or special handling just at decode time, but this one takes the more straightforward approach of simply treating them as RGBA images.


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

![](/media/basic-workflows/qwen-image-layered/legacy_gyazo_f395431169623129f7888c42b0fcadfb.png){media=image}

[](/workflows/basic-workflows/qwen-image-layered/qwen_image_layered.json)


* Resize the input image

  * You can go up to 1024px, but it tends to get heavy as you add layers, so it's set to 0.5M pixels here.
* 🟩`Empty Qwen Image Layered Latent`

  * `layers`: how many layers to split into
  * Raising this also costs more memory and time.

* 🟫`LatentCutToBatch`

  * It's probably hard to tell what this is doing, but just think of it as "reshaping" the data for implementation reasons.
  * As the name says, this model outputs multiple images as "layers", but the current `VAE Decode` doesn't really understand the idea of layers, so this node turns them into a plain batch of N images.

* 🟦 Composite the images back together (Optional)
  - If you split into 2 layers, you get 3 RGBA images in total (the original image + the decomposed layers).
  * Stacking the 2nd and later images one after another with `ImageCompositeMasked` gets you back to the original single image.
    - However, this node only handles RGB images, so you need to convert each one into an RGB image + mask.
    - cf. [Mask and Alpha Channel](/en/data-utilities/mask-alpha/)

  * It's a hassle, I know, but node-based UIs and layer systems just don't get along, and not only in ComfyUI 😥


---

## Reference

* [Qwen Image Edit 2511 & Qwen Image Layered in ComfyUI](https://blog.comfy.org/p/qwen-image-edit-2511-and-qwen-image)
