---
layout: page.njk
lang: zh
section: ai-capabilities
slug: object-removal
navId: object-removal
title: 对象去除
summary: 从图像中仅去除特定物品的任务，及其代表性的方法
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: https://i.gyazo.com/e06eeccf0efa2e91773bb54acb31560a.gif
---
## 什么是对象去除？

顾名思义，这是从图像中去除特定对象的任务。

自然地去除人物、看板、电线、垃圾、路人等不希望出现的东西，并平滑地填充背景。

---

## LaMa

在扩散模型出现之前，像 LaMa 这样基于 CNN 的 inpainting 模型经常作为 SoTA 被使用。

![](https://gyazo.com/4c0b962c3983bc3296da9b994c07f3b6){gyazo=image}

[](/workflows/ai-capabilities/object-removal/LaMa.json)

它专注于用周围的纹理填充被遮罩的区域，也被用于去除水印等。

---

## 通过 inpainting 去除

最朴素的方法是准备蒙版，用普通的 inpainting 进行填充。

在想要去除的对象上绘制蒙版，编写配合背景的提示词（例：“只有背景的草坪”、“什么都没有的地板”），然后进行 inpainting。

![](https://gyazo.com/2cad88edab0d74b24f0fc78f528a320d){gyazo=image}

[](/workflows/ai-capabilities/object-removal/Remake_for_SDXL-Removing_Object_and_Filling_with_Background.json)

但是，有时不仅没把对象消除，反而新增加了别的对象，对于对象去除来说有时并不稳定。

因此，以前也有过在 inpainting 的预处理中使用 LaMa 的情况，但现在的模型已经不需要了吧。

---

## 指示基图像编辑中的对象去除

在最近的 [基于指令的图像编辑](/zh/ai-capabilities/instruction-based-image-editing/) 模型中，对象去除也正在成为相当单纯的任务。

只要指示“把这个人消除”、“把这个标志消除”、“把右下的 LOGO 消除”等即可。

![](https://gyazo.com/84af7edfab7cd344f7654090b7957166){gyazo=image}

[](/workflows/ai-capabilities/object-removal/Qwen-Image-Edit-2509_object-removal.json)

### 不需要蒙版的优点

与 inpainting 相比，明确的优点是 **不需要绘制蒙版**。

如果想自动化对象去除，虽然可以通过分割制作对象的蒙版，但本来 **必须连同影子或玻璃上的反射也一起消除**。这很难。

如果是基于指令的图像编辑模型，连同这些也能一起消除。
