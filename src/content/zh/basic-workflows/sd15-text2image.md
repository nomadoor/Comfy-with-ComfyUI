---
layout: page.njk
lang: zh
section: basic-workflows
slug: sd15-text2image
navId: sd15-text2image
title: "text2image"
created: 2025-12-04
updated: 2026-08-26
summary: "在 Stable Diffusion 1.5 中进行 text2image"
seoTitle: "ComfyUI text2image 入门：基本工作流与节点"
seoDescription: "用 Stable Diffusion 1.5 讲解在 ComfyUI 中由文字生成图像的 text2image 基础，介绍 Load Checkpoint、Empty Latent Image、CLIP Text Encode、KSampler、VAE Decode 各节点的作用。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  gradient:
  image: ""
---

## 什么是 text2image？

输入文本提示词来生成图像。

说得更本质一点，就是用 **文本提示词这个条件** 来控制扩散模型。

这是之后所有工作流的基础，我们慢慢来看。

---

## 图像生成 AI 的原理

下面这些页面做了非常简单的讲解。  
如果完全不了解图像生成 AI 的原理，可以先大致看一下，应该会对参数的含义多一点理解。

- [扩散模型](/zh/ai-capabilities/diffusion-models/)
- [Conditioning](/zh/ai-capabilities/conditioning/)
- [CFG](/zh/ai-capabilities/cfg/)
- [Sampling](/zh/ai-capabilities/sampling/)
- [Latent Diffusion Model 和 VAE](/zh/ai-capabilities/latent-diffusion-vae/)


---

## 下载模型

这里用一切的开端 Stable Diffusion 1.5 来讲解。

- [Comfy-Org/stable-diffusion-v1-5-archive](https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive/blob/main/v1-5-pruned-emaonly-fp16.safetensors)
```text
📂ComfyUI/
  └── 📂models/
      └── 📂checkpoints/
          └── v1-5-pruned-emaonly-fp16.safetensors
```

---

## 工作流

![](/media/basic-workflows/sd15-text2image/legacy_gyazo_363769552b12b2072756280f163183df.png){media=image}

[](/workflows/basic-workflows/sd15-text2image/sd1_5_text2image.json)

## 各个节点

{% mediaRow img="/media/basic-workflows/sd15-text2image/legacy_gyazo_c9e67fd1fd3382708102f366bdf63855.png {media=image}", width=33, align="left" %}
### Load Checkpoint 节点

