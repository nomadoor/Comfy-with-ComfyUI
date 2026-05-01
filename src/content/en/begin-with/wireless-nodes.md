---
layout: page.njk
lang: en
section: begin-with
slug: wireless-nodes
navId: wireless-nodes
title: "Wireless"
created: 2025-11-26
updated: 2026-03-02
summary: "About wireless communication between nodes"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## What is Node Wirelessization?

The biggest feature of node-based tools is that you can perform complex processing just by connecting each function with lines.
On the other hand, there is also a problem that the screen becomes cluttered (spaghetti-like) and it becomes completely unclear what is being done as the number of nodes and lines increases.

In such a situation, it is natural that the idea "Why don't we fly data wirelessly?" comes out.

---

## Custom Node

There are several custom nodes that realize wirelessization.
[chrisgoringe/cg-use-everywhere](https://github.com/chrisgoringe/cg-use-everywhere) is also famous, but recently the set of **KJNodes**, which is simpler and easier to handle, is often used.

- **[kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)**

---

### Set & Get Node

Usage is very simple.

![](https://gyazo.com/fd49b6cc5d0da73a01189cc407104371){gyazo=image}

[](/workflows/begin-with/wireless-nodes/Set_Get.json)


- 1. **Set Node** (Sender):
    - Input data and set any name (ID) to `Constant`.
- 2. **Get Node** (Receiver):
    - If you set the same name as the sender to `Constant`, you can receive data even at a distant place.

---

## Convenient but use with caution

![](https://i.gyazo.com/0128233c9681fdaa4ad62d7afe59d2aa.png){gyazo=image}

[](/workflows/begin-with/wireless-nodes/Set_Get_image2image.json)

As mentioned in [Recommendation for Readable Nodes](/en/begin-with/readable-nodes/), the biggest advantage of node tools is that "you can grasp the flow of data just by looking at the connected lines".
If you wirelessly unnecessarily, it becomes very difficult to trace the flow of processing, asking "Where did this image data fly from?".

If the same variable appears over and over again everywhere in one workflow, wirelessization may be convenient, but in the first place, such a large workflow might should be split into smaller pieces (；・∀・)
