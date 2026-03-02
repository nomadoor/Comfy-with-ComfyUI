---
layout: page.njk
lang: en
section: begin-with
slug: group
navId: group
title: "Group"
summary: "About the group function to organize nodes"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## Groups in ComfyUI

ComfyUI groups are a UI feature not so much for "functionally bundling" nodes, but for **handling nodes touching a frame (rectangle) together**.
Therefore, while convenient for visual organization, depending on placement, unintended nodes may move along with it.

If you want to create a functional unit, [Subgraph](/en/basic-workflows/subgraphs/) is more suitable.

## Creating a Group

### Create Manually

- Right click on canvas -> `Add Group`
- Resize or move the frame to fit the nodes inside

![](https://gyazo.com/8cc0775e0b3f0bf5605f9b3aedf0665c){gyazo=loop}

### Create from Selected Nodes

- Select nodes -> Click `#` (Frame Nodes) in `Node Selection Toolbox`

> Since the group frame is fixed as a rectangle, depending on the layout, unselected nodes may be included.  
> Since it reduces layout freedom, personally I don't use the group function much.

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

## Moving Group Frame

Dragging the group frame moves touching nodes together.
When you want to fine-tune just the position, you don't want nodes to follow.

By dragging while holding `Ctrl` + `Alt`, you can move only the group frame.

![](https://gyazo.com/09e16ba51468b0e313ba1c0f445550d4){gyazo=loop}
