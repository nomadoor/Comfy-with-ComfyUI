---
layout: page.njk
lang: zh
section: basic-workflows
slug: minimax-h3
navId: minimax-h3
title: "MiniMax H3"
created: 2026-09-14
summary: "使用 MiniMax H3 生成视频和音频"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/minimax-h3/minimax_h3_hero.mp4"
tags: []
---

## 什么是 MiniMax H3？

[MiniMax H3](https://github.com/MiniMax-AI/MiniMax-H3) 是 MiniMax 发布的视频生成模型。

它采用一种简洁的架构，在同一个 Transformer 中处理文本、图像、视频和音频。在本地视频生成 AI 中，其性能与灵活性可以说格外突出。

模型分为两种。

- **FL2VA**
  - 用于 text2video、image2video、First / Last Frame to Video
- **Ref2VA**
  - 参考图像、视频和音频，将人物、动作、镜头、画风、声音等组合起来生成视频

---

## 推荐设置

- 分辨率
  - 768p、约 1 MP
  - 宽度和高度应为 32 的倍数
- FPS
  - 24 FPS
- 帧数
  - `17n + 5`
- 视频长度
  - 5～15 秒

---

## 模型下载

- diffusion_models
  - [minimax_h3_fl2va_pruned_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/MiniMax-H3/blob/main/diffusion_models/minimax_h3_fl2va_pruned_int8_convrot.safetensors) (21 GB)
  - [minimax_h3_ref2va_pruned_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/MiniMax-H3/blob/main/diffusion_models/minimax_h3_ref2va_pruned_int8_convrot.safetensors) (21 GB)
- text_encoders
  - [qwen3vl_32b_minimax_h3_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/MiniMax-H3/blob/main/text_encoders/qwen3vl_32b_minimax_h3_int8_convrot.safetensors) (27.1 GB)
- vae
  - [minimax_h3_audio_vae_fp32.safetensors](https://huggingface.co/Comfy-Org/MiniMax-H3/blob/main/vae/minimax_h3_audio_vae_fp32.safetensors) (605 MB)
  - [minimax_h3_video_vae_fp16.safetensors](https://huggingface.co/Comfy-Org/MiniMax-H3/blob/main/vae/minimax_h3_video_vae_fp16.safetensors) (5.21 GB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   ├── minimax_h3_fl2va_pruned_int8_convrot.safetensors
    │   └── minimax_h3_ref2va_pruned_int8_convrot.safetensors
    ├── 📂text_encoders/
    │   └── qwen3vl_32b_minimax_h3_int8_convrot.safetensors
    └── 📂vae/
        ├── minimax_h3_audio_vae_fp32.safetensors
        └── minimax_h3_video_vae_fp16.safetensors
```

---

## 提示词

使用普通自然语言也能运行，但要发挥模型的性能，需要按照推荐的格式编写提示词。

这种格式对人来说实在太复杂了，请把 MiniMax 官方的提示词指南交给 ChatGPT 或 Claude，让它帮你生成提示词。

- [MiniMax H3 Skills](https://github.com/MiniMax-AI/MiniMax-H3/tree/main/skills)
- [Video Prompt Writing Guide](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/docs/VIDEO_PROMPT_WRITING_GUIDE_base_en.md)
  - 面向 T2VA、I2VA、FL2VA、L2VA
- [Full-Reference Prompt Guide](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/docs/VIDEO_PROMPT_WRITING_GUIDE_ref_en.md)
  - 面向 Ref2VA

不过，为了方便确认生成的提示词是否正确，这里还是简单介绍一下基础格式。

### FL2VA

在 T2VA / I2VA / FL2VA / L2VA 中，视频和音频内容分成 3 个部分来写。

```text
integrated_multimodal_description:
[Shot 1] 描述画面、人物动作、镜头、台词和音效。

overall_soundscape:
描述环境音和物理音效。

non_diegetic_music:
描述 BGM。没有时填写 N/A。
```

如果想要一个连续镜头，请在正文中明确写明不要切镜头。

```text
[Shot 1] Single continuous shot, one take, no cuts. ...
```

如果要生成多个镜头，第一个镜头不写时间，从第二个镜头开始写明切换时间。

```text
[Shot 1] 描述第一个镜头。
[Shot 2] At 00:02.000, the camera cuts to ...
[Shot 3] At 00:04.000, the shot changes to ...
```

### Ref2VA

Ref2VA 使用专用的 6 个部分来编写提示词。

```text
subject_definitions:
定义要参考的人物、物体、视频和音频。

summary:
简要描述要生成的内容。

retention_analysis:
描述需要保留或迁移参考素材中的哪些内容。

detailed_description:
描述画面、动作、镜头、台词和音效。

overall_soundscape:
描述环境音和物理音效。

non_diegetic_music:
描述 BGM。没有时填写 N/A。
```

连接的素材使用 `<Picture 1>`、`<Video 1>`、`<Audio 1>` 这样的标签来指定，并写清楚要使用各素材中的哪些内容。

如果只想使用素材中的一部分，例如照片里的人物，可以将其定义为 `<Subject 1>`。

```text
<Subject 1> is the woman in <Picture 1>.
```

台词需要放在 `<d>` 标签中，并用 `[Japanese]` 这样的形式指定语言。

```text
<Subject 1> (S1) says: <d>[Japanese] こんにちは。</d>
```

---

## 关于轻量化与加速

MiniMax H3 的质量很高，但也是一个非常重的模型。

因此，目前已经出现了许多降低 VRAM 占用、提升生成速度的技术。这些技术都很出色，但或多或少都会影响质量。

选择时需要权衡各自的优缺点，而这其实相当困难。因此，本页的工作流只使用 `Comfy Kitchen Attention`（CK Attention），不使用其他优化。

更详细的信息整理在下面的页面中。

- [MiniMax H3 的模型选择、加速、轻量化与节省计算量](https://scrapbox.io/work4ai/MiniMax_H3%E3%81%AE%E3%83%A2%E3%83%87%E3%83%AB%E9%81%B8%E6%8A%9E%E3%83%BB%E9%AB%98%E9%80%9F%E5%8C%96%E3%83%BB%E8%BB%BD%E9%87%8F%E5%8C%96%E3%83%BB%E7%9C%81%E8%A8%88%E7%AE%97)

等相关技术稳定一些后，我打算再单独整理成一篇文章。

---

## text2video / T2VA

使用模型：`fl2va`

![](/media/basic-workflows/minimax-h3/minimax_h3_t2va.png){media=image}

[](/workflows/basic-workflows/minimax-h3/minimax_h3_t2va.json)

{% mediaRow img="/media/basic-workflows/minimax-h3/minimax_h3_t2va_resolution_length.png", width=40, align="left" %}
**分辨率与视频长度设置**

推荐分辨率约为 1 MP，但计算成本也相当高。刚开始时，也许可以先用 0.3 MP 等较小的尺寸尝试。

输入想要生成的视频长度（sec）后，帧数会自动取整为合适的 `17n + 5`。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/minimax-h3/minimax_h3_t2va_cfg.png", width=40, align="left" %}
**CFG**

H3 已经是经过 CFG 蒸馏的模型。因此，CFG 设为 `1.0`。

{% endmediaRow %}

**输出示例**

![](/media/basic-workflows/minimax-h3/minimax_h3_t2va_output.mp4){media=player}

---

## image2video / I2VA

使用模型：`fl2va`

![](/media/basic-workflows/minimax-h3/minimax_h3_i2va.png){media=image}

[](/workflows/basic-workflows/minimax-h3/minimax_h3_i2va.json)

在 `MiniMax H3 Image to Video` 中输入提示词和第一张图像。

**输出示例**

![输入](/media/basic-workflows/minimax-h3/minimax_h3_i2va_input.png){media=image} ![输出](/media/basic-workflows/minimax-h3/minimax_h3_i2va_output.mp4){media=loop}

---

## First / Last Frame to Video

使用模型：`fl2va`

![](/media/basic-workflows/minimax-h3/minimax_h3_flf2va.png){media=image}

[](/workflows/basic-workflows/minimax-h3/minimax_h3_flf2va.json)

基本上与 I2VA 完全相同，只需在 `last_frame` 中也输入一张图像。

**输出示例**

![第一帧](/media/basic-workflows/minimax-h3/minimax_h3_flf2va_first_frame.png){media=image} ![最后一帧](/media/basic-workflows/minimax-h3/minimax_h3_flf2va_last_frame.png){media=image} ![输出](/media/basic-workflows/minimax-h3/minimax_h3_flf2va_output.mp4){media=loop}

### Generative Interpolation

使用模型：`fl2va`

![](/media/basic-workflows/minimax-h3/minimax_h3_generative_interpolation.png){media=image}

[](/workflows/basic-workflows/minimax-h3/minimax_h3_generative_interpolation.json)

在指定的帧中插入图像，让模型补全它们之间的内容。

使用 `Add Guide for MiniMax H3` 节点。

**输出示例**

![输入 1](/media/basic-workflows/minimax-h3/minimax_h3_generative_interpolation_input_1.png){media=image} ![输入 2](/media/basic-workflows/minimax-h3/minimax_h3_generative_interpolation_input_2.png){media=image} ![输入 3](/media/basic-workflows/minimax-h3/minimax_h3_generative_interpolation_input_3.png){media=image} ![输出](/media/basic-workflows/minimax-h3/minimax_h3_generative_interpolation_output.mp4){media=loop}

---

## Audio-driven Video Generation

使用模型：`fl2va`

![](/media/basic-workflows/minimax-h3/minimax_h3_audio_driven_i2va.png){media=image}

[](/workflows/basic-workflows/minimax-h3/minimax_h3_audio_driven_i2va.json)

`Add Guide for MiniMax H3` 也可以输入音频。

输入图像和音频，试着生成一段让图中人物配合音频动作的视频吧。

**输出示例**

![输入](/media/basic-workflows/minimax-h3/minimax_h3_audio_driven_i2va_input.png){media=image} ![输出](/media/basic-workflows/minimax-h3/minimax_h3_audio_driven_i2va_output.mp4){media=player}

---

## Reference Generation

使用模型：`ref2va`

从这里开始才是 MiniMax H3 真正有意思的地方。

H3 可以放入多个“图像”“视频”和“音频”，作为生成视频时的参考素材。

之后只需写出“让图像 1 使用音频 1 说话”这样的指示，就能控制生成的视频。很厉害。

![](/media/basic-workflows/minimax-h3/minimax_h3_reference_generation.png){media=image}

[](/workflows/basic-workflows/minimax-h3/minimax_h3_reference_generation.json)

这次会把所有图像都作为参考来生成视频。

{% mediaRow img="/media/basic-workflows/minimax-h3/minimax_h3_reference_generation_prompt.png", width=40, align="left" %}
**提示词**

它的提示词写法与 `fl2va` 模型不同。

请参考[上面的提示词 / Ref2VA](#ref2va) 来编写。

> 比较麻烦的是，节点上从 `ref_image_0` 这样的 0 开始编号，而 H3 的提示词则从 `<Picture 1>` 这样的 1 开始编号。

{% endmediaRow %}

**输出示例**

![](/media/basic-workflows/minimax-h3/minimax_h3_reference_generation_output.mp4){media=player}


### 🤔 Ref2VA 的直接输出质量低于 FL2VA

[MiniMax 官方也承认](https://www.reddit.com/r/StableDiffusion/comments/1vh9rtw/comment/p29qqaa/)这一点：与 FL2VA 模型相比，Ref2VA 模型的直接输出质量会更低。

最好还是等这个问题从根本上解决，不过现在也有一些取巧的办法。

实际上，这两个模型的架构几乎相同，因此 FL2VA 模型也能在一定程度上进行 Reference Generation。

![ref2va](/media/basic-workflows/minimax-h3/minimax_h3_reference_generation_output.mp4){media=loop} ![fl2va](/media/basic-workflows/minimax-h3/minimax_h3_reference_generation_output_fl2va.mp4){media=loop} ![Hybrid](/media/basic-workflows/minimax-h3/minimax_h3_reference_generation_output_hybrid.mp4){media=loop}

画面变漂亮了。不过真要说灵活性，还是 Ref2VA 更好。

因此，也有人制作了将两个模型巧妙混合起来的 Hybrid model，这里也顺便介绍一下。如果实在无法接受 Ref2VA 的表现，可以试试看。

- [Minimax-H3-fl2va-ref2va-hybrid-models](https://huggingface.co/smhfacct/Minimax-H3-fl2va-ref2va-hybrid-models/tree/main)
  - 按照更偏向 Ref2VA 的程度，提供了多个模型
  - 可以试试 `b20-49` 或 `b25-49`

---

## Video Editing

使用模型：`ref2va`

`ref2va` 另一个具有代表性的用途，是基于指令的视频编辑。

可以理解为 FLUX.2 [klein] 或 Nano Banana 这类图像编辑的视频版本。

![](/media/basic-workflows/minimax-h3/minimax_h3_video_editing.png){media=image}

[](/workflows/basic-workflows/minimax-h3/minimax_h3_video_editing.json)

工作流基本上与 Reference Generation 相同。

只需把视频作为参考输入，再用提示词对它下达“删除人物”“改变画风”等指令。

**输出示例**

![参考图像](/media/basic-workflows/minimax-h3/minimax_h3_video_editing_ref.png){media=image} ![输入视频](/media/basic-workflows/minimax-h3/minimax_h3_video_editing_input.mp4){media=loop} ![输出](/media/basic-workflows/minimax-h3/minimax_h3_video_editing_output.mp4){media=loop}

---

## 空间 Inpainting

使用模型：`均可`

H3 也可以使用传统的（？）遮罩，只重新绘制指定区域来进行 inpainting。

不过，即使不这样做，也可以直接在 Video Editing 中指示“把〇〇改成△△”，所以可能没有太多使用场景……

![](/media/basic-workflows/minimax-h3/minimax_h3_spatial_inpainting.png){media=image}

[](/workflows/basic-workflows/minimax-h3/minimax_h3_spatial_inpainting.json)

这次使用 `ref2va` 模型，把视频里的狗替换成参考图像中的玩偶。

{% mediaRow img="/media/basic-workflows/minimax-h3/minimax_h3_spatial_inpainting_segmentation.png", width=40, align="left" %}
**分割**

使用 SAM 3.1 为狗生成遮罩，再稍微扩大遮罩，留出一些余量。

- [SAM 3.1](/zh/data-utilities/sam3/) 在另一个页面中有详细介绍。

{% endmediaRow %}

**输出示例**

![输入](/media/basic-workflows/minimax-h3/minimax_h3_spatial_inpainting_input.mp4){media=loop} ![遮罩](/media/basic-workflows/minimax-h3/minimax_h3_spatial_inpainting_mask.mp4){media=loop} ![输出](/media/basic-workflows/minimax-h3/minimax_h3_spatial_inpainting_output.mp4){media=loop}

---

## Hires.fix

前面的工作流都从一开始就以 1.0 MP 生成。质量很好，但每次生成都要花相当长的时间。

因此，也可以先在第 1 阶段以 0.25 MP 生成，结果不错的话再放大 2 倍完成最终输出。这就是所谓的 [Hires.fix](/zh/basic-workflows/sd15-hires-fix/)。

> 即使提示词相同，以 0.25 MP 生成和以 1.0 MP 生成时，模型能够表现的内容也会有所不同。
>
> 如果时间充裕，还是建议从一开始就使用推荐的 1.0 MP 生成。

### 所需自定义节点与模型

- [xmarre/Comfyui_Minimax_h3_latent_Upscaler-Plus](https://github.com/xmarre/Comfyui_Minimax_h3_latent_Upscaler-Plus)
  - 原始仓库没有收录在 ComfyUI Manager 中，因此这里使用可通过 Manager 安装的这个版本
- latent_upscale_models
  - [minimax_h3_latent_upscaler_3d_bf16.safetensors](https://huggingface.co/LBH-123-AI/Minimax_h3_latent_Upscaler/blob/main/minimax_h3_latent_upscaler_3d_bf16.safetensors) (691 MB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂latent_upscale_models/
        └── minimax_h3_latent_upscaler_3d_bf16.safetensors
```

### text2video / T2VA

![](/media/basic-workflows/minimax-h3/minimax_h3_hiresfix_t2va.png){media=image}

[](/workflows/basic-workflows/minimax-h3/minimax_h3_hiresfix_t2va.json)

{% mediaRow img="/media/basic-workflows/minimax-h3/minimax_h3_hiresfix_t2va_first_stage_resolution.png", width=40, align="left" %}
**第 1 阶段的分辨率**

在第一个 `Empty Latent` 中，输入最终视频宽度和高度各自一半的值。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/minimax-h3/minimax_h3_hiresfix_t2va_latent_upscale.png", width=40, align="left" %}
**放大 latent**

不解码为像素图像，直接将 **latent** 的宽度和高度放大 2 倍。

直接放大 latent 会导致明显劣化，因此这里使用专用模型。

此外，H3 的视频和音频 latent 合在一起。由于只需要放大视频，先将两者分离，放大视频后再重新合并。

{% endmediaRow %}


**输出示例**

![0.25 MP](/media/basic-workflows/minimax-h3/minimax_h3_hiresfix_t2va_output_0_25mp.mp4){media=loop} ![1.0 MP](/media/basic-workflows/minimax-h3/minimax_h3_hiresfix_t2va_output_1_0mp.mp4){media=loop}

### image2video / I2VA

![](/media/basic-workflows/minimax-h3/minimax_h3_hiresfix_i2va.png){media=image}

[](/workflows/basic-workflows/minimax-h3/minimax_h3_hiresfix_i2va.json)

在 I2VA 和 Ref2VA 中，Conditioning 侧也需要输入分辨率。

第 1 阶段需要设为 0.25 MP，第 2 阶段则要把宽度和高度分别放大 2 倍，设为 1.0 MP，因此工作流会稍微复杂一些……

**输出示例**

![0.25 MP](/media/basic-workflows/minimax-h3/minimax_h3_hiresfix_i2va_output_0_25mp.mp4){media=loop} ![1.0 MP](/media/basic-workflows/minimax-h3/minimax_h3_hiresfix_i2va_output_1_0mp.mp4){media=loop}

## 参考资料

- [MiniMax H3](https://github.com/MiniMax-AI/MiniMax-H3)
- [ComfyUI MiniMax H3 Video Generation Guide](https://docs.comfy.org/tutorials/video/minimax/minimax-h3)
