---
layout: page.njk
lang: zh
section: ai-capabilities
slug: instruction-based-image-editing
navId: instruction-based-image-editing
title: 基于指令的图像编辑
created: 2025-12-01
updated: 2026-03-02
summary: 只需用文本下指令，就能完成各种图像编辑任务的一类模型
seoTitle: "什么是基于指令的图像编辑？用文字编辑图像的 AI"
seoDescription: "只需图像和文字指令就能完成画风转换、物体替换等编辑的模型。整理从 InstructPix2Pix 到 DiT、In-Context 系、多参考以及基于视频模型的编辑的发展历史。"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## 什么是基于指令的图像编辑？

输入图像和文本指令（需要的话还可以加上参考图像），模型就会按照指令编辑图像。本站把这类模型称为 **基于指令的图像编辑模型**。

以前，

- 画风转换 → LoRA 或 IP-Adapter
- 物体去除、替换 → inpainting
- 换装 → 专用模型

像这样，每个任务都得用不同的技术、搭不同的工作流。

基于指令的图像编辑模型，则朝着 **“全部用文本指令统一处理”** 的方向进化。
目前的 SOTA nano banana 也属于这一类。

---

## 发展历史

我们先大致了解一下，基于指令的图像编辑是怎样一路发展过来的。

### InstructPix2Pix ― 用指令编辑这一思路的起点

2023 年发布的 **InstructPix2Pix**，开辟了“基于指令的图像编辑”这条路。

![](https://gyazo.com/09fac2eec2d2fba279e9f4f185522964){gyazo=image} ![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_afbd89b61246690907e2bfde3bb0b8fa.png){media=image}
> Turn the car red

这个模型成对学习“图像”和“针对它的编辑指令文本”，目标是按照用户写的指令来编辑图像。

### DiT 与 In-Context 系

这是后来才发现的：Flux 等 DiT 系模型本来就具备 **生成多张彼此一致的图像的能力**。

把这一性质用于编辑的框架，就是 **IC-LoRA / ACE++**。

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_4d84f2e35f1c7fe99a322d8ee3eaec43.png){media=image}

[](/workflows/ai-capabilities/instruction-based-image-editing/ace_plus_portrait_face_swap.json)

- 在图像画布的左侧放置“参考图像”
- 给右侧加上遮罩，让模型生成
- 结合文本指令，让它“看着左边来编辑右边”

通过这种所谓的 **并排技巧**，人们发现即使不借助专门的适配器，也能“在保留参考图像特征的同时进行编辑”。

### 图像编辑模型的出现

之后，作为 text2image 模型的衍生，**FLUX.1 Kontext**、**Qwen-Image-Edit**、**OmniGen** 等“图像编辑”专用模型相继出现，“图像编辑”逐渐被当作与 text2image 不同的一个类别。

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_5a7d5ddf5327f52ccc01acb5aae79a4a.png){media=image}

[](/workflows/ai-capabilities/instruction-based-image-editing/flux_1_kontext.json)

它们的共同点是：理解输入图像的内容，再根据文本指令调整“哪里改、改多少”——想用一个模型（还算）通用地处理这类编辑任务。

### 多参考时代

早期的基于指令的图像编辑，以“1 张图像”＋“文本指令”→ 编辑结果为前提，只有一张输入图像。

从 **Qwen-Image-Edit-2509** 和 **Flux.2** 开始，同时处理多张参考图像的趋势越来越明显。

![](/media/ai-capabilities/instruction-based-image-editing/qwen_image_edit_2509_object_swap.png){media=image}

[](/workflows/ai-capabilities/instruction-based-image-editing/qwen_image_edit_2509_object_swap.json)

- 图像 A：人物（Subject）
- 图像 B：衣服（换装用）
- 图像 C：背景或风格

像这样，可以一边“混合”多张参考一边编辑，于是 Subject 转移、ID 转移、换装、风格和光照的迁移等任务，与基于指令的编辑开始大幅重叠。

### 基于视频模型的编辑

另一条路线，是把视频生成模型转用于编辑。**FramePack 的 1 帧推理** 和 **ChronoEdit** 等是代表。

思路是：视频模型本来就能处理“多帧之间的一致性”，只要把编辑前和编辑后看作一段“短视频”，即使变化很大，也能自然地衔接起来。

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_dbf2c60d457434bccb4428108bb31164.png){media=image}
> [!NOTE]
> 这个想法本身由来已久。在 AnimateDiff 还是主流的时候，我也做过这样的事：生成角色做出各种表情的动画，用来制作角色差分。

