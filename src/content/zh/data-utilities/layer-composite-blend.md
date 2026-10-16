---
layout: page.njk
lang: zh
section: data-utilities
slug: layer-composite-blend
navId: layer-composite-blend
title: "图层合成"
created: 2025-11-25
updated: 2026-03-02
summary: "关于图像的叠加、拼接与混合"
seoTitle: "在 ComfyUI 中叠加、拼接、混合图像"
seoDescription: "ComfyUI 中合成图像的方法：用 ImageCompositeMasked 叠加与居中放置、合成透明 PNG、用 Image Stitch 等横向拼接，以及用 Image Blend 混合。"

permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 合成图像

把两张图像叠在一起，或者横向并排。

在 Photoshop 里，只要把图像拖到上面就行，很简单；但在节点式的 ComfyUI 里要做到这一点，就得费一番功夫。

Inpainting 等处理中有时也需要它，不过和色调校正一样，干脆放弃、改用绘图软件也是个不错的选择。

---

## 叠加图像

就是单纯地把一张图像放在另一张图像上。

### ImageCompositeMasked 节点

用于图像叠加的基本节点。

![](/media/data-utilities/layer-composite-blend/legacy_gyazo_0f12d674fe3e1f6f30c2a06340464eb4.png){media=image}

[](/workflows/data-utilities/layer-composite-blend/imagecompositemasked.json)


- **destination**: 背景（底层）图像
- **source**: 前景（上层）图像
- **x / y**: 以左上角为基准的位置调整
- **resize_source**: 如果设为 `true`，`source` 图像会被拉伸至与 `destination` 相同的尺寸（※如果纵横比不同会变形）。

### 想居中放置时

![](/media/data-utilities/layer-composite-blend/legacy_gyazo_282ad8bae51d35eef6a4810780f3eb82.png){media=image}

[](/workflows/data-utilities/layer-composite-blend/imagecompositemasked_align_center.json)

用节点做 CSS 里熟悉的 `top: 50%; left: 50%; transform: translate(-50%, -50%);` 那种坐标计算，也能居中放置，但……嗯，说实话挺麻烦的(；・∀・)

---

## 叠加透明图像

这是在 ComfyUI 中做图层合成的关键。

如果想叠加“背景透明的图像”，仅仅连接图像是行不通的。

在 ComfyUI 中，需要换个思路，把它当作 **“用 source 图像替换被蒙版遮住的部分”** 这样的处理。

### 合成透明 PNG 的步骤

![](/media/data-utilities/layer-composite-blend/legacy_gyazo_cd53e89115c033f8a8ea175b72ca0aef.png){media=image}

[](/workflows/data-utilities/layer-composite-blend/imagecompositemasked_with_alpha.json)

使用的同样是 `ImageCompositeMasked` 节点，但要使用 **`mask` 输入**。

- 1. 读取透明图像，从 `MASK` 输出获得“透明部分的蒙版”。
- 2. 将这个蒙版连接到 `ImageCompositeMasked` 节点的 `mask` 输入。
- 3. 这样，**只有蒙版的部分会被替换为 source 图像（粉色的天空等）**。

### 应对尺寸不同导致的变形

如果将 `resize_source` 设为 `true`，source 图像会被强行拉伸到与 destination 图像相同的尺寸。

![](/media/data-utilities/layer-composite-blend/legacy_gyazo_f7ba12c0cf33e3e5dc8a9b5fb24cb0a6.png){media=image}

[](/workflows/data-utilities/layer-composite-blend/imagecompositemasked_with_crop_pad.json)

背景是纯色或图案的话倒无所谓，换成照片之类就会变形。
最简单的解决方案是，**预先将两张图像通过填充/裁剪调整为相同尺寸**。

- 🟪前景图像填充至背景图像的尺寸
- 🟨背景图像裁剪至前景图像的尺寸

### 实践示例：与分割（Segmentation）的组合

“只想改变裙子部分的颜色”这种情况也是同样的道理。

![](/media/data-utilities/layer-composite-blend/legacy_gyazo_c848c0f8e8d3ee590ba7ae09e8db7e68.png){media=image}

[](/workflows/data-utilities/layer-composite-blend/imagecompositemasked_segmentation.json)

- 1. 从输入图像通过分割制作“裙子的蒙版”。
- 2. 将 `EmptyImage`（单色图像）等连接到 `source`。
- 3. 将 `resize_source` 设为 `true`（纯色的话变形也没关系，所以 OK）。
- 4. 这样就只有裙子部分被涂上了指定的颜色。

一开始可能不太好找感觉，慢慢习惯就好。

---

## 排列图像 (拼接)

把图像横向或纵向拼接起来。想做对比图时很方便。

### Image Stitch 节点

简单的拼接节点。

![](/media/data-utilities/layer-composite-blend/legacy_gyazo_4ce9346ef269709f6456f0fcd5832a9c.png){media=image}

[](/workflows/data-utilities/layer-composite-blend/image_stitch.json)


### 🪢 Image Concatenate From Batch 节点

用多个 Stitch 节点也能排 3 张、4 张，但想把 Batch（多张一组）图像一次性排成网格时，用这个节点会更利落。

![](/media/data-utilities/layer-composite-blend/image_concatenate_from_batch.png){media=image}

[](/workflows/data-utilities/layer-composite-blend/image_concatenate_from_batch.json)


- 包含在 **[Kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)** 中。

---

## 混合图像 (Blend)

### Image Blend 节点

就像绘图软件中图层的“混合模式”一样。

![](/media/data-utilities/layer-composite-blend/legacy_gyazo_0c3dbad0a36a0399e7e12301a4b58638.png){media=image}

[](/workflows/data-utilities/layer-composite-blend/image_blend.json)

标准功能只能进行非常简单的混合，但可以通过 `blend_factor` 调整合成强度。
- `blend_factor`: 越接近 1.0，source 图像就越浓。

---

## EmptyImage 节点

只用来生成纯色图像的节点。

![](/media/data-utilities/layer-composite-blend/legacy_gyazo_c39404b4f19fe6a47565b326b7f0dc6d.png){media=image}

[](/workflows/data-utilities/layer-composite-blend/emptyimage.json)


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

把这样算出的值输入到 `color` 参数中。
