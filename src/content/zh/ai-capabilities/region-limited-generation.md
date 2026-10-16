---
layout: page.njk
lang: zh
section: ai-capabilities
slug: region-limited-generation
navId: region-limited-generation
title: 区域指定生成
created: 2026-02-06
updated: 2026-03-02
summary: 只让图像的一部分按照不同条件生成的技术，以及它的局限
seoTitle: "区域指定生成：在图像任意位置画出想要的内容"
seoDescription: "只对图像局部用不同条件生成、以指定构图的技术比较：提示词中写位置、反复 inpainting、Conditioning Set Area、Latent Couple / Attention Couple，以及粗糙拼贴的精修。"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## 什么是区域指定生成？

在设计中，布局是很重要的一环。

只用“在街上靠着墙的女性”这样的提示词生成图像，是做不出有吸引力的作品的。

画面右边是一面砖墙，一位女性靠在墙上，她身前不远处立着一盏路灯，画面左侧少放东西，留出空白……

想在喜欢的位置放上想要的物体，生成这样的图像，所用的技术就是“区域指定”。

---

## 用提示词指示位置

最简单的方法，是把位置关系直接写进提示词。

![](/media/ai-capabilities/region-limited-generation/legacy_gyazo_70bc945855f5eb1162bba1cbd2babb60.png){media=image}

[](/workflows/ai-capabilities/region-limited-generation/flux_1_dev.json)

> “左边是香蕉，右边是苹果”

Stable Diffusion 的文本编码器几乎理解不了位置关系，但从 Flux 开始的模型，已经能在一定程度上反映位置关系了。

即便如此，构图一复杂还是容易崩，与其说是严格的区域指定，不如说是传达一个大致布局意向的手段。

---

## 反复 Inpainting

先生成一张图像，再反复多次 Inpainting 的方法。

![](/media/ai-capabilities/region-limited-generation/legacy_gyazo_2c5b6e3fd8491c24da35f6c5d8d825c9.png){media=image}

[](/workflows/ai-capabilities/region-limited-generation/flux_1_fill.json)

- 1. 生成作为基础的图像
- 2. 给想要编辑的区域加上遮罩，进行 Inpainting
- 3. 根据需要，换个遮罩，对其他区域也进行 Inpainting

你可能觉得这不太聪明，但这是 **可靠又稳定的方法**。提示词不会互相混杂，LoRA 基本上也不会影响遮罩以外的区域。每个区域都可以当作完全独立的步骤来处理。

缺点是各部分分开生成，物体之间没法产生互动。比如两个人握手的图像，容易出现视线对不上、看着别扭的情况。

---

## Conditioning Set Area（Regional Prompting 系）

这种方法试图对图像的不同位置应用不同的文本条件。它利用 Cross-Attention 层，为每个区域使用不同的提示词。

![](/media/ai-capabilities/region-limited-generation/legacy_gyazo_bca9aa6c5425ee4f7e4294d081d04e18.png){media=image}

[](/workflows/ai-capabilities/region-limited-generation/conditioning_set_mask.json)

道理很漂亮，但实际上边界经常会晕开，或者切换得不干净，**实用性并不高**。

另外，LoRA 无法按区域指定。

---

## Latent Composite（在潜在空间中合成）

在潜在空间阶段合成图像的方法。

![](/media/ai-capabilities/region-limited-generation/legacy_gyazo_87c4aa926f36889c2987cf5fc827c4e9.png){media=image}

[](/workflows/ai-capabilities/region-limited-generation/latent_composite.json)

- 1. 首先生成多张图像（香蕉图像、苹果图像、背景图像等）
- 2. 用遮罩把各自的 latent 拼成一张 latent
- 3. 对拼好的 latent 跑完剩下的采样步数

每个物体都能用不同的条件生成，最后再融合成“一张图像”。

不过很多时候，与其用这个方法，不如多做几次 Inpainting，最后再对整体做一次 image2image，反而更可靠。

---

## Latent Couple / Attention Couple

### Latent Couple

这种方法把潜在空间按区域完全分开，各自用不同的设置（提示词、LoRA 等）生成，再合并起来。

- 每个区域都能用完全不同的设置，这一点很理想
- 相当于有几个区域就生成几张图像，所以计算量很大

目前 ComfyUI 中没有直接的实现

### Attention Couple

Latent Couple 要把整个 UNet 都计算一遍，而它只计算 Cross-Attention 层

计算量因此少了很多，但 LoRA 无法按区域指定

![](/media/ai-capabilities/region-limited-generation/legacy_gyazo_efd7424ffea10f0eed2ef0f4b744636d.png){media=image}

[](/workflows/ai-capabilities/region-limited-generation/attention_couple.json)

---

## 粗糙拼贴的精修 (推荐)

先做一张粗糙的拼贴图像，再让模型以它为基础，重新做成一张自然的画面。
![](/media/ai-capabilities/collage-refine/legacy_gyazo_be997efbbc0c0802513bfab1e8ebe585.png){media=image}

位置可以非常直观地指定，要生成的东西也只需随便贴个物体上去就行，实际上是我相当推荐的方法。

详情 → [粗糙拼贴的精修](/zh/ai-capabilities/collage-refine/)
