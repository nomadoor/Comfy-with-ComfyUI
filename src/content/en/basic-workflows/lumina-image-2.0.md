---
layout: page.njk
lang: en
section: basic-workflows
slug: lumina-image-2.0
navId: lumina-image-2.0
title: "Lumina-Image 2.0"
created: 2025-12-11
updated: 2026-03-02
summary: "Lumina-Image 2.0 basics and how to use it in ComfyUI"
seoTitle: "Lumina-Image 2.0 and Neta Lumina in ComfyUI"
seoDescription: "Use Lumina-Image 2.0, a light 2.6B image model, and anime models Neta Lumina, NetaYume Lumina, and NewBie image in ComfyUI, with workflows."
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "/media/basic-workflows/lumina-image-2.0/legacy_gyazo_0eef66b0663a16cd722915b2dcde0c84.png"
tags: []
---


## What is Lumina-Image 2.0?

[Lumina-Image 2.0](https://github.com/Alpha-VLLM/Lumina-Image-2.0) is a **2.6B parameter image generation model** that pairs Unified Next-DiT with a Flux-family VAE.

It uses a Gemma 2B-family text encoder, but the model itself is much smaller than SD3 or FLUX Pro. **Like AuraFlow, it's designed to fill the "relatively lightweight base model that's easy to use every day" slot**.
It also follows prompts well for its size, and drew attention as one of the candidates for the next generation of base models.

However, since it uses Gemma 2B (2B parameters) as a text encoder, it should be noted that the VRAM usage for the text encoder is slightly larger compared to SD1.5 etc.


---

## Model Download

* diffusion_models

  * [lumina_2_model_bf16.safetensors](https://huggingface.co/Comfy-Org/Lumina_Image_2.0_Repackaged/blob/main/split_files/diffusion_models/lumina_2_model_bf16.safetensors)
* text_encoders

  * [gemma_2_2b_fp16.safetensors](https://huggingface.co/Comfy-Org/Lumina_Image_2.0_Repackaged/blob/main/split_files/text_encoders/gemma_2_2b_fp16.safetensors)
* vae

  * [ae.safetensors](https://huggingface.co/Comfy-Org/z_image/blob/main/split_files/vae/ae.safetensors)

```text
📂ComfyUI/
└──📂models/
    ├── 📂diffusion_models/
    │   └── lumina_2_model_bf16.safetensors
    ├── 📂text_encoders/
    │   └── gemma_2_2b_fp16.safetensors
    └── 📂vae/
        └── ae.safetensors
```

---

## text2image

![](/media/basic-workflows/lumina-image-2.0/legacy_gyazo_7230949afb0971f994ed67980b88c14d.png){media=image}

[](/workflows/basic-workflows/lumina-image-2.0/lumina_image_2_0.json)

---

## Neta Lumina

[Neta-Lumina](https://huggingface.co/neta-art/Neta-Lumina) is a **fine-tuned model for anime** based on Lumina-Image 2.0.

As you'd expect from an anime model, it supports Danbooru tags, and it also accepts prompts in multiple languages: Chinese, English, and Japanese.

### Model Download

* diffusion_models

  * [neta-lumina-v1.0.safetensors](https://huggingface.co/neta-art/Neta-Lumina/blob/main/Unet/neta-lumina-v1.0.safetensors)

```text
📂ComfyUI/
└──📂models/
    └── 📂diffusion_models/
         └── neta-lumina-v1.0.safetensors
```


### text2image

![](/media/basic-workflows/lumina-image-2.0/legacy_gyazo_f9d633456c16c8869b941394fe17bac4.png){media=image}

[](/workflows/basic-workflows/lumina-image-2.0/neta_lumina_v1_0.json)

- Following the official settings, the sampler uses `res_multistep` / `linear_quadratic`.

The prompt is a little unusual: you need to put a **system prompt** before the prompt you actually want to use.

```text
You are an assistant designed to generate anime images based on textual prompts. <Prompt Start>
1girl, portrait, ...
```

See the official Prompt Book for details.
- [Neta Lumina Prompt Book](https://nieta-art.feishu.cn/wiki/RY3GwpT59icIQlkWXEfcCqIMnQd)

---

## NetaYume Lumina

There's also [NetaYume Lumina](https://huggingface.co/duongve/NetaYume-Lumina-Image-2.0), a further fine-tune built on Neta Lumina.

While we're at it, let's cover this one too.

### Model Download

* diffusion_models

  * [NetaYumev4_unet.safetensors](https://huggingface.co/duongve/NetaYume-Lumina-Image-2.0/blob/main/Unet/v4/NetaYumev4_unet.safetensors)

```text
📂ComfyUI/
└──📂models/
    └── 📂diffusion_models/
         └── NetaYumev4_unet.safetensors
```

### text2image

![](/media/basic-workflows/lumina-image-2.0/legacy_gyazo_eb9e649d59482227ed68b7c4c0ed86eb.png){media=image}

[](/workflows/basic-workflows/lumina-image-2.0/netayumev4.json)

---

## NewBie image Exp0.1

NewBie-image (Exp0.1) is an anime-focused T2I model with NewBie's own architecture, built on Next-DiT and informed by research on the Lumina architecture. It uses a stronger text encoder and allows finer control through XML-style prompts (structured tags).

> [!NOTE]
> This model is only 20% of the way through training. The workflow may change with future updates.

### Model Download

- diffusion models
  * [NewBie-Image-Exp0.1-bf16.safetensors](https://huggingface.co/Comfy-Org/NewBie-image-Exp0.1_repackaged/blob/main/split_files/diffusion_models/NewBie-Image-Exp0.1-bf16.safetensors)
  

- text encoders
  * [gemma_3_4b_it_bf16.safetensors](https://huggingface.co/Comfy-Org/NewBie-image-Exp0.1_repackaged/blob/main/split_files/text_encoders/gemma_3_4b_it_bf16.safetensors)
  * [jina_clip_v2_bf16.safetensors](https://huggingface.co/Comfy-Org/NewBie-image-Exp0.1_repackaged/blob/main/split_files/text_encoders/jina_clip_v2_bf16.safetensors)

- vae
  * [ae.safetensors](https://huggingface.co/Comfy-Org/Lumina_Image_2.0_Repackaged/blob/main/split_files/vae/ae.safetensors)

```
📂ComfyUI/
└──📂models/
    ├── 📂diffusion_models/
    │   └── NewBie-Image-Exp0.1-bf16.safetensors
    ├── 📂text_encoders/
    │   ├── gemma_3_4b_it_bf16.safetensors
    │   └── jina_clip_v2_bf16.safetensors
    └── 📂vae/
        └── ae.safetensors

```

### text2image

![](/media/basic-workflows/lumina-image-2.0/legacy_gyazo_d7253fbe289e281e77dbb074d42c392d.png){media=image}

[](/workflows/basic-workflows/lumina-image-2.0/newbie_image_exp0_1.json)

Prompts in XML format (structured with tags) are recommended.

```
<general_tags>
  <style>
    anime_style, key_visual, official_art, illustration,
    refined_lineart, clean_lineart, high_contrast
  </style>
  <background>
    underwater, deep_blue_water, water_surface, waterline,
    caustics, light_rays, reflections
  </background>
</general_tags>
```

That said, natural-language prompts work fine too, so just give it a try first.

See the official prompt guide for details.
- [NewBie-image Deployment and Zero-Threshold Usage Tutorial / Prompt Writing](https://ai.feishu.cn/wiki/NZl9wm7V1iuNzmkRKCUcb1USnsh#RN74dYdXaokGnSx0F5IcaBK0nHc)
