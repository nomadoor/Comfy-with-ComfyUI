---
layout: page.njk
lang: zh
section: basic-workflows
slug: z-image
navId: z-image
title: "Z-Image"
created: 2026-01-31
updated: 2026-03-02
summary: "用 Z-Image 生成图像"
seoTitle: "在 ComfyUI 中使用 Z-Image：基础模型与 ControlNet"
seoDescription: "阿里巴巴 / Tongyi-MAI 的图像生成模型家族 Z-Image 中，基础模型在 ComfyUI 中的用法。介绍 text2image、用 Z-Image-Turbo 精修，以及 Fun ControlNet Union 2.1 工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/z-image/legacy_gyazo_39cddc1debeff5423090f2fe87e5b038.png"
tags: []
---

## 什么是 Z-Image？

Z-Image 是 Alibaba / Tongyi-MAI 推出的 **图像生成模型家族**。

![](/media/basic-workflows/z-image/z_family.png){media=image}

Z-Image 这个名字本身是整个模型系列的总称，所以有点容易混淆。本页介绍的是作为其他模型派生来源的基础模型 **Z-Image**。
（为了区分，有时也称为 Z-Image-Base。）


作为（供微调使用的）基础模型，Z-Image 的特性比较朴素。

它没有像 [Z-Image-Turbo](/zh/basic-workflows/z-image-turbo/) 那样经过蒸馏和强化学习来稳定输出，所以种子和初始噪声的差异很容易体现在结果上。创造性和变化幅度都很大，但另一方面，它对参数很敏感，结果波动也大，是个不太好驾驭的模型。

---

## 下载模型

- diffusion_models  
  - [z_image_bf16.safetensors](https://huggingface.co/Comfy-Org/z_image/blob/main/split_files/diffusion_models/z_image_bf16.safetensors) (12.3 GB)
- text_encoders  
  - [qwen_3_4b.safetensors](https://huggingface.co/Comfy-Org/z_image/blob/main/split_files/text_encoders/qwen_3_4b.safetensors) (8.04 GB)
- vae  
  - [ae.safetensors](https://huggingface.co/Comfy-Org/z_image/blob/main/split_files/vae/ae.safetensors)（335 MB）

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── z_image_bf16.safetensors
    ├── 📂text_encoders/
    │   └── qwen_3_4b.safetensors
    └── 📂vae/
        └── ae.safetensors
```

---

## text2image

![](/media/basic-workflows/z-image/legacy_gyazo_8f4213b84c8d739021b8be032e8f6f8a.png){media=image}

[](/workflows/basic-workflows/z-image/z_image.json)

- `steps` : 取决于采样器，不过设得稍多一些，30〜40 左右会比较稳定

## 用 Z-Image-Turbo 精修

这个方法是用 Z-Image-Turbo 以较少的步数对 Z-Image 的生成结果进行精修。
目标是兼得 Z-Image 的创造性和 Z-Image-Turbo 稳定的画质。

用 image2image 也可以，不过这里我们稍微玩得漂亮一点，把采样拆成两段试试。

![](/media/basic-workflows/z-image/legacy_gyazo_2545e8ea917a80488d8687464185410d.png){media=image}

[](/workflows/basic-workflows/z-image/z_image_refine_turbo.json)

这次按前半 50%、后半 50% 来分。
(cf. [拆分采样](/zh/basic-workflows/ksampler-advanced/#拆分采样))

- 🟪 Z-Image : 30 steps 中的 15 steps
- 🟨 Z-Image-Turbo : 8 steps 中的 4 steps

{% outputs %}
![仅 Z-Image](/media/basic-workflows/z-image/legacy_gyazo_73afc01007482bdfbcc0b0d33f75cb98.png){media=image} ![Z-Image + Turbo](/media/basic-workflows/z-image/legacy_gyazo_0c1ece70589a7b42801f37383a604440.png){media=image}
{% endoutputs %}


## Z-Image-Fun-Controlnet-Union-2.1

这是 Z-Image 用的 ControlNet 式补丁。

### 下载模型

- model_patches

  - [Z-Image-Fun-Controlnet-Union-2.1.safetensors](https://huggingface.co/alibaba-pai/Z-Image-Fun-Controlnet-Union-2.1/blob/main/Z-Image-Fun-Controlnet-Union-2.1.safetensors) (6.71 GB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂model_patches/
        └── Z-Image-Fun-Controlnet-Union-2.1.safetensors
```

### 工作流

![](/media/basic-workflows/z-image/z_image_fun_controlnet_union_2_1.png){media=image}

[](/workflows/basic-workflows/z-image/z_image_fun_controlnet_union_2_1.json)

- 🟩 向 `QwenImageDiffsynthControlnet` 添加模型和控制图像
- 🟩 这个工作流用 Depth Anything V2 生成深度图。



## 参考资料

- [Comfy.Org blog](https://blog.comfy.org/p/z-image-day-0-support-in-comfyui?utm_campaign=post-expanded-share&utm_medium=web&triedRedirect=true)
- [A different way of combining Z-Image and Z-Image-Turbo](https://www.reddit.com/r/StableDiffusion/comments/1qqzlv8/a_different_way_of_combining_zimage_and/)
