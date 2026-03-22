---
layout: page.njk
lang: zh
section: faq
slug: sdwebui-comfyui-reproducibility
navId: sdwebui-comfyui-reproducibility
title: "Stable Diffusion web UI 和 ComfyUI 无法生成相同的图像？"
summary: "即使相同模型・相同种子图像也不一致的理由"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## Stable Diffusion web UI 和 ComfyUI 无法生成相同的图像？

从结论来说，**出完全相同的图像几乎是不可能的**。

特别是成为最大因素的是以下 2 点。

- 噪点的生成方法不同
- 提示词权重的计算方法不同

---

## 1. 噪点的生成方法不同

扩散模型是从噪点生成图像的技术。
也就是说如果噪点的形状（模样）不同，生成的图像当然也会不同。

这个噪点生成相当严苛，仅仅是 **在哪里生成噪点** 不同，即使是相同的种子值也会变成别的模样。

- **ComfyUI**
  - 在 **CPU 侧** 生成噪点
  - 设计上即使是不同的 GPU 或环境也容易出“如果是相同种子就是相同噪点”

- **Stable Diffusion web UI**
  - 在 **GPU 侧** 生成噪点

由于这个差异，**即使是相同的种子值，最初使用的噪点模式也会完全变成别的东西**。
如果初期噪点不同，即使经过扩散的过程，最终的图像也不会一致。

---

## 2. 提示词权重的计算方法不同

用括号或冒号书写的 **“权重”** 的处理，两者的举动也不同。

- **ComfyUI**
  - 如果写 `(masterpiece:1.2)` **就直接作为 1.2** 处理
  - 即使写了多个词，基本 **不进行归一化**

- **Stable Diffusion web UI**
  - 将多个权重汇总进行 **归一化（平均化）**
  - 如果提高某个单词的权重，其他单词的权重就会普遍下降

在官方 FAQ 的例子中，如下所示。

**输入提示词**  
> `(masterpiece:1.2) (best:1.3) (quality:1.4) girl`

**在 Stable Diffusion web UI 中，会被归一化**  
> `(masterpiece:0.98) (best:1.06) (quality:1.14) (girl:0.81)`

**在 ComfyUI 中不会被归一化**  
> `masterpiece = 1.2 / best = 1.3 / quality = 1.4 / girl = 1.0` 保持原样

结果是，即使输入相同的文本・相同的数值，由于 **传递给文本编码器的“实际权重”不同**，所以不会变成同样的画。

---

## 那么出“完全相同的图像”的方法是？

虽然有通过自定义节点等模仿 Stable Diffusion web UI 相同权重逻辑的方法，但因为残留着噪点生成的差异等，**想要完全一致是相当困难的**。

我觉得，干脆把这两个工具当作设计思想不同的“别的东西”比较好。
