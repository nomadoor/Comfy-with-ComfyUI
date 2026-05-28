---
layout: page.njk
lang: zh
section: data-utilities
slug: conditional-branching
navId: conditional-branching
title: "条件分支"
created: 2026-05-28
updated: 2026-05-29
summary: "使用 Switch 和 Boolean 切换工作流的处理流程"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

ComfyUI 有时会被称为节点式编程，但最基本的结构其实很简单：把模型和提示词输入 KSampler，然后输出图像。

不过，有时也会想构建稍微复杂一点的流程。

- 输入图像较小时，插入放大处理。
- 分析图像，如果手部可能崩坏，就加入后处理。
- 如果提示词中包含特定文字，就切换到另一种模型或设置。
- ...

这种“根据条件改变处理”的机制，在编程中叫做条件分支。ComfyUI 中也有一些基本节点，可以实现接近条件分支的处理。

## 条件分支的基本

![](https://gyazo.com/42e0cbeb5ce32694423b50de55885358){gyazo=image}

[](/workflows/data-utilities/conditional-branching/Switch.json)

### 用 Switch 切换

条件分支的基础是 **Switch 节点**。

它会在两个输入中切换要输出哪一个。

这样就可以做到：条件满足时输出 `a`，不满足时输出 `b`。

### Switch 需要传入 Boolean

在 Switch 中，用来决定两个输入中输出哪一个的值，就是 **Boolean**。

Boolean 是一种很简单的类型，只能是 `true` 或 `false`（0 or 1）。可以理解成一个开关。

当然，也可以手动点来切换，但这样就不太有意思了。

用程序式的方式切换处理，本质上就是在讨论：这个 Boolean 要怎么做出来。

---

## 创建 Boolean 的方法

在编程中，创建 Boolean 的方法有很多。这里先看几个 ComfyUI 核心节点中比较通用的方法。

### Math Expression

这个节点在 [简单计算](/zh/data-utilities/simple-math/) 中也用过。使用它可以比较数值，并创建 Boolean。

例如，可以这样写。

![](https://gyazo.com/78cde905a66746c303948be75f9b02c6){gyazo=image}

[](/workflows/data-utilities/conditional-branching/Math_Expression.json)

```python
a == 20
```

把输入 `18` 或 `20` 等数值的 `int` 节点连接到 `a`。
可以看到，只有当值为 `20`，也就是设定的值时，才会显示 `true`。

也可以使用更多数值和变量。

```python
0 < a <= b * 100
```

这个表达式中，当 `a` 大于 `0`，并且小于等于 `b * 100` 时，会得到 `true`。

还可以使用下面这些比较运算符。

```python
a == b  # 相等
a != b  # 不相等
a > b   # a 大于 b
a >= b  # a 大于等于 b
a < b   # a 小于 b
a <= b  # a 小于等于 b
```

### Compare Text

要从文字创建 Boolean，可以使用 `Compare Text` 节点。

功能非常简单：比较两个 string，并将结果作为 Boolean 输出。

例如，可以判断输入文本是否等于 `Hello`，是否以 `Hello` 开头，或是否以 `Hello` 结尾。

![](https://gyazo.com/d0c09611404d536c589fb34a690152e8){gyazo=image}

[](/workflows/data-utilities/conditional-branching/Compare_Text.json)

它会比较 `string_a` 和 `string_b`，条件满足时输出 `true`，不满足时输出 `false`。

- `mode`
  - `Starts With`: `string_a` 是否以 `string_b` 开头
  - `Ends With`: `string_a` 是否以 `string_b` 结尾
  - `Equal`: `string_a` 和 `string_b` 是否相同
- 将 `case_sensitive` 设为 `true` 时，会区分大小写。

### MLLM

稍微更丰富一点的方法，是使用 MLLM 来创建 Boolean。

前面说过，Boolean 可以用 `true` / `false` 表示，但其实也可以用数字 `1` / `0` 表示。

也就是说，可以对 MLLM 说：`如果是〇〇，就输出 1；否则输出 0`，然后把这个结果转换成 Boolean。

![](https://gyazo.com/09299f1fde08831664593c6f0b4c0d5e){gyazo=image}

[](/workflows/data-utilities/conditional-branching/Qwen3.5_4b.json)

- 这里使用 `TextGenerate` 节点，并使用 Qwen 3.5 4B。
- 稍微有点绕，但 MLLM 的输出是文本，也就是 `string`，所以先转换为 `int`，再转换为 `Boolean`。

相比单纯的数值或文本比较，使用 MLLM 可以做更灵活、更复杂的判断。

- 这张图里有几个人？
- 这个提示词更适合动漫模型，还是写实模型？
- 输出图像的质量好还是差？

---

## 组合多个条件

有时会想组合多个条件，例如“图像高度在 1000px 以上 **并且** 宽度小于 500px”。

这种场景会用到 **逻辑运算符**。

### AND / OR / NOT

逻辑运算符有三种：`AND` / `OR` / `NOT`。

当有多个 Boolean 输入时，会根据它们的组合输出 `true` 或 `false`。

![](https://gyazo.com/e7730a6112a0820ab0a65b4371f7e70b){gyazo=image}

[](/workflows/data-utilities/conditional-branching/AND_OR_NOT.json)

- **AND**: 只有全部为 `true` 时才输出 `true`
- **OR**: 只要有一个为 `true`，就输出 `true`
- **NOT**: 反转 `true` 和 `false`

当然，这些也可以组合使用。

例如，将 AND 和 NOT 组合起来，就可以在两个输入都为 `true` 时输出 `false`。

不用想得太复杂。实际连起来看看它们怎么动就可以了。

---

## 实践例

### 如果图像是竖图，就旋转 90 度

![](https://gyazo.com/b6b8471813b62a487bf91519a04f7279){gyazo=image}

[](/workflows/data-utilities/conditional-branching/Rotate_If_Portrait.json)

1. 使用 `Get Image Size` 获取图像尺寸
2. 图像为竖图时，`width < height` 会变成 `true`
3. 当结果为 `true` 时，输出用 `Rotate Image` 旋转后的输入图像

### 如果画面中有女性，就改成男性

如果画面中有女性，就将其改成男性。否则，删除所有人物。

![](https://gyazo.com/cf499e4e4ed79b91d0020220c854d4ea){gyazo=image}

[](/workflows/data-utilities/conditional-branching/Switch_MLLM_Flux.2-Klein-9B.json)

1. 让 MLLM 查看图像，如果画面中有女性就输出 `1`，否则输出 `0`
2. 当结果为 `true` 时，切换到“将女性改成男性”的提示词；为 `false` 时，切换到“删除人物”的提示词
3. 将图像和提示词传给 Flux.2 Klein 9B 进行图像编辑
