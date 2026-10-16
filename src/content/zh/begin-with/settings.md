---
layout: page.njk
lang: zh
section: begin-with
slug: settings
navId: settings
title: "设置"
created: 2026-02-06
updated: 2026-03-02
summary: "关于设置"
seoTitle: "ComfyUI 设置与推荐设置"
seoDescription: "ComfyUI 设置界面的打开方式和推荐修改的选项：界面语言、节点徽章、Run 按钮位置、生成中的预览显示等。"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## 打开设置界面

点击画面左上角的 **ComfyUI Logo** → **⚙ Settings** 即可打开设置。

不只是 ComfyUI 本身，自定义节点的设置也可以在这里改（仅限提供了设置项的）。
基本上一看就懂，可以自己多试试各种自定义。

---

## 个人推荐设置

这里介绍几个推荐的设置。

### 语言
`Comfy` → `Locale` → `English`
- 中文用户这里应该已经是中文了，但本站使用的是 `English`。
- 想用中文的心情我懂，但用到的词大多是专业术语，硬翻成中文反而更看不懂。

### 徽章
`Lite Graph` → `Node` → `Node source badge mode` → `Show All`
- 显示该节点是 ComfyUI 的核心节点还是自定义节点的徽章。
- 读取别人的工作流时，可以看出每个节点来自哪个自定义节点。

### Run 按钮位置

拖动 `▷ Run` 按钮旁边的 `⋮⋮`，可以把它移到喜欢的位置。

![](/media/begin-with/settings/legacy_gyazo_1c7183f67866e67e640715cfe42a2a61.mp4){media=loop}


### 生成中的预览

ComfyUI Manager → Preview method 设置为 `Auto`/`TAESD`/`latent2RGB` 中的任意一个
- KSampler 节点内部会显示生成过程中的预览图像。
- 因为很占空间，我自己是关掉的，不过用来了解图像是怎么一步步生成的，是个很好的功能。

![](/media/begin-with/settings/legacy_gyazo_b57c81af6a11466c664303f29b25b4cc.mp4){media=loop}
