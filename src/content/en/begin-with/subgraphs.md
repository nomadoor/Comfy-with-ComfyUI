---
layout: page.njk
lang: en
slug: subgraphs
navId: subgraphs
title: "Subgraphs"
summary: "About Subgraphs"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## What are Subgraphs?

It is a function that aggregates multiple nodes into a single node.
Not only does it tidy up the appearance, but it can also be saved as a reusable module (Blueprint) and treated like a new node.

It is possible to combine all nodes into one, but a feature of ComfyUI is that the image generation pipeline can be divided into small modules.

Personally, I think it is a function for creating "reusable modules" rather than just tidying up the appearance.

## Creating Subgraphs

- 1. Select multiple nodes you want to group
- 2. Click `🕸️` (Convert Selection to Subgraph) in the `Node Selection Toolbox`

![](https://gyazo.com/d59c55b69252fad5f076a9b5e17be95a){gyazo=loop}

## Editing Subgraphs

Double-click the subgraph or click the icon in the upper right to enter edit mode.

Basic operations are the same as usual, but parameters exchanged with the outside must be connected to the input/output slots (left/right ends) of the subgraph.

![](https://gyazo.com/5d5ebc1bc37a8dfdaad5a5db64d66cb2){gyazo=loop}

## Exposing Parameters

You can expose parameters within a subgraph as widgets on the subgraph node.
You will be able to change values without entering edit mode every time.

- 1. Select the subgraph
- 2. Click `Edit Subgraph Widgets` in the `Node Selection Toolbox`
- 3. Check the parameters you want to expose

![](https://gyazo.com/024e67b6cea67bda0849829b3762f4ba){gyazo=loop}

## Saving and Reusing Subgraphs

If you save the created subgraph, you can reuse it as a unique node.

- 1. Select the subgraph
- 2. Click `📖` (Publish Subgraph) in the `Node Selection Toolbox`
- 3. Enter a name and `Confirm`

After saving, you can search for and call it just like a normal node (double-click).

You can also check it from the node library in the sidebar, and delete or edit Blueprints from there.

![](https://gyazo.com/74f9469b12a6b87fc7a62099dde54db7){gyazo=loop}
