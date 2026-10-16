---
layout: page.njk
lang: zh
section: basic-workflows
slug: sd15-basics
navId: sd15-basics
title: "图像生成基础(SD1.5)"
created: 2026-02-06
updated: 2026-03-02
summary: "用 Stable Diffusion 1.5 学习图像生成的基础"
seoTitle: "图像生成基础：用 SD1.5 学习 ComfyUI 工作流"
seoDescription: "无论哪个模型，ComfyUI 工作流的结构都大致相同。用 Stable Diffusion 1.5 讲解准备素材并交给 KSampler 的流程，以及 ComfyUI “模块化”的含义。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  gradient:
  image: ""
---

## 不管什么模型，工作流都大同小异

![](/media/basic-workflows/sd15-basics/legacy_gyazo_55ef8fc59cbcbc5093b9e1b3d15dceb5.png){media=image}

![](/media/basic-workflows/sd15-basics/legacy_gyazo_bc7fe8fc68bbc2fb408314e8acee9ab1.png){media=image}

上图是 **Stable Diffusion 1.5**，下图是最新模型 **Z-Image** 的工作流。

虽然节点数量等细节有所不同，但能看出它们大体是一样的吗？  
不管是多新的图像生成模型，还是视频生成模型，**“准备好材料，丢给 KSampler”** 这个流程都不会变。

想快点用上新模型的心情我非常理解，但请先按捺一下，把基于 Stable Diffusion 1.5 的工作流完整过一遍。

之后的 ComfyUI 生活应该会变得有趣得多。

---

## “模块化”是什么意思？

ComfyUI 这类基于节点的工具，常被说成优点在于“模块化”。

那么，模块化到底是什么？  
它在图像生成中又方便在哪里呢？  

### 模块化

模块化是指像乐高积木一样，“可以之后再添加所需功能”的结构。

- 先有一个作为基础的底座
- 需要什么功能，就只在那部分加上积木
- 还想增加功能时，再继续加积木

这种“做加法”的思路，同样适用于 ComfyUI 的工作流。

### 在 ComfyUI 中是什么样的

先不管具体的节点名，来看看工作流一点点扩展的过程。  
顺着流程确认一下，是哪些部分作为模块增加进来的。

- 1. **text2image**
  - 最基础的形式。输入提示词，把它丢给 KSampler 就行。
  - ![](/media/basic-workflows/sd15-basics/legacy_gyazo_10c6a84174c94fbd6b66fbed2bd2a4c3.png){media=image}
  - [](/workflows/basic-workflows/sd15-basics/sd1_5_text2image.json)

- 2. **image2image**
  - 以输入的图像为草稿来生成图像。
  - ![](/media/basic-workflows/sd15-basics/legacy_gyazo_8426a110f038cddb3907e51d155ed9b3.png){media=image}
  - [](/workflows/basic-workflows/sd15-basics/sd1_5_image2image.json)
  - 🟩 添加加载图像的节点，以及把它转换为 latent 的节点。

- 3. **inpainting**
  - 只对输入图像的一部分进行 image2image。
  - ![](/media/basic-workflows/sd15-basics/legacy_gyazo_a9bd94b38c77cca3acb5b6a5b9d894a6.png){media=image}
  - [](/workflows/basic-workflows/sd15-basics/sd1_5_inpainting.json)
  - 🟥 添加一个节点，让 image2image 只作用于掩膜区域。

- 4. **ControlNet**
  - ControlNet 是在生成图像时，可以输入图像来进行控制的功能。
  - ![](/media/basic-workflows/sd15-basics/legacy_gyazo_46553948d7e458ed19a69b0a5a8f5141.png){media=image}
  - [](/workflows/basic-workflows/sd15-basics/sd1_5_inpainting_controlnet.json)
  - 🟦 添加应用 ControlNet 的节点，以及生成 ControlNet 控制图像的节点。
  
- 5. **进一步添加 ControlNet**
  - ControlNet 并没有只能用一个的限制。再加一个试试吧。
  - ![](/media/basic-workflows/sd15-basics/legacy_gyazo_daa261583657abf6c25d2003581d1610.png){media=image}
  - [](/workflows/basic-workflows/sd15-basics/sd1_5_inpainting_controlnet2.json)
  - 🟦 只要再做一组 ControlNet 及其预处理节点连上就行了。

---

虽然只是一个例子，但应该能看出 ComfyUI 有多灵活了。

除了官方模板，还有很多人公开了自己的工作流，但即便如此，世上可能还是没有完全符合你需求的工作流。  
不过不用担心。不需要的就删掉，想要别的功能就加上去。
