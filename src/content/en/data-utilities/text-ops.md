---
layout: page.njk
lang: en
section: data-utilities
slug: text-ops
navId: text-ops
title: "Text Operations"
summary: "About nodes that manipulate text"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## Text Operations

![](https://i.gyazo.com/8731cc3b1bd685d83a13d37ffc0617ed.png){gyazo=image}

In ComfyUI, text is mainly handled as prompts.
Automating some operations, such as replacing part of a string or attaching trigger words to prompts created by LLMs, makes the workflow more convenient.


## What is a string?

In the programming world, text is called **string** to distinguish it from numbers and the like.

- `apple` → 5-character string
- `123` → Looks like a number, but is actually a string treated as text
- `" "` (Space) → Invisible, but a 1-character string

---

## Basic Operation Nodes

### Entering Text

![](https://i.gyazo.com/7669da6621b5fcb5b7cc0c539f4d5af7.png){gyazo=image}

**String** node and **String (Multiline)** node etc. are provided as nodes for entering character strings.

Multiline is simply one that allows line breaks.

### Concatenating Text

Combines multiple strings into one.
(Example: `apple` + `pen` → `applepen`)

![](https://i.gyazo.com/a20e6df7b2f65bf71d42c2070f79c726.png){gyazo=image}

- **Concatenate Node**
  - `delimiter` is a separator character. You can use whatever you like (comma, line break, etc.).

### Replacing Text

Replaces specified characters with other characters.
(Example: `apple pen` → `orange pen`)

![](https://i.gyazo.com/db1e540470805d5888a9c90b1381fa44.png){gyazo=image}

- **Replace Node**

### Extracting Part of Text

Extracts characters in a specified range.
(Example: `apple` → `ppl`)

![](https://i.gyazo.com/ab158488e388004f441a2258379c7930.png){gyazo=image}

- **Substring Node**
  - Extracts the string from the `start`th to the `end`th character.

### Removing Extra Spaces

Removes spaces before and after the string.
(Example: ` apple ` → `apple`)

![](https://i.gyazo.com/1b83d39d165c117f05e1d28ca88957ee.png){gyazo=image}

- **Trim Node**
  - It is plain but important because it prevents errors caused by unintended spaces in user input etc.

### Checking Character Count

Counts the length of the text.
(Example: `apple` → `5`)

![](https://i.gyazo.com/cd8d1001ddaf646c85f31bfbf7df61fb.png){gyazo=image}

- **Length Node**
  - Spaces and line breaks are also counted as 1 character.
  - The output will be **int type (number)**.

---

## Advanced Operations (Regular Expressions)

Performs complex searches and replacements using a description rule called "Regular Expression (Regex)".

### Extracting with Regular Expressions

![](https://i.gyazo.com/ad16cc24b76fdffe4ed4adfd84a48563.png){gyazo=image}

- **Regex Extract Node**

### Replacing with Regular Expressions

![](https://i.gyazo.com/8f469774411a0096e3725a090fe41d9d.png){gyazo=image}

- **Regex Replace Node**

---

## Power Puter (rgthree)

The `Power Puter` from [rgthree-comfy](https://github.com/rgthree/rgthree-comfy) used in [Simple Math](/en/data-utilities/simple-math/) can also input/output strings, so you can manipulate strings flexibly including the text processing mentioned above.

- [Node: Power Puter (Wiki)](https://github.com/rgthree/rgthree-comfy/wiki/Node:-Power-Puter)

![](https://i.gyazo.com/c6fd4f1e69b293da19f84963fa1e3ac1.png){gyazo=image}

[](/workflows/data-utilities/text-ops/Power_Puter_(rgthree)_Replace.json)
