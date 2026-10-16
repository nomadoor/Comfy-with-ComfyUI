---
layout: page.njk
lang: en
section: begin-with
slug: readable-nodes
navId: readable-nodes
title: "The Case for Readable Nodes"
created: 2025-11-26
updated: 2026-03-02
summary: "Tips for building clean and easy-to-use workflows"
seoTitle: "Readable Nodes: How to Build Clean ComfyUI Workflows"
seoDescription: "Tips for ComfyUI workflows that never turn into spaghetti: guide the eye, keep wires visible, color-code nodes, write notes, and use few custom nodes."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## Breaking Away from Spaghetti

If you build carelessly in a node-based tool, you end up with "spaghetti nodes" where the lines are all tangled up, and the workflow becomes impossible to understand, whether someone else made it or even you did.

Then again, one of the nice things about node-based tools is that when everything is neatly organized, you can tell what's going on at a glance.

Taking a cue from the classic book *The Art of Readable Code*, let's build **"Readable Nodes"** and enjoy a comfy ComfyUI life!

> [!NOTE]
> *This is all my own opinion and bias, not an officially recommended approach. Take it lightly.

---

## 1. Visual Guidance (Top-Left to Bottom-Right)

![](/media/begin-with/readable-nodes/legacy_gyazo_30d3ce6a42f9f1783ab798e91d2d0f45.png){media=image}

Compared to other node tools, ComfyUI has a simple structure: "materials go onto a single production line and get processed into an image".
So "Is it readable?" really means **"How quickly can you find that single line?"**

It's well known in design that people generally look at things in order from **"top-left to bottom-right"**.

It's a good idea to lay out your workflow following this principle too.

## 2. Show the Wires

![](/media/begin-with/readable-nodes/legacy_gyazo_9846334b433e5a4122ee5cae02850543.png){media=image}

The only way to see where information comes from and where it goes is to look at the wires.
Lay out your nodes so the wires don't get hidden behind them.

*   **Use Reroute nodes**: Adding relay points (Reroutes) in the right places lets you avoid wires overlapping and crossing.
*   **Be careful going wireless**: "Wireless" nodes are handy, but overuse them and you'll spend more time hunting for "where the information went" than you would untangling spaghetti.

## 3. Don't Use Bento Box Layout

![](/media/begin-with/readable-nodes/legacy_gyazo_643b7ec8626411c1d7d08161e348b5b5.png){media=image}

I get the urge to pack nodes neatly into a rectangle, but from the point of view of **"guiding the eye"** and **"showing the wires"**, it's the worst.

Data flows in strange directions, and wires hide behind nodes.

ComfyUI gives you an infinitely large canvas.
Don't cram things together: be generous with space and spread out.

## 4. Start with the Default Workflow

![](/media/begin-with/readable-nodes/legacy_gyazo_71fdea2d1aeea37542d068aa855e512f.png){media=image}

You can open the basic text2image workflow from `Templates` → `Getting Started` → `Image Generation` in the sidebar.

> [!NOTE]
> Unfortunately, the minimal workflow shown in the image has since been removed from the templates.
> So I'll leave it here instead.
>
> [](/workflows/begin-with/readable-nodes/stable_diffusion_1_5.json)

This setup is the base not just for SD1.5, but for every recent model (SDXL, Flux, video generation, and so on).

If you build out from here, your workflows end up with a consistent structure, which makes them easier for others (or your future self) to understand.

## 5. Color-Code Nodes

![](/media/begin-with/readable-nodes/legacy_gyazo_ccf1a2d336fdbfd0e94ae71926e8d9b6.png){media=image}

As a workflow grows, it gets hard to tell at a glance which node does what.

Good use of color helps you make sense of it.

Also, you can **group** related nodes by selecting them and pressing `Ctrl + G`. Groups can be titled and moved together, so it is an essential function for organization.

For ControlNet, for example, give all the related nodes, such as `Apply ControlNet` / `Load Model` / `Preprocessor`, the same color.

Then when you think "I want to change the ControlNet settings", you just look for the green area.

## 6. Write Notes (Comments)

![](/media/begin-with/readable-nodes/legacy_gyazo_fa2b5d6e3560c0b56e068228f91f649a.png){media=image}

Which model, what CFG, which sampler... Generative AI has countless parameters, and everyone wants to know **"why you picked that value"**.

Don't be shy about explaining your choices: "this part is for adding detail", "XX model recommended", and so on.
It's a little extra work, but it makes the workflow many times more valuable.

## 7. Keep it Small and Simple

![](/media/begin-with/readable-nodes/legacy_gyazo_2a9c66fa28c01a8bd12b24fdde2a07a4.png){media=image}

As a workflow bloats, it takes longer to run, errors become more likely, and it gets harder to read.

If you can split it up, keep each piece as small as possible. ComfyUI has tabs.

An "all-in-one" workflow has its romance, but splitting the work up, like "tab 1 for generation, tab 2 for upscaling", keeps each workflow simple and easier to reuse.

## 8. Minimize Custom Nodes

![](/media/begin-with/readable-nodes/legacy_gyazo_e26d548e44643c52f6658eb368846cbf.png){media=image}

Custom nodes are what make ComfyUI so powerful, but unlike core nodes, there's no guarantee they'll be maintained, or that they'll keep working.

The more custom nodes a workflow uses, the more likely you are to run into trouble.

Of course, some features just aren't available without custom nodes. But if a custom node simply bundles several nodes together, you should use core nodes instead, even if it means a few more nodes.
