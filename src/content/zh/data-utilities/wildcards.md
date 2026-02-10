---
layout: page.njk
lang: zh
section: data-utilities
slug: wildcards
navId: wildcards
title: "通配符"
summary: "在每次队列执行时随机替换提示词的一部分"
permalink: "/{{ lang }}/data-utilities/{{ slug }}/"
hero:
  gradient: ""
---

## 什么是通配符？

通配符是一个在每次队列（queue）执行时，随机替换提示词一部分的功能，用来给生成结果增加变化。

例如写成 `photo of {red|yellow|blue} flower`，执行时会从 `red` / `yellow` / `blue` 里随机选一个。

一次性大量出图时，如果一直使用同一条提示词会比较单调，所以可以用这个方式让结果更有变化。

---

## 每次队列执行使用随机提示词生成图片

ComfyUI 的文本输入框（例如 `CLIP Text Encode`）默认支持 `{a|b|c}` 这种通配符写法。

![](https://gyazo.com/06d9e27bd6586911830efcd2c3ff50cc){gyazo=loop}

[](/workflows/data-utilities/wildcards/wildcard_core.json)

- `photo of {red|yellow|blue} flower`

  - 会从 `{}` 内的候选里选 1 个并展开到提示词中
  - 也就是说，可能变成 `photo of red flower`，也可能是 `photo of blue flower`

---

## Impact-Pack

默认可用的只是最基础的通配符形式。

如果你想做通配符嵌套、调整各词出现概率，或者从文本文件读取候选，最常见的做法是使用 Impact-Pack。

### 自定义节点

- [ltdrdata/ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack)

### ImpactWildcardProcessor / Encode

![](https://gyazo.com/851ccf19703e3b7b97f779e0cb6ae23f){gyazo=image}

[](/workflows/data-utilities/wildcards/ImpactWildcardProcessor.json)

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

你也可以单独准备词表文件，把它当作通配符源来调用。

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
