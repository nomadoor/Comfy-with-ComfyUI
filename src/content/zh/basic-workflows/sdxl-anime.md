---
layout: page.njk
lang: zh
section: basic-workflows
slug: sdxl-anime
navId: sdxl-anime
title: "动漫系 SDXL 模型"
created: 2026-02-06
updated: 2026-03-02
summary: "粗略整理基于 SDXL 的动漫系模型"
seoTitle: "动漫系 SDXL 模型汇总：Illustrious、Pony、Animagine"
seoDescription: "整理可在 ComfyUI 中使用的 SDXL 动漫系模型系列：Animagine XL、Illustrious XL、Pony Diffusion V6 XL、WAI-illustrious 等的特点与关系。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/sdxl-anime/legacy_gyazo_6ee98c633b487214c13c32a9af7d64cb.png"
tags: []
---

## 什么是动漫系 SDXL 模型？

虽然 Flux、Qwen-Image 等新模型越来越多，但单就 **动漫系** 而言，基于 SDXL 的模型现在仍是主力。

更准确地说，SDXL 之后出现的模型体积都很大，做全量微调的情况少了很多。

写实和 CG 方面，基础模型本身的性能已经足够了；但擅长动漫的基础模型至今还没有决定版，所以只能继续依赖 SDXL。

> [!NOTE]
> 老实说，我不太熟悉动漫系模型。  
> 我认为这里列出的是有代表性的模型，不过有时间的话打算重新调查一下。  
>
> 动漫系模型的微调往往很极端，参数也很独特。  
> 实际使用时，请务必仔细阅读模型作者的说明。

本页只简单介绍以下 5 个有代表性的动漫系 SDXL 模型系列。

- **Animagine XL**
- **Illustrious XL**
- **Pony Diffusion V6 XL**
- **Anything XL**
- **WAI-illustrious**

---

## Animagine XL 系

Animagine XL 是动漫系微调模型中最早出现的一批。  
直到不久前还在持续更新，是一个掌握较新知识的通用模型。

### 模型

- [Linaqruf/animagine-xl](https://huggingface.co/Linaqruf/animagine-xl)
- [cagliostrolab/animagine-xl-4.0](https://huggingface.co/cagliostrolab/animagine-xl-4.0) (最新)

### 工作流

![](/media/basic-workflows/sdxl-anime/legacy_gyazo_770f77d075432d57c742780aea2c9ce1.png){media=image}

[](/workflows/basic-workflows/sdxl-anime/animagine_xl_4_0_opt.json)

---

## Illustrious XL 系

Illustrious XL 是 [OnomaAI](https://www.illustrious-xl.ai/) 开发的模型。  
和其他模型明显不同的一点，大概是它由企业开发吧。  
印象中它曾和下面要介绍的 Pony Diffusion V6 XL 并称动漫系的两大巨头。

### 模型

- [OnomaAIResearch/Illustrious-XL-v2.0](https://huggingface.co/OnomaAIResearch/Illustrious-XL-v2.0)

### 工作流

![](/media/basic-workflows/sdxl-anime/legacy_gyazo_6cdc06d70882c9e1aecb272e980f1c2f.png){media=image}

[](/workflows/basic-workflows/sdxl-anime/illustrious_xl_v2_0.json)

---

## Pony Diffusion V6 XL

Pony Diffusion V6 XL 正如其名，是社区为了生成《小马宝莉》而做的模型。  
与其说擅长日本动漫，不如说更擅长奇幻、兽人、Kemono（兽系）等题材。

### 模型

- [Pony Diffusion V6 XL](https://civitai.com/models/257749)

### 工作流

![](/media/basic-workflows/sdxl-anime/legacy_gyazo_d1ffe73486004ff4986b887fe671e04e.png){media=image}

[](/workflows/basic-workflows/sdxl-anime/ponydiffusionv6xl_v6startwiththisone.json)

---

## Anything XL

Anything XL（万象熔炉）是由几个有名的动漫系 SDXL 模型（Animagine、Pony 等）融合而成的模型。

### 模型

- [万象熔炉 | Anything XL](https://civitai.com/models/9409/or-anything-xl)

### 工作流

![](/media/basic-workflows/sdxl-anime/legacy_gyazo_68b9972f6b29c83589bf50b92c3b5f76.png){media=image}

[](/workflows/basic-workflows/sdxl-anime/anythingxl_xl.json)

---

## WAI-illustrious 系

WAI-illustrious 是基于 Illustrious XL 的派生模型之一，至今仍常被提起，是很受欢迎的系列。  
截至 2025 年仍在持续更新到 v15 等版本，在这里列出的模型中算是比较新的。

### 模型

- [WAI-illustrious-SDXL](https://civitai.com/models/827184/wai-illustrious-sdxl) (V15.0)

### 工作流

![](/media/basic-workflows/sdxl-anime/legacy_gyazo_da7b629edb4f3ca7e8c3eb24b10dc6ec.png){media=image}

[](/workflows/basic-workflows/sdxl-anime/waiillustrioussdxl_v150.json)
