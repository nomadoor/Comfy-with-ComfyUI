---
layout: page.njk
lang: zh
section: data-utilities
slug: resize-crop-pad
navId: resize-crop-pad
title: "调整大小、裁剪与填充"
created: 2026-02-06
updated: 2026-03-02
summary: "关于图像的调整大小、裁剪、填充"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/02cf6bd2a573dc15dff4799c94b15a0d.png"
---

## 图像的调整大小与裁剪

将图像尺寸放大，或者裁剪成正方形……虽然是单纯的作业，但在图像生成中却是非常重要的工作。

- **模型的适宜分辨率**: 模型有“最能发挥性能的分辨率”。
- **VRAM 的节约**: 如果不小心读取了 4K 图像进行处理，瞬间就会变成“Out of memory”。
- **素材的统一**: 在图像合成等操作中，需要统一多个素材的尺寸。

因为是经常登场的作业，所以要好好理解各个节点的区别。

---

## 图像信息的获取

### Get Image Size 节点

将图像的宽度 (width) 和高度 (height)、以及 Batch Size（张数）作为数值输出。

![](https://gyazo.com/ffb5c8bfea06d5ce1b15183cc70dc973){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/Get_Image_Size.json)

---

## 调整大小 (Resize)

### Resize Image/Mask 节点

这是一个可以切换使用多种调整大小方法的节点。
基本上，这一个节点就能涵盖大部分所需的处理。（顺便说一下，蒙版也可以调整大小）

{% mediaRow img="https://gyazo.com/afa66ff808e05a40e363761184c668c1 {gyazo=image}", width=45, align="left" %}

**scale by multiplier**

按“倍率”对长宽进行放大/缩小。

例如 `0.5` 就是长宽各减半，`2.0` 就是长宽各 2 倍。

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/Resize_ImageMask_scale-by-multiplier.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/4fc6f32dc60859a38a2cf3a125aa82bf {gyazo=image}", width=45, align="left" %}

**scale dimensions**

强制变更为指定的宽度/高度分辨率。

- `crop`
  - `disabled` : 如果纵横比不同，图像会变形。
  - `center` : 保持中心，将超出的部分裁剪（舍弃）。

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/Resize_ImageMask_scale-dimensions.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/bdc737b190e9e45ebc6a55a1b155414e {gyazo=image}", width=45, align="left" %}

**scale longer/shorter dimension**

只指定长边（longer）或短边（shorter），保持纵横比进行调整大小。

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/Resize_ImageMask_scale-longer-dimension.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/adcd25f46b34298cea4a37a046b221bf {gyazo=image}", width=45, align="left" %}

**scale width/height**

只指定宽度或高度的其中一方，保持纵横比进行调整大小。

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/Resize_ImageMask_scale-width.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/13116851f0f749d7f4f5e350fb474f5e {gyazo=image}", width=45, align="left" %}

**scale total pixels**

按照指定的 **总像素数**，保持纵横比进行调整大小。

`1024 * 1024 = 1.00MP` 进行计算。

| 目标尺寸 | 总像素数 | 设定值 |
| :--- | :--- | :--- |
| **512 × 512** | 262,144 | **0.25** |
| **768 × 768** | 589,824 | **0.56** |
| **1024 × 1024** | 1,048,576 | **1.00** |
| **1536 × 1536** | 2,359,296 | **2.25** |

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/Resize_ImageMask_scale-total-pixels.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/e4398957f8190305364c6b9c12948c3c {gyazo=image}", width=45, align="left" %}

**match size**

调整为与参考图像相同的尺寸。

以前需要先获取参考图像的尺寸，再将其传递给其他节点，现在这就合二为一了。

- `match`: 连接想要作为基准的图像
- `crop`
  - `disabled` : 如果纵横比不同，图像会变形。
  - `center`: 保持中心，将超出的部分裁剪（舍弃）。

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/Resize_ImageMask_match-size.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/28d95c2ef2e320c18761852f60f2a508 {gyazo=image}", width=45, align="left" %}

**scale to multiple**

调整大小使长宽成为 N 的倍数。

详细内容会在 [为什么只能生成 8 的倍数的分辨率？](/zh/notes/why-multiple-of-8/) 中讲解，简而言之，由于 VAE 的原因，扩散模型无法直接处理不是特定倍数的分辨率。

虽然基本上很多时候会在某个节点自动调整，但在必须是指定分辨率否则报错的情况下，或者希望输入和输出的像素“完全一致”的情况下，会使用这个功能。

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/Resize_ImageMask_scale-to-multiple.json)
{% endmediaFooter %}

{% endmediaRow %}


### ImageScaleToMaxDimension 节点

以图像的 **长边** 为设定的尺寸，保持纵横比进行调整大小。
（例：无论是纵向长图还是横向长图，都让长的那一边变成 1024px）

![](https://i.gyazo.com/42ffc7b0534face3e58fc7946b243ce0.png){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/ImageScaleToMaxDimension.json)


---

## 填充 (Padding)

填充是指在图像周围添加空白（黑边等），以调整尺寸的处理。
根据节点不同，可以将这个空白部分作为蒙版输出，因此可以作为进行 Outpainting 时的准备工作。

### ResizeAndPadImage 节点

调整为指定的分辨率，不足的部分用填充来填补。

![](https://gyazo.com/633441a119959e98e0dca5cb765a53d8){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/ResizeAndPadImage.json)

> 该节点无法将填充部分作为蒙版输出，因此几乎没有使用的场合。

### Pad Image for Outpainting 节点

在图像的上下左右，添加指定像素数的空白。

![](https://gyazo.com/c6200467aad1b43edbc09b2ec4f3f2b0){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/Pad_Image_for_Outpainting.json)


空白部分会作为蒙版输出。

- **feathering**: 模糊空白与图像的边界。只影响蒙版。

---

## 裁剪及其他编辑操作

### ImageCrop 节点

指定 x, y 坐标和宽度、高度，将图像的一部分以矩形进行裁剪。

![](https://i.gyazo.com/1c996b2fa8f7213f05c524b16468181e.png){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/ImageCrop.json)


### ImageRotate 节点

将图像旋转 90度 / 180度 / 270度。

![](https://gyazo.com/8de36981f39e9c39ec1b6c4aa3f9a7ff){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/ImageRotate.json)


### ImageFlip 节点

将图像在水平 / 垂直方向进行翻转。

![](https://gyazo.com/e0661734e160f918d9fc9080dda91240){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/ImageFlip.json)


---

## Resize Image v2 节点

这是包含在 **[kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)** 中的节点。

它就像是把上述的调整大小、裁剪、填充汇总到了一个节点里。

| 参数名 | 说明 |
| :--- | :--- |
| **width / height** | 目标的宽度和高度（0 则不变更） |
| **upscale_method** | 调整大小时的插值方法（nearest, bilinear 等） |
| **keep_proportion** | stretch, pad, crop, etc. |
| **pad_color** | 填充时的颜色（RGB） |
| **crop_position** | center, top, bottom, left, right |
| **divisible_by** | 会被调整为这个值的倍数的分辨率（例：32, 64） |

> 以前经常用于将长宽调整为 N 的倍数，但现在核心节点也能支持了，所以就不怎么用了。


---

## 一点应用

让我们组合目前为止介绍的节点，进行稍微复杂的图像加工。

### 将图像裁剪为一半

![](https://gyazo.com/02cf6bd2a573dc15dff4799c94b15a0d){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/Crop_to_half_size.json)

- 获取图像尺寸
- 用 `Simple math` 节点计算宽度的一半长度
- 将计算出的宽度输入到 `ImageCrop` 节点，进行半幅裁剪
