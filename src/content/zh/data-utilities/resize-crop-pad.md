---
layout: page.njk
lang: zh
section: data-utilities
slug: resize-crop-pad
navId: resize-crop-pad
title: "调整大小、裁剪与填充"
created: 2025-11-25
updated: 2026-03-02
summary: "图像的缩放、裁剪与填充"
seoTitle: "在 ComfyUI 中调整图像大小、裁剪、填充"
seoDescription: "ComfyUI 中统一图像尺寸的调整大小、裁剪、填充节点的区别与用法。为适配模型的最佳分辨率、节省显存，附整理清晰易读的工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/data-utilities/resize-crop-pad/legacy_gyazo_02cf6bd2a573dc15dff4799c94b15a0d.png"
---

## 缩放与裁剪图像

把图像放大，或者裁成正方形……任务虽然简单，在图像生成中却非常重要。

- **模型的合适分辨率**: 每个模型都有“最能发挥性能的分辨率”。
- **节省 VRAM**: 不小心读入一张 4K 图像去处理，转眼就会“Out of memory”。
- **统一素材**: 在图像合成等场景中，需要把多个素材的尺寸统一起来。

这些操作出场频率很高，所以要好好理解各个节点的区别。

---

## 获取图像信息

### Get Image Size 节点

以数值形式输出图像的宽度 (width)、高度 (height) 和 Batch Size（张数）。

![](/media/data-utilities/resize-crop-pad/legacy_gyazo_ffb5c8bfea06d5ce1b15183cc70dc973.png){media=image}

[](/workflows/data-utilities/resize-crop-pad/get_image_size.json)

---

## 调整大小 (Resize)

### Resize Image/Mask 节点

这个节点可以切换多种缩放方式。
基本上，有它一个就能搞定大部分需要的处理。（顺便一提，蒙版也能缩放）

{% mediaRow img="/media/data-utilities/resize-crop-pad/legacy_gyazo_afa66ff808e05a40e363761184c668c1.png {media=image}", width=45, align="left" %}

**scale by multiplier**

按“倍率”放大或缩小宽高。

例如 `0.5` 就是宽高各缩小一半，`2.0` 就是宽高各放大 2 倍。

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/resize_imagemask_scale_by_multiplier.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="/media/data-utilities/resize-crop-pad/legacy_gyazo_4fc6f32dc60859a38a2cf3a125aa82bf.png {media=image}", width=45, align="left" %}

**scale dimensions**

强制改为指定的宽度、高度。

- `crop`
  - `disabled` : 纵横比不同时，图像会变形。
  - `center` : 以中心为准，把超出的部分裁掉（舍弃）。

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/resize_imagemask_scale_dimensions.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="/media/data-utilities/resize-crop-pad/legacy_gyazo_bdc737b190e9e45ebc6a55a1b155414e.png {media=image}", width=45, align="left" %}

**scale longer/shorter dimension**

只指定长边（longer）或短边（shorter），在保持纵横比的情况下缩放。

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/resize_imagemask_scale_longer_dimension.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="/media/data-utilities/resize-crop-pad/legacy_gyazo_adcd25f46b34298cea4a37a046b221bf.png {media=image}", width=45, align="left" %}

**scale width/height**

只指定宽度或高度中的一个，在保持纵横比的情况下缩放。

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/resize_imagemask_scale_width.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="/media/data-utilities/resize-crop-pad/resize_imagemask_scale_total_pixels.png {media=image}", width=45, align="left" %}

**scale total pixels**

在保持纵横比的情况下，缩放到指定的 **总像素数**。

按 `1024 * 1024 = 1.00MP` 计算。

| 目标尺寸 | 总像素数 | 设置值 |
| :--- | :--- | :--- |
| **512 × 512** | 262,144 | **0.25** |
| **768 × 768** | 589,824 | **0.56** |
| **1024 × 1024** | 1,048,576 | **1.00** |
| **1536 × 1536** | 2,359,296 | **2.25** |

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/resize_imagemask_scale_total_pixels.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="/media/data-utilities/resize-crop-pad/legacy_gyazo_e4398957f8190305364c6b9c12948c3c.png {media=image}", width=45, align="left" %}

**match size**

缩放到与参考图像相同的尺寸。

以前需要先获取参考图像的尺寸，再传给另一个节点，现在一个节点就搞定了。

- `match`: 连接想要作为基准的图像
- `crop`
  - `disabled` : 纵横比不同时，图像会变形。
  - `center`: 以中心为准，把超出的部分裁掉（舍弃）。

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/resize_imagemask_match_size.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="/media/data-utilities/resize-crop-pad/legacy_gyazo_28d95c2ef2e320c18761852f60f2a508.png {media=image}", width=45, align="left" %}

