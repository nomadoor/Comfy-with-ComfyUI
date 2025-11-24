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

They are like plugins that add functions not found in the default.

They greatly expand the possibilities of ComfyUI, such as expanding AI models, improving processing efficiency, and improving UI.

## Risks of Custom Nodes

Although convenient, **installing too many can cause trouble.**

Basically, we recommend configuring with default nodes and keeping it to the minimum necessary.

- **Conflict**: Nodes are incompatible with each other and errors occur
- **Update Stop**: The author stops updating and it stops working with new ComfyUI
- **Security**: Possibility of containing malicious code (not zero)

## Installing Custom Nodes

Basically, install from **ComfyUI Manager**.

### Using ComfyUI Manager (Recommended)

![](https://gyazo.com/c0d8901537b65da709f9ba9d6e1a0055){gyazo=loop}

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

There are roughly two types of custom nodes.

### 1. ComfyUI Native

Nodes designed to fit ComfyUI's mechanism.

- **Merit**: Can receive the benefits of ComfyUI optimization (memory management etc.)

You can make use of ComfyUI's strength "works even with low specs".

### 2. Wrapper

Nodes that just wrap external code to run on ComfyUI.

- **Demerit**: Optimization is often not progressed (heavy, prone to errors)
- **Background**: Often created to easily run research code etc.

It is essential to try the latest technology, but it is safe to use it only as a test operation.
