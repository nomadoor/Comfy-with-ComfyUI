---

layout: page.njk
lang: zh
section: basic-workflows
slug: ultimate-sd-upscale
navId: ultimate-sd-upscale
title: "Ultimate SD upscale"
created: 2026-02-06
updated: 2026-03-02
summary: "用 Tile 和 ControlNet 进行超高分辨率放大"
seoTitle: "ComfyUI 的 Ultimate SD Upscale：分块放大"
seoDescription: "把图像分块放大的 Ultimate SD Upscale 思路。介绍用 overlap 融合分块边界、提示词问题，以及用 ControlNet Tile 固定结构的方法，附工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
   image: ""
tags: ["upscale-restoration", "controlnet"]
---

## 什么是 Ultimate SD upscale？

![](/media/basic-workflows/ultimate-sd-upscale/legacy_gyazo_d3b6f13de466be0cb0a17f2565d6f9e3.png){media=image}

Stable Diffusion 无法生成大图，一个原因是没有用大图训练过，另一个更简单的原因则是计算成本。

想直接生成一张 4K、8K 这样的超高分辨率图像，在 VRAM 和计算时间上都相当吃力。

于是就有了这样的想法：不一口气生成，而是把图像切开，分别做 Hires.fix。
- 1. 放大图像
- 2. 切成一块块 tile
- 3. 对每块 tile 分别做 image2image
- 4. 最后把 tile 拼接起来

名字上是 **Ultimate SD upscale** 比较有名，但真正重要的是 **Tile（分块）** 这个思路。

---

## 自定义节点

