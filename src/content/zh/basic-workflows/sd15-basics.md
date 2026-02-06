---
layout: page.njk
lang: zh
section: basic-workflows
slug: sd15-basics
navId: sd15-basics
title: "图像生成的基础(SD1.5)"
summary: "在 Stable Diffusion 1.5 中学习图像生成的基础"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  gradient:
  image: ""
---

## 无论哪个模型工作流都大体相同

![](https://gyazo.com/55ef8fc59cbcbc5093b9e1b3d15dceb5){gyazo=image}

![](https://gyazo.com/bc7fe8fc68bbc2fb408314e8acee9ab1){gyazo=image}

上图是 **Stable Diffusion 1.5**，下图是最新模型 **Z-Image** 的工作流。

虽然节点数等有细微差别，但能明白大体是相同的吗？  
无论是什么新的图像生成模型，还是视频生成模型，**“准备材料投给 KSampler”** 这个流程是不会变的。

我很理解想快点使用新模型的心情，但请按捺住急切的心情，试着网罗一遍以 Stable Diffusion 1.5 为基础的工作流。

这之后的 ComfyUI 生活，应该会变得一下子开心起来。

---

## “模块式”是什么？

ComfyUI 这样的基于节点的工具，经常被说明优点是“模块式”的。

那么，模块式到底是什么。  
那在图像生成中，是怎样便利的呢。  

### 模块式

模块式，是指像乐高积木一样可以“后加所需功能”的构造。

- 有作为基础的地基
- 出现了需要的功能，就只添加那个部分的积木
- 想进一步增加功能时，再添加积木

这种“做加法”的思考方式，也原样适用于 ComfyUI 的工作流。

### 在 ComfyUI 中是怎样的

先把具体的节点名放在一边，看看一点点扩展工作流的样子。  
顺着流程确认一下哪个部分作为模块增加了。

- 1. **text2image**
  - 这是基本。输入提示词，把它投给 KSampler 即可。
  - ![](https://gyazo.com/10c6a84174c94fbd6b66fbed2bd2a4c3){gyazo=image}
  - [](/workflows/basic-workflows/sd15-basics/SD1.5_text2image.json)

- 2. **image2image**
  - 以输入的图像为草稿进行图像生成。
  - ![](https://gyazo.com/8426a110f038cddb3907e51d155ed9b3){gyazo=image}
  - [](/workflows/basic-workflows/sd15-basics/SD1.5_image2image.json)
  - 🟩 添加读取图像的节点，和将其转换为 latent 的节点。

- 3. **inpainting**
  - 只对输入图像的一部分进行 image2image。
  - ![](https://gyazo.com/a9bd94b38c77cca3acb5b6a5b9d894a6){gyazo=image}
  - [](/workflows/basic-workflows/sd15-basics/SD1.5_inpainting.json)
  - 🟥 添加为了让其只 image2image 被掩盖场所的节点。

- 4. **ControlNet**
  - ControlNet 是在生成图像时，可以输入图像进行控制的功能。
  - ![](https://gyazo.com/46553948d7e458ed19a69b0a5a8f5141){gyazo=image}
  - [](/workflows/basic-workflows/sd15-basics/SD1.5_inpainting_controlnet.json)
  - 🟦 添加 ControlNet 的节点，和制作作为 ControlNet 控制使用的图像的节点。
  
- 5. **进一步添加 ControlNet**
  - ControlNet 没有只有一个的限制。再添加一个试试吧。
  - ![](https://gyazo.com/daa261583657abf6c25d2003581d1610){gyazo=image}
  - [](/workflows/basic-workflows/sd15-basics/SD1.5_inpainting_controlnet2.json)
  - 🟦 只要再做一组 ControlNet 和其预处理节点并连接就行了。

---

虽说只是一个例子，但我觉得展示了 ComfyUI 的灵活性。

除了官方的模板以外，许多人也公开了工作流，但即便如此，你所期望的完美工作流可能在这世上并不存在。  
但是不用担心。不需要就删掉，有其他想要的功能就加上去好了。
