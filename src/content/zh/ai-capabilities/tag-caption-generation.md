---
layout: page.njk
lang: zh
section: ai-capabilities
slug: tag-caption-generation
navId: tag-caption-generation
title: 标签・描述生成
summary: "从图像自动添加标签或说明文（Caption）的技术"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---


## 什么是标签・描述生成？

这是一项从图像自动添加标签或说明文（Caption）的任务。

它被用于制作 LoRA 或微调用的数据集，以及生成用于制作与参考图像相似图像的提示词等。

---

## 标签生成（tagger）

自动添加 Danbooru 风格的标签或类型标签。

### WD 系 tagger

- **WD14-tagger / WD-tagger-v3 系**
  - ![](https://gyazo.com/a97fe3f3a2e72a2396df6ebc8c005b72){gyazo=image}
  - [](/workflows/ai-capabilities/tag-caption-generation/WD-tagger-v3.json)
  - 面向插图・动漫图像的标签添加模型。
  - 角色、发色、服装、表情、构图等相当细致的标签都能添加。

### JoyTagger

- 与 WD 系专注于动漫相对，这是一款对应更通用图像的 tagger。
- 与后述的 **JoyCaption** 出自同一作者，当想要用同一系列的工具统一进行标签添加和描述生成时也很方便。

---

## 本地描述生成模型

在能处理图像的 LLM（VLM）还很珍贵的时期，提出了许多在本地运行的描述生成模型。
moondream、LLaVA 系、InternLM-XComposer2-VL 等，名字多得数不过来。

以现在的标准来看，很多模型在精度・稳定性・成本的平衡上都很严峻，值得特意新引入的模型已经很有限了。

这里只列举至今仍相对容易使用的模型。

### JoyCaption

- [JoyCaption](https://github.com/fpgaminer/joycaption)
- 与 JoyTagger 由同一作者制作，**专注于描述生成的轻量模型**。
- 与以多用途为目标的 VLM 不同，因为它专注于“图像 → 说明文”，所以不需要纠结提示词，可以轻松使用。
- 最重要的是轻量。

### Qwen-2.5 / Qwen3-VL 系

- 作为轻量的本地 MLLM，目前可以说是 SoTA 级的系列。
- 一般的描述生成自不用说，还能应对“改成适合作为学习用描述的写法”等稍微深入一点的指示。
- 如果想在本地运行像 ChatGPT 这样的 LVLM，请先试用这个。

---

## ChatGPT / Gemini 等 API

与提示词生成时一样，通过 API 使用闭源模型也是一个不错的选择。

毕竟 MLLM 的设置很难，计算成本也很高……，
能够轻松使用比什么都令人高兴。

---

## 使用本地模型的理由

不限于 LLM，使用本地模型的理由，最大的还是 **能否处理 NSFW** 吧。

不仅是 API，就算是本地模型也有很多是被审查过的。

WD 系 tagger 和 JoyCaption 至今仍保持着一定的需求，我认为完全也是因为这个理由。

如果需要完全本地运用，或者制作包含 NSFW 的数据集，请组合使用这些本地模型。
