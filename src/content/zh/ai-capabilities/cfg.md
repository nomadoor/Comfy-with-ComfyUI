---
layout: page.njk
lang: zh
section: ai-capabilities
slug: cfg
navId: cfg
title: CFG
summary: 决定提示词“生效程度”的机制
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## 什么是 CFG？

粗略地说，CFG（Classifier-Free Guidance）是决定 **“多大程度上强制遵循提示词”的系数**。

- **值越高**：越试图强行遵循提示词
- **值越低**：越容易偏向模型原本的“看起来自然的图像”

但是，CFG 只有在文本编码器能正确理解提示词，且模型具有足够的表现力时才能发挥作用。

提示词、模型、Conditioning 的设计是主角，CFG 终究只是 **微调的旋钮**。

---

## CFG 的机制

在内部，扩散模型会计算 2 种“噪点的预测”。

- **positive**：输入提示词的情况（conditional）
- **negative**：忽略提示词的情况（unconditional）

在 ComfyUI 中，通过以下公式将它们混合。

```text
output = negative + guidance_scale × (positive - negative)
```

这里的 `guidance_scale` 就是 **CFG 的值**。

这个公式的意思是，**要将“有提示词”和“无提示词”的预测差分放大多少**。

- **值越大**：`positive - negative` 的差分被强调，会被强力拉向提示词的方向
- **值越小**：提示词的影响变弱，会偏向 `negative`（模型原本的倾向）

---

## CFG 的值和“恰到好处”

根据模型和采样器的不同，最佳的 CFG 值也不同，但暂且使用 **4〜7** 是没有问题的。

虽然说增强 CFG 可以增加提示词的效果，但那仅限于

- 文本编码器理解提示词内容
- 模型拥有表现该图像的性能

的时候。如果做不到这一点，即使提高 CFG，生成结果也不会变好。

---

## CFG = 1 的特殊含义

在 CFG 中， `1` 这个值稍微有点特别。
试着将 `guidance_scale = 1` 代入刚才的公式。

```text
output = negative + 1 × (positive - negative)
       = positive
```

`negative` 的信息被抵消，**只剩下 `positive`**。

此时会发生以下两件事。

### 1. 削减计算量

因为不需要 `negative`（unconditional）的推理，所以与 CFG > 1 时相比，**可以将每步的计算量几乎减半**（取决于实现）。

虽然有各种图像生成高速化的方法，但最简单的就是 **使用 CFG = 1**。但是，由于无法使用 CFG 调整提示词的强度，许多模型通过其他参数进行代替。

### 2. Negative Prompt 失效

因为输出只有 `positive`，所以 **Negative Prompt 不再生效**。
因为无论在 `negative` 侧输入什么文本，在公式上都会被抵消。

### 注意点

被称为高速化模型的东西，大多是以 CFG = 1 为前提进行学习的。
如果在这种模型中设置大于 1 的 CFG 值，**会输出崩坏的图像**，因此请在发布页面或文档中确认模型预想的 CFG 值。
