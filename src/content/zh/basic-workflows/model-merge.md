---
layout: page.njk
lang: zh
section: basic-workflows
slug: model-merge
navId: model-merge
title: "模型合并与差分 LoRA"
created: 2025-12-11
updated: 2026-08-26
summary: "合并检查点或 LoRA，制作新模型或差分 LoRA 的方法"
seoTitle: "在 ComfyUI 中合并模型：制作差分 LoRA"
seoDescription: "在 ComfyUI 中合并检查点或 LoRA 制作新模型的方法。介绍 50:50 合并及其弱点、分层合并、LoRA 合并，以及从两个模型的差异提取 LoRA，附工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
 image: "/media/basic-workflows/model-merge/legacy_gyazo_60a8e4bd6e8b13d321cab6372e363baa.png"
tags: []
---

## 什么是模型合并？

准备一个新的检查点模型，方法大致可以分为下面 3 种。

- 从零开始训练
- 对现有模型进行追加训练（微调 / LoRA 等）
- **把现有模型混在一起（合并）**

前两种需要专业知识，准备数据集也很费劲，而第 3 种“合并”在 ComfyUI 上就能轻松完成。

---

## 把检查点按 50:50 混合

首先简单地把 2 个模型各混一半试试吧。

![](/media/basic-workflows/model-merge/modelmergesimple_0_5.png){media=image}

[](/workflows/basic-workflows/model-merge/modelmergesimple_0_5.json)

这个工作流使用 `ModelMergeSimple` 节点，把 2 个检查点按 1:1 合并。

- 🟩 `ModelMergeSimple` 接收 2 个 `MODEL` 输入，按指定比率对权重做线性插值，输出新的模型。
  - `ratio=0.5` 时，可以理解为“模型 A 和模型 B 各混一半”。
- 把输出的 `MODEL` 直接接到 `KSampler`，就能轻松试用这个中间模型。
  - 虽然只是随手把动漫系和写实系混在一起，但居然能画出 2.5 次元那样的效果，挺让人惊讶的。

![](/media/basic-workflows/model-merge/legacy_gyazo_89e876767a48d9acd6c6bb684e6b2495.png){media=image}

- 如果喜欢合并的结果，就接到 `CheckpointSave` 节点，保存为检查点。（上面的工作流中设为了旁路。）
  - 默认保存位置是 `ComfyUI/output/checkpoints/`（Windows 便携版的默认设置）。

---

## 模型合并的弱点

即使把 2 个模型混在一起，参数数量本身也还是“一个模型的量”。
也可以这样理解：加入了某种新能力的同时，原本擅长领域的表现力也相应被削弱了。

把擅长画角色的模型和擅长画风景的模型各混一半，得到的就是一个角色和背景都不上不下的模型。

这样好像没什么用啊…
有没有什么好办法呢？

---

## 分层合并

Stable Diffusion 中“从噪声复原图像的本体”，是一个 U 字形的网络，叫做“U-Net”。
U-Net 由许多层组成，各层似乎有着不同的作用。外侧的层更容易影响纹理和颜色，中央附近的层则更容易影响形状和构图。(cf. [P+](https://prompt-plus.github.io/))

分层合并就是利用这种差异，尽量只混入想要的特征。

![](/media/basic-workflows/model-merge/legacy_gyazo_380e98b86fa2205099cf6f231fc32ac8.png){media=image}

[](/workflows/basic-workflows/model-merge/modelmergeblocks_out_0_5.json)

ComfyUI 的标准节点 `ModelMergeBlocks` 把 U-Net 分为从输入到中央的 `IN`、中央的 `MID`，以及从中央到输出的 `OUT`，可以分别指定比率。

ComfyUI 中还有 `ModelMergeSD1` / `ModelMergeSDXL` 这样可以逐层调整比率的节点。不过要用好它们，大概得靠老师傅的手艺了吧……

---

## 合并 LoRA

LoRA 就像是“可以事后加到原模型上的差分补丁”，所以和检查点一样，LoRA 之间也可以相加合并。

说起来，即使只加载 1 个 LoRA，背后的行为也相当于“把 LoRA 的差分加到基础检查点上，当场做出一个合成模型”。

也就是说，从给 checkpoint 加上 LoRA 的那一刻起，我们其实一直都在做广义上“类似合并的事”呢 (*ﾟ∀ﾟ)

---

## 差分 LoRA

前面讲的都是“把模型混在一起做出新检查点”的方向，反过来，也可以 **从检查点中把“只有差分的部分”提取成 LoRA**。

- 基础模型 `Base`（例：`v1-5-pruned`）
- 自定义检查点 `Base+X`（例：已经学习了特定角色或画风的模型）

这时，`Base+X` 可以粗略看作“基础 + 追加风格 X”。
从中只取出“X 的部分”做成 LoRA，就是 **差分 LoRA**。

- 1. `Base+X - Base = X (← 做成 LoRA 的差分)`
- 2. 把这个差分压缩成 LoRA 格式

### 工作流

![](/media/basic-workflows/model-merge/legacy_gyazo_0b5930d9de58a61acd5bf63da5927634.png){media=image}

[](/workflows/basic-workflows/model-merge/modelmergesubtract_save_lora.json)

- 🟩 把想取差分的模型输入到 `ModelMergeSubtract` 节点。
  - 计算的是 `model1 - model2`。
- 🟨 上面没有用到，不过也有取文本编码器差分的 `CLIPMergeSubtract` 节点。
  - 文本编码器相当敏感，所以也有可能变差。
- 用 `Extract and Save Lora` 节点保存为 LoRA。
  - `rank` 越大，差分保存得越忠实，但模型体积也会相应变大。
  - 大致参考：风格差分用 8〜32 左右，想从差别很大的模型里大幅提取差分时用 64 以上，印象中多是这样区分使用的。
  - 提取出的 LoRA 模型保存在 `\ComfyUI\output\loras` 中。

### 测试差分 LoRA
![](/media/basic-workflows/model-merge/legacy_gyazo_c499e4f0a683dc0ddd573312f6897dc8.png){media=image}

[](/workflows/basic-workflows/model-merge/sd1_5_text2image_with_lora.json)

- 这次差分比较大，只加 LoRA 并不能完美还原，不过虽然是 SD1.5，也能生成相当像样的图像了。

---

## 参考链接

- [ComfyUI Wiki/Model Merging Examples](https://comfyui-wiki.com/en/workflows/model-merging)
