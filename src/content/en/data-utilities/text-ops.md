---
layout: page.njk
lang: en
section: data-utilities
slug: text-ops
navId: text-ops
title: "Text Operations"
created: 2025-11-25
updated: 2026-05-27
summary: "About nodes that manipulate text"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## Text Operations

![](/media/data-utilities/text-ops/legacy_gyazo_8731cc3b1bd685d83a13d37ffc0617ed.png){media=image}

In ComfyUI, text is mainly handled as prompts.
Automating some operations, such as replacing part of a string or attaching trigger words to prompts created by LLMs, makes the workflow more convenient.


## What is a string?

In the programming world, text is called **string** to distinguish it from numbers and the like.

- `apple` → 5-character string
- `123` → Looks like a number, but is actually a string treated as text
- `" "` (Space) → Invisible, but a 1-character string

---

## Basic Operation Nodes

### String Node (Text Input)

![](/media/data-utilities/text-ops/legacy_gyazo_7669da6621b5fcb5b7cc0c539f4d5af7.png){media=image}

This is a basic node for entering character strings.
Using the **String (Multiline)** node allows you to enter text containing line breaks.

### Concatenate Node (Text Joining)

![](/media/data-utilities/text-ops/legacy_gyazo_a20e6df7b2f65bf71d42c2070f79c726.png){media=image}

Combines multiple strings into one.
(Example: `apple` + `pen` → `applepen`)

- `delimiter` is a separator character. You can use whatever you like (comma, line break, etc.).

### Format Text Node

![](/media/data-utilities/text-ops/legacy_gyazo_b662c552b5e80b5b04cad422b72a19b2.png){media=image}

[](../../../workflows/data-utilities/text-ops/format_text.json)

This node lets you create a text template and insert other strings into it.

It can combine text more flexibly than Concatenate.

For example, if you connect `apple` to `a` and `red` to `b`, then write `{a} is {b}.` in format, it creates a string like `apple is red.`.

### Replace Node (Text Replacement)

![](/media/data-utilities/text-ops/legacy_gyazo_db1e540470805d5888a9c90b1381fa44.png){media=image}

Replaces specified characters with other characters.
(Example: `apple pen` → `orange pen`)

### Substring Node (Text Extraction)

![](/media/data-utilities/text-ops/legacy_gyazo_ab158488e388004f441a2258379c7930.png){media=image}

Extracts characters in a specified range.
(Example: `apple` → `ppl`)

- Extracts the string from the `start`th to the `end`th character.

### Trim Text Node (Remove Spaces)

![](/media/data-utilities/text-ops/trim_text.png){media=image}

Removes spaces before and after the string.
(Example: ` apple ` → `apple`)

- It is plain but important because it prevents errors caused by unintended spaces in user input etc.

### Length Node (Character Count)

![](/media/data-utilities/text-ops/legacy_gyazo_cd8d1001ddaf646c85f31bfbf7df61fb.png){media=image}

Counts the length of the text.
(Example: `apple` → `5`)

- Spaces and line breaks are also counted as 1 character.
- The output will be **int type (number)**.

---

## Advanced Operations (Regular Expressions)

Performs complex searches and replacements using a description rule called "Regular Expression (Regex)".

### Regex Extract Node

![](/media/data-utilities/text-ops/legacy_gyazo_ad16cc24b76fdffe4ed4adfd84a48563.png){media=image}

Extracts strings that match the condition using regular expressions.

### Regex Replace Node

![](/media/data-utilities/text-ops/legacy_gyazo_8f469774411a0096e3725a090fe41d9d.png){media=image}

Replaces strings that match the condition using regular expressions.

---

## Power Puter (rgthree)

The `Power Puter` from [rgthree-comfy](https://github.com/rgthree/rgthree-comfy) used in [Simple Math](/en/data-utilities/simple-math/) can also input/output strings, so you can manipulate strings flexibly including the text processing mentioned above.

- [Node: Power Puter (Wiki)](https://github.com/rgthree/rgthree-comfy/wiki/Node:-Power-Puter)

![](/media/data-utilities/text-ops/legacy_gyazo_c6fd4f1e69b293da19f84963fa1e3ac1.png){media=image}

[](/workflows/data-utilities/text-ops/power_puter_rgthree_replace.json)
