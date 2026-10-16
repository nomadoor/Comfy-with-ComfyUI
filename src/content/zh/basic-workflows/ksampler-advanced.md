---
layout: page.njk
lang: zh
section: basic-workflows
slug: ksampler-advanced
navId: ksampler-advanced
title: "KSampler (Advanced) 节点"
summary: "可以拆分采样、并在中途切换的 KSampler 进阶版"
seoTitle: "ComfyUI KSampler (Advanced) 使用方法"
seoDescription: "讲解 KSampler (Advanced) 的 add_noise、start_at_step、end_at_step 等参数，以及拆分采样、在中途切换提示词或模型（LoRA）的用法，附工作流。"
created: 2025-12-06
updated: 2026-03-02
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 什么是 KSampler (Advanced)？

![](/media/basic-workflows/ksampler-advanced/legacy_gyazo_6f12a584833996a7a4800a13bb59cc23.png){media=image}

`KSampler (Advanced)` 节点是普通 `KSampler` 节点的升级版，能做到 `KSampler` 能做的一切。
参数方面，去掉了 `denoise`，新增了以下 4 个：
  - `add_noise`
  - `start_at_step`
  - `end_at_step`
  - `return_with_leftsover_noise`

我觉得这是 ComfyUI 里最有意思的功能之一，我们慢慢来看。

---

## 复习扩散模型和 Sampling

![](/media/ai-capabilities/sampling/legacy_gyazo_bf9d6d2e5b528f0b82f9d13e3c18c5fa.png){media=image}

[扩散模型](/zh/ai-capabilities/diffusion-models/) 的原理是：从一张完全的噪声开始，一点点去除噪声，最终生成图像。

以上图为例，第 0 步加入满量的噪声，到第 20 步时噪声全部去除，图像就完成了。

---

## 参数

### `start_at_step` 和 `end_at_step`

在 KSampler (Advanced) 中，可以通过 `start_at_step` 和 `end_at_step` 控制采样从哪一步开始、进行到哪一步为止。

![](/media/basic-workflows/ksampler-advanced/legacy_gyazo_e73ba8cf96fd09b8c5335844858a6c86.png){media=image}

例如把 `start_at_step` 设为 **4**、`end_at_step` 设为 **11** 时，只会对图中白色的部分进行采样。

### `add_noise`

再重复一次：扩散模型的原理是先生成一张噪声图，再一点点去除噪声。

那么，这些噪声是从哪来的呢？  
没错，加噪声这件事也是 KSampler 做的。

在 KSampler (Advanced) 中，可以用 `add_noise` 参数选择是否添加噪声。

![](/media/basic-workflows/ksampler-advanced/legacy_gyazo_64cca8d8e53b01d4315b4aec434dd5ec.png){media=image}

[](/workflows/basic-workflows/ksampler-advanced/sd1_5_ksampler_advanced_add_noise.json)

🟫 假如把 `add_noise` 设为 disable 再进行采样，就会对一张没有噪声的图像不断去噪，结果什么也生成不出来。

---

## 拆分采样

只采样中间的几步、不添加噪声……这些到底有什么用呢？

KSampler (Advanced) 才能做到的一件事，就是把一次采样拆分给 2 个以上的 KSampler 来完成。

![](/media/basic-workflows/ksampler-advanced/legacy_gyazo_27eed74329f52442a046e59245ee9b14.png){media=image}

如图，我们试着让前半段 0 ~ 10step 由 🟪Ksample (Advanced) 完成，11~20step 由 🟨KSampler (Advanced) 完成。

![](/media/basic-workflows/ksampler-advanced/legacy_gyazo_d57cb22d3d85f90010815d19d45bb638.png){media=image}

[](/workflows/basic-workflows/ksampler-advanced/sd1_5_ksampler_advanced_divide.json)

可以看到，即使拆成 2 段，生成的图像也完全一样。
参数有点绕，我们仔细看一下。

