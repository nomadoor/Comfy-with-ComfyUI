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
seoTitle: "ComfyUI Custom Nodes: Installation and Risks"
seoDescription: "What ComfyUI custom nodes are, their risks, how to install them with ComfyUI Manager or by hand, recommended nodes, and native vs. wrapper nodes."
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## What are Custom Nodes?

Other software might call them "mods" or "plugins": they're basically plugins that add features ComfyUI doesn't have out of the box.

They can add support for AI models you can't use by default, pack complex processing into a single node, or even just make the design look cooler. They're one of the things that make ComfyUI so powerful.

---

## Risks of Custom Nodes

They're very handy, but keep in mind that **the more you install, the more likely you are to run into trouble**.

- Nodes conflict with each other and cause errors
- The author stops updating it, and it breaks on newer ComfyUI
- It might contain malicious code (the chance isn't zero)

Of course, plenty of techniques can't be used without custom nodes, so we'll install them as needed. Just don't forget that **"the fewer, the better"**.

---

## Installing Custom Nodes

Normally, you install them from **ComfyUI Manager**.

### Using ComfyUI Manager (Recommended)

![](/media/begin-with/comfyui-manager/legacy_gyazo_c0d8901537b65da709f9ba9d6e1a0055.mp4){media=loop}

1. Install ComfyUI Manager
   - If ComfyUI Manager is not installed yet, please refer to [ComfyUI Manager](/en/begin-with/comfyui-manager/) to install it.
2. Click `Manager` in the menu
3. Click `Custom Nodes Manager`
4. Search for the node name in the search bar
5. Click `Install` (`latest` is usually fine for the version)
6. Click `Restart` to restart ComfyUI

### Installing Manually

Do this when a node isn't in Manager, or when you want the latest development version.

1. In a terminal, go to the `ComfyUI/custom_nodes` folder
2. Download the repository with `git clone`
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

## Custom Nodes to Install Right Away

We mostly build with the default nodes, but some things you'll need every day just aren't there, so please install these.

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
  - A resource monitor that shows CPU, RAM, GPU, VRAM, and more in real time

---

## ComfyUI Native vs Wrapper

You don't really need to remember this, but custom nodes broadly come in two types.

### 1. ComfyUI Native

As I touched on in [What is ComfyUI?](/en/begin-with/what-is-comfyui/), ComfyUI's real strength is its **optimization**, which lets AI models run comfortably even on home PCs.

Custom nodes built on this core are called ComfyUI native, and they get the full benefit of those strengths.

### 2. Wrapper

These are nodes that **wrap** external code so it runs on ComfyUI.

They're often made to run things like research code on ComfyUI more or less as is.
They're often not well optimized, and tend to be unstable: heavy, or prone to errors.

Of course, many techniques are only available through wrappers, and many implementations do their own optimization. Be deeply grateful to the developers, but it's best to treat them as something for testing.
