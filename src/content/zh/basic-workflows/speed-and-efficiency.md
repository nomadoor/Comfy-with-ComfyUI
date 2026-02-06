---
layout: page.njk
lang: zh
section: basic-workflows
slug: speed-and-efficiency
navId: speed-and-efficiency
title: "高速化与轻量化"
summary: "整理扩散模型的高速化・轻量化技术并按目的区分使用"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
tags: []
---

## 什么是高速化与轻量化？

Stable Diffusion 1.5 登场当初，推荐 VRAM 被视为 10GB 左右，RTX 3080 级被报告许多基准测试结果说生成 1 张花费 5 秒前后。  
那也已是如今的往事。由于技术的进步，现在仅 CPU 也能以数秒〜十数秒程度推论，或变得 1 秒间能生成几十张图像了。

扩散模型的历史，在某种意义上就是 **“高速化与轻量化的历史”** 这么说也没关系吧。

在这里想注意的是，下面 2 个是看似相似其实别物。

- **高速化：在相同的硬件，缩短每 1 张的生成时间**
- **轻量化：相同的模型，让其能以更少的 VRAM・内存运转**

使用为了轻量化的技术（量子化 / GGUF 等）的话，即使能削减 VRAM，根据情况推论速度甚至有时会下降。

> 这一页将“轻量化”，作为主要削减模型的 VRAM 使用量的事来处理。

---

## 这一页的粗略地图

首先，按照常见的目的，粗略整理哪一带的技术会有关系。

- 无论如何都想快

  - 蒸馏（Lightning / schnell / 各种 one-step 系）
  - 小型 VAE（TAE 等）
  - Attention 最佳化（FlashAttention 系等）
  - 采样缓存（TeaCache 系等）

- 想削减 VRAM / 无论如何都想运行

  - 量子化（8bit / 4bit）
  - GGUF
  - CPU 卸载 / Block Swap
  - VAE 瓦片化（Tiled VAE / Temporal Tiling）

> 虽然 SageAttention 或 Nunchaku 这样的东西也有名，但因为导入难度高，所以在这个网站不处理。比起辛苦还是选取安定吧。

---

## 主要的高速化・轻量化手法的一览

- 高速化 / 轻量化 是，大概的生效情形（◎ > ○ > △ > ―）
- 导入难度 是“易 / 普 / 难”，是设置的工夫和向既有 workflow 的组装容易度的标准。

| 手法名           | 类型                        | 高速化 | 轻量化                  | 导入难度 |
| ------------- | -------------------------- | --- | -------------------- | ---- |
| 8bit 量子化      | 模型的量子化                    | △〜○ | ○（将 VRAM 粗略削减为一半）   | 易    |
| 4bit 量子化      | 模型的量子化                    | △   | ◎（大大削减 VRAM）       | 难    |
| GGUF          | 专用格式 + 量子化             | △   | ◎（模型容量・削减 VRAM）     | 普    |
| 蒸馏模型         | 模型蒸馏（Lightning / schnell） | ◎   | ―（模型尺寸几乎相同）       | 普    |
| Attention 最佳化 | Attention 实现的置换          | ○   | ―                    | 普〜难  |
| 采样缓存   | 采样的缓存               | ○   | ―                    | 难    |
| 小型 VAE        | 被蒸馏的 VAE                  | ○〜◎ | △（只有 VAE 部分变轻）      | 普    |
| CPU 卸载      | 将模型的一部分向 CPU/RAM 避难        | ✕   | ◎（可将 VRAM 削减到数 GB） | 易    |
| Block Swap    | Transformer 块单位的避难      | ✕   | ◎                    | 易    |
| VAE 瓦片化      | 将图像・视频瓦片分割处理            | ―   | ○（大分辨率时的 VRAM 节约）    | 普    |

---

## 量子化

### 8bit 量子化

8bit 量子化是，通过将模型的权重落入 8bit（INT8 或 FP8 系），将 VRAM 使用量粗略抑制在一般程度的手法。
在许多环境，画质的劣化几乎不在意，速度也收敛在几乎不变，或仅有些许改善的程度。

