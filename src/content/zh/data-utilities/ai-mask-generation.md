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

在 Inpainting 等操作中经常需要制作蒙版，但每次都手动绘制或准备蒙版图像非常辛苦。最重要的是无法自动化。

因此，让我们利用各种 AI 来自动生成蒙版吧。

> 如果只是想为静态图像制作蒙版，可以先从 [SAM 3 / 3.1](/zh/data-utilities/sam3/) 开始。  
> 它可以用文本指定对象，并把物体检测和分割放在同一流程里处理。

- **物体检测 (Object Detection)**
  - 根据文本等指令，用 **边界框 (Bounding Box)** 检测图像中的物体。
- **抠图 (Matting)**
  - 用带有渐变的蒙版（Alpha Matte）分隔 **前景** 和 **背景**（在 ComfyUI 中也经常变成二值蒙版）。
- **分割 (Segmentation)**
  - 用黑白蒙版（二值蒙版）提取 **“物体的形状”**。

---

## 必要的自定义节点

实现这些功能的技术种类繁多，相应的自定义节点也各种各样，但暂时只要有以下这些就足够了。

- **[1038lab/ComfyUI-RMBG](https://github.com/1038lab/ComfyUI-RMBG)**
  - 从抠图到分割，支持多种技术，使用也很方便。
- **[ltdrdata/ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack)**
- **[ltdrdata/ComfyUI-Impact-Subpack](https://github.com/ltdrdata/ComfyUI-Impact-Subpack)**
  - 用于进行 Detailer 作业，单纯作为蒙版生成使用的话稍微有点特殊。
- **[kijai/ComfyUI-Florence2](https://github.com/kijai/ComfyUI-Florence2)**
  - 运行名为 Florence2 的 MLLM。
- **[kijai/ComfyUI-segment-anything-2](https://github.com/kijai/ComfyUI-segment-anything-2)**
  - 运行名为 SAM 2 的分割模型，通常与 Florence2 搭配使用。

---

## 物体检测 (Detection)

![](https://gyazo.com/1a10dcd7dcf8f72eee275a3d8484f882){gyazo=image}

顾名思义，它可以确定图像内特定物体的位置，并输出称为 BBOX 的矩形范围。

存在各种在准确性、通用性、速度方面各具特色的技术。

### YOLO 系

以实时检测物体为目的的超高速检测技术。

基本上，它针对每种想要检测的物体类型创建一个模型（如人脸专用、手专用等），因此如果没有模型就需要自己制作，不适合想要检测多种类型的情况。

![](https://gyazo.com/e8b4e05d42db0b613aee4467a8dca633){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/Simple_Detector_(SEGS)-YOLO_face.json)

适用于需要高速处理的情况（如人脸检测等已确定特定对象的情况）。

- **模型的获取方法**: `ComfyUI Manager` → `Install Models` → 搜索 YOLO，除了人脸外还能找到各种 YOLO 模型。
- 这里不贴链接，但在 Civitai 上搜索 Adetailer 也可以找到专注于 NSFW 的模型。

### Grounding DINO

检测用文本指定的物体，并输出 BBOX。

与 YOLO 不同，可以用“white dog”、“red car”等任意文本指定物体，因此使用方便，同时也可以检测多个物体。

由于没有单独运行 Grounding DINO 的节点，下面会介绍与分割组合使用的 工作流。

### Florence-2

Florence-2 是能像文章一样理解图像的视觉语言模型。

虽然可以生成标题等各种内容，但其中之一就是物体检测。

![](https://gyazo.com/eac97524bcdcb395cdd5172c3694da41){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/Florence2Run.json)

- **模型**: 虽然感觉差别不大，但请尝试各种模型。模型会自动下载。
- **提示词**: 描述想要检测的物体。
- **task**: caption_to_phrase_grounding
- **output_mask_select**: 当检测到多个物体时，选择使用哪个输出（如果为空则全部输出）。

适用于想要用复杂的文章表现来指定对象，或想要利用 LLM 的理解力的情况（但速度较慢）。

---

## 抠图 (Matting)

以“背景去除”的名义提供的服务或功能的内核基本就是这个。

它无法指定对象，而“背景”究竟指哪里？也是交给 AI 判断的，因此适合单纯想要去除背景，或者前景和背景的边界清晰的情况。

### BiRefNet

大概是使用最多的模型。速度和性能都无可挑剔，暂时用这个就行了。

![](https://gyazo.com/5ce4bac5b8c8dc13fbbb0468c44bf752){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/BiRefNet_Remove_Background_(RMBG).json)


- 将 `Background` 设为 `Alpha`，会输出附带 Alpha 通道的透明图像。
- **注意**: 此时的输出是 **RGBA**，因此如果在 image2image 等中使用，可能会发生错误（参考 [蒙版与 Alpha 通道](/zh/data-utilities/mask-alpha/)）。

根据用途有一些衍生模型，例如擅长动漫图像的 ToonOut 等。请尝试各种模型。

---

## 分割 (Segmentation)

### SAM (Segment Anything Model)

目前最有名的分割模型。

它熟知“物体的形状”，如果用点或框指定照片中的车等，它就能准确找到其轮廓并制成蒙版。

![](https://gyazo.com/ae3a00df59eb97f8612b700ff90aac3b){gyazo=image}

这是通过点击点来分割指定对象的功能，但在基本使用中，通常会与物体检测组合使用。

- 1. 右键点击图像类节点 → `Open in SAM Detector`
- 2. 左键点击想要提取的物体（右键点击想要排除的范围）
- 3. 点击 `Detect` 生成蒙版

> SAM 目前仍在持续开发中，有初期版 / SAM 2 / SAM 2.1 / SAM 3。
>
> 最新版的 SAM 3 不仅支持点或 BBOX 指令，还支持文本指令。虽然下面会再次介绍，但老实说，对于静止画的 AI 蒙版生成，SAM 3 就足够了。

### 服装与人体部位分割

进行“上半身”、“裙子”、“脸”、“头发”等特定部位的分割。

![](https://gyazo.com/3221f2c1bfc5b2a0f4db328c820f5235){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/Clothing_Segmentation_(RMBG).json)

- 选择想要分割的类别。

以前在换装等任务中经常使用，但现在物体检测 + 分割的通用性可能更高，性能也更好。


---

## 组合使用

通过组合物体检测、分割和抠图，可以实现更高精度的蒙版生成。

### YOLO × SAM

![](https://gyazo.com/2c1fb7ed9c7fcc6242e48b9e6e405c27){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/YOLO_face-SAM.json)

高速人脸检测 (YOLO) 和 SAM (初期) 的组合。

### Grounding DINO × SAM

![](https://gyazo.com/c7b4ed29a8dae26fb9c666b137091ab4){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/Grounding_DINO_HQ-SAM.json)

Grounding DINO 和 SAM 的改良版 HQ-SAM 的组合。

既可以用文本指定对象，又能生成高精度的蒙版，是最常用的组合之一。

### Florence2 × SAM2

![](https://gyazo.com/677607c761c38defde753681398d6e1f){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/Florence2_SAM2.1.json)

Florence2 和 SAM2.1 的组合。

如果是人或动物等易于理解的对象随便用哪个都行，但当想要指定“戴着墨镜的男人”、“躺在树下的猫”等复杂条件时，这种基于 LLM 的模型就会发挥作用。

### 🔥SAM 3

![](https://gyazo.com/5ab4819ba05efd277c18ae27046f7f58){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/SAM3_Segmentation_(RMBG).json)

SAM 的最新版，支持文本指令，可以一次性执行物体检测和分割。

精度、性能和速度都很优秀，总之先用这个吧(´ε｀ )

如果想做更复杂的事情，也可以尝试 [Ltamann/ComfyUI-TBG-SAM3](https://github.com/Ltamann/ComfyUI-TBG-SAM3?tab=readme-ov-file) 等自定义节点。

### SAM 3 × BiRefNet

![](https://gyazo.com/82c4c2d947a3ea9c98b46e05a05d542f){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/SAM3_BiRefNet.json)

分割原本是用来区分对象的，并不是为了精细的抠图而设计的。

相对的，抠图可以处理像头发这样微小的东西，或者像玻璃这样半透明的东西。

通过将它们组合起来，可以发挥彼此的能力。
