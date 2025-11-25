---
layout: page.njk
lang: en
section: data-utilities
slug: simple-math
navId: simple-math
title: "Simple Math"
summary: "About nodes that perform basic calculations such as arithmetic operations"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## Simple Math

There are often situations where you want to perform simple arithmetic operations, such as halving the image size neatly or adjusting the batch size.
Let's look at the nodes for that.

## Recommended Custom Nodes

Since it is a simple function, you can find as many implementations as you want if you look for them, but either of the following custom nodes is sufficient. (I wish it would be implemented as a core node...)

- **[ComfyUI_essentials](https://github.com/cubiq/ComfyUI_essentials)**
  - It is an excellent node, but since it is almost in an archived state, I will replace it if I find a better node.
- **[ComfyUI-Custom-Scripts](https://github.com/pythongosssss/ComfyUI-Custom-Scripts)**

Here, we will explain using the **Simple Math** node of **ComfyUI_essentials** as an example.

---

## Simple Math

![](https://gyazo.com/02da3cbf7851b49c8ba18326cda16d3c){gyazo=image}

[](/workflows/data-utilities/simple-math/Simple_Math.json)

You can put numerical values in `a`, `b`, and `c` respectively.
Using those variables, if you write like `a * b - c`, you can perform simple arithmetic.

Also, since this uses Python expressions as they are, slightly more advanced calculations can also be performed.

```python
a // b       # Integer division (truncate decimal places)
a % b        # Modulo (remainder of division)
a ** b       # Exponentiation (power)
(a + b) * c  # Specify priority with parentheses

abs(a - b)   # Calculate absolute value
min(a, b)    # Return minimum value
max(a, b)    # Return maximum value
round(a / b) # Round off

(a > b) * 1  # Logical expression: Quantify condition (1 if a > b, otherwise 0)
(a == b) * 1 # Logical expression: Determine if equal
(a != b) * 1 # Logical expression: Determine if different
```

---

## int type and float type

Numbers have "types".
In ComfyUI, we mainly use two types: **`int`** and **`float`**.

- **int type**: Integers only (e.g., `512`, `32`, `1`)
  - Batch size, image resolution, etc.
- **float type**: Can handle decimals (e.g., `0.7`, `1.5`, `24.0`)
  - KSampler strength, video fps, etc.

You cannot connect to a node unless you input/output with the appropriate type.
I can almost hear the retort "Why not just use float for everything?", but they are distinguished for calculation efficiency and precision... let's get used to it.

### Type Conversion

By the way, passing a value through the `Simple Math` node once allows you to convert between `int` ↔ `float`.

Even if the input is float, if the output destination is int, it will automatically convert it.

![](https://gyazo.com/2265cc54a515359586944c94f258df50){gyazo=image}

[](/workflows/data-utilities/simple-math/Simple_Math_FloatInt.json)

---

## [Tip] Simple Calculation in Input Field

For simple calculations that don't warrant using a node, if you write the calculation formula directly in the input field, the calculated value will be input.

![](https://gyazo.com/a285ddb6cb86d6a0e8d3a58766afe51e){gyazo=image}

---

## Power Puter (rgthree)

Using `Power Puter` added by **[rgthree-comfy](https://github.com/rgthree/rgthree-comfy)** allows for more complex processing, such as getting image sizes or using if statements, which is almost programming.

- [Node: Power Puter (Wiki)](https://github.com/rgthree/rgthree-comfy/wiki/Node:-Power-Puter)

![](https://gyazo.com/20c5f92d6ef1e7057c6d42e2065d84b1){gyazo=image}

[](/workflows/data-utilities/simple-math/Power_Puter.json)
