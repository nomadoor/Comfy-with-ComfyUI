---
layout: page.njk
lang: zh
section: ai-capabilities
slug: prompt-generation
navId: prompt-generation
title: 提示词生成・编辑
summary: 将粗略的指示整理成模型容易理解的提示词的技术
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---

## 什么是提示词生成・编辑？

在除了提示词以外几乎没有参数可以正常触碰的时期，提示词工程学（Prompt Engineering）和“咒语”这个词非常流行（真怀念啊）。

与现在的自然语言提示词相比，面向 Stable Diffusion 1.5 的提示词就像是罗列了标签的咒语一样。模型侧的理解能力也很低，需要一边观察实际的输出一边反复试验提示词。

但是，每次都由人类来写这个很麻烦，而且难免会变成工匠技艺。试图让 LLM 来分担这一部分的，就是本页面所说的“提示词生成・编辑”。

---

## Stable Diffusion 时代的提示词生成

Stable Diffusion / SDXL 世代的模型无法很好地理解自然语言，基本写法是将逗号分隔的标签连起来。

> masterpiece, (best quality:1.05), 1girl, blue hair, …

虽然会做一些排列意义相近的单词、贴近模型学习所用文本的习惯……这样的功夫，但每次都要手动构建“偏向 AI 的写法”很麻烦。

因此登场的就是，“将粗略编写的提示词转换为 Stable Diffusion 风格的标签序列”的专用模型。

### 代表例

- **[dart](https://github.com/nkchocoai/ComfyUI-Dart/)**
  - 生成 Danbooru 标签序列的轻量模型。如果在这个模型中输入粗略的标签或说明，它会将其转换为适合 Stable Diffusion 的浓厚标签序列。

- **[Qwen 1.8B Stable Diffusion Prompt](https://huggingface.co/hahahafofo/Qwen-1_8B-Stable-Diffusion-Prompt)**
  - 专注于 SD 用提示词生成（日语→英语标签序列等）的小型 Qwen 系模型。

两者都不是为了“人类是否容易阅读”，而是专注于 **吐出 SD1.5 / SDXL 容易处理形式的提示词** 的工具。

---

## 最近的模型和提示词

像 FLUX 这样的 DiT 系模型，以及最近的图像编辑模型，其文本编码器变成了 T5 或 Qwen 等 **LLM 基础的文本编码器**。

多亏了这一点，与 Stable Diffusion 时代相比，自然语言的解释能力大幅提升，所谓的“咒语提示词”那样的技巧几乎不再需要了。

另一方面，也并不是“随便写写就能稳定地得出好结果”。

面对人类也是一样的。可以说，简洁地说明以下要素是优秀导演的工作。

- **距离、视角、焦距、时间段、张数等定量信息**
- **背景、构图、布光、风格、表情等各要素的指定**

虽说如此，每次手写这些很麻烦，所以使用 ChatGPT 等 LLM。即使是“把这个日语提示词详细化给 FLUX.2 用”、“加上构图、布光、相机信息进行整形”、“把这个提示词整形为 Qwen-Image 用”这样粗略的委托，也足以提升提示词的密度。

根据图像生成模型的不同，有时也会准备专用的 LLM，但并不会有那么大的改善。归根结底，图像生成模型的性能才是最重要的。

---

## 在 ComfyUI 中的运用

虽然也有一些可以在 ComfyUI 本地运行的 LLM，但也请考虑 **通过 API 节点调用 Gemini 或 ChatGPT**。

![](https://gyazo.com/94496f33d758475aa62f614978ea2252){gyazo=image}

[](/workflows/ai-capabilities/prompt-generation/Z-Image_Gemini-3.json)

我自己也是一个想要坚持使用本地模型的人，但老实说，相比于运行图像生成模型，在本地常用具有一定质量的 LLM，对 PC 规格的要求往往更严苛。

值得庆幸的是，LLM 的 API 使用费用相当便宜。很久以前购买的 5 美元额度到现在还没用完 (´・ω・｀)
