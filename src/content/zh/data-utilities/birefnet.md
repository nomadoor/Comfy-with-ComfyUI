---
layout: page.njk
lang: zh
section: data-utilities
slug: birefnet
navId: birefnet
title: "BiRefNet"
created: 2026-05-30
updated: 2026-05-30
summary: "使用 BiRefNet 进行背景去除和蒙版生成"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## BiRefNet 是什么？

BiRefNet 是用于背景去除和抠图的模型。

正式来说，它是用于 **Dichotomous Image Segmentation (DIS)** 的模型，也就是把图像分成 **前景** 和 **背景** 两部分。

它并不是像 SAM 那样，通过“这个点”“这个框”“这个物体”来指定并生成蒙版。BiRefNet 更擅长从头发、植物等细节复杂的对象中，生成高质量的切出蒙版。

---

## 模型下载

- [birefnet.safetensors](https://huggingface.co/Comfy-Org/BiRefNet/blob/main/background_removal/birefnet.safetensors) (444 MB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂background_removal/
        └── birefnet.safetensors
```

---

## workflow

### 背景去除

![](https://gyazo.com/0c2c21a3dd7088141b67a66b44c80b3a){gyazo=image}

[](/workflows/data-utilities/birefnet/BiRefNet.json)

- 使用 `Load Background Removal Model` 读取 `birefnet.safetensors`。
- 将图像和模型输入 `Remove Background` 后，会输出用于背景去除的 `MASK`。