加载旧格式的 Checkpoint 模型。
- Checkpoint 是把 **扩散模型 / 文本编码器 / VAE** 打包成一个文件的格式。
- 早期大多以这种形式发布，但现在几乎都是分开发布的。
- 所以现在会分别使用 Load Diffusion Model / Load CLIP / Load VAE 等节点。
{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/sd15-text2image/legacy_gyazo_2321a6cfbee1f95261c5bf857068f4b7.png {media=image}", width=33, align="left" %}
### Empty Latent Image 节点

创建一张空的潜在图像 (latent)，作为图像生成的“起点”。
- 指定想要创建的图像尺寸。
{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/sd15-text2image/legacy_gyazo_ba121f352d6252f885c2855cd99ad2f5.png {media=image}", width=33, align="left" %}
### CLIP Text Encode 节点

将文本提示词转换为模型可以理解的 Conditioning。
- 想要生成的内容写成“positive 提示词”，想要避免的内容写成“negative 提示词”，分别放在不同的节点里。
- 不过，这个节点本身并没有 `positive` / `negative` 的概念。
- 输入到下一个 KSampler 的 `positive` 插槽就被视为 positive，输入到 `negative` 插槽就被视为 negative。
{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/sd15-text2image/legacy_gyazo_5404e0e4a52dade391da4cb125b8512e.png {media=image}", width=33, align="left" %}
### KSampler 节点

负责 Sampling（去噪）的节点，是图像生成的核心。

- 把上面的节点（Model / Positive / Negative / Latent）全部连上来使用。
- `seed` : 决定噪声形状的值。设置相同，就能复现同一张图像。
- `control_after_generate` : 决定每次生成后 seed 怎么变化。`fixed` 保持不变，`randomize` 每次随机。
- `steps` : 去除噪声的步数。大多数模型设为 `20` 就足够了。
- `cfg` : 决定提示词的生效程度。
- `sampler_name` : 选择使用哪种采样算法。基本用 `Euler` 就好。
- `scheduler` : 决定每一步按什么顺序、什么强度减少噪声的类型。
- `denoise` : 详见 [KSamplerAdvanced]。text2image 中设为 `1.0`。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/sd15-text2image/legacy_gyazo_73b18040b915d0c1159a79cabbb8d065.png {media=image}", width=33, align="left" %}

### VAE Decode 节点

将 latent 转换为像素图像。

{% endmediaRow %}



## 更改 VAE

说实话，Stable Diffusion 1.5 的 VAE 性能并不是很好。如果使用微调模型，有时会生成颜色奇怪的图像。

后来发布了改良版的 VAE。其他各种 VAE 也有不少，但 Stable Diffusion 1.5 的 VAE 只要用这个，基本就不会出问题。

### 下载 VAE

- [vae-ft-mse-840000-ema-pruned.safetensors](https://huggingface.co/stabilityai/sd-vae-ft-mse-original/blob/main/vae-ft-mse-840000-ema-pruned.safetensors)
```text
📂ComfyUI/
  └── 📂models/
      └── 📂vae/
          └── vae-ft-mse-840000-ema-pruned.safetensors
```

### 工作流

![](/media/basic-workflows/sd15-text2image/legacy_gyazo_897f66c308b3b98440f641ee3d33d50e.png){media=image}

[](/workflows/basic-workflows/sd15-text2image/sd1_5_text2image_vae_ft_mse_840000.json)

- 🟥 添加 `Load VAE` 节点，选择刚才下载的 VAE。
  - 连接到 VAE Decode。

> [!NOTE]
> **今后的工作流将以这个为基础。**

---

## 新手容易卡住的疑问

有些东西大家都当作理所当然，但仔细想想，其实是图像生成特有的、挺奇妙的现象。  
这些在其他页面做了简单的讲解。

  - [即使使用相同的参数，Stable Diffusion web UI 和 ComfyUI 也无法生成相同的图像](/zh/notes/sdwebui-comfyui-reproducibility/)
  - [为什么生成 512px × 512px？](/zh/notes/why-512px/)
  - [为什么只能生成 8 的倍数的分辨率？](/zh/notes/why-multiple-of-8/)
  - Seed 值 "1234" 和 "1235" 是完全不同的东西（待补链接）

---

## 提示词的写法

Stable Diffusion 1.5 / SDXL 使用的文本编码器 **CLIP**，就算客气地说，性能也算不上好。所以为了生成想要的图像，出现了各种被称为提示词工程或“咒语”的技巧。

### 标签罗列

因为 CLIP 其实 **读不懂** 文章，所以即使写成文章形式的提示词也没什么意义。
```
1girl, solo, upper body, looking at viewer, smile, outdoors, sunset
```
所以以前大多像这样，用单纯 **罗列标签** 的方式来写提示词。

另外，动漫类模型直接使用了 Danbooru 这个网站的图像，以及用来整理这些图像的标签。所以大家常常会去查 Danbooru 上用的标签，直接拿来用。

### 质量咒语

```
(best quality, masterpiece, ultra detailed, 8k, HDR, sharp focus, highly detailed)
```

像这样，在最前面拼命堆 **好像能提高质量** 的词。  
现在想想也不知道有没有意义，但当时不知道哪个词到底有多少效果，所以只好一个劲地往上写。

### Negative Prompt

```
bad anatomy, extra fingers, extra limbs, blurry, lowres, jpeg artifacts, ...
```

和刚才相反，把好像会降低质量的词一个劲地写进负面提示词。这些到底有多少效果呢……

### 关注度记法

给提示词中的单词加上 `(red:1.05)` / `(blue:0.9)` 这样的数值，就能改变该单词的重要程度。

CLIP 往往会更重视前面的文本，因此越靠后写的内容越不容易生效。此外，有些词本来就更容易生效，有些则不太容易。

这种关注度记法就是用来手动调整这些的。

> [!NOTE]
> 不过，这只有在 CLIP 理解那个词的时候才管用。  
> 给可能根本不认识的词加上 `(Ghoti:999)` 之类的也没有意义。

![](/media/basic-workflows/sd15-text2image/legacy_gyazo_e13bd76787711c8392334243177e60f3.mp4){media=loop}

- 把光标放在想改变关注度的词上，按 `Ctrl + 箭头↑/↓`，就能以 0.05 为单位调整。
