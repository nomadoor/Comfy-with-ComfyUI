---
layout: page.njk
lang: zh
section: ai-capabilities
slug: id-transfer
navId: id-transfer
title: ID 转移与 FaceSwap
summary: 保持人物面部或本人特征，创作不同场景图像的技术与换脸
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: https://i.gyazo.com/877d8862f6e7f6dd3ec7fbeac5331cd9.png
---
## 什么是 ID 转移与 FaceSwap？

ID 转移是 Subject 转移中专注于人物的一种。特别是有很多专注于 **面部** 一致性的技术（个人希望把头发和身体也一并作为 ID 来处理）。

FaceSwap 是生成 AI 出现之前就有的任务。古老的方法是将参考人物脸的“面具”戴在目标人物的脸上，但是如果使用 ID 转移的技术，只对目标的脸部进行 inpainting，就可以进行更灵活的 FaceSwap。

---

## LoRA

LoRA 是“让模型能画出原本画不出的东西”的机制，也可以让其学习人物的图像。

只要能克服需要学习这一缺点，灵活性和稳定性都是一流的。

---

## IP-Adapter 系

有一些谱系是将 Subject 转移中处理过的 IP-Adapter 技术，特化于 ID 的。

### IP-Adapter（无印）

IP-Adapter 是用于向现有的 text2image 模型添加“来自图像的条件输入”的适配器。

它从图像中提取特征向量，通过将其注入 UNet 内部，反映到生成结果中。虽然也可以进行人物转移，但主要还是粗略地反映 Subject 或风格。

### IP-Adapter-plus-face

官方专注于面部的 IP-Adapter 模型。

![](https://gyazo.com/afe7232d9dd3cc54f5d8a2f1d956e15f){gyazo=image}

[](/workflows/ai-capabilities/id-transfer/ip-adapter-faceid-plusv2_sd15.json)

### IP-Adapter-FaceID

IP-Adapter-FaceID 系是与人脸识别模型（InsightFace）组合，为了强力固定 ID 的模型群。

在 **FaceID** 中，代替 CLIP 图像嵌入，使用的是“来自人脸识别模型的 Face ID 嵌入”，并进一步用 LoRA 提高 ID 一致性。

在改良版的 **FaceID-Plus** 中，通过同时使用“ID 用的 Face ID 嵌入”和“面部结构用的 CLIP 图像嵌入”，兼顾了面部的相似度和脸型・结构的稳定性。

### InstantID

严格来说它不属于 IP-Adapter 谱系，但也是只需指向额外的适配器就能使用的、专注于 ID 转移的手法。

![](https://gyazo.com/a4213b144081a1267432874bfc09c1f4){gyazo=image}

[](/workflows/ai-capabilities/id-transfer/InstantID-simple.json)

除了 IP-Adapter 型的图像适配器之外，通过组合使用从人脸识别模型获得的 ID 嵌入和面部关键点的附加网络（IdentityNet），提高了从一张脸部照片保持 ID 和文本编辑的平衡。

个人认为，如果在 SDXL 中使用，InstantID 是最强的。

### PuLID-FLUX / InfiniteYou

随着时代的发展，基础模型的主战场也从 SDXL 转移到了 Diffusion Transformer 系（FLUX 系）。随之，以 Flux.1 为前提的 ID 转移手法也登场了。

**PuLID-FLUX** 是基于 FLUX1-dev 的、特化 ID 的定制手法。通过 Lightning T2I 等的巧思，无需额外学习，就能通过“参考脸＋文本”在保持 ID 的同时改变画风。

- ![](https://gyazo.com/7a87706872f7b195d46aeabafa6a399e){gyazo=image}

- [](/workflows/ai-capabilities/id-transfer/PuLID_Flux_ll.json)

**InfiniteYou** 是基于 FLUX 系 Diffusion Transformer 的保持 ID 框架。通过将 Identity 特征注入 DiT 本体的模块（InfuseNet）和多阶段的学习策略，旨在同时提高 ID 的相似度、文本一致性及画质。

---

## 指示基图像编辑与 ID 转移

因为能进行 Subject 转移，所以不用说，“[基于指令的图像编辑模型](/zh/ai-capabilities/instruction-based-image-editing/)”也可以用于 ID 转移。

---

## FaceSwap

FaceSwap 是将目标人物的脸替换为参考人物脸的技术。

### 古典的 FaceSwap（ReActor / InsightFace 系）

与其说是 ID 转移，不如说是接近“制作面具并戴上”的想法。

通过人脸检测和关键点检测，推断脸部的位置・方向・轮廓，通过仿射变换等将源脸和目标脸对齐，用遮罩和混合将目标侧的脸部部分替换为源脸。

![](https://gyazo.com/1a0a81f044bd264db835ef99d40a37d1){gyazo=image}

[](/workflows/ai-capabilities/id-transfer/ReActor_Fast.json)

在 ComfyUI 中可以使用的代表性工具有 ReActor（基于 InsightFace 的 FaceSwap），但由于伦理观点导致仓库被删除等，这也是一项不确定因素很强的技术。

### 使用 ID 转移的面部 inpainting

这是在将目标人物的脸作为遮罩进行 inpainting 时，使用 ID 转移的技术重绘目标脸部的方法。

在 ID 转移技术还不成熟的时候，也有过先用 ReActor 进行 FaceSwap，再用使用了 ID 转移的 inpainting 进行优化的手法（在我制作的工作流中，也是相当有人气的一个）。

[在 ReActor 进行 Face Swap 后使用 InstantID 进行优化](https://scrapbox.io/work4ai/ReActor%E3%81%A7Face_Swap%E3%81%97%E3%81%9F%E3%81%82%E3%81%A8%E3%81%ABInstantID%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%83%AA%E3%83%95%E3%82%A1%E3%82%A4%E3%83%B3%E3%81%99%E3%82%8B)

![](https://gyazo.com/877d8862f6e7f6dd3ec7fbeac5331cd9){gyazo=image}

[](/workflows/ai-capabilities/id-transfer/ReActor_w_InstantID2.json)
