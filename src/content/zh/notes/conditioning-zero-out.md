---
layout: page.njk
lang: zh
section: notes
slug: conditioning-zero-out
navId: conditioning-zero-out
title: "Conditioning Zero Out 是什么？"
created: 2026-09-28
updated: 2026-09-28
noteTags: ["faq", "conditioning", "cfg"]
summary: "为什么 CFG 1.0 工作流会使用 Conditioning Zero Out"
seoTitle: "什么是 Conditioning Zero Out？CFG 1.0 下使用的理由"
seoDescription: "最近工作流中常见的 Conditioning Zero Out 节点的作用。讲解 CFG 1.0 时 negative 被忽略的原因、与连接 positive 或空提示词的区别，以及使用 Zero Out 的好处。"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: "/media/notes/conditioning-zero-out/conditioning_zero_out_hero.png"
---

![](/media/notes/conditioning-zero-out/conditioning_zero_out_hero.png){media=image}

最近的工作流里，经常会看到一个叫 `Conditioning Zero Out` 的节点。

这到底是什么？

简单来说，**它是在 CFG 1.0 时，用来填上不会被使用的 `negative` 输入的节点**。

为什么需要这样的节点？下面按顺序来看。

## CFG 1.0 会忽略 Negative

把 [CFG](/zh/ai-capabilities/cfg/) 的计算公式简化后，可以写成这样：

```text
output = negative + CFG × (positive - negative)
```

把 CFG 设为 1.0：

```text
output = negative + 1.0 × (positive - negative)
       = positive
```

Negative 就这样干干净净地消失了。

也就是说，CFG 为 1.0 时，无论 Negative 里放什么，结果都不会改变。

与此同时，Negative 一侧的计算可以整个省掉，所以生成速度会快不少。挺好。

最近很多模型都通过 CFG 蒸馏，学习了如何在 CFG 1.0 下正常生成。因此，使用 CFG 1.0 的工作流也越来越常见。

## 但 KSampler 仍然有 negative 输入

CFG 为 1.0 时不会用到 Negative。

但 `KSampler` 依然有一个 `negative` 输入，如果什么都不连接，就会报错。

虽然生成时不会使用，但仍然需要先连接某种 conditioning。

反正都会被忽略，接什么得到的结果都一样。下面看看几种做法。

### 直接连接 Positive

最简单的做法，就是把 Positive Prompt 的 conditioning 也直接接到 `negative`。

![](/media/notes/conditioning-zero-out/krea2_positive_as_negative.png){media=image}

[](/workflows/notes/conditioning-zero-out/krea2_positive_as_negative.json)

这样也能正常运行。

不过从工作流来看，总觉得有点奇怪。刚接触的人看到以后，大概会想：

“为什么 negative 里接的是 positive？”

而且这种做法还有另一个奇怪的地方。

如果 `negative` 和 `positive` 输入相同的 conditioning：

```text
output = positive + CFG × (positive - positive)
       = positive + CFG × 0
       = positive
```

无论 CFG 设成多少，结果都不会变化。

如果确定只在 CFG 1.0 下使用，那没有问题。但之后尝试调高 CFG，却发现什么都没有发生，就有点容易让人困惑。

### 连接空提示词

另一种做法，是让 `CLIP Text Encode` 保持为空，再把它的 conditioning 接到 `negative`。

![](/media/notes/conditioning-zero-out/krea2_empty_negative_prompt.png){media=image}

[](/workflows/notes/conditioning-zero-out/krea2_empty_negative_prompt.json)

这种接法看起来更容易理解。

不过，只是为了生成一份根本不会使用的 conditioning，却让 Text Encoder 又运行了一次。

虽然负担不算大，但为了不用的东西增加处理，还是有点浪费。

## 这时就轮到 Conditioning Zero Out 了

这时，`Conditioning Zero Out` 就派上用场了。

这个节点只会把输入 conditioning 里的所有数值替换成 0。

![](/media/notes/conditioning-zero-out/krea2_conditioning_zero_out.png){media=image}

[](/workflows/notes/conditioning-zero-out/krea2_conditioning_zero_out.json)

在 CFG 1.0 下，得到的生成结果当然和前面一样。

而且：

- 不需要为了 Negative 再运行一次 Text Encoder
- 从工作流外观就能看出，“Negative 里接的是没有意义的数据”
- 和直接复用 Positive 不同，调高 CFG 后结果会正常变化

可以说是取了两种做法的优点。

## 空提示词和 Zero Out 的区别

空提示词和 `Conditioning Zero Out` 听起来似乎差不多，但它们生成的数据完全不同。

实际在 ComfyUI 里看看里面的数值吧。

![](/media/notes/conditioning-zero-out/clip_text_encoder_conditioning_zero_out.png){media=image}

由 `Hello!` 这个提示词生成的 conditioning，里面自然会有各种数值。

`Conditioning Zero Out` 会把这些数值全部替换成 0。

那么，空提示词又会怎样？

![](/media/notes/conditioning-zero-out/clip_text_encoder_empty.png){media=image}

里面并不全是 0。

什么都没写，看起来应该会得到“什么都没有的 conditioning”。但对 Text Encoder 来说，“什么都没写的句子”本身也有一定含义。

CFG 为 1.0 时，Negative 本身不会被使用，所以两种方法得到的生成结果相同。

但把 CFG 调到 1.0 以上后，结果就会出现差异。只需要注意这一点。
