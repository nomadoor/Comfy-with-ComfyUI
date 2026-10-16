---
layout: page.njk
lang: zh
section: basic-workflows
slug: sd15-lora
navId: sd15-lora
title: "LoRA"
created: 2025-12-05
updated: 2026-08-26
summary: "在 Stable Diffusion 1.5 中使用 LoRA"
seoTitle: "在 ComfyUI 中使用 LoRA 的方法"
seoDescription: "通过追加训练让模型画出原本画不出内容的 LoRA 原理，以及在 ComfyUI 中的应用方法。介绍 LoRA 下载、text2image 工作流，以及新模型中 LoRA 的情况。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 什么是 LoRA？

[Textual Inversion](/zh/basic-workflows/sd15-textual-inversion/) 是把“难以用文字说明的外观”压缩进 1 个单词的技术，但它没办法让模型从零开始画出原本不认识的东西。

想“让模型也能画出原本画不出的东西！”的时候，以前必须对整个模型进行微调。  
但这样训练成本相当高。

于是，原本用在 LLM 上的 **LoRA（Low-Rank Adaptation）** 开始被用到这里。

LoRA 不直接改写模型的权重，而是只把“改动的部分”作为一小份附加数据另外保存。  
就像给基础模型额外加载一个扩展包一样，可以加上新的风格或角色。

---

## 使用 LoRA 的 text2image

### 下载 LoRA

这次以一个能生成像素画风格的 LoRA 为例。

- [8bitdiffuser 64x](https://civitai.com/models/185743)

- ```text
    📂ComfyUI/
      └── 📂models/
          └── 📂loras/
              └── PX64NOCAP_epoch_10.safetensors
    ```

### 工作流

![](/media/basic-workflows/sd15-lora/legacy_gyazo_6f275d3cbc6c8487bf1645af06763aea.png){media=image}

[](/workflows/basic-workflows/sd15-lora/sd1_5_lora.json)

- 🟩 添加 `Load LoRA (Model and CLIP)` 节点。
  - 把它接在 `Load Checkpoint` 和 `CLIP Text Encode` / `KSampler` 之间。
  - **MODEL** 和 **CLIP** 都需要经过 `Load LoRA (Model and CLIP)`。
- `strength_model` / `strength_clip` : LoRA 的应用强度。基本设为 `1.0`，效果太强时就调低。
- 🟨 触发词
  - 只要应用了 LoRA，画像素画的能力在内部就已经叠加到基础模型上了。
  - 但要稳定地发挥出这个能力，需要在提示词中加入作者训练时使用的词。
  - 这就叫触发词。这次的 LoRA 的触发词是 `pixel_art`。

---

## 新模型与 LoRA

在 Stable Diffusion 1.5 和 SDXL 的时代，很多 LoRA 不只训练生成图像的扩散模型，也会一起训练负责理解提示词的文本编码器。

不过文本编码器很难训练，有时反而会让提示词变得不太灵。

SDXL 的文本编码器变成了两个，之后出现的模型甚至用上了 T5、Qwen 这样的大型语言模型。

所以现在的主流做法是把提示词的理解交给原本的文本编码器，只训练扩散模型。

### ComfyUI 工作流

只训练了扩散模型的 LoRA 里没有要应用到文本编码器的部分，所以要用 `Load LoRA` 节点，而不是 `Load LoRA (Model and CLIP)`。

![](/media/basic-workflows/sd15-lora/legacy_gyazo_975300eed9cca90f7086dda53c1ca413.png){media=image}

[](/workflows/basic-workflows/sd15-lora/flux_1_lora.json)
