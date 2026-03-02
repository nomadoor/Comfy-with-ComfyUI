---
layout: page.njk
lang: zh
section: faq
slug: sd15-sdxl-asset-compatibility
navId: sd15-sdxl-asset-compatibility
title: "SD1.5 的 LoRA / ControlNet 能在 SDXL 上使用吗？"
summary: "模型间的兼容性，以及 SD1.5 用资源不能在 SDXL 上使用的理由"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## SD1.5 的 LoRA / ControlNet 能在 SDXL 上使用吗？

从结论来说，**不能使用**。  
这不限于 SD1.5 和 SDXL，可以认为 **模型间几乎没有兼容性**。

打个比方就像插座一样。  
- SD1.5 是日本的插座（A型）
- SDXL 是美国的插座（B型）

那个国家的家电 (LoRA / ControlNet)，只能在那个国家使用。
即使功能相似，因为连接部分的形状不同，物理上无法安装。

---

## 为什么没有兼容性

粗略总结一下技术上的理由如下。

- **前提模型不同**  
  - SD1.5 和 SDXL 因 UNet 的结构・通道数・latent 分辨率等不同，
    “在哪个层增加什么样的差分”这一 LoRA / ControlNet 的前提不一致。

- **文本编码器也不同**  
  - SD1.5 使用 CLIP，SDXL 使用别种构成的文本编码器，
    “这个单词这样动”这种学习结果，也无法原样通用于别的模型。


适配器是该模型专用的，这种认识没问题。

- SD1.5 用 LoRA / ControlNet → **SD1.5 系模型专用**
- SDXL 用 LoRA / ControlNet → **SDXL 系模型专用**
- Flux 用 LoRA / ControlNet → **Flux 系模型专用**

---

## 实际上会出错误吗？

![](https://gyazo.com/3d13852e4d5921d17dd6e6c1835bfafa){gyazo=image}

如果试着将 SDXL 用的 ControlNet 模型连接到 SD1.5 的 ControlNet 工作流中，会显示如上图所示的错误：

```
y is None, did you try using a controlnet for SDXL on SD1?
```

像这样，系统侧也会检测到没有兼容性，并返回错误。
