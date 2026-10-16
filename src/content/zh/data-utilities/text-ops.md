---
layout: page.njk
lang: zh
section: data-utilities
slug: text-ops
navId: text-ops
title: "文本操作"
created: 2025-11-25
updated: 2026-05-27
summary: "处理文本的节点"
seoTitle: "ComfyUI 文本操作节点：拼接、替换、正则表达式"
seoDescription: "ComfyUI 中处理提示词等字符串的节点汇总：拼接、替换、截取、去除空白等基本操作，以及正则表达式和 rgthree 的 Power Puter，附工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 操作文本

![](/media/data-utilities/text-ops/legacy_gyazo_8731cc3b1bd685d83a13d37ffc0617ed.png){media=image}

在 ComfyUI 中，文本主要是作为提示词来用的。
替换字符串的一部分、给 LLM 写好的提示词加上触发词……把这类操作自动化，工作流会方便很多。


## 什么是 string？

在编程的世界里，为了和数字等区分开，文本被称为 **string（字符串）**。

- `apple` → 5 个字符的 string
- `123` → 看起来是数字，实际上是被当作文字处理的 string
- `" "` (空白) → 虽然看不见，但也是 1 个字符的 string

---

## 基本操作节点

### String 节点 (文字输入)

![](/media/data-utilities/text-ops/legacy_gyazo_7669da6621b5fcb5b7cc0c539f4d5af7.png){media=image}

用来输入字符串的基本节点。
使用 **String (Multiline)** 节点，可以输入带换行的文本。

### Concatenate 节点 (文字拼接)

![](/media/data-utilities/text-ops/legacy_gyazo_a20e6df7b2f65bf71d42c2070f79c726.png){media=image}

把多个 string 拼接成一个。
（例：`apple` + `pen` → `applepen`）

- `delimiter` 指的是分隔符，可以随意设置（逗号、换行等）。

### Format Text 节点

![](/media/data-utilities/text-ops/legacy_gyazo_b662c552b5e80b5b04cad422b72a19b2.png){media=image}

[](../../../workflows/data-utilities/text-ops/format_text.json)

这个节点先写好一段文本模板，再把其他 string 填进去。

相比 Concatenate，它可以更灵活地组合文本。

例如给 `a` 连上 `apple`、给 `b` 连上 `red`，再在 format 里写 `{a} is {b}.`，就能生成 `apple is red.` 这样的字符串。

### Replace 节点 (文字替换)

![](/media/data-utilities/text-ops/legacy_gyazo_db1e540470805d5888a9c90b1381fa44.png){media=image}

把指定的字符替换成别的字符。
（例：`apple pen` → `orange pen`）

### Substring 节点 (文字提取)

![](/media/data-utilities/text-ops/legacy_gyazo_ab158488e388004f441a2258379c7930.png){media=image}

提取指定范围内的字符。
（例：`apple` → `ppl`）

- 截取从 `start` 到 `end` 的字符串。

### Trim Text 节点 (删除空白)

![](/media/data-utilities/text-ops/trim_text.png){media=image}

去掉字符串前后的空格。
（例：` apple ` → `apple`）

- 能避免用户输入等混入意外的空格而导致报错，虽然不起眼，却很重要。

### Length 节点 (计算字符数)

![](/media/data-utilities/text-ops/legacy_gyazo_cd8d1001ddaf646c85f31bfbf7df61fb.png){media=image}

计算字符的长度。
（例：`apple` → `5`）

- 空格和换行也各算 1 个字符。
- 输出为 **int 类型（数值）**。

---

## 高级操作（正则表达式）

用“正则表达式（Regex）”这套书写规则，来做复杂的搜索和替换。

### Regex Extract 节点

![](/media/data-utilities/text-ops/legacy_gyazo_ad16cc24b76fdffe4ed4adfd84a48563.png){media=image}

用正则表达式提取符合条件的字符串。

### Regex Replace 节点

![](/media/data-utilities/text-ops/legacy_gyazo_8f469774411a0096e3725a090fe41d9d.png){media=image}

用正则表达式替换符合条件的字符串。

---

## Power Puter (rgthree)

在 [简单计算](/zh/data-utilities/simple-math/) 中用过的 [rgthree-comfy](https://github.com/rgthree/rgthree-comfy) 的 `Power Puter` 也能输入输出 string，包括上面这些文本处理在内，都可以灵活地完成。

- [Node: Power Puter (Wiki)](https://github.com/rgthree/rgthree-comfy/wiki/Node:-Power-Puter)

![](/media/data-utilities/text-ops/legacy_gyazo_c6fd4f1e69b293da19f84963fa1e3ac1.png){media=image}

[](/workflows/data-utilities/text-ops/power_puter_rgthree_replace.json)
