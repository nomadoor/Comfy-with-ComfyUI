---
layout: page.njk
lang: en
slug: group
navId: group
title: "Group"
summary: "About the group function to organize nodes"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## Groups in ComfyUI

ComfyUI's group function is for operating multiple nodes together, but the UI behavior is a bit quirky.

Rather than "organizing nodes functionally", it is a visual-oriented function that "handles nodes touching the specified rectangular area together".

If you want to create a functional unit, [Subgraph](/en/basic-workflows/subgraphs/) is more suitable.

## Creating a Group

### Create Manually

- Right click on canvas -> `Add Group`
- Resize or move the frame to fit the nodes inside

![](https://gyazo.com/8cc0775e0b3f0bf5605f9b3aedf0665c){gyazo=loop}

### Create from Selected Nodes

- Select nodes -> Click `#` (Frame Nodes) in `Node Selection Toolbox`

> **Note**
> Since the group frame can only be a rectangle, depending on the layout, unselected nodes may be included in the group.
>
> This restricts the layout of nodes, so personally I don't use the group function much.

![](https://gyazo.com/b1c0185c6afc1de67f01acd041169f7c){gyazo=loop}

## Editing Group Frame

Click the header of the group frame and operate from `Node Selection Toolbox`.

- **Color**: Change color
- **Remove**: Delete group frame

![](https://gyazo.com/5aedd107ed53fa8d73da8cfdbbf7d898){gyazo=loop}

## Operating Group

Right click the header of the group frame, or operate from `⋮` in `Node Selection Toolbox`.

- **Fit Group to Nodes**: Automatically adjust frame size
- **Select Nodes**: Select all nodes in the group
- **Bypass Group Nodes**: Bypass nodes in the group all at once

![](https://gyazo.com/2469b9f9e950748aa68bd9ee6c418841){gyazo=loop}
