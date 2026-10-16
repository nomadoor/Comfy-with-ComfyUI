---
layout: page.njk
lang: zh
section: ai-capabilities
slug: object-removal
navId: object-removal
title: 物体去除
created: 2026-02-06
updated: 2026-03-02
summary: 只把特定物体从图像中去掉的任务，以及几种代表性的做法
seoTitle: "用 AI 去除图像中的物体：LaMa、inpainting、图像编辑"
seoDescription: "比较从图像中去除人物、电线等多余物体的方法：LaMa、扩散模型的 inpainting，以及无需蒙版的基于指令的图像编辑模型。"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: /media/ai-capabilities/object-removal/legacy_gyazo_e06eeccf0efa2e91773bb54acb31560a.mp4
---
## 什么是物体去除？

顾名思义，就是只把某个特定物体从图像中去掉的任务。

把人物、招牌、电线、垃圾、路人等不想出现在画面里的东西自然地去掉，并把背景平滑地补上。

---

## LaMa

在扩散模型出现之前，LaMa 这类基于 CNN 的 inpainting 模型是常用的 SoTA。

![](/media/ai-capabilities/object-removal/legacy_gyazo_4c0b962c3983bc3296da9b994c07f3b6.png){media=image}

[](/workflows/ai-capabilities/object-removal/lama.json)

它专门用周围的纹理来填补遮罩区域，以前也常被用来去水印。

---

## 用 inpainting 去除

最朴素的方法，是准备好蒙版，用普通的 inpainting 涂掉。

在要去掉的物体上画蒙版，写一段与背景相符的提示词（例：“只有背景的草坪”“空无一物的地板”），然后进行 inpainting。

![](/media/ai-capabilities/object-removal/legacy_gyazo_2cad88edab0d74b24f0fc78f528a320d.png){media=image}

[](/workflows/ai-capabilities/object-removal/remake_for_sdxl_removing_object_and_filling_with_background.json)

不过，有时不但没把物体去掉，反而多画出了别的东西，作为物体去除的手段不太稳定。

所以以前也有人先用 LaMa 做 inpainting 的预处理，不过现在的模型应该不需要了。

---

## 用基于指令的图像编辑去除物体

在最近的 [基于指令的图像编辑](/zh/ai-capabilities/instruction-based-image-editing/) 模型中，物体去除也正变成一项相当简单的任务。

只要下指令“去掉这个人”“去掉这个标志”“去掉右下角的 Logo”就行了。

![](/media/ai-capabilities/object-removal/legacy_gyazo_84af7edfab7cd344f7654090b7957166.png){media=image}

[](/workflows/ai-capabilities/object-removal/qwen_image_edit_2509_object_removal.json)

### 不需要蒙版的优点

与 inpainting 相比，它明显更好的一点是 **不用画蒙版**。

想把物体去除自动化，就得用分割来生成物体的蒙版；但其实要去掉的不只是物体本身，**连它的影子、玻璃上的倒影也得一起去掉**。这才是难点。

基于指令的图像编辑模型，会把这些也一并去掉。
