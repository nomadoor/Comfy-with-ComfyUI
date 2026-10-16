---
layout: page.njk
lang: zh
section: basic-workflows
slug: sd15-textual-inversion
navId: sd15-textual-inversion
title: "Textual Inversion"
created: 2025-12-05
updated: 2026-08-26
summary: "在 Stable Diffusion 1.5 中使用 Textual Inversion"
seoTitle: "在 ComfyUI 中使用 Textual Inversion（embedding）"
seoDescription: "把难以用文字描述的外观作为新词教给模型的 Textual Inversion 原理，以及在 ComfyUI 中使用 embedding 的方法，附 embedding 下载与 text2image 工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 什么是 Textual Inversion？

想生成某种图像，却没法用文字描述清楚，这种情况很常见。

**Textual Inversion** 就是把这种“难以用文字表达的外观或概念”作为一个新单词教给模型的技术。

- 首先，准备 1 个像 `<my_keyword>` 这样的虚拟单词。
- 把这个单词和几张到几十张氛围相似的图像配成一组，给模型看。
- 模型会学习“这些图像的共同特征”，并把这些信息嵌入到 `<my_keyword>` 这 1 个词里。

有名的例子有 `easynegative` 和 `badhandv4` 等。  
它们是收集大量“失败的图像”来训练，把“图像生成中常见的失败”这个概念浓缩成了一个词。

不过，原本的模型完全画不出的东西，它没法让模型从零开始画出来。  
它能处理的只有 **模型原本就知道，但不知道该怎么下指令的东西**。

遇到那种情况，就需要 LoRA 或全量微调这类重新训练模型本身的方法。

> [!NOTE]
> 用 Textual Inversion 做出的这 1 个词的数据，习惯上称为 *embedding*。

---

## 现在几乎没人用了

Textual Inversion 虽然有训练轻量的优点，但现在几乎都被 LoRA 取代了。

`easynegative`、`badhandv4` 等也因为模型本身性能的提升，基本上用不着了。

例外的情况是，Checkpoint 或 LoRA 的作者有时会一并分发专用的 embeddings，好让输出更接近他们设想的效果。

要发挥出模型的性能，使用者需要正确输入“作者设想的提示词”。但并不是所有使用者都会照做，而且每次都写一大段细致的提示词也很麻烦。

所以作者会预先准备好 embeddings，只要使用者加上这个词，输出就更容易接近作者设想的效果。

---

## 使用 embedding 的 text2image

### 下载 embedding

来试试名为 `Porsche 911 Turbo` 的 embedding 吧。

- [Porsche 911 Turbo](https://civitai.com/models/54528/porsche-911-turbo?modelVersionId=58895)
-  ```text
    📂ComfyUI/
      └── 📂models/
          └── 📂embeddings/
              └── porsche911_ti.pt
    ``` 

### 工作流

![](/media/basic-workflows/sd15-textual-inversion/legacy_gyazo_4631607c66ac4a2f6edfb442a786b79e.png){media=image}

[](/workflows/basic-workflows/sd15-textual-inversion/sd1_5_embedding.json)

- 在 CLIP Text Encode 中写入 `embedding:文件名`，就能调用 embedding。
  - e.g. `embedding:porsche911_ti`
