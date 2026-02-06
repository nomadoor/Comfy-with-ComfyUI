---
layout: page.njk
lang: zh
section: basic-workflows
slug: flux-1
navId: flux-1
title: "Flux.1"
summary: "Flux.1 的基础和在 ComfyUI 中的使用方法"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/9fd52a56e1f6b7cbf8cd96ca78484d02.png"
tags: []
---

## 什么是 Flux.1？

**Flux.1** 是由 Stable Diffusion 的开发成员创立的 Black Forest Labs 推出的图像生成模型。  
不仅单纯是“高性能版”，在架构方面也是巨大转折点的模型。

- 图像生成的核心，从传统的 UNet 替换为了 Transformer（DiT）基础  
- 作为文本编码器，采用了 T5 系的 LLM  

通过这个组合，变得能从大规模的数据集高效地学习，  
变得容易原样活用 LLM 的文章理解力，成为了通往现在主流的图像生成模型群的分歧点。

Flux.1 有 3 个变体。

- **Flux.1 pro**  
  - 仅能通过 API 利用的版本，未公开模型权重。
- **Flux.1 dev**  
  - 蒸馏了 pro 的研究・验证用模型。在本地环境最常使用的是这个。
- **Flux.1 schnell**  
  - 进一步蒸馏了 dev 的模型，以 Apache-2.0 这个比较宽松的许可证公开。

---

## 模型的下载

这里使用 `dev` / `schnell` 的 fp8 版。

