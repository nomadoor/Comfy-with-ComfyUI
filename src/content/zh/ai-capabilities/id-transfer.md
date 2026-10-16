---
layout: page.njk
lang: zh
section: ai-capabilities
slug: id-transfer
navId: id-transfer
title: ID 转移与 FaceSwap
created: 2026-02-06
updated: 2026-03-02
summary: 保持人物面部或本人特征，创作不同场景图像的技术与换脸
seoTitle: "ID 转移与换脸：保持面部特征生成图像的 AI"
seoDescription: "在保持人物面部和本人特征的同时生成不同场景的 ID 转移技术，以及换脸（FaceSwap）。比较 LoRA、IP-Adapter 系列、InstantID、PuLID-FLUX、InfiniteYou 与基于指令的图像编辑。"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: /media/ai-capabilities/id-transfer/legacy_gyazo_877d8862f6e7f6dd3ec7fbeac5331cd9.png
---
## 什么是 ID 转移与 FaceSwap？

ID 转移是 Subject 转移中专门针对人物的一类，其中很多特别注重 **面部** 的一致性（我个人倒是希望连头发和身体也一起当作 ID 来处理）。

FaceSwap 是生成式 AI 出现之前就有的任务。经典的做法是把参考人物面部的“面具”套到目标人物脸上；而借助 ID 转移技术，只对目标的面部做 inpainting，就能实现更灵活的 FaceSwap。

---

## LoRA

LoRA 是一种“让模型事后学会画原本画不出的东西”的机制，也可以用人物图像来训练。

只要能接受需要训练这一缺点，它的灵活性和稳定性都是一流的。

---

## IP-Adapter 系列

把 Subject 转移里介绍过的 IP-Adapter 技术专门用于 ID 的，有好几条分支。

### IP-Adapter（不带后缀的版本）

IP-Adapter 是一种适配器，用来给现有的 text2image 模型加上“来自图像的条件输入”。

它从图像中提取特征向量，注入到 UNet 内部，让它反映在生成结果中。也能用来转移人物，但主要用途还是大致反映 Subject 或风格。

### IP-Adapter-plus-face

官方推出的、专门针对面部的 IP-Adapter 模型。

![](/media/ai-capabilities/id-transfer/legacy_gyazo_afe7232d9dd3cc54f5d8a2f1d956e15f.png){media=image}

[](/workflows/ai-capabilities/id-transfer/ip_adapter_faceid_plusv2_sd15.json)

### IP-Adapter-FaceID

IP-Adapter-FaceID 系列是一组与人脸识别模型（InsightFace）配合使用、用来牢牢锁定 ID 的模型。

**FaceID** 不用 CLIP 图像嵌入，而是使用“来自人脸识别模型的 Face ID 嵌入”，再用 LoRA 进一步提高 ID 一致性。

改良版 **FaceID-Plus** 同时使用“用于 ID 的 Face ID 嵌入”和“用于面部结构的 CLIP 图像嵌入”，兼顾了长相的相似度和脸型、结构的稳定性。

### InstantID

严格来说它不属于 IP-Adapter 这一脉，但同样是只要接上额外的适配器就能用、专门做 ID 转移的方法。

![](/media/ai-capabilities/id-transfer/legacy_gyazo_a4213b144081a1267432874bfc09c1f4.png){media=image}

[](/workflows/ai-capabilities/id-transfer/instantid_simple.json)

它在 IP-Adapter 式的图像适配器之外，还组合了一个额外的网络（IdentityNet），利用从人脸识别模型得到的 ID 嵌入和面部关键点，从而更好地兼顾“从一张面部照片保持 ID”和“用文本编辑”。

我个人认为，在 SDXL 上用的话，InstantID 是最强的。

### PuLID-FLUX / InfiniteYou

随着时代发展，基础模型的主战场也从 SDXL 转向了 Diffusion Transformer 系（FLUX 系）。相应地，以 Flux.1 为前提的 ID 转移方法也出现了。

**PuLID-FLUX** 是基于 FLUX1-dev、专门针对 ID 的定制方法。借助 Lightning T2I 等设计，无需额外训练，只用“参考面部＋文本”就能在保持 ID 的同时改变画风。

- ![](/media/ai-capabilities/id-transfer/legacy_gyazo_7a87706872f7b195d46aeabafa6a399e.png){media=image}

- [](/workflows/ai-capabilities/id-transfer/pulid_flux_ll.json)

**InfiniteYou** 是基于 FLUX 系 Diffusion Transformer 的 ID 保持框架。它通过把 Identity 特征注入 DiT 主体的模块（InfuseNet）和多阶段训练策略，力求同时提高 ID 相似度、文本一致性和画质。

---

## 基于指令的图像编辑与 ID 转移

既然能做 Subject 转移，自然不用多说，“[基于指令的图像编辑模型](/zh/ai-capabilities/instruction-based-image-editing/)”也能用来做 ID 转移。

---

## FaceSwap

FaceSwap 是将目标人物的脸替换为参考人物脸的技术。

### 经典的 FaceSwap（ReActor / InsightFace 系）

与其说是 ID 转移，不如说更接近“做一张面具套上去”的思路。

用人脸检测和关键点检测推断面部的位置、朝向和轮廓，通过仿射变换等把源面部和目标面部对齐，再用遮罩和混合把目标一侧的面部替换成源面部。

![](/media/ai-capabilities/id-transfer/legacy_gyazo_1a0a81f044bd264db835ef99d40a37d1.png){media=image}

[](/workflows/ai-capabilities/id-transfer/reactor_fast.json)

ComfyUI 里能用的代表是 ReActor（基于 InsightFace 的 FaceSwap），但它曾因伦理方面的原因被删除仓库等，也是一项让人不太放心的技术。

### 使用 ID 转移的面部 inpainting

这种方法是把目标人物的面部作为遮罩进行 inpainting，并借助 ID 转移技术重绘目标的面部。

在 ID 转移技术还不成熟的时候，也有人先用 ReActor 做 FaceSwap，再用借助 ID 转移的 inpainting 来精修（这是我做的工作流里相当受欢迎的一个）。

[用 ReActor 完成 Face Swap 后，再用 InstantID 精修](https://scrapbox.io/work4ai/ReActor%E3%81%A7Face_Swap%E3%81%97%E3%81%9F%E3%81%82%E3%81%A8%E3%81%ABInstantID%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%83%AA%E3%83%95%E3%82%A1%E3%82%A4%E3%83%B3%E3%81%99%E3%82%8B)

![](/media/ai-capabilities/id-transfer/legacy_gyazo_877d8862f6e7f6dd3ec7fbeac5331cd9.png){media=image}

[](/workflows/ai-capabilities/id-transfer/reactor_w_instantid2.json)
