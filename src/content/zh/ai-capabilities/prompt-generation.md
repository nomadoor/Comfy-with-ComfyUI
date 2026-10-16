---
layout: page.njk
lang: zh
section: ai-capabilities
slug: prompt-generation
navId: prompt-generation
title: 提示词生成与编辑
created: 2026-02-06
updated: 2026-03-02
summary: 把随手写的指示整理成模型容易理解的提示词的技巧
seoTitle: "用 LLM 生成、编辑图像生成提示词的技巧"
seoDescription: "用 LLM 把粗略的指示整理成图像模型容易理解的提示词。讲解从 Stable Diffusion 时代的提示词生成，到能理解自然语言的新模型，以及在 ComfyUI 中的运用。"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---

## 什么是提示词生成与编辑？

在除了提示词几乎没有别的参数可调的年代，“提示词工程”和“咒语”这样的说法曾经很流行（真怀念啊）。

和现在的自然语言提示词相比，面向 Stable Diffusion 1.5 的提示词就像一串罗列标签的咒语。模型本身的理解力也很低，只能一边看实际输出，一边反复摸索提示词。

但每次都由人来写这些很费事，而且难免变成一门手艺活。想让 LLM 来代劳这部分工作的，就是本页所说的“提示词生成与编辑”。

---

## Stable Diffusion 时代的提示词生成

Stable Diffusion / SDXL 这一代模型不太能理解自然语言，基本写法是用逗号把一个个标签串起来。

> masterpiece, (best quality:1.05), 1girl, blue hair, …

人们会把意思相近的词排在一起，或者迎合模型训练文本的习惯……想了很多办法，但每次都手动拼出这种“迎合 AI 的写法”实在麻烦。

于是出现了专门“把随手写的提示词转换成 Stable Diffusion 风格标签串”的模型。

### 代表例子

- **[dart](https://github.com/nkchocoai/ComfyUI-Dart/)**
  - 生成 Danbooru 标签串的轻量模型。给它一些粗略的标签或描述，它会扩写成适合 Stable Diffusion 的、信息密集的标签串。

- **[Qwen 1.8B Stable Diffusion Prompt](https://huggingface.co/hahahafofo/Qwen-1_8B-Stable-Diffusion-Prompt)**
  - 专门用于生成 SD 提示词（日语→英语标签串等）的小型 Qwen 系模型。

两者在意的都不是“人读起来方不方便”，而是专门 **输出 SD1.5 / SDXL 容易处理的提示词格式** 的工具。

---

## 最近的模型与提示词

FLUX 这样的 DiT 系模型以及最近的图像编辑模型，文本编码器都换成了 T5、Qwen 等 **基于 LLM 的文本编码器**。

因此，与 Stable Diffusion 时代相比，对自然语言的理解能力大幅提升，所谓“咒语提示词”那类技巧基本用不着了。

另一方面，也不是“随便写写就能稳定出好结果”。

对人也是一样。能把下面这些要素简洁地说清楚，才算是好导演。

- **距离、视角、焦距、时间段、张数等定量信息**
- **背景、构图、布光、风格、表情等各要素的指定**

话虽如此，每次都手写这些很麻烦，所以就交给 ChatGPT 等 LLM。哪怕只是“把这段日语提示词扩写得详细些，给 FLUX.2 用”“补上构图、布光和相机信息并整理一下”“把这段提示词整理成适合 Qwen-Image 的格式”这样随口的请求，也足以提高提示词的信息密度。

有些图像生成模型会配有专用的 LLM，但效果并不会因此大幅提升。说到底，图像生成模型本身的性能更重要。

---

## 在 ComfyUI 中的用法

ComfyUI 里也有几种可以在本地运行的 LLM，不过也请考虑 **用 API 节点调用 Gemini 或 ChatGPT**。

![](/media/ai-capabilities/prompt-generation/legacy_gyazo_94496f33d758475aa62f614978ea2252.png){media=image}

[](/workflows/ai-capabilities/prompt-generation/z_image_gemini_3.json)

我自己也是想坚持用本地模型的人之一，但说实话，比起跑图像生成模型，在本地日常使用一个质量过得去的 LLM，对电脑配置的要求往往更高。

值得庆幸的是，LLM 的 API 费用相当便宜。很久以前买的 5 美元额度，到现在都还没用完(´・ω・｀)