{% mediaRow img="/media/basic-workflows/ksampler-advanced/legacy_gyazo_05f6a71f5fe47d5c2257bce31a015d2b.png{media=image}", width=33, align="left" %}
**🟪KSampler (Advanced)**
- `add_noise` : `enable`
- `start_at_step` : `0`
- `end_at_step` : `10`
- `return_with_leftover_noise` : `enable`
  - 在保留剩余噪声的状态下返回 latent。
{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/ksampler-advanced/ksampler_advanced_2nd.png{media=image}", width=33, align="left" %}
**🟨KSampler (Advanced)**
- `add_noise` : `disable`
  - 因为传进来的 latent 还带着剩余噪声，所以这里不再添加噪声。
- `start_at_step` : `10`
  - 与 🟪 的 `end_at_step` 设为相同的值。
- `end_at_step` : `20`
  - 如果设成比总 step 数更大的值，内部会按与 `steps` 相同的值处理。
- `return_with_leftover_noise` : `disable`
{% endmediaRow %}

拆分看起来似乎没什么意义，但有意思的就在这里。

---

## KSampler (Advanced) 才能做的事

### 切换提示词

可以先用提示词 "A"，在采样中途切换到提示词 "B"。

![](/media/basic-workflows/ksampler-advanced/legacy_gyazo_6fd6725df9ce2fd370f7561927bafd4e.png){media=image}

[](/workflows/basic-workflows/ksampler-advanced/sd1_5_ksampler_advanced_prompt_editing.json)

这个工作流中，前 10step 用 `红苹果`、剩下的用 `红兔子` 这个提示词来生成。

{% outputs %}
![](/media/basic-workflows/ksampler-advanced/legacy_gyazo_b9db108769cb804df9df3fe8212e7707.mp4){media=loop}
{% endoutputs %}

为了更直观，我把切换步数每次改变 1 时生成的图像做成了视频。  
原本 100% 是苹果，慢慢地变成了兔子。

> [!NOTE]
> 如果你是 Stable Diffusion web UI 用户，可能会想起 [Prompt Editing](https://scrapbox.io/work4ai/Prompt_Editing)。实际上两者差不多。  
> 其中有每 1 step 切换一次提示词的用法，可惜在 ComfyUI 中，没有自定义节点就做不到。  
> 排 20 个 KSampler (Advanced) 倒是可以做到，不过嘛……没人会这么做吧……

### 切换模型 (LoRA)

同样，也可以在中途切换模型或 LoRA。

![](/media/basic-workflows/ksampler-advanced/legacy_gyazo_f85b62fe88508687bf562fd162fcc569.png){media=image}

[](/workflows/basic-workflows/ksampler-advanced/sd1_5_ksampler_advanced_lora.json)

节点变多了，看起来有点复杂了呢。  
不过仔细看就会发现，只是并排放了 2 个 text2image 工作流，在中途切换而已。

前 6step **不使用 LoRA**，剩下的 **使用 LoRA** 生成。

{% outputs %}
![](/media/basic-workflows/ksampler-advanced/legacy_gyazo_ca0b90aaa5297a515c7bfe8f94e55684.png){media=image}
{% endoutputs %}


这是一个把图像变成像素画的 LoRA，不过 LoRA 除了“变成像素画”这个概念之外，也带有训练素材中那些画的记忆。

因此，并不是把不用 LoRA 时生成的图像原样变成像素画。  
对比一下不使用 LoRA 时和全部 step 都使用 LoRA 时的结果，可以看到不仅变成了像素画风格，连苹果的形状都变了。

**扩散模型在前期的步数中确定形状，在后期描绘细节。**  
确定形状的前几个 step 不使用 LoRA，只在后半段使用 LoRA，就能在发挥模型本身能力的同时，用 LoRA 转换画风。

---

## image2image

从中途开始添加噪声，这正好就是 image2image 的原理。  
那么，接下来就看看 image2image 的原理吧。

→ [image2image](/zh/basic-workflows/sd15-image2image/)
