---
layout: page.njk
lang: zh
section: basic-workflows
slug: detailer
navId: detailer
title: "Detailer"
created: 2026-02-06
updated: 2026-03-02
summary: "只切出小脸和细部进行 inpaint 的机制"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/5904f9e96c234cd6bec18b10af263838.png"
tags: ["upscale-restoration"]
---

## 什么是 Detailer？

![](https://gyazo.com/eb9c93e225419a1fe7574451d7cd94e1){gyazo=image}

Stable Diffusion 1.5 最擅长的，大概是 512〜768px 前后的图像。  
以这个分辨率画全身时，每 1 人能用于“脸”的像素数只有 30〜50px 程度。

也有分辨率的问题，但从画面整体来看脸太小了，  
对 AI 来说也变成了过于“精细的作业”。和人类一样，AI 也不擅长精细的作业。

那样的话索性，只剪切脸的部分，把重画的东西贴回原图像不就好了吗？ 出现了这样的想法。

这个 **“剪切 → 扩大 → inpaint → 贴回原图像”** 这一连串的处理，叫做 **Detailer**。

---

## 为什么需要 Detailer

也有“将图像整体放大并 inpaint 不就好了吗？”的想法。

但是，inpainting 的计算量，不由掩膜的大小而是由 **原图像的尺寸** 决定。  
有 4K 的图像时，即使想只重涂脸，也会发生 4K 整体份的计算，非常无效率。

Detailer 因为只剪切想 inpaint 的周边领域所以没有浪费。

---

## 自定义节点

- [lquesada/ComfyUI-Inpaint-CropAndStitch](https://github.com/lquesada/ComfyUI-Inpaint-CropAndStitch)

> 一般来说，使用 Impact Pack 中包含的 Detailer 节点。  
> 这边因为连物体检测在内都能自动化所以多功能，但因为独自参数多很难，所以另外处理。

---

## 掩膜和裁剪领域

确认掩膜和裁剪领域的区别吧。

![](https://gyazo.com/e52ea814ccd051de4c939bb7e90eb941){gyazo=image}

- 掩膜：真的想改写的部分（脸本身 等）
- 裁剪领域：将掩膜和 BBOX 稍微扩大的“作业用画布”

Detailer 是，仅在这个裁剪领域进行的 inpainting。

---

## ✂️ Inpaint Crop

![](https://gyazo.com/52c85301e868fe14f7bb729508206078){gyazo=image}

[](/workflows/basic-workflows/detailer/Inpaint_Crop_(Improved).json)

看工作流就明白，传递 **掩膜＋原图像** 的话，会自动制作以掩膜为基础足了稍微留白的裁剪领域，并只将那部分调整为指定尺寸。


虽然有相当多的参数，但基本上只要看下面的就足够了。

| 参数名           | 作用・意思                                                                 |
|------------------------|----------------------------------------------------------------------------|
| `mask_fill_holes`      | 自动填埋掩膜内的小孔（涂剩）                               |
| `mask_expand_pixels`   | 将掩膜的边界向外侧扩大指定像素份                                |
| `mask_invert`          | 反转掩膜             |
| `mask_blend_pixels`    | 模糊掩膜边界。                                  |
| 🔥`context_from_mask_extend_factor` | 以倍率指定从掩膜制作裁剪领域时的“留白量”        |
| 🔥`output_target_width`  | 裁剪后的输出宽（像素）。指定脸用画布的横尺寸等    |
| 🔥`output_target_height` | 裁剪后的输出高（像素）。指定脸用画布的纵尺寸等  |
| `output_padding`       | 根据需要，为了让分辨率成为这个值的倍数追加留白             |

---

## ✂️ Inpaint Stitch (Improved)

![](https://gyazo.com/c210a482208c8932e252b770b8b856bf){gyazo=image}

[](/workflows/basic-workflows/detailer/Inpaint_Stitch_(Improved).json)

`✂️ Inpaint Stitch (Improved)` 节点，将弄过的裁剪图像返回原来的位置。

只将掩膜的部分覆盖到原图像。


---

## 用 Inpaint Crop and Stitch 手工作业 Detailer

那么，立刻做做看 Detailer 吧。  
虽这么说，但也只是组装进 [inpainting](/zh/basic-workflows/sd15-inpainting/) 的工作流而已。

![](https://gyazo.com/4246aded675f5267c9b5685486791390){gyazo=image}

[](/workflows/basic-workflows/detailer/Detailer_Inpaint_Crop.json)

- 🟩 请根据基础模型调整 `output_target_width/height`。
  - 这次因为是 SD1.5 所以是 512px
- 🟥 虽然与 Detailer 没有直接关系，但 Inpaint Crop 会输出“模糊了边界的掩膜”，所以与能活用那个的 [Differential Diffusion](/zh/basic-workflows/differential-diffusion/) 相性相当好。

---

## 组合物体检测

自动制作脸的掩膜，试着稍微自动化吧。

![](https://gyazo.com/d65f393b285ec6c84a17a6a6ef438f14){gyazo=image}

[](/workflows/basic-workflows/detailer/Detailer_Inpaint_Crop_SAM3.json)

- 🟦 使用 SAM 3 制作脸的掩膜。

Detailer 的基础只有这些，所以我想已经足够能运用自如了。  
只是，如果想汇总检测映在图像的复数人物，并一口气处理……的话就需要使用 ImpactPack。

→ [Detailer ImpactPack (WIP)](还没)

---

## 样本图像

![](https://gyazo.com/7564534ad31facc3d0c91bc36606c930){gyazo=image}
