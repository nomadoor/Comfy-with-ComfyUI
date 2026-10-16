---
layout: page.njk
lang: zh
section: data-utilities
slug: simple-math
navId: simple-math
title: "简单计算"
created: 2025-11-24
updated: 2026-03-21
summary: "用于四则运算等基本计算的节点"
seoTitle: "在 ComfyUI 中计算：Math Expression 节点"
seoDescription: "在 ComfyUI 中进行图像尺寸计算等四则运算的方法。介绍核心的 Math Expression 节点、int 与 float 及类型转换、输入框中的简易计算，以及 rgthree 的 Power Puter。"

permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 简单计算

把图像尺寸刚好减半、调整 Batch Size……需要做简单四则运算的场景其实不少。
来看看能做这些事的节点吧。

---

> [!NOTE]
> 以前要做这些需要安装自定义节点，现在核心里已经加入了功能相同的节点，就不再需要了。

---

## Math Expression

![](/media/data-utilities/simple-math/legacy_gyazo_7ea9d7efa48a88e7b9bdfeef6b86d2d2.jpg){media=image}

[](/workflows/data-utilities/simple-math/math_expression.json)

`a`, `b`, `c` 里可以分别填入数值。
用这些变量写出 `a * b - c` 这样的式子，就能做简单的算术。

另外，它直接使用的是 Python 表达式，所以稍微复杂一点的计算也能做。

```python
a // b       # 整数除法（舍去小数点以下）
a % b        # 取余（除法的余数）
a ** b       # 幂运算（乘方）
(a + b) * c  # 用括号指定优先顺序

abs(a - b)   # 求绝对值
min(a, b)    # 返回最小值
max(a, b)    # 返回最大值
round(a / b) # 四雪五入

(a > b) * 1  # 逻辑表达式：条件数值化（若 a > b 则为 1, 否则为 0）
(a == b) * 1 # 逻辑表达式：判定是否相等
(a != b) * 1 # 逻辑表达式：判定是否不同
```

---

## int 类型与 float 类型

数字是有“类型 (Type)”的。
ComfyUI 中主要用到 **`int`** 和 **`float`** 两种。

- **int 类型**：仅整数（例：`512`, `32`, `1`）
  - Batch Size、图像分辨率等
- **float 类型**：可处理小数（例：`0.7`, `1.5`, `24.0`）
  - KSampler 的 strength、视频的 fps 等

输入输出的类型不对，就连不上节点。
好像能听到有人吐槽“全用 float 不就好了”，不过为了计算效率和精度，两者是分开的……习惯就好。

### 类型转换

顺便一提，让数值经过一次 `Math Expression` 节点，就能完成 `int` ↔ `float` 的转换。

即使输入是 float，只要输出端连接的是 int，就会自动转换。

![](/media/data-utilities/simple-math/legacy_gyazo_07161b2b92b1f8cedc7fa99cbf1d22cc.png){media=image}

[](/workflows/data-utilities/simple-math/math_expression_floatint.json)

---

## 【小技巧】在输入框里直接计算

如果只是简单到不值得用节点的计算，直接在输入框里写算式，填进去的就是计算后的值。

![](/media/data-utilities/simple-math/legacy_gyazo_a285ddb6cb86d6a0e8d3a58766afe51e.mp4){media=loop}

---

## Power Puter (rgthree)

使用 **[rgthree-comfy](https://github.com/rgthree/rgthree-comfy)** 提供的 `Power Puter`，可以获取图像尺寸、使用 if 语句等，虽然几乎已经是在编程了，但能做更复杂的处理。

cf. [Node: Power Puter (Wiki)](https://github.com/rgthree/rgthree-comfy/wiki/Node:-Power-Puter)

![](/media/data-utilities/simple-math/power_puter.png){media=image}

[](/workflows/data-utilities/simple-math/power_puter.json)
