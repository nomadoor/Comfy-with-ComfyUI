---
layout: page.njk
lang: zh
section: basic-workflows
slug: sd15-image2image
navId: sd15-image2image
title: "image2image"
created: 2026-02-06
updated: 2026-03-02
summary: "用 Stable Diffusion 1.5 学习 image2image"
seoTitle: "ComfyUI 的 image2image 用法与 denoise"
seoDescription: "用 Stable Diffusion 1.5 讲解以参考图为草稿重新绘制的 image2image 原理，介绍 KSampler 与 KSampler (Advanced) 工作流的区别，以及 denoise 的含义。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 什么是 image2image？

![](/media/basic-workflows/sd15-image2image/legacy_gyazo_bbb1bca709f4a0b20735da8222d6e3f9.png){media=image}

image2image 是 **以参考图像为草稿，让模型在上面重新画** 的方法。

虽说是当作草稿，但如果完全照着描，那就只是复制而已，毫无独创性可言。

所以先加入噪声，加到还能看出原图的程度，再把噪声去除，这样就能适度保留原图的构图和氛围，同时让它画出符合提示词的另一个版本。

---

## image2image 的原理

这里再复习一下扩散模型和 Sampling。  
在 ComfyUI 中，KSampler 会先用噪声填满“空的 latent”，再一点点去除噪声来生成图像。

image2image 则是把这个“空的 latent”换成 **由参考图像编码而来的 latent**，再用 `start_at_step` 调整 **从哪个时间点开始加噪声**。

下面来看看在 `steps: 20` 的 KSampler (Advanced) 中改变 `start_at_step` 会怎样。

{% mediaRow img="/media/basic-workflows/sd15-image2image/legacy_gyazo_9068f8b11d1798b5aef16930565aa97c.png{media=image}", width=50, align="left" %}
**start_at_step: 0**
- 从一开始就被噪声填满。
- 完全看不到草稿图像，和普通的 text2image 几乎一样。
- > ※只有 Stable Diffusion 1.5 的行为稍有不同。  
 → [denoise 1.0 时的 image2image 和 text2image](#denoise-1-0-时的-image2image-和-text2image)
{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/sd15-image2image/legacy_gyazo_9e4a63492f71b4f31e4efa761999c772.png{media=image}", width=50, align="left" %}
**start_at_step: 1**
- 从推进了 1 step 的位置开始。
- 因此，加到草稿上的噪声量（＝接下来要去除的噪声量）会稍微减少。
- 尽管如此，草稿图像还是几乎看不出来。
{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/sd15-image2image/legacy_gyazo_2f5da8a9b3c1cdc017149a7c63fa7678.png{media=image}", width=50, align="left" %}
**start_at_step: 9**
- 加到草稿上的噪声量（＝接下来要去除的噪声量）大幅减少。
- 草稿的轮廓和构图保留得很清楚，一眼就能看出来
{% endmediaRow %}



{% mediaRow img="/media/basic-workflows/sd15-image2image/legacy_gyazo_26906eaf7dfc00de20c1f265be4feff9.png{media=image}", width=50, align="left" %}
**start_at_step: 20**
- 这相当于指定从 20 步中的最后一步开始，实际上就是“什么都不做”。
- 也就是说，实际上完全不进行采样，也不会加噪声。
- 所以输入的图像会原样输出。
{% endmediaRow %}

像这样，把 `start_at_step` 设在 `1 ~ (steps - 1)` 之间，就能在保留原图的同时进行采样。

这就叫作 **image2image**。

---

## KSampler (Advanced) 的工作流

![](/media/basic-workflows/sd15-image2image/legacy_gyazo_e5ff6f57deb2d62f568cb8897eb41355.png){media=image}

[](/workflows/basic-workflows/sd15-image2image/sd1_5_image2image_ksampler_advanced.json)

- 🟩 用 VAE Encode 节点把图像转换为 latent。
- 🟨 改变 `start_at_step` 的值，多试试原图保留多少比较合适。

---

## KSampler 的工作流

不带后缀的 KSampler 当然也能做 image2image。  
不过 **“用哪个旋钮来决定原图保留多少”** 这一点，和 KSampler (Advanced) 差别很大。

![](/media/basic-workflows/sd15-image2image/legacy_gyazo_41975fb8a105170ea9d8a9dbbd48b5dd.png){media=image}

[](/workflows/basic-workflows/sd15-image2image/sd1_5_image2image_ksampler.json)

- 🟪 改变 `denoise` 的值，设定原图保留多少。
  - `1.0` 会完全用噪声填满，也就是和 text2image 一样。
  - `0.0` 则完全不加噪声，所以原图会原样输出。

---

## 不带后缀的版本和 Advanced 的区别

这里和 KSampler (Advanced) 对比一下。

两者要做的事情本身是一样的，都是在调整 **“给原图加多少噪声，再去除多少”**。

只是旋钮的分配方式不同，容易让人有点混乱。来看看在看似会得到相同结果的设置下，两者各自如何表现。

{% mediaRow img="/media/basic-workflows/sd15-image2image/legacy_gyazo_589d8db0a9506a3df81f2169de272d1e.png{media=image}", width=50, align="left" %}
**KSampler (Advanced)**
- 例如设为 `steps: 20`, `start_at_step: 4`，  
  就只执行“全部 20 步中从第 4 步到第 20 步”的部分。
- 实际采样的次数是 **20 - 4 = 16 次**。
{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/sd15-image2image/legacy_gyazo_cbcfaf5df9cee8f8079c82e903b492b8.png{media=image}", width=50, align="left" %}
**不带后缀的 KSampler**
- 同样设为 `steps: 20`，再设置 `denoise: 0.8` 之类的值，表面上的“加噪方式”会变得接近，但 **采样次数仍是 20 次**。
- 无论把 `denoise` 改成 0.5 还是 0.1，都还是采样 20 次。
{% endmediaRow %}


- **Advanced**
  - `steps` 是“整体的步数”，只执行 `start_at_step` 之后的部分 → 执行次数会变
- **不带后缀**
  - `steps` 是“实际执行次数”，`denoise` 只改变噪声强度 → 执行次数不变

如果想让不带后缀的 KSampler 的“加噪方式”接近 Advanced，可以用下面这个式子粗略估算。（不会完全一致）
```
设定的 step 数 ≒ 整体的 step 数 * denoise
```

### 其实不用太在意

都解释得这么详细了还这么说有点那个，不过两者其实都只是在决定 **“给原图加多少噪声”** 而已。

把不带后缀的 KSampler 和 Advanced 混在一起用时需要注意，但没人会搭那种工作流，所以不用在意。

只要知道改哪个参数、原图会保留多少就 OK 了。

---

## denoise 1.0 时的 image2image 和 text2image

`denoise: 1.0` 时，原图会被噪声完全填满，所以从原理上说，image2image 和使用 `Empty Latent Image` 节点的 text2image 应该是一样的。

![](/media/basic-workflows/sd15-image2image/legacy_gyazo_aae8ea31ec753bc12053ae1d6b701179.png){media=image}

但是 **在 Stable Diffusion 1.5 上结果并不一样**。（我猜是实现上的差异，但我没搞懂，所以也说不准。）  
而在最近的模型（Flux 等）上，会得到完全相同的图像。

本站把 Stable Diffusion 1.5 当作特例，按照本来的设计，将 **“denoise 1.0 的 image2image 和 text2image 视为同一回事”**。

---

{% outputs "samples" %}
![](/media/basic-workflows/sd15-image2image/legacy_gyazo_1f5fee22e1db9942bf950cf39906c881.png){media=image}
{% endoutputs %}
