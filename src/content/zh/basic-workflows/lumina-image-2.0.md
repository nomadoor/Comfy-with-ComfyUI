---
layout: page.njk
lang: zh
section: basic-workflows
slug: lumina-image-2.0
navId: lumina-image-2.0
title: "Lumina-Image 2.0"
created: 2025-12-11
updated: 2026-03-02
summary: "Lumina-Image 2.0 的基础和在 ComfyUI 中的使用方法"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/0eef66b0663a16cd722915b2dcde0c84.png"
tags: []
---


## 什么是 Lumina-Image 2.0？

[Lumina-Image 2.0](https://github.com/Alpha-VLLM/Lumina-Image-2.0) 是组合了 Unified Next-DiT 和 Flux 系 VAE 的 **2.6B 参数的图像生成模型**。

采用了 Gemma 2B 系文本编码器，模型本体比 SD3 和 FLUX Pro 相当小，设计目标和 **AuraFlow 一样是“比较轻量且日常容易使用的基础模型”定位**。
尺寸虽小但提示词遵从性高也是特征，作为次世代基础模型候补之一备受瞩目。


---

## 模型的下载

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

![](https://gyazo.com/7230949afb0971f994ed67980b88c14d){gyazo=image}

[](/workflows/basic-workflows/lumina-image-2.0/Lumina-Image-2.0.json)

---

## Neta Lumina

[Neta-Lumina](https://huggingface.co/neta-art/Neta-Lumina) 是以 Lumina-Image 2.0 为基础的 **动漫面向微调模型**。

很有动漫模型的风格，也对应 Danbooru 标签，特征是接受中文・英语・日语和多语言的提示词。

### 模型的下载

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

- 采样器遵从官方设定，使用 `res_multistep` / `linear_quadratic`。

提示词稍微有特征，需要在实际想让其画的文本前写 **系统提示词**。

```text
You are an assistant designed to generate anime images based on textual prompts. <Prompt Start>
1girl, portrait, ...
```

详情请参照官方的 Prompt Book。
- [Neta Lumina Prompt Book](https://nieta-art.feishu.cn/wiki/RY3GwpT59icIQlkWXEfcCqIMnQd)

---

## NetaYume Lumina

也有以 Neta Lumina 为基础，进一步微调的名为 [NetaYume Lumina](https://huggingface.co/duongve/NetaYume-Lumina-Image-2.0) 的模型。

机会难得，这里也介绍一下吧。

### 模型的下载

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

NewBie-image（Exp0.1）是立足于 Lumina 架构研究的知识，以 Next-DiT 为地基设计的 NewBie 独自架构的动漫面向 T2I 模型。使用了更强力的文本编码器，设计为能用 XML 形式提示词（结构化标签）进行更细致地控制。

> 这个模型还只进行了 20% 的训练。根据今后的更新，workflow 可能会有变更。

### 模型的下载

- diffusion models
  * [NewBie-Image-Exp0.1-bf16.safetensors](https://huggingface.co/Comfy-Org/NewBie-image-Exp0.1_repackaged/blob/main/split_files/diffusion_models/NewBie-Image-Exp0.1-bf16.safetensors)
  

- text encoders
  * [gemma_3_4b_it_bf16.safetensors](https://huggingface.co/Comfy-Org/NewBie-image-Exp0.1_repackaged/blob/main/split_files/text_encoders/gemma_3_4b_it_bf16.safetensors)
  * [jina_clip_v2_bf16.safetensors](https://huggingface.co/Comfy-Org/NewBie-image-Exp0.1_repackaged/blob/main/split_files/text_encoders/jina_clip_v2_bf16.safetensors)

- vae
  * [ae.safetensors](https://huggingface.co/Comfy-Org/Lumina_Image_2.0_Repackaged/blob/main/split_files/vae/ae.safetensors)

```text
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

提示词推荐 **XML 形式（用标签区隔的结构化）**。　　

```xml
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

虽说如此，用自然语言写也能没问题地生成，所以首先请轻松地尝试一下。

详情请参照官方的提示词指南。
- [NewBie-image Deployment and Zero-Threshold Usage Tutorial / Prompt Writing](https://ai.feishu.cn/wiki/NZl9wm7V1iuNzmkRKCUcb1USnsh#RN74dYdXaokGnSx0F5IcaBK0nHc)
