---
layout: page.njk
lang: zh
section: basic-workflows
slug: esrgan
navId: esrgan
title: "ESRGAN"
summary: "图像的放大和面部修正"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: ""
tags: ["upscale-restoration"]
---

## 什么是 ESRGAN？

在扩散模型（Stable Diffusion 等）流行之前，图像生成的主角是 **GAN**。  
ESRGAN 是从那个 GAN 世代继承下来的放大用的模型。

ESRGAN 是用于将低分辨率的图像放大为高分辨率的 **超分辨率 GAN**。  
不是单纯的扩大，而是一边补画“像那样的细节”一边扩大为 2〜4 倍。

与扩散模型的放大相比非常轻量，所以现在活跃的机会也很多呢。

## 模型的下载

根据用途有数量繁多的模型，暂且试着使用以下的模型吧。

**RealESRGAN**
- `ComfyUI Manager` → `Model Manager`
- 搜索 `RealESRGAN x4` 并 `Install`。

[OpenModelDB](https://openmodeldb.info/)
  - 共有着由有志者开发的模型。
  - 也有专注于清理的模型等，光是看着也很开心呢。

## 用 ESRGAN 放大

![](https://gyazo.com/daebc07f85601b354c872a0a27f3fec1){gyazo=image}

[](/workflows/basic-workflows/esrgan/RealESRGAN.json)

- 🟩 在 `Load Upscale Model` 节点读取任意的模型。

### 修正倍率

像 `RealESRGAN x4` 那样大体上放大器都有 `x4` 这样的文字。
这是倍率，使用这个模型放大的话会 **强制地** 变为 4 倍。

但是，例如组装进 Hires.fix 的工作流时等 4 倍太大了。
这种时候追加缩小放大器变大了的图像的处理。

### 工作流

![](https://gyazo.com/c05fc016293e3f1ae55b153cf1adaaae){gyazo=image}

[](/workflows/basic-workflows/esrgan/RealESRGAN_x0.5.json)

- 🟨 变更 `scale_by` 的值可以调整倍率。

---

## 用 GFPGAN 只修正脸

作为 **脸（Face）专用的复原 GAN** 有名为 GFPGAN 的东西。  
是检测因噪声崩溃的脸，靠拢“学习过的漂亮的脸”重画类型的模型。

有时会在 FaceSwap 节点等的后处理以“顺便只整理脸”的用途登场。

详细的使用方法这里不处理，只要记住 **“有专门修脸的收尾用 GAN”** 的程度就足够了。
