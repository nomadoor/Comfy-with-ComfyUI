---
layout: page.njk
lang: zh
section: notes
slug: sdwebui-comfyui-reproducibility
navId: sdwebui-comfyui-reproducibility
title: "Stable Diffusion web UI 和 ComfyUI 生成不出相同的图像？"
created: 2026-02-06
updated: 2026-03-02
noteTags: ["faq", "reproducibility"]
summary: "为什么同样的模型、同样的种子，生成的图像也不一致"
seoTitle: "Stable Diffusion web UI 与 ComfyUI 生成不同图像的原因"
seoDescription: "相同模型、相同种子在 Stable Diffusion web UI 与 ComfyUI 中也得不到相同图像的原因：噪声生成方式和提示词权重计算不同，以及难以完全一致的理由。"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: ""
---

## Stable Diffusion web UI 和 ComfyUI 生成不出相同的图像？

先说结论：**要生成完全相同的图像，几乎是不可能的**。

其中影响特别大的是以下 2 点。

- 噪声的生成方式不同
- 提示词权重的计算方式不同

---

## 1. 噪声的生成方式不同

扩散模型是从噪声中生成图像的技术。
也就是说，噪声的形状（图案）不同，生成的图像自然也会不同。

噪声生成相当敏感，哪怕只是 **在哪里生成噪声** 不同，同一个种子值也会得到不同的图案。

- **ComfyUI**
  - 在 **CPU 端** 生成噪声
  - 这样设计，在不同的 GPU 或环境下也更容易做到“同一个种子就得到同样的噪声”

- **Stable Diffusion web UI**
  - 在 **GPU 端** 生成噪声

因为这个差异，**即使种子值相同，最初使用的噪声图案也完全不一样**。
初始噪声不同，无论扩散过程怎么走，最终的图像都不会一致。

---

## 2. 提示词权重的计算方式不同

对于用括号和冒号写的 **“权重”**，两者的处理方式也不一样。

- **ComfyUI**
  - 写 `(masterpiece:1.2)` 就 **直接按 1.2** 处理
  - 即使写了多个词，基本上也 **不做归一化**

- **Stable Diffusion web UI**
  - 把多个权重放在一起做 **归一化（拉平）**
  - 提高某个词的权重，其他词的权重就会整体下降

官方 FAQ 里的例子如下。

**输入提示词**  

```text
(masterpiece:1.2) (best:1.3) (quality:1.4) girl
```

**在 Stable Diffusion web UI 中，会被归一化**

```text
(masterpiece:0.98) (best:1.06) (quality:1.14) (girl:0.81)
```

**在 ComfyUI 中不会被归一化**  

`masterpiece = 1.2` / `best = 1.3` / `quality = 1.4` / `girl = 1.0` 保持原样

结果就是，即使输入同样的文本、同样的数值，**传给文本编码器的“实际权重”也不同**，所以画不出同一张图。

---

## 那么，有办法生成“完全相同的图像”吗？

可以用自定义节点等方式模仿 Stable Diffusion web UI 的权重逻辑，但噪声生成等差异依然存在，所以 **想要完全一致相当困难**。

我个人觉得，干脆把这两个工具看作设计思想不同的“两样东西”会比较好。
