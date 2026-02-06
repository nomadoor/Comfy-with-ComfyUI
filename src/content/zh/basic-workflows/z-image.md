---
layout: page.njk
lang: zh
section: basic-workflows
slug: z-image
navId: z-image
title: "Z-Image"
summary: "使用 Z-Image 的图像生成"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/39cddc1debeff5423090f2fe87e5b038.png"
tags: []
---

## 什么是 Z-Image？

Z-Image 是，Alibaba / Tongyi-MAI 开发的 **图像生成模型家族**。

![](https://gyazo.com/126c0d5ef1364355014fdd7e3288825c){gyazo=image}

Z-Image 这个名字本身是模型群的总称所以稍微难以理解，但在这个页面，处理作为派生源的基础模型的 **Z-Image**。
（为了区别有时也被呼为 Z-Image-Base。）


Z-Image，作为（微调源的）基础模型，持有坦率的特性。

因为没有加入像 [Z-Image-Turbo](/zh/basic-workflows/z-image-turbo/) 那样的基于蒸馏・强化学习的安定化，所以 Seed 或初期噪声的区别容易反映在输出上，虽然创造性和变化广泛，但反面也是参数严峻且结果大幅摆动的困难模型。

---

## 模型的下载

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

![](https://gyazo.com/8f4213b84c8d739021b8be032e8f6f8a){gyazo=image}

[](/workflows/basic-workflows/z-image/Z-Image.json)

- `steps` : 虽然也根据采样器，但 30〜40 左右稍多的一方比较安定。

## 使用 Z-Image-Turbo 进行精炼

是将 Z-Image 的生成结果，用 Z-Image-Turbo 以短的步数进行精炼的方法。
目标是两全 Z-Image 的创造性和 Z-Image-Turbo 的品质的安定感。

虽然 image2image 也可以，但在这里稍微时髦地将采样分为 2 段试试吧。

![](https://gyazo.com/2545e8ea917a80488d8687464185410d){gyazo=image}

[](/workflows/basic-workflows/z-image/Z-Image_refine-turbo.json)

这次以前半 50%，后半 50% 分开。
(cf. [分割采样](/zh/basic-workflows/ksampler-advanced/#分割采样))

- 🟪 Z-Image : 30 steps 中的 15 steps
- 🟨 Z-Image-Turbo : 8 steps 中的 4 steps

**比较**

![仅 Z-Image](https://gyazo.com/73afc01007482bdfbcc0b0d33f75cb98){gyazo=image} ![Z-Image + Turbo](https://gyazo.com/0c1ece70589a7b42801f37383a604440){gyazo=image}


## Z-Image-Fun-Controlnet-Union-2.1

Z-Image 用的 ControlNet 风补丁。

### 模型的下载

- model_patches

  - [Z-Image-Fun-Controlnet-Union-2.1.safetensors](https://huggingface.co/alibaba-pai/Z-Image-Fun-Controlnet-Union-2.1/blob/main/Z-Image-Fun-Controlnet-Union-2.1.safetensors) (6.71 GB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂model_patches/
        └── Z-Image-Fun-Controlnet-Union-2.1.safetensors
```

### 工作流

![](https://gyazo.com/1eb558462ba943c91305960b112c6a63){gyazo=image}

[](/workflows/basic-workflows/z-image/Z-Image-Fun-Controlnet-Union-2.1.json)

- 🟩 向 `QwenImageDiffsynthControlnet` 追加模型和控制图像
- 🟩 在这个 workflow 用 Depth Anything V2 制作深度图。



## 参考

- [Comfy.Org blog](https://blog.comfy.org/p/z-image-day-0-support-in-comfyui?utm_campaign=post-expanded-share&utm_medium=web&triedRedirect=true)
- [A different way of combining Z-Image and Z-Image-Turbo](https://www.reddit.com/r/StableDiffusion/comments/1qqzlv8/a_different_way_of_combining_zimage_and/)
