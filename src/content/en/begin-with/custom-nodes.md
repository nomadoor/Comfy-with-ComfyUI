---
layout: page.njk
lang: en
slug: custom-nodes
navId: custom-nodes
title: "Custom Nodes"
summary: "About Custom Nodes"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## What are Custom Nodes?

They are sometimes called "MODs" or "plugins" in other software, and they are like plugins that add features not found in the default setup.

They are one of the features that make ComfyUI powerful, allowing support for AI models that cannot be used by default, consolidating complex processes into a single node, or even making the design look cool.

## Risks of Custom Nodes

They are very convenient, but you should remember that **the more you install, the higher the probability of encountering trouble.**

- **Conflict**: Nodes are incompatible with each other, causing errors.
- **Update Stop**: The author stops updating, and it stops working with newer versions of ComfyUI.
- **Security**: Possibility of containing malicious code (not zero).

Of course, there are many technologies that cannot be used without installing custom nodes, so we will introduce them as appropriate, but please do not forget that **"less is more"**.


## Installing Custom Nodes

Basically, install from **ComfyUI Manager**.

### Using ComfyUI Manager (Recommended)

![](https://gyazo.com/c0d8901537b65da709f9ba9d6e1a0055){gyazo=loop}

- 0. Install ComfyUI Manager
  - If ComfyUI Manager is not installed yet, please refer to [Setup - Installing ComfyUI Manager](/en/begin-with/setup/#3-installing-comfyui-manager) to install it.
- 1. Click `Manager` in the menu
- 2. Click `Custom Nodes Manager`
- 3. Enter the node name in the search bar to search
- 4. Click `Install` (Version is usually `latest`)
- 5. Click `Restart` to restart ComfyUI

### Installing Manually

Perform this when it is not in Manager or when you want to use the latest version under development.

- 1. Move to `ComfyUI/custom_nodes` folder in terminal
- 2. Download repository with `git clone` command
    ```powershell
    cd ComfyUI/custom_nodes
    git clone https://github.com/username/repository-name.git
    ```
- 3. Install libraries if necessary
    ```powershell
    # venv
    cd path/to/ComfyUI
    venv/Scripts/activate
    cd custom_nodes/CustomNode
    pip install -r requirements.txt

    # portable version
    cd path/to/ComfyUI/custom_nodes/CustomNode
    ../../../python_embeded/python.exe -s -m pip install -r requirements.txt
    ```
- 4. Restart ComfyUI

## Recommended Custom Nodes

Basically, build with default nodes, but we recommend introducing the following nodes because they are highly convenient.

- **[kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)**
  - Many utility functions, video generation assistance
- **[ltdrdata/ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack)**
  - Batch processing, list operation, Detailer
- **[Kosinkadink/ComfyUI-VideoHelperSuite](https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite)**
  - Video loading/exporting

### Useful Nodes

- **[rgthree/rgthree-comfy](https://github.com/rgthree/rgthree-comfy)**
  - Comparison slider, nested folder display, advanced calculation
- **[crystian/ComfyUI-Crystools](https://github.com/crystian/ComfyUI-Crystools)**
  - Resource monitor

## ComfyUI Native vs Wrapper

You don't really need to remember this, but there are roughly two types of custom nodes.

### 1. ComfyUI Native

As mentioned in [What is ComfyUI?](/en/begin-with/what-is-comfyui/), the true value of ComfyUI lies in its **optimization**, which allows AI models to run comfortably even on home PCs.

Custom nodes that utilize this core feature are called ComfyUI Native, and they can leverage ComfyUI's strengths.

### 2. Wrapper

Nodes that wrap external code to run on ComfyUI.

- **Disadvantage**: Optimization is often not advanced (heavy, prone to errors)
- **Background**: Often created to run research code etc. directly on ComfyUI

Of course, there are many technologies that can only be used with wrappers, and many of them perform their own optimization processing. While being deeply grateful to the developers, it is best to use them strictly as test operations.