- diffusion model  
  - [flux1-dev-fp8.safetensors](https://huggingface.co/Comfy-Org/flux1-dev/blob/main/flux1-dev-fp8.safetensors)  
  - [flux1-schnell-fp8.safetensors](https://huggingface.co/Comfy-Org/flux1-schnell/blob/main/flux1-schnell-fp8.safetensors)  
- CLIP / T5  
  - [clip_l.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/clip_l.safetensors)  
  - [t5xxl_fp8_e4m3fn_scaled.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/t5xxl_fp8_e4m3fn_scaled.safetensors)  
- VAE  
  - [ae.safetensors](https://huggingface.co/black-forest-labs/FLUX.1-schnell/blob/main/ae.safetensors)  

- ```text
  📂ComfyUI/
  └── 📂models/
      ├── 📂diffusion_models/
      │   ├── flux1-dev-fp8.safetensors
      │   └── flux1-schnell-fp8.safetensors
      ├── 📂clip/
      │   ├── clip_l.safetensors
      │   └── t5xxl_fp8_e4m3fn_scaled.safetensors
      └── 📂vae/
          └── ae.safetensors
  ````

---

## text2image - Flux.1 [dev]

![](https://gyazo.com/2b89975e1b96fcbbd56880d31a0cd9c4){gyazo=image}

[](/workflows/basic-workflows/flux1/flux1-dev.json)

Flux.1 dev / schnell 是 **蒸馏了固定 CFG 为 1.0 状态的模型**。
因此，不像传统的 Stable Diffusion 那样以 `CFG scale` 和 Negative Prompt 的调整为前提，**Negative Prompt 完全不生效**。

* cf. [CFG / CFG = 1 的特殊意义](/zh/ai-capabilities/cfg/#cfg-1-的特殊意义)

我将 Negative 侧的提示词留空了，但其他工作流中也有代替 Negative 用的 `CLIP Text Encode` 节点，插入 `ConditioningZeroOut` 节点的。

无论哪种情况，Negative 侧的条件会被乘 0，**所以写什么都不会影响输出**。

---

## text2image - Flux.1 [schnell]

是进一步蒸馏了 Flux.1 [dev] 的东西，可以用 4〜6 步生成图像。

![](https://gyazo.com/365108a45e0039af1ce0d35cf2cdcfa6){gyazo=image}

[](/workflows/basic-workflows/flux1/flux1-schnell.json)
- 将 `steps` 设为 4〜6。

---

## LoRA - Flux.1 [dev]

试用一下提高肖像画质量的 LoRA 吧。

* [AWPortrait-FL-lora.safetensors](https://huggingface.co/Shakker-Labs/AWPortrait-FL/blob/main/AWPortrait-FL-lora.safetensors)

![](https://gyazo.com/292030d5a8ffc53619232546c7ce750b){gyazo=image}

[](/workflows/basic-workflows/flux1/flux1-dev_lora.json)

* 🟪 在 [LoRA](/zh/basic-workflows/sd15-lora/) 中也写了，Flux 以后不再学习文本编码器，所以不使用 `Load LoRA` 节点，使用 **仅适用于权重的** `LoraLoaderModelOnly` 节点。

---

## ControlNet - Flux.1 [dev]

Flux.1 用的 ControlNet 模型也公开了几个，这里以 Union 型模型为例介绍。

### 模型的下载

* [FLUX.1-dev-ControlNet-Union-Pro-2.0-fp8/diffusion_pytorch_model.safetensors](https://huggingface.co/ABDALLALSWAITI/FLUX.1-dev-ControlNet-Union-Pro-2.0-fp8/blob/main/diffusion_pytorch_model.safetensors)

  * 很难懂，所以请重命名为 `FLUX.1-dev-ControlNet-Union-Pro-2.0-fp8.safetensors` 等。

- ```text
  📂ComfyUI/
  └── 📂models/
      └── 📂controlnet/
          └── FLUX.1-dev-ControlNet-Union-Pro-2.0-fp8.safetensors
  ```

### 工作流

ControlNet-Union 将多个代表性的 ControlNet 内置在 1 个模型中。

![](https://gyazo.com/9e7cb79f7ca50fe5946ac9f232a552c6){gyazo=image}

[](/workflows/basic-workflows/flux1/FLUX.1-dev-ControlNet-Union-Pro_depth.json)

* 🟩 只是在使用了 Flux 的 image2image 工作流中插入了 ControlNet。

  * 虽说是 image2image 但 `denoise` 是 1.0，所以举动几乎和 text2image 一样。
  * 因为可以用很少的节点制作与输入图像相同尺寸的图像，所以我常使用这个形式。
* 🟩 在 `SetUnionControlNetType` 中，输入想使用的 ControlNet 类型。

  * 基本上 `auto` 就没问题。

---

## GGUF（轻量化 Flux.1）

最后，稍微提一下 **GGUF 版 Flux.1**。

原本 GGUF 是为了轻量化 LLM 的格式（被量化的权重形式），
通过将其应用到 Flux.1，可以 **在减少 VRAM 使用量的同时，以相应的速度运转**。

### 自定义节点

* [city96/ComfyUI-GGUF](https://github.com/city96/ComfyUI-GGUF)

### 模型的下载

根据性能和模型尺寸的平衡，有几个变体。
请配合 PC 规格和用途选择。

* [FLUX.1-dev-gguf](https://huggingface.co/city96/FLUX.1-dev-gguf/tree/main)
* [FLUX.1-schnell-gguf](https://huggingface.co/city96/FLUX.1-schnell-gguf/tree/main)

- ```text
  📂ComfyUI/
  └── 📂models/
      └── 📂unet/
          └── flux1-dev.gguf
  ```

### 工作流

![](https://gyazo.com/f465ff82b48c4c7b5d5b9ce144f3dc8d){gyazo=image}

[](/workflows/basic-workflows/flux1/FLUX.1-dev-gguf.json)

* 🟪 将 `Load Diffusion Model` 节点替换为 `Unet Loader (GGUF)` 节点。
* 其他 CLIP / T5 / VAE 部分保持原样。

  * 虽然也可以把 T5 换成 GGUF，但体感上没有那么大的效果。

现在的许多模型都准备了 GGUF 版。
**使用 GGUF 几乎没有缺点**，所以在 VRAM 不足时请积极尝试。
