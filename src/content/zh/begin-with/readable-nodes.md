---
layout: page.njk
lang: zh
section: begin-with
slug: readable-nodes
navId: readable-nodes
title: "Readable Node 及其推荐"
summary: "搭建清晰易用工作流的技巧"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 摆脱意大利面

对于节点式工具，如果随便乱搭，就会变成线条缠绕的“意大利面节点”，不仅是别人做的 workflow，就连自己做的也会变得无法理解。

然而，如果整理得当，一眼就能明白发生了什么，这也是节点式的优点之一。

即便没有名著《编写可读代码的艺术 (The Art of Readable Code)》，也让我们搭建出 **“Readable Node（可读节点）”**，过上舒适的 ComfyUI 生活吧！

> ※ 这些全都是我的独断和偏见，并非官方推荐的方法。请轻松地阅读。

---

## 1. 视线引导 (从左上到右下)

![](https://i.gyazo.com/30d3ce6a42f9f1783ab798e91d2d0f45.png){gyazo=image}

相比于其他节点工具，ComfyUI 只是“让素材搭上一条直线生产线，加工成图像”的简单结构。
“是否 Readable？”这个问题，可以换成：**能否快速找到这条直线？**。

设计界有个很有名的话题，人基本上是按照 **“从左上到右下”** 的顺序来观察物体的。

工作流最好也遵循这个原则进行配置。

## 2. 展示连线

![](https://i.gyazo.com/9846334b433e5a4122ee5cae02850543.png){gyazo=image}

信息从哪里传递到哪里，只有通过看连线才能明白。
在配置时，要注意不要让连线藏在节点后面。

*   **使用 Reroute 节点**: 通过适当地建立中继点（Reroute），可以避免连线的重叠或横跨。
*   **谨慎无线化**: 虽然“无线化”节点很方便，但如果用得太多，寻找“信息飞哪去了”的工夫就会增加，结果比解开意大利面还要费劲。

## 3. 不要用 Bento（便当盒）布局

![](https://i.gyazo.com/643b7ec8626411c1d7d08161e348b5b5.png){gyazo=image}

虽然能理解想把节点整齐地塞进四边形里的心情，但从 **“视线引导”** 和 **“展示连线”** 的角度来看，这是最糟糕的。

数据流向奇怪的方向，连线隐藏在节点背后。

ComfyUI 拥有无限广阔的画布。
不要挤在一起，奢侈地使用空间，宽敞地进行配置吧。

## 4. 从默认 workflow 开始

![](https://i.gyazo.com/71fdea2d1aeea37542d068aa855e512f.png){gyazo=image}

从侧边栏的 `Templates` → `Getting Started` → `Image Generation`，可以调用基础的 text2image 工作流。

> 遗憾的是，现在模板中已经删除了图中的极简工作流。
> 作为替代，我把它放在这里。
>
> [](/workflows/begin-with/readable-nodes/Stable_Diffusion_1.5.json)

这个构成不仅限于 SD1.5，也是所有最新模型（SDXL, Flux, Video 生成等）的基础。

从这里开始扩展，工作流的结构就会产生一致性，即使是别人看（或者是未来的自己看）也容易理解。

## 5. 对节点进行颜色分类

![](https://i.gyazo.com/ccf1a2d336fdbfd0e94ae71926e8d9b6.png){gyazo=image}

随着功能增加，就会无法瞬间判别哪个是承担什么角色的节点。

适当的着色有助于解读。

例如如果是 ControlNet，就将 `Apply ControlNet` / `Load Model` / `Preprocessor` 等相关节点全部统一为同一种颜色。

这样一来，当想“改变 ControlNet 的设置”时，只需要寻找绿色的区域就可以了。

## 6. 写笔记（注释）

![](https://i.gyazo.com/fa2b5d6e3560c0b56e068228f91f649a.png){gyazo=image}

模型的选择、CFG 的值、采样器的种类…… 生成 AI 有无数的参数，大家都想知道 **“为什么要设成这个值”**。

“这里是为了提升细节”、“推荐〇〇模型”等，请毫不畏惧地讲述你的讲究。
虽然稍微有点麻烦，但仅此一项，工作流的价值就会提高数倍。

## 7. 保持小巧、简单

![](https://i.gyazo.com/2a9c66fa28c01a8bd12b24fdde2a07a4.png){gyazo=image}

工作流一旦肥大化，处理时间就会变长，错误率会上升，也会变得难以阅读。

如果能分割，就尽量保持小巧。ComfyUI 有标签页功能。

虽然“All in One”也很浪漫，但像“标签页 1 用于生成，标签页 2 用于放大”这样进行分工，各自的工作流就会变得简单，也更容易复用。

## 8. 自定义节点最小化

![](https://gyazo.com/e26d548e44643c52f6658eb368846cbf){gyazo=image}

自定义节点虽然是让 ComfyUI 变得强大的功能，但与核心节点不同，它既不能保证会被维护，也不能保证一定能运行。

使用的自定义节点越多，遇到麻烦的可能性也会随之增加。

当然，有些功能没有自定义节点就无法使用。但如果只是单纯地将多个节点汇总在一起这类的功能，哪怕节点稍微多一点，也应该使用核心节点。
