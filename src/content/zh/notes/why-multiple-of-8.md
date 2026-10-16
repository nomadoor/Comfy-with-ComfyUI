---
layout: page.njk
lang: zh
section: notes
slug: why-multiple-of-8
navId: why-multiple-of-8
title: "为什么只能生成 8 的倍数的分辨率？"
created: 2026-02-06
updated: 2026-03-02
noteTags: ["faq", "resolution", "vae"]
summary: "分辨率为什么被限制为 8 的倍数，以及它和 VAE 压缩率的关系"
seoTitle: "为什么图像生成的分辨率必须是 8 的倍数？"
seoDescription: "从 latent diffusion model 与 VAE 压缩率讲解 ComfyUI 的 Empty Latent Image 只能以 8 为步长设置尺寸的原因，并介绍其他压缩率的 VAE、视频模型的帧数与图像编辑的注意点。"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: ""
---

## 为什么只能生成 8 的倍数的分辨率？

![](/media/notes/why-multiple-of-8/legacy_gyazo_74438e54d131fb86c2f02e889a9fad7b.mp4){media=loop}

看看 ComfyUI 的 `Empty Latent Image` 节点，会发现宽和高只能以 8 为步长设置。
即使硬是输入 513px 之类的值，输出也一定会被取整为 8 的倍数。

原因在于 **latent diffusion model 和 VAE 在结构上的限制**。

---

## latent diffusion model 和 VAE 的压缩率

Stable Diffusion 等 latent diffusion model，会 **先把图像压缩到低分辨率的潜在空间，再进行计算**。
负责这种“压缩”和“还原”的就是 VAE。

常用的 VAE（SD1.5 系和许多衍生模型）的结构是：

* 把高和宽压缩到 **八分之一**（按面积是六十四分之一）

潜在空间的分辨率必须是整数，所以不能被 8 整除的零头会被舍去。

例如即使输入 513px 的图像，多出来的 1px 也会被忽略，实际上按 512px 处理。

---

## 也有其他压缩率的 VAE

并不是所有 VAE 都是 8 倍压缩，**4 / 8 / 16 / 32** 等，不同模型各不相同。

使用新模型时，最好先确认一下它用的是哪个 VAE（压缩率是多少）。

---

## 视频模型的 VAE 和帧数

有些视频用的 VAE，会 **把时间方向（帧数）也一起压缩**。

* `Wan 2.1 VAE`：大致是把 4 帧合并成一个 latent 的 VAE

这时，能生成的帧数会是“1 + 4n”这样的形式，从结构上就没法做“只出 2 帧”这种细致的指定。

就像空间方向（长宽）受 8 的倍数限制一样，时间方向有时也会有“只能按这个数的倍数处理”的限制，大概记住这一点就好。

---

## image2image、图像编辑模型的注意事项

即使使用不是 8 的倍数的分辨率，也不会报错，照样能生成。
但要注意，这时会产生偏差。

* 输入图像：原始分辨率（例：513px × 769px）
* 输出图像：取整为 8 的倍数后的分辨率（例：512px × 768px）

因为 **输入和输出的像素不再一一对应**，如果需要像素级精确的编辑，就要先裁剪或填充成 8 的倍数。

如果觉得“边缘好像被切掉了一点”“尺寸有点不对”，
不妨确认一下分辨率是不是 VAE 压缩率的倍数。
