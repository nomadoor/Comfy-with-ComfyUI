---
layout: page.njk
lang: zh
section: basic-workflows
slug: sd15-lora
navId: sd15-lora
title: "LoRA"
created: 2026-02-06
updated: 2026-03-02
summary: "Stable Diffusion 1.5 的 LoRA"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 什么是 LoRA？

[Textual Inversion](/zh/basic-workflows/sd15-textual-inversion/) 虽然是将“用文本难以说明的外观”塞进 1 个单词的技术，但没有让模型从零画出原本不知道的东西的能力。

当想“让模型也能画出原本画不出的东西！”时，以前必须微调整个模型。  
但是，学习成本相当高。

于是开始被使用的，就是原本在 LLM 中使用的 **LoRA（Low-Rank Adaptation）**。

LoRA 不是重写模型权重本身，而是采用将“变更部分”作为小的追加数据保存在外部的方式。  
感觉就像是对基础模型，后来读取扩展包一样，可以增加新的风格和角色。

---

## 应用了 LoRA 的 text2image

### LoRA 的下载

这次作为例子，使用变成像素艺术风的 LoRA。

- [8bitdiffuser 64x](https://civitai.com/models/185743)
-  ```text
    📂ComfyUI/
      └── 📂models/
          └── 📂loras/
              └── PX64NOCAP_epoch_10.safetensors
    ```

### 工作流

![](https://gyazo.com/8596b20bea2e92a969693fa18f1ce778){gyazo=image}

[](/workflows/basic-workflows/sd15-lora/SD1.5_lora.json)

- 🟩 添加 `Load LoRA` 节点。
  - 以夹在 `Load Checkpoint` 和 `CLIP Text Encode` / `KSampler` 之间的形式连接。
  - **MODEL** 和 **CLIP** 两者都需要通过 `Load LoRA`。
- `strength_model` / `strength_clip` : LoRA 的适用强度。基本是 `1.0`，但如果效力太强就降低。
- 🟨 触发词
  - 虽然只是应用了 LoRA，但在内部，画点阵图的能力已经被叠加到了基础模型上。
  - 但是，为了切实引出那个能力，需要在提示词中包含作者在学习时使用的词。
  - 把这个称为触发词。这次的 LoRA 中 `pixel_art` 是触发词。

---

## Flux.1 以后的模型和 LoRA

### 图像生成 AI 的设计思想的变更

在 **Stable Diffusion 1.5** 和 **SDXL** 中，应用 LoRA 时，一般是将作为图像生成核心的扩散模型，和解释提示词的文本编码器两者都作为学习对象。

但是，在 **Flux.1** 以后的模型中，文本编码器开始采用 T5 和 Qwen 这样的大规模语言模型。  
这些就像小型的 ChatGPT 一样，已经具备了通用的语言理解能力，为了图像生成而让其再学习是很低效的，甚至有可能性能下降。

因此，在最新的模型中，固定文本编码器，只学习扩散模型本体的设计成为了主流。

### LoRA 也追随

LoRA 也追随这个。

直到 SDXL，扩散模型和文本编码器两者都学习，  
但在 Flux.1 以后的模型中，LoRA 的学习・应用也是，仅限扩散模型。

### ComfyUI 工作流的变化

虽然使用 `Load LoRA` 节点也可以，但连接节点到没在用的 CLIP 也不太美观。  
这不，取而代之准备了 `LoraLoaderModelOnly` 节点。  
正如其名，是仅对 MODEL（扩散模型）应用 LoRA 的节点。

![](https://gyazo.com/975300eed9cca90f7086dda53c1ca413){gyazo=image}

[](/workflows/basic-workflows/sd15-lora/Flux.1_lora.json)

在新的模型中，像这样应用 LoRA。请记住。
