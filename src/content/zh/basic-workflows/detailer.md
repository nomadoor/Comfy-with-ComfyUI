---
layout: page.njk
lang: zh
section: basic-workflows
slug: detailer
navId: detailer
title: "Detailer"
created: 2026-02-06
updated: 2026-03-02
summary: "只裁出小脸或细节部分来 inpaint 的机制"
seoTitle: "ComfyUI 的 Detailer：重绘小脸和细节"
seoDescription: "只裁出崩坏的小脸或细节并重绘的 Detailer 原理。介绍用 Inpaint Crop / Stitch 手动搭建 Detailer，以及结合物体检测自动化的方法，附工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/detailer/legacy_gyazo_5904f9e96c234cd6bec18b10af263838.png"
tags: ["upscale-restoration"]
---

## 什么是 Detailer？

![](/media/basic-workflows/detailer/legacy_gyazo_eb9c93e225419a1fe7574451d7cd94e1.png){media=image}

Stable Diffusion 1.5 最擅长的，是 512〜768px 左右的图像。  
用这个分辨率画全身时，每个人的“脸”只能分到大约 30〜50px。

除了分辨率的问题，脸在整个画面里也实在太小了，  
对 AI 来说成了太过“精细的活儿”。和人一样，AI 也不擅长精细的活儿。

既然这样，干脆只把脸裁出来，重画之后再贴回原图不就好了？于是就有了这个思路。

这一连串 **“裁剪 → 放大 → inpaint → 贴回原图”** 的处理，就叫 **Detailer**。

---

## 为什么需要 Detailer

也有人会想：“把整张图放大再 inpaint 不就行了？”

但是，inpainting 的计算量不是由蒙版大小决定的，而是由 **原图尺寸** 决定的。  
面对一张 4K 图像，哪怕只想重画脸，也要做整张 4K 的计算，效率非常低。

Detailer 只裁出需要 inpaint 的周边区域，所以没有浪费。

---

## 自定义节点

- [lquesada/ComfyUI-Inpaint-CropAndStitch](https://github.com/lquesada/ComfyUI-Inpaint-CropAndStitch)

> [!NOTE]
> 一般会用 Impact Pack 里的 Detailer 节点。  
> 它连物体检测都能自动化，功能更多，但独有的参数很多、比较难，所以另开一篇再讲。

---

## 蒙版和裁剪区域

先弄清楚蒙版和裁剪区域的区别。

![](/media/basic-workflows/detailer/legacy_gyazo_e52ea814ccd051de4c939bb7e90eb941.png){media=image}

- 蒙版：真正想重画的部分（比如脸本身）
- 裁剪区域：把蒙版或 BBOX 稍微扩大一圈的“工作画布”

Detailer 就是只在这个裁剪区域内进行的 inpainting。

---

## ✂️ Inpaint Crop

![](/media/basic-workflows/detailer/legacy_gyazo_52c85301e868fe14f7bb729508206078.png){media=image}

[](/workflows/basic-workflows/detailer/inpaint_crop_improved.json)

从工作流可以看出，只要传入 **蒙版＋原图**，它就会根据蒙版自动加一点留白，生成裁剪区域，并只把这部分缩放到指定尺寸。


参数相当多，但基本上只看下面这些就够了。

| 参数名           | 作用                                                                 |
|------------------------|----------------------------------------------------------------------------|
| `mask_fill_holes`      | 自动填补蒙版内的小洞（漏涂的地方）                               |
| `mask_expand_pixels`   | 把蒙版边界向外扩大指定的像素数                                |
| `mask_invert`          | 反转蒙版             |
| `mask_blend_pixels`    | 模糊蒙版边界。                                  |
| 🔥`context_from_mask_extend_factor` | 用倍率指定从蒙版生成裁剪区域时的“留白量”        |
| 🔥`output_target_width`  | 裁剪后的输出宽度（像素），比如脸部画布的宽度    |
| 🔥`output_target_height` | 裁剪后的输出高度（像素），比如脸部画布的高度  |
| `output_padding`       | 必要时追加留白，让分辨率成为这个值的倍数             |

---

## ✂️ Inpaint Stitch (Improved)

![](/media/basic-workflows/detailer/legacy_gyazo_c210a482208c8932e252b770b8b856bf.png){media=image}

[](/workflows/basic-workflows/detailer/inpaint_stitch_improved.json)

`✂️ Inpaint Stitch (Improved)` 节点会把处理过的裁剪图像放回原来的位置。

只有蒙版部分会覆盖到原图上。


---

## 用 Inpaint Crop and Stitch 手动做 Detailer

那么，马上来试试 Detailer 吧。  
话虽如此，其实只是把它加进 [inpainting](/zh/basic-workflows/sd15-inpainting/) 的工作流而已。

![](/media/basic-workflows/detailer/legacy_gyazo_4246aded675f5267c9b5685486791390.png){media=image}

[](/workflows/basic-workflows/detailer/detailer_inpaint_crop.json)

- 🟩 请根据基础模型调整 `output_target_width/height`。
  - 这次用的是 SD1.5，所以是 512px
- 🟥 这和 Detailer 没有直接关系，不过 Inpaint Crop 会输出“边界已模糊的蒙版”，所以和能利用这种蒙版的 [Differential Diffusion](/zh/basic-workflows/differential-diffusion/) 非常搭。

---

## 结合物体检测

让脸部蒙版自动生成，稍微自动化一下。

![](/media/basic-workflows/detailer/legacy_gyazo_d65f393b285ec6c84a17a6a6ef438f14.png){media=image}

[](/workflows/basic-workflows/detailer/detailer_inpaint_crop_sam3.json)

- 🟦 用 SAM 3 生成脸部蒙版。

Detailer 的基础就这些，我想你已经能用得很顺手了。  
不过，如果想把图里的多个人物一起检测出来、一次性处理……那就需要用 ImpactPack 了。

→ [Detailer ImpactPack (WIP)](还没)

---

{% outputs "samples" %}
![](/media/basic-workflows/detailer/legacy_gyazo_7564534ad31facc3d0c91bc36606c930.jpg){media=image}
{% endoutputs %}
