---
layout: page.njk
lang: zh
section: data-utilities
slug: batch-video
navId: batch-video
title: "Batch 与视频"
summary: "汇总处理多张图像和视频帧的机制"

permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 什么是 Batch (批次)？

Batch（批次）是用于 **汇总并同时处理** 多张图像的机制。
与 List“逐张按顺序处理”不同，Batch 的区别在于 **一次执行就能让多张图像一次性通过**。

Queue / List / Batch 的关系如下。

- **Queue**
  - 从外部按顺序执行同一个 工作流
- **List**
  - 逐个按顺序处理多个输入（串行处理）
- **Batch**
  - 将多张图像汇总处理（并行处理）

---

## 视频就是 Batch

由于视频是由一系列连续编号的图像构成的，因此在 ComfyUI 中，**视频 = IMAGE 的 Batch** 来处理。

因此，常规的 Batch 操作节点可以直接用于视频，反之视频用节点也可以像一般的 Batch 操作一样使用。
没有必要区分视频和 Batch。

---

## 进入 Batch 的图像必须尺寸相同

进入 Batch 的图像，**必须全部是相同尺寸**。
如果长宽不一致，会以第 1 张为基准，后续的图像会被自动裁剪。

![](https://gyazo.com/8e42e9262108b5d6065a330d16863352){gyazo=image}

[](/workflows/data-utilities/batch-video/Diff_List-Batch.json)

> 上: List
> 下: Batch
> 因为需要统一形状，所以 Batch 中后面的图像被裁剪了。

---

## 并行处理的负载（OOM 的注意）

由于 Batch 会同时处理多张图像，因此所需的内存量也会相应增加。
如果直接把 1 分钟的视频放入 image2image，VRAM 会不足，瞬间就会 **OOM（内存不足）**。

这种情况下，最好 **转换为 Batch → List**，通过逐张处理来解决。

---

## 必要的自定义节点

虽然核心节点中已经准备了基本的，但想处理视频的话还是有点勉强。

- [ltdrdata/ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack)
- [ltdrdata/ComfyUI-Inspire-Pack](https://github.com/ltdrdata/ComfyUI-Inspire-Pack)
- [kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)
- [Kosinkadink/ComfyUI-VideoHelperSuite](https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite)

---

## 制作 Batch

### Batch Images 节点

将多个 `IMAGE` 汇总为 Batch。

![](https://gyazo.com/6663a7ba4d243f0afd79c41a9406a42d){gyazo=loop}

[](/workflows/data-utilities/batch-video/Batch_Images.json)

- 每次连接增加时都会添加插槽，可以汇总任意数量。

### Load Image Batch From Dir (Inspire) / Load Images (Path) 节点

将文件夹内的图像作为 Batch 汇总。

![](https://gyazo.com/fca9d0847d5c6a45aafa63c923b0e0d8){gyazo=image}

[](/workflows/data-utilities/batch-video/Load_Image_Batch_From_Dir-Load_Image_(Path).json)

- Inspire 节点可以排序
- VHS 节点有“每 N 张输出”等附加功能

---

## 操作 Batch

### Reverse Image Batch 节点

颠倒 Batch 的顺序。
可用于视频的倒放等。

![](https://gyazo.com/433f02c632e722abfe3174cd7eb23837){gyazo=image}

[](/workflows/data-utilities/batch-video/Reverse_Image_Batch.json)

### RepeatImageBatch 节点

将整个 Batch 重复指定次数。

### ImageBatchRepeatInterleaving 节点

将各帧重复指定次数。

![](https://gyazo.com/1384e9cff563f76a7b15fbd0f70f1aa5){gyazo=image}

[](/workflows/data-utilities/batch-video/RepeatImageBatch-ImageBatchRepeatInterleaving.json)

> 上: RepeatImageBatch
> 下: ImageBatchRepeatInterleaving

---

## 从 Batch 中取出

### ImageFromBatch 节点

从 Batch 中取出任意位置的图像。

![](https://gyazo.com/6e48d34613f09e7dddfe3f40187f0de0){gyazo=image}

[](/workflows/data-utilities/batch-video/ImageFromBatch.json)

- `batch_index`: 取出位置（从 0 开始）
- `length`: Batch 的张数

### Get Image or Mask Range From Batch 节点

批量取出一定范围的图像（或蒙版）。

### Select Every Nth Image 节点（Video Helper Suite）

每隔 N 张获取帧。

![](https://gyazo.com/f5b845e89342f120cc994b999e390e11){gyazo=image}

[](/workflows/data-utilities/batch-video/Select_Every_Nth_Image.json)

- `select_every_nth`: 取出间隔
- `skip_first_images`: 跳过开头的张数

---

## Batch ↔ List 的转换

读取视频或 Batch 后，如果想逐张处理，就转换为 List。

### Image Batch to Image List 节点

![](https://gyazo.com/1b63fa52915e6e923b0802907066d81c){gyazo=image}

[](/workflows/data-utilities/batch-video/Image_Batch_to_Image_List.json)

反之也有将 List 汇总为 Batch 的节点。

- `Image List to Image Batch` 节点
