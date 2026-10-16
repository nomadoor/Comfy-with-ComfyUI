---
layout: page.njk
lang: zh
section: data-utilities
slug: wildcards
navId: wildcards
title: "通配符"
created: 2026-02-10
updated: 2026-03-02
summary: "在每次队列执行时随机替换提示词的一部分"
seoTitle: "ComfyUI 通配符：随机替换提示词"
seoDescription: "在 ComfyUI 中每次队列执行时随机替换提示词一部分的方法。介绍标准的 {a|b|c} 写法和 Impact-Pack 的通配符语法，附工作流。"
permalink: "/{{ lang }}/data-utilities/{{ slug }}/"
hero:
  gradient: ""
---

## 什么是通配符？

通配符可以在每次队列（queue）执行时随机替换提示词的一部分，让生成结果有所变化。

例如写成 `photo of {red|yellow|blue} flower`，执行时会从 `red` / `yellow` / `blue` 里随机选一个。

一次大量出图时，提示词一成不变就没意思了，用它给画面加点变化吧！

---

## 每次队列执行时用随机提示词生成图片

ComfyUI 的文本输入框（例如 `CLIP Text Encode`）默认支持 `{a|b|c}` 这种通配符写法。

![](/media/data-utilities/wildcards/legacy_gyazo_06d9e27bd6586911830efcd2c3ff50cc.mp4){media=loop}

[](/workflows/data-utilities/wildcards/wildcard_core.json)

- `photo of {red|yellow|blue} flower`

  - 会从 `{}` 内的候选里选 1 个并展开到提示词中
  - 也就是说，有时是 `photo of red flower`，有时是 `photo of blue flower`

---

## Impact-Pack

默认只能用最简单的通配符形式。

如果想嵌套通配符、让某些词更容易出现，或者从文本文件读取候选，一般都会用 Impact-Pack。

### 自定义节点

- [ltdrdata/ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack)

### ImpactWildcardProcessor / Encode

![](/media/data-utilities/wildcards/legacy_gyazo_851ccf19703e3b7b97f779e0cb6ae23f.png){media=image}

[](/workflows/data-utilities/wildcards/impactwildcardprocessor.json)

- 上方输入通配符文本
- 下方会显示展开后的文本

`ImpactWildcardEncode` 在此基础上还可以把 LoRA 作为通配符切换。

### 通配符语法（Impact-Pack）

**dynamic prompts**

最基础的写法是在 `{}` 里列出候选项。

- `{a|b|c}`

  - 用 `|` 分隔，随机选 1 个
- `{a|{1|2|3}|c}`

  - 支持嵌套
- `{5::red|4::green|7::blue|black}`

  - 在项目前加 `n::` 可以设置权重
  - 数字越大越容易被选中（最终会按总和归一化）

**读取文本文件**

也可以另外准备一份词表，把它当作通配符来调用。

- 1. 放置位置

  - `custom_nodes/ComfyUI-Impact-Pack/custom_wildcards`
- 2. 写法

  - 例：`color.txt`

    ```text
    red
    blue
    yellow
    ```

- 3. 调用方式

  - 写 `__color__` 时，会从文本文件随机选取 1 行
  - `__color__ hair` 会展开成 `red hair` / `blue hair` / `yellow hair` 这类结果
- 也支持子文件夹

  - 如果放在 `custom_wildcards/obj/color.txt`，则写成 `__obj/color__`

**`$$`（多选）**

`$$` 用于从候选中选多个，并把它们作为一段字符串返回。

- `{n$$red|blue|yellow}`

  - 从 `red/blue/yellow` 中选择 `n` 个
  - 例：`{2$$red|blue|yellow}` -> `red blue` / `blue yellow`
- `{n1-n2$$red|blue|yellow}`

  - 选择 `n1` 到 `n2` 个（数量本身也是随机）
  - 例：`{1-3$$red|blue|yellow}` 可能是 `red`，也可能是 `red blue yellow`
- `{2$$ and $$red|blue|yellow}`
  - 可以指定连接分隔符
  - 例：`{2$$ and $$red|blue|yellow}` -> `red and yellow` / `blue and red`