**scale to multiple**

把宽高缩放为 N 的倍数。

详细内容在 [为什么只能生成 8 的倍数的分辨率？](/zh/notes/why-multiple-of-8/) 中讲解：由于 VAE 的缘故，扩散模型无法直接处理不是特定倍数的分辨率。

很多时候某个节点会自动帮你调整，但遇到不是指定分辨率就会报错，或者希望输入和输出的像素“完全一致”时，就会用到它。

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/resize_imagemask_scale_to_multiple.json)
{% endmediaFooter %}

{% endmediaRow %}


### ImageScaleToMaxDimension 节点

在保持纵横比的情况下，把图像的 **长边** 缩放到设定的尺寸。
（例：无论竖图还是横图，都让较长的一边变成 1024px）

![](/media/data-utilities/resize-crop-pad/legacy_gyazo_42ffc7b0534face3e58fc7946b243ce0.png){media=image}

[](/workflows/data-utilities/resize-crop-pad/imagescaletomaxdimension.json)


---

## 填充 (Padding)

填充是指在图像周围添加空白（黑边等）来调整尺寸的处理。
有些节点可以把这块空白作为蒙版输出，因此常用作 Outpainting 的前期准备。

### ResizeAndPadImage 节点

按指定的分辨率缩放，不够的部分用填充补齐。

![](/media/data-utilities/resize-crop-pad/legacy_gyazo_633441a119959e98e0dca5cb765a53d8.png){media=image}

[](/workflows/data-utilities/resize-crop-pad/resizeandpadimage.json)

> [!NOTE]
> 这个节点无法把填充部分作为蒙版输出，所以几乎用不上。

### Pad Image for Outpainting 节点

在图像的上下左右添加指定像素数的空白。

![](/media/data-utilities/resize-crop-pad/legacy_gyazo_c6200467aad1b43edbc09b2ec4f3f2b0.png){media=image}

[](/workflows/data-utilities/resize-crop-pad/pad_image_for_outpainting.json)


空白部分会作为蒙版输出。

- **feathering**: 对空白与图像的边界做模糊。只影响蒙版。

---

## 裁剪及其他编辑操作

### ImageCrop 节点

指定 x, y 坐标和宽度、高度，把图像的一部分按矩形裁剪出来。

![](/media/data-utilities/resize-crop-pad/legacy_gyazo_1c996b2fa8f7213f05c524b16468181e.png){media=image}

[](/workflows/data-utilities/resize-crop-pad/imagecrop.json)


### ImageRotate 节点

将图像旋转 90度 / 180度 / 270度。

![](/media/data-utilities/resize-crop-pad/legacy_gyazo_8de36981f39e9c39ec1b6c4aa3f9a7ff.png){media=image}

[](/workflows/data-utilities/resize-crop-pad/imagerotate.json)


### ImageFlip 节点

把图像沿水平 / 垂直方向翻转。

![](/media/data-utilities/resize-crop-pad/legacy_gyazo_e0661734e160f918d9fc9080dda91240.png){media=image}

[](/workflows/data-utilities/resize-crop-pad/imageflip.json)


---

## Resize Image v2 节点

这是 **[kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)** 中的节点。

可以把它看作是把上面的缩放、裁剪、填充合到了一个节点里。

| 参数名 | 说明 |
| :--- | :--- |
| **width / height** | 目标宽度和高度（0 表示不变） |
| **upscale_method** | 缩放时的插值方法（nearest, bilinear 等） |
| **keep_proportion** | stretch, pad, crop, etc. |
| **pad_color** | 填充时的颜色（RGB） |
| **crop_position** | center, top, bottom, left, right |
| **divisible_by** | 缩放到该值倍数的分辨率（例：32, 64） |

> [!NOTE]
> 以前经常用它把宽高调成 N 的倍数，现在核心节点也能做到，就不怎么用了。


---

## 稍微进阶一点

把前面介绍的节点组合起来，做一些稍微复杂的图像处理吧。

### 把图像裁掉一半

![](/media/data-utilities/resize-crop-pad/legacy_gyazo_02cf6bd2a573dc15dff4799c94b15a0d.png){media=image}

[](/workflows/data-utilities/resize-crop-pad/crop_to_half_size.json)

- 获取图像尺寸
- 用 `Simple math` 节点算出宽度的一半
- 把算出的宽度输入 `ImageCrop` 节点，裁出一半
