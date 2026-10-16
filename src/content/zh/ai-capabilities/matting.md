---
layout: page.njk
lang: zh
section: ai-capabilities
slug: matting
navId: matting
title: 抠图
created: 2026-02-06
updated: 2026-03-02
summary: "从自然图像中抠出前景，与背景分离的技术"
seoTitle: "什么是抠图（Matting）？用 AI 去除背景"
seoDescription: "从普通照片中分离前景与背景的抠图（Image Matting）技术。讲解连头发都能自然抠出的 Alpha 遮罩思路，并介绍 BiRefNet 和 SDMatte。"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: '/media/ai-capabilities/matting/legacy_gyazo_38630075ecd6336a630da0fe5b8ba130.mp4'
---

## 什么是抠图？

抠图（Image Matting）是一种不需要绿幕拍摄之类的特别准备，就能从普通照片或图像中 **分离前景和背景** 的任务。

所谓的“背景去除服务”，大多是以抠图技术为基础的。

抠图的目标，是连头发这样的细节也尽量自然地抠出来。它生成的不是单纯的二值蒙版（只有黑白），而是包含半透明信息的蒙版，叫作 **Alpha Matte**。

---

## BiRefNet

[BiRefNet](https://github.com/ZhengPeng7/BiRefNet) 是一个用于前景提取的模型家族，专门做背景去除和 Matte 生成，精度很高。

它既轻量又好用，抠图的话选 BiRefNet 肯定没错。

![](/media/ai-capabilities/matting/legacy_gyazo_131fe705fd29ddd98391fb4e78b608ab.png){media=image}

[](/workflows/ai-capabilities/matting/birefnet_general.json)

它有几个派生模型，建议先试试 **general**。人物、物体、动物等各类对象都能处理。

---

## SDMatte

[SDMatte](https://github.com/vivoCameraResearch/SDMatte) 是一个利用 Stable Diffusion 知识的抠图模型。

![](/media/ai-capabilities/matting/legacy_gyazo_317da8e987179adbe6e02f0eb40a4a07.png){media=image}

[](/workflows/ai-capabilities/matting/sdmatte.json)

它和 BiRefNet 一样能抠出前景，特点是对玻璃瓶、液体、薄布这类 **透光的东西** 也能在一定程度上处理。

基于扩散模型，计算成本高是躲不掉的宿命；不过想抠透明、半透明的物体或发梢这类极细的东西时，不妨试试。
