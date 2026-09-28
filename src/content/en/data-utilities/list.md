---
layout: page.njk
lang: en
section: data-utilities
slug: list
navId: list
title: "List"
created: 2025-11-26
updated: 2026-09-27
summary: "Concept of continuous processing using multiple data"
seoTitle: "Lists in ComfyUI: Process Multiple Inputs in Turn"
seoDescription: "ComfyUI lists process several inputs one by one in a single run: how they differ from the queue, Create List and Get Item From List, and multiple lists."
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

## Creating and Retrieving a List

### Create List Node

This node lets you assemble a List manually. It combines values of any type, such as images, text, or numbers, into a single List.

![](/media/data-utilities/list/create_list.mp4){media=loop}

[](/workflows/data-utilities/list/create_list.json)

- Connecting a node adds another slot, so you can include as many items as needed.

### Get Item From List Node

Retrieves one item at any position from a List.

![](/media/data-utilities/list/get_item_from_list.png){media=image}

[](/workflows/data-utilities/list/get_item_from_list.json)

- `index`: Position to retrieve (0, 1, 2...)

---

## Behavior when there are multiple Lists

![](/media/data-utilities/list/legacy_gyazo_c001c197c385e9cdc2bdab3bc74f69c4.png){media=image}

[](/workflows/data-utilities/list/image2image_2list_3list.json)

For example, let's consider the following situation in image2image:

- List of images: 3
- List of prompts: 2

At this time, you might think "3 x 2 = 6 images likely", but the actual behavior is **"proceeding in step"**.

- 1st image x 1st prompt
- 2nd image x 2nd prompt
- 3rd image x **2nd prompt is reused**

In other words, only 3 images are generated.
