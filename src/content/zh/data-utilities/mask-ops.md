---
layout: page.njk
lang: zh
section: data-utilities
slug: mask-ops
navId: mask-ops
title: "蒙版操作"
created: 2025-11-25
updated: 2026-09-27
summary: "如何创建和编辑蒙版"
seoTitle: "ComfyUI 蒙版操作：创建、转换、编辑节点"
seoDescription: "在 ComfyUI 中创建、查看和编辑蒙版的方法。包括从图像或颜色创建蒙版、Create Solid Mask、蒙版编辑器、利用深度图，以及扩展、模糊、合成等编辑节点。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 查看蒙版

### MaskPreview 节点

相当于 `Preview Image` 节点的蒙版版。

![](/media/data-utilities/mask-ops/legacy_gyazo_a9dd4acbc14438fd7edfe85d3a14c6f3.png){media=image}

[](/workflows/data-utilities/mask-ops/maskpreview.json)


### Convert Mask to Image 节点

将蒙版转换为黑白的 `Image`。

![](/media/data-utilities/mask-ops/legacy_gyazo_28a1d381f0697c598db58f1e4c5648c6.png){media=image}

[](/workflows/data-utilities/mask-ops/convert_mask_to_image.json)


---

## 创建蒙版

### Load Image (as Mask) 节点

把图像文件直接作为蒙版数据读取。

![](/media/data-utilities/mask-ops/legacy_gyazo_49e0e05fc6511b8e37a16439afad6fed.png){media=image}

[](/workflows/data-utilities/mask-ops/load_image_as_mask.json)


- **channel**:
  - `red`/`green`/`blue`: 使用黑白图像时，选哪个都 OK。
  - `alpha`: 想把透明 PNG 的“透明部分”用作蒙版时选择。

### Convert Image to Mask 节点

将工作流内的 `IMAGE`（RGB 图像）转换为 `MASK`。
可以看作是把 `Load Image (as Mask)` 节点拆开后的样子。

![](/media/data-utilities/mask-ops/legacy_gyazo_aa0f427a4464958a9ebea27ac925294a.png){media=image}

[](/workflows/data-utilities/mask-ops/convert_image_to_mask.json)



### 🪢 Color To Mask 节点

把图像中的特定颜色（绿幕等）转换为蒙版。
也就是常说的抠像（色键）处理。

![](/media/data-utilities/mask-ops/legacy_gyazo_c38c27135c901d0db5927d493b5b8650.png){media=image}

[](/workflows/data-utilities/mask-ops/color_to_mask.json)

核心节点里其实也有功能类似的 `ImageColorToMask` 节点，但它不能调整阈值，不太好用，所以这里使用下面的自定义节点。

- **[Kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)**: `Color To Mask` 节点
- 用 RGB 指定目标颜色，并通过 `threshold`（容差）调整颜色误差。

### Create Solid Mask 节点

按指定尺寸创建矩形蒙版。
需要整片填满（或全空）的蒙版时使用。

![](/media/data-utilities/mask-ops/create_solid_mask.png){media=image}

[](/workflows/data-utilities/mask-ops/create_solid_mask.json)

### Mask Editor

这是一个可以在 ComfyUI 上把图像的特定部分画成蒙版（黑白图像）的工具。


![](/media/begin-with/mask-editor/legacy_gyazo_05a4f6930a6d074435ac29b77c97e82e.mp4){media=loop}

- **启动方法**: 选择 `Load Image` 节点等 → 点击 `Node Selection Toolbox` 的 `🌔` (Open Mask Editor)

用最左侧的标签切换功能。

- **蒙版绘制**: 用笔刷绘制蒙版。
- **填充**: 把手绘蒙版圈起来的范围填满。
- **自动选择**: 自动把与点击位置颜色相近的范围变成蒙版。

编辑完成后，点击顶部的 `Save` 即可应用。

详细的操作方法请参阅 [蒙版编辑器](/zh/begin-with/mask-editor/)。

---

## 利用深度图

### 🪢 Depth Map (深度图)

![](/media/data-utilities/mask-ops/legacy_gyazo_f2313d12383bc625fbf7f0c16cb8ba34.png){media=image}

[](/workflows/data-utilities/mask-ops/depthmapasmask.json)

