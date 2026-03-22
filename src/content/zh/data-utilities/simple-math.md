---
layout: page.njk
lang: zh
section: data-utilities
slug: simple-math
navId: simple-math
title: "简单计算"
summary: "关于四则运算等、执行基本计算的节点"

permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 简单计算

经常会有想要简单地进行四则运算的场景，比如将图像尺寸精准地减半，或者调整 Batch Size 等。
让我们来看看用于这些操作的节点。

---

> 以前做这件事需要安装自定义节点，但现在核心已经加入了类似功能的节点，所以已经不需要了。

---

## Math Expression

![](https://gyazo.com/7ea9d7efa48a88e7b9bdfeef6b86d2d2){gyazo=image}

[](/workflows/data-utilities/simple-math/Math_Expression.json)

可以在 `a`, `b`, `c` 中分别输入数值。
利用这些变量，写成 `a * b - c` 这样，就可以进行简单的算术运算。

此外，由于它是直接使用 Python 的表达式，所以也可以进行稍微高级一点的计算。

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

数字也有“类型 (Type)”。
在 ComfyUI 中主要使用 **`int`** 和 **`float`** 这两种。

- **int 类型**：仅整数（例：`512`, `32`, `1`）
  - Batch Size 或 图像分辨率等
- **float 类型**：可处理小数（例：`0.7`, `1.5`, `24.0`）
  - KSampler 的 strength 或 视频的 fps 等

如果不以适当的类型进行输入输出，就无法连接到节点。
虽然可能会有“全部用 float 不就行了吗”这样的吐槽，但为了计算效率和精度，它们是被区分开的……习惯就好。

### 类型的转换

顺便提一下，将数值通过一次 `Math Expression` 节点，就可以进行 `int` ↔ `float` 的转换。

即使输入是 float，如果输出目标是 int，它也会自动进行转换。

![](https://gyazo.com/07161b2b92b1f8cedc7fa99cbf1d22cc){gyazo=image}

[](/workflows/data-utilities/simple-math/Math_Expression_FloatInt.json)

---

## 【小技巧】输入栏中的简易计算

如果是不用节点也能解决的简单计算，直接在输入栏中写入计算式，输入的就是计算后的值。

![](https://gyazo.com/a285ddb6cb86d6a0e8d3a58766afe51e){gyazo=image}

---

## Power Puter (rgthree)

使用 **[rgthree-comfy](https://github.com/rgthree/rgthree-comfy)** 添加的 `Power Puter`，可以获取图像尺寸，或者使用 if 语句，这已经几乎是编程了，但可以进行更复杂的处理。

cf. [Node: Power Puter (Wiki)](https://github.com/rgthree/rgthree-comfy/wiki/Node:-Power-Puter)

![](https://gyazo.com/20c5f92d6ef1e7057c6d42e2065d84b1){gyazo=image}

[](/workflows/data-utilities/simple-math/Power_Puter.json)
