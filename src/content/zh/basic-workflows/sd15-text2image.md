---
layout: page.njk
lang: zh
section: basic-workflows
slug: sd15-text2image
navId: sd15-text2image
title: "text2image"
created: 2025-12-04
updated: 2026-08-26
summary: "Stable Diffusion 1.5 的 text2image"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  gradient:
  image: ""
---

## 什么是 text2image？

输入文本提示词，生成图像。

从本质上讲，是通过 **文本提示词这一条件** 来控制扩散模型。

这是接下来制作的所有工作流的基础。让我们慢慢来看。

---

## 图像生成 AI 的机制

虽然非常简单，但在这里有解说。  
完全不了解图像生成 AI 机制的人，请简单浏览一下。应该会更能理解参数的含义。

- [扩散模型](/zh/ai-capabilities/diffusion-models/)
- [Conditioning](/zh/ai-capabilities/conditioning/)
- [CFG](/zh/ai-capabilities/cfg/)
- [Sampling](/zh/ai-capabilities/sampling/)
- [Latent Diffusion Model 和 VAE](/zh/ai-capabilities/latent-diffusion-vae/)


---

## 模型的下载

我们将使用作为一切开端的 Stable Diffusion 1.5 进行解说。

- [Comfy-Org/stable-diffusion-v1-5-archive](https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive/blob/main/v1-5-pruned-emaonly-fp16.safetensors)
```text
📂ComfyUI/
  └── 📂models/
      └── 📂checkpoints/
          └── v1-5-pruned-emaonly-fp16.safetensors
```

---

## 工作流

