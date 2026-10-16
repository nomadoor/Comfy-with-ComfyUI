---
layout: page.njk
lang: zh
section: notes
slug: sd15-sdxl-asset-compatibility
navId: sd15-sdxl-asset-compatibility
title: "SD1.5 的 LoRA / ControlNet 能在 SDXL 上使用吗？"
created: 2026-02-06
updated: 2026-03-02
noteTags: ["faq", "sd15", "sdxl"]
summary: "模型之间的兼容性，以及 SD1.5 的资源为什么不能在 SDXL 上使用"
seoTitle: "SD1.5 的 LoRA / ControlNet 能在 SDXL 上用吗？"
seoDescription: "用插座打比方，讲解 Stable Diffusion 1.5 的 LoRA 和 ControlNet 无法在 SDXL 上使用的原因：模型之间基本不兼容，以及实际尝试时会发生什么。"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: ""
---

## SD1.5 的 LoRA / ControlNet 能在 SDXL 上使用吗？

先说结论：**不能用**。  
不只是 SD1.5 和 SDXL，基本可以认为 **不同模型之间几乎没有兼容性**。

打个比方，这就像插座。  
- SD1.5 是日本的插座（A型）
- SDXL 是美国的插座（B型）

一个国家的家电（LoRA / ControlNet），只能在那个国家使用。
即使功能差不多，插头的形状不同，物理上就是插不进去。

---

## 为什么不兼容

把技术上的原因粗略总结一下，大致如下。

- **前提模型不同**  
  - SD1.5 和 SDXL 的 UNet 结构、通道数、latent 分辨率等都不一样，
    所以“往哪一层加上什么样的差分”这一 LoRA / ControlNet 的前提对不上。

- **文本编码器也不同**  
  - SD1.5 使用 CLIP，SDXL 使用另一种构成的文本编码器，
    “这个词要这样调整”之类的训练结果，也没法直接套用到别的模型上。


可以简单理解为：适配器只能用于对应的模型。

- SD1.5 用 LoRA / ControlNet → **SD1.5 系模型专用**
- SDXL 用 LoRA / ControlNet → **SDXL 系模型专用**
- Flux 用 LoRA / ControlNet → **Flux 系模型专用**

---

## 实际会报错吗？

![](/media/notes/sd15-sdxl-asset-compatibility/legacy_gyazo_3d13852e4d5921d17dd6e6c1835bfafa.png){media=image}

试着把 SDXL 用的 ControlNet 模型接到 SD1.5 的 ControlNet 工作流里，就会显示上图这样的错误：

```
y is None, did you try using a controlnet for SDXL on SD1?
```

像这样，系统也会检测到不兼容，并返回错误。
