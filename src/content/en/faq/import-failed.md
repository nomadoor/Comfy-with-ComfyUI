---
layout: page.njk
lang: en
section: faq
slug: import-failed
navId: import-failed
title: "(IMPORT FAILED)"
summary: "Custom node loading failure"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## Symptom

![](https://gyazo.com/3054a82b909490117748ae061e29c35e){gyazo=image}

- When starting ComfyUI, multiple lines of `(IMPORT FAILED)` appear in the terminal, and specific custom nodes cannot be used or do not appear in the node list.

## Timing of occurrence

- Immediately after starting ComfyUI.
- When installed custom nodes do not appear in the node list.

## Cause

- Essential libraries are missing, or an incompatible Python / PyTorch version is used.
  - If you scroll up from `(IMPORT FAILED)` in the terminal, you will see `ModuleNotFoundError: No module named 'facenet_pytorch'`, etc., indicating that the library required for that custom node cannot be found.
- Path or OS dependent issues.
  - Example: Cases like `UnicodeDecodeError('cp932' codec can't decode byte 0x87...)` where having non-ASCII characters in the folder path causes errors.
- Conflict with other custom nodes.
  - Sometimes nodes with old frontend implementations or unique dependencies crash because they are incompatible with the new ComfyUI.

## Solution

- **If libraries are missing**
  - If you are familiar with Python, you can `pip install` yourself, but otherwise, first open the GitHub of that custom node and check if the installation method is correct.
  - Currently, if it is via ComfyUI Manager, many nodes install necessary libraries all together. Unless there is a special reason, please install from Manager first.
  - Even for nodes where special procedures like "Please run this script manually" are written in README, if you don't understand well, please do not touch it in the first place.

- **If conflict with other custom nodes is suspected**
  - If possible, evacuate custom nodes other than the one outputting `(IMPORT FAILED)` from `custom_nodes`, and check if ComfyUI starts with only that node remaining.
  - After that, return them little by little in combinations of "problem node + one other node" to isolate which node causes the crash when combined.
  - If you don't need to use it that much, uninstall that node (delete the folder itself).