问题还有不少，比如一致性太强、很难做出大的变化，或者图像编辑明明只要 1 张，却要作为视频输出几十帧等等，但我认为这是今后值得关注的技术。

---

## 基于指令的图像编辑可以做什么

基于指令的图像编辑模型能处理的任务相当多。本站会在各自的页面详细介绍，这里先简单列一下名称。

### 画风转换

改变画风或调性，进行“油画风”“改成动漫风格”之类的转换。

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_9cb22fffbc3c4252d73d8126b551112c.png){media=image} ![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_e1525d66b933d4a87fc5d4ee612ee7f0.png){media=image}

### 物体替换

进行“把这个杯子换成马克杯”“把车换成摩托车”之类的替换。

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_53f14e6d461b52d124d1f269ebf9663e.jpg){media=image} ![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_01ad4af4f435f48394b2a7a1af4bbd20.png){media=image}

### 物体去除

去掉路人、招牌、垃圾等“多余东西”的任务。

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_a573409de28653a2cf68d6d86bf3e17c.jpg){media=image} ![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_b8d68c03b7ca8f9e7baece3700323ea9.png){media=image}

### 更换背景

室内→海边、白天→夜晚等，只改变背景的编辑。
![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_e19dc759345f54e3115ca7518c5af7e7.jpg){media=image} ![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_937a2c1d9fe5f071582c984fccf6063e.png){media=image}

### 文本编辑

修改招牌或包装上的文字、替换字体排版等。

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_ac1594d861c1357dad7ed73d229ffef2.png){media=image} ![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_c91c136c690e7a82c1f964b1659d370b.png){media=image}

### 改变相机角度

“稍微拉远一点”“低角度”“从侧面看的构图”等，偏向构图方面的修改。

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_eaea9d1804747fc905f3289ed6492d91.png){media=image} ![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_ba1a72c2649068502251de53d04e1483.png){media=image}

### 换装

更换人物或角色服装的任务。

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_6c347851817bca776c29adb85120ad90.png){media=image} ![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_8ab258d34095ebfe4c44f4df38daf7c0.png){media=image}

### ControlNet 式生成

ControlNet 是用火柴人、深度图等条件 + 文本来生成图像的，这也可以看作一种“基于指令的图像编辑”。
现在的基于指令的图像编辑模型，经过训练已经能做基本的 ControlNet 式图像生成。

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_25e1001b36c95236106af1cfb293444d.png){media=image} ![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_cce6069cd28da9b8ea71dc546cc6e0c4.png){media=image}

### 粗糙拼贴的精修

先做一张拼贴图像（粗糙拼贴），再让模型“编辑”成看起来自然的样子。
![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_5771f27e35298b919e3f216847214e6f.png){media=image}

- 自己决定位置和大小，把物体贴上去
- 再下指令：“变成自然的照片”“让整张画面看起来不违和”

像这样，就能把直观的布局指定和基于指令的编辑结合起来。
详情会在“[粗糙拼贴的精修](/zh/ai-capabilities/collage-refine/)”页面介绍。

### 用涂鸦下指令

“让脸也朝向箭头的方向”“在这个红圈的位置放一辆巴士”等，把随手画的标记和文本结合起来下指令。

![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_378ec283b1acabfe3bc9af5fc02b013f.png){media=image} ![](/media/ai-capabilities/instruction-based-image-editing/legacy_gyazo_3275c49767be7cf8487af00a41a9cc52.png){media=image}

基于指令的图像编辑的弱点在于，单靠文本很难表达具体的位置和变化幅度。
就像制作人拿笔给设计师标注修改一样，如果对 AI 也能“用笔下指令”，那就理想了。

开源模型中能充分做到这一点的还不多，但一旦实现，将会是与 AI 协作的理想 UI/UX。

## 容易制作 LoRA

多亏社区搭好了训练环境，制作编辑用的 LoRA 相对容易。

比如想做一个把图像转换成自己插画画风的 LoRA，只要准备 10 组左右的编辑前、编辑后图像配对，就能做出质量还不错的 LoRA。

“粗糙拼贴的精修”正是一个例子：把什么当作“图像编辑”，其实是一个自由度很高的问题。
也许还有尚未被发现的创新编辑方式。请务必挑战一下！
