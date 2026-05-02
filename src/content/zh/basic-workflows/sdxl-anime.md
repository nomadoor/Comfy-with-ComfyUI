---
layout: page.njk
lang: zh
section: basic-workflows
slug: sdxl-anime
navId: sdxl-anime
title: "动漫系 SDXL 模型"
created: 2026-02-06
updated: 2026-03-02
summary: "SDXL 基础的动漫系模型的粗略整理"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/6ee98c633b487214c13c32a9af7d64cb.png"
tags: []
---

## 什么是动漫系 SDXL 模型？

虽然 Flux 和 Qwen-Image 等新模型增加了，但仅限于 **动漫系** 来说 SDXL 基础的模型现在也现役。

更准确地说，SDXL 以后登场的模型尺寸很大，全量微调的情况相当减少了。

虽然实写和 CG 方面基础模型本身的性能已经足够了，但动漫系强的基础模型至今没有决定版，是不得不依赖 SDXL 的状况。

> 老实说，我不太熟悉动漫系模型。  
> 虽说这里列举的东西是代表，但如果有时间的话打算重新调查。  
>
> 动漫系模型经常被进行尖锐的微调，参数也很独特。  
> 实际使用时，请务必仔细阅读模型制作说明。

本页面作为代表性的动漫系 SDXL 模型，只简单介绍以下 5 个系统。

- **Animagine XL**
- **Illustrious XL**
- **Pony Diffusion V6 XL**
- **Anything XL**
- **WAI-illustrious**

---

## Animagine XL 系

Animagine XL 是作为动漫系微调模型最初期登场的模型。  
直到比较最近只要持续进行更新，是拥有新知识的通用模型。

### 模型

- [Linaqruf/animagine-xl](https://huggingface.co/Linaqruf/animagine-xl)
- [cagliostrolab/animagine-xl-4.0](https://huggingface.co/cagliostrolab/animagine-xl-4.0) (最新)

### 工作流

![](https://gyazo.com/770f77d075432d57c742780aea2c9ce1){gyazo=image}

[](/workflows/basic-workflows/sdxl-anime/animagine-xl-4.0-opt.json)

---

## Illustrious XL 系

Illustrious XL 是 [OnomaAI](https://www.illustrious-xl.ai/) 开发的模型。  
与其他模型明确不同的是企业开发的点吧。  
记得一时曾与下一个 Pony Diffusion V6 XL 并列，是动漫系的两大巨头。

### 模型

- [OnomaAIResearch/Illustrious-XL-v2.0](https://huggingface.co/OnomaAIResearch/Illustrious-XL-v2.0)

### 工作流

![](https://gyazo.com/6cdc06d70882c9e1aecb272e980f1c2f){gyazo=image}

[](/workflows/basic-workflows/sdxl-anime/Illustrious-XL-v2.0.json)

---

## Pony Diffusion V6 XL

Pony Diffusion V6 XL 正如其名，是名为为了生成小马宝莉而制作的社区发的模型。  
与其说是日本动漫，不如说擅长奇幻系・兽人・兽系等。

### 模型

- [Pony Diffusion V6 XL](https://civitai.com/models/257749)

### 工作流

![](https://gyazo.com/d1ffe73486004ff4986b887fe671e04e){gyazo=image}

[](/workflows/basic-workflows/sdxl-anime/ponyDiffusionV6XL_v6StartWithThisOne.json)

---

## Anything XL

Anything XL（万象熔炉）是几个有名的动漫系 SDXL 模型（Animagine 和 Pony 等）的合并模型。

### 模型

- [万象熔炉 | Anything XL](https://civitai.com/models/9409/or-anything-xl)

### 工作流

![](https://gyazo.com/68b9972f6b29c83589bf50b92c3b5f76){gyazo=image}

[](/workflows/basic-workflows/sdxl-anime/AnythingXL_xl.json)

---

## WAI-illustrious 系

WAI-illustrious 是以 Illustrious XL 为基础的派生模型之一，是现在也经常被提到的名字的人气系列。  
2025 年时点 v15 等版本升级也在持续，在这里列举的东西中是比较新的模型。

### 模型

- [WAI-illustrious-SDXL](https://civitai.com/models/827184/wai-illustrious-sdxl) (V15.0)

### 工作流

![](https://gyazo.com/da7b629edb4f3ca7e8c3eb24b10dc6ec){gyazo=image}

[](/workflows/basic-workflows/sdxl-anime/waiIllustriousSDXL_v150.json)
