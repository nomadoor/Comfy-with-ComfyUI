---
layout: page.njk
lang: zh
section: ai-capabilities
slug: collage-refine
navId: collage-refine
title: 粗糙拼贴的精修
created: 2026-02-06
updated: 2026-03-02
summary: 把随手拼贴的图像，用基于指令的图像编辑整理成一张自然画面的技巧
seoTitle: "粗糙拼贴精修：用图像编辑 AI 指定构图"
seoDescription: "先随意拼贴摆放物体，再交给基于指令的图像编辑模型整理成自然画面的技巧。讲解能保留位置、参考数量不受限的优点，以及专用 LoRA。"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: /media/ai-capabilities/collage-refine/legacy_gyazo_967bb07db193bdc681c1f5528f99d537.png
---
## 什么是粗糙拼贴的精修？

粗糙拼贴的精修，顾名思义，就是先做一张“随手拼起来的拼贴图像”，再交给基于指令的图像编辑模型，让它整理成一张自然画面的技巧。

先由自己摆好物体，再把“修整干净”“变成自然的照片”这类收尾工作交给模型，这样就能 **把布局的主导权留在人这一边**，同时借用 AI 的力量。

---

## 为什么不是 Subject 转移而是“图像编辑”

基于指令的图像编辑模型的代表 Flux Kontext，原本是输入“1 张图像＋文本提示词”来进行编辑的。
也就是说，“看着参考图像，让同一个 Subject 出现在另一张图像里”这种用法，它本来就没有这个功能。

另一方面，它“编辑并重绘输入图像”的能力非常强，能做的远比单纯换个颜色、删掉某个物体复杂得多。

于是我想到：

先做一张粗糙拼贴，再指示它“变成自然的照片”“让整张画面看起来不违和”，**是不是就能把 Subject 转移当作图像编辑任务来处理了？**

实际试下来效果很好，社区里也有很多人玩得很开心。

---

## 粗糙拼贴精修的优点

最新的基于指令的图像编辑模型已经支持多张图像输入，即便如此，粗糙拼贴的精修仍然有几个优点。

![](/media/ai-capabilities/collage-refine/legacy_gyazo_be997efbbc0c0802513bfab1e8ebe585.png){media=image}

### 可以直接保留位置信息

不是用文本写“请把图像 1 放在这里”，而是直接输入“图像 1 已经放在那里的图像”，所以模型只需在这个摆放的基础上“整理得自然一些”就行了。

用文本来指定布局相当困难，所以这可以说是一个明显的优势吧

### 参考数量没有限制

Subject 转移类的方法，受架构所限，“能输入的参考图像数量”往往有上限。就算能输入很多张，推理时间也会变长。

而粗糙拼贴的话，说得极端一点，只要画布放得下，贴多少个物体都没关系。所有物体都可以当作一个“统一整理”的编辑任务来处理。

---

## 关于专用 LoRA

为了让粗糙拼贴的精修更稳定，已经有人开发了几个专用的 LoRA。这里只做个介绍。

- [Place it Flux Kontext LoRA](https://civitai.com/models/1780962/place-it-flux-kontext-lora)
- [Collage [QwenEdit]](https://civitai.com/models/2024275/collage-qwenedit)
