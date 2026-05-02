---
layout: page.njk
lang: zh
section: basic-workflows
slug: model-merge
navId: model-merge
title: "模型合并与差分 LoRA"
created: 2026-02-06
updated: 2026-03-02
summary: "合并检查点或 LoRA 制作新模型或差分 LoRA 的方法"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
 image: "https://i.gyazo.com/60a8e4bd6e8b13d321cab6372e363baa.png"
tags: []
---

## 什么是模型合并？

准备新的检查点模型的方法，粗略分为下面 3 个。

- 从 0 学习
- 追加学习既有模型（微调 / LoRA 等）
- **混合既有模型彼此 (合并)**

上 2 个专业知识和数据集的准备很麻烦，但第 3 个“合并”，可以在 ComfyUI 上简单地进行。

---

## 以 50:50 混合检查点

首先单纯地将 2 个模型混合一半吧。

![](https://gyazo.com/152fa7235f2878021cd924594b2d2bf1){gyazo=image}

[](/workflows/basic-workflows/model-merge/ModelMergeSimple_0.5.json)

在这个工作流中，使用 `ModelMergeSimple` 节点将 2 个检查点以 1:1 合并。

- 🟩 `ModelMergeSimple` 接收 2 个 `MODEL` 输入，输出以指定的比率线性插补了权重的新模型。
  - `ratio=0.5` 时，可以认为是“将模型 A 和模型 B 各混了一半的东西”。
- 如果将输出的 `MODEL` 原样连接到 `KSampler`，就能简单地尝试中间模型。
  - 虽然只是杂乱地混合了动漫系和真实系，但能做到像 2.5 次元那样的表现令人吃惊呢。

![](https://gyazo.com/89e876767a48d9acd6c6bb684e6b2495){gyazo=image}

[](/workflows/basic-workflows/model-merge/50-50-save.json)

- 如果中意合并结果，连接到 `CheckpointSave` 节点作为检查点保存。(在上面的工作流旁路着。)
  - 保存目的地默认为 `ComfyUI/output/checkpoints/`（Windows 便携版的标准设定）。

---

## 模型合并的弱点

即使混合 2 个模型，参数的数量本身仍是“一个模型份”。
在加上什么新的力量的一方，也可以认为那分量的原来的拿手领域的表现力被削减了。

混合各一半擅长画角色的模型和擅长画风景的模型的话，角色和背景都变成不上不下的模型。

这样似乎不太有用呢…
没有什么好方法吗？

---

## 阶层合并

Stable Diffusion 的“从噪声复原图像的本体”是名为 U 字形的网络“U-Net”的东西。
这是阶梯状的，从几个研究知道每层似乎作用不同。(cf. [P+](https://prompt-plus.github.io/))

- 浅层 … 靠拢纹理・颜色・细微的图案
- 深层 … 靠拢形状・构图・布局

也就是说，在只想要模型 B 的色调时，好像只要只将浅层向模型 B 靠拢合并就好。
这就是阶层合并的机制。

![](https://gyazo.com/380e98b86fa2205099cf6f231fc32ac8){gyazo=image}

[](/workflows/basic-workflows/model-merge/ModelMergeBlocks_out_0.5.json)

ComfyUI 的标准节点 `ModelMergeBlocks`，可以将 U-Net 整体粗略分为 **IN / MID / OUT 的 3 块** 指定比率。

- `IN` … 输入侧的块（比较浅的层）
- `MID` … 中间的瓶颈附近
- `OUT` … 输出侧的块（比较深的层）

实际上 UNet 有几十层，通过社区的研究，哪层似乎对什么有影响，大体已经知道了。

在 ComfyUI，也有 `ModelMergeSD1`/`ModelMergeSDXL` 这样，虽然能一层层调整比率的节点。但，能运用自如这个是工匠技艺吧……

---

## LoRA 的合并

LoRA 因为是像“能对原来的模型后加的差分补丁”那样的东西，所以与检查点彼此一样，LoRA 彼此也能相加合并。

在那以前，即使只读取 1 个 LoRA，背面也变成了“向基础的检查点加进 LoRA 的差分，当场制作合成模型”那样的举动。

也就是说，在向 checkpoint 适用 LoRA 的时间点，我们已经一直在做广义上的“像合并的事”了呢 (*ﾟ∀ﾟ)

---

## 差分 LoRA

到此为止的话题是“混合模型彼此制作新检查点”的方向，反过来也有 **从检查点将“只差分”作为 LoRA 抽出** 这样的构思。

- 基础模型 `Base`（例：`v1-5-pruned`）
- 自定义检查点 `Base+X`（例：学习结束特定角色或画风的模型）

这时，`Base+X` 可以粗略视为“基础 + 追加风格 X”。
从这里取出“只 X 的部分”做成 LoRA，就是 **差分 LoRA**。

- 1. `Base+X - Base = X (← 做成 LoRA 的差分)`
- 2. 将那个差分压缩为 LoRA 格式

### 工作流

![](https://gyazo.com/0b5930d9de58a61acd5bf63da5927634){gyazo=image}

[](/workflows/basic-workflows/model-merge/ModelMergeSubtract_Save-LoRA.json)

- 🟩 输入想取 `ModelMergeSubtract` 节点的差分的模型。
  - 是 `model1 - model2`。
- 🟨 虽然上面没使用，但也有取文本编码器的差分的 `CLIPMergeSubtract` 节点。
  - 因为文本编码器相当严峻所以也有可能恶化。
- 在 `Extract and Save Lora` 节点作为 LoRA 保存。
  - `rank` 越大越能忠实地保存差分，但那分量模型尺寸变大。
  - 作为标准，如果是风格差分是 8〜32 左右，想从相当不同的模型大块取差分时是 64 以上，印象中大多这样区分使用。
  - 被抽出的 LoRA 模型，被保存在 `\ComfyUI\output\loras`。

### 差分 LoRA 的测试
![](https://gyazo.com/c499e4f0a683dc0ddd573312f6897dc8){gyazo=image}

[](/workflows/basic-workflows/model-merge/SD1.5_text2image_with_LoRA.json)

- 这次因为差分大，虽然并不是仅适用 LoRA 就能完美再现，但虽是 SD1.5，变得能生成像那样的图像了呢。

---

## 参考链接

- [ComfyUI Wiki/Model Merging Examples](https://comfyui-wiki.com/en/workflows/model-merging)
