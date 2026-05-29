---
layout: page.njk
lang: zh
section: data-utilities
slug: text-ops
navId: text-ops
title: "文本操作"
created: 2026-02-06
updated: 2026-05-27
summary: "关于操作文本的节点"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 文本的操作

![](https://i.gyazo.com/8731cc3b1bd685d83a13d37ffc0617ed.png){gyazo=image}

在 ComfyUI 中，文本主要作为提示词来使用。
通过自动化一些操作，如替换部分字符串，或将触发词附加到 LLM 创建的提示词中，可以使 工作流 更加便捷。


## 什么是 string？

在编程世界中，为了区分文本和数字等，将文本称为 **string（字符串）**。

- `apple` → 5 个字符的 string
- `123` → 看起来是数字，但实际上是作为字符处理的 string
- `" "` (空白) → 虽然看不见，但是是 1 个字符的 string

---

## 基本操作节点

### String 节点 (文字输入)

![](https://i.gyazo.com/7669da6621b5fcb5b7cc0c539f4d5af7.png){gyazo=image}

输入字符串的基本节点。
使用 **String (Multiline)** 节点，可以输入包含换行符的文本。

### Concatenate 节点 (文字结合)

![](https://i.gyazo.com/a20e6df7b2f65bf71d42c2070f79c726.png){gyazo=image}

将多个 string 连接成一个。
（例：`apple` + `pen` → `applepen`）

- `delimiter` 是指分隔符。可以使用喜欢的字符（逗号或换行符等）。

### Format Text 节点

![](https://gyazo.com/b662c552b5e80b5b04cad422b72a19b2){gyazo=image}

[](../../../workflows/data-utilities/text-ops/Format_Text.json)

这个节点可以先写好文章的模板，再把其他 string 插入进去。

相比 Concatenate，它可以更灵活地组合文本。

例如，将 `apple` 连接到 `a`，将 `red` 连接到 `b`，然后在 format 中写入 `{a} is {b}.`，就可以生成类似 `apple is red.` 的字符串。

### Replace 节点 (文字替换)

![](https://i.gyazo.com/db1e540470805d5888a9c90b1381fa44.png){gyazo=image}

将指定的字符替换为其他字符。
（例：`apple pen` → `orange pen`）

### Substring 节点 (文字提取)

![](https://i.gyazo.com/ab158488e388004f441a2258379c7930.png){gyazo=image}

提取指定范围的字符。
（例：`apple` → `ppl`）

- 截取从 `start` 到 `end` 的字符串。

### Trim 节点 (删除空白)

![](https://i.gyazo.com/1b83d39d165c117f05e1d28ca88957ee.png){gyazo=image}

删除字符串前后的空格。
（例：` apple ` → `apple`）

- 由于可以防止因用户输入等导致意外混入空白而报错，虽然不起眼但很重要。

### Length 节点 (计算字符数)

![](https://i.gyazo.com/cd8d1001ddaf646c85f31bfbf7df61fb.png){gyazo=image}

计算字符的长度。
（例：`apple` → `5`）

- 空格和换行符也被算作 1 个字符。
- 输出将是 **int 类型（数值）**。

---

## 高级操作（正则表达式）

使用“正则表达式（Regex）”这一描述规则，进行复杂的搜索或替换。

### Regex Extract 节点

![](https://i.gyazo.com/ad16cc24b76fdffe4ed4adfd84a48563.png){gyazo=image}

使用正则表达式，提取符合条件的字符串。

### Regex Replace 节点

![](https://i.gyazo.com/8f469774411a0096e3725a090fe41d9d.png){gyazo=image}

使用正则表达式，替换符合条件的字符串。

---

## Power Puter (rgthree)

在 [简单计算](/zh/data-utilities/simple-math/) 中使用的 [rgthree-comfy](https://github.com/rgthree/rgthree-comfy) 的 `Power Puter` 也可以输入输出 string，因此可以灵活地操作字符串，包括上述的文本处理。

- [Node: Power Puter (Wiki)](https://github.com/rgthree/rgthree-comfy/wiki/Node:-Power-Puter)

![](https://i.gyazo.com/c6fd4f1e69b293da19f84963fa1e3ac1.png){gyazo=image}

[](/workflows/data-utilities/text-ops/Power_Puter_(rgthree)_Replace.json)
