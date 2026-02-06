---
layout: page.njk
lang: zh
section: data-utilities
slug: mask-ops
navId: mask-ops
title: "蒙版操作"
summary: "蒙版的制作方法和编辑方法"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 蒙版的确认

### MaskPreview 节点

`Preview Image` 节点的蒙版版本。

![](https://gyazo.com/a9dd4acbc14438fd7edfe85d3a14c6f3){gyazo=image}

[](/workflows/data-utilities/mask-ops/MaskPreview.json)


### Convert Mask to Image 节点

将蒙版转换为黑白的 `Image`。

![](https://gyazo.com/28a1d381f0697c598db58f1e4c5648c6){gyazo=image}

[](/workflows/data-utilities/mask-ops/Convert_Mask_to_Image.json)


---

## 蒙版的制作

### Load Image (as Mask) 节点

直接将图像文件作为蒙版数据读取。

![](https://gyazo.com/49e0e05fc6511b8e37a16439afad6fed){gyazo=image}

[](/workflows/data-utilities/mask-ops/Load_Image_(as_Mask).json)


- **channel**:
  - `red`/`green`/`blue`: 使用黑白图像时，选哪个都 OK。
  - `alpha`: 当想把透明 PNG 的“透明部分”作为蒙版使用时选择。

### Convert Image to Mask 节点

将工作流内的 `IMAGE`（RGB 图像）转换为 `MASK`。
就像是 `Load Image (as Mask)` 节点的分解版。

![](https://gyazo.com/aa0f427a4464958a9ebea27ac925294a){gyazo=image}

[](/workflows/data-utilities/mask-ops/Convert_Image_to_Mask.json)



### 🪢 Color To Mask 节点

将图像的特定颜色（绿幕等）转换为蒙版。
也就是所谓的色键处理。

![](https://gyazo.com/c38c27135c901d0db5927d493b5b8650){gyazo=image}

[](/workflows/data-utilities/mask-ops/Color_To_Mask.json)

虽然核心节点中也有具有类似功能的 `ImageColorToMask` 节点，但由于无法调整阈值，难以使用，因此建议使用以下的自定义节点。

- **[Kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)**: `Color To Mask` 节点
- 用 RGB 指定目标颜色，并通过 `threshold`（容差）调整颜色误差。

### SolidMask 节点

制作指定尺寸的矩形蒙版。
当需要全面填充（或空白）的蒙版时使用。

![](https://gyazo.com/088fbef6cdf9175a1a5bb0c08cfc9d8f){gyazo=image}

[](/workflows/data-utilities/mask-ops/SolidMask.json)

### Mask Editor

这是一个可以直接在 ComfyUI 上将图像的特定部分作为蒙版（黑白图像）进行绘制的工具。


![](https://gyazo.com/05a4f6930a6d074435ac29b77c97e82e){gyazo=loop}

- **启动方法**: 选择 `Load Image` 节点等 → 点击 `Node Selection Toolbox` 的 `🌔` (Open Mask Editor)

通过最左侧的标签切换功能。

- **蒙版绘制**: 用笔刷绘制蒙版。
- **填充**: 填充被手绘蒙版包围的范围。
- **自动选择**: 自动将与点击位置颜色相似的范围转化为蒙版。

编辑结束后，点击头部的 `Save` 应用。

详细的操作方法请参阅 [蒙版编辑器](/zh/begin-with/mask-editor/)。

---

## 深度图的活用

### 🪢 Depth Map (深度图)

![](https://i.gyazo.com/f2313d12383bc625fbf7f0c16cb8ba34.png){gyazo=image}

[](/workflows/data-utilities/mask-ops/DepthmapAsMask.json)

深度图是黑白的渐变图像。这意味着它可以直接转用作蒙版。
手机 APP 等能够进行后期虚化背景的加工，基本原理是一样的。

深度图的制作方法，请参阅 [ControlNet Preprocessor](/zh/basic-workflows/controlnet-prep/)。

---

## 蒙版的编辑

### Resize Image/Mask 节点

[Resize Image/Mask 节点](/zh/data-utilities/resize-crop-pad/#resize-image-mask-节点) 中有详细介绍，请参照那里。

![](https://gyazo.com/fd9f3fab0b5ead47c84ce51f9ec3325a){gyazo=image}

[](/workflows/data-utilities/mask-ops/Resize_ImageMask_match-size.json)

这里只提及 `match size`。
调整图像大小后，图像和蒙版的尺寸可能会产生偏差，导致无法对应。

通过使用 `match size`，可以配合参考图像调整蒙版的大小，从而在保持形状（位置关系）的同时进行对齐。

### CropMask 节点

在指定范围内裁剪蒙版。

![](https://gyazo.com/aa6a319345beedb98ad7d873633df500){gyazo=image}

[](/workflows/data-utilities/mask-ops/CropMask.json)


### GrowMask 节点

扩大蒙版的轮廓。将数值设为负数则可以缩小（变瘦）。

![](https://gyazo.com/395ae15fa99d4b099e80b006dc1c2d7b){gyazo=image}

[](/workflows/data-utilities/mask-ops/GrowMask.json)


### 🪢 Gaussian Blur Mask 节点

模糊蒙版。这对于使合成时的边界自然融合非常重要。

![](https://gyazo.com/447edb124127718662b35089effdcfa3){gyazo=image}

[](/workflows/data-utilities/mask-ops/Gaussian_Blur_Mask.json)

- 包含在 [ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack) 等中。

### InvertMask 节点

反转蒙版的黑白。

![](https://gyazo.com/c8ca1c37aa1e2bf3dd4581028e5ab8b9){gyazo=image}

[](/workflows/data-utilities/mask-ops/InvertMask.json)

### ThresholdMask 节点

以指定的阈值，将拥有中间值（渐变）的蒙版转换为二值（白或黑）蒙版。

![](https://gyazo.com/08a267a2826ab83e8ba872298c3974ff){gyazo=image}

[](/workflows/data-utilities/mask-ops/ThresholdMask.json)


### 🪢 Remap Mask Range 节点

调整渐变蒙版的作用方式。
通过与前述的“深度图”组合，可以更改聚焦于景深的“哪个位置”，从而获得有趣的效果。

![](https://i.gyazo.com/fc933c9858f06298ea6524fc6ed0ca5b.png){gyazo=image}

[](/workflows/data-utilities/mask-ops/Remap_Mask_Range.json)


---

## 蒙版的合成

### MaskComposite 节点

以各种模式（加法、减法、乘法等）合成两个蒙版。

![](https://gyazo.com/564ef15662a33280a1ec6708104833ce){gyazo=image}

[](/workflows/data-utilities/mask-ops/MaskComposite.json)


---

## 样本图像

![](https://gyazo.com/a4f60a62fa0aec62796ab908f16d9eaa){gyazo=image} ![](https://gyazo.com/20ca6b1922830c8864f755bc695d5c80){gyazo=image} ![](https://gyazo.com/727e5c4b9b80304adabccd3b36fbfcfe){gyazo=image} ![](https://gyazo.com/8c08c2615b3a741e711d3c11485d4d93){gyazo=image} ![](https://gyazo.com/96ab673a43e5b23bd666d1889360c981){gyazo=image} ![](https://gyazo.com/bb5bd997733867c5c07a986d5793c63a){gyazo=image}
