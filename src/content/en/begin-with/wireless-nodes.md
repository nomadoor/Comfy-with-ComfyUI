---
layout: page.njk
lang: en
section: begin-with
slug: wireless-nodes
navId: wireless-nodes
title: "Wireless Nodes"
summary: "About wireless communication between nodes"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/f7990ba8ce62b43de894da9eba20cb20.png"
---

## What are Wireless Nodes?

The biggest feature of node-based tools is that you can perform complex processing simply by connecting functions with lines.
On the other hand, the more nodes and lines there are, the more cluttered the screen becomes (spaghetti nodes), and you face the problem of not knowing what is going on at all.

In such a situation, it is natural to come up with the idea, "Why not send data wirelessly?".

---

## Custom Nodes

There are several custom nodes that realize wireless communication.
[chrisgoringe/cg-use-everywhere](https://github.com/chrisgoringe/cg-use-everywhere) is also famous, but recently, the simpler and easier-to-use **KJNodes** set is often used.

- **[kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)**

---

### Set & Get Nodes

![](https://gyazo.com/fd49b6cc5d0da73a01189cc407104371){gyazo=image}

[](/workflows/begin-with/wireless-nodes/Set_Get.json)

Usage is very simple.

- 1. **Set Node** (Sender):
    - Input data and set an arbitrary name (ID) to `Constant`.
- 2. **Get Node** (Receiver):
    - If you set the same name as the sender to `Constant`, you can receive data even in a remote location.

---

## Convenient but Don't Overuse

![](https://i.gyazo.com/0128233c9681fdaa4ad62d7afe59d2aa.png){gyazo=image}

[](/workflows/begin-with/wireless-nodes/Set_Get_image2image.json)

As mentioned in [Recommendation of Readable Nodes](/en/begin-with/readable-nodes/), the biggest advantage of node tools is that "you can grasp the flow of data just by looking at the connected lines".
If you use wireless unnecessarily, it becomes very difficult to follow the flow of processing, asking "Where did this image data fly from?".

Wireless may be convenient when the same variable appears over and over again in every place of one workflow, but in the first place, maybe such a large workflow should be split into smaller pieces (；・∀・)
