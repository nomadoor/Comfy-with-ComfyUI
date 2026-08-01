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
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## 扩散模型如果是“全自动”就是随机的

得益于扩散模型，我们能够从噪点生成有意义的图像了。

但是，如果只是这样，它终究只是给出了“看起来像那么回事的图像”，而无法**指定内容**，比如想要什么样的画。

这里需要的就是 **Conditioning (调节/条件)**。

---

## 什么是 Conditioning？

在 ComfyUI 中，将扩散模型去除噪点时，用来传达“希望生成什么样的图像”“希望哪里怎么改变”的附加信息统称为 **Conditioning**。

简单来说，就像是 **决定生成方向的路标**。

---

## 基于文本的 Conditioning

作为控制图像生成的手段，最常见的应该是 **文本提示词** 吧。
让我们看看将单纯的文本作为 Conditioning 的方法。

### 文本编码器的作用

扩散模型本身是无法阅读文章的。
像“狗”、“森林”、“晚霞”这样的词语，仅仅是字符串。

因此，负责将文本转换为扩散模型容易处理的数值（向量）角色的，就是 **文本编码器**。

- **输入**：文本（提示词）
- **输出**：表示其含义的向量（数值的集合）

扩散模型将这个向量作为路标，为了生成符合文本提示词的图像而不断减少噪点。

### CLIP 型文本编码器

像 Stable Diffusion 1.5 这样的模型，主要使用的是以 **CLIP** 这种机制为基础的文本编码器。

CLIP 是大量学习了“文本和图像配对”的“视觉 AI”。其特征是能够将图像和文本配置在同一个“意义空间”中。

- 给它看猫的照片，它能判断出与“a cat”这个文章相性很好
- 也就是说，反过来如果输入 a cat 这个文本，它就会给出表示“像猫”的向量

扩散模型（U-Net）将这个向量作为路标，判断“噪点向哪个方向减少，才能变成符合这个文本的图像？”

### LLM / MLLM 型文本编码器

近年来，一些图像和视频模型开始使用基于 **LLM** 或 **MLLM（多模态 LLM）** 的文本编码器来代替 CLIP。

LLM 是 ChatGPT 等对话式 AI 的基础技术，能够处理文章的上下文。MLLM 则在此基础上进一步支持图像等其他类型的输入。

CLIP 擅长短描述和概念之间的对应，但不太擅长将长文章或复杂的位置关系反映到图像生成中。

使用 LLM 或 MLLM 后，就能更准确地理解这类指令。

{% mediaRow img="https://gyazo.com/21e83fc01b81ea693037ba3d17f39d5a{gyazo=image}", width=50, align="left" %}

`A dog on a log with a frog in a bog`

它准确理解了“圆木上有一只狗，沼泽里有一只青蛙”这样的复杂位置关系。

{% endmediaRow %}

不过，站在 ComfyUI 的角度来看，无论使用 CLIP、LLM 还是 MLLM，其作用都是将文本转换为表示含义的向量，再交给扩散模型。

## 其他 Conditioning（概略）

本页面虽然只针对文本，但实际上除了文本以外还有各种各样的 Conditioning。

### 基于参考图像的 Conditioning

- **IP-Adapter 系等**
- 传达“请靠近这个角色、这个涂色、这张照片的氛围”

### 基于结构的 Conditioning

- **ControlNet 等**（姿势、线稿、深度图等）
- 传达“请遵守这个姿势、轮廓、景深”

这些都是用来告诉扩散模型“应该优先什么、向哪个方向调整”的 Conditioning。
