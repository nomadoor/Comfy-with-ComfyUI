---
layout: page.njk
lang: zh
section: ai-capabilities
slug: line-art-coloring
navId: line-art-coloring
title: 线稿上色
created: 2025-12-01
updated: 2026-03-02
summary: 给线稿上色的技术
seoTitle: "用 AI 给线稿上色：ControlNet 与图像编辑模型"
seoDescription: "用 AI 给自己画的线稿上色的方法比较：基于 ControlNet 的上色、用基于指令的图像编辑模型上色，以及结合线稿和彩色图像的参考式上色。"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## 什么是线稿上色？

就是给线稿上色的任务。

对已经能自己画线稿的人来说，比起从零开始的 text2image，“怎样让 AI 给自己的线稿上色”往往更重要吧。

---

## 使用 ControlNet 进行线稿上色

使用 ControlNet Canny（edge），就能在基本保留输入线稿的前提下为它上色。

![](/media/ai-capabilities/line-art-coloring/legacy_gyazo_7e1ed10e17831b224bc547a8d6b3deea.png){media=image}

[](/workflows/ai-capabilities/line-art-coloring/flux_controlnet_union.json)

把线稿（或边缘提取结果）交给 ControlNet，再用文本提示词指定服装、颜色和氛围。

---

## 用基于指令的图像编辑给线稿上色

也可以把线稿直接交给 [基于指令的图像编辑](/zh/ai-capabilities/instruction-based-image-editing/) 模型，让它来上色。

![](/media/ai-capabilities/line-art-coloring/qwen_image_edit_2509.png){media=image}

[](/workflows/ai-capabilities/line-art-coloring/qwen_image_edit_2509.json)

只要把线稿作为输入图像，再用文本下指令，比如“把这张线稿涂成全彩”“用动画风格的平涂上色”就行了。

---

## 基于参考的上色（线稿＋彩色图像）

如果想“用和这个角色一样的配色来涂这张线稿”“借用这张画的用色”，就可以用基于参考图像的上色。

用 ControlNet（lineart / anime 等）固定线稿的形状和构图，再通过 IP-Adapter 等参考图像适配器传入彩色插画或照片，让配色、质感和画风向它靠拢。

基于指令的图像编辑模型中，支持多参考的那些，也有的可以指定“参考图像 2 来给图像 1 的线稿上色”。

---

## 题外话

画师实际的工作流程，会像“铺底色 → 上阴影 → 收尾”这样，多分几个步骤。

不只是上色，AI 擅长一下子做出成品，却不太擅长像人一样一点点把画画出来。

因为我是日本人，难免有点偏心：从 [Copainter](https://www.copainter.ai/ja) 这样的商业服务到社区的 LoRA，日本在这方面的研究和实现相当活跃。
