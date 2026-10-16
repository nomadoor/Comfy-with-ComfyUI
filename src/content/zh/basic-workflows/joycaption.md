---
layout: page.njk
lang: zh
section: basic-workflows
slug: joycaption
navId: joycaption
title: "JoyCaption"
created: 2026-02-06
updated: 2026-03-02
summary: "用 JoyCaption 生成图像描述"
seoTitle: "在 ComfyUI 中使用 JoyCaption：高精度图像描述生成"
seoDescription: "可为照片、动漫、插画等广泛类型生成高精度描述的 VLM——JoyCaption 在 ComfyUI 中的用法，从安装自定义节点到 JoyCaption 节点的设置。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
tags: ["tag-caption-generation"]
---

## 什么是 JoyCaption？

[JoyCaption](https://github.com/fpgaminer/joycaption) 是一个从图像生成描述（caption）的 VLM（Visual Language Model）。

它能为照片、动漫、数字艺术等各种类型的图像生成高精度的描述。最重要的是，它连 NSFW 图像也不做审查、照样处理，所以即使在更强的通用 MLLM 已经出现的今天，它作为“描述专用模型”依然很受欢迎。

它基于 LLaVA 系的多模态模型，和 tagger 相比算不上轻量，但作为 ComfyUI 节点，很容易就能接入本地的图像生成流程，用起来很方便。


---

## 自定义节点

- [1038lab/ComfyUI-JoyCaption](https://github.com/1038lab/ComfyUI-JoyCaption)

---

## JoyCaption 节点

根据输入的图像生成描述。

![](/media/basic-workflows/joycaption/legacy_gyazo_c14e87a362f349d3e649af28622262f1.png){media=image}

[](/workflows/basic-workflows/joycaption/joycaption.json)

- `prompt_style`
  - **Descriptive**
      - 以正式、偏长的散文形式描述。
      - 想详细记录图像内容时很方便，但直接拿来当提示词往往太啰嗦。
  - **Straightforward**
      - 以简洁、客观的文体描述。
      - 这种风格很容易直接用作提示词或 LoRA 训练用的描述。
  - **Stable Diffusion Prompt**
      - 以 Stable Diffusion 用的提示词格式描述。
  - **Danbooru tag list**
      - 以 Danbooru 的标签格式（例: `1girl`, `blue_hair`）列出标签。

- `caption_length`
  - 指定输出描述的篇幅（偏短／偏长）。

- `Extra Options`
  - 设置用来引导描述生成的附加指示。
  - 例如，可以针对相机角度、画质与分辨率、NSFW 元素等，指定“详细写／尽量少提”之类的方针。
