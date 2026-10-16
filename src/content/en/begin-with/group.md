---
layout: page.njk
lang: en
section: begin-with
slug: group
navId: group
title: "Group"
created: 2025-11-24
updated: 2026-03-02
summary: "Grouping nodes together with the group feature"
seoTitle: "ComfyUI Groups: Frame and Organize Nodes"
seoDescription: "Use groups in ComfyUI: create, edit, and move group frames, why nodes touching a frame move with it, and when a subgraph is the better choice."
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## Groups in ComfyUI

Groups in ComfyUI are less about "bundling nodes by function" and more a UI feature for **handling every node that touches a frame (rectangle) together**.
So they're handy for tidying things up visually, but depending on the layout, nodes you didn't mean to include can move along with them.

If you want a functional unit, [Subgraph](/en/begin-with/subgraphs/) is a better fit.

## Creating a Group

### Create Manually

- Right-click on the canvas -> `Add Group`
- Resize or move the frame to fit the nodes inside

![](/media/begin-with/group/legacy_gyazo_8cc0775e0b3f0bf5605f9b3aedf0665c.mp4){media=loop}

### Create from Selected Nodes

- Select nodes -> click `#` (Frame Nodes) in the `Node Selection Toolbox`

> [!NOTE]
> Group frames are always rectangles, so depending on the layout, nodes you didn't select can end up inside.  
> It limits how freely you can lay things out, so personally I don't use groups much.

![](/media/begin-with/group/legacy_gyazo_b1c0185c6afc1de67f01acd041169f7c.mp4){media=loop}

## Editing a Group Frame

Click the group frame's header and use the `Node Selection Toolbox`.

- **Color**: Change color
- **Remove**: Delete group frame

![](/media/begin-with/group/legacy_gyazo_5aedd107ed53fa8d73da8cfdbbf7d898.mp4){media=loop}

## Group Actions

Right-click the group frame's header, or use `⋮` in the `Node Selection Toolbox`.

- **Fit Group to Nodes**: Automatically adjust frame size
- **Select Nodes**: Select all nodes in the group
- **Bypass Group Nodes**: Bypass nodes in the group all at once

![](/media/begin-with/group/legacy_gyazo_2469b9f9e950748aa68bd9ee6c418841.mp4){media=loop}

## Moving a Group Frame

Dragging a group frame moves the nodes touching it too.
When you just want to nudge the frame's position, you don't want the nodes tagging along.

Hold `Ctrl` + `Alt` while dragging to move only the group frame.

![](/media/begin-with/group/legacy_gyazo_09e16ba51468b0e313ba1c0f445550d4.mp4){media=loop}
