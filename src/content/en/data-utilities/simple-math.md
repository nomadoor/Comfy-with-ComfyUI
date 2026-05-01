---
layout: page.njk
lang: en
section: data-utilities
slug: simple-math
navId: simple-math
title: "Simple Math"
created: 2025-11-25
updated: 2026-03-21
summary: "About nodes that perform basic calculations such as arithmetic operations"

permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## Simple Math

There are often situations where simple arithmetic operations are performed, such as neatly halving the image size or adjusting the batch size.
Let's look at the nodes for that.

---

> Previously, a custom node was needed for this, but now a similar node has been added to the core, so it is no longer necessary.

---

## Math Expression

![](https://gyazo.com/7ea9d7efa48a88e7b9bdfeef6b86d2d2){gyazo=image}

[](/workflows/data-utilities/simple-math/Math_Expression.json)

You can enter numbers in `a`, `b`, and `c` respectively.
Using those variables, if you write like `a * b - c`, you can simply perform arithmetic.

Also, since this uses Python expressions as is, you can perform slightly more advanced calculations.

```python
a // b       # Integer division (truncate decimal places)
a % b        # Modulo (remainder of division)
a ** b       # Exponentiation (power)
(a + b) * c  # Specify priority with parentheses

abs(a - b)   # Find absolute value
min(a, b)    # Return minimum value
max(a, b)    # Return maximum value
round(a / b) # Round off

(a > b) * 1  # Logic expression: Convert condition to number (1 if a > b, otherwise 0)
(a == b) * 1 # Logic expression: Determine if equal
(a != b) * 1 # Logic expression: Determine if different
```

---

## int type and float type

Numbers have "types".
ComfyUI mainly uses two types: **`int`** and **`float`**.

- **int type**: Integers only (e.g., `512`, `32`, `1`)
  - Batch size, image resolution, etc.
- **float type**: Can handle decimals (e.g., `0.7`, `1.5`, `24.0`)
  - KSampler strength, video fps, etc.

You cannot connect to nodes unless you input/output with the appropriate type.
I can hear a tsukkomi saying "Everything is fine with float", but they are distinguished for calculation efficiency and precision... Let's get used to it.

### Type Conversion

By the way, if you pass the value through the `Math Expression` node once, you can convert between `int` ↔ `float`.

Even if the input is float, if the output destination is int, it will automatically convert it.

![](https://gyazo.com/07161b2b92b1f8cedc7fa99cbf1d22cc){gyazo=image}

[](/workflows/data-utilities/simple-math/Math_Expression_FloatInt.json)

---

## [Tip] Simple calculation in input field

If it is a simple calculation that does not worth using a node, if you write the calculation formula directly in the input field, the calculated value will be input.

![](https://gyazo.com/a285ddb6cb86d6a0e8d3a58766afe51e){gyazo=image}

---

## Power Puter (rgthree)

If you use `Power Puter` added by **[rgthree-comfy](https://github.com/rgthree/rgthree-comfy)**, you can get image size or use if statements, which is almost programming, but you can perform more complex processing.

cf. [Node: Power Puter (Wiki)](https://github.com/rgthree/rgthree-comfy/wiki/Node:-Power-Puter)

![](https://gyazo.com/20c5f92d6ef1e7057c6d42e2065d84b1){gyazo=image}

[](/workflows/data-utilities/simple-math/Power_Puter.json)
