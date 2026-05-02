---
layout: page.njk
lang: zh
section: ai-capabilities
slug: virtual-try-on
navId: virtual-try-on
title: 换装
created: 2026-02-06
updated: 2026-03-02
summary: 只将衣服替换为不同设计・变体的任务
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## 什么是换装？

如果说 ID 转移是“专注于人的 Subject 转移”，那么换装就可以说是 **“专注于衣服的 Subject 转移”**。

也被称为 **虚拟试穿（Virtual try-on / VTON）**。

特别是作为商品图像使用时，

- 纹样和细节不改变
- 自然地贴合体型和姿势

这样的 **一致性** 非常重要。

---

## LoRA

不管怎么说，最确切且灵活的方法，是直接制作衣服的 LoRA。

如果与 inpainting 组合，就可以对特定人物的衣服进行换装。

---

## catvton-flux

虽然有许多专注于 VTON 系任务（衣服换装）的模型，但作为代表例，举一下 **catvton-flux**。

基本思路与 IC-LoRA / ACE++ 相同，使用 **并排布局**。

![](https://gyazo.com/e06c4fb2aca261c0d37b792bea9dcc80){gyazo=image}

[](/workflows/ai-capabilities/virtual-try-on/catvton-flux-LoRA.json)

- **左侧**：人物图像
- **右侧**：想穿的衣服图像 + 蒙版

模型一边看着两侧，一边生成“左边的人物穿着右边的衣服的图像”。

---

## 指示基图像编辑（并排）

不支持多参考的[基于指令的图像编辑](/zh/ai-capabilities/instruction-based-image-editing/)模型，本来是无法做到“将图像 A 的要素带到图像 B”的。

但是，通过与 IC-LoRA / ACE++ 时同样的 **并排技巧** 以及为此学习的 LoRA，可以做到类似的事情。

![](https://gyazo.com/30a82ecdd7a8cff9483a162decf7c31d){gyazo=image}

[](/workflows/ai-capabilities/virtual-try-on/Flux_Kontext_LoRA_v0.2.json)

- [nomadoor/crossimage-tryon-fluxkontext](https://huggingface.co/nomadoor/crossimage-tryon-fluxkontext)
- **左侧**：人物图像
- **右侧**：想穿的衣服图像 + 蒙版

模型一边看着两侧，一边生成“左边的人物穿着右边的衣服的图像”。


> 因为想炫耀一下，所以我把我自己制作的 LoRA 作为参考拿了出来，但 1 天后就发布了性能远超它的 Qwen-Image-Edit 用 LoRA ☹️
> [Clothes Try On (Clothing Transfer) - Qwen Edit](https://civitai.com/models/1940532?modelVersionId=2196278)

使用基于指令的图像编辑的最大优点是 **不需要蒙版**。

例如，想给穿迷你裙的人物穿上牛仔裤时，通常的 VTON 不仅要把迷你裙部分，连变成牛仔裤的腿部部分也必须包含在内做成蒙版。
自动生成合并了这两个区域的蒙版是非常困难的。

相对的，基于指令的图像编辑不需要蒙版，因此无需在意那些麻烦事就能进行换装。

---

## 指示基图像编辑（多参考）

如果是支持多参考的基于指令的图像编辑模型，那就简单了。

将想换装的人物和服装分别传递给不同的插槽，只要发出“让这个人物穿上这件衣服”的指令，就能进行换装。
