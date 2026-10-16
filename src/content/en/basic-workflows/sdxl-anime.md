---
layout: page.njk
lang: en
section: basic-workflows
slug: sdxl-anime
navId: sdxl-anime
title: "Anime-style SDXL Models"
created: 2025-12-10
updated: 2026-03-02
summary: "A rough overview of SDXL-based anime models"
seoTitle: "Anime SDXL Models: Illustrious, Pony, Animagine"
seoDescription: "An overview of SDXL-based anime model families you can use in ComfyUI: Animagine XL, Illustrious XL, Pony Diffusion V6 XL, WAI-illustrious, and how they relate."
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "/media/basic-workflows/sdxl-anime/legacy_gyazo_6ee98c633b487214c13c32a9af7d64cb.png"
tags: []
---

## What are Anime-style SDXL Models?

Newer models like Flux and Qwen-Image keep coming out, but when it comes to **anime**, SDXL-based models are still going strong.

More precisely, the models released after SDXL are large, so full fine-tunes of them have become much rarer.

For photorealistic and CG images, base models are now good enough on their own, but there's still no definitive base model that's strong at anime, so we're stuck relying on SDXL.

> [!NOTE]
> To be honest, I don't know much about anime models.
> I think the ones listed here are the representative ones, but I plan to look into them again when I have time.
>
> Anime models are often fine-tuned in very particular directions, and their parameters are unusual too.
> When you actually use one, be sure to read the model creator's notes carefully.

On this page, I'll briefly introduce just the following 5 families as representative anime SDXL models.

- **Animagine XL**
- **Illustrious XL**
- **Pony Diffusion V6 XL**
- **Anything XL**
- **WAI-illustrious**

---

## Animagine XL Family

Animagine XL was one of the very first anime fine-tuned models.
It kept getting updates until fairly recently, and it's a general-purpose model with up-to-date knowledge.

### Model

- [Linaqruf/animagine-xl](https://huggingface.co/Linaqruf/animagine-xl)
- [cagliostrolab/animagine-xl-4.0](https://huggingface.co/cagliostrolab/animagine-xl-4.0) (Latest)

### Workflow

![](/media/basic-workflows/sdxl-anime/legacy_gyazo_770f77d075432d57c742780aea2c9ce1.png){media=image}

[](/workflows/basic-workflows/sdxl-anime/animagine_xl_4_0_opt.json)

---

## Illustrious XL Family

Illustrious XL is a model developed by [OnomaAI](https://www.illustrious-xl.ai/).
What clearly sets it apart from the others is probably that it's developed by a company.
As I recall, at one point it and Pony Diffusion V6 XL (below) were the two giants of anime models.

### Model

- [OnomaAIResearch/Illustrious-XL-v2.0](https://huggingface.co/OnomaAIResearch/Illustrious-XL-v2.0)

### Workflow

![](/media/basic-workflows/sdxl-anime/legacy_gyazo_6cdc06d70882c9e1aecb272e980f1c2f.png){media=image}

[](/workflows/basic-workflows/sdxl-anime/illustrious_xl_v2_0.json)

---

## Pony Diffusion V6 XL

As the name suggests, Pony Diffusion V6 XL is a community-made model built to generate My Little Pony.
It's stronger at fantasy, anthro, and kemono (furry) styles than at Japanese anime.

### Model

- [Pony Diffusion V6 XL](https://civitai.com/models/257749)

### Workflow

![](/media/basic-workflows/sdxl-anime/legacy_gyazo_d1ffe73486004ff4986b887fe671e04e.png){media=image}

[](/workflows/basic-workflows/sdxl-anime/ponydiffusionv6xl_v6startwiththisone.json)

---

## Anything XL

Anything XL (万象熔炉) is a merge of several well-known anime SDXL models (Animagine, Pony, etc.).

### Model

- [Anything XL](https://civitai.com/models/9409/or-anything-xl)

### Workflow

![](/media/basic-workflows/sdxl-anime/legacy_gyazo_68b9972f6b29c83589bf50b92c3b5f76.png){media=image}

[](/workflows/basic-workflows/sdxl-anime/anythingxl_xl.json)

---

## WAI-illustrious Family

WAI-illustrious is one of the derivatives of Illustrious XL, and a popular line whose name still comes up a lot.
It was still getting updates such as v15 as of 2025, which makes it relatively new among the models listed here.

### Model

- [WAI-illustrious-SDXL](https://civitai.com/models/827184/wai-illustrious-sdxl) (V15.0)

### Workflow

![](/media/basic-workflows/sdxl-anime/legacy_gyazo_da7b629edb4f3ca7e8c3eb24b10dc6ec.png){media=image}

[](/workflows/basic-workflows/sdxl-anime/waiillustrioussdxl_v150.json)
