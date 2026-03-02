---
layout: page.njk
lang: en
section: begin-with
slug: subgraphs
navId: subgraphs
title: "Subgraphs"
summary: "About subgraphs"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## What is a Subgraph?

It is a function to aggregate multiple nodes into one node.
Not only does it clean up the appearance, but it can also be saved as a reusable module (Blueprint) and handled like a new node.

It is possible to summarize all nodes into one, but ComfyUI is characterized by being able to divide the image generation pipeline into small modules.

Personally, I consider it a function to create "reusable modules" rather than just cleaning up the appearance.

---

## Creating a Subgraph

- 1. Select multiple nodes you want to group
- 2. Click `🕸️` (Convert Selection to Subgraph) in `Node Selection Toolbox`

![](https://gyazo.com/d59c55b69252fad5f076a9b5e17be95a){gyazo=loop}

---

## Editing a Subgraph

Enter edit mode by double-clicking the subgraph or clicking the icon on the upper right.

Basic operations are the same as usual, but parameters to interact with the outside need to be connected to the input/output slots (left end/right end) of the subgraph.

![](https://gyazo.com/5d5ebc1bc37a8dfdaad5a5db64d66cb2){gyazo=loop}

---

## Parameter Publication Settings

You can expose parameters inside the subgraph as widgets of the subgraph node.
You can change values without entering edit mode every time.

- 1. Select Subgraph
- 2. Click `Edit Subgraph Widgets` in `Node Selection Toolbox`
- 3. Check the parameters you want to publish

![](https://gyazo.com/024e67b6cea67bda0849829b3762f4ba){gyazo=loop}

---

## Saving and Reusing Subgraphs

If you save the created subgraph, you can reuse it as a unique node.

- 1. Select Subgraph
- 2. Click `📖` (Publish Subgraph) in `Node Selection Toolbox`
- 3. Enter name and `Confirm`

After saving, you can call it by searching (double clicking) just like a normal node.

You can also check it from the node library in the sidebar, and delete/edit the Blueprint from here.

![](https://gyazo.com/74f9469b12a6b87fc7a62099dde54db7){gyazo=loop}

[](/workflows/begin-with/subgraphs/Chroma_key.json)