模型名附有 `fp8` 的检查点等，也可以认为是这个 8bit 系的轻量版。

### 4bit 量子化

4bit 量子化是，更削减比特数大大节约 VRAM 的手法。
相应地权重的再构成和数值误差的影响变大，容易注意到颜色和细节的破损，在现时点无难地看作“实验性的领域”。

虽然也有 SVDQuant，或令那个 4bit 模型高速运转的 Nunchaku 这样的堆栈，但导入和设定的自由度高，在这里不详细处理。

### GGUF

GGUF 是，为了格納量子化完的权重的专用格式。（作为补充）这是以有效地进行来自 CPU 内存 (RAM) 的推论为主眼被设计的，即使在 VRAM 不足的环境也容易让其动作是巨大的特征。

在 ComfyUI 如果导入 [city96/ComfyUI-GGUF](https://github.com/city96/ComfyUI-GGUF)，将 `Load Diffusion Model` 节点置换为 GGUF 用节点，并指定 GGUF 模型就能用。

---

## 蒸馏

蒸馏是，将教师模型的举动教进别的模型（或者 LoRA）的手法，在扩散模型主要以“让其能以少的步数出同等的图像”的目的被使用。

代表例

- [FLUX.1-schnell](/zh/basic-workflows/flux-1/#text2image-flux-1-schnell) 这样的“高速版”检查点
- [Qwen-Image-Lightning](/zh/basic-workflows/qwen-image/#lightning-高速生成-lora) 这样的，高速生成 LoRA

因为有时也能将步数削减到 1〜4 steps 程度，所以成为无论如何想变快时的第一候补。

---

## Attention 最佳化

在扩散模型因为 Self-Attention 是重的处理，所以几个让这里变快的实现被提案了。

- PyTorch 2 系的 `scaled_dot_product_attention`（FlashAttention 系）
- 各种库提供的高速化了的 Attention 内核

如果使用这些实现，有时即使不改变模型本身也能预估数十％的速度提升。
另一方面，也有像 SageAttention 那样需要构建和专用节点的实现，因为导入难度高，在这个网站不处理。

---

## 采样缓存

采样缓存是，“缓存采样途中的一部分步数的结果并再利用，偷懒计算”系的高速化手法的总称。
像 TeaCache 和 MagCache 这样的东西在 ComfyUI 被实现了。

虽然可以在无追加学习下高速化，但与他手法相比容易出现明显的劣化。

---

## 小型 VAE

小型 VAE 是，蒸馏原来的 VAE 让其变小的东西，高速化 decode。  
作为代表例有 TAE（Tiny AutoEncoder 系），被用于实时预览和中间确认。  

---

## CPU 卸载和 Block Swap

CPU 卸载是，在 VRAM 不足时让模型或中间张量的一部分向 CPU 侧（RAM）避难的机制。
代之变得容易避免 CUDA OOM，但因为经由 PCIe 的传送变多，生成时间一口气变长。

在 ComfyUI，根据设定或节点有时在内部自动地进行卸载，有时用户即使没意识到也擅自地动着。
如果感到“每 1 张的时间极其地长”的话，试着怀疑在背面 CPU 卸载或 Block Swap 是否在工作也可以。

Block Swap 是，将 Transformer 分割为块单位，并控制出入让其“只将现在必要的块载入 GPU”的机制。
虽然向 RAM 逃跑这点是一样的，但 Block Swap 是瞄准更细致地抑制 VRAM 的峰值的手法，在大型的视频模型等被使用。

---

## VAE 瓦片化

VAE 瓦片化是，将图像或视频分割为瓦片状并 encode / decode，让每 1 次处理的领域变小的手法。  
例如如果将图像 4 分割处理的话，各瓦片必要的 VRAM 和计算量大体变为 1/4。

多亏了这个，即使是本来内存上不行的尺寸的图像，或超高分辨率的 decode，也变得能设法处理。  
在 VAE decode 异常花费时间的情况，或想处理 4K 以上的图像的情况，请试一试。
