---
layout: page.njk
lang: zh
section: begin-with
slug: readable-nodes
navId: readable-nodes
title: "推荐 Readable Node"
created: 2026-02-06
updated: 2026-03-02
summary: "搭建清晰易用工作流的技巧"
seoTitle: "Readable Node：搭建易读的 ComfyUI 工作流"
seoDescription: "搭建易读的 ComfyUI 工作流、避免变成“意大利面”的技巧。介绍视线引导、让连线露出来的布局、节点配色、写注释，以及尽量少用自定义节点等思路。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 摆脱意大利面

节点式工具如果随手乱搭，就会变成连线缠成一团的“意大利面节点”，别人做的工作流自不必说，就连自己看也会看不懂。

但反过来，只要整理得干净，一眼就能看出在做什么，这也是节点式工具的优点之一。

借用名著《编写可读代码的艺术 (The Art of Readable Code)》的说法，我们来搭出 **“Readable Node（可读节点）”**，过上舒适的 ComfyUI 生活吧！

> [!NOTE]
> ※ 这些全都是我的个人偏见，并不是官方推荐的做法。轻松看看就好。

---

## 1. 视线引导 (从左上到右下)

![](/media/begin-with/readable-nodes/legacy_gyazo_30d3ce6a42f9f1783ab798e91d2d0f45.png){media=image}

和其他节点工具相比，ComfyUI 的结构很简单，只是“把素材放上一条单行道的生产线，一路加工成图像”。
“是否 Readable？”这个问题，换个说法就是：**能多快找到这条生产线？**

这在设计领域是很有名的说法：人基本上会按照 **“从左上到右下”** 的顺序看东西。

工作流最好也按照这个原则来布局。

## 2. 让连线露出来

![](/media/begin-with/readable-nodes/legacy_gyazo_9846334b433e5a4122ee5cae02850543.png){media=image}

信息从哪里传到哪里，只有看连线才知道。
布局时注意别让连线藏到节点后面。

*   **使用 Reroute 节点**: 适当地设置中继点（Reroute），可以避免连线重叠或横穿。
*   **谨慎使用无线化**: “无线化”节点虽然方便，但用得太多，找“信息飞到哪去了”就会越来越麻烦，最后比解开意大利面还费劲。

## 3. 不要用 Bento（便当盒）布局

![](/media/begin-with/readable-nodes/legacy_gyazo_643b7ec8626411c1d7d08161e348b5b5.png){media=image}

想把节点整整齐齐地塞进方框里的心情可以理解，但从 **“视线引导”** 和 **“让连线露出来”** 的角度看，这是最糟糕的。

数据会流向奇怪的方向，连线也会藏到节点背后。

ComfyUI 拥有无限广阔的画布。
别挤得满满当当，大方地利用空间，宽松地摆放吧。

## 4. 从默认工作流开始

![](/media/begin-with/readable-nodes/legacy_gyazo_71fdea2d1aeea37542d068aa855e512f.png){media=image}

从侧边栏的 `Templates` → `Getting Started` → `Image Generation`，可以打开基础的 text2image 工作流。

> [!NOTE]
> 遗憾的是，图中这个极简的工作流现在已经从模板中删掉了。
> 所以我把它放在这里。
>
> [](/workflows/begin-with/readable-nodes/stable_diffusion_1_5.json)

这个结构不只适用于 SD1.5，也是所有最新模型（SDXL, Flux, Video 生成等）的基础。

从这里开始扩展，工作流的结构就会保持一致，别人看（或者未来的自己看）也更容易理解。

## 5. 给节点分颜色

![](/media/begin-with/readable-nodes/legacy_gyazo_ccf1a2d336fdbfd0e94ae71926e8d9b6.png){media=image}

功能一多，就没法一眼看出哪个节点负责什么。

合适的配色能帮助理解。

比如 ControlNet，就把 `Apply ControlNet` / `Load Model` / `Preprocessor` 等相关节点全部设成同一种颜色。

这样一来，想“改一下 ControlNet 的设置”时，只要找绿色的区域就行了。

## 6. 写笔记（注释）

![](/media/begin-with/readable-nodes/legacy_gyazo_fa2b5d6e3560c0b56e068228f91f649a.png){media=image}

模型的选择、CFG 的值、采样器的种类……生成 AI 有无数的参数，大家都想知道 **“为什么要设成这个值”**。

“这里用来增强细节”“推荐用〇〇模型”等等，尽管大胆地写出你的讲究。
虽然有点麻烦，但只要有了这些，工作流的价值就会翻好几倍。

## 7. 保持小巧、简单

![](/media/begin-with/readable-nodes/legacy_gyazo_2a9c66fa28c01a8bd12b24fdde2a07a4.png){media=image}

工作流一旦变得臃肿，处理时间会变长，出错率会上升，也会更难读。

能拆分的话，就尽量保持小巧。ComfyUI 有标签页功能。

“All in One”也很浪漫，但像“标签页 1 负责生成，标签页 2 负责放大”这样分工，每个工作流都会更简单，也更容易复用。

## 8. 尽量少用自定义节点

![](/media/begin-with/readable-nodes/legacy_gyazo_e26d548e44643c52f6658eb368846cbf.png){media=image}

自定义节点是让 ComfyUI 强大的功能之一，但和核心节点不同，它既不保证会一直有人维护，也不保证一定能运行。

使用的自定义节点越多，遇到麻烦的可能性也会随之增加。

当然，有些功能没有自定义节点就用不了。但如果只是把多个节点打包在一起的那种，哪怕节点会多一些，也应该用核心节点。
