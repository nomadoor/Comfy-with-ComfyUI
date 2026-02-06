---
layout: page.njk
lang: zh
section: basic-workflows
slug: sd15-inpainting
navId: sd15-inpainting
title: "inpainting"
summary: "用 inpainting 只编辑图像的一部分"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
tags: ["controlnet", "region-limited-generation"]
hero:
  image: ""
---

## 什么是 inpainting？

inpainting 是 **“只重绘图像的一部分”** 的手法。  
但是，其实看里面可以分为以下 2 种模式。

- 类型 A: **只对掩膜（Mask）部分做 image2image** 
- 类型 B: **一边看周围的信息，一边自然地填补掩膜部分**

一般来说，这俩不加区别，但因此经常看到混乱的初学者。  
先作为别的东西分开考虑吧。

> 掩膜的制作方法和掩膜编辑的详情，请参照别页的 [掩膜操作](/zh/data-utilities/mask-ops/)、[使用 AI 生成掩膜](/zh/data-utilities/ai-mask-generation/)。

---

## 类型 A: 只对掩膜部分 image2image

是只对掩盖的部分，以和通常的 image2image 同样的调子重绘的方法。  
适合想要稍微改变面部表情、改变画风、稍微修正细微部分的时候。

### 工作流

在这个工作流中，使用 `SetLatentNoiseMask` 节点指定“在哪里添加噪声”。

![](https://gyazo.com/4fc7e54c5ac44fb4c09fc9911f6be06a){gyazo=image}

[](/workflows/basic-workflows/sd15-inpainting/SD1.5_inpainting_SetLatentNoiseMask.json)

- 基础是 image2image 的工作流。
- 🟥 在 `VAE Encode` 节点将原图转换为 latent
- 🟩 在 `Set Latent Noise Mask` 节点组合 latent 和掩膜

### 这种手法的问题点

试着将上面的工作流的 `denoise` 设为 `1.00` 看看。

![](https://gyazo.com/b18eb39eee9f53b669edb098a219bd24){gyazo=image}

哇哦，生成了恐怖图像 (；・∀・)  

这种手法，终究是“只把掩膜部分作为画布的 image2image”。  
提高 `denoise` 的话，在掩膜部分会变成几乎 **接近 text2image 的举动**。

因为在提示词里写了“红色的爆炸头女性”，所以和原图无关，新画出了女性呢。

有没有一边看整体氛围，一边画被掩盖部分的方法呢？

---

## 类型 B: 一边看周围一边填补掩膜

在看了图像整体的基础上，“为了和周围自然连接而重绘掩膜部分”的类型。  

刚才，只是“用掩膜物理地剪切 image2image 的适用范围”。  
在这个类型中，将掩膜区域本身作为一种 [Conditioning](/zh/ai-capabilities/conditioning/) 对待，直接将“希望能只重绘这个范围”这样的条件传递给模型。

在此之上，虽然有各种实现方法，但在 SD1.5 只要掌握以下 2 个系统就足够了。

- **使用 inpainting 专用模型**
- **用 ControlNet inpaint 让普通模型支持 inpaint**

---

## inpainting 模型

是面向“一边看周围一边填补”的任务调整了 SD1.5 的 Checkpoint。

### 模型的下载

- [stable-diffusion-v1-5/sd-v1-5-inpainting.ckpt](https://huggingface.co/stable-diffusion-v1-5/stable-diffusion-inpainting/blob/main/sd-v1-5-inpainting.ckpt)
- ```
  📂ComfyUI/
    └── 📂models/
        └── 📂checkpoints/
            └── sd-v1-5-inpainting.ckpt
  ```

### 工作流

![](https://gyazo.com/1f6954026bfda799259cfd948da779a3){gyazo=image}

[](/workflows/basic-workflows/sd15-inpainting/sd-v1-5-inpainting.json)

- 🟪 加载 inpainting 模型。
* 🟩 将 `VAE Encode`、`Set Latent Noise Mask` 替换为 `InpaintModelConditioning` 节点。
  * 输入的参数几乎相同。

- 只有 `noise_mask` 参数需要稍微注意。
  * `true`
    - 与 `Set Latent Noise Mask` 时同样，强制只重绘掩膜内部。通常这个设置没问题。
  * `false`
    - 在一部分模型中，设为 `true` 会破损。作为那时的退路请尝试 `false`。

在上面的例子中，即使将 `denoise` 设为 `1.00`，也能明白为了让图像整体看起来自然而重绘了女性的头发。
与类型 A 不同，变成了“一边看与周围的整合性一边填补掩膜部分”的举动呢。

---

## ControlNet inpaint

inpainting 模型的缺点是，必须使用 inpainting 模型。
有时也想把微调了 Stable Diffusion 1.5 的模型，直接用于 inpainting 吧。

那时，**ControlNet inpaint** 会派上用场。

> 关于 [ControlNet](/zh/basic-workflows/sd15-controlnet)，将在另外的页面进行说明。

### 自定义节点

- [Fannovel16/comfyui_controlnet_aux](https://github.com/Fannovel16/comfyui_controlnet_aux)

### ControlNet 模型的下载

* [comfyanonymous/control_v11p_sd15_inpaint_fp16.safetensors](https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/blob/main/control_v11p_sd15_inpaint_fp16.safetensors)
* ```
  📂ComfyUI/
    └── 📂models/
        └── 📂controlnet/
            └── control_v11p_sd15_inpaint_fp16.safetensors
  ```

### 工作流

![](https://gyazo.com/ae3fe8d999343135c6ac995b67a165e7){gyazo=image}

[](/workflows/basic-workflows/sd15-inpainting/SD1.5_ControlNet_inpaint.json)

* 加载喜欢的 SD1.5 checkpoint（＋LoRA）
* 🟨 将图像和掩膜输入 `Inpaint Preprocessor`，转换为 ControlNet 用的图像
  * 实际上，只是把掩膜部分涂黑了。
* 🟩 向 `Apply ControlNet` 节点输入 ControlNet 模型・图像・VAE
* 🟥 组入在上面做的使用了 `Set Latent Noise Mask` 的 inpainting

---

## 连结到 SDXL / Flux 等

本页面是专注于 SD1.5 的，但此外也存在几个 inpainting 手段。

- Fooocus inpaint（面向 SDXL 的 inpaint 模型）
- Flux.fill（Flux 系的填充功能）
- Lanpaint（图像编辑・inpaint 系工具）

这些预定另行处理。
