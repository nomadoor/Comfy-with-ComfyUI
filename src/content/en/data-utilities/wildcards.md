---
layout: page.njk
lang: en
section: data-utilities
slug: wildcards
navId: wildcards
title: "Wildcards"
summary: "Randomly replace part of a prompt for each queue run"
permalink: "/{{ lang }}/data-utilities/{{ slug }}/"
hero:
  gradient: ""
---

## What are wildcards?

Wildcards are a feature that randomly replaces part of a prompt for each queue run, so you can add variation to generated results.

For example, if you write `photo of {red|yellow|blue} flower`, one of `red` / `yellow` / `blue` will be selected at execution time.

When you generate many images at once, using the exact same prompt can get repetitive, so this is a simple way to add variety.

---

## Generate images with a random prompt per queue run

ComfyUI text fields (for example, `CLIP Text Encode`) support wildcard syntax in the `{a|b|c}` format by default.

![](https://gyazo.com/06d9e27bd6586911830efcd2c3ff50cc){gyazo=loop}

[](/workflows/data-utilities/wildcards/wildcard_core.json)

- `photo of {red|yellow|blue} flower`

  - One option inside `{}` is selected and expanded into the prompt
  - So you might get `photo of red flower` or `photo of blue flower`

---

## Impact-Pack

By default, only the simplest wildcard pattern is available.

If you want to nest wildcards, bias word frequency, or load candidates from text files, Impact-Pack is the standard choice.

### Custom node

- [ltdrdata/ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack)

### ImpactWildcardProcessor / Encode

![](https://gyazo.com/851ccf19703e3b7b97f779e0cb6ae23f){gyazo=image}

[](/workflows/data-utilities/wildcards/ImpactWildcardProcessor.json)

- Write your wildcard text in the upper field
- The expanded result is shown in the lower field

`ImpactWildcardEncode` can also switch LoRA entries as wildcards.

### Wildcard syntax (Impact-Pack)

**dynamic prompts**

This is the most basic form: list candidates inside `{}`.

- `{a|b|c}`

  - One item is selected using `|`
- `{a|{1|2|3}|c}`

  - Nesting is supported
- `{5::red|4::green|7::blue|black}`

  - Add `n::` in front of each item to bias the probability
  - Larger numbers are selected more often (probabilities are normalized from the total)

**Load from a text file**

You can prepare a word list separately and call it as a wildcard source.

- 1. Location

  - `custom_nodes/ComfyUI-Impact-Pack/custom_wildcards`
- 2. Format

  - Example: `color.txt`

    ```text
    red
    blue
    yellow
    ```

- 3. Call it

  - Writing `__color__` picks one random line from the text file
  - `__color__ hair` expands to values like `red hair` / `blue hair` / `yellow hair`
- Subfolders are also supported

  - If you place `custom_wildcards/obj/color.txt`, call it as `__obj/color__`

**`$$` (multi-select)**

`$$` is syntax for selecting multiple candidates and returning them as one string.

- `{n$$red|blue|yellow}`

  - Selects `n` items from `red/blue/yellow`
  - Example: `{2$$red|blue|yellow}` -> `red blue` / `blue yellow`
- `{n1-n2$$red|blue|yellow}`

  - Selects between `n1` and `n2` items (count is also random)
  - Example: `{1-3$$red|blue|yellow}` can be `red` or `red blue yellow`
- `{2$$ and $$red|blue|yellow}`
  - You can define a delimiter for joining
  - Example: `{2$$ and $$red|blue|yellow}` -> `red and yellow` / `blue and red`
