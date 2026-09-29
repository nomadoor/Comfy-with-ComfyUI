---
layout: page.njk
lang: en
section: basic-workflows
slug: sdxl-anime
navId: sdxl-anime
title: "Anime-style SDXL Models"
created: 2025-12-10
updated: 2026-03-02
summary: "Rough organization of SDXL-based anime models"
seoTitle: "Anime SDXL Models: Illustrious, Pony, Animagine"
seoDescription: "An overview of SDXL-based anime model families you can use in ComfyUI: Animagine XL, Illustrious XL, Pony Diffusion V6 XL, WAI-illustrious, and how they relate."
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "/media/basic-workflows/sdxl-anime/legacy_gyazo_6ee98c633b487214c13c32a9af7d64cb.png"
tags: []
---

## What are Anime-style SDXL Models?

New models like Flux and Qwen-Image have increased, but SDXL-based models are still active when it comes to **anime style**.

To be more precise, models that appeared after SDXL are large in size, and cases of full fine-tuning have decreased considerably.

For photorealistic or CG styles, the performance of the base model itself has become sufficient, but there is still no definitive base model strong in anime style, so the situation is that we have to rely on SDXL.

> [!NOTE]
> To be honest, I am not very knowledgeable about anime-style models.
> I think the ones listed here are representative, but I plan to research again if I have time.
>
> Anime-style models are often fine-tuned sharply, and parameters are unique.
> When actually using them, be sure to read the model creator's explanation carefully.

In this page, I will briefly introduce only the following 5 lineages as representative anime-style SDXL models.

- **Animagine XL**
- **Illustrious XL**
- **Pony Diffusion V6 XL**
- **Anything XL**
- **WAI-illustrious**

---

## Animagine XL Family

Animagine XL appeared in the very early stages as an anime-style fine-tuning model.
Updates have been continued until relatively recently, and it is a general-purpose model with new knowledge.

### Model

- [Linaqruf/animagine-xl](https://huggingface.co/Linaqruf/animagine-xl)
- [cagliostrolab/animagine-xl-4.0](https://huggingface.co/cagliostrolab/animagine-xl-4.0) (Latest)

### Workflow

![](/media/basic-workflows/sdxl-anime/legacy_gyazo_770f77d075432d57c742780aea2c9ce1.png){media=image}

[](/workflows/basic-workflows/sdxl-anime/animagine_xl_4_0_opt.json)

---

## Illustrious XL Family

Illustrious XL is a model being developed by [OnomaAI](https://www.illustrious-xl.ai/).
Wait is clearly different from other models is that it is developed by a company.
I recall that at one time, alongside Pony Diffusion V6 XL below, it was one of the two giants of the anime style.

### Model

- [OnomaAIResearch/Illustrious-XL-v2.0](https://huggingface.co/OnomaAIResearch/Illustrious-XL-v2.0)

### Workflow

![](/media/basic-workflows/sdxl-anime/legacy_gyazo_6cdc06d70882c9e1aecb272e980f1c2f.png){media=image}

[](/workflows/basic-workflows/sdxl-anime/illustrious_xl_v2_0.json)

---

## Pony Diffusion V6 XL

Pony Diffusion V6 XL is a community-created model made to generate My Little Pony as the name suggests.
It is stronger in fantasy, beastmen, and furry styles rather than Japanese anime.

### Model

- [Pony Diffusion V6 XL](https://civitai.com/models/257749)

### Workflow

![](/media/basic-workflows/sdxl-anime/legacy_gyazo_d1ffe73486004ff4986b887fe671e04e.png){media=image}

[](/workflows/basic-workflows/sdxl-anime/ponydiffusionv6xl_v6startwiththisone.json)

---

## Anything XL

Anything XL is a merged model of several famous anime-style SDXL models (Animagine, Pony, etc.).

### Model

- [Anything XL](https://civitai.com/models/9409/or-anything-xl)

### Workflow

![](/media/basic-workflows/sdxl-anime/legacy_gyazo_68b9972f6b29c83589bf50b92c3b5f76.png){media=image}

[](/workflows/basic-workflows/sdxl-anime/anythingxl_xl.json)

---

## WAI-illustrious Family

WAI-illustrious is one of the derivative models based on Illustrious XL, and it is a popular lineage whose name is still often mentioned now.
Even in 2025, version upgrades such as v15 are continuing, and it is a relatively new model among those listed here.

### Model

- [WAI-illustrious-SDXL](https://civitai.com/models/827184/wai-illustrious-sdxl) (V15.0)

### Workflow

![](/media/basic-workflows/sdxl-anime/legacy_gyazo_da7b629edb4f3ca7e8c3eb24b10dc6ec.png){media=image}

[](/workflows/basic-workflows/sdxl-anime/waiillustrioussdxl_v150.json)
