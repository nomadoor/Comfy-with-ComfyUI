---
layout: page.njk
lang: zh
section: basic-workflows
slug: sd15-hires-fix
navId: sd15-hires-fix
title: "Hires.fix"
summary: "使用 Hires.fix 生成高分辨率图像"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 什么是 Hires.fix？

![](https://gyazo.com/a63d1a6610c9928b6c21ba39a0d533d0){gyazo=image}

虽然名字很帅，但做的事情并没有那么复杂。

首先在 text2image 生成图像，将该图像调整为 1.5〜2 倍大小。  
将该放大图像放入 image2image，让其再次重绘。

只是将这个步骤汇总在了一起。

---

## 为什么产生了这种手法？

Stable Diffusion 1.5 推荐的分辨率是 512 × 512px，无法生成大的图像。

这主要有 2 个理由。

### 计算成本的问题

分辨率越高，所需的 VRAM 和计算时间就会一下子增加。  
在图像生成登场的当时，优化还没有像现在这样进展，突然生成大图像是相当繁重的处理。


### 学习中使用的图像尺寸的问题

更本质的理由是，模型是 **“以什么尺寸的图像进行学习的”**。

![](https://gyazo.com/a5fee7589b0c712f6db86426d8f1cc72){gyazo=image}

Stable Diffusion 1.5 几乎只用了 512 × 512px 的图像进行学习。  
也就是说，虽然擅长画这个尺寸附近的画，但 **除此以外的分辨率原本就没有练习过。**

假设让漫画家突然在体育馆的墙壁上画满画。  
因为平时是用原稿纸尺寸画的，恐怕会保持那个感觉，密密麻麻地排列小的分镜和角色吧。

没有练习过“使用整面墙画巨大的 1 张画”这种画法本身，原本连那种想法都涌现不出来。


### Hires.fix 的诞生

于是，首先让模型在擅长的 512 × 512px 附近画，将其放大，以放大的图像为草稿再次重绘。

诞生了这种通过两个阶段的做法。  
这个“先经过一次模型擅长的分辨率，再提升到高分辨率”的办法，就是 Hires.fix 没背景的思想。


---

## 基础的方法

![](https://gyazo.com/96cd5924bcaef159a79e2fb5fa991665){gyazo=image}

[](/workflows/basic-workflows/sd15-hires-fix/SD1.5_Hires.fix.json)

- 🟪 text2image
- 🟦 在 `Upscale Image By` 节点将解码的图像放大为 1.5 倍
- 🟨 将放大的图像输入 image2image

---

## 保持 Latent 状态放大的方法

刚才的工作流中，流程是将 text2image 的图像一度解码为像素图像后放大，再次转换为 latent 进行 image2image。  
这里产生了“不用特意变回像素图像，保持 latent 也能放大不是吗？”的想法。

但是，单纯放大 latent 的话，会发生无法容忍程度的劣化。  
因此很长一段时间都不实用，但登场了进行“抑制劣化的 latent 放大”的自定义节点。

- [Goktug/ComfyUI_NNLatentUpscale (forked from Ttl)](https://github.com/Goktug/ComfyUi_NNLatentUpscale)
  - 使用神经网络将 latent 放大。

![](https://gyazo.com/545160bee6b5c66fd91b32e917ada79c){gyazo=image}

[](/workflows/basic-workflows/sd15-hires-fix/SD1.5_Hires.fix_NNLatentUpscale.json)

- 🟩 将 text2image 出来的 latent 在 `NNLatentUpscale` 节点直接放大
- 🟨 将放大的 latent 原样流入 image2image

> 虽然只是体感，但我觉得一度解码为像素图像的方法品质更好。
