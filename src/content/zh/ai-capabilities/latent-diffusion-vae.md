---
layout: page.njk
lang: zh
section: ai-capabilities
slug: latent-diffusion-vae
navId: latent-diffusion-vae
title: Latent Diffusion Model (潜扩散模型) 与 VAE
created: 2026-02-06
updated: 2026-03-02
summary: 潜在空间和 VAE 的作用
seoTitle: "什么是 Latent Diffusion Model 与 VAE？潜在空间的作用"
seoDescription: "让图像生成 AI 能在家用电脑上运行的 Latent Diffusion Model，以及在像素与潜在空间之间转换的 VAE。讲解在潜在空间处理的原因、VAE 是有损压缩，以及 VAE 的选择。"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## 什么是 Latent Diffusion Model？

![](/media/ai-capabilities/latent-diffusion-vae/legacy_gyazo_22d5f654c3c598feb046cf71d4d8d4aa.png){media=image}

**Latent Diffusion Model (潜扩散模型)** 是让图像生成 AI 能在自家电脑上运行的最重要的设计之一。

如果直接在普通图像（像素）上做扩散处理，像素太多，计算会非常重。
所以先把图像转换成一种 **叫作“潜在空间（latent）”的压缩表示**，再在那里加噪、去噪。

以 Stable Diffusion 1.5 为例，它会把 `512×512×3` 的图像压缩成 `64×64×4` 的“潜在图像”来处理。

长宽都变成 1/8，像素数就是 1/64。
正因为“在像素很少的世界里做扩散”，在家里也能以可接受的速度生成图像了！

---

## 为什么要在潜在空间中处理

### 1. 节省计算量和 VRAM

处理 512×512 的图像时，得为 512×512 个点逐一计算“是什么颜色”。

换成压缩后的潜在表示，就只有 64×64，计算量能大幅减少。

### 2. 可以在带有语义的表示上处理

潜在空间里压缩的不是像素级的细碎噪声，而是“物体的形状”“质感”“色彩倾向”等高层特征。

另外，潜在表示有点像“形状还不固定的黏土”。把像素图像混在一起没什么特别的意义，但在潜在图像的状态下组合，有时就能得到自然的合成效果。

---

## 什么是 VAE？

**VAE（Variational Autoencoder / 变分自编码器）** 是一个转换器，负责把图像转换到潜在空间，或者反过来还原。

- **Encoder**：把图像转换为潜在图像
- **Decoder**：把潜在图像还原为图像

生成流程如下。

- 1. 扩散模型从潜在图像上的噪声开始
- 2. U-Net（扩散模型主体）在潜在图像上一点点去除噪声
- 3. 最后经过 VAE 的 Decoder，把“潜在图像 → 普通图像”

img2img、inpaint 等以图像作为输入时，也是先用 Encoder 把图像转换成潜在表示，再做同样的处理。

---

## VAE 是有损压缩

VAE 是 **有损压缩**。

把图像转换到潜在空间再还原回来，**并不能完全恢复原样**。
会稍微变模糊，或者色调、对比度发生变化。

![](/media/ai-capabilities/latent-diffusion-vae/legacy_gyazo_8741de326b196b666b2d0617502f3814.png){media=image}

不经过扩散模型，只用 VAE 把图像编码，再用同一个 VAE 解码，就能看出画质有轻微的劣化。
“牺牲一点画质，换来轻量的处理”，这种取舍正是潜在表示的特点。

---

## 应该用哪个 VAE？

不同模型使用的潜在表示不同，生成它的 VAE 也不同。

原则上，**必须使用与模型匹配的 VAE。**

用错 VAE 的话，生成的图像会颜色怪异，或者带上噪点。
