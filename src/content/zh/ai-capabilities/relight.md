---
layout: page.njk
lang: zh
section: ai-capabilities
slug: relight
navId: relight
title: 重打光
created: 2026-02-06
updated: 2026-03-02
summary: "改变光源或环境光，调整图像的打光的任务"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: 'https://i.gyazo.com/4c413909ac34f89df891a976fc660f70.png'
---

## 什么是重打光？

重打光（Relighting），是调整图像的打光的任务。

大分的话，分为下面 2 种。

- **为了合成的重打光**：合成了前景和背景的时候，让前景的打光适应背景的东西

- **疑似光设置型重打光**：放置疑似的光源，一边参考深度图或法线贴图一边变更打光的东西

---

## 为了合成的重打光

将剪切的人物或物体贴在别的背景时，原样的话“方向”“色温”“对比度”等与背景不合，变得真是合成那样的外观。

在 AI 出现以前，虽然有用 Photoshop 等一点点修正的方法，但用生成 AI 飒爽地做吧！

### IC-Light / LBM 等，扩散模型基础的重打光

![](https://gyazo.com/5e8ab13bbf6385a8413fd8dfdb774a77){gyazo=image}

扩散模型在学习大量图像的过程中，不仅单纯“生成图像”，也掌握了“这样做看起来更自然”“如果光从这边来，影子这样落”等统计性的知识。

IC-Light 或 LBM 等手法，利用这个性质，进行只让前景的打光向背景侧靠拢那样的重打光。

### 指示基础图像编辑模型＋重打光系 LoRA

是以接近 [杂 Collage 的精炼](/zh/ai-capabilities/collage-refine/) 的思考方式，像让放在手前的东西自然地适应背景一样让其“编辑”的印象。

当然，不是合成，单纯是变更场景这个意思（变成夜・变成傍晚等）的重打光也可能。

也做成了专用的 LoRA。
- [dx8152/Qwen-Image-Edit-2509-Relight](https://huggingface.co/dx8152/Qwen-Image-Edit-2509-Relight)
- > ![](https://gyazo.com/74f605b5c212b69e7e0c269066665864){gyazo=image}

---

## 疑似光设置型重打光

另一个系统，是 **在场景内放置疑似的光源的类型** 的重打光。

> ![ClipDrop Relight](https://gyazo.com/1cfc90b511ed7c12e3cfcf9128c170e5){gyazo=loop}

推定深度图或法线贴图，放置“这里聚光灯”“从这里太阳光”等假想灯光，配合那个灯光再计算阴影或高光。

硬要说的话是接近 CG 或图像处理一侧的任务的技术。[ClipDrop Relight](https://clipdrop.co/relight) 或 [LightLab](https://nadmag.github.io/LightLab/) 这样的东西进入这个系统。

虽然研究有几个，但在 ComfyUI 实用能使用的东西，现时点很遗憾不太多。
