---
layout: page.njk
lang: en
section: data-utilities
slug: simple-math
navId: simple-math
title: "Simple Math"
created: 2025-11-24
updated: 2026-03-21
summary: "Nodes for basic calculations like arithmetic"
seoTitle: "Math in ComfyUI: The Math Expression Node"
seoDescription: "Do arithmetic in ComfyUI: the core Math Expression node, int vs. float and type conversion, quick math in input fields, and rgthree's Power Puter."

permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## Simple Math

You'll often need simple arithmetic, like cleanly halving an image size or adjusting the batch size.
Let's look at the nodes for that.

---

> [!NOTE]
> I used to install a custom node for this, but core now has a node that does the same thing, so it's no longer needed.

---

## Math Expression

![](/media/data-utilities/simple-math/legacy_gyazo_7ea9d7efa48a88e7b9bdfeef6b86d2d2.jpg){media=image}

[](/workflows/data-utilities/simple-math/math_expression.json)

You can put a number into each of `a`, `b`, and `c`.
Then write something like `a * b - c` with those variables to do basic arithmetic.

And since it takes Python expressions as-is, you can do somewhat more advanced math too.

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

## int and float

Numbers have types.
ComfyUI mainly uses two: **`int`** and **`float`**.

- **int type**: Integers only (e.g., `512`, `32`, `1`)
  - Batch size, image resolution, etc.
- **float type**: Can handle decimals (e.g., `0.7`, `1.5`, `24.0`)
  - KSampler strength, video fps, etc.

You can't connect nodes unless the types match.
I can already hear someone saying "Why not just make everything a float?", but they're kept separate for efficiency and precision... you'll just have to get used to it.

### Type Conversion

By the way, passing a value through a `Math Expression` node lets you convert between `int` ↔ `float`.

Even if the input is a float, it's converted automatically when the destination expects an int.

![](/media/data-utilities/simple-math/legacy_gyazo_07161b2b92b1f8cedc7fa99cbf1d22cc.png){media=image}

[](/workflows/data-utilities/simple-math/math_expression_floatint.json)

---

## [Tip] Quick Math in Input Fields

For simple math that isn't worth a node, type the expression straight into an input field and it fills in the result.

![](/media/data-utilities/simple-math/legacy_gyazo_a285ddb6cb86d6a0e8d3a58766afe51e.mp4){media=loop}

---

## Power Puter (rgthree)

With `Power Puter` from **[rgthree-comfy](https://github.com/rgthree/rgthree-comfy)**, you can do more complex things, like getting an image's size or using if statements. At that point it's pretty much programming.

cf. [Node: Power Puter (Wiki)](https://github.com/rgthree/rgthree-comfy/wiki/Node:-Power-Puter)

![](/media/data-utilities/simple-math/power_puter.png){media=image}

[](/workflows/data-utilities/simple-math/power_puter.json)