深度图是黑白的渐变图像。也就是说，它可以直接拿来当蒙版用。
手机 App 里有事后给照片虚化背景的功能，基本上就是同样的原理。

深度图的生成方法请参阅 [ControlNet Preprocessor](/zh/basic-workflows/controlnet-prep/)。

---

## 编辑蒙版

### Resize Image/Mask 节点

[Resize Image/Mask 节点](/zh/data-utilities/resize-crop-pad/#resize-image-mask-节点) 中有详细介绍，请参阅那边。

![](/media/data-utilities/mask-ops/legacy_gyazo_fd9f3fab0b5ead47c84ce51f9ec3325a.png){media=image}

[](/workflows/data-utilities/mask-ops/resize_imagemask_match_size.json)

这里只简单说一下 `match size`。
缩放图像后，图像和蒙版的尺寸可能会对不上，导致两者无法对应。

使用 `match size`，就能按参考图像来缩放蒙版，在保持形状（位置关系）的同时让两者对齐。

### CropMask 节点

按指定范围裁剪蒙版。

![](/media/data-utilities/mask-ops/legacy_gyazo_aa6a319345beedb98ad7d873633df500.png){media=image}

[](/workflows/data-utilities/mask-ops/cropmask.json)


### GrowMask 节点

向外扩展蒙版的轮廓。把数值设为负数，也可以向内收缩。

![](/media/data-utilities/mask-ops/legacy_gyazo_395ae15fa99d4b099e80b006dc1c2d7b.png){media=image}

[](/workflows/data-utilities/mask-ops/growmask.json)


### 🪢 Gaussian Blur Mask 节点

对蒙版进行模糊。合成时想让边界自然过渡，这一步很重要。

![](/media/data-utilities/mask-ops/legacy_gyazo_447edb124127718662b35089effdcfa3.png){media=image}

[](/workflows/data-utilities/mask-ops/gaussian_blur_mask.json)

- 包含在 [ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack) 等中。

### InvertMask 节点

反转蒙版的黑白。

![](/media/data-utilities/mask-ops/legacy_gyazo_c8ca1c37aa1e2bf3dd4581028e5ab8b9.png){media=image}

[](/workflows/data-utilities/mask-ops/invertmask.json)

### ThresholdMask 节点

按指定的阈值，把带有中间值（渐变）的蒙版转换为二值（非白即黑）蒙版。

![](/media/data-utilities/mask-ops/legacy_gyazo_08a267a2826ab83e8ba872298c3974ff.png){media=image}

[](/workflows/data-utilities/mask-ops/thresholdmask.json)


### 🪢 Remap Mask Range 节点

调整渐变蒙版的作用方式。
和前面的“深度图”配合使用，可以改变焦点落在纵深的“哪个位置”，做出很有意思的效果。

![](/media/data-utilities/mask-ops/legacy_gyazo_fc933c9858f06298ea6524fc6ed0ca5b.mp4){media=loop}

[](/workflows/data-utilities/mask-ops/remap_mask_range.json)


---

## 合成蒙版

### MaskComposite 节点

用各种模式（加、减、乘等）合成两个蒙版。

![](/media/data-utilities/mask-ops/legacy_gyazo_564ef15662a33280a1ec6708104833ce.png){media=image}

[](/workflows/data-utilities/mask-ops/maskcomposite.json)


---

{% outputs "samples" %}
![](/media/data-utilities/mask-ops/legacy_gyazo_a4f60a62fa0aec62796ab908f16d9eaa.png){media=image} ![](/media/data-utilities/mask-ops/legacy_gyazo_20ca6b1922830c8864f755bc695d5c80.png){media=image} ![](/media/data-utilities/mask-ops/legacy_gyazo_727e5c4b9b80304adabccd3b36fbfcfe.png){media=image} ![](/media/data-utilities/mask-ops/legacy_gyazo_8c08c2615b3a741e711d3c11485d4d93.png){media=image} ![](/media/data-utilities/mask-ops/legacy_gyazo_96ab673a43e5b23bd666d1889360c981.png){media=image} ![](/media/data-utilities/mask-ops/legacy_gyazo_bb5bd997733867c5c07a986d5793c63a.png){media=image}
{% endoutputs %}
