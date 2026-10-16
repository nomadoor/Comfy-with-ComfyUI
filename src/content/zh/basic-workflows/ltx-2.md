---
layout: page.njk
lang: zh
section: basic-workflows
slug: ltx-2
navId: ltx-2
title: "LTX-2"
created: 2026-02-06
updated: 2026-09-03
summary: "用 LTX-2 进行 text2video / image2video / audio2video"
seoTitle: "在 ComfyUI 中使用 LTX-2：text2video、image2video、audio2video"
seoDescription: "在 ComfyUI 中运行 Lightricks 可同时生成音频与视频的 LTX-2。介绍推荐设置、模型获取方式，以及重新整理、易于阅读的 text2video / image2video / audio2video 工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/ltx-2/legacy_gyazo_2a89cce32669413fb7f5b3fe4ca22960.mp4"
tags: []
---

## 什么是 LTX-2？

**[LTX-2](https://website.ltx.video/blog/introducing-ltx-2)** 是 Lightricks 公开的扩散模型，可以同时生成音频和视频。

> [!NOTE]
> 现在已经有后继模型 [LTX 2.5](/zh/basic-workflows/ltx-2-5/)。<br>
> 两者架构相同，所以可以在这一页了解原理，实际生成时推荐使用新模型。

---

## 推荐设定值

- 分辨率
  - 640×640（1:1）
  - 768×512（3:2）
  - 704×512（4:3）
  - ※后处理会放大 2 倍，所以实际输出是 1280×1280
  - ※必须是 32 的倍数
- FPS
  - 24 / 25 / 30
- 帧
  - 最大：257 frames（25fps 下约 10 秒）
  - 推荐：121–161（兼顾质量和显存）
  - ※必须是 8n+1

---

## 下载模型

- checkpoints（内含 VAE）

  - [ltx-2-19b-dev-fp8.safetensors](https://huggingface.co/Lightricks/LTX-2/blob/main/ltx-2-19b-dev-fp8.safetensors)
- latent_upscale_models

  - [ltx-2-spatial-upscaler-x2-1.0.safetensors](https://huggingface.co/Lightricks/LTX-2/blob/main/ltx-2-spatial-upscaler-x2-1.0.safetensors)
- loras

  - [ltx-2-19b-distilled-lora-384.safetensors](https://huggingface.co/Lightricks/LTX-2/blob/main/ltx-2-19b-distilled-lora-384.safetensors)
- text_encoders

  - [gemma_3_12B_it_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/ltx-2/blob/main/split_files/text_encoders/gemma_3_12B_it_fp8_scaled.safetensors)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂checkpoints/
    │   └── ltx-2-19b-dev-fp8.safetensors
    ├── 📂latent_upscale_models/
    │   └── ltx-2-spatial-upscaler-x2-1.0.safetensors
    ├── 📂loras/
    │   └── ltx-2-19b-distilled-lora-384.safetensors
    └── 📂text_encoders/
        └── gemma_3_12B_it_fp8_scaled.safetensors
```

---

## 基本处理流程

![](/media/basic-workflows/ltx-2/legacy_gyazo_1884b40ee25bafb8476dd4df1256b026.png){media=image}

和 Wan 等相比节点比较多，可能会觉得复杂，但做的事情其实就这些。

- 1. text2video + audio
  - 首先生成作为基础的视频（连同音频）。
- 2. Hires.fix（第 2 阶段）
  - 把生成的视频放大 2 倍，再用 video2video 跑一遍进行精修。
  - 也可以跳过这一步直接解码，不过从质量上考虑，推荐做 Hires.fix。
- 3. 解码
  - 分别解码视频和音频并输出。

---

## text2video

![](/media/basic-workflows/ltx-2/legacy_gyazo_d9fa680727fd75aca39c94a865682c5a.png){media=image}

{% workflowPicker
  "!/workflows/basic-workflows/ltx-2/ltx_2_text2video_v2.json",
  "/workflows/basic-workflows/ltx-2/ltx_2_text2video.json"
%}

按照上面说明的基本流程来搭建工作流。
- **1, 2, 3** 是第 1 段
- **4, 5** 是 Hires.fix
- **6** 是解码

{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_bf2e2fa5389b9bf397478a238d969be2.png {media=image}", width=40, align="left" %}


**1. 设置视频分辨率、长度和 FPS**

在这里决定要生成的视频和音频的参数。

- 在 `EmptyLTXVLatentVideo` / `LTXV Empty Latent Audio` 中输入分辨率、帧数和 FPS。
- 请按照 [推荐设定值](/zh/basic-workflows/ltx-2/#推荐设定值) 来设置。
- 🚨后处理会把分辨率放大到 2 倍。
  - 也就是说，这里设置的分辨率要填想要的视频的 **一半**。

{% endmediaRow %}


{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_e058d717d9255db19e0bb0c186950e42.png {media=image}", width=40, align="left" %}

**2. 提示词**

这也是 LTX 系列的特点：提示词不下点功夫，就做不出像样的视频。

- 话虽如此，也没有严格到需要借助 LLM 的固定格式。
- 像写小说一样，把想生成的视频描述出来就好。
- cf. [Prompting Guide for LTX-2](https://docs.ltx.video/open-source-model/usage-guides/prompting-guide)

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_5b532a5acaab4738cccbb92c423ad3ec.png {media=image}", width=40, align="left" %}

**3. 采样（第 1 段）**

用的不是熟悉的 `KSampler`，所以看起来有点复杂，但基本上就是“定好步数和 CFG，然后采样”。

- 这个工作流中，第 1 段用 20 steps / CFG 4.0 来跑。
- 使用名为 `LTXVScheduler` 的专用调度器。
  - 行为和 `linear_quadratic` 类似，不过不用太在意。
- LTX-2 同时处理视频和音频，所以用 🟫`LTXVConcatAVLatent` 把视频 latent 和音频 latent 合成一条。

{% endmediaRow %}


{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_216eebb358b46faffd4f2a6062128352.png {media=image}", width=40, align="left" %}

**4. 放大 latent（x2）**

把视频 latent 的分辨率放大到 2 倍。

- 使用专用模型（`ltx-2-spatial-upscaler-x2`）。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_22271134a0909e979030ac2ce6e037ed.png {media=image}", width=40, align="left" %}

**5. 采样（第 2 段 / video2video）**

用较少的步数精修放大后的 latent。

- 这里使用能以 4~8 步生成的 `distilled-lora`。
  - 可以把它理解成其他模型里的 Lightning / Turbo。
  - 这个工作流中用 **3 steps** 来跑。
  - 相应地，CFG 改为 `1.0`。
- 因为用了 `Manual Sigma`，不太好理解，如果换算成 `Simple`，效果大约相当于 `denoise = 0.47` 左右。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_801da41aa50410fb70b55eab18a8ab83.png {media=image}", width=40, align="left" %}

**6. 解码**

最后，把视频和音频分别解码并输出。

- 把 latent 分成视频和音频两部分，分别用对应的 VAE 解码。
- （因为 VRAM 不太够，所以用了 Tiled VAE。）

{% endmediaRow %}


## text2video 8 步

上面只在 Hires.fix 中使用了 `distilled-lora`，接下来把它也用在第 1 段，用 8 步快速生成试试。

![](/media/basic-workflows/ltx-2/legacy_gyazo_e9e4851525adda6c3aab20a9acb09582.png){media=image}

{% workflowPicker
  "!/workflows/basic-workflows/ltx-2/ltx_2_text2video_distilled_v2.json",
  "/workflows/basic-workflows/ltx-2/ltx_2_text2video_distilled.json"
%}

为了使用 `distilled-lora`，需要修改几项采样设置。

- CFG : `1.0`
- scheduler : `Simple`
- steps : `8`


## 20 步 / 8 步 distilled-lora 比较

![20 步](/media/basic-workflows/ltx-2/legacy_gyazo_d7457da890a04a168e0f82655c9a6392.mp4){media=player} ![8 步(distilled-lora)](/media/basic-workflows/ltx-2/legacy_gyazo_1e20bd8fd074213736b0a7a2e3766be1.mp4){media=player}

> [!NOTE]
> 就我试下来，使用 distilled-lora 生成更稳定。  
> 所以顺便也为了提速，之后的工作流全部 **从第 1 段开始使用 distilled-lora**。

---

## image2video

### single-frame I2V

![](/media/basic-workflows/ltx-2/legacy_gyazo_a16d62da150521a5b0c96dc32bbea33b.png){media=image}

{% workflowPicker
  "!/workflows/basic-workflows/ltx-2/ltx_2_image2video_distilled_v2.json",
  "/workflows/basic-workflows/ltx-2/ltx_2_image2video_distilled.json"
%}

基本思路是“把第 1 帧固定为输入图像，再生成剩下的帧”。

比如要做 121 帧的视频，大致流程是这样的。

```text
(1) 制作 121 frames 的框（8n+1）
    [ 🌫️ 🌫️ 🌫️ 🌫️ 🌫️ ... 🌫️ ]

(2) 只将第 1 帧用输入图像覆盖
    [ 🖼️ 🌫️ 🌫️ 🌫️ 🌫️ ... 🌫️ ]

(3) 生成剩余的 120 帧
    [ 🖼️ ✨ ✨ ✨ ✨ ... ✨ ]
```
以 🖼️ 为起点，把后面的帧（✨）一点点填满。

{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_981d0f06afef7364fcbe2c10bc1428c1.png {media=image}", width=40, align="left" %}

**1. 调整输入图像尺寸（做 2 份）**

- 首先，按最终想输出的分辨率做一份全分辨率版本。
  - 调整为任意尺寸（这里是 1MP）。
  - 宽和高设为 64 的倍数。
    - 第 1 段以 1/2 分辨率运行，为了减半后仍是 32 的倍数，所以设为 64 的倍数。
- 然后，为第 1 段（半分辨率）准备一份把上面图像长宽缩到 1/2 的版本。
  - 在 `EmptyLTXVLatentVideo` 中输入这个半分辨率版本的 width/height。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_4198b2a54986678bbcf735dda9c8cb79.png {media=image}", width=40, align="left" %}

**2. 图像预处理**

这是从 LTX-Video 延续下来的特点：视频和静态图不同，多少经过压缩、有些画质损失，所以如果用太干净的图像，可能会生成完全不动的视频。
- 为了避免这种情况，用 `LTXVPreprocess` 故意把图像劣化成类似视频压缩的效果。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_90c0a4dc550eb34a03a1a7ab100f866d.png {media=image}", width=40, align="left" %}

**3. LTXVImgToVideoInplace（插入第 1 段）**

这里就是 image2video 的核心。

- 对第 1 段（半分辨率）的 video latent，把图像插入为第 1 帧。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_2a0c109b88debb478cf1d66f4a0b2f57.png {media=image}", width=40, align="left" %}

**4. 放大侧（第 2 段）也做同样的处理**

第 2 段也同样插入图像。

- 请务必在 spatial 节点 **之后** 连接这个节点。
- strength 设为 `1.0`。
  - 把它调小的话，插入的图像本身也会像被 image2image 处理过一样发生变化。
  - 想让整体更融合的话这样也可以，但如果想让输入图像和第 1 帧完全一致，就设为 `1.0`。


{% endmediaRow %}


{% outputs %}
![输入](/media/basic-workflows/ltx-2/legacy_gyazo_9e1e51a809c8838bb01c1258925c4e0e.png){media=image} ![输出](/media/basic-workflows/ltx-2/legacy_gyazo_cdd2bcb62649ec744892c1615eae01d9.mp4){media=player}
{% endoutputs %}

> [!NOTE]
> 已知问题是，有时画面几乎不动，或者变成只是镜头拉远（Zoom Out）的视频。  
> 使用合适的提示词会好一些，另外现在也出现了专门解决这个问题的 LoRA，这里介绍一下。
>
> link + workflow : [LTX-2 Image2Video Adapter LoRa](https://scrapbox.io/work4ai/LTX-2_Image2Video_Adapter_LoRa)


---

### multi-frame I2V

刚才的 image2video 工作流，输入不仅可以是 **1 张图像**，也可以是 **图像批次（=视频）**。  
利用这一点，就能做出一个把任意视频的末尾当作“衔接部分”，继续往后延长的工作流。

![](https://gyazo.com/777521712af9329c1f8612710f00584a){gyazo=image}

[](/workflows/basic-workflows/ltx-2/ltx_2_extension_distilled.json)

做法是取出输入视频末尾的几帧，再生成后续内容。

```text
(1) 输入视频（=图像批次）
    [ 🖼️ 🖼️ 🖼️ 🖼️  ... 🖼️ 🖼️ 🖼️ ]

(2) 从末尾取得 N frames（N = 8n+1）
    [ 🖼️ 🖼️ 🖼️ 🖼️... 🖼️ 🖼️ 🖼️ ]
                      └─── N ───┘

(3) 制作 121 frames 的框，在开头覆盖放入 N frames
    [ 🖼️ 🖼️ 🖼️ 🌫️ 🌫️ 🌫️ ... 🌫️ ]
      └── N ──┘     

(4) 生成剩余（121 - N frames）制作后续
    [ 🖼️ 🖼️ 🖼️ ✨ ✨ ✨ ... ✨ ]

(5) 删除开头的 N frames（因为与原视频末尾重复）
    [ ✨ ✨ ✨ ... ✨ ]
    
(6) 结合原来的视频 + 后续
    [ 🖼️ 🖼️ 🖼️ ... 🖼️] + [ ✨ ✨ ✨ ... ✨ ]
```

{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_5b0892af938467f9abf134e6dba73e87.png {media=image}", width=40, align="left" %}

**1. 获取末尾的图像批次**

从输入视频的末尾取出作为衔接部分的图像批次。
- 在 `Get Image or Mask Range From Batch` 的 `num_frames` 中输入任意张数（须满足 8n+1）。
- N 越大，越容易延续原视频的动作和氛围。
- 不过，生成的区间是 121 - N frames，所以 N 越大，“后续”就越短。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_c87f00b6590f5b3b4b983dc204c99476.png {media=image}", width=40, align="left" %}

**2. 把生成的视频和原视频拼接起来**

生成结果的开头包含“衔接部分（原视频末尾 N frames）”，这部分和原视频重复，所以拼接前要删掉。
- 删除生成视频开头的 N frames（这个例子中是 25 frames）
- 拼接到原视频的末尾

{% endmediaRow %}

{% outputs %}
![输入](/media/basic-workflows/ltx-2/legacy_gyazo_4c2fdd21e0ff8bac1c572dc130753018.mp4){media=loop} ![输出](/media/basic-workflows/ltx-2/legacy_gyazo_1bce09367191f5fc19297331b43bdbb1.mp4){media=loop}
{% endoutputs %}


---

## audio2video

LTX-2 是同时处理“视频＋音频”的模型，所以也可以把音频作为输入，生成被声音带动的视频。

![](/media/basic-workflows/ltx-2/legacy_gyazo_be5aaa842432ee760228eeed24a3636f.png){media=image}

{% workflowPicker
  "!/workflows/basic-workflows/ltx-2/ltx_2_audio2video_distilled_v2.json",
  "/workflows/basic-workflows/ltx-2/ltx_2_audio2video_distilled.json"
%}

- 用 `Trim Audio Duration` 把音频裁剪到合适的长度
- 把音频编码后，连接到 `LTXVConcatAVLatent`。
- 也连接到第 2 段的 `LTXVConcatAVLatent`。
- 输出视频直接使用输入音频（不使用生成的音频）。

> [!WARNING]
> 如果音频比要生成的视频 **短**，音频条件就不会生效，会生成与声音无关的视频。\
> 哪怕补上静音也行，需要让音频比要生成的视频更长一些。

也能看到在这里使用 `Set Latent Noise Mask` 的工作流，不过有没有它，结果都一样。


{% outputs %}
![](/media/basic-workflows/ltx-2/legacy_gyazo_a4290b4a15307547b106f83ced77ae44.mp4){media=player}
{% endoutputs %}

---

## audio-image2video

也可以把上面两种组合起来。  
把人脸图像和说话的音频组合起来，就能做出类似 talking head 的效果。来试试吧。

![](/media/basic-workflows/ltx-2/legacy_gyazo_853b6d4b375b6ea1ef45f7697b71d369.png){media=image}

{% workflowPicker
  "!/workflows/basic-workflows/ltx-2/ltx_2_audio_image2video_distilled_v2.json",
  "/workflows/basic-workflows/ltx-2/ltx_2_audio_image2video_distilled.json"
%}

- 只是把 audio2video 和 image2video 这 2 个工作流组合起来而已。

{% outputs %}
![输入](/media/basic-workflows/ltx-2/legacy_gyazo_7bf65ca84f1583d324c0debeee85b616.png){media=image} ![输出](/media/basic-workflows/ltx-2/legacy_gyazo_8cb2045b833bb0507d048bf9965cbf63.mp4){media=player}
{% endoutputs %}

> [!NOTE]
> 其实视频不太跟随台词，所以我把台词也写进了提示词。也许有更好的工作流。

---

## video2audio

和 audio2video 相反，也可以输入视频，生成与之匹配的声音（音效和环境音）。

> [!NOTE]
> 这个任务不太稳定，可能还需要改进。

![](/media/basic-workflows/ltx-2/legacy_gyazo_62df52a54b4bfcf67f53429d6343d666.png){media=image}

[](/workflows/basic-workflows/ltx-2/ltx_2_video2audio_distilled.json)


{% outputs %}
※声音很大，请注意。

![](/media/basic-workflows/ltx-2/legacy_gyazo_79db38d1a4e4f16317613bbb85cd37f7.mp4){media=player}
{% endoutputs %}

---

## Temporal inpainting

时间方向上的 inpainting（＝只重做视频的一部分），类似 VACE Extension 那样的东西。

![](/media/basic-workflows/ltx-2/legacy_gyazo_4f55cbb7932cdefc0d879c2c432ed224.png){media=image}

[](/workflows/basic-workflows/ltx-2/ltx_2_temporal_inpainting_distilled.json)

基本上就是 video2video。  
只对视频中“想重做的时间范围”加上遮罩，让模型只重新生成那一段。

```text
(1) 输入视频（= 既有的 video latent）
    [ 🖼️ 🖼️ 🖼️ 🖼️ 🖼️ 🖼️ 🖼️ 🖼️ 🖼️ 🖼️ ]

(2) 指定想重新制作的区间（start_time ~ end_time）
    例: 2.0s ~ 4.0s
    [ 🖼️ 🖼️ | 🖼️ 🖼️ 🖼️ | 🖼️ 🖼️ 🖼️ ]
             ^           ^
         start_time   end_time

(3) 只对指定区间竖起掩膜
    [   0    0 |  1   1   1 |  0   0   0  ]
               └─── Mask ───┘

(4) 只再生成掩膜区间
    [ 🖼️ 🖼️ | ✨ ✨ ✨ | 🖼️ 🖼️ 🖼️ ]
             └─ inpaint ─┘
```

> [!NOTE]
> 由于机制上很难搭成二阶段工作流（低分辨率 → Hires.fix），所以一开始就以 1.5MP 生成。

{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_b8efdb1050318602e40897d0d181c77c.png {media=image}", width=40, align="left" %}

**1. LTXVAudioVideoMask**

指定要 inpainting 的时间范围。

- `video_fps`：基本上设为与输入视频相同的 fps
- `video_start_time` : inpainting 开始（秒）
- `video_end_time` : inpainting 结束（秒）
-  `audio_start_time` / `audio_end_time`：基本上和 video 设成一样，不过错开设置的话，也可以做到“保留声音只编辑画面”或“保留画面只编辑声音”
{% endmediaRow %}

**也可以延长**

如果把 `end_time` 设在输入视频长度之后，超出的部分会全新生成，结果视频就被延长了。
例：如果输入是“2 秒”
- 重做 2.0s → 5.0s（= 新生成 2 秒以后的部分来延长）
- `start_time = 2.0` / `end_time = 5.0`


{% outputs %}
![输入](/media/basic-workflows/ltx-2/legacy_gyazo_c460984d015f16a93523a37f70ff730a.mp4){media=player} ![输出](/media/basic-workflows/ltx-2/legacy_gyazo_2ba5e11ee85ff39b50e44a3700cf8aa6.mp4){media=player}
{% endoutputs %}


---

## IC-LoRA

IC-LoRA 可以根据姿势、深度图、边缘等控制信号来生成视频。

### 下载模型

- loras
  - [ltx-2-19b-ic-lora-canny-control.safetensors](https://huggingface.co/Lightricks/LTX-2-19b-IC-LoRA-Canny-Control/blob/main/ltx-2-19b-ic-lora-canny-control.safetensors)
  - [ltx-2-19b-ic-lora-depth-control.safetensors](https://huggingface.co/Lightricks/LTX-2-19b-IC-LoRA-Depth-Control/blob/main/ltx-2-19b-ic-lora-depth-control.safetensors)
  - [ltx-2-19b-ic-lora-detailer.safetensors](https://huggingface.co/Lightricks/LTX-2-19b-IC-LoRA-Detailer/blob/main/ltx-2-19b-ic-lora-detailer.safetensors)
  - [ltx-2-19b-ic-lora-pose-control.safetensors](https://huggingface.co/Lightricks/LTX-2-19b-IC-LoRA-Pose-Control/blob/main/ltx-2-19b-ic-lora-pose-control.safetensors)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        ├── ltx-2-19b-ic-lora-canny-control.safetensors
        ├── ltx-2-19b-ic-lora-depth-control.safetensors
        ├── ltx-2-19b-ic-lora-detailer.safetensors
        └── ltx-2-19b-ic-lora-pose-control.safetensors
```

### IC-LoRA (Pose)


以 text2video 工作流为基础，加入类似 ControlNet 的控制用视频输入。

![](/media/basic-workflows/ltx-2/legacy_gyazo_d520faa02e72245494eedeea79ebef20.png){media=image}

{% workflowPicker
  "!/workflows/basic-workflows/ltx-2/ltx_2_ic_lora_pose_distilled_v2.json",
  "/workflows/basic-workflows/ltx-2/ltx_2_ic_lora_pose_distilled.json"
%}

{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_5efc334e9408a80a1328d0dceeadb892.png {media=image}", width=40, align="left" %}

**1. 调整控制视频的尺寸**

统一成与要生成的视频相同的比例和分辨率。

- 调整为任意尺寸（这里是 1.5MP）。
- 宽和高设为 64 的倍数。
- 在 `EmptyLTXVLatentVideo` 中输入长宽缩为 1/2 后的图像的 width/height。


{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_95c6efb7ad89b70494e4db25c2b98121.png {media=image}", width=40, align="left" %}

**2. 生成姿势图像**

从视频生成火柴人图像。

- 用 OpenPose 或 DWPose 提取姿势

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_2d140f1d0b0c6fa0fba818e535c04082.png {media=image}", width=40, align="left" %}

**3. LTXVAddGuide**

把控制信号（姿势视频）放进 conditioning。

- 把刚才做好的姿势视频输入到 `LTXVAddGuide`。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_9049aa36e2220ea94aa0b1bd6f541c37.png {media=image}", width=40, align="left" %}

**4. 使用 IC-LoRA**

使用 IC-LoRA（这次是 Pose）进行采样。

- IC-LoRA 是以 `strength = 1.0` 为前提设计的。
- 这个工作流中只在第 1 段采样使用 IC-LoRA。
  - 让第 2 段专心精修，视频会更干净。

{% endmediaRow %}


{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_c30823a0376a9ff24e83b555cc55796f.png {media=image}", width=40, align="left" %}

**5. LTXVCropGuides**

第 1 段结束后，先解码看看就很容易理解：生成的视频里混进了刚才做的姿势视频。

- 注意后半段 : [LTXVCropGuides 前.mp4](/media/basic-workflows/ltx-2/legacy_gyazo_8c92e2b45a7d3f3ee98f6a3d0a3cc14b.mp4)

这正是 IC-LoRA 的机制，但输出中并不需要它，所以在进入第 2 段之前把它删掉。

- `LTXVCropGuides` 是用来从 latent / conditioning 中去除控制图像的节点。

{% endmediaRow %}

> [!TIP]
> 把姿势图像和 IC-LoRA 换成 Canny / Depth，也可以同样使用。  
> 需要注意的是，基本上推荐只用 1 种。（不推荐同时使用 Pose 和 Depth 等。）


{% outputs %}
![输入](/media/basic-workflows/ltx-2/legacy_gyazo_a999fcd3eca5bcd0a3e89714be6d8074.mp4){media=loop} ![输出](/media/basic-workflows/ltx-2/legacy_gyazo_35e6cc779d6d126973a46cac63c7dec9.mp4){media=loop}
{% endoutputs %}

---

### IC-LoRA (Pose) + image2video
不能叠加多个 IC-LoRA，但可以和 image2video 或 audio2video 组合使用。

![](/media/basic-workflows/ltx-2/legacy_gyazo_a65682de39d9ea5c9fe6003cdf27e892.png){media=image}

{% workflowPicker
  "!/workflows/basic-workflows/ltx-2/ltx_2_ic_lora_pose_image2video_distilled_v2.json",
  "/workflows/basic-workflows/ltx-2/ltx_2_ic_lora_pose_image2video_distilled.json"
%}


做的事情只是把上面的 IC-LoRA (Pose) 和 image2video 合在一起。

- 需要注意的是，`LTXVAddGuide` 要连接在 `LTXVImgToVideoInplace` **之后**。
  - 反过来的话，控制就不生效。
- 这终究只是 image2video，**不是** VACE 那样的 **reference2video**。
  - 输入图像是“固定为第 1 帧的图像”，所以如果和姿势视频的第 1 帧差别很大，就得不到预期的视频。
  - 事先用 ControlNet 或 Qwen-Image-Edit 等做一张“贴近姿势第 1 帧的图像”吧。

{% outputs %}
![输入](/media/basic-workflows/ltx-2/legacy_gyazo_aed000bfabc8665e0fadb350ca72500b.mp4){media=loop} ![输出](/media/basic-workflows/ltx-2/legacy_gyazo_0ec1dbf4cf746b021443ca341b6c019a.mp4){media=loop}
{% endoutputs %}

---

### IC-LoRA (Detailer)

IC-LoRA (Detailer) 可以修复低分辨率视频的细节和质感。

**安装自定义节点**

- [ComfyUI-LTXVideo](https://github.com/Lightricks/ComfyUI-LTXVideo)

- 只用核心节点也能运行，但要处理大分辨率、长时间的视频，就需要自定义节点。

![](/media/basic-workflows/ltx-2/legacy_gyazo_a366728b300f253233432d1c12239f8d.png){media=image}

{% workflowPicker
  "!/workflows/basic-workflows/ltx-2/ltx_2_ic_lora_detailer_v2.json",
  "/workflows/basic-workflows/ltx-2/ltx_2_ic_lora_detailer.json"
%}

基本上就是使用了 IC-LoRA(Detailer) 的 video2video。

- 🟦 先把输入视频调整到最终想要的尺寸。
- 用 `🅛🅣🅧 LTXV Looping Sampler` 代替 `SamplerCustomAdvanced`。
  - 它像 [Ultimate SD upscale](/zh/basic-workflows/ultimate-sd-upscale/) 一样，把时间和空间分成图块来处理，所以可以节省 VRAM。
  - 这个工作流中只在时间方向上分块。
- 虽然没有使用蒸馏 LoRA，但只用 3 步生成。

{% outputs %}
![输入](/media/basic-workflows/ltx-2/legacy_gyazo_aa14f25d1ad8e274a8de629f4666b1bd.mp4){media=loop} ![输出](/media/basic-workflows/ltx-2/legacy_gyazo_ceb4d9d0ba0eec0b5379b63ec307460a.mp4){media=loop}
{% endoutputs %}

---

## 参考资料

- [提示词指南](https://ltx.io/model/model-blog/prompting-guide-for-ltx-2)
- [LTX-2 官方 Doc](https://docs.ltx.video/open-source-model/getting-started/overview)
- [Lightricks/ComfyUI-LTXVideo/example_workflows](https://github.com/Lightricks/ComfyUI-LTXVideo/tree/master/example_workflows)
- [Comfy.Org blog](https://blog.comfy.org/p/ltx-2-open-source-audio-video-ai)
