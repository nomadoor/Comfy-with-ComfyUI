---
layout: page.njk
lang: zh
section: ai-capabilities
slug: subject-transfer
navId: subject-transfer
title: Subject 转移
summary: 让参考图像中的相同物体在不同场景中登场的技术
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## 什么是 Subject 转移？

正式名称是“Subject-Driven Image Generation (基于主题驱动的图像生成)”的任务。

Subject 不限于人，角色、布偶、特定的狗、吉祥物、手办等，泛指“这张图像中出现的‘那个东西’”。
Subject 转移是用于生成包含参考图像中相同 Subject 的图像的技术。

> 转移 ID（人物的面部、本人特征）的技术虽然包含在 Subject 转移中，但因为被特别看待，且有很多专注于 ID 转移的技术，所以另行处理。

---

## LoRA

不用说，这是学习模型无法绘制的东西，使其能够绘制的方法。

从登场到现在，在灵活性和稳定性方面无人能出其右。

最大的问题是 **需要学习**。并不轻松。

---

## image2prompt

作为最朴素的方法，有“从图像生成描述，并用该描述运行 text2image”的手法。

你可能会想用这么原始的方法？但如果有能完美说明参考图像的 MLLM，和能完美重现该说明的图像生成模型的话，原理上是可能的。

![](https://gyazo.com/26351f2e5d3eb17c623acd815ba8709c){gyazo=image}

[](/workflows/ai-capabilities/subject-transfer/Z-Image_Gemini-3.0.json)

最近模型的性能正在使之成为可能。作为“最廉价的仿 Subject 转移”，值得试一次。

---

## SeeCoder / UnCLIP 系

image2prompt 是“图像 → 文本 → 嵌入”这两个阶段，而在 SeeCoder 或 UnCLIP 系中，**直接进行“图像 → 嵌入”**。

从图像制作相当于文本嵌入的向量，并将其代替 text encoder 使用。

![](https://gyazo.com/d0196735e6162d464bd8764448d4088b){gyazo=image}

[](/workflows/ai-capabilities/subject-transfer/SeeCoder.json)

虽然比起 image2prompt 在“文本化”中的信息损失更少，但由于无法进行文本编辑，所以易用性较差。

---

## IP-Adapter

作为“无需学习进行 Subject 转移”的方法，这是在实务中最早达到实用水平的技术。

IP-Adapter 是用于向现有的 text2image 模型插入“来自图像的条件”的适配器。作为仅次于 ControlNet 的代表性适配器被广泛使用。

从参考图像中提取特征向量，将该特征注入 UNet 内部（Cross-Attention 周围等）以反映到生成图像中。因为可以与文本提示词同时使用，所以可以区分使用“Subject 用图像指定”、“场景或风格用文本指定”。

---

## IC-LoRA / ACE++

以 Flux 为首的 DiT 系模型，作为潜在能力具有“制作具有一致性的图像”的能力。

利用这种性质的 Subject 转移就是 IC-LoRA / ACE++。

![](https://gyazo.com/8e01db8cebce51e7c47d9f958a94c61b){gyazo=image}

[](/workflows/ai-capabilities/subject-transfer/ACE_Plus_portrait.json)

在图像画布的左侧配置参考图像（包含 Subject），将右侧全部遮罩并让其生成 (inpainting)。模型一边看着左侧的信息一边填充右侧，因此“可以使用与左侧相同的 Subject 生成新的图像”。

---

## 指示基图像编辑模型

“[基于指令的图像编辑模型](/zh/ai-capabilities/instruction-based-image-editing/)”也可以用于 Subject 转移。

![](https://gyazo.com/358c8441ff70ee58135d8340bd691200){gyazo=image}

[](/workflows/ai-capabilities/subject-transfer/Qwen-Image-Edit_2509_multi-ref.json)

这些模型可以通过“把这只狗放在别的背景里”、“把这个人配置在森林里”这样的文本指令来编辑图像。

此外，如果是支持多个参考图像的模型，甚至可以做到“将图像 A 中人物的服装”替换为“图像 B 中人物的服装”。
