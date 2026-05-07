---
layout: page.njk
lang: zh
section: data-utilities
slug: ai-mask-generation
navId: ai-mask-generation
title: "使用 AI 生成蒙版"
created: 2026-02-06
updated: 2026-05-07
summary: "关于抠图、分割、物体检测"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/499c4756e1b2adb1424f9cab9829806b.png"
---

## 使用 AI 生成蒙版

在 inpainting 等场景中，经常需要制作蒙版。但每次都手动绘制，或者提前准备蒙版图像，非常麻烦。最重要的是，这样无法自动化。

不过，单纯说一句“把这部分做成蒙版”，并不一定就能轻松得到干净的蒙版。  
需要根据目的，区分使用几种 AI 技术。

- **物体检测 (Detection)**
  - 根据文本等指令，用 **边界框 (Bounding Box)** 检测图像中的物体。
- **抠图 (Matting)**
  - 用带有渐变的蒙版（Alpha Matte）分隔 **前景** 和 **背景**（在 ComfyUI 中也经常会变成二值蒙版）。
- **分割 (Segmentation)**
  - 用黑白蒙版（二值蒙版）提取 **“物体的形状”**。

---

## 必要的自定义节点

> 截至 2026 年 5 月，如果想指定对象并生成蒙版，先从 ComfyUI core 中实现的 [SAM 3 / 3.1](/zh/data-utilities/sam3/) 开始就可以了。  
> 下面介绍的技术，是 SAM 3 出现以前经常使用的东西。现在从零开始使用它们的理由已经不多了。

