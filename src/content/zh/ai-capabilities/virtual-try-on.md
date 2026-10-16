---
layout: page.njk
lang: zh
section: ai-capabilities
slug: virtual-try-on
navId: virtual-try-on
title: 换装
created: 2026-02-06
updated: 2026-03-02
summary: 只把衣服换成其他设计或款式的任务
seoTitle: "用 AI 换装（Virtual Try-On）的方法"
seoDescription: "只把图像中的衣服替换为其他设计的换装（虚拟试穿）技术比较：LoRA、catvton-flux，以及使用并排或多参考输入的基于指令的图像编辑模型。"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## 什么是换装？

如果说 ID 转移是“专门针对人物的 Subject 转移”，那么换装就可以说是 **“专门针对衣服的 Subject 转移”**。

它也叫 **虚拟试穿（Virtual try-on / VTON）**。

尤其是用作商品图时，

- 图案和细节不能变
- 要自然地贴合体型和姿势

这类 **一致性** 就非常重要。

---

## LoRA

其实什么都一样，最可靠也最灵活的方法，就是直接给衣服做一个 LoRA。

再配合 inpainting，就能给特定人物换上这件衣服。

---

## catvton-flux

专门做 VTON 类任务（换衣服）的模型有很多，这里举 **catvton-flux** 作为代表。

基本思路与 IC-LoRA / ACE++ 相同，使用 **并排布局**。

![](/media/ai-capabilities/virtual-try-on/legacy_gyazo_e06c4fb2aca261c0d37b792bea9dcc80.png){media=image}

[](/workflows/ai-capabilities/virtual-try-on/catvton_flux_lora.json)

- **左侧**：人物图像
- **右侧**：想换上的衣服图像 + 蒙版

模型会同时参考两边，生成“左边的人物穿上右边衣服的图像”。

---

## 基于指令的图像编辑（并排）

不支持多参考的[基于指令的图像编辑](/zh/ai-capabilities/instruction-based-image-editing/)模型，原本做不到“把图像 A 里的元素搬到图像 B”这种事。

不过，和 IC-LoRA / ACE++ 一样，借助 **并排技巧** 和专门为此训练的 LoRA，就能做到类似的效果。

![](/media/ai-capabilities/virtual-try-on/legacy_gyazo_30a82ecdd7a8cff9483a162decf7c31d.png){media=image}

[](/workflows/ai-capabilities/virtual-try-on/flux_kontext_lora_v0_2.json)

- [nomadoor/crossimage-tryon-fluxkontext](https://huggingface.co/nomadoor/crossimage-tryon-fluxkontext)
- **左侧**：人物图像
- **右侧**：想换上的衣服图像 + 蒙版

模型会同时参考两边，生成“左边的人物穿上右边衣服的图像”。


> [!NOTE]
> 因为想炫耀一下，我拿了自己做的 LoRA 当例子，结果 1 天后就有人发布了性能远超它的 Qwen-Image-Edit LoRA ☹️
> [Clothes Try On (Clothing Transfer) - Qwen Edit](https://civitai.com/models/1940532?modelVersionId=2196278)

用基于指令的图像编辑，最大的好处是 **不需要蒙版**。

比如想给穿迷你裙的人换上牛仔裤，普通的 VTON 不光要遮住迷你裙，连会被牛仔裤盖住的腿部也得一起做进蒙版。
要自动生成覆盖这两块区域的蒙版，是非常难的。

而基于指令的图像编辑不需要蒙版，可以不用管这些麻烦事，直接换装。

---

## 基于指令的图像编辑（多参考）

如果是支持多参考的基于指令的图像编辑模型，那就简单多了。

把要换装的人物和衣服分别放进不同的输入槽，再给出“让这个人穿上这件衣服”这样的指令，就能完成换装。
