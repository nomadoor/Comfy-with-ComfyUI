---
layout: page.njk
lang: zh
section: begin-with
slug: how-to-use-this-site
navId: how-to-use-this-site
title: "如何使用本网站"
summary: "欢迎来到 Comfy with ComfyUI"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/8d7fa7b6602e2b4d1cec23ab66090cce.png"
---

## 写在前面

欢迎！这里是 **Comfy with ComfyUI**。

关于 ComfyUI 的教程，已经有包括官方文档在内的许多优秀资源。
不过，我感觉关于“初学者最初容易绊倒的地方”的信息意外地少，所以创建了这个网站！

对于资深用户来说，这里也会是一个了解 ComfyUI 如何进化的好地方。

---

## 栏目介绍

切换左上角的 **栏目（Section）标签**，可以显示各主题对应的文章。
主要栏目的概要如下：

### 🧭 开始使用 ComfyUI
介绍 ComfyUI 的安装和基本操作。
> 最近 UI 的变更非常频繁。
> 虽然我想修正，但恐怕还会再次变更，所以打算等稍微稳定一些后再更新。

### 🖼️ 数据 / 图像工具
汇总了用于生成的图像和数据的准备方法。
包括图像的加工、转换，以及一次性处理大量图像的方法等。

### 🔼 AI 能力
很多初学者在使用 AI 之前，甚至不知道 **到底有哪些种类的 AI**。
本栏目旨在让你能从“想做什么”反向查找到“可以用什么 AI”。

这里也会讲解图像生成 AI 极其简单的运行机制。

### 🗺️ 基础工作流
基础 工作流 的解说。
虽然与 ComfyUI 的模板没有太大区别，但我们将其整理得更加极简且易于理解。

### ☹️ FAQ / 故障排除
整理了诸如“为什么 512px 很多？”“Seed 值 1234 和 1235 完全是两码事”等，已经被视为常识的疑问。

此外，还会汇总 ComfyUI 中容易遇到的错误和故障，并介绍各自的原因和对策。

---

## 工作流 的复制按钮

本网站提供的几乎所有 工作流，都附带了 JSON。

虽然鲜为人知，但只要复制 工作流 的 JSON 文本，
在 ComfyUI 的画布上按下 **Ctrl + V**，就可以直接粘贴 工作流。

![](https://gyazo.com/13c0019ad1e471bcf89cdb4b17bc7d9c){gyazo=loop}

测试 工作流:

[](/workflows/begin-with/saving-and-loading-workflows/Stable_Diffusion_1.5.json)

请务必试一试！

---

## 如何面对生成式 AI

生成式 AI 虽然拓展了前所未有的可能性，但它比我们想象的还要 **无能。**

想在保持一致性的同时制作参考多个角色的图像？这至今还未能完全实现。
想制作 1 分钟的视频？做不到。

当 AI 无法通过你想要的方式完成任务时，你可能会觉得“应该有什么解决办法”，但大多数情况下，只是 AI 的进步还没有达到能满足你期望的程度。

不要焦急，享受现在尚不成熟的 AI 吧。能做到这一点的，也只有现在了。

---

## 提问与修正报告

![](https://gyazo.com/c2cf37c0b9ae094cb7cbf526eb15d797){gyazo=loop}

屏幕右下角常驻着一位抓着 ComfyUI 节点不知所措的助手（？），试着把鼠标悬停上去看看吧。

无论是错别字报告、内容订正，还是希望讲解的主题请求，都请随意发送。

你可以提交到 [GitHub issue](https://github.com/nomadoor/Comfy-with-ComfyUI/issues)，也可以 [直接联系我](/zh/about/#作者)。

---

## 迈向 ComfyUI 的世界

那么，为了能够 **Comfy**（舒适）地使用 ComfyUI，让我们一起学习吧！
