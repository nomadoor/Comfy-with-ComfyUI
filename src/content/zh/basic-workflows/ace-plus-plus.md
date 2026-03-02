---
layout: page.njk
lang: zh
section: basic-workflows
slug: ace-plus-plus
navId: ace-plus-plus
title: "ACE++"
summary: "用 ACE++ 扩展 Flux.1 Fill"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/ca2c5be6b2a22cead23cf75a4fc8424f.png"
tags: ["id-transfer","subject-transfer"]
---

## 什么是 ACE++？

![](https://gyazo.com/1ecb26d7a9f2f9f558b02e91114cc692){gyazo=image}

这是用以下那样的提示词生成的 1 张图像。
- 分为 2 帧的图像。
- 第 1 帧 A 先生坐着。
- 第 2 帧 A 先生面向这边。

如所见那样，映在左右的人物看起来是同一人物呢。
这叫做精灵图表（Sprite sheet）技术，是想制作多张有一致性的情况时，从 Stable Diffusion 1.5 时代开始被使用的秘籍。

![](https://gyazo.com/5b66002abf37e213214611933ac7b833){gyazo=image}

从这里更进一步，在给予如上的图像的基础上，试着让其只 inpainting 右半边。  
于是，**一边参照左边的图像，一边在右侧生成新的图像。**

这就是 IC-LoRA，以及这次处理的 **[ACE++](https://ali-vilab.github.io/ACE_plus_page/)** 的根本原理。
至今为止是“有时也会顺利”程度的技术，但随着 Flux 的登场，变成了某种程度安定的生成。

粗略总结的话，ACE++ 是将这个原理用 LoRA 强化的东西，准备了按用途区分的 3 个 LoRA。

* ID 传送 / Face Swap
* Subject 传送
* 指示基础图像编辑（本地编辑）

---

## 必要的自定义节点

* [1038lab/ComfyUI-RMBG](https://github.com/1038lab/ComfyUI-RMBG)

虽然是包含很多抠图和分割系节点的自定义节点，但只使用在这之中的 `IC LoRA Concat (RMBG) 🖼️` 节点。  
虽然也有 ACE++ 官方的自定义节点，但因为举动不安定所以这里不采用。

---

## 模型的下载

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

## 基本的思考方法

ACE++，一边看 **横向排列了“参照图像”和“想编辑的图像＋掩膜”的 1 张图像** 一边动作。

* 左侧：参照图像（想靠拢的脸・角色等）
* 右侧：白纸 or 想编辑的图像（＋在那上面画的掩膜）

将这 2 个横向贴在一起做成 1 张图像后，像通常那样让其 inpainting 的印象。
如果理解为 Flux.1 Fill 担当“重画哪里”，ACE++ 的 LoRA 担当“靠拢什么样的外观”，我想容易理解。

---

## ID 传送

生成相似于参照图像的人物（脸）的图像。

![](https://gyazo.com/ebe23ac6ca509cf96538f2a85fcf69c3){gyazo=image}

[](/workflows/basic-workflows/ace-plus-plus/ACE_Plus_portrait.json)

* 基础是使用 Flux.1 Fill 的 inpainting。
* 🟪 读取 FLUX.1 Fill 和 `portrait` LoRA。
* 🟩 在 `IC LoRA Concat (RMBG) 🖼️` 节点，将“参照图像”和“基础图像＋掩膜”横向排列。
  * 左：参照图像（人物照片等）
  * 右：基础图像（这里是灰色的空图像）＋掩膜
  * 如果不在掩膜输入任何东西，右侧整体变为掩膜处理。
* 🟨 是与在通常的 inpainting 使用的东西相同的 `InpaintModelConditioning` 节点。
* 🟦 输出图像当然变为横长的 2 张组。
  * 因为只想使用右半边，所以使用从 `IC LoRA Concat (RMBG) 🖼️` 节点传递的位置信息，只裁剪右侧。

---

## 作为 Face Swap 使用

基本与 ID 传送 相同，但通过改变“放入右侧的基础图像”和“掩膜的打法”作为 Face Swap 动作。

![](https://gyazo.com/966d3c2bfcbaa5ae054fdd7ec4bb1c96){gyazo=image}

[](/workflows/basic-workflows/ace-plus-plus/ACE_Plus_portrait_faceswap.json)

* 🟩 在右侧，输入想替换脸的图像（基础图像）。
* 🟩 如果只想变脸，只在脸的周边打掩膜。

虽说是 FaceSwap，但因为更柔软，所以即使掩膜头部整体也很顺利。

---

## Subject 传送

切换为 `comfyui_subject_lora16.safetensors` 的话，可以进行 Subject 传送。

![](https://gyazo.com/3e84f30e31b23d804ff651a4d29667e9){gyazo=image}

[](/workflows/basic-workflows/ace-plus-plus/ACE_Plus_subject.json)

* 与刚才的 Face Swap 相同的工作流。
* 🟪 将读取的 LoRA 变更为 `subject`。

不仅人物，也能参照标志或道具等各种各样的东西进行生成。
* 只将标志转印到别的包装照片
* 让某个角色或吉祥物，站在别的背景
* 只将特定的小物（包等）移植到别的照片

---

## 本地编辑

使用 `comfyui_local_lora16.safetensors` 的话，可以靠拢只将掩膜的领域 **沿着提示词重画的本地编辑**。

![](https://gyazo.com/e93a8e393eca60dbb1832fd314402dec){gyazo=image}

[](/workflows/basic-workflows/ace-plus-plus/ACE_Plus_local.json)

* 不是横向排列，使用通常的 inpainting 的工作流。
* 🟪 将读取的 LoRA 变更为 `local`。
* 像“将她的衣服变更为白衬衫”那样，以 **指示** 的形式写提示词。
