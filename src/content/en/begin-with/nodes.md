---
layout: page.njk
lang: en
slug: nodes
navId: nodes
title: "Nodes"
summary: "About Nodes"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---


## Adding Nodes

### Search and Add (Recommended)

- Double click on canvas -> Enter in search box
- Click the desired node, or select with arrow keys and `Enter`

Clicking the icon next to the search bar opens a filter. You can narrow down by data type or included custom nodes.

> You have to memorize what nodes exist. Let's do our best to learn!!

![](https://gyazo.com/b0571db1685d43d84739aeac7559abc8){gyazo=loop}

### Add from Menu

- Right click on canvas -> `Add Node` -> Find node and click

![](https://gyazo.com/ef2cca44a8446a84d9722578e97becbc){gyazo=loop}


### Add from Connectable Nodes

- Drag from a pin and release on the canvas
- A search window appears, but it is displayed with a filter applied by data type

![](https://gyazo.com/89de8c5d0c26473008ed7b65c6d62f71){gyazo=loop}


### Add from Connectable Nodes (Legacy)

- Drag from a pin and release on the canvas **while holding Shift**
- Select from the displayed list (Since there is a display limit, search from `Search` if not found)

![](https://gyazo.com/7fd0db2ee2795630a82eff60f59dc967){gyazo=loop}

---

## Connecting Nodes

- Drag from pin to pin
- Even if you don't align exactly with the pin, it will automatically snap just by dragging onto the node.

![](https://gyazo.com/b8d64b7c5ff3ec72eab34d230b18220f){gyazo=loop}

### Changing Connections

- Drag from pin to pin while holding `Shift`
- If there are already connected lines, you can reconnect them all at once.

![](https://gyazo.com/bd765ab5d368f0ea62bd9f6752bbd511){gyazo=loop}

---

## Manipulating Nodes

### Selection and Movement

- **Multiple Selection**: `Shift` or `Ctrl` + Left Click
- **Range Selection**: `Ctrl` + Drag
- **Move**: Drag while selected

![](https://gyazo.com/ec2d834b60c0fdc243fe12298f2a849d){gyazo=loop}

### Deletion

- Select node and `Delete` key
- Or click `🗑️` in `Node Selection Toolbox`

![](https://gyazo.com/38bdfe83ae6bbbff8f063bed7936edfe){gyazo=loop}

### Copy & Paste

- **Normal Copy**: `Ctrl + C` -> `Ctrl + V`
- **Paste Maintaining Connections**: `Ctrl + C` -> `Ctrl + Shift + V`
- **Duplicate**: Drag while holding `Alt`

![](https://gyazo.com/3898dc47a12c5d95d8f81093bdf5bfb7){gyazo=loop}

### Collapse

- Click `⚫` at the top left of the node
- While collapsed, new connections or disconnections cannot be made.

![](https://gyazo.com/cc2fb21c796ea9a872dd9b25fdf317c0){gyazo=loop}

### Pinning (Fixing)

Fix the node so it doesn't move.

- Select node and `P` key

![](https://gyazo.com/e18df835c4248220e5c8a0c2d021dacd){gyazo=loop}

### Reset Parameters

- Right click node -> `Fix node(recreate)`

![](https://gyazo.com/b1fec4d60d74acb79b6ef2c56db4e6ab){gyazo=loop}

### Node Info

Check detailed information of the node.

- Click `ℹ️` in `Node Selection Toolbox`
- You can see which Python file defines the node. Useful for debugging errors.

### Changing Node Color

Changing the background color of the node and color-coding by role makes it easier to see.

- Click `🎨 (Color)` in `Node Selection Toolbox` and select a color

![](https://gyazo.com/57d95f8586bdda17ed96855cbac37af8){gyazo=loop}

### Changing Node Title

Change the display name (title) of the node.

- Double click node -> Enter desired name and `Enter`

![](https://gyazo.com/6d04c3d29e18e2ef5327c438264ff3d0){gyazo=loop}


---

## Reroute Node

Used to organize workflow wiring.

- Search and add
- Add by middle clicking on a point

![](https://gyazo.com/86de60d6b6959f5448dcfaad42178fcb){gyazo=image}


### Dot Type Reroute

The Reroute node existed as a single node, but this one is not a node but sets a passing point for the line.

- `Alt + Left Click` on a point on the line

![](https://gyazo.com/cac43ac8b7fef76a4cdb0ff5d83bd1c7){gyazo=loop}

---

## Bypass and Mute

### Bypass

Continues processing **ignoring** that node.

- Select node and `Ctrl + B`
- Click `🔀` in `Node Selection Toolbox`

![](https://gyazo.com/4ab6605bdd97ee8cae5b4403057a38e5){gyazo=loop}

### Mute

**Stops** processing at that node.

- Select node and `Ctrl + M`
- Or Right click -> `Mode` -> `Never`

> **About the difference**
> - **Bypass**: Pretends "this node didn't exist" and tries to connect the preceding and succeeding nodes directly.
> - **Mute**: Makes it a "dead end here".
>
> Actually, mute is rarely used. It is common to bypass all unused nodes.

![](https://i.gyazo.com/5d96054e7b54a62b3a446a28d70212d6.png){gyazo=image}

---

## Converting to External Input

Converts the input field (widget) to pin input so that values can be passed from other nodes.

- **Convert**: Move the cursor next to a parameter without a pin, and a connection point appears.
- **Revert**: Disconnect the connected line, and it automatically returns to the original input field.

![](https://gyazo.com/80e1bb9211082f4d89a2a85d5abd78c2){gyazo=loop}

### Primitive Node

A versatile node that can be used as input for any type. It changes dynamically according to the connected type.

> **Note:**
> Because it adapts to the connected type, it cannot be used in combination with reroute nodes.
>
> Currently, it is recommended to use typed nodes such as `int node`, `float node`, `string node`.

![](https://i.gyazo.com/e0a056e9c112028930466701e22afd10.gif){gyazo=image}

> **Tip:**
> **Double clicking** a pin automatically connects a Primitive node matching that type.

![](https://gyazo.com/35f00ebec3fab7b0471b5595b4b0a5e5){gyazo=loop}


## Organizing Nodes

Select multiple nodes and click `⋮` in `Node Selection Toolbox`.

- **Align Selected To**: Aligns selected nodes (Top align, Left align, etc.).
- **Distribute Nodes**: Arranges selected nodes at equal intervals.

![](https://gyazo.com/6bb992414f853ea57c7182cde11933f8){gyazo=loop}
