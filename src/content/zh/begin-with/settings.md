---
layout: page.njk
lang: zh
section: begin-with
slug: settings
navId: settings
title: "设置"
summary: "关于设置"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## 打开设置画面的方法

点击画面左上角的 **ComfyUI Logo** → **⚙ Settings** 即可打开设置。

仅限于已提供设置项的内容，不仅是 ComfyUI 本体，自定义节点的设置也可以在这里进行。
基本上看名字就能明白，请自己尝试进行各种自定义。

---

## 个人推荐设置

这里介绍几个推荐的设置。

### 语言
`Comfy` → `Locale` → `English`
- 对于中文用户，这里应该已经变成中文了，但在本网站中我们将使用 `English`。
- 我明白想用中文的心情，但由于所使用的词汇绝大多数都是专业术语（如 Latent 等），翻译成中文反而会变得不知所云。

### 徽章
`Lite Graph` → `Node` → `Node source badge mode` → `Show All`
- 显示该节点是 ComfyUI 的核心节点还是自定义节点的徽章。
- 当读取别人的 工作流 时，可以确认使用了哪个自定义节点的节点。

### Run 按钮位置

拖动 `▷ Run` 按钮旁边的 `⋮⋮`，可以将其更改到喜欢的位置。

![](https://gyazo.com/1c7183f67866e67e640715cfe42a2a61){gyazo=loop}


### 生成中的预览

ComfyUI Manger → Preview method 设置为 `Auto`/`TAESD`/`latent2RGB` 中的任意一个
- 在 KSamlper 节点内部，将会显示生成过程中的预览图像。
- 因为相当占空间所以我把它关掉了，但这对于学习图像是如何生成的来说是一个很好的功能。

![](https://gyazo.com/b57c81af6a11466c664303f29b25b4cc){gyazo=loop}
