---
layout: page.njk
lang: zh
section: ai-capabilities
slug: cfg
navId: cfg
title: CFG
created: 2026-02-06
updated: 2026-03-02
summary: 决定提示词“生效程度”的机制
seoTitle: "什么是 CFG？图像生成中 CFG 值的参考与作用"
seoDescription: "决定模型多大程度遵循提示词的 CFG（Classifier-Free Guidance）原理。讲解调高调低时的变化与合适取值，以及 CFG=1 时计算量减少、负面提示词失效的原因。"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## 什么是 CFG？

简单来说，CFG（Classifier-Free Guidance）是 **决定“让模型多大程度上遵循提示词”的系数**。

- **值越高**：越会努力贴合提示词
- **值越低**：越容易回到模型本来的“看起来自然的图像”

不过，CFG 只有在文本编码器能正确理解提示词、模型也有足够表现力的情况下才能发挥作用。

真正的主角是提示词、模型和 Conditioning 的设计，CFG 终究只是一个 **微调用的旋钮**。

---

## CFG 的机制

在内部，扩散模型会算出两种“噪声预测”。

- **positive**：带提示词时的预测（conditional）
- **negative**：忽略提示词时的预测（unconditional）

ComfyUI 用下面的公式把两者混合起来。

```text
output = negative + guidance_scale × (positive - negative)
```

这里的 `guidance_scale` 就是 **CFG 的值**。

这个公式表达的是：**把“有提示词”和“无提示词”两个预测之间的差值放大多少倍**。

- **值越大**：`positive - negative` 的差值被放大，结果会被强烈地拉向提示词的方向
- **值越小**：提示词的影响减弱，结果更接近 `negative`（模型本来的倾向）

---

## CFG 值与“恰到好处”

最佳的 CFG 值因模型和采样器而异，不过先用 **4〜7** 就可以了。

前面说过，调高 CFG 可以让提示词更起作用，但这只限于

- 文本编码器理解了提示词的内容
- 模型有能力把这个画面表现出来

的情况。如果做不到这些，CFG 调得再高，生成结果也不会变好。

---

## CFG = 1 的特殊含义

在各种 CFG 值中，`1` 有点特别。
把 `guidance_scale = 1` 代入前面的公式看看。

```text
output = negative + 1 × (positive - negative)
       = positive
```

`negative` 的信息被抵消，**只剩下 `positive`**。

此时会发生以下两件事。

### 1. 计算量减少

由于不再需要 `negative`（unconditional）的推理，与 CFG > 1 时相比，**每一步的计算量几乎可以减半**（取决于具体实现）。

加速图像生成的方法有很多，其中最简单的就是 **使用 CFG = 1**。不过这样就无法再用 CFG 调节提示词的强度，所以很多模型会改用其他参数来代替。

### 2. Negative Prompt 失效

输出只剩下 `positive`，所以 **Negative Prompt 不再起作用**。
无论在 `negative` 一侧写什么文本，都会在公式里被抵消掉。

### 注意事项

所谓的加速模型，大多是以 CFG = 1 为前提训练的。
在这类模型上把 CFG 设得大于 1，**会输出崩坏的图像**，所以请先在模型的发布页面或文档中确认它预期使用的 CFG 值。
