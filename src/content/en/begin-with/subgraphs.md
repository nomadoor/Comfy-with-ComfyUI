---
layout: page.njk
lang: en
section: begin-with
slug: subgraphs
navId: subgraphs
title: "Subgraphs"
created: 2025-11-24
updated: 2026-03-02
summary: "About subgraphs"
seoTitle: "ComfyUI Subgraphs: Combine and Reuse Nodes"
seoDescription: "ComfyUI subgraphs combine several nodes into one: create and edit them, expose parameters, and save them as reusable modules."
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## What is a Subgraph?

A subgraph combines multiple nodes into a single node.
Besides tidying up the canvas, you can save it as a reusable module (Blueprint) and use it like a new node.

You could pack every node into one, but what makes ComfyUI distinctive is that it lets you split the image generation pipeline into small modules.

Personally, I see it less as a way to tidy things up and more as a feature for building "reusable modules."

---

## Creating a Subgraph

- 1. Select multiple nodes you want to group
- 2. Click `🕸️` (Convert Selection to Subgraph) in `Node Selection Toolbox`

![](/media/begin-with/subgraphs/legacy_gyazo_d59c55b69252fad5f076a9b5e17be95a.mp4){media=loop}

---

## Editing a Subgraph

Enter edit mode by double-clicking the subgraph or clicking the icon on the upper right.

Editing works the same as usual, but any parameter that passes data to or from the outside has to be connected to the subgraph's input/output slots (on the left and right edges).

![](/media/begin-with/subgraphs/legacy_gyazo_5d5ebc1bc37a8dfdaad5a5db64d66cb2.mp4){media=loop}

---

## Parameter Publication Settings

You can expose parameters inside the subgraph as widgets of the subgraph node.
That way you can change values without entering edit mode every time.

- 1. Select Subgraph
- 2. Click `Edit Subgraph Widgets` in `Node Selection Toolbox`
- 3. Check the parameters you want to publish

![](/media/begin-with/subgraphs/legacy_gyazo_024e67b6cea67bda0849829b3762f4ba.mp4){media=loop}

---

## Saving and Reusing Subgraphs

Once you save a subgraph, you can reuse it as your own node.

- 1. Select Subgraph
- 2. Click `📖` (Publish Subgraph) in `Node Selection Toolbox`
- 3. Enter name and `Confirm`

After saving, you can search for it (double-click the canvas) and add it just like any other node.

It also shows up in the node library in the sidebar, which is where you delete or edit Blueprints.

![](/media/begin-with/subgraphs/legacy_gyazo_74f9469b12a6b87fc7a62099dde54db7.mp4){media=loop}

[](/workflows/begin-with/subgraphs/chroma_key.json)
