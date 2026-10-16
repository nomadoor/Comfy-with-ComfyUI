---
layout: page.njk
lang: zh
section: basic-workflows
slug: lumina-image-2.0
navId: lumina-image-2.0
title: "Lumina-Image 2.0"
created: 2025-12-11
updated: 2026-03-02
summary: "Lumina-Image 2.0 的基础知识与在 ComfyUI 中的用法"
seoTitle: "在 ComfyUI 中使用 Lumina-Image 2.0 与 Neta Lumina"
seoDescription: "轻量 2.6B 图像生成模型 Lumina-Image 2.0，以及其衍生动漫模型 Neta Lumina、NetaYume Lumina、NewBie image 在 ComfyUI 中的用法与 text2image 工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/lumina-image-2.0/legacy_gyazo_0eef66b0663a16cd722915b2dcde0c84.png"
tags: []
---


## 什么是 Lumina-Image 2.0？

[Lumina-Image 2.0](https://github.com/Alpha-VLLM/Lumina-Image-2.0) 是一个结合了 Unified Next-DiT 和 Flux 系 VAE 的 **2.6B 参数图像生成模型**。

它采用 Gemma 2B 系文本编码器，模型本身比 SD3 和 FLUX Pro 小得多，**和 AuraFlow 一样，定位于“相对轻量、适合日常使用的基础模型”**。
它的另一个特点是，以这个体量来说提示词遵循度很高，曾作为下一代基础模型的候选之一受到关注。


---

## 下载模型

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

[Neta-Lumina](https://huggingface.co/neta-art/Neta-Lumina) 是基于 Lumina-Image 2.0 的 **动漫向微调模型**。

作为动漫模型，它也支持 Danbooru 标签，特点是能接受中文、英文、日文等多语言提示词。

### 下载模型

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

- 采样器按照官方设置，使用 `res_multistep` / `linear_quadratic`。

提示词有一点特别：需要在真正想写的提示词前面加上 **系统提示词**。

```text
You are an assistant designed to generate anime images based on textual prompts. <Prompt Start>
1girl, portrait, ...
```

详情请参考官方的 Prompt Book。
- [Neta Lumina Prompt Book](https://nieta-art.feishu.cn/wiki/RY3GwpT59icIQlkWXEfcCqIMnQd)

---

## NetaYume Lumina

还有一个在 Neta Lumina 基础上进一步微调的模型 [NetaYume Lumina](https://huggingface.co/duongve/NetaYume-Lumina-Image-2.0)。

难得有机会，这里也一起介绍一下吧。

### 下载模型

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

NewBie-image（Exp0.1）是一个动漫向 T2I 模型，它借鉴了 Lumina 架构研究的成果，以 Next-DiT 为基础，采用 NewBie 自己设计的架构。它使用了更强的文本编码器，可以用 XML 格式的提示词（结构化标签）进行更细致的控制。

> [!NOTE]
> 这个模型目前只完成了 20% 的训练。今后的更新可能会让工作流发生变化。

### 下载模型

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

![](/media/basic-workflows/lumina-image-2.0/legacy_gyazo_d7253fbe289e281e77dbb074d42c392d.png){media=image}

[](/workflows/basic-workflows/lumina-image-2.0/newbie_image_exp0_1.json)

提示词推荐使用 XML 格式（用标签分隔的结构化写法）。　　

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

话虽如此，用自然语言写也能正常生成，所以先轻松地试试看吧。

详情请参考官方的提示词指南。
- [NewBie-image Deployment and Zero-Threshold Usage Tutorial / Prompt Writing](https://ai.feishu.cn/wiki/NZl9wm7V1iuNzmkRKCUcb1USnsh#RN74dYdXaokGnSx0F5IcaBK0nHc)
