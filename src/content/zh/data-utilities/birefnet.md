---
layout: page.njk
lang: zh
section: data-utilities
slug: birefnet
navId: birefnet
title: "BiRefNet"
created: 2026-05-30
updated: 2026-06-24
summary: "使用 BiRefNet 进行背景去除和蒙版生成"
seoTitle: "在 ComfyUI 中使用 BiRefNet：高精度去背景"
seoDescription: "在 ComfyUI 中使用 BiRefNet 精细抠图的方法，连头发、植物等细节也能干净分离。介绍模型下载，以及抠出前景和填充背景的工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/data-utilities/birefnet/legacy_gyazo_2e42734281821aa3f28153af9ba6a08e.png"
---

## 什么是 BiRefNet？

BiRefNet 是用于背景去除和抠图的模型。

严格来说，它是用于 **Dichotomous Image Segmentation (DIS)** 的模型，也就是把图像分成 **前景** 和 **背景** 两部分。

它不像 SAM 那样，通过“这个点”“这个框”“这个物体”来指定并生成蒙版，但抠图精度很高，即使是头发、植物这类细节复杂的对象，也能生成高质量的蒙版。

---

## 下载模型

- [birefnet.safetensors](https://huggingface.co/Comfy-Org/BiRefNet/blob/main/background_removal/birefnet.safetensors) (444 MB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂background_removal/
        └── birefnet.safetensors
```

---

## 工作流

### 切出前景

![](/media/data-utilities/birefnet/legacy_gyazo_57972a01d12b0d8e88ef705c18344651.png){media=image}

[](/workflows/data-utilities/birefnet/birefnet.json)

- 使用 `Load Background Removal Model` 读取 `birefnet.safetensors`。
- 将图像和模型输入 `Remove Background` 后，会输出用于背景去除的 `MASK`。
- 想要背景透明的图像时，使用 `Join Image with Alpha`。
  - 但如果直接使用这个蒙版，前景会变透明，所以中间要接一个 `Invert Mask`。

### 填充背景

上面的工作流把背景变成了透明，但作为图像生成或分析的预处理使用时，把背景填充成单色通常更容易处理。

![](/media/data-utilities/birefnet/legacy_gyazo_5d22ae3e905a8ccd3c1b8c63f615bb4e.png){media=image}

[](/workflows/data-utilities/birefnet/birefnet_fill.json)

- 将原图、反转后的蒙版、单色图像输入 `Image Composite Masked`。
- 只把被蒙版选中的背景部分替换为单色图像。
- 详情请参考 [图层合成](/zh/data-utilities/layer-composite-blend/)。
