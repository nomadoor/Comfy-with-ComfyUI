---
layout: page.njk
lang: en
section: begin-with
slug: nodes
navId: nodes
title: "Nodes"
created: 2025-11-24
updated: 2026-03-02
summary: "Basic node operations"
seoTitle: "ComfyUI Nodes: Add, Connect, Copy, and More"
seoDescription: "Basic ComfyUI node operations: add nodes by search, menu, or dragging from a pin, connect and rewire, and select, delete, copy, collapse, or pin nodes."
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---


## Adding Nodes

### Search and Add (Recommended)

- Double-click on the canvas -> type in the search box
- Click the node you want, or select it with the arrow keys and press `Enter`

Click the icon next to the search box to open the filters. You can narrow results by data type or by the custom node pack they come from.

> [!NOTE]
> There's no way around it: you just have to learn which nodes exist. Hang in there!!

![](/media/begin-with/nodes/legacy_gyazo_b0571db1685d43d84739aeac7559abc8.mp4){media=loop}

### Add from Menu

- Right-click on the canvas -> `Add Node` -> find the node and click it

![](/media/begin-with/nodes/legacy_gyazo_ef2cca44a8446a84d9722578e97becbc.mp4){media=loop}


### Add from Connectable Nodes

- Drag from a pin and release on the canvas
- A search box appears, already filtered by data type

![](/media/begin-with/nodes/legacy_gyazo_89de8c5d0c26473008ed7b65c6d62f71.mp4){media=loop}


### Add from Connectable Nodes (Legacy)

- Drag from a pin and release on the canvas **while holding Shift**
- Pick from the list that appears (it only shows a limited number, so use `Search` if you can't find it)

![](/media/begin-with/nodes/legacy_gyazo_7fd0db2ee2795630a82eff60f59dc967.mp4){media=loop}

---

## Connecting Nodes

- Drag from pin to pin
- You don't have to hit the pin exactly: just drag onto the node and it snaps into place.

![](/media/begin-with/nodes/legacy_gyazo_b8d64b7c5ff3ec72eab34d230b18220f.mp4){media=loop}

### Changing Connections

- Drag from pin to pin while holding `Shift`
- If links are already connected, you can move them all to the new pin at once.

![](/media/begin-with/nodes/legacy_gyazo_bd765ab5d368f0ea62bd9f6752bbd511.mp4){media=loop}

---

## Manipulating Nodes

### Selection and Movement

- **Select multiple**: `Shift` or `Ctrl` + left-click
- **Box select**: `Ctrl` + drag
- **Move**: Drag the selection

![](/media/begin-with/nodes/legacy_gyazo_ec2d834b60c0fdc243fe12298f2a849d.mp4){media=loop}

### Deletion

- Select the node and press `Delete`
- Or click `🗑️` in the `Node Selection Toolbox`

![](/media/begin-with/nodes/legacy_gyazo_38bdfe83ae6bbbff8f063bed7936edfe.mp4){media=loop}

### Copy & Paste

- **Regular copy**: `Ctrl + C` -> `Ctrl + V`
- **Paste with connections kept**: `Ctrl + C` -> `Ctrl + Shift + V`
- **Duplicate**: Drag while holding `Alt`

![](/media/begin-with/nodes/legacy_gyazo_3898dc47a12c5d95d8f81093bdf5bfb7.mp4){media=loop}

### Collapse

- Click `⚫` at the top left of the node
- While a node is collapsed, you can't connect or disconnect links.

![](/media/begin-with/nodes/legacy_gyazo_cc2fb21c796ea9a872dd9b25fdf317c0.mp4){media=loop}

### Pinning (Fixing)

Locks the node in place so it can't be moved.

- Select the node and press `P`

![](/media/begin-with/nodes/legacy_gyazo_e18df835c4248220e5c8a0c2d021dacd.mp4){media=loop}

### Reset Parameters

- Right-click the node -> `Fix node(recreate)`

![](/media/begin-with/nodes/legacy_gyazo_b1fec4d60d74acb79b6ef2c56db4e6ab.mp4){media=loop}

### Node Info

Shows details about the node.

- Click `ℹ️` in the `Node Selection Toolbox`
- You can see things like which Python file defines the node. Handy for debugging errors.

### Changing Node Color

Changing node background colors to color-code them by role makes a workflow easier to read.

- Click `🎨 (Color)` in the `Node Selection Toolbox` and pick a color

![](/media/begin-with/nodes/legacy_gyazo_57d95f8586bdda17ed96855cbac37af8.mp4){media=loop}

### Changing Node Title

Changes the node's display name (title).

- Double-click the node -> type any name you like and press `Enter`

![](/media/begin-with/nodes/legacy_gyazo_6d04c3d29e18e2ef5327c438264ff3d0.mp4){media=loop}


---

## Reroute Node

Used to tidy up the wiring in a workflow.

- Search for it and add it
- Middle-click a point to add one

![](/media/begin-with/nodes/legacy_gyazo_86de60d6b6959f5448dcfaad42178fcb.mp4){media=loop}


### Dot Type Reroute

The Reroute node is a standalone node, but this one isn't a node at all: it just sets a point the link passes through.

- `Alt + Left Click` a point on the link

![](/media/begin-with/nodes/legacy_gyazo_cac43ac8b7fef76a4cdb0ff5d83bd1c7.mp4){media=loop}

---

## Bypass and Mute

### Bypass

Processing continues, **skipping** that node.

- Select the node and press `Ctrl + B`
- Click `🔀` in the `Node Selection Toolbox`

![](/media/begin-with/nodes/legacy_gyazo_4ab6605bdd97ee8cae5b4403057a38e5.mp4){media=loop}

### Mute

Processing **stops** at that node.

- Select the node and press `Ctrl + M`
- Or right-click -> `Mode` -> `Never`

> [!NOTE]
> **The difference**
> - **Bypass**: Treats the node as if "it wasn't there" and tries to connect the nodes before and after it directly.
> - **Mute**: Makes it "a dead end here".
>
> In practice, mute isn't used much. Most people just bypass every node they're not using.

![](/media/begin-with/nodes/legacy_gyazo_5d96054e7b54a62b3a446a28d70212d6.png){media=image}

---

## Converting to External Input

Turns an input field (widget) into a pin input so other nodes can pass it a value.

- **Convert**: Hover next to a parameter that has no pin, and a connection point appears.
- **Revert**: Disconnect the link, and it automatically goes back to a regular input field.

![](/media/begin-with/nodes/legacy_gyazo_80e1bb9211082f4d89a2a85d5abd78c2.mp4){media=loop}

### Primitive Node

An all-purpose node that can feed an input of any type. It changes dynamically to match whatever it's connected to.

> [!WARNING]
> Because it adapts to the type it's connected to, it can't be used together with reroute nodes.
>
> These days, I recommend using nodes with a fixed type, such as `int node`, `float node`, and `string node`.

![](/media/begin-with/nodes/legacy_gyazo_e0a056e9c112028930466701e22afd10.mp4){media=loop}

> [!TIP]
> **Double clicking** a pin automatically connects a Primitive node matching that type.

![](/media/begin-with/nodes/legacy_gyazo_35f00ebec3fab7b0471b5595b4b0a5e5.mp4){media=loop}


## Organizing Nodes

Select multiple nodes and click `⋮` in the `Node Selection Toolbox`.

- **Align Selected To**: Lines up the selected nodes (top, left, and so on).
- **Distribute Nodes**: Spaces the selected nodes evenly.

![](/media/begin-with/nodes/legacy_gyazo_6bb992414f853ea57c7182cde11933f8.mp4){media=loop}
