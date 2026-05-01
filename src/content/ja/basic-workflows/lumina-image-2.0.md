---
layout: page.njk
lang: ja
section: basic-workflows
slug: lumina-image-2.0
navId: lumina-image-2.0
title: "Lumina-Image 2.0"
created: 2025-12-11
updated: 2026-03-02
summary: "Lumina-Image 2.0の基本とComfyUIでの使い方"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/0eef66b0663a16cd722915b2dcde0c84.png"
tags: []
---


## Lumina-Image 2.0 とは？

[Lumina-Image 2.0](https://github.com/Alpha-VLLM/Lumina-Image-2.0) は、Unified Next-DiT と Flux 系 VAE を組み合わせた **2.6B パラメータの画像生成モデル** です。  

Gemma 2B 系テキストエンコーダを採用しつつ、モデル本体は SD3 や FLUX Pro よりかなり小さく、**AuraFlow と同じく「比較的軽量で日常使いしやすいベースモデル」枠を狙った設計** になっています。  
サイズのわりにプロンプト追従性が高いことも特徴で、次世代ベースモデル候補のひとつとして注目されました。


---

## モデルのダウンロード

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

[Neta-Lumina](https://huggingface.co/neta-art/Neta-Lumina) は Lumina-Image 2.0 をベースにした **アニメ向けファインチューニングモデル** です。

アニメモデルらしく Danbooru タグにも対応しており、中国語・英語・日本語と多言語のプロンプトを受け付けるのが特徴です。

### モデルのダウンロード

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

- サンプラーは公式設定に従い、`res_multistep` / `linear_quadratic` を使用します。

プロンプトに少し特徴があり、実際に書かせたいテキストの前に **システムプロンプト** を書く必要があります。

```text
You are an assistant designed to generate anime images based on textual prompts. <Prompt Start>
1girl, portrait, ...
```

詳しくは公式のPrompt Bookを参照してください。
- [Neta Lumina Prompt Book](https://nieta-art.feishu.cn/wiki/RY3GwpT59icIQlkWXEfcCqIMnQd)

---

## NetaYume Lumina

Neta Lumina をベースに、さらにファインチューニングした [NetaYume Lumina](https://huggingface.co/duongve/NetaYume-Lumina-Image-2.0) というモデルもあります。

せっかくなので、こちらもご紹介しましょう。

### モデルのダウンロード

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

NewBie-image（Exp0.1）は、Luminaアーキテクチャ研究の知見を踏まえ、Next-DiTを土台に設計されたNewBie独自アーキテクチャのアニメ向けT2Iモデルです。より強力なテキストエンコーダを使用し、XML形式プロンプト（構造化タグ）でより細かな制御ができるようにしています。

> こちらのモデルはまだ20%の訓練しかされていません。今後のアップデートによってworkflowが変更されることがあります。

### モデルのダウンロード

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

プロンプトは XML形式（タグで区切る構造化） が推奨されています。　　

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

とはいえ自然文で書いても問題なく生成できるため、まずは気軽に試してみてください。

詳しくは公式のプロンプトガイドを参照してください。
- [NewBie-image Deployment and Zero-Threshold Usage Tutorial / Prompt Writing](https://ai.feishu.cn/wiki/NZl9wm7V1iuNzmkRKCUcb1USnsh#RN74dYdXaokGnSx0F5IcaBK0nHc)