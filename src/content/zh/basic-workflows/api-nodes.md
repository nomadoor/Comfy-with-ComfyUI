---
layout: page.njk
lang: zh
section: basic-workflows
slug: api-nodes
navId: api-nodes
title: "API 节点"
created: 2026-02-06
updated: 2026-03-02
summary: "用 ComfyUI 的 API 节点调用外部闭源模型的方法"
seoTitle: "ComfyUI API 节点：使用闭源模型的方法"
seoDescription: "用 ComfyUI 的 API 节点调用外部公司闭源图像、视频生成模型的方法。讲解积分制度与购买方式、API 节点的用法和适用场景。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
tags: []
---

## 什么是 API 节点？

ComfyUI 是图像生成引擎，但说到底，如果 Stable Diffusion、Qwen-Image 这样的模型没有以开放权重的形式公开，它也就派不上用场。

开发 AI 的公司几乎都是营利企业，像这样愿意公开模型的反而是少数。真的得好好感谢他们才行 (´・ω・｀)

很多闭源模型要通过各家公司的网站或专用 UI 来使用，不过 ComfyUI 也提供了在内部通过节点调用它们的方法。

API 节点（官方文档里叫 Partner Nodes）是一组节点，用来从 ComfyUI 通过 API 调用外部的闭源模型。  

> [!NOTE]
> 这里说的“API 节点”，仅指 **ComfyUI 官方提供的付费节点**。  
> 自己申请 OpenAI 或 Gemini 的 API Key、再用 custom node 去调用的做法，这里不算在内。

---

## 积分制

API 节点无论使用哪个模型，都 **一定会消耗积分（预付）**。没有免费额度或试用，积分余额为 0 时无法运行。

费用按模型分别设定，形式是“每生成 1 次消耗 〇 积分”。  
基本上定价和各家公开的 API 价格不会差太多，不会出现“因为通过 ComfyUI 调用就贵得离谱”的情况。

![](/media/basic-workflows/api-nodes/legacy_gyazo_6f7f9247364acac4d4fb1ccfeeb2e845.png){media=image}

大致的费用会以徽章的形式显示在 API 节点的右上角。

---

## 如何购买积分

- 1. 启动 ComfyUI，从 `⚙ Settings` 打开 `User`
- 2. 用 Comfy 账号，或 Google / GitHub 账号登录
- 3. 点击 `User` 标签下方的 `Credits`
- 4. 点击 `Purchase Credits`，通过 Stripe 支付，按需充值
- 5. 支付完成后，确认余额已经增加（如果没有更新，请刷新浏览器或重启 ComfyUI）

---

## API 节点的用法

用法和其他节点没有区别。用模型名搜索节点，连起来就行。

![](/media/basic-workflows/api-nodes/legacy_gyazo_0d12a7369948fa19779c0b7ffb487cd0.png){media=image}

[](/workflows/basic-workflows/api-nodes/google_gemini.json)

---

## API 节点适合用在哪里

我算是执着于在本地跑 AI 的那类人，所以说实话，并不常用 API 节点。

不过像生成图像描述（caption）这种事，与其在自己电脑上跑 LLM，直接用 Gemini 要简单得多，所以偶尔也会用一用。

ComfyUI 的强项是能在本地环境运行模型，但能在同一个工作流里混用闭源模型和本地模型，也可以说是它的另一个强项吧。
