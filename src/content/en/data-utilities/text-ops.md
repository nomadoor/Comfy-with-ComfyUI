---
layout: page.njk
lang: en
section: data-utilities
slug: text-ops
navId: text-ops
title: "Text Operations"
created: 2025-11-25
updated: 2026-05-27
summary: "Nodes for working with text"
seoTitle: "Text Nodes in ComfyUI: Concatenate, Replace, Regex"
seoDescription: "ComfyUI nodes for prompts and other strings: concatenate, replace, substring, and trim, plus regular expressions and rgthree's Power Puter."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## Text Operations

![](/media/data-utilities/text-ops/legacy_gyazo_8731cc3b1bd685d83a13d37ffc0617ed.png){media=image}

In ComfyUI, text mostly shows up as prompts.
Automating a few operations, like replacing part of a string or adding trigger words to a prompt an LLM wrote, makes your workflows more convenient.


## What is a string?

In programming, text is called a **string** to tell it apart from numbers and other data.

- `apple` → 5-character string
- `123` → Looks like a number, but is actually a string treated as text
- `" "` (Space) → Invisible, but a 1-character string

---

## Basic Operation Nodes

### String Node (Text Input)

![](/media/data-utilities/text-ops/legacy_gyazo_7669da6621b5fcb5b7cc0c539f4d5af7.png){media=image}

The basic node for entering a string.
Use the **String (Multiline)** node to enter text with line breaks.

### Concatenate Node (Text Joining)

![](/media/data-utilities/text-ops/legacy_gyazo_a20e6df7b2f65bf71d42c2070f79c726.png){media=image}

Combines multiple strings into one.
(Example: `apple` + `pen` → `applepen`)

- `delimiter` is the separator. You can use anything you like (a comma, a line break, etc.).

### Format Text Node

![](/media/data-utilities/text-ops/legacy_gyazo_b662c552b5e80b5b04cad422b72a19b2.png){media=image}

[](../../../workflows/data-utilities/text-ops/format_text.json)

This node lets you create a text template and insert other strings into it.

It can combine text more flexibly than Concatenate.

For example, if you connect `apple` to `a` and `red` to `b`, then write `{a} is {b}.` in format, it creates a string like `apple is red.`.

### Replace Node (Text Replacement)

![](/media/data-utilities/text-ops/legacy_gyazo_db1e540470805d5888a9c90b1381fa44.png){media=image}

Replaces the specified text with other text.
(Example: `apple pen` → `orange pen`)

### Substring Node (Text Extraction)

![](/media/data-utilities/text-ops/legacy_gyazo_ab158488e388004f441a2258379c7930.png){media=image}

Extracts the characters in a specified range.
(Example: `apple` → `ppl`)

- Cuts out the characters from position `start` to position `end`.

### Trim Text Node (Remove Spaces)

![](/media/data-utilities/text-ops/trim_text.png){media=image}

Removes spaces at the start and end of a string.
(Example: ` apple ` → `apple`)

- Unglamorous but important: it prevents errors from stray spaces in things like user input.

### Length Node (Character Count)

![](/media/data-utilities/text-ops/legacy_gyazo_cd8d1001ddaf646c85f31bfbf7df61fb.png){media=image}

Counts the length of the text.
(Example: `apple` → `5`)

- Spaces and line breaks are also counted as 1 character.
- The output is an **int (number)**.

---

## Advanced Operations (Regular Expressions)

These use a pattern syntax called regular expressions (Regex) for more complex searching and replacing.

### Regex Extract Node

![](/media/data-utilities/text-ops/legacy_gyazo_ad16cc24b76fdffe4ed4adfd84a48563.png){media=image}

Uses a regular expression to extract matching text.

### Regex Replace Node

![](/media/data-utilities/text-ops/legacy_gyazo_8f469774411a0096e3725a090fe41d9d.png){media=image}

Uses a regular expression to replace matching text.

---

## Power Puter (rgthree)

The `Power Puter` from [rgthree-comfy](https://github.com/rgthree/rgthree-comfy) that came up in [Simple Math](/en/data-utilities/simple-math/) can take and output strings too, so you can handle text flexibly, including everything covered above.

- [Node: Power Puter (Wiki)](https://github.com/rgthree/rgthree-comfy/wiki/Node:-Power-Puter)

![](/media/data-utilities/text-ops/legacy_gyazo_c6fd4f1e69b293da19f84963fa1e3ac1.png){media=image}

[](/workflows/data-utilities/text-ops/power_puter_rgthree_replace.json)
