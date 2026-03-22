---
layout: page.njk
lang: en
section: data-utilities
slug: list
navId: list
title: "List"
summary: "Concept of continuous processing using multiple data"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## What is List?

List is a mechanism for handling multiple data as a "single group".

While Queue executes "the same workflow multiple times", List processes **multiple inputs sequentially in a single execution**.

- **Queue**
  - Executes the same workflow repeatedly from the outside
- **List**
  - Processes multiple inputs sequentially on the inside

It is easier to understand if you think of it as the difference between "Pressing Run multiple times" and "Pouring multiple inputs in a single Run".

---

## Required Custom Nodes

Since standard ComfyUI nodes cannot create Lists, you need to introduce custom nodes.

- [ltdrdata/ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack)
- [ltdrdata/ComfyUI-Inspire-Pack](https://github.com/ltdrdata/ComfyUI-Inspire-Pack)
- [godmt/ComfyUI-List-Utils](https://github.com/godmt/ComfyUI-List-Utils)

---

## Creating a List

### Make List (Any) Node

This is a node for manually assembling a List.
It groups any type (Image / Text / Number, etc.) into a single List.

![](https://gyazo.com/b6433f5c097164a60a762e4cc24f442f){gyazo=image}

[](/workflows/data-utilities/list/Make_List_(Any).json)

- Slots increase as you connect nodes, so you can add as many as you like.
- Once connected, it is "fixed to that data type".
  - If you want to switch to another data type, reset with Fix node (recreate) or place a new node.


### Load Image List From Dir (Inspire) Node

Reads images in a folder collectively and creates a List of `IMAGE`.

![](https://gyazo.com/4003d1d985e5153aab3cfe4f68c7d979){gyazo=image}

[](/workflows/data-utilities/list/Load_Image_List_From_Dir_(Inspire).json)

- `directory`: Enter the path of the folder to read
- `load_always`: Whether to reload every time the contents of the folder change
  - If you use load_always as disabled, ComfyUI assumes "if the path is the same as last time, the contents are the same" and does not reload even if there are changes in the folder (adding/deleting images, etc.).
  - If you want to replace images and re-execute, set `load_always` to `enabled`.

### Split String

Splits one long `STRING` with a delimiter and converts it to a List.

![](https://gyazo.com/ec2466a80a39f2d4a1c79526167b5293){gyazo=image}

[](/workflows/data-utilities/list/Split_String.json)

- `delimiter`: Delimiter character (`,` might be better avoided as it is often used in prompts)
- `splitlines`: Split by newlines
- `strip` : Remove leading and trailing whitespace

---

## Extracting from List

### Select Nth Item (Any list) Node

Extracts only one element at the specified position from the List.

![](https://gyazo.com/f1d3281970effbc7a2fc8a782f1a21ab){gyazo=image}

[](/workflows/data-utilities/list/Select_Nth_Item_(Any_list).json)

- `index`: Position to extract (0, 1, 2...)

---

## Behavior when there are multiple Lists

![](https://gyazo.com/c001c197c385e9cdc2bdab3bc74f69c4){gyazo=image}

[](/workflows/data-utilities/list/image2image_2list-3list.json)

For example, let's consider the following situation in image2image:

- List of images: 3
- List of prompts: 2

At this time, you might think "3 x 2 = 6 images likely", but the actual behavior is **"proceeding in step"**.

- 1st image x 1st prompt
- 2nd image x 2nd prompt
- 3rd image x **2nd prompt is reused**

In other words, only 3 images are generated.
