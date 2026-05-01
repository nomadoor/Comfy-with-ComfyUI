---
layout: page.njk
lang: zh
section: ai-capabilities
slug: matting
navId: matting
title: 抠图
summary: "从自然图像中抠出前景，与背景分离的技术"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: 'https://i.gyazo.com/38630075ecd6336a630da0fe5b8ba130.gif'
---

## 什么是抠图？

抠图（Image Matting）是不需要绿幕摄影等特别的准备，从普通的照片或图像中 **分离前景和背景** 的任务。

所谓的“背景去除服务”大都是以这个抠图技术为基础的。

能够尽量自然地抠出像头发这样细微的部分，是抠图的目标。它生成的不只是单纯的二值蒙版（只有黑白），而是包含被称为 **Alpha Matte** 的半透明信息的蒙版。

---

## BiRefNet

[BiRefNet](https://github.com/ZhengPeng7/BiRefNet) 是前景提取用的模型家族，是专注于背景去除・Matte 生成的高精度模型。

既轻量又高性能，所以如果是抠图的话选 BiRefNet 肯定没错。

![](https://gyazo.com/131fe705fd29ddd98391fb4e78b608ab){gyazo=image}

[](/workflows/ai-capabilities/matting/BiRefNet-general.json)

有几个派生模型，请先试用 **general**。它支持人物・物体・动物等广泛的对象。

---

## SDMatte

[SDMatte](https://github.com/vivoCameraResearch/SDMatte) 是利用了 Stable Diffusion 知识的抠图模型。

![](https://gyazo.com/317da8e987179adbe6e02f0eb40a4a07){gyazo=image}

[](/workflows/ai-capabilities/matting/SDMatte.json)

和 BiRefNet 一样可以进行前景抠图，但特征是对于玻璃瓶・液体・薄布等 **透视可见的东西** 也能在一定程度上处理。

作为基于扩散的命运，计算成本很高，但如果是想抠出透明・半透明的客体、发梢这样极细的东西时，请尝试一下。
