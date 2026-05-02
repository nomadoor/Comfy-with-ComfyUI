---

layout: page.njk
lang: zh
section: basic-workflows
slug: qwen-image-edit
navId: qwen-image-edit
title: "Qwen-Image-Edit"
created: 2025-12-11
updated: 2026-03-02
summary: "用 Qwen-Image-Edit 进行基于指示的图像编辑"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/14e608fdb6033e436570157da4645e34.png"
tags: ["instruction-based-image-editing","collage-refine"]
---

## 什么是 Qwen-Image-Edit？

[Qwen-Image-Edit](https://github.com/QwenLM/Qwen-Image) 是，以 [Qwen-Image](/zh/basic-workflows/qwen-image/) 为基础的 [基于指示的图像编辑模型](/zh/ai-capabilities/instruction-based-image-editing/)。

粗略地说，是 **Flux.1 Kontext 的 Qwen-Image 版** 这样的认识就可以。

Flux.1 Kontext 虽然只是基于 VAE 的编辑，但 Qwen-Image-Edit 可以使用 MLLM 实际上“看”参照图像，那分量能进行柔软的编辑。

其后过了一段时间，对应多参照的 **Qwen-Image-Edit-2509** 这个模型被发表了。

之前只是“编辑 1 张图像”，但在 Qwen-Image-Edit-2509 变得能做：

* “将图像 1 的人物的服装，变更为图像 2 的东西”
* “生成图像 1 和图像 2 站在同一个舞台的图像”

> 因为学习方法不同，2509 未必是无印版的上位互换，但迷茫的时候使用 2509 就可以吧。

---

## Qwen-Image-Edit（无印）

关于能做什么，[官方 GitHub](https://github.com/QwenLM/Qwen-Image#showcase-of-qwen-image-edit-2509)、或 [Flux.1 Kontext / 能做的事](/zh/basic-workflows/flux-1-kontext/#能做的事) 也许也能作为参考。


### 模型的下载

* diffusion_models

  * [qwen_image_edit_fp8_e4m3fn.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image-Edit_ComfyUI/blob/main/split_files/diffusion_models/qwen_image_edit_fp8_e4m3fn.safetensors)
* text_encoders

  * [qwen_2.5_vl_7b_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/blob/main/split_files/text_encoders/qwen_2.5_vl_7b_fp8_scaled.safetensors)
* vae

  * [qwen_image_vae.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/blob/main/split_files/vae/qwen_image_vae.safetensors)
* gguf（任意）

  * [QuantStack/Qwen-Image-Edit-GGUF](https://huggingface.co/QuantStack/Qwen-Image-Edit-GGUF/tree/main)

    * 请选择 Q4_K_M 以上的模型。未满这个的话性能会一气下降。
    * cf. [Qwen-Image-Edit GGUF 模型比较](https://scrapbox.io/work4ai/Qwen-Image-Edit_GGUF%E3%83%A2%E3%83%87%E3%83%AB%E6%AF%94%E8%BC%83)
  * [unsloth/Qwen2.5-VL-7B-Instruct-GGUF](https://huggingface.co/unsloth/Qwen2.5-VL-7B-Instruct-GGUF/tree/main)
  * [Qwen2.5-VL-7B-Instruct-mmproj-BF16.gguf](https://huggingface.co/QuantStack/Qwen-Image-Edit-GGUF/blob/main/mmproj/Qwen2.5-VL-7B-Instruct-mmproj-BF16.gguf)

    * 使用 gguf 的情况，这个 mmproj 文件是必须的。

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── qwen_image_edit_fp8_e4m3fn.safetensors
    ├── 📂text_encoders/
    │   ├── qwen_2.5_vl_7b_fp8_scaled.safetensors
    │   ├── Qwen2.5-VL-7B-Instruct.gguf                ← 仅在使用 gguf 的时候
    │   └── Qwen2.5-VL-7B-Instruct-mmproj-BF16.gguf    ← 仅在使用 gguf 的时候
    ├── 📂vae/
    │   └── qwen_image_vae.safetensors
    └── 📂unet/
        └── qwen-image-edit.gguf                       ← 仅在使用 gguf 的时候
```

### 工作流

![](https://gyazo.com/79b84b74171ddd5c9cfdb57bccc69f13){gyazo=image}

[](/workflows/basic-workflows/qwen-image-edit/Qwen-Image-Edit.json)


🟩 关于 `TextEncodeQwenImageEdit` 节点的举动，稍微补充一下。

在内部，粗略进行次那样的处理。

* 1. 将输入图像调整为 1M 像素程度
* 2. 从那个图像生成 latent
* 3. 文本＋图像汇总传给 Qwen2.5-VL

因为自动进入图像的调整处理，**生成的图像尺寸如果大大偏离 1M 像素，有变成非意图结果的可能性。**

因此，在这个工作流预先进行了图像尺寸的下处理。

* 用 `ImageScaleToTotalPixels` 节点调整为 1M 像素
* 用 `Resize Image v2` 节点，让分辨率变为 8 的倍数那样裁剪

> Qwen-Image-Edit，无论怎么工夫都无法“让输入图像和编辑后图像像素完美一致”。  
> 虽然被提案了几个回避策略，但原本模型的设计就不是面向那种用途，这个前提最好先把握。

---

## Qwen-Image-Edit-2509

Qwen-Image-Edit-2509 是，扩展了无印版的版本。
最大的区别是，**可以输入复数枚参照图像**。

### 模型的下载

* diffusion_models

  * [qwen_image_edit_2509_fp8_e4m3fn.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image-Edit_ComfyUI/blob/main/split_files/diffusion_models/qwen_image_edit_2509_fp8_e4m3fn.safetensors)
* gguf（任意）

  * [QuantStack/Qwen-Image-Edit-2509-GGUF](https://huggingface.co/QuantStack/Qwen-Image-Edit-2509-GGUF/tree/main)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── qwen_image_edit_2509_fp8_e4m3fn.safetensors
    └── 📂unet/
        └── qwen-image-edit-2509.gguf      ← 仅在使用 gguf 的时候
```

### 工作流（1 张）

![](https://gyazo.com/456e6aec210ae38313aa25f83ce236df){gyazo=image}

[](/workflows/basic-workflows/qwen-image-edit/Qwen-Image-Edit-2509.json)

- 基本的流程与无印版相同，但将 `TextEncodeQwenImageEdit` 节点替换为 `TextEncodeQwenImageEditPlus` 节点。

### 工作流（复数枚）

![](https://gyazo.com/e33abcb42d03c53f3171a8fb12d7eca0){gyazo=image}

[](/workflows/basic-workflows/qwen-image-edit/Qwen-Image-Edit-2509_multi-ref.json)

- 🟩 因为正经地看着图像，某种程度粗略的指示也能动，但像“image1 的〇〇”“image2 的〇〇”那样，也可以明示地指定是哪个图像。

之前，因为想让输入图像和编辑后图像完成尽量相同的尺寸，先进行调整处理，并将那个输入到 latent_image。

另一方面在“只想以参照图像为提示生成新图像”的例子，像 text2image 那样使用 EmptySD3LatentImage 节点也没问题。

---

## Qwen-Image-Edit-2511

Qwen-Image-Edit-2511 是，改良了 2509 的新模型。

没有从无印到 2509 时那样的大幅度变化，但角色的一致性提高了，或者 Relighting LoRA 等有人气的 LoRA 模型被整合了，进行了着实的改良。

### 模型的下载

* diffusion_models

  * [qwen_image_edit_2511_fp8mixed.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image-Edit_ComfyUI/blob/main/split_files/diffusion_models/qwen_image_edit_2511_fp8mixed.safetensors)

* gguf（任意）

  * [unsloth/Qwen-Image-Edit-2511-GGUF](https://huggingface.co/unsloth/Qwen-Image-Edit-2511-GGUF/tree/main)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── qwen_image_edit_2511_fp8mixed.safetensors
    └── 📂unet/
        └── qwen-image-edit-2511-XXXX.gguf      ← 仅在使用 gguf 的时候
```

### 工作流

![](https://gyazo.com/6d45ea40c1194384fb75c383c43a116b){gyazo=image}

[](/workflows/basic-workflows/qwen-image-edit/Qwen-Image-Edit-2511.json)

以与 2509 完全相同的工作流动作。

---


## Lightning

**Qwen-Image-Edit-Lightning** 是，为了让 Qwen-Image-Edit 以 4 / 8 steps 运转而被蒸馏的 LoRA 组。

几乎没有劣化就能大幅减少步数，在很多工作流被采用。

### 模型的下载

* loras

  * [Qwen-Image-Edit-2509-Lightning-4steps-V1.0-bf16.safetensors](https://huggingface.co/lightx2v/Qwen-Image-Lightning/blob/main/Qwen-Image-Edit-2509/Qwen-Image-Edit-2509-Lightning-4steps-V1.0-bf16.safetensors)
  * [Qwen-Image-Edit-2509-Lightning-8steps-V1.0-bf16.safetensors](https://huggingface.co/lightx2v/Qwen-Image-Lightning/blob/main/Qwen-Image-Edit-2509/Qwen-Image-Edit-2509-Lightning-8steps-V1.0-bf16.safetensors)
  - [Qwen-Image-Edit-2511-Lightning-4steps-V1.0-bf16.safetensors](https://huggingface.co/lightx2v/Qwen-Image-Edit-2511-Lightning/blob/main/Qwen-Image-Edit-2511-Lightning-4steps-V1.0-bf16.safetensors)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        ├── Qwen-Image-Edit-2509-Lightning-4steps-V1.0-bf16.safetensors
        ├── Qwen-Image-Edit-2509-Lightning-8steps-V1.0-bf16.safetensors
        └── Qwen-Image-Edit-2511-Lightning-4steps-V1.0-bf16.safetensors
```

### Qwen-Image-Edit-2509

![](https://gyazo.com/c91a20239e3cb536dfc931a30562f19f){gyazo=image}

[](/workflows/basic-workflows/qwen-image-edit/Qwen-Image-Edit_lightning_8steps.json)

* 用 `LoraLoaderModelOnly` 节点读取 Lightning LoRA。
* 将 `KSampler` 的 `steps` 设定为 4 或 8，`CFG` 设定为 1.0。

### Qwen-Image-Edit-2511

![](https://gyazo.com/cc8cbe2a940d686092555896d4b3f067){gyazo=image}

[](/workflows/basic-workflows/qwen-image-edit/Qwen-Image-Edit-2511_lightning_4steps.json)

* 用 `LoraLoaderModelOnly` 节点读取 Lightning LoRA。
