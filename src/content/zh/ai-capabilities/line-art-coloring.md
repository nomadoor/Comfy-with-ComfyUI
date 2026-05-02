---
layout: page.njk
lang: zh
section: ai-capabilities
slug: line-art-coloring
navId: line-art-coloring
title: 线稿上色
created: 2026-02-06
updated: 2026-03-02
summary: 给线稿上色的技术
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## 什么是线稿上色？

这是给线稿上色的任务。

对于已经能自己画线稿的人来说，比起从 0 开始的 text2image，也许“如何让 AI 给自己的线稿上色”往往更重要。

---

## 使用 ControlNet 进行线稿上色

如果使用 ControlNet Canny（edge），就可以在保持输入线稿大致原貌的情况下，在那里上色。

![](https://gyazo.com/7e1ed10e17831b224bc547a8d6b3deea){gyazo=image}

[](/workflows/ai-capabilities/line-art-coloring/Flux_ControlNet-Union.json)

将线稿（或边缘提取结果）传递给 ControlNet，用文本提示词指定服装、颜色和氛围。

---

## 基于指令的图像编辑进行的线稿上色

也可以将线稿原样传递给 [基于指令的图像编辑](/zh/ai-capabilities/instruction-based-image-editing/) 模型让其上色。

![](https://gyazo.com/18b33d684675ffa56b3b805a9f56791a){gyazo=image}

[](/workflows/ai-capabilities/line-art-coloring/Qwen-Image-Edit-2509.json)

只需将线稿作为输入图像，然后用文本指示“把这个线稿涂成全彩”、“用动画涂法上色”等即可。

---

## 基于参考的上色（线稿＋彩色图像）

如果是“想用和这个角色相同的配色涂这个线稿”、“想借用这张画的用色”的情况，可以使用基于参考的上色。

用 ControlNet（lineart / anime 等）固定线稿的形状・构图，用 IP-Adapter 等参考图像适配器传递彩色插图或照片，使其配色、质感、画风接近。

即使是基于指令的图像编辑模型，如果支持多参考，也可以指定“希望参考图像 2 给图像 1 的线稿上色”。

---

## 闲话

实际画师的工作流，是“底色 → 阴影 → 完稿”这样，稍微多一些步骤的。

不限于着色，AI 虽然擅长突然制作出成品，但不太擅长像人类一样循序渐进地画画。

我是日本人所以多少有点偏心，从像 [Copainter](https://www.copainter.ai/ja) 这样的商业服务到社区的 LoRA，在日本这类研究・实现相当盛行。
