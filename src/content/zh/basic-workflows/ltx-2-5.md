---
layout: page.njk
lang: zh
section: basic-workflows
slug: ltx-2-5
navId: ltx-2-5
title: "LTX 2.5"
created: 2026-09-01
updated: 2026-09-03
summary: "使用 LTX 2.5 生成视频和音频"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/f0a0582dba74a4ef6e731142136b5c59.mp4"
tags: []
---

## 什么是 LTX 2.5？

`LTX 2.5` 是 Lightricks 视频生成模型继 `LTX-2`、`LTX 2.3` 之后的新版本。

基本机制与 [LTX 2.3](/zh/basic-workflows/ltx-2-3/) 相同，不过它不只是让输出变得更漂亮，还带来了几项较大的改进。

- **Multi-shot**
  - 一次生成多个镜头
- **Gemma 4 Text Encoder**
  - Text Encoder 从 Gemma 3 改为 Gemma 4
- **Diffusion Decoder**
  - 不再使用 VAE Decode，而是用扩散模型从 latent 还原视频
  - 思路和 [PiD](/zh/basic-workflows/pixeldit-pid/#pid) 比较接近

除此之外还有一些改进，不过如果是在 ComfyUI 中使用，暂时知道这些就够了。

---

## 推荐设置

- 分辨率
  - 必须是 32 的倍数
- FPS
  - 不限制为几个固定值
  - 默认值是 24 FPS
- 帧数
  - 必须是 `8n + 1`
- 视频最长长度
  - 481 帧
  - 24 FPS 时约为 20 秒

---

## 模型下载

- diffusion_models
  - [ltx-2.5-22b-distilled-transformer-comfy-int8-convrot.safetensors](https://huggingface.co/Lightricks/LTX-2.5/blob/main/diffusion_models/ltx-2.5-22b-distilled-transformer-comfy-int8-convrot.safetensors) (21.5 GB)
- latent_upscale_models
  - [ltx-2.5-latent-spatial-upscaler-x2-bf16-1.0.safetensors](https://huggingface.co/Lightricks/LTX-2.5/blob/main/latent_upscale_models/ltx-2.5-latent-spatial-upscaler-x2-bf16-1.0.safetensors) (1 GB)
- text_encoders
  - [gemma4-12b-with-proj-ltx-2.5-comfy-int8-convrot.safetensors](https://huggingface.co/Lightricks/LTX-2.5/blob/main/text_encoders/gemma4-12b-with-proj-ltx-2.5-comfy-int8-convrot.safetensors) (15.4 GB)
- vae
  - [ltx-2.5-video-vae-bf16.safetensors](https://huggingface.co/Lightricks/LTX-2.5/blob/main/vae/ltx-2.5-video-vae-bf16.safetensors) (1.47 GB)
  - [ltx-2.5-audio-vae-bf16.safetensors](https://huggingface.co/Lightricks/LTX-2.5/blob/main/vae/ltx-2.5-audio-vae-bf16.safetensors) (365 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── ltx-2.5-22b-distilled-transformer-comfy-int8-convrot.safetensors
    ├── 📂latent_upscale_models/
    │   └── ltx-2.5-latent-spatial-upscaler-x2-bf16-1.0.safetensors
    ├── 📂text_encoders/
    │   └── gemma4-12b-with-proj-ltx-2.5-comfy-int8-convrot.safetensors
    └── 📂vae/
        ├── ltx-2.5-video-vae-bf16.safetensors
        └── ltx-2.5-audio-vae-bf16.safetensors
```

---

## text2video

![](https://gyazo.com/891b0474ea9ec2636b188b803f6ef2c3){gyazo=image}

[](/workflows/basic-workflows/ltx-2-5/LTX-2.5_text2video.json)

和 LTX-2 一样，这是一个 2 阶段工作流：先以目标分辨率的一半生成，再放大 2 倍。

{% mediaRow img="https://gyazo.com/d353cf476e7c8be513f7bc1e55cef365", width=40, align="left" %}
**分辨率设置**

之后会放大 2 倍，所以在 `EmptyLTXVLatentVideo` 中输入目标分辨率一半的值。

这个值也必须是 32 的倍数，因此目标宽度和高度请设为 64 的倍数。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/82803fd97cf50afbdb616105f14b0405", width=40, align="left" %}
**帧数设置**

在这个工作流中，输入想要生成的视频秒数（sec）和 FPS 后，帧数会自动取整为合适的 `8n + 1`。

{% endmediaRow %}

**输出示例**

![](https://gyazo.com/e68699b3ebb44d9b20b5d85c73cf9644){gyazo=loop}

### Multi-shot

从 Seedance 2 等模型开始，这种功能逐渐常见起来。现在一次生成就能制作多个镜头。

![](https://gyazo.com/7d681d86ce23e28e4e48aed1fe452c7d){gyazo=image}

[](/workflows/basic-workflows/ltx-2-5/LTX-2.5_text2video_multishot.json)

不需要特别的写法，只要用自然语言写出“这里切换镜头……”之类的内容，模型就会识别。

写起来很轻松，不过模型有时也不会将它识别为 Multi-shot。遇到这种情况，就耐心多试几次吧。

**输出示例**

![](https://gyazo.com/7fe2eadbd6abb69f2015df4f8531fe26){gyazo=loop}

### Duration Predictor

视频长度基本上需要手动设置，不过要判断这段提示词究竟适合几秒，其实也挺让人纠结的。

LTX 2.5 可以根据提示词内容，自动推测表现这些内容所需的视频长度。

**模型下载**

- model_patches
  - [ltx-2.5-duration-head-bf16.safetensors](https://huggingface.co/Lightricks/LTX-2.5/blob/main/model_patches/ltx-2.5-duration-head-bf16.safetensors) (3.84 MB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂model_patches/
        └── ltx-2.5-duration-head-bf16.safetensors
```

![](https://gyazo.com/ecf49f82e56e0fdec6283401d71ae657){gyazo=image}

[](/workflows/basic-workflows/ltx-2-5/LTX-2.5_text2video_Duration_Predictor.json)

{% mediaRow img="https://gyazo.com/4567c3906de961a9c90bc01cef27db5d", width=40, align="left" %}
**LTXV Duration Predictor**

节点会输出根据提示词预测的帧数，再连接到普通 text2video 工作流的 `length`。

这毕竟只是预测，所以结果有时会比预期更短或更长。即便如此，能自动预测视频长度还是个挺有意思的功能。

{% endmediaRow %}

## image2video

![](https://gyazo.com/e978305c53f6c658984db4ad42c71a7f){gyazo=image}

[](/workflows/basic-workflows/ltx-2-5/LTX-2.5_image2video.json)

用法和 [LTX 2 的 image2video](/zh/basic-workflows/ltx-2/#image2video) 相同。使用 `LTXVImgToVideoInplace` 将输入图像插入为第 1 帧。

> 以前出于各种原因，会使用 `LTXV Preprocess` 故意降低输入图像的质量。不过在 LTX 2.5 中，至少就我使用的情况来看似乎已经不再需要，所以这里将它去掉了。

**输出示例**

![输入](https://gyazo.com/856453de1d4eaea2b8e02a8e6993db08){gyazo=image} ![输出](https://gyazo.com/d8bdced1eba00d48d1f5ff65dfb4e336){gyazo=loop}

---

## Generative Interpolation / FLF2V

将任意数量的图像交给模型，让它流畅地填补图像之间的内容。

如果只指定视频的第一张和最后一张图像，就是通常所说的 **FLF2V**。

![](https://gyazo.com/a0e7571b01f97b79d73325390e0a4d3c){gyazo=image}

[](/workflows/basic-workflows/ltx-2-5/LTX-2.5_generative-interpolation.json)

{% mediaRow img="https://gyazo.com/2e39b3e006fcb35d96b87d649ded0146", width=40, align="left" %}
**LTXV Add Guide**

在 `frame_idx` 中指定插入图像的位置。

- `0`：第一帧
- `-1`：最后一帧

增加节点并依次连接起来，就能进行 Generative Interpolation。

> 根据图像的不同，结果有时不像补帧，反而更像转场。<br>
> 对于插在中间的 `LTXVAddGuide`，可以尝试将 `strength` 降到 0.3～0.4 左右。

{% endmediaRow %}

**输出示例**

![输入 1](https://gyazo.com/de4eaa85c26607d8b0f98f774880e2b8){gyazo=image} ![输入 2](https://gyazo.com/0ef0afcbe6a2d35cf018bb0f77e0a0ff){gyazo=image} ![输入 3](https://gyazo.com/c2058ec73687479e7abe3fa7f21f9d64){gyazo=image} ![输出](https://gyazo.com/e0e2fcb86f4a8513708807bacd79af8c){gyazo=loop}

---

## IC-LoRA

IC-LoRA 在 LTX 中的作用类似于 ControlNet 或视频编辑 LoRA。

LTX 2.5 与许多为 LTX 2.3 制作的 IC-LoRA 兼容，可以直接使用。

算上 LTX 2.3 用的模型，IC-LoRA 的种类非常多。这里先试试最基本的 Union Control。

### 模型下载

- [ltx-2.3-22b-ic-lora-union-control-ref0.5.safetensors](https://huggingface.co/Lightricks/LTX-2.3-22b-IC-LoRA-Union-Control/blob/main/ltx-2.3-22b-ic-lora-union-control-ref0.5.safetensors) (654 MB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        └── ltx-2.3-22b-ic-lora-union-control-ref0.5.safetensors
```

### IC-LoRA Union

和普通 ControlNet 一样，可以用线稿、深度图或姿势视频控制生成视频。

![](https://gyazo.com/4e194652b6db74b853390f20017bb542){gyazo=image}

[](/workflows/basic-workflows/ltx-2-5/LTX-2.5_IC-LoRA-Pose.json)

关于 IC-LoRA 的详细说明，请参阅 [LTX 2 / IC-LoRA (Pose)](/zh/basic-workflows/ltx-2/#ic-lora-pose)。

**输出示例**

![输入 / 姿势](https://gyazo.com/824ba34d0fa1ef036db386c4f7f7b5f6){gyazo=loop} ![输出](https://gyazo.com/4f55983a4205360420e7cc605402301b){gyazo=loop}

---

## 用作放大模型

LTX 2.5 采用 2 阶段结构：先以一半分辨率生成，再将分辨率放大 2 倍并重新整理画面。

既然如此，只使用第 2 阶段，把它当作任意视频的 2 倍放大模型也是很自然的想法。

![](https://gyazo.com/7fa914cfea3fe3b4648960d1c3474258){gyazo=image}

[](/workflows/basic-workflows/ltx-2-5/LTX-2.5_x2_upscaler.json)

这里只是对任意视频进行 VAE Encode，再接到前面一直使用的工作流第 2 阶段。

不过，如果继续使用前面的 `ManualSigmas` 数值，实际 denoise 会过强，原视频的变化也会太大。

这里改用 `Basic Scheduler`，并将 denoise 设为 0.3。请根据需要调整。

**输出示例**

![输入](https://gyazo.com/2090f2ae9f78af154922c00cd43e10f7){gyazo=loop} ![输出](https://gyazo.com/bb03d5683d784b144c290400638ba139){gyazo=loop}

虽然现在也出现了许多竞争模型，但它生成自然视频的能力仍然相当突出。希望大家能根据用途灵活使用不同的模型。
