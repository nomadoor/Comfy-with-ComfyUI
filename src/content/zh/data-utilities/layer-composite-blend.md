---
layout: page.njk
lang: zh
section: data-utilities
slug: layer-composite-blend
navId: layer-composite-blend
title: "层合成"
summary: "关于图像的叠加、结合、混合"

permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 图像的合成

将两张图像重叠，或者横向并列。

如果是 Photoshop，只要把图像拖动到上面就可以完成，但在节点式的 ComfyUI 中想要做这个却要费一番功夫。

虽然在 Inpainting 处理等场景中也有必要，但也和色调校正一样，放弃挣扎使用绘图工具也是一个不错的选择。

---

## 叠加图像

单纯地将一张图像放置在另一张图像上的操作。

### ImageCompositeMasked 节点

用于图像叠加的基本节点。

![](https://gyazo.com/0f12d674fe3e1f6f30c2a06340464eb4){gyazo=image}

[](/workflows/data-utilities/layer-composite-blend/ImageCompositeMasked.json)


- **destination**: 背景（底层）图像
- **source**: 前景（上层）图像
- **x / y**: 以左上角为基准的位置调整
- **resize_source**: 如果设为 `true`，`source` 图像会被拉伸至与 `destination` 相同的尺寸（※如果纵横比不同会变形）。

### 想要配置在中央时

![](https://gyazo.com/282ad8bae51d35eef6a4810780f3eb82){gyazo=image}

[](/workflows/data-utilities/layer-composite-blend/ImageCompositeMasked-Align_center.json)

虽然用节点进行 CSS 中熟悉的 `top: 50%; left: 50%; transform: translate(-50%, -50%);` 这种坐标计算可以实现居中配置，但……老实说确实有点麻烦。

---

## 叠加透明图像

这是 ComfyUI 中层合成的核心。

如果想叠加“背景透明的图像”，仅仅连接图像是行不通的。

在 ComfyUI 中，必须重新将其思考为 **“用 source 图像替换被蒙版遮罩的部分”** 这一处理。

### 合成透明 PNG 的步骤

![](https://gyazo.com/cd53e89115c033f8a8ea175b72ca0aef){gyazo=image}

[](/workflows/data-utilities/layer-composite-blend/ImageCompositeMasked-with_Alpha.json)

使用的同样是 `ImageCompositeMasked` 节点，但要使用 **`mask` 输入**。

- 1. 读取透明图像，从 `MASK` 输出获得“透明部分的蒙版”。
- 2. 将这个蒙版连接到 `ImageCompositeMasked` 节点的 `mask` 输入。
- 3. 这样，**只有蒙版的部分会被替换为 source 图像（粉色的天空等）**。

### 尺寸不同导致的变形对策

如果将 `resize_source` 设为 `true`，source 图像会被强行拉伸到与 destination 图像相同的尺寸。

![](https://gyazo.com/f7ba12c0cf33e3e5dc8a9b5fb24cb0a6){gyazo=image}

[](/workflows/data-utilities/layer-composite-blend/ImageCompositeMasked-with_crop-pad.json)

如果背景是单色或图案倒还好，如果是照片等情况就会变形。
最简单的解决方案是，**预先将两张图像通过填充/裁剪调整为相同尺寸**。

- 🟪前景图像填充至背景图像的尺寸
- 🟨背景图像裁剪至前景图像的尺寸

### 实践例：与分割（Segmentation）的组合

“只想改变裙子部分的颜色”这种情况也是同样的道理。

![](https://i.gyazo.com/c848c0f8e8d3ee590ba7ae09e8db7e68.png){gyazo=image}

[](/workflows/data-utilities/layer-composite-blend/ImageCompositeMasked_Segmentation.json)

- 1. 从输入图像通过分割制作“裙子的蒙版”。
- 2. 将 `EmptyImage`（单色图像）等连接到 `source`。
- 3. 将 `resize_source` 设为 `true`（单色的话即使变形也无所谓所以 OK）。
- 4. 这样就只有裙子部分被涂上了指定的颜色。

起初可能很难掌握这种感觉，慢慢习惯吧。

---

## 排列图像 (结合)

将图像横向或纵向结合。在想制作对比图像时很方便。

### Image Stitch 节点

简单的结合节点。

![](https://i.gyazo.com/4ce9346ef269709f6456f0fcd5832a9c.png){gyazo=image}

[](/workflows/data-utilities/layer-composite-blend/Image_Stitch.json)


### 🪢 Image Concatenate From Batch 节点

如果使用多个 Stitch 节点可以排列 3 张、4 张，但如果想将 Batch（多张一组）图像整理成网格状排列，使用这个节点可以更智能地处理。

![](https://i.gyazo.com/18d0555fd1d0bd01ead60b3992662cb0.png){gyazo=image}

[](/workflows/data-utilities/layer-composite-blend/Image_Concatenate_From_Batch.json)


- 包含在 **[Kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)** 中。

---

## 混合图像 (Blend)

### Image Blend 节点

就像绘图软件中图层的“混合模式”一样。

![](https://i.gyazo.com/0c3dbad0a36a0399e7e12301a4b58638.png){gyazo=image}

[](/workflows/data-utilities/layer-composite-blend/Image_Blend.json)

标准功能只能进行非常简单的混合，但可以通过 `blend_factor` 调整合成强度。
- `blend_factor`: 越接近 1.0，source 图像就越浓。

---

## EmptyImage 节点

只是制作单色图像的节点。

![](https://gyazo.com/c39404b4f19fe6a47565b326b7f0dc6d){gyazo=image}

[](/workflows/data-utilities/layer-composite-blend/EmptyImage.json)


### 颜色的设置方法

颜色设置有点复杂，不是使用熟悉的 16 进制或 RGB，而是通过 **24 位颜色（10 进制）** 进行设置。

计算公式如下：

```
Decimal Value = (Red × 65536) + (Green × 256) + Blue
```

**例：** 想要制作粉色（RGB: 255, 192, 203）时

```
255 × 65536 + 192 × 256 + 203 = 16,761,035
```

将像这样计算出的值输入到 `color` 参数中。
