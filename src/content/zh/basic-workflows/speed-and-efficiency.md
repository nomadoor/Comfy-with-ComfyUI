---
layout: page.njk
lang: zh
section: basic-workflows
slug: speed-and-efficiency
navId: speed-and-efficiency
title: "高速化与轻量化"
created: 2026-02-06
updated: 2026-03-02
summary: "整理扩散模型的加速与轻量化技术，按目的选用"
seoTitle: "ComfyUI 生成加速与轻量化方法汇总"
seoDescription: "按目的整理扩散模型的加速与轻量化技术：8bit / 4bit 量化、GGUF、蒸馏、Attention 优化、采样缓存等，以及想省显存或提速时如何选择。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
tags: []
---

## 什么是高速化与轻量化？

Stable Diffusion 1.5 刚推出时，推荐 VRAM 大约是 10GB，当时很多基准测试结果显示，RTX 3080 级别的显卡生成 1 张图要 5 秒左右。  
那都是过去的事了。随着技术进步，现在只用 CPU 也能在几秒到十几秒内完成推理，甚至 1 秒能生成几十张图像。

说扩散模型的历史在某种意义上就是 **“高速化与轻量化的历史”**，应该也不为过。

这里要注意，下面这 2 个看起来相似，其实是两回事。

- **高速化：在同样的硬件上，缩短每张图的生成时间**
- **轻量化：让同一个模型用更少的 VRAM 和内存跑起来**

使用轻量化技术（量子化 / GGUF 等）虽然能减少 VRAM，但有时推理速度反而会下降。

> [!NOTE]
> 本页说的“轻量化”，主要是指减少模型的 VRAM 占用。

---

## 本页的大致地图

先按常见的目的，大致整理一下各自和哪些技术有关。

- 总之想要更快

  - 蒸馏（Lightning / schnell / 各种 one-step 系）
  - 小型 VAE（TAE 等）
  - Attention 优化（FlashAttention 系等）
  - 采样缓存（TeaCache 系等）

- 想减少 VRAM / 总之想先跑起来

  - 量子化（8bit / 4bit）
  - GGUF
  - CPU 卸载 / Block Swap
  - VAE 分块（Tiled VAE / Temporal Tiling）

> [!NOTE]
> SageAttention 和 Nunchaku 之类的也很有名，但安装难度高，本站不做介绍。与其折腾，不如求稳。

---

## 主要的加速与轻量化方法一览

- 高速化 / 轻量化 表示大致的效果（◎ > ○ > △ > ―）
- 导入难度 分为“易 / 普 / 难”，大致表示安装设置的麻烦程度，以及加进现有工作流的难易度。

| 方法             | 类型                        | 高速化 | 轻量化                  | 导入难度 |
| ------------- | -------------------------- | --- | -------------------- | ---- |
| 8bit 量子化      | 模型量子化                    | △〜○ | ○（VRAM 大约减半）   | 易    |
| 4bit 量子化      | 模型量子化                    | △   | ◎（大幅减少 VRAM）       | 难    |
| GGUF          | 专用格式 + 量子化             | △   | ◎（减少模型体积和 VRAM）     | 普    |
| 蒸馏模型         | 模型蒸馏（Lightning / schnell） | ◎   | ―（模型大小基本不变）       | 普    |
| Attention 优化 | 替换 Attention 实现          | ○   | ―                    | 普〜难  |
| 采样缓存   | 缓存采样结果               | ○   | ―                    | 难    |
| 小型 VAE        | 蒸馏后的 VAE                  | ○〜◎ | △（只有 VAE 部分变轻）      | 普    |
| CPU 卸载      | 把模型的一部分挪到 CPU/RAM        | ✕   | ◎（VRAM 可降到几 GB） | 易    |
| Block Swap    | 以 Transformer 块为单位挪出      | ✕   | ◎                    | 易    |
| VAE 分块      | 把图像、视频分块处理            | ―   | ○（大分辨率时节省 VRAM）    | 普    |

---

## 量子化

### 8bit 量子化

