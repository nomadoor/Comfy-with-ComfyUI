---
layout: page.njk
lang: en
section: basic-workflows
slug: lumina-image-2.0
navId: lumina-image-2.0
title: "Lumina-Image 2.0"
summary: "Basics of Lumina-Image 2.0 and usage in ComfyUI"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/0eef66b0663a16cd722915b2dcde0c84.png"
tags: []
---


## What is Lumina-Image 2.0?

[Lumina-Image 2.0](https://github.com/Alpha-VLLM/Lumina-Image-2.0) is a **2.6B parameter image generation model** that combines Unified Next-DiT and Flux-based VAE.

While adopting the Gemma 2B text encoder, the model body is considerably smaller than SD3 and FLUX Pro, and **like AuraFlow, it is designed aiming for the "relatively lightweight and easy-to-use base model" category**.
It is also characterized by high prompt adherence for its size, and attracted attention as one of the candidates for the next-generation base model.

However, since it uses Gemma 2B (2B parameters) as a text encoder, it should be noted that the VRAM usage for the text encoder is slightly larger compared to SD1.5 etc.


---

## Model Download

* diffusion_models

  * [lumina_2_model_bf16.safetensors](https://huggingface.co/Comfy-Org/Lumina_Image_2.0_Repackaged/blob/main/split_files/diffusion_models/lumina_2_model_bf16.safetensors)
* text_encoders

  * [gemma_2_2b_fp16.safetensors](https://huggingface.co/Comfy-Org/Lumina_Image_2.0_Repackaged/blob/main/split_files/text_encoders/gemma_2_2b_fp16.safetensors)
* vae

  * [ae.safetensors](https://huggingface.co/black-forest-labs/FLUX.1-schnell/blob/main/ae.safetensors)

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

![](https://gyazo.com/7230949afb0971f994ed67980b88c14d){gyazo=image}

[](/workflows/basic-workflows/lumina-image-2.0/Lumina-Image-2.0.json)

---

## Neta Lumina

[Neta-Lumina](https://huggingface.co/neta-art/Neta-Lumina) is a **fine-tuned model for anime** based on Lumina-Image 2.0.

Like an anime model, it also supports Danbooru tags and is characterized by accepting multi-language prompts such as Chinese, English, and Japanese.

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

![](https://gyazo.com/f9d633456c16c8869b941394fe17bac4){gyazo=image}

[](/workflows/basic-workflows/lumina-image-2.0/neta-lumina-v1.0.json)

- Follow the official settings for the sampler, use `res_multistep` / `linear_quadratic`.

Prompts are a bit unique, and you need to write a **system prompt** before the text you actually want to generate.

```text
You are an assistant designed to generate anime images based on textual prompts. <Prompt Start>
1girl, portrait, ...
```

Please refer to the official Prompt Book for details.
- [Neta Lumina Prompt Book](https://nieta-art.feishu.cn/wiki/RY3GwpT59icIQlkWXEfcCqIMnQd)

---

## NetaYume Lumina

There is also a model called [NetaYume Lumina](https://huggingface.co/duongve/NetaYume-Lumina-Image-2.0), which is further fine-tuned based on Neta Lumina.

I will introduce this as well.

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

![](https://gyazo.com/eb9e649d59482227ed68b7c4c0ed86eb){gyazo=image}

[](/workflows/basic-workflows/lumina-image-2.0/NetaYumev4.json)

---

## NewBie image Exp0.1

NewBie-image (Exp0.1) is an anime-focused T2I model with a unique NewBie architecture designed based on Next-DiT, incorporating insights from Lumina architecture research. It uses a more powerful text encoder and enables more detailed control with XML-formatted prompts (structured tags).

> This model is only 20% trained. The workflow may change with future updates.

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

![](https://gyazo.com/d7253fbe289e281e77dbb074d42c392d){gyazo=image}

[](/workflows/basic-workflows/lumina-image-2.0/NewBie_image_Exp0.1.json)

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

However, you can generate images without problems even if you write in natural language, so please feel free to try it first.

Please refer to the official prompt guide for details.
- [NewBie-image Deployment and Zero-Threshold Usage Tutorial / Prompt Writing](https://ai.feishu.cn/wiki/NZl9wm7V1iuNzmkRKCUcb1USnsh#RN74dYdXaokGnSx0F5IcaBK0nHc)
