---
layout: page.njk
lang: zh
section: ai-capabilities
slug: depth-normal-map
navId: depth-normal-map
title: "深度推断与法线贴图生成"
summary: "从图像中提取进深感或立体感的技术"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/f6033924229b0ea961d8f22eb38bd6b2.png"
---

## 什么是深度贴图与法线贴图？

**深度贴图（depth map）**
- 让每个像素具有“距离相机的距离”的图像。
- 一般来说越近越白，越远越黑。

**法线贴图（normal map）**
- 用 RGB 对每个像素的“面的方向（法线向量）”进行编码的图像。
- 因为能知道面朝向哪个方向，所以用于重光照或 3D 风格的变形。

**单目深度推断**
- 从一张 RGB 图像推断深度贴图的任务。
- 如果真的想求出准确的深度，需要 LiDAR 或立体相机等多个传感器，但单目深度推断是“试图只从一张照片中恢复伪进深信息”的尝试。
- 因为深度和法线是相近的信息，所以能同时推断两者的模型也很多。

---

## 单目深度推断的代表模型

### MiDaS / ZoeDepth（扩散模型以前的常客）

在扩散模型普及之前，MiDaS 或 ZoeDepth 是单目深度推断的常客模型。

![](https://gyazo.com/8471cde6727e271aa05f0bad44797144){gyazo=image}

[](/workflows/ai-capabilities/depth-normal-map/MiDaS_Depth-Normal_Map.json)

- **MiDaS**
  - 即使是相机参数各不相同的“杂乱图像”，也能被训练成推断相对深度的模型。
  - 在只要知道“相对来说哪个在前面・哪个在后面”就行的用途中被广泛使用。

- **ZoeDepth**
  - 旨在统一处理相对深度和以米为单位的深度的模型。

在新的 workflow 中使用这个没有什么意义，但在旧的 workflow 中有时能看到，所以只记住名字就好。

### Depth Anything 系

最近的主流是 **Depth Anything / Depth Anything V2 / V3** 等深度推断的基座模型。

![](https://gyazo.com/69b8c5331c693c699d389f1c95935fff){gyazo=image}

[](/workflows/ai-capabilities/depth-normal-map/Depth_Anything_V2.json)

在 ComfyUI 中制作深度贴图时，我认为大多数情况下是用作 ControlNet 的预处理，总之先用这个就 OK 了。

---

## 源自扩散模型的深度・法线推断

扩散模型普及后，也出现了“将生成模型拥有的世界知识，也用于其他任务”方向的研究。

如果不怕误解的话，可以说就像是 **“转换成深度贴图风格的画风”** 一样。

### Marigold

Marigold 是以 Stable Diffusion 2 为基础，“针对深度推断任务进行了微调的模型”。

因为除此之外几乎没有在图像生成以外使用图像生成模型的想法，所以在当时备受瞩目。
只是，因为要花费与生成一张图像几乎相同的计算成本，所以作为单纯的预处理有点重。

### Lotus

Lotus 是“使用扩散模型的架构，但不进行噪声预测，而是直接输出深度或法线本身”类型的 dense prediction 模型。

### LBM（Latent Bridge Matching）

LBM 是基于 Stable Diffusion XL 的“1 步 image-to-image”的框架，其中有深度推断 / 法线推断的派生模型。
