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
seoTitle: "Wireless Nodes in ComfyUI: Set and Get"
seoDescription: "Cut wires and tidy ComfyUI workflows with the KJNodes Set and Get nodes, and why overusing wireless nodes makes workflows harder to read."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## What Are Wireless Nodes?

The best thing about node-based tools is that you can build complex processes just by wiring functions together.
The flip side is that the more nodes and wires you add, the more cluttered the screen gets (spaghetti), until you have no idea what's going on.

So it's only natural that someone would think, "Why not just send the data wirelessly?"

---

## Custom Node

Several custom nodes make wireless connections possible.
[chrisgoringe/cg-use-everywhere](https://github.com/chrisgoringe/cg-use-everywhere) is well known too, but these days the simpler, easier-to-use nodes from **KJNodes** are the common choice.

- **[kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)**

---

### Set & Get Node

They're very simple to use.

![](/media/begin-with/wireless-nodes/legacy_gyazo_fd49b6cc5d0da73a01189cc407104371.png){media=image}

[](/workflows/begin-with/wireless-nodes/set_get.json)


- 1. **Set Node** (Sender):
    - Feed in the data and give `Constant` any name (ID) you like.
- 2. **Get Node** (Receiver):
    - Set `Constant` to the same name as the sender, and you can receive the data even far away on the canvas.

---

## Handy, but don't overdo it

![](/media/begin-with/wireless-nodes/legacy_gyazo_0128233c9681fdaa4ad62d7afe59d2aa.png){media=image}

[](/workflows/begin-with/wireless-nodes/set_get_image2image.json)

As mentioned in [Recommendation for Readable Nodes](/en/begin-with/readable-nodes/), the biggest advantage of node tools is that "you can follow the data flow just by looking at the wires."
Go wireless for no good reason, and it gets very hard to trace the flow: "Wait, where did this image data come from?"

Wireless nodes can be handy when the same variable shows up again and again all over one workflow, but then again, a workflow that big should maybe be split into smaller ones in the first place (；・∀・)
