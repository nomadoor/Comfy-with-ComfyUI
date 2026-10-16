---

layout: page.njk
lang: zh
section: basic-workflows
slug: qwen-image-edit
navId: qwen-image-edit
title: "Qwen-Image-Edit"
created: 2025-12-11
updated: 2026-03-02
summary: "用 Qwen-Image-Edit 进行基于指令的图像编辑"
seoTitle: "在 ComfyUI 中使用 Qwen-Image-Edit：不带后缀版、2509、2511"
seoDescription: "Qwen-Image-Edit 是以 Qwen-Image 为基础、基于指令的图像编辑模型。介绍它在 ComfyUI 中的用法，包括不带后缀版、2509、2511 的模型下载，以及使用单张和多张图像的编辑工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/qwen-image-edit/legacy_gyazo_14e608fdb6033e436570157da4645e34.png"
tags: ["instruction-based-image-editing","collage-refine"]
---

## 什么是 Qwen-Image-Edit？

[Qwen-Image-Edit](https://github.com/QwenLM/Qwen-Image) 是以 [Qwen-Image](/zh/basic-workflows/qwen-image/) 为基础的 [基于指令的图像编辑模型](/zh/ai-capabilities/instruction-based-image-editing/)。

简单来说，把它理解成 **Qwen-Image 版的 Flux.1 Kontext** 应该就可以了。

Flux.1 Kontext 只能做基于 VAE 的编辑，而 Qwen-Image-Edit 会用 MLLM 真正“看”参考图像，所以编辑起来也更灵活。

又过了一段时间，支持多张参考图的 **Qwen-Image-Edit-2509** 发布了。

以前只能“编辑 1 张图像”，到了 Qwen-Image-Edit-2509，就可以做这样的事：

* “把图像 1 中人物的衣服换成图像 2 里的那套”
* “生成图像 1 和图像 2 站在同一个舞台上的图像”

> [!TIP]
> 由于训练方法不同，2509 并不一定全面胜过不带后缀的版本，不过拿不准的时候用 2509 就好。

---

## Qwen-Image-Edit（不带后缀的版本）

关于它能做什么，可以参考 [官方 GitHub](https://github.com/QwenLM/Qwen-Image#showcase-of-qwen-image-edit-2509)，或者 [Flux.1 Kontext / 能做的事](/zh/basic-workflows/flux-1-kontext/#能做的事)。


### 下载模型

* diffusion_models

  * [qwen_image_edit_fp8_e4m3fn.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image-Edit_ComfyUI/blob/main/split_files/diffusion_models/qwen_image_edit_fp8_e4m3fn.safetensors)
* text_encoders

  * [qwen_2.5_vl_7b_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/blob/main/split_files/text_encoders/qwen_2.5_vl_7b_fp8_scaled.safetensors)
* vae

  * [qwen_image_vae.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/blob/main/split_files/vae/qwen_image_vae.safetensors)
* gguf（任意）

  * [QuantStack/Qwen-Image-Edit-GGUF](https://huggingface.co/QuantStack/Qwen-Image-Edit-GGUF/tree/main)

    * 请选择 Q4_K_M 及以上的模型。低于这个档位，性能会一下子掉很多。
    * cf. [Qwen-Image-Edit GGUF 模型比较](https://scrapbox.io/work4ai/Qwen-Image-Edit_GGUF%E3%83%A2%E3%83%87%E3%83%AB%E6%AF%94%E8%BC%83)
  * [unsloth/Qwen2.5-VL-7B-Instruct-GGUF](https://huggingface.co/unsloth/Qwen2.5-VL-7B-Instruct-GGUF/tree/main)
  * [Qwen2.5-VL-7B-Instruct-mmproj-BF16.gguf](https://huggingface.co/QuantStack/Qwen-Image-Edit-GGUF/blob/main/mmproj/Qwen2.5-VL-7B-Instruct-mmproj-BF16.gguf)

    * 使用 gguf 时，必须有这个 mmproj 文件。

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

![](/media/basic-workflows/qwen-image-edit/legacy_gyazo_79b84b74171ddd5c9cfdb57bccc69f13.png){media=image}

[](/workflows/basic-workflows/qwen-image-edit/qwen_image_edit.json)


🟩 关于 `TextEncodeQwenImageEdit` 节点的行为，这里稍微补充一下。

它内部大致做了这些处理：

* 1. 把输入图像缩放到 1M 像素左右
* 2. 用这张图像生成 latent
* 3. 把文本和图像一起传给 Qwen2.5-VL

由于会自动插入缩放处理，**如果生成的图像尺寸与 1M 像素相差太多，结果可能会不符合预期。**

所以这个工作流事先对图像尺寸做了预处理。

* 用 `ImageScaleToTotalPixels` 节点缩放到 1M 像素
* 用 `Resize Image v2` 节点裁剪，让分辨率成为 8 的倍数

> [!NOTE]
> 无论怎么下功夫，Qwen-Image-Edit 都无法让“输入图像和编辑后的图像像素级完全一致”。  
> 虽然有人提出了几种规避方法，但最好先明白一个前提：这个模型本来就不是为这种用途设计的。

---

## Qwen-Image-Edit-2509

Qwen-Image-Edit-2509 是在不带后缀的版本上扩展而来的。
最大的区别是 **可以输入多张参考图像**。

### 下载模型

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

![](/media/basic-workflows/qwen-image-edit/legacy_gyazo_456e6aec210ae38313aa25f83ce236df.png){media=image}

[](/workflows/basic-workflows/qwen-image-edit/qwen_image_edit_2509.json)

- 基本流程与不带后缀的版本相同，只是把 `TextEncodeQwenImageEdit` 节点换成 `TextEncodeQwenImageEditPlus` 节点。

### 工作流（多张）

![](/media/basic-workflows/qwen-image-edit/legacy_gyazo_e33abcb42d03c53f3171a8fb12d7eca0.png){media=image}

[](/workflows/basic-workflows/qwen-image-edit/qwen_image_edit_2509_multi_ref.json)

- 🟩 模型会认真看图，所以指令粗略一点也能用；不过也可以像“image1 的〇〇”“image2 的〇〇”这样，明确指定是哪张图。

前面的例子希望输入图像和编辑后的图像尽量保持相同尺寸，所以先做缩放，再把结果输入到 latent_image。

而如果只是“想以参考图像为线索生成一张新图”，像 text2image 那样使用 EmptySD3LatentImage 节点也没有问题。

---

## Qwen-Image-Edit-2511

Qwen-Image-Edit-2511 是在 2509 基础上改良的新模型。

变化没有从不带后缀的版本到 2509 时那么大，但角色一致性有所提升，还整合了 Relighting LoRA 等热门 LoRA 模型，改进相当扎实。

### 下载模型

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

![](/media/basic-workflows/qwen-image-edit/legacy_gyazo_6d45ea40c1194384fb75c383c43a116b.png){media=image}

[](/workflows/basic-workflows/qwen-image-edit/qwen_image_edit_2511.json)

和 2509 用完全相同的工作流就能运行。

---


## Lightning

**Qwen-Image-Edit-Lightning** 是一组经过蒸馏的 LoRA，让 Qwen-Image-Edit 能用 4 / 8 steps 运行。

它几乎不损失画质就能大幅减少步数，所以很多工作流都在用。

### 下载模型

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

![](/media/basic-workflows/qwen-image-edit/legacy_gyazo_c91a20239e3cb536dfc931a30562f19f.png){media=image}

[](/workflows/basic-workflows/qwen-image-edit/qwen_image_edit_lightning_8steps.json)

* 用 `LoraLoaderModelOnly` 节点加载 Lightning LoRA。
* 把 `KSampler` 的 `steps` 设为 4 或 8，`CFG` 设为 1.0。

### Qwen-Image-Edit-2511

![](/media/basic-workflows/qwen-image-edit/legacy_gyazo_cc8cbe2a940d686092555896d4b3f067.png){media=image}

[](/workflows/basic-workflows/qwen-image-edit/qwen_image_edit_2511_lightning_4steps.json)

* 用 `LoraLoaderModelOnly` 节点加载 Lightning LoRA。