- **[1038lab/ComfyUI-RMBG](https://github.com/1038lab/ComfyUI-RMBG)**
  - 从抠图到分割，支持多种技术，使用也很方便。
  - 截至 2026 年 5 月，更新有些停滞，根据环境可能无法顺利运行。
- **[ltdrdata/ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack)**
- **[ltdrdata/ComfyUI-Impact-Subpack](https://github.com/ltdrdata/ComfyUI-Impact-Subpack)**
  - 主要用于 Detailer 相关作业，单纯作为蒙版生成使用时稍微有点特殊。
- **[kijai/ComfyUI-Florence2](https://github.com/kijai/ComfyUI-Florence2)**
  - 运行名为 Florence2 的 MLLM。
- **[kijai/ComfyUI-segment-anything-2](https://github.com/kijai/ComfyUI-segment-anything-2)**
  - 运行 SAM 2 分割模型，通常与 Florence2 搭配使用。

---

## 物体检测 (Detection)

![](https://gyazo.com/1a10dcd7dcf8f72eee275a3d8484f882){gyazo=image}

顾名思义，它可以确定图像内特定物体的位置，并输出称为 BBOX 的矩形范围。

不同技术在准确性、通用性、速度方面各有特点。

### YOLO 系

YOLO 是以实时检测物体为目的的超高速检测技术。

基本上，它会针对想要检测的物体类型分别制作模型（如人脸专用、手专用等）。如果没有对应模型，就需要自己制作；如果想同时检测多种类型，也不太适合。

![](https://gyazo.com/e8b4e05d42db0b613aee4467a8dca633){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/Simple_Detector_(SEGS)-YOLO_face.json)

适用于需要高速处理的情况，例如检测对象已经固定为人脸时。

- **模型的获取方法**: `ComfyUI Manager` -> `Install Models` -> 搜索 YOLO。除了人脸模型外，也能找到各种 YOLO 模型。
- 这里不贴链接，但在 Civitai 上搜索 Adetailer，也可以找到专注于 NSFW 的模型。

### Grounding DINO

Grounding DINO 会检测用文本指定的物体，并输出 BBOX。

与 YOLO 不同，可以用 “white dog”、“red car” 等任意文本指定物体，因此使用方便，也可以同时检测多个物体。

这里没有单独运行 Grounding DINO 的节点，下面会介绍与分割组合使用的 workflow。

### VLM / MLLM

拥有看图能力的 LLM，就是 VLM / MLLM。

它们可以进行图像描述生成等各种任务，其中也有可以进行物体检测的模型。

**Florence-2** 是比较早期出现的模型，但现在仍然是多用途且方便的视觉语言模型之一。

![](https://gyazo.com/eac97524bcdcb395cdd5172c3694da41){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/Florence2Run.json)

- **模型**: 感觉差别并不大，但可以试试不同模型。模型会自动下载。
- **提示词**: 描述想要检测的物体。
- **task**: caption_to_phrase_grounding
- **output_mask_select**: 检测到多个物体时，选择使用哪个输出（留空则全部输出）。

适合想用复杂语句指定对象，或想利用 LLM 理解能力的情况（不过速度较慢）。

---

## 抠图 (Matting)

以“背景去除”的名义提供的服务或功能，内部基本就是这个。

它无法指定某个对象，而“背景”究竟指哪里，也交给 AI 判断。因此，适合单纯去除背景，或者前景和背景边界清晰的情况。

### BiRefNet

大概是最常用的模型。速度和性能都没什么问题，抠图的话可以先用它。

![](https://gyazo.com/5ce4bac5b8c8dc13fbbb0468c44bf752){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/BiRefNet_Remove_Background_(RMBG).json)

- 将 `Background` 设为 `Alpha`，会输出带 Alpha 通道的透明图像。
- **注意**: 此时的输出是 **RGBA**，因此在 image2image 等 workflow 中使用时可能会出错。参考 [蒙版与 Alpha 通道](/zh/data-utilities/mask-alpha/)。

根据用途还有一些派生模型，例如擅长动漫图像的 ToonOut 等。可以试试看。

---

## 分割 (Segmentation)

### SAM (Segment Anything Model)

SAM 是目前最有名的分割模型。

它很了解“物体的形状”。如果用点或框指定照片中的汽车等对象，它就能准确找到轮廓，并生成蒙版。

![](https://gyazo.com/ae3a00df59eb97f8612b700ff90aac3b){gyazo=image}

这是点击点来分割指定对象的功能，但实际使用中通常会与物体检测组合使用。

- 1. 右键点击图像类节点 -> `Open in SAM Detector`
- 2. 左键点击想要提取的物体（右键点击想要排除的范围）
- 3. 点击 `Detect` 生成蒙版

> SAM 目前仍在持续开发中，有初期版 / SAM 2 / SAM 2.1 / SAM 3。
>
> SAM 3 不仅支持点和 BBOX 指定，也支持文本指令。

### 服装与人体部位分割

用于分割“上半身”、“裙子”、“脸”、“头发”等特定部位。

![](https://gyazo.com/3221f2c1bfc5b2a0f4db328c820f5235){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/Clothing_Segmentation_(RMBG).json)

- 选择想要分割的类别。

以前在换装等任务中经常使用，但现在物体检测 + 分割可能通用性更高，性能也更好。

---

## 实践例

通过组合物体检测、分割和抠图，可以生成更高精度的蒙版。

> 再说一次，首先使用单一模型就能完成蒙版生成的 [SAM 3 / 3.1](/zh/data-utilities/sam3/) 就可以了。

### YOLO × SAM

![](https://gyazo.com/2c1fb7ed9c7fcc6242e48b9e6e405c27){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/YOLO_face-SAM.json)

高速人脸检测（YOLO）与初期 SAM 的组合。

### Grounding DINO × SAM

![](https://gyazo.com/c7b4ed29a8dae26fb9c666b137091ab4){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/Grounding_DINO_HQ-SAM.json)

Grounding DINO 与 SAM 改良版 HQ-SAM 的组合。

它可以用文本指定对象，同时生成高精度蒙版，因此曾是最常用的组合之一。

### Florence2 × SAM2

![](https://gyazo.com/677607c761c38defde753681398d6e1f){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/Florence2_SAM2.1.json)

Florence2 与 SAM2.1 的组合。

如果是人或动物等容易理解的对象，很多方法都可以。但如果想指定“戴墨镜的男人”、“躺在树下的猫”这类复杂条件，这种 LLM 系模型就会发挥作用。

### SAM 3 × BiRefNet

![](https://gyazo.com/82c4c2d947a3ea9c98b46e05a05d542f){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/SAM3_BiRefNet.json)

分割本来是为了区分对象，并不是为了精细抠图。

相对地，抠图可以处理头发这种细小部分，也可以处理玻璃这类半透明物体。

把它们组合起来，就可以利用两者的能力。
