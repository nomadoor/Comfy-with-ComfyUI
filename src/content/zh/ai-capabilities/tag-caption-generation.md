---
layout: page.njk
lang: zh
section: ai-capabilities
slug: tag-caption-generation
navId: tag-caption-generation
title: 标签・描述生成
created: 2026-02-06
updated: 2026-03-02
summary: "从图像自动添加标签或说明文（Caption）的技术"
seoTitle: "从图像自动生成标签、描述的 AI 模型"
seoDescription: "为图像自动添加标签和描述的技术。比较 WD tagger 系、JoyTagger 等标签生成，JoyCaption、Qwen-VL 系的描述生成，ChatGPT、Gemini 等 API 模型，以及使用本地模型的理由。"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---


## 什么是标签・描述生成？

这是一项根据图像自动添加标签或说明文字（Caption）的任务。

常用于制作 LoRA 或微调用的数据集，或者生成提示词，用来做出和参考图像相似的图像。

---

## 标签生成（tagger）

自动添加 Danbooru 风格的标签或类别标签。

### WD 系 tagger

- **WD14-tagger / WD-tagger-v3 系**
  - ![](/media/ai-capabilities/tag-caption-generation/legacy_gyazo_a97fe3f3a2e72a2396df6ebc8c005b72.png){media=image}
  - [](/workflows/ai-capabilities/tag-caption-generation/wd_tagger_v3.json)
  - 面向插画、动漫图像的打标签模型。
  - 角色、发色、服装、表情、构图等，能打上相当细致的标签。

### JoyTagger

- WD 系专攻动漫，而它是一款也能处理更通用图像的 tagger。
- 它和后面介绍的 **JoyCaption** 出自同一作者，想用同一系列的工具来打标签和生成描述时也很方便。

---

## 本地描述生成模型

在能处理图像的 LLM（VLM）还很稀缺的时候，出现过许多在本地运行的描述生成模型。
moondream、LLaVA 系、InternLM-XComposer2-VL 等，名字多得数不过来。

以现在的标准来看，很多模型在精度、稳定性和成本的平衡上都不太行，值得专门新装的已经不多了。

这里只列举一些现在用起来也还算顺手的。

### JoyCaption

- [JoyCaption](https://github.com/fpgaminer/joycaption)
- 由 JoyTagger 的作者制作，**专门用于生成描述的轻量模型**。
- 和追求通用的 VLM 不同，它专攻“图像 → 说明文字”，所以不用在提示词上下功夫，用起来很轻松。
- 最重要的是够轻量。

### Qwen-2.5 / Qwen3-VL 系

- 作为轻量的本地 MLLM，这个系列目前可以说是 SoTA 级别。
- 一般的描述生成自不必说，“改成适合用作训练描述的写法”这类更进一步的指令也能应对。
- 想在本地跑一个 ChatGPT 那样的 LVLM 的话，先用它试试吧。

---

## ChatGPT / Gemini 等 API

和提示词生成一样，通过 API 使用闭源模型也是不错的选择。

毕竟 MLLM 搭建起来很麻烦，计算成本也高……
能轻松用上，真是再好不过了。

---

## 使用本地模型的理由

不限于 LLM，用本地模型最大的理由，恐怕还是 **能不能处理 NSFW** 吧。

不只是 API，很多本地模型也经过了审查。

WD 系 tagger 和 JoyCaption 至今仍有一定需求，我想完全就是因为这个原因。

如果需要完全在本地运行，或者要制作包含 NSFW 的数据集，请把这些本地模型组合起来使用。
