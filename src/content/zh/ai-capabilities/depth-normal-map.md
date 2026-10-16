---
layout: page.njk
lang: zh
section: ai-capabilities
slug: depth-normal-map
navId: depth-normal-map
title: "深度估计与法线贴图生成"
created: 2026-02-06
updated: 2026-03-02
summary: "从图像中提取纵深和立体感的技术"
seoTitle: "深度估计与法线贴图生成：Depth Anything 等"
seoDescription: "从单张图像提取进深和表面朝向的深度估计与法线贴图生成。比较 MiDaS、ZoeDepth、Depth Anything 系列，以及 Marigold、Lotus、LBM 等源自扩散模型的方法。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/ai-capabilities/depth-normal-map/legacy_gyazo_f6033924229b0ea961d8f22eb38bd6b2.png"
---

## 什么是深度贴图与法线贴图？

**深度贴图（depth map）**
- 每个像素都记录着“与相机之间距离”的图像。
- 一般来说越近越白，越远越黑。

**法线贴图（normal map）**
- 把每个像素的“表面朝向（法线向量）”用 RGB 编码而成的图像。
- 可以看出每个面朝向哪个方向，所以常用于重新打光（relight）或带 3D 感的变形。

**单目深度估计**
- 从一张 RGB 图像推断深度贴图的任务。
- 要得到真正准确的深度，需要 LiDAR、立体相机等多个传感器；而单目深度估计则是想“只靠一张照片，还原出近似的纵深信息”。
- 深度和法线是相近的信息，所以能同时推断两者的模型也不少。

---

## 单目深度估计的代表模型

### MiDaS / ZoeDepth（扩散模型之前的经典）

在扩散模型普及之前，MiDaS 和 ZoeDepth 是单目深度估计的经典模型。

![](/media/ai-capabilities/depth-normal-map/legacy_gyazo_8471cde6727e271aa05f0bad44797144.png){media=image}

[](/workflows/ai-capabilities/depth-normal-map/midas_depth_normal_map.json)

- **MiDaS**
  - 经过训练，即使是相机参数各不相同的“杂乱图像”，也能推断相对深度。
  - 在只需要知道“相对而言哪个在前、哪个在后”的用途中被广泛使用。

- **ZoeDepth**
  - 旨在统一处理相对深度和以米为单位的深度的模型。

在新的工作流里用它们没什么意义，但在旧的工作流里偶尔还会见到，所以记住名字就好。

### Depth Anything 系列

最近的主流是 **Depth Anything / Depth Anything V2 / V3** 这类深度估计的基础模型。

![](/media/ai-capabilities/depth-normal-map/legacy_gyazo_69b8c5331c693c699d389f1c95935fff.png){media=image}

[](/workflows/ai-capabilities/depth-normal-map/depth_anything_v2.json)

在 ComfyUI 里制作深度贴图，我想大多是作为 ControlNet 的预处理，总之先用它就 OK 了。

---

## 源自扩散模型的深度、法线推断

扩散模型普及之后，也出现了“把生成模型掌握的世界知识用到其他任务上”的研究方向。

说得粗暴一点，这就像是 **“把画风转换成深度贴图风格”**。

### Marigold

Marigold 是以 Stable Diffusion 2 为基础，“针对深度估计任务做了微调的模型”。

当时很少有人想到把图像生成模型用在图像生成以外的地方，所以它颇受关注。
不过，它的计算成本和生成一张图像差不多，只作为预处理的话有点重。

### Lotus

Lotus 是一种 dense prediction 模型，属于“使用扩散模型的架构，但不预测噪声，而是直接输出深度或法线”的类型。

### LBM（Latent Bridge Matching）

LBM 是基于 Stable Diffusion XL、用于“1 步 image-to-image”的框架，其中有深度估计 / 法线推断的派生模型。
