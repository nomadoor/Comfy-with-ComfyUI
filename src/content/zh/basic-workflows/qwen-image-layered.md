---
layout: page.njk
lang: zh
section: basic-workflows
slug: qwen-image-layered
navId: qwen-image-layered
title: "Qwen-Image-Layered"
summary: "将输入图像分解为复数的 RGBA 图层"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/bfc9ecbc781e79e29f0a9b1df0597bbb.png"
tags: []
---

## 什么是 Qwen-Image-Layered？

是将输入的图像，分解为任意枚数的 **图层** 的扩散模型。

是近来流行的图像编辑，但有时与指示无关的部分会变化。　　
既然那样，就像至今为止设计师做的那样进行图层分，只编辑对象的图层就可以了吧？是从这种动机诞生的任务呢。

是处理透过图像 (RGBA) 的首个通用手法也是应注目的点。  
如果是至今为止的手法，需要后处理，或只在解码时需要特殊处理，但采用了更直率的“作为 RGBA 图像处理”的做法。


---

## 模型的下载


* diffusion_models

  * [qwen_image_layered_fp8mixed.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image-Layered_ComfyUI/blob/main/split_files/diffusion_models/qwen_image_layered_fp8mixed.safetensors)（20.5 GB）
* text_encoders

  * [qwen_2.5_vl_7b_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/blob/main/split_files/text_encoders/qwen_2.5_vl_7b_fp8_scaled.safetensors)（9.38 GB）
* vae

  * [qwen_image_layered_vae.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image-Layered_ComfyUI/blob/main/split_files/vae/qwen_image_layered_vae.safetensors)（254 MB）
* gguf（任意）

  * [QuantStack/Qwen-Image-Layered-GGUF](https://huggingface.co/QuantStack/Qwen-Image-Layered-GGUF/tree/main)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── qwen_image_layered_fp8mixed.safetensors
    ├── 📂text_encoders/
    │   └── qwen_2.5_vl_7b_fp8_scaled.safetensors
    ├── 📂unet/
    │   └── Qwen_Image_Layered-XXXX.gguf          ← 仅在使用 gguf 的时候
    └── 📂vae/
        └── qwen_image_layered_vae.safetensors
```

---

## 工作流

![](https://gyazo.com/f395431169623129f7888c42b0fcadfb){gyazo=image}

[](/workflows/basic-workflows/qwen-image-layered/Qwen-Image-Layered.json)

* 输入图像的调整

  * 虽然可以变大到 1024px，但越增加图层数越容易变重，所以这里设定为 0.5M 像素。
* 🟩`Empty Qwen Image Layered Latent`

  * `layers`: 想分割的图层数
  * 这边也是越增加，内存和时间成本越高。

* 🟫`LatentCutToBatch`

  * 虽然认为很难明白在做什么，但请认为是实现方便的“整形”。
  * 这个模型如名那样将复数枚图像作为“图层”输出，但现在的 `VAE Decode` 无法很好地理解图层这个概念，所以转换为单纯的 N 张的批处理图像。

* 🟦再合成图像（任意）
  - 分为 2 个图层的情况，输出合计 3 张 RGBA 图像（元图像＋分解结果）。
  * 如果用 `ImageCompositeMasked` 持续重叠 2 张目以后的图像就能返回原来的 1 张图像。
    - 只是，这个节点因为只能处理 RGB 图像，需要转换为 RGB 图像 + 掩膜这种形式。
    - cf. [掩膜与 Alpha 通道](/zh/data-utilities/mask-alpha/)

  * 虽然认为很麻烦，但不限 ComfyUI，节点基础 UI 和图层系统相性不好😥


---

## 参考

* [Qwen Image Edit 2511 & Qwen Image Layered in ComfyUI](https://blog.comfy.org/p/qwen-image-edit-2511-and-qwen-image)
