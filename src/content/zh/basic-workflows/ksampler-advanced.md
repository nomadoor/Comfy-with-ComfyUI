---
layout: page.njk
lang: zh
section: basic-workflows
slug: ksampler-advanced
navId: ksampler-advanced
title: "KSampler (Advanced) 节点"
created: 2026-02-06
updated: 2026-03-02
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 什么是 KSampler (Advanced)？

![](https://gyazo.com/6f12a584833996a7a4800a13bb59cc23){gyazo=image}

`KSampler (Advanced)` 节点，是无印 `KSampler` 节点的上位互换。
参数 `denoise` 消失增加了以下的 4 个。
  - `add_noise`
  - `start_at_step`
  - `end_at_step`
  - `return_with_leftsover_noise`

在 ComfyUI 之中，也认为是原本最有趣的功能之一，慢慢看吧。

---

## 扩散模型和 Sampling 的复习

![](https://gyazo.com/bf9d6d2e5b528f0b82f9d13e3c18c5fa){gyazo=image}

[扩散模型](/zh/ai-capabilities/diffusion-models/) 是，通过从完全的噪声，徐徐去除噪声从而生成图像的机制。

如果是上的图像，在第 0 步追加满量的噪声，在第 20 步所有的噪声被去除，图像完成。

---

## 参数

### `start_at_step` 和 `end_at_step`

在 KSampler (Advanced)，通过设定 `start_at_step` 和 `end_at_step`，可以控制从哪里开始采样，推进采样到哪里。

![](https://gyazo.com/e73ba8cf96fd09b8c5335844858a6c86){gyazo=image}

例如，设定 `start_at_step` 为 **4** / `end_at_step` 为 **11** 时，对图像的白色部分只进行采样。

### `add_noise`

虽然重复几次，扩散模型是制作噪声图像，徐徐去除噪声的机制。

那么，那个噪声从哪里来呢？  
是的，追加噪声的也是 KSampler 进行的。

在 KSampler (Advanced)，可以用 `add_noise` 参数选择追加还是不追加噪声。

![](https://gyazo.com/64cca8d8e53b01d4315b4aec434dd5ec){gyazo=image}

[](/workflows/basic-workflows/ksampler-advanced/SD1.5_KSampler_(Advanced)-add_noise.json)

🟫 假如设定 `add_noise` 为 disable 进行采样，因为从没有噪声的图像持续去除噪声所以什么都不生成。

---

## 分割采样

只采样中间的步数，或不追加噪声，到底在哪里有用呢？

正因为是这个 KSampler (Advanced) 才能做的事，有将一个采样分割为 2 个以上的 KSampler，这样的事。

![](https://gyazo.com/27eed74329f52442a046e59245ee9b14){gyazo=image}

如图，前半 0 ~ 10step 用 🟪Ksample (Advanced)、11~20step 用 🟨KSampler (Advanced) 进行试一下吧。

![](https://gyazo.com/d57cb22d3d85f90010815d19d45bb638){gyazo=image}

[](/workflows/basic-workflows/ksampler-advanced/SD1.5_KSampler_(Advanced)-divide.json)

我想知道即使分割为 2 个生成的图像也完全一样。
因为参数稍微麻烦，仔细看。

{% mediaRow img="https://gyazo.com/05f6a71f5fe47d5c2257bce31a015d2b{gyazo=image}", width=33, align="left" %}
**🟪KSampler (Advanced)**
- `add_noise` : `enable`
- `start_at_step` : `0`
- `end_at_step` : `10`
- `return_with_leftover_noise` : `enable`
  - 保持残留噪声的状态返回 latent。
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/172843d68f88326455f5d66176286de0 {gyazo=image}", width=33, align="left" %}
**🟨KSampler (Advanced)**
- `add_noise` : `disable`
  - 因为残留噪声的 latent 被渡过来，所以在这里不追加噪声。
- `start_at_step` : `10`
  - 设为与 🟪 的 `end_at_step` 相同。
- `end_at_step` : `20`
  - 设定为比整体 step 数大的值的情况，内部变得与 `steps` 相同。
- `return_with_leftover_noise` : `disable`
{% endmediaRow %}

虽然分割似乎没有意义，但这很有趣。

---

## 正因为是 KSampler (Advanced) 能做的事

### 提示词的切换

最初使用 "A" 的提示词，从采样途中切换为 "B" 的提示词，能做这样的事。

![](https://gyazo.com/6fd6725df9ce2fd370f7561927bafd4e){gyazo=image}

[](/workflows/basic-workflows/ksampler-advanced/SD1.5_KSampler_(Advanced)-Prompt_Editing.json)

在这个 workflow，最初的 10step 用 `红苹果`、剩下用 `红兔子` 这样的提示词生成。

![](https://gyazo.com/b9db108769cb804df9df3fe8212e7707){gyazo=loop}

为了更易懂，试着将切换步数每改变 1 时的生成图像做成了视频。  
曾是 100% 苹果的东西，徐徐变成了兔子。

> 如果是 Stable Diffusion web UI 用户，也许会想起 [Prompt Editing](https://scrapbox.io/work4ai/Prompt_Editing)。实际上，是相似的东西。  
> 在那之中有每 1steps 切换提示词的东西，但在 ComfyUI，很遗憾如果没有自定义节点就无法做。  
> 如果排列 20 个 KSampler (Advanced) 的话能做，但，嘛…不做呢……

### 模型 (LoRA) 的切换

同样地，也可以从途中切换模型或 LoRA。

![](https://gyazo.com/f85b62fe88508687bf562fd162fcc569){gyazo=image}

[](/workflows/basic-workflows/ksampler-advanced/SD1.5_KSampler_(Advanced)-LoRA.json)

节点增加变得稍微麻烦了呢。  
只是，仔细看的话 text2image 的 workflow 排列了 2 个，只是在途中切换而已。

以 **无 LoRA** 生成最初的 6step，以 **有 LoRA** 生成剩余。

![](https://gyazo.com/ca0b90aaa5297a515c7bfe8f94e55684){gyazo=image}


这是变成像素画的 LoRA，但 LoRA 以外“变成像素画”的概念之外，也持有作为学习素材的画的记忆。

因此，并不是无 LoRA 生成时的图像原样变成像素画。  
试着对比看不使用 LoRA 时和适用全 step 时，不仅变成了像素画风格，连苹果的形状都变了。

**扩散模型，在序盘的步数制作形，在后盘描绘细部。**  
制作形的最初 step 不挂 LoRA，只在后半挂 LoRA，从而可以活用模型本来的能力并进行由 LoRA 带来的画风变换。

---

## image2image

从途中追加噪声，这就原样连接 image2image 的机制。  
那么，就这样看看 image2image 的机制吧。

→ [image2image](/zh/basic-workflows/sd15-image2image/)
