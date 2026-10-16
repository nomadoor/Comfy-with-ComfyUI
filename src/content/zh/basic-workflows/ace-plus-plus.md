---
layout: page.njk
lang: zh
section: basic-workflows
slug: ace-plus-plus
navId: ace-plus-plus
title: "ACE++"
created: 2026-02-06
updated: 2026-03-02
summary: "用 ACE++ 扩展 Flux.1 Fill"
seoTitle: "在 ComfyUI 中使用 ACE++：ID 转移、换脸、Subject 转移"
seoDescription: "扩展 Flux.1 Fill 的 ACE++ 在 ComfyUI 中的用法。借用精灵图（sprite sheet）思路实现 ID 转移、换脸、Subject 转移和局部编辑，附模型下载与工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/ace-plus-plus/legacy_gyazo_ca2c5be6b2a22cead23cf75a4fc8424f.png"
tags: ["id-transfer","subject-transfer"]
---

## 什么是 ACE++？

![](/media/basic-workflows/ace-plus-plus/legacy_gyazo_1ecb26d7a9f2f9f558b02e91114cc692.png){media=image}

这是用下面这样的提示词生成的一张图像。
- 分成 2 格的图像。
- 第 1 格里，A 坐着。
- 第 2 格里，A 转向这边。

可以看到，左右两边的人物看起来是同一个人吧。
这叫精灵图（sprite sheet）技巧，是从 Stable Diffusion 1.5 时代起就有人用的小窍门，用来做出多张情境一致的图像。

![](/media/basic-workflows/ace-plus-plus/legacy_gyazo_5b66002abf37e213214611933ac7b833.png){media=image}

再往前一步：先给出上面这样的图像，然后只让模型 inpainting 右半边。  
这样一来，**模型会参考左边的图像，在右边生成一张新图像。**

这就是 IC-LoRA，以及这次要讲的 **[ACE++](https://ali-vilab.github.io/ACE_plus_page/)** 的基本原理。
以前这只是“有时能成功”的技巧，Flux 出现之后，生成才变得比较稳定。

粗略地说，ACE++ 就是用 LoRA 强化了这个原理，并按用途准备了 3 个 LoRA。

* ID 转移 / Face Swap
* Subject 转移
* 基于指令的图像编辑（局部编辑）

---

## 需要的自定义节点

* [1038lab/ComfyUI-RMBG](https://github.com/1038lab/ComfyUI-RMBG)

这个自定义节点包含很多抠图和分割类的节点，不过这里只用其中的 `IC LoRA Concat (RMBG) 🖼️` 节点。  
ACE++ 也有官方的自定义节点，但运行不太稳定，所以这里不用。

---

## 下载模型

* diffusion_models
  * [FLUX.1-Fill-dev_fp8.safetensors](https://huggingface.co/1038lab/FLUX.1-Fill-dev_fp8/blob/main/FLUX.1-Fill-dev_fp8.safetensors)
* loras
  * [comfyui_portrait_lora64.safetensors](https://huggingface.co/ali-vilab/ACE_Plus/blob/main/portrait/comfyui_portrait_lora64.safetensors)
  * [comfyui_subject_lora16.safetensors](https://huggingface.co/ali-vilab/ACE_Plus/blob/main/subject/comfyui_subject_lora16.safetensors)
  * [comfyui_local_lora16.safetensors](https://huggingface.co/ali-vilab/ACE_Plus/blob/main/local_editing/comfyui_local_lora16.safetensors)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── FLUX.1-Fill-dev_fp8.safetensors
    └── 📂loras/
        ├── comfyui_portrait_lora64.safetensors
        ├── comfyui_subject_lora16.safetensors
        └── comfyui_local_lora16.safetensors
```

---

## 基本思路

ACE++ 看的是 **把“参考图像”和“要编辑的图像＋蒙版”左右拼在一起的一张图像**。

* 左侧：参考图像（想要靠近的脸、角色等）
* 右侧：空白图像，或要编辑的图像（＋画在上面的蒙版）

可以理解为：先把这两张左右拼成一张图，再照常做 inpainting。
把它想成 Flux.1 Fill 负责“重画哪里”，ACE++ 的 LoRA 负责“往什么样的外观靠”，应该就好理解了。

---

## ID 转移

生成与参考图像中的人物（脸）相似的图像。

![](/media/basic-workflows/ace-plus-plus/legacy_gyazo_ebe23ac6ca509cf96538f2a85fcf69c3.png){media=image}

[](/workflows/basic-workflows/ace-plus-plus/ace_plus_portrait.json)

* 基础是使用 Flux.1 Fill 的 inpainting。
* 🟪 加载 FLUX.1 Fill 和 `portrait` LoRA。
* 🟩 用 `IC LoRA Concat (RMBG) 🖼️` 节点，把“参考图像”和“基础图像＋蒙版”左右排在一起。
  * 左：参考图像（人物照片等）
  * 右：基础图像（这里是灰色的空白图像）＋蒙版
  * 如果蒙版什么都不输入，整个右侧都会被当作蒙版。
* 🟨 和普通 inpainting 用的是同一个 `InpaintModelConditioning` 节点。
* 🟦 输出图像自然是横向的两张拼图。
  * 我们只要右半边，所以利用 `IC LoRA Concat (RMBG) 🖼️` 节点传来的位置信息，只裁出右侧。

---

## 作为 Face Swap 使用

基本和 ID 转移一样，只要改变“右侧放入的基础图像”和“蒙版的画法”，就能当作 Face Swap 使用。

![](/media/basic-workflows/ace-plus-plus/legacy_gyazo_966d3c2bfcbaa5ae054fdd7ec4bb1c96.png){media=image}

[](/workflows/basic-workflows/ace-plus-plus/ace_plus_portrait_faceswap.json)

* 🟩 在右侧输入想换脸的图像（基础图像）。
* 🟩 如果只想换脸，就只在脸部周围画蒙版。

虽说叫 FaceSwap，但它更灵活，把整个头部都遮上蒙版也能顺利生成。

---

## Subject 转移

换成 `comfyui_subject_lora16.safetensors`，就能做 Subject 转移。

![](/media/basic-workflows/ace-plus-plus/legacy_gyazo_3e84f30e31b23d804ff651a4d29667e9.png){media=image}

[](/workflows/basic-workflows/ace-plus-plus/ace_plus_subject.json)

* 和刚才的 Face Swap 是同一个工作流。
* 🟪 把加载的 LoRA 换成 `subject`。

不只是人物，标志、物品等各种东西都可以作为参考来生成。
* 只把标志印到另一张包装照片上
* 让某个角色或吉祥物站到另一个背景里
* 只把某个小物件（比如包）移到另一张照片里

---

## 局部编辑

使用 `comfyui_local_lora16.safetensors`，可以让它更偏向 **只按提示词重画蒙版区域的局部编辑**。

![](/media/basic-workflows/ace-plus-plus/legacy_gyazo_e93a8e393eca60dbb1832fd314402dec.png){media=image}

[](/workflows/basic-workflows/ace-plus-plus/ace_plus_local.json)

* 这里不用左右拼接，而是用普通的 inpainting 工作流。
* 🟪 把加载的 LoRA 换成 `local`。
* 提示词要写成 **指令** 的形式，比如“把她的衣服换成白衬衫”。
