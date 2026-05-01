---
layout: page.njk
lang: zh
section: data-utilities
slug: mask-alpha
navId: mask-alpha
title: "蒙版与 Alpha 通道"
created: 2026-02-06
updated: 2026-03-02
summary: "关于蒙版的概念和透明图像的处理"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/bd1a30f0d9562418f2fd74c7d9dd6f1e.png"
---

## 什么是蒙版？

![](https://i.gyazo.com/bd1a30f0d9562418f2fd74c7d9dd6f1e.png){gyazo=image}

蒙版是一种黑白图像，用于指示图像的哪些部分 **“作为处理对象 / 应该排除”**。

- **白**: 处理（适用）
- **黑**: 不处理（保护）
- **灰**: 调整强度（※取决于功能）

### AI 中的蒙版

![](https://i.gyazo.com/3b4d37c9bb4a46d514f2fc77234718f8.png){gyazo=image}

在图像生成 AI 中，主要用于仅重绘图像一部分的 **Inpainting**。

AI 仅重新生成白色部分，黑色部分则保留原始图像。

> **注意点：**
> 在通常的 Inpainting 中，无法处理灰色（半透明）蒙版，会被擅自作为白色或黑色的二值进行处理。
>
> 如果想使用带有渐变的蒙版来实现“淡淡地变化”这样的效果，需要使用 **Differential Diffusion** 这种特殊技术。

---

## 什么是 Alpha 通道？

![](https://gyazo.com/cf9be566f77d85571b29a2b5597121cb){gyazo=image}

普通图像是用 **R(红)・G(绿)・B(蓝)** 3 个通道来表现颜色的，但背景透明的图像（PNG 等）除此之外还包含 **A(Alpha)** 通道。
这就是掌管透明度的信息。

### ComfyUI 中透明图像的处理方式

这里有一点复杂，Stable Diffusion 本身无法直接处理透明图像。
因此，当在 ComfyUI 中读取透明 PNG 图像时，它会在内部被分离为 **“RGB 图像”和“蒙版”** 这两个部分。

![](https://i.gyazo.com/dbe187645fd186d20f936f226a79b926.png){gyazo=image}

让我们来看看 `Load Image` 节点的输出。

- **IMAGE (RGB)**
  - 因为 Alpha 通道的信息消失了，所以原本透明的部分会被填充为 **黑色**。
- **MASK**
  - 提取出 Alpha 通道（透明度）的信息。
  - 在 ComfyUI 中，**原本透明的部分表现为“白色”**。

### 注意与一般软件的区别

![](https://i.gyazo.com/e3ba8dcc1452e3ed88512250b0c81d06.png){gyazo=image}


在许多软件中，“透明部分＝黑色”生成的蒙版比较多，习惯了 Photoshop 或 Affinity Photo 等图像编辑软件的人可能会感到混乱，请把它当成别的东西来考虑。

顺着“要处理的部分是蒙版的白色部分 → 白色部分被赋予 Alpha 通道成为透明图像”这个思路，应该就比较容易理解了。

---

## RGBA 的结合与分离

处理结束后，如果想再次让背景透明并保存，该怎么做呢？

![](https://gyazo.com/b05103b1633b9a4b0fbfdd96063499c2){gyazo=image}

[](/workflows/data-utilities/mask-alpha/Join-Split_Image_with_Alpha.json)

### 🟨Join Image With Alpha 节点

将 `IMAGE`（RGB 图像）和 `MASK` 合并，转换为 1 张 **RGBA 图像（透明图像）**。
将其连接到 `Save Image` 节点，就可以保存为透明 PNG。

### 🟪Split Image With Alpha 节点

反之，这是将 RGBA 图像分离为 RGB 和 MASK 的节点。

---

## 🚨 错误的陷阱：混淆 RGBA 和 RGB

在 ComfyUI 的连线上，RGB 图像(3 通道)和 RGBA 图像(4 通道)都作为相同的 **`IMAGE`** 类型流动。从外观上无法区分。

但是，AI（KSampler 或 VAE）基本上只接受 3 通道的 RGB 图像。
因此，如果不小心把 `Join Image With Alpha` 后的 RGBA 图像连接到 `VAE Encode` 等节点，就会出现以下错误。

```bash
RuntimeError: Given groups=1, ... expected input to have 3 channels, but got 4 channels instead
```

如果被怒斥“原本期待 3 通道结果来了 4 通道！”，请怀疑哪里是不是让图像变成了 RGBA。

背景抠图类的自定义节点等，输出有时会直接变成 RGBA。
