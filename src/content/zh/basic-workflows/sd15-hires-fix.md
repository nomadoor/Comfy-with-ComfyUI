---
layout: page.njk
lang: zh
section: basic-workflows
slug: sd15-hires-fix
navId: sd15-hires-fix
title: "Hires.fix"
created: 2026-02-06
updated: 2026-03-02
summary: "用 Hires.fix 生成高分辨率图像"
seoTitle: "ComfyUI 的 Hires.fix：生成高分辨率图像"
seoDescription: "把生成的图像放大后用 image2image 重绘的 Hires.fix 原理和诞生原因。介绍在 ComfyUI 中的基本搭法，以及在 latent 状态下放大的方法，附工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 什么是 Hires.fix？

![](/media/basic-workflows/sd15-hires-fix/legacy_gyazo_a63d1a6610c9928b6c21ba39a0d533d0.png){media=image}

名字听起来很酷，但做的事情其实没那么复杂。

先用 text2image 生成图像，再把它放大到 1.5〜2 倍。  
然后把放大后的图像交给 image2image，让它重新画一遍。

只不过是把这几个步骤打包在了一起。

---

## 为什么会出现这种方法？

Stable Diffusion 1.5 推荐的分辨率是 512 × 512px，没办法生成大尺寸的图像。

原因主要有 2 个。

### 计算成本的问题

分辨率越高，所需的 VRAM 和计算时间就会急剧增加。  
图像生成刚出现的时候，优化远没有现在这么成熟，一上来就生成大图是相当吃力的处理。


### 训练所用图像尺寸的问题

更本质的原因在于，模型 **“是用什么尺寸的图像训练的”**。

![](/media/basic-workflows/sd15-hires-fix/legacy_gyazo_a5fee7589b0c712f6db86426d8f1cc72.png){media=image}

Stable Diffusion 1.5 几乎只用 512 × 512px 的图像训练过。  
也就是说，它擅长画这个尺寸附近的画，但 **其他分辨率根本就没练习过。**

假设请一位漫画家突然在体育馆的整面墙上画画。  
他平时都是在稿纸大小的纸上画，大概会照着那种感觉，把小分格和角色密密麻麻地排满吧。

他从没练习过“用整面墙画一张巨幅画”这种画法，甚至根本想不到要这么画。


### Hires.fix 的诞生

于是，先让模型在它擅长的 512 × 512px 附近画，再把画放大，以放大后的图像为草稿重新画一遍。

这种分两步走的做法就这样诞生了。  
“先经过一次模型擅长的分辨率，再提升到高分辨率”，这个巧思就是 Hires.fix 背后的思路。


---

## 基本方法

![](/media/basic-workflows/sd15-hires-fix/legacy_gyazo_96cd5924bcaef159a79e2fb5fa991665.png){media=image}

[](/workflows/basic-workflows/sd15-hires-fix/sd1_5_hires_fix.json)

- 🟪 text2image
- 🟦 用 `Upscale Image By` 节点把解码后的图像放大到 1.5 倍
- 🟨 把放大后的图像输入 image2image

---

## 直接在 Latent 状态下放大的方法

刚才的工作流先把 text2image 的图像解码成像素图像再放大，然后重新转换为 latent 做 image2image。  
这时自然会想：“不特意转回像素图像，直接放大 latent 不就行了吗？”

但单纯放大 latent 的话，画质会劣化到无法接受的程度。  
所以这种做法很长时间都不实用，不过后来出现了能“抑制劣化地放大 latent”的自定义节点。

- [Goktug/ComfyUI_NNLatentUpscale (forked from Ttl)](https://github.com/Goktug/ComfyUi_NNLatentUpscale)
  - 用神经网络放大 latent。

![](/media/basic-workflows/sd15-hires-fix/legacy_gyazo_545160bee6b5c66fd91b32e917ada79c.png){media=image}

[](/workflows/basic-workflows/sd15-hires-fix/sd1_5_hires_fix_nnlatentupscale.json)

- 🟩 用 `NNLatentUpscale` 节点直接放大 text2image 输出的 latent
- 🟨 把放大后的 latent 直接传给 image2image

> [!NOTE]
> 只是个人感觉，我觉得先解码成像素图像的方法质量更好。