8bit 量子化是把模型权重降到 8bit（INT8 或 FP8 系），把 VRAM 占用大致压到一半左右的方法。
在大多数环境下，画质劣化几乎察觉不到，速度也基本不变，或者略有提升。

模型名带 `fp8` 的 checkpoint 等，也可以看作这类 8bit 的轻量版。

### 4bit 量子化

4bit 量子化则进一步减少位数，大幅节省 VRAM。
相应地，权重重建和数值误差的影响也会变大，颜色和细节容易明显崩坏，目前把它看作“实验性领域”比较稳妥。

也有 SVDQuant，以及让这类 4bit 模型高速运行的 Nunchaku 等方案，但安装和设置的自由度很高，这里不详细介绍。

### GGUF

GGUF 是用来存放已量子化权重的专用格式。（补充一下）它的设计重点是高效地从 CPU 内存 (RAM) 进行推理，一大特点是在 VRAM 不足的环境下也比较容易跑起来。

在 ComfyUI 中，安装 [city96/ComfyUI-GGUF](https://github.com/city96/ComfyUI-GGUF) 后，只要把 `Load Diffusion Model` 节点换成 GGUF 用的节点，再指定 GGUF 模型就能用。

---

## 蒸馏

蒸馏是把教师模型的行为教给另一个模型（或 LoRA）的方法，在扩散模型中主要用于“用更少的步数生成同等质量的图像”。

代表例子

- [FLUX.1-schnell](/zh/basic-workflows/flux-1/#text2image-flux-1-schnell) 这样的“高速版” checkpoint
- [Qwen-Image-Lightning](/zh/basic-workflows/qwen-image/#lightning-高速生成-lora) 这样的高速生成 LoRA

有时能把步数减到 1〜4 steps 左右，所以是“总之想要更快”时的首选。

---

## Attention 优化

在扩散模型中，Self-Attention 是很重的处理，所以已经有好几种让它变快的实现。

- PyTorch 2 系的 `scaled_dot_product_attention`（FlashAttention 系）
- 各种库提供的高速 Attention 内核

使用这些实现，有时不换模型也能有几十％的提速。
另一方面，也有像 SageAttention 这样需要自行编译和专用节点的实现，安装难度高，本站不做介绍。

---

## 采样缓存

采样缓存是一类加速方法的统称，做法是“把采样途中部分步骤的结果缓存起来重复使用，偷懒少算一些”。
ComfyUI 中已经实现了 TeaCache、MagCache 等。

它不需要额外训练就能加速，但和其他方法相比，更容易出现明显的劣化。

---

## 小型 VAE

小型 VAE 是把原来的 VAE 蒸馏变小后的版本，可以加快 decode。  
代表例子是 TAE（Tiny AutoEncoder 系），常用于实时预览和查看中间结果。  

---

## CPU 卸载和 Block Swap

CPU 卸载是在 VRAM 不够时，把模型或中间张量的一部分暂时挪到 CPU 侧（RAM）的机制。
这样更容易避免 CUDA OOM，但经由 PCIe 的传输会变多，生成时间也会一下子变长。

ComfyUI 有时会根据设置或节点在内部自动卸载，用户没注意到它就已经在运作了。
如果觉得“每张图怎么花这么久”，不妨怀疑一下是不是后台的 CPU 卸载或 Block Swap 在起作用。

Block Swap 是把 Transformer 按块拆分，控制它们的进出，做到“只把当前需要的块放到 GPU 上”的机制。
两者都是把数据挪到 RAM，但 Block Swap 的目标是更细致地压低 VRAM 峰值，常用于大型视频模型等。

---

## VAE 分块

VAE 分块是把图像或视频切成小块分别 encode / decode，以缩小每次处理区域的方法。  
比如把图像分成 4 块处理，每块所需的 VRAM 和计算量大约就是 1/4。

这样一来，即使是原本内存撑不住的尺寸，或者超高分辨率的 decode，也能勉强处理了。  
如果 VAE decode 花的时间异常地长，或者想处理 4K 以上的图像，请试一试。
