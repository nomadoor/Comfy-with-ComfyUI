---
layout: page.njk
lang: zh
section: basic-workflows
slug: api-nodes
navId: api-nodes
title: "API 节点"
summary: "在 ComfyUI 的 API 节点利用外部的封闭模型的方法"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
tags: []
---

## 什么是 API 节点？

ComfyUI 虽然是图像生成引擎，但原本如果 Stable Diffusion 或 Qwen-Image 这样的模型没有作为开放权重公开的话就没有意义。

开发 AI 的企业几乎都是营利企业，所以像这样公开模型反而稀少。真的不得不感谢呢 (´・ω・｀)

很多封闭模型，变成从各社的网站或专用 UI 使用，但也准备了从 ComfyUI 中经由节点调用的方法。

API 节点（官方文档上的呼名是 Partner Nodes），是为了从 ComfyUI 经由 API 调用外部的封闭模型的节点群。  

> 在这里说的“API 节点”，到底是指 **ComfyUI 准备的课金节点**。  
> 与自前取得 OpenAI 或 Gemini 的 API Key 从 custom node 敲击的模式区别开来。

---

## 积分制

API 节点，无论使用哪个模型 **必定消费积分（预付）**。没有免费档或试用，在积分余额为 0 的状态无法执行。

费用，按各模型决定“每 1 次生成 〇 积分”这样的形式。  
基本上，被设定为与各社公开的 API 价格带没有大背离的水平，“因为经由 ComfyUI 所以极端地变贵”这样的事没有。

![](https://gyazo.com/6f7f9247364acac4d4fb1ccfeeb2e845){gyazo=image}

大体的费用，作为徽章显示在 API 节点的右上方。

---

## 积分的购买方法

- 1. 启动 ComfyUI，从 `⚙ Settings` 打开 `User`
- 2. 以 Comfy 账户，或许 Google / GitHub 账户登录
- 3. 点击在 `User` 标签下的 `Credits`
- 4. 点击 `Purchase Credits`，以 Stripe 结算只充值必要的分量
- 5. 结算完成后，确认余额增加（不反映的情况请重载浏览器或重启 ComfyUI）

---

## API 节点的使用方法

与其他节点使用方法没有变。从模型名搜索节点，连接而已。

![](https://gyazo.com/0d12a7369948fa19779c0b7ffb487cd0){gyazo=image}

[](/workflows/basic-workflows/api-nodes/Google_Gemini.json)

---

## API 节点的适用处

我是拘泥于在本地运 AI 的人类中的一人，所以老实说不怎么频繁使用 API 节点。

即使如此，说明文生成等，比起在自己的 PC 运 LLM，使用了 Gemini 的一方遥远地更简单，所以时常受关照。

ComfyUI 能在本地环境运模型是强项，但能将封闭模型和本地模型在同一个 workflow 中混在一起使用，这也又能说是强项吧。
