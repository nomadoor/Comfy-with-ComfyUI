---

layout: page.njk
lang: zh
section: basic-workflows
slug: ultimate-sd-upscale
navId: ultimate-sd-upscale
title: "Ultimate SD upscale"
summary: "使用 Tile 和 ControlNet 的超高分辨率放大"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
   image: ""
tags: ["upscale-restoration", "controlnet"]
---

## 什么是 Ultimate SD upscale？

![](https://gyazo.com/d3b6f13de466be0cb0a17f2565d6f9e3){gyazo=image}

作为在 Stable Diffusion 无法生成大图像的理由，有未以大图像进行学习的理由，但作为另一个单纯的原因，有计算成本的问题。

想原样生成 1 张 4K 或 8K 这样的超高分辨率的图像的话，在 VRAM 和计算时间方面相当严峻。

因此产生了不是一口气制作，而是分割图像分别进行 Hires.fix 的想法。
- 1. 扩大图像
- 2. 分割为瓦片状
- 3.各瓦片个别地 image2image
- 4. 最后连接瓦片

名字上 **Ultimate SD upscale** 很出名，但真正重要的是 **Tile（瓦片分割）** 这个想法。 

---

## 自定义节点

- [shiimizu/ComfyUI-TiledDiffusion](https://github.com/shiimizu/ComfyUI-TiledDiffusion)

虽然也有名为 [ssitu/ComfyUI_UltimateSDUpscale](https://github.com/ssitu/ComfyUI_UltimateSDUpscale) 的正是 Ultimate SD upscale 的节点，但这次想追寻原理，所以使用上面的单纯的节点。

---

## Tile 的弱点 : 边界线

首先，确认一下 Tile 的基本举动。
这里以 Tiled Diffusion 的节点为例说明，但只要掌握了想法什么节点都无所谓。

![](https://gyazo.com/6ff5e63c42367c9ef8ffd8e2a89a61c5){gyazo=image} ![](https://gyazo.com/daf241e640303e9bdbebdbdb06ae4afa){gyazo=image}

[](/workflows/basic-workflows/ultimate-sd-upscale/Tiled_Diffusion_overlap0.json)

* 🟨 将输入图像调整尺寸为 1024 × 1024 px
* 🟩 将瓦片尺寸设定为 512 × 512 px

这个设定的话，左下的小狗的图像被漂亮地 4 分割，
各瓦片作为独立的 image2image 被处理。

如所见那样，瓦片的边界线被清楚地看见，作为画面整体的统一感很弱。  
这就是 Tile 的 **第 1 个弱点**。

---

## 用 overlap 融合边界线

如果介意边界线的话，只要将瓦片稍微重叠配置就好，有这样的构思。
这就是 `tile_overlap`。

![](https://gyazo.com/d6bf859530ae65b7b09ca8a2b2e3006b){gyazo=image} ![](https://gyazo.com/fec3f15e6e4ff7110d3f5ff110f0faa2){gyazo=image}

[](/workflows/basic-workflows/ultimate-sd-upscale/Tiled_Diffusion_overlap256.json)

- 🟩 将 `tile_overlap` 设为 256px
- 不是漂亮地排列瓦片，而是 **故意重叠一半左右** 排列的印象。
  - ![](https://gyazo.com/5f5d51e77955a55c8df142e45d8d12f5){gyazo=image}

重叠的部分，因为像相邻的瓦片彼此共享信息的缓冲那样工作，
所以在推进采样的期间边界融合，瓦片的接缝变得不显眼。

但是，越增加 overlap，因为越会对同一领域多次采样，所以生成花费的时间会增加。

---

## Tile 的另一个弱点：提示词

Tile 还有另一个，大的弱点。  
因为 **在所有的瓦片使用相同的提示词**，所以在没想到的地方生成了多余的东西。

![](https://gyazo.com/b180b2b157a72b030b099dcb6f7c046f){gyazo=image}

在刚才的工作流中，像 `tile_overlap = 0` / `denoise = 1` 这样设定，
并在提示词只写 `一只狗` 试着生成吧。  
于是就像图像那样，在一个图像中出现好几只狗。

因为试图在左上、右上、左下、右下的各瓦片生成一只狗，所以作为整体变成了画四只狗呢。这就是 Tile 的 **第 2 个弱点**。

---

## 每瓦片改变提示词的方案

光说理论的话，可以考虑 **每瓦片写分别的提示词** 的方法。

- 左上瓦片：`狗的右耳, 右眼`
- 右上瓦片：`狗的左耳, 左眼`
- 左下瓦片：`狗的前足`
- 右下瓦片：`狗的后足`

这样的话，哪个瓦片都应该理解“自己只要担当耳朵就好”。

但是，实际上几乎不被使用。

写瓦片数量份的提示词不现实，而且比什么都重要的是 Stable Diffusion 无法理解并分别画出“狗的脸的右上 4 分 of 1”这样的提示词。


---

## 用 ControlNet Tile 固定结构

在这里登场的是 **ControlNet Tile**。

ControlNet Tile 是 **相当强地保持输入图像的结构** 生成新图像的 ControlNet。

虽然不是原样复制像素，但保持 **大体的形状**、**对象的位置关系** 原样，进行重涂纹理和细节那样的举动。

![](https://gyazo.com/a0d8adb6b4cbd35562588238db87f71e){gyazo=image} ![](https://gyazo.com/1bf02bf5900f379735c6a29a7aa1935e){gyazo=image}

[](/workflows/basic-workflows/ultimate-sd-upscale/TiledDiffusion_ControlNet_Tile.json)

在这个工作流中，敢于设为 `tile_overlap = 0`、`denoise = 1` 这种，最容易出现 Tile 的弱点的设定。

即便如此，应该能明白通过通过 ControlNet Tile **保持了相当程度原图像的构图** 进行了放大。

---

## 用 overlap × ControlNet Tile 完成

组合到此为止的要素的话，就能看见实用的 Tile 放大的形状。

![](https://gyazo.com/763660c52564a7af2f5dce9eaa81e20f){gyazo=image} ![](https://gyazo.com/3e4bf6018a4e4500f3bbd14151ce56e7){gyazo=image}

[](/workflows/basic-workflows/ultimate-sd-upscale/Tiled_Diffusion_overlap_ContolNet_Tile.json)

- 🟩 overlap 256px
- 🟦 Controlnet strength 0.6

变成了相当自然的完成呢。

---

## 总结：Ultimate SD upscale 的想法

Ultimate SD upscale 的本质，是以下三根柱子。

- 1. **Tile（瓦片分割）**
   不是原样处理大图像，而是分割为瓦片进行 image2image，
   一边抑制 VRAM 和计算时间的负荷一边谋求超分辨率。

- 2. **overlap（瓦片的重叠）**
   稍微重叠瓦片配置，通过在采样的过程融合边界，
   让接缝不显眼。

- 3. **ControlNet Tile（结构的固定）**
   通过强力保持输入图像的结构进行瓦片放大，
   抑制“狗中的狗”问题，和整体变得零散的问题。

实际的 Ultimate SD upscale 系节点和预设，只不过是将这个想法打包到一个节点而已。

顺便一提，同样的思考也可以应用到视频生成，这次变成分割帧。
将 100 帧的视频分为各 20 帧，overlap 5 帧份这样的感觉呢。
详情这里不处理，但为了降低计算成本细致地分割这点是完全一样的。
