---
layout: page.njk
lang: zh
section: basic-workflows
slug: qwen-image-layered
navId: qwen-image-layered
title: "Qwen-Image-Layered"
created: 2026-02-06
updated: 2026-03-02
summary: "把输入图像分解为多个 RGBA 图层"
seoTitle: "在 ComfyUI 中使用 Qwen-Image-Layered：把图像分解为图层"
seoDescription: "把输入图像分解为任意数量透明（RGBA）图层的扩散模型 Qwen-Image-Layered 在 ComfyUI 中的用法。讲解分层后只编辑部分内容的思路，以及模型下载和工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/qwen-image-layered/legacy_gyazo_bfc9ecbc781e79e29f0a9b1df0597bbb.png"
tags: []
---

## 什么是 Qwen-Image-Layered？

这是一个把输入图像分解成任意数量 **图层** 的扩散模型。

最近很流行的图像编辑，有时会把与指令无关的部分也改掉。　　
那干脆像设计师一直以来做的那样分好图层，只编辑目标图层不就好了？这个任务就是从这样的想法里诞生的。

另一个值得关注的点是，这是第一个能处理透明图像 (RGBA) 的通用方法。  
以往的方法要么需要后处理，要么只在解码时做特殊处理，而它采用了更直接的做法：“就当作 RGBA 图像来处理”。


---

## 下载模型


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

![](/media/basic-workflows/qwen-image-layered/legacy_gyazo_f395431169623129f7888c42b0fcadfb.png){media=image}

[](/workflows/basic-workflows/qwen-image-layered/qwen_image_layered.json)

* 缩放输入图像

  * 最大可以到 1024px，但图层数越多越容易变慢，所以这里设为 0.5M 像素。
* 🟩`Empty Qwen Image Layered Latent`

  * `layers`: 要分成的图层数
  * 这个值同样是越大，内存和时间成本越高。

* 🟫`LatentCutToBatch`

  * 可能不太容易看出它在做什么，就当作是为了实现方便而做的“整理”吧。
  * 这个模型正如其名，会把多张图像作为“图层”输出，但现在的 `VAE Decode` 无法很好地理解图层这个概念，所以要把它们转换成普通的 N 张批量图像。

* 🟦重新合成图像（可选）
  - 分成 2 个图层时，会输出共 3 张 RGBA 图像（原图＋分解结果）。
  * 用 `ImageCompositeMasked` 把第 2 张及之后的图像依次叠上去，就能还原成原来的 1 张图像。
    - 不过这个节点只能处理 RGB 图像，所以需要先转换成 RGB 图像 + 掩膜的形式。
    - cf. [掩膜与 Alpha 通道](/zh/data-utilities/mask-alpha/)

  * 可能会觉得很麻烦，但不只是 ComfyUI，基于节点的 UI 和图层系统本来就不太合得来😥


---

## 参考资料

* [Qwen Image Edit 2511 & Qwen Image Layered in ComfyUI](https://blog.comfy.org/p/qwen-image-edit-2511-and-qwen-image)