![](https://gyazo.com/363769552b12b2072756280f163183df){gyazo=image}

[](/workflows/basic-workflows/sd15-text2image/SD1.5_text2image.json)

## 关于各节点

{% mediaRow img="https://gyazo.com/c9e67fd1fd3382708102f366bdf63855 {gyazo=image}", width=33, align="left" %}
### Load Checkpoint 节点

加载旧格式的 Checkpoint 模型。
- Checkpoint 是将 **扩散模型 / 文本编码器 / VAE** 打包在一个文件中的东西。
- 初期经常以这种形式发布，但现在几乎都是单独发布的。
- 因此，将会使用 Load Diffusion Model / Load CLIP / Load VAE 等单独的节点。
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/2321a6cfbee1f95261c5bf857068f4b7 {gyazo=image}", width=33, align="left" %}
### Empty Latent Image 节点

制作作为图像生成“出发点”的、空的潜在图像 (latent)。
- 指定想要创建的图像尺寸。
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/ba121f352d6252f885c2855cd99ad2f5 {gyazo=image}", width=33, align="left" %}
### CLIP Text Encode 节点

将文本提示词转换为模型可以理解的 Conditioning。
- 将想要生成的内容作为“positive 提示词”，想要避免的内容作为“negative 提示词”，准备在不同的节点中。
- 不过，这个节点本身并没有 `positive` / `negative` 的概念。
- 输入到下一个 KSampler 的 `positive` 插槽就被视为 positive，输入到 `negative` 插槽就被视为 negative。
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/5404e0e4a52dade391da4cb125b8512e {gyazo=image}", width=33, align="left" %}
### KSampler 节点

进行 Sampling（去噪），是图像生成核心的节点。

- 连接上述所有节点（Model / Positive / Negative / Latent）来使用。
- `seed` : 决定噪声形状的值。如果是相同的设置，可以重现相同的图像。
- `control_after_generate` : 决定每次图像生成如何改变 seed。`fixed` 是保持原样，`randomize` 是每次随机。
- `steps` : 消除噪声的步数。大多数模型通过 `20` 就足够了。
- `cfg` : 决定提示词的生效程度。
- `sampler_name` : 选择使用哪种采样算法。基本用 `Euler` 就好。
- `scheduler` : 在各步骤中以什么顺序・强度减少噪声的种类。
- `denoise` : 详情在 [KSamplerAdvanced] 中解说。在 text2image 中设为 `1.0`。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/73b18040b915d0c1159a79cabbb8d065 {gyazo=image}", width=33, align="left" %}

### VAE Decode 节点

将 latent 转换为像素图像。

{% endmediaRow %}



## 更改 VAE

说实话，Stable Diffusion 1.5 的 VAE 性能并不是很好。如果使用微调模型，有时会生成颜色奇怪的图像。

之后，发布了改良版的 VAE。此外还发布了各种各样的 VAE，但 Stable Diffusion 1.5 的 VAE 只要使用这个几乎不会出问题。

### VAE 的下载

- [vae-ft-mse-840000-ema-pruned.safetensors](https://huggingface.co/stabilityai/sd-vae-ft-mse-original/blob/main/vae-ft-mse-840000-ema-pruned.safetensors)
```text
📂ComfyUI/
  └── 📂models/
      └── 📂vae/
          └── vae-ft-mse-840000-ema-pruned.safetensors
```

### 工作流

![](https://gyazo.com/897f66c308b3b98440f641ee3d33d50e){gyazo=image}

[](/workflows/basic-workflows/sd15-text2image/SD1.5_text2image_vae-ft-mse-840000.json)

- 🟥 添加 `Load VAE` 节点，选择刚才下载的 VAE。
  - 连接到 VAE Decode。

> **今后的工作流将以这个为基础。**

---

## 初学者容易受挫的疑问

虽然被理所当然地对待，但仔细一想，有一些是图像生成特有的、不可思议的东西。  
关于这些在别的页面简单地进行了解说。

  - [即使使用相同的参数，Stable Diffusion web UI 和 ComfyUI 也无法生成相同的图像](/zh/notes/sdwebui-comfyui-reproducibility/)
  - [为什么生成 512px × 512px？](/zh/notes/why-512px/)
  - [为什么只能生成 8 的倍数的分辨率？](/zh/notes/why-multiple-of-8/)
  - Seed 值 "1234" 和 "1235" 是完全不同的东西（待补链接）

---

## 提示词的写法

在 Stable Diffuision 1.5 / SDXL 中使用的文本编码器 **CLIP**，即使恭维也不能说性能很好。因此，为了生成期望的图像，有着被称为提示词工程学或咒语的技巧。

### 标签罗列

因为 CLIP 其实 **读不懂** 文章，所以即使写成文章形式的提示词也没什么意义。
```
1girl, solo, upper body, looking at viewer, smile, outdoors, sunset
```
因此，像这样以单纯的 **标签罗列** 的形式书写提示词的情况很多。

另外，动漫系模型直接使用了名为 Danbooru 网站的图像・以及用于整理该图像的标签。因此，过去常做去查在 Danbooru 中使用的标签并直接使用。

### 质量咒语

```
(best quality, masterpiece, ultra detailed, 8k, HDR, sharp focus, highly detailed)
```

像这样，只顾着在最前面写 **似乎能提高质量** 的词。  
现在想来不知道有没有意义，但因为不知道哪个词有多大效果，所以就一味地写了。

### Negative Prompt

```
bad anatomy, extra fingers, extra limbs, blurry, lowres, jpeg artifacts, ...
```

与刚才相反，把似乎会降低质量的词一味地写在负面提示词中。这些又有多少效果呢……

### 关注度记法

通过将 `(red:1.05)` / `(blue:0.9)` 这样的数值设定给提示词的各单词，可以更改该单词的重要性。

CLIP 往往会更重视前面的文本，因此越靠后写的内容越不容易生效。此外，有些词本来就更容易生效，有些则不太容易。

为了手动调整这些，使用这个关注度记法。

> 但是，这能顺利进行的前提终究是 CLIP 理解那个词的时候。  
> 给可能根本不认识的词加上 `(Ghoti:999)` 之类的也没有意义。

![](https://gyazo.com/e13bd76787711c8392334243177e60f3){gyazo=loop}

- 将光标放在想改变关注度的词上，按 `Ctrl + 箭头↑/↓`，可以用 0.05 为单位进行调整。