- [shiimizu/ComfyUI-TiledDiffusion](https://github.com/shiimizu/ComfyUI-TiledDiffusion)

也有名字就叫 [ssitu/ComfyUI_UltimateSDUpscale](https://github.com/ssitu/ComfyUI_UltimateSDUpscale) 的 Ultimate SD upscale 节点，但这次想把原理弄清楚，所以用上面这个更简单的节点。

---

## Tile 的弱点 : 边界线

先来看看 Tile 的基本行为。
这里以 Tiled Diffusion 的节点为例说明，只要掌握了思路，用什么节点都可以。

![](/media/basic-workflows/ultimate-sd-upscale/legacy_gyazo_6ff5e63c42367c9ef8ffd8e2a89a61c5.png){media=image} ![](/media/basic-workflows/ultimate-sd-upscale/legacy_gyazo_daf241e640303e9bdbebdbdb06ae4afa.png){media=image}

[](/workflows/basic-workflows/ultimate-sd-upscale/tiled_diffusion_overlap0.json)

* 🟨 把输入图像缩放到 1024 × 1024 px
* 🟩 把 tile 尺寸设为 512 × 512 px

这样设置后，左下这张小狗的图像会被整整齐齐地切成 4 块，
每块 tile 都作为独立的 image2image 来处理。

可以看到，tile 的边界线清晰可见，画面整体缺乏统一感。  
这就是 Tile 的 **第 1 个弱点**。

---

## 用 overlap 让边界线自然过渡

如果在意边界线，有一个思路是：把 tile 稍微重叠着排列就好了。
这就是 `tile_overlap`。

![](/media/basic-workflows/ultimate-sd-upscale/legacy_gyazo_d6bf859530ae65b7b09ca8a2b2e3006b.png){media=image} ![](/media/basic-workflows/ultimate-sd-upscale/legacy_gyazo_fec3f15e6e4ff7110d3f5ff110f0faa2.png){media=image}

[](/workflows/basic-workflows/ultimate-sd-upscale/tiled_diffusion_overlap256.json)

- 🟩 将 `tile_overlap` 设为 256px
- 不是把 tile 整齐地排开，而是 **故意重叠一半左右** 地排列。
  - ![](/media/basic-workflows/ultimate-sd-upscale/legacy_gyazo_5f5d51e77955a55c8df142e45d8d12f5.png){media=image}

重叠的部分就像缓冲区一样，让相邻的 tile 互相共享信息，
随着采样推进，边界会逐渐融合，tile 的接缝也就不明显了。

不过 overlap 越大，同一区域就会被采样越多次，生成时间也会随之增加。

---

## Tile 的另一个弱点：提示词

Tile 还有一个很大的弱点。  
因为 **所有 tile 都用同一个提示词**，所以会在意想不到的地方生成多余的东西。

![](/media/basic-workflows/ultimate-sd-upscale/legacy_gyazo_b180b2b157a72b030b099dcb6f7c046f.png){media=image}

在刚才的工作流中，设置 `tile_overlap = 0` / `denoise = 1`，
提示词只写 `一只狗`，生成看看吧。  
结果就像图中那样，一张图里出现了好几只狗。

左上、右上、左下、右下的每块 tile 都想生成一只狗，所以整体就画出了四只狗。这就是 Tile 的 **第 2 个弱点**。

---

## 为每块 tile 换提示词的方案

单从道理上讲，可以考虑 **给每块 tile 分别写提示词** 的方法。

- 左上 tile：`狗的右耳, 右眼`
- 右上 tile：`狗的左耳, 左眼`
- 左下 tile：`狗的前足`
- 右下 tile：`狗的后足`

这样一来，每块 tile 应该都能明白“自己只要负责耳朵就好”。

但实际上几乎没人这么用。

有多少块 tile 就写多少条提示词并不现实，更重要的是，Stable Diffusion 理解不了“狗脸右上方的 1/4”这种提示词，也就没法分开去画。


---

## 用 ControlNet Tile 固定结构

这时就轮到 **ControlNet Tile** 登场了。

ControlNet Tile 是一种能 **相当强地保持输入图像结构**、同时生成新图像的 ControlNet。

它并不是原样复制像素，而是在保持 **大致形状** 和 **物体位置关系** 的前提下，重新绘制纹理和细节。

![](/media/basic-workflows/ultimate-sd-upscale/legacy_gyazo_a0d8adb6b4cbd35562588238db87f71e.png){media=image} ![](/media/basic-workflows/ultimate-sd-upscale/legacy_gyazo_1bf02bf5900f379735c6a29a7aa1935e.png){media=image}

[](/workflows/basic-workflows/ultimate-sd-upscale/tileddiffusion_controlnet_tile.json)

这个工作流特意设成了 `tile_overlap = 0`、`denoise = 1` 这种最容易暴露 Tile 弱点的设置。

即便如此，应该能看出，经过 ControlNet Tile 之后，放大时 **在相当程度上保留了原图的构图**。

---

## 用 overlap × ControlNet Tile 收尾

把前面这些要素组合起来，实用的 Tile 放大方案就成形了。

![](/media/basic-workflows/ultimate-sd-upscale/legacy_gyazo_763660c52564a7af2f5dce9eaa81e20f.png){media=image} ![](/media/basic-workflows/ultimate-sd-upscale/legacy_gyazo_3e4bf6018a4e4500f3bbd14151ce56e7.png){media=image}

[](/workflows/basic-workflows/ultimate-sd-upscale/tiled_diffusion_overlap_contolnet_tile.json)

- 🟩 overlap 256px
- 🟦 Controlnet strength 0.6

效果已经相当自然了。

---

## 总结：Ultimate SD upscale 的思路

Ultimate SD upscale 的本质在于以下三大支柱。

- 1. **Tile（分块）**
   不直接处理大图，而是切成 tile 分别做 image2image，
   在压低 VRAM 和计算时间负担的同时实现超分辨率。

- 2. **overlap（tile 的重叠）**
   让 tile 之间稍微重叠，在采样过程中让边界自然融合，
   使接缝不明显。

- 3. **ControlNet Tile（固定结构）**
   在强力保持输入图像结构的同时进行分块放大，
   抑制“狗中有狗”的问题，以及整体变得支离破碎的问题。

实际的 Ultimate SD upscale 类节点和预设，只不过是把这些思路打包进一个节点而已。

顺便一提，同样的思路也可以用在视频生成上，这时要分割的就变成了帧。
比如把 100 帧的视频按每 20 帧一段切开，再让相邻段 overlap 5 帧，大概就是这种感觉。
详情这里就不展开了，但为了降低计算成本而切得更细，这一点是完全一样的。
