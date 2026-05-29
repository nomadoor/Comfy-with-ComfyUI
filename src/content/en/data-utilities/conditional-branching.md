---
layout: page.njk
lang: en
section: data-utilities
slug: conditional-branching
navId: conditional-branching
title: "Conditional Branching"
created: 2026-05-28
updated: 2026-05-29
summary: "How to switch workflow behavior with Switch and Boolean values"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

ComfyUI is sometimes described as node-based programming, but at its simplest it is a straight path: put a model and prompts into KSampler, and an image comes out.

Still, sometimes you want to build a slightly more complex pipeline.

- If the input image is small, insert an upscale step.
- Analyze the image, and if the hands look broken, add a post-processing step.
- If the prompt contains certain text, switch to a different model or setting.
- ...

In programming, this kind of "change the process depending on a condition" is called conditional branching. ComfyUI also has basic nodes that let you do something close to this.

## Conditional Branching Basics

![](https://gyazo.com/42e0cbeb5ce32694423b50de55885358){gyazo=image}

[](/workflows/data-utilities/conditional-branching/Switch.json)

### Switching with Switch

The basic node for conditional branching is the **Switch node**.

It switches which of two inputs should be output.

With this, you can do things like output `a` when the condition matches, and output `b` when it does not.

### Pass a Boolean to Switch

In Switch, the value that decides which of the two inputs to output is a **Boolean**.

A Boolean is a simple type that can only be `true` or `false` (0 or 1). It is like a toggle switch.

Of course, you can click it manually, but that is not very interesting.

Switching the process programmatically is basically about how to create this Boolean.

---

## Ways to Create a Boolean

In programming, there are many ways to create a Boolean. Here, let's look at a few general-purpose methods available with ComfyUI core nodes.

### Math Expression

As shown in [Simple Math](/en/data-utilities/simple-math/), this node can compare numbers and create a Boolean.

For example, write the following.

![](https://gyazo.com/78cde905a66746c303948be75f9b02c6){gyazo=image}

[](/workflows/data-utilities/conditional-branching/Math_Expression.json)

```python
a == 20
```

Connect an `int` node that inputs a number such as `18` or `20` to `a`.
As you can see, it shows `true` only when the value is `20`, the value you set.

You can also use more numbers and variables.

```python
0 < a <= b * 100
```

With this expression, the result is `true` when `a` is greater than `0` and less than or equal to `b * 100`.

You can use comparison operators like these.

```python
a == b  # equal
a != b  # not equal
a > b   # a is greater than b
a >= b  # a is greater than or equal to b
a < b   # a is less than b
a <= b  # a is less than or equal to b
```

### Compare Text

To create a Boolean from text, use the `Compare Text` node.

It is very simple: it compares two strings and outputs the result as a Boolean.

For example, you can check whether the input text matches `Hello`, starts with `Hello`, or ends with `Hello`.

![](https://gyazo.com/d0c09611404d536c589fb34a690152e8){gyazo=image}

[](/workflows/data-utilities/conditional-branching/Compare_Text.json)

It compares `string_a` and `string_b`, and outputs `true` if the condition matches, or `false` if it does not.

- `mode`
  - `Starts With`: whether `string_a` starts with `string_b`
  - `Ends With`: whether `string_a` ends with `string_b`
  - `Equal`: whether `string_a` and `string_b` are the same
- Set `case_sensitive` to `true` to distinguish uppercase and lowercase.

### MLLM

A slightly richer method is to use an MLLM to create a Boolean.

We said that a Boolean is represented as `true` / `false`, but it can also be represented as `1` / `0`.

In other words, you can tell the MLLM, `If it is XX, output 1; otherwise output 0`, and then convert that result into a Boolean.

![](https://gyazo.com/09299f1fde08831664593c6f0b4c0d5e){gyazo=image}

[](/workflows/data-utilities/conditional-branching/Qwen3.5_4b.json)

- Here, we use the `TextGenerate` node with Qwen 3.5 4B.
- This is a little roundabout, but the MLLM output is text, meaning a `string`, so we convert it to an `int`, and then convert that to a `Boolean`.

Compared with simple number or text comparisons, MLLMs can handle much more flexible and complex judgments.

- How many people are in this image?
- Which model fits this prompt better: anime or realistic?
- Is the output image quality good or bad?

---

## Combining Multiple Conditions

Sometimes you want to combine multiple conditions, such as "the image height is 1000px or more **and** the width is less than 500px."

This is where **logical operators** are used.

### AND / OR / NOT

There are three logical operators: `AND` / `OR` / `NOT`.

When there are multiple Boolean inputs, they output `true` or `false` based on the combination.

![](https://gyazo.com/e7730a6112a0820ab0a65b4371f7e70b){gyazo=image}

[](/workflows/data-utilities/conditional-branching/AND_OR_NOT.json)

- **AND**: `true` only when all inputs are `true`
- **OR**: `true` when any input is `true`
- **NOT**: flips `true` and `false`

Of course, you can combine these.

For example, if you combine AND with NOT, you can output `false` when two inputs are both `true`.

No need to overthink it. Try using them and watch how they behave.

---

## Practical Examples

### Rotate 90 Degrees If the Image Is Portrait

![](https://gyazo.com/b6b8471813b62a487bf91519a04f7279){gyazo=image}

[](/workflows/data-utilities/conditional-branching/Rotate_If_Portrait.json)

1. Get the image size with `Get Image Size`
2. When the image is portrait, `width < height` becomes `true`
3. When it is `true`, output the input image after rotating it with `Rotate Image`

### Change a Woman into a Man If a Woman Is Shown

If a woman is shown, change her into a man. Otherwise, remove all people.

![](https://gyazo.com/cf499e4e4ed79b91d0020220c854d4ea){gyazo=image}

[](/workflows/data-utilities/conditional-branching/Switch_MLLM_Flux.2-Klein-9B.json)

1. Show the image to the MLLM, and make it output `1` if a woman is shown, or `0` otherwise
2. When `true`, switch to a prompt that changes the woman into a man; when `false`, switch to a prompt that removes people
3. Pass the image and prompt to Flux.2 Klein 9B for image editing
