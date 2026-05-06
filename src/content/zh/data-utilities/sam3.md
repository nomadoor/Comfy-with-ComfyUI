---
layout: page.njk
lang: zh
section: data-utilities
slug: sam3
navId: sam3
title: "SAM 3 / 3.1"
created: 2026-05-07
updated: 2026-05-07
summary: "使用 SAM 3 / 3.1 生成 AI 蒙版"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## SAM 3 / 3.1 是什么？

[SAM 3](https://github.com/facebookresearch/sam3) 是 Meta Segment Anything Model 系列的新模型。

以前的 SAM 工作流主要通过点或 BBOX 来指定“这个附近”。SAM 3 可以用简短的文本指定对象，并在同一个流程中完成物体检测和分割。

例如输入 `person`、`red car`、`the dog` 这样的提示词，就可以寻找目标，并把它的形状作为蒙版提取出来。

[SAM 3.1](https://ai.meta.com/blog/segment-anything-model-3/) 是 SAM 3 的更新版，主要改进了视频中多对象追踪的效率。对于静态图像的蒙版生成，可以先把 SAM 3 / 3.1 当作首选方案来理解。

---

## 用在什么地方？

在 ComfyUI 中，Inpainting、合成、背景处理、局部生成等场景经常会用到蒙版。

SAM 3 / 3.1 适合这些情况：

- 只想把图像中的人物做成蒙版
- 想提取汽车、服装、家具等容易用文本描述的对象
- 在组合 YOLO、Grounding DINO 和 SAM 之前，先用更简单的方式试一下

静态图像的 AI 蒙版生成，可以先从 SAM 3 / 3.1 开始。

---

## 模型下载

ComfyUI 本体侧已经可以使用 SAM 3 系列，因此基本流程是下载需要的模型，然后放进 workflow 中使用。

可以在 ComfyUI Manager 的 `Install Models` 中查找，也可以从 Meta 的 Hugging Face 页面下载。

- [facebook/sam3](https://huggingface.co/facebook/sam3)
- [facebook/sam3.1](https://huggingface.co/facebook/sam3.1)

> Hugging Face 可能需要登录或申请访问权限。

---

## workflow

workflow 之后再追加。

目前先把 SAM 3 / 3.1 理解为“用文本指定对象并生成蒙版的模型”就可以了。

在搭建更复杂的蒙版生成流程之前，建议先试试看 SAM 3 / 3.1 单独能做到什么程度。
