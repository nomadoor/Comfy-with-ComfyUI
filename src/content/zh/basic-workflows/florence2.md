---
layout: page.njk
lang: zh
section: basic-workflows
slug: florence2
navId: florence2
title: "Florence-2"
created: 2026-02-06
updated: 2026-03-02
summary: "用 Florence-2 生成图像描述、检测物体"
seoTitle: "在 ComfyUI 中使用 Florence-2：描述生成、物体检测、OCR"
seoDescription: "一个模型即可完成图像描述、物体检测、OCR 和图像问答的 Florence-2 在 ComfyUI 中的用法，附各任务的工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
tags: ["tag-caption-generation","object-detection"]
---

## 什么是 Florence-2？

这是一个通用 VLM（Visual Language Model），看一眼图像，就能用一个模型完成描述生成、物体检测、分割、OCR 等多种任务。

本页只讲在 ComfyUI 里常用的 4 项：“描述生成”“物体检测（提取坐标）”“OCR”“图像问答”。

---

## 自定义节点

- [kijai/ComfyUI-Florence2](https://github.com/kijai/ComfyUI-Florence2?tab=readme-ov-file)
  - 模型会在第一次运行时自动下载。

---

## Florence2Run 节点

Florence2Run 是让 Florence-2 对输入图像执行任务的主节点。切换 `task`，就能分别使用描述生成、物体检测、OCR 等功能。

### caption, detailed caption

根据图像生成自然语言的描述。

![](/media/basic-workflows/florence2/legacy_gyazo_b364e8bc1ba2799ad953384f4dfe2079.png){media=image}

[](/workflows/basic-workflows/florence2/florence2_detailed_caption.json)

- `caption`  
  - 简单描述图像的大致内容。
- `detailed caption`  
  - 更细致地描述构图和外观。

不过，如果只是想要“用作提示词的描述”，用 [JoyCaption](/zh/basic-workflows/joycaption/) 这类描述专用模型，能得到灵活得多、质量也高得多的结果。

### caption_to_phrase_grounding

针对给定描述中的每个短语，以矩形（边界框）的形式输出对应物体的位置。

![](/media/basic-workflows/florence2/legacy_gyazo_0acc3146eed131b9642857ebc1edcce1.png){media=image}

[](/workflows/basic-workflows/florence2/florence2_caption_to_phrase_grounding.json)

- 它的特点是，即使是“left tree”“red car”这种稍微复杂的指示，也能找到位置。
- 🟨 用 `Florence2 Coordinates` 节点取出坐标，再配合 SAM2 等分割模型，就能只把特定物体做成蒙版。

### ocr

读取图像中的文字，以文本形式输出。

![](/media/basic-workflows/florence2/legacy_gyazo_e701757ab4dfe4056a74a5290d52edbb.png){media=image}

[](/workflows/basic-workflows/florence2/florence2_ocr.json)


### docvqa

回答关于图像的问题。

![](/media/basic-workflows/florence2/legacy_gyazo_614f705d137c7d5a19015b5a9aaa4f17.png){media=image}

[](/workflows/basic-workflows/florence2/florence2_docvqa.json)

- 可以提出“这张图里〇〇在哪里？”“这个表格里的数值是多少？”之类的问题，并以文本形式得到回答。
- 用法大概就像把图片丢给 ChatGPT 然后提问。
