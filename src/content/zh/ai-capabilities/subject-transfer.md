---
layout: page.njk
lang: zh
section: ai-capabilities
slug: subject-transfer
navId: subject-transfer
title: Subject 转移
created: 2026-02-06
updated: 2026-03-02
summary: 让参考图像里的同一个对象出现在其他场景中的技术
seoTitle: "Subject 转移：让同一角色或物体出现在新场景"
seoDescription: "让参考图像中的角色或物体出现在其他场景的 Subject 转移（Subject-Driven Image Generation）。比较 LoRA、IP-Adapter、IC-LoRA、ACE++ 与基于指令的图像编辑模型。"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## 什么是 Subject 转移？

这个任务的正式名称是“Subject-Driven Image Generation（主体驱动的图像生成）”。

Subject 不限于人，角色、布偶、某只特定的狗、吉祥物、手办等，泛指“这张图像里拍到的‘那个东西’”。
Subject 转移，就是生成包含参考图像中同一个 Subject 的图像的技术。

> [!NOTE]
> 转移 ID（人物的面部、本人特征）的技术也属于 Subject 转移，但它比较特殊，专门做 ID 转移的技术也很多，所以另外介绍。

---

## LoRA

不用多说，就是让模型学习它画不出来的东西，从而能画出来的方法。

从问世到现在，论灵活性和稳定性，没有哪种方法能超过它。

最大的问题是 **需要训练**，用起来不够轻松。

---

## image2prompt

最朴素的做法，是“从图像生成描述，再用这段描述跑 text2image”。

你可能会想：这么原始的方法也行？但只要有能完美描述参考图像的 MLLM，以及能完美还原这段描述的图像生成模型，原理上是可行的。

![](/media/ai-capabilities/subject-transfer/legacy_gyazo_26351f2e5d3eb17c623acd815ba8709c.png){media=image}

[](/workflows/ai-capabilities/subject-transfer/z_image_gemini_3_0.json)

最近模型的性能正在让这件事变得可行。作为“最省钱的准 Subject 转移”，值得试一次。

---

## SeeCoder / UnCLIP 系

image2prompt 是“图像 → 文本 → 嵌入”两个阶段，而 SeeCoder、UnCLIP 系则 **直接完成“图像 → 嵌入”**。

它从图像生成相当于文本嵌入的向量，用来代替 text encoder。

![](/media/ai-capabilities/subject-transfer/legacy_gyazo_d0196735e6162d464bd8764448d4088b.png){media=image}

[](/workflows/ai-capabilities/subject-transfer/seecoder.json)

和 image2prompt 相比，“转成文本”这一步造成的信息损失更少；但因为没法当作文本来编辑，用起来不如前者方便。

---

## IP-Adapter

作为“无需训练就能做 Subject 转移”的方法，它是实际应用中最早达到实用水平的技术。

IP-Adapter 是一种适配器，用来给现有的 text2image 模型插入“来自图像的条件”。它曾是仅次于 ControlNet 的代表性适配器，被广泛使用。

它从参考图像中提取特征向量，注入 UNet 内部（Cross-Attention 附近等），让特征反映到生成图像中。它可以和文本提示词同时使用，所以能分工：“Subject 用图像指定”，“场景和风格用文本指定”。

---

## IC-LoRA / ACE++

以 Flux 为代表的 DiT 系模型，本身就潜藏着“生成彼此一致的图像”的能力。

利用这一性质做 Subject 转移的，就是 IC-LoRA / ACE++。

![](/media/ai-capabilities/subject-transfer/legacy_gyazo_8e01db8cebce51e7c47d9f958a94c61b.png){media=image}

[](/workflows/ai-capabilities/subject-transfer/ace_plus_portrait.json)

在图像画布左侧放上参考图像（包含 Subject），把右侧整个遮罩起来让模型生成 (inpainting)。模型会一边参考左侧的信息一边填充右侧，因此能“用与左侧相同的 Subject 生成新的图像”。

---

## 基于指令的图像编辑模型

“[基于指令的图像编辑模型](/zh/ai-capabilities/instruction-based-image-editing/)”也可以用来做 Subject 转移。

![](/media/ai-capabilities/subject-transfer/legacy_gyazo_358c8441ff70ee58135d8340bd691200.png){media=image}

[](/workflows/ai-capabilities/subject-transfer/qwen_image_edit_2509_multi_ref.json)

这些模型可以根据“把这只狗放到别的背景里”“把这个人放进森林里”这样的文本指令来编辑图像。

另外，支持多张参考图像的模型，甚至能把“图像 A 中人物的服装”换成“图像 B 中人物的服装”。
