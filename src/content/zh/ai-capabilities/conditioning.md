---
layout: page.njk
lang: zh
section: ai-capabilities
slug: conditioning
navId: conditioning
title: Conditioning (调节/条件)
created: 2025-11-13
updated: 2026-08-01
summary: 告诉扩散模型“想要这样的图像”的机制
seoTitle: "什么是 Conditioning？告诉扩散模型生成内容的机制"
seoDescription: "向扩散模型传达“想要这样的图像”的 Conditioning 机制。整理文本编码器的作用、CLIP 型与 LLM 型的区别，以及基于参考图像和结构（姿势、深度等）的 Conditioning。"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## 交给扩散模型“全权决定”，结果就是随机的

有了扩散模型，我们已经能从噪声中生成有意义的图像。

但仅仅这样，它终究只会给出“看起来像那么回事的图像”，没办法 **指定内容**，比如你想要一张什么样的画。

这里需要的就是 **Conditioning (调节/条件)**。

---

## 什么是 Conditioning？

在 ComfyUI 中，扩散模型去除噪声时，用来告诉它“想要什么样的图像”“希望哪里怎样改变”的附加信息，统称为 **Conditioning**。

简单来说，它就像 **决定生成方向的路标**。

---

## 基于文本的 Conditioning

控制图像生成最常见的手段，应该就是 **文本提示词** 了。
我们来看看普通的文本是怎样变成 Conditioning 的。

### 文本编码器的作用

扩散模型本身读不懂文字。
“狗”“森林”“晚霞”这些词，对它来说只是字符串。

所以需要 **文本编码器** 来把文本转换成扩散模型容易处理的数值（向量）。

- **输入**：文本（提示词）
- **输出**：表示其含义的向量（数值的集合）

扩散模型以这个向量为路标，一步步去除噪声，让图像符合文本提示词。

### CLIP 型文本编码器

像 Stable Diffusion 1.5 这样的模型，主要使用以 **CLIP** 为基础的文本编码器。

CLIP 是用大量“文本和图像配对”训练出来的“会看的 AI”。它的特点是能把图像和文本放进同一个“语义空间”。

- 给它看一张猫的照片，它能判断出这张图和“a cat”这句话很匹配
- 反过来说，输入 a cat 这段文本，它就能输出表示“猫的特征”的向量

扩散模型（U-Net）以这个向量为路标，判断“噪声往哪个方向去除，才能得到符合这段文本的图像？”

### LLM / MLLM 型文本编码器

近年来，一些图像和视频模型开始使用基于 **LLM** 或 **MLLM（多模态 LLM）** 的文本编码器来代替 CLIP。

LLM 是 ChatGPT 等对话式 AI 的基础技术，能够理解文本的上下文。MLLM 则在此基础上进一步支持图像等其他类型的输入。

CLIP 擅长短描述和概念之间的对应，但不太擅长把长段文字或复杂的位置关系反映到图像生成中。

使用 LLM 或 MLLM 后，就能更准确地理解这类指令。

{% mediaRow img="/media/ai-capabilities/conditioning/legacy_gyazo_21e83fc01b81ea693037ba3d17f39d5a.png{media=image}", width=50, align="left" %}

`A dog on a log with a frog in a bog`

它准确理解了“圆木上有一只狗，沼泽里有一只青蛙”这样的复杂位置关系。

{% endmediaRow %}

不过，站在 ComfyUI 的角度来看，无论用的是 CLIP、LLM 还是 MLLM，“把文本转换成表示含义的向量，再交给扩散模型”这个作用本身都是一样的。

## 其他 Conditioning（简单介绍）

本页只讲了文本，但实际上除了文本以外还有各种各样的 Conditioning。

### 基于参考图像的 Conditioning

- **IP-Adapter 系列等**
- 告诉模型“请往这个角色、这种上色、这张照片的氛围靠拢”

### 基于结构的 Conditioning

- **ControlNet 等**（姿势、线稿、深度图等）
- 告诉模型“请保持这个姿势、轮廓和纵深”

这些都是用来告诉扩散模型“应该优先什么、向哪个方向调整”的 Conditioning。
