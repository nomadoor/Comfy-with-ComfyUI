---
layout: page.njk
lang: zh
section: data-utilities
slug: batch-video
navId: batch-video
title: "Batch 与视频"
created: 2025-11-27
updated: 2026-03-02
summary: "汇总处理多张图像和视频帧的机制"
seoTitle: "ComfyUI 的 Batch 与视频：批量处理多张图像"
seoDescription: "ComfyUI 中批量处理多张图像或视频帧的 Batch 机制。讲解与 Queue、List 的区别，视频以 Batch 形式处理，OOM 注意事项，以及创建和操作 Batch 的节点。"

permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 什么是 Batch (批次)？

Batch（批次）是把多张图像**打包在一起同时处理**的机制。
List 是“逐张按顺序处理”，而 Batch 是**一次执行就让多张图像同时通过**。

Queue / List / Batch 的关系如下。

- **Queue**
  - 从外部依次执行同一个工作流
- **List**
  - 逐个按顺序处理多个输入（串行处理）
- **Batch**
  - 把多张图像打包成一组处理（并行处理）

---

## 视频就是 Batch

视频由一连串序列帧图像组成，所以在 ComfyUI 中是按 **视频 = IMAGE 的 Batch** 来处理的。

因此，常规的 Batch 操作节点可以直接用于视频；反过来，视频用的节点也几乎可以像普通的 Batch 操作一样使用。
不需要把视频和 Batch 分开来考虑。

---

## 进入 Batch 的图像必须尺寸相同

进入 Batch 的图像，**必须全部是相同尺寸**。
如果长宽不一致，会以第 1 张为基准，后续的图像会被自动裁剪。

![](/media/data-utilities/batch-video/legacy_gyazo_8e42e9262108b5d6065a330d16863352.png){media=image}

[](/workflows/data-utilities/batch-video/diff_list_batch.json)

> 上: List
> 下: Batch
> 因为需要统一形状，所以 Batch 中后面的图像被裁剪了。

---

## 并行处理的负载（注意 OOM）

由于 Batch 会同时处理多张图像，因此所需的内存量也会相应增加。
要是把 1 分钟的视频直接丢进 image2image，VRAM 根本不够，转眼就 **OOM（内存不足）** 了。

这种情况下，最好 **把 Batch 转换为 List**，逐张处理。

---

## 必要的自定义节点

基本的功能核心节点里都有，但要处理视频就有点吃力了。

- [ltdrdata/ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack)
- [ltdrdata/ComfyUI-Inspire-Pack](https://github.com/ltdrdata/ComfyUI-Inspire-Pack)
- [kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)
- [Kosinkadink/ComfyUI-VideoHelperSuite](https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite)

---

## 创建 Batch

### Batch Images 节点

将多个 `IMAGE` 汇总为 Batch。

![](/media/data-utilities/batch-video/legacy_gyazo_6663a7ba4d243f0afd79c41a9406a42d.mp4){media=loop}

[](/workflows/data-utilities/batch-video/batch_images.json)

- 每多连接一个，就会多出一个插槽，想合并多少张都可以。

### Load Image Batch From Dir (Inspire) / Load Images (Path) 节点

把文件夹里的图像合并成一个 Batch。

![](/media/data-utilities/batch-video/legacy_gyazo_fca9d0847d5c6a45aafa63c923b0e0d8.png){media=image}

[](/workflows/data-utilities/batch-video/load_image_batch_from_dir_load_image_path.json)

- Inspire 节点可以排序
- VHS 节点有“每 N 张输出”等附加功能

---

## 操作 Batch

### Reverse Image Batch 节点

颠倒 Batch 的顺序。
可以用来让视频倒放等。

![](/media/data-utilities/batch-video/legacy_gyazo_433f02c632e722abfe3174cd7eb23837.png){media=image}

[](/workflows/data-utilities/batch-video/reverse_image_batch.json)

### RepeatImageBatch 节点

将整个 Batch 重复指定次数。

### ImageBatchRepeatInterleaving 节点

将各帧重复指定次数。

![](/media/data-utilities/batch-video/repeatimagebatch_imagebatchrepeatinterleaving.png){media=image}

[](/workflows/data-utilities/batch-video/repeatimagebatch_imagebatchrepeatinterleaving.json)

> 上: RepeatImageBatch
> 下: ImageBatchRepeatInterleaving

---

## 从 Batch 中取出

### ImageFromBatch 节点

从 Batch 中取出任意位置的图像。

![](/media/data-utilities/batch-video/legacy_gyazo_6e48d34613f09e7dddfe3f40187f0de0.png){media=image}

[](/workflows/data-utilities/batch-video/imagefrombatch.json)

- `batch_index`: 取出位置（从 0 开始）
- `length`: Batch 的张数

### Get Image or Mask Range From Batch 节点

批量取出一定范围的图像（或蒙版）。

### Select Every Nth Image 节点（Video Helper Suite）

每隔 N 张获取帧。

![](/media/data-utilities/batch-video/legacy_gyazo_f5b845e89342f120cc994b999e390e11.png){media=image}

[](/workflows/data-utilities/batch-video/select_every_nth_image.json)

- `select_every_nth`: 取出间隔
- `skip_first_images`: 跳过开头的张数

---

## Batch ↔ List 的转换

读取视频或 Batch 后，如果想逐张处理，就转换为 List。

### Image Batch to Image List 节点

![](/media/data-utilities/batch-video/image_batch_to_image_list.png){media=image}

[](/workflows/data-utilities/batch-video/image_batch_to_image_list.json)

反之也有将 List 汇总为 Batch 的节点。

- `Image List to Image Batch` 节点
