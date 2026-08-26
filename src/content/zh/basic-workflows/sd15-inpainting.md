---
layout: page.njk
lang: zh
section: basic-workflows
slug: sd15-inpainting
navId: sd15-inpainting
title: "inpainting"
created: 2025-12-07
updated: 2026-08-26
summary: "使用 inpainting 只编辑图像的一部分"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
tags: ["controlnet", "region-limited-generation"]
hero:
  image: ""
---

## 什么是 inpainting？

inpainting 是一种 **“只重绘图像的一部分”** 的方法。

删除不需要的内容、只重绘一部分、替换成其他内容…… 细分起来有很多用途，实现这些用途的方法也不止一种。

- [只对局部应用 image2image](#只对局部应用-image2image)
- [使用 inpainting 专用模型](#inpainting-专用模型)
- [使用 ControlNet](#controlnet-inpaint)
- [使用图像编辑模型](#图像编辑模型)
- etc.

---

## 只对局部应用 image2image

普通的 image2image 会重新生成整张图像。如果用掩膜限制生成范围，就能只重新生成其中一部分。

### 工作流

基础是平时使用的 [image2image](/zh/basic-workflows/sd15-image2image/) 工作流。在此基础上加入掩膜，指定需要重绘的位置。

![](https://gyazo.com/4fc7e54c5ac44fb4c09fc9911f6be06a){gyazo=image}

[](/workflows/basic-workflows/sd15-inpainting/SD1.5_inpainting_SetLatentNoiseMask.json)

- 🟥 使用 `VAE Encode` 节点将原图转换为 latent
- 🟩 使用 `Set Latent Noise Mask` 节点组合 latent 和掩膜

`Set Latent Noise Mask` 用来指定 KSampler 可以重绘的范围。

在内部，每个 step 都会先对整张图像执行 image2image，再将掩膜外恢复为原图的 latent。

最终看起来，就像只对掩膜部分执行了 image2image。

> 关于掩膜的制作和编辑方法，请参阅[掩膜操作](/zh/data-utilities/mask-ops/)和[使用 AI 生成掩膜](/zh/data-utilities/ai-mask-generation/)。

### 【问题】提高 denoise 后会和周围不协调

它的基本性质与普通 image2image 相同。

`denoise` 越高，自由度越大，但也会逐渐忘记原图。

试着将上面工作流中的 `denoise` 设为 `1.00`。

![哇，恐怖图……(；・∀・)](https://gyazo.com/b18eb39eee9f53b669edb098a219bd24){gyazo=image}

如果对整张图像执行 image2image，即使变化很大，也可以有它自己的乐趣。

但是，局部 image2image 会保留掩膜外的原图。这样一来，掩膜内外可能失去一致性。

如果只是稍微改变花朵的形状，这种方法也没问题。但较大的变化就比较困难。

要把红花变成蓝色，或把花替换成乐器，就需要提高 `denoise`。可一旦提高，编辑部分又可能和周围格格不入……

那么，这种时候该怎么办呢？🤔

---

## inpainting 专用模型

一种答案是使用 inpainting 专用模型。

在前面的方法中，掩膜只用来把 image2image 限制在局部。**模型本身并不知道哪里被掩膜了。**

inpainting 模型还会接收到“要重绘哪里”和“该区域外有什么内容”。

它会生成一张用灰色遮住掩膜区域的图像，再将其传给模型。这样模型看不到重绘前的内容，只能根据周围信息来填补该区域。

### 下载模型

- [stable-diffusion-v1-5/sd-v1-5-inpainting.ckpt](https://huggingface.co/stable-diffusion-v1-5/stable-diffusion-inpainting/blob/main/sd-v1-5-inpainting.ckpt)
```
📂ComfyUI/
  └── 📂models/
      └── 📂checkpoints/
          └── sd-v1-5-inpainting.ckpt
```

### 工作流

![](https://gyazo.com/1f6954026bfda799259cfd948da779a3){gyazo=image}

[](/workflows/basic-workflows/sd15-inpainting/sd-v1-5-inpainting.json)

- 🟪 加载 inpainting 模型。
- 🟩 将 `VAE Encode`、`Set Latent Noise Mask` 替换为 `InpaintModelConditioning` 节点。

`InpaintModelConditioning` 有两个作用。

1. 与 `Set Latent Noise Mask` 相同，只对局部执行 image2image
2. 将掩膜和用灰色遮住掩膜区域的原图传给模型

`noise_mask` 用来决定是否启用第一个作用。

- `true`
  - 与 `Set Latent Noise Mask` 相同，只对掩膜部分执行 image2image。
  - 通常使用这个设置即可。
- `false`
  - 模型仍会接收到掩膜和用灰色遮住掩膜区域的原图，但 image2image 会重绘整张图像，而不只重绘掩膜部分。
  - 极少数模型在 `true` 时会出现异常，遇到这种情况可以试试这个设置。

上面的工作流将 `denoise` 设为 `1.00`，但并没有生成另一个女性，而是根据周围内容重新绘制了她的头发。

这说明模型知道该编辑哪里，也知道绘制时该参考什么。

---

## ControlNet inpaint

让模型知道掩膜范围的方法，并不只有 inpainting 专用模型。

其中一种就是 **ControlNet inpaint**。

> 关于 [ControlNet](/zh/basic-workflows/sd15-controlnet)，将在其他页面中说明。

### 自定义节点

- [Fannovel16/comfyui_controlnet_aux](https://github.com/Fannovel16/comfyui_controlnet_aux)

### 下载 ControlNet 模型

- [comfyanonymous/control_v11p_sd15_inpaint_fp16.safetensors](https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/blob/main/control_v11p_sd15_inpaint_fp16.safetensors)
- ```
  📂ComfyUI/
    └── 📂models/
        └── 📂controlnet/
            └── control_v11p_sd15_inpaint_fp16.safetensors
  ```

### 工作流

![](https://gyazo.com/ae3fe8d999343135c6ac995b67a165e7){gyazo=image}

[](/workflows/basic-workflows/sd15-inpainting/SD1.5_ControlNet_inpaint.json)

- 加载任意 SD1.5 checkpoint（＋LoRA）
- 🟨 将图像和掩膜输入 `Inpaint Preprocessor`，转换为 ControlNet 使用的图像
  - 从外观上看，掩膜区域被涂成了黑色。
- 🟩 将 ControlNet 模型、图像和 VAE 输入 `Apply ControlNet` 节点
- 🟥 使用 `Set Latent Noise Mask`，将重绘范围限制在掩膜区域

虽然使用的技术不同，但所做的事情和 inpainting 模型相同：将“需要填补的位置”和“周围有什么内容”传给模型。

---

## 其他 inpainting 方法

这里不作介绍，但 Stable Diffusion 1.5 之后的模型还有其他各种方法。

- Fooocus Inpaint
- FLUX.1 Fill
- etc.

---

## 图像编辑模型

如今，要介绍这个主题就不能不提图像编辑模型。

图像编辑模型可以按照“删除男性的帽子”这样的提示词指定对象，也可以输入一张用红线圈出区域的图像，并给出“在这里添加一只猫”的指示。甚至不需要专用的掩膜。

严格来说，它们通常不会放在 inpainting 的语境中讨论。不过，如果从**能够改变图像的一部分**这一点来看，能做到的事情是一样的。

### FLUX.2 [klein]

作为一个有代表性的图像编辑模型，我们来看看 [FLUX.2 \[klein\]](/zh/basic-workflows/flux-2-klein/)。

![](https://gyazo.com/e55ff686078115488cef6406f60b9370){gyazo=image}

[](/workflows/basic-workflows/flux-2-klein/9b/Flux.2-klein-9b_image-edit.json)

这个工作流只需要输入图像和 `remove the man` 提示词，就能从图像中删除男性。
