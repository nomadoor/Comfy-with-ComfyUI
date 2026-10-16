---
layout: page.njk
lang: zh
section: basic-workflows
slug: esrgan
navId: esrgan
title: "ESRGAN"
created: 2026-02-06
updated: 2026-03-02
summary: "图像放大与面部修复"
seoTitle: "在 ComfyUI 中使用 ESRGAN：图像放大与面部修复"
seoDescription: "GAN 时代沿用至今的超分辨率模型 ESRGAN 在 ComfyUI 中的用法。介绍模型下载、放大与倍率调整，以及用 GFPGAN 只修复面部，附工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
tags: ["upscale-restoration"]
---

## 什么是 ESRGAN？

在扩散模型（Stable Diffusion 等）流行之前，图像生成的主角是 **GAN**。  
ESRGAN 就是从 GAN 时代沿用下来的放大模型。

ESRGAN 是一种把低分辨率图像放大成高分辨率的 **超分辨率 GAN**。  
它不是单纯地拉大，而是一边补画“看起来像那么回事的细节”，一边放大 2〜4 倍。

和用扩散模型放大相比，它非常轻量，所以现在仍然有很多用武之地。

## 下载模型

按用途分，模型多得数不过来，先试试下面这个吧。

**RealESRGAN**
- `ComfyUI Manager` → `Model Manager`
- 搜索 `RealESRGAN x4` 并 `Install`。

[OpenModelDB](https://openmodeldb.info/)
  - 这里分享着社区爱好者开发的模型。
  - 还有专门做清理（去噪、去瑕疵）的模型等等，光是逛逛就很有意思。

## 用 ESRGAN 放大

![](/media/basic-workflows/esrgan/legacy_gyazo_daebc07f85601b354c872a0a27f3fec1.png){media=image}

[](/workflows/basic-workflows/esrgan/realesrgan.json)

- 🟩 在 `Load Upscale Model` 节点中加载想用的模型。

### 调整倍率

大部分放大模型的名字里都带有 `x4` 这样的字样，比如 `RealESRGAN x4`。
这是倍率，用这个模型放大，结果会 **强制** 变成 4 倍。

但比如放进 Hires.fix 的工作流时，4 倍就太大了。
这种时候，就在后面加一步，把放大后的图像再缩小。

### 工作流

![](/media/basic-workflows/esrgan/legacy_gyazo_c05fc016293e3f1ae55b153cf1adaaae.png){media=image}

[](/workflows/basic-workflows/esrgan/realesrgan_x0_5.json)

- 🟨 修改 `scale_by` 的值就能调整倍率。

---

## 用 GFPGAN 只修复脸部

有一个 **脸部（Face）专用的修复 GAN**，叫 GFPGAN。  
它会检测被噪声弄崩的脸，按照“学过的好看的脸”去重画。

它有时会出现在 FaceSwap 节点等的后处理中，用来“顺手把脸修一修”。

具体用法这里不展开，只要记住 **“有一种专门修脸的收尾用 GAN”** 就够了。
