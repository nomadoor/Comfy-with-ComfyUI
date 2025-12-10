---
layout: page.njk
lang: ja
section: basic-workflows
slug: lumina-image-2.0
navId: lumina-image-2.0
title: "Lumina-Image 2.0"
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

🟩プロンプトに少し特徴があり、実際に書かせたいテキストの前に **システムプロンプト** を書く必要があります。

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
