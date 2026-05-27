---
layout: page.njk
lang: en
section: begin-with
slug: custom-nodes
navId: custom-nodes
title: "Custom Nodes"
created: 2025-11-24
updated: 2026-03-02
summary: "About custom nodes"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## What are Custom Nodes?

They are sometimes called "MODs" or "plugins" in other software, but they are like plugins that add functions not in default.

It is one of the features that make ComfyUI powerful, such as supporting AI models not usable by default, summarizing complex processing into one node, or making the design cool.

---

## Risks of Custom Nodes

They are very convenient, but you should remember that **the probability of encountering trouble increases as you install more**.

- Nodes are incompatible causing errors
- The author stops updating, and it stops working with new ComfyUI
- Possibility of containing malicious code (not zero)

Of course, there are many technologies that cannot be used without installing custom nodes, so we will introduce them as appropriate, but please do not forget that **"less is better"**.

---

## Installing Custom Nodes

Basically, install from **ComfyUI Manager**.

### Using ComfyUI Manager (Recommended)

![](https://gyazo.com/c0d8901537b65da709f9ba9d6e1a0055){gyazo=loop}

1. Install ComfyUI Manager
   - If ComfyUI Manager is not installed yet, please refer to [ComfyUI Manager](/en/begin-with/comfyui-manager/) to install it.
2. Click `Manager` in the menu
3. Click `Custom Nodes Manager`
4. Enter the node name in the search bar to search
5. Click `Install` (Version is usually `latest` OK)
6. Click `Restart` to restart ComfyUI

### Installing Manually

Perform this when it is not in Manager or when you want to use the latest version under development.

1. Move to `ComfyUI/custom_nodes` folder in terminal
2. Download the repository with `git clone` command
   ```powershell
   cd ComfyUI/custom_nodes
   git clone https://github.com/username/repository-name.git
   ```
3. Install libraries if necessary
   ```powershell
   # venv
   cd path/to/ComfyUI
   venv/Scripts/activate
   cd custom_nodes/custom_node
   pip install -r requirements.txt

   # portable version
   cd path/to/ComfyUI/custom_nodes/custom_node
   ../../../python_embeded/python.exe -s -m pip install -r requirements.txt
   ```
4. Restart ComfyUI

---

## Custom Nodes you should install for now

We basically build with default nodes, but since there are things missing for everyday use, please install the following nodes.

- **[kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)**
  - Many utility functions, video generation assistance
- **[ltdrdata/ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack)**
  - Batch processing, list operations, Detailer
- **[Kosinkadink/ComfyUI-VideoHelperSuite](https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite)**
  - Loading / Exporting videos

### Useful Nodes

- **[rgthree/rgthree-comfy](https://github.com/rgthree/rgthree-comfy)**
  - Comparison slider, Nested folder display, Advanced calculation
- **[crystian/ComfyUI-Crystools](https://github.com/crystian/ComfyUI-Crystools)**
  - Resource monitor

---

## ComfyUI Native vs Wrapper

You don't need to remember much, but there are broadly two types of custom nodes.

### 1. ComfyUI Native

As mentioned a little in [What is ComfyUI?](/en/begin-with/what-is-comfyui/), the true value of ComfyUI lies in **optimization** that allows AI models to run comfortably even on home PCs.

Custom nodes that utilize this core function are called ComfyUI native, and can utilize ComfyUI's strengths.

### 2. Wrapper

It is a node that **wraps** external code to run on ComfyUI.

It is often made to run research code etc. as is on ComfyUI.
Optimization is often not advanced, and it tends to be unstable, such as being heavy or prone to errors.

Of course, there are many technologies that can only be used with wrappers, and many implementations have their own optimization processing. While being deeply grateful to the developers, it is better to use it as a test operation.
