---
layout: page.njk
lang: en
section: begin-with
slug: readable-nodes
navId: readable-nodes
title: "Recommendation of Readable Nodes"
summary: "Tips for building clean and easy-to-use workflows"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## Breaking Away from Spaghetti

If you build node-based tools haphazardly, they become "spaghetti nodes" with entangled lines, making them incomprehensible not only to others but also to yourself.

However, one of the beauties of node-based tools is that if they are neatly organized, you can understand what is happening at a glance.

Let's build **"Readable Nodes"**, not the famous book "Readable Code", and live a comfortable ComfyUI life!

> *This is all based on my prejudice and is not necessarily the method recommended by the official. Please read it casually.

---

## 1. Visual Guidance (Top-Left to Bottom-Right)

![](https://i.gyazo.com/30d3ce6a42f9f1783ab798e91d2d0f45.png){gyazo=image}

Compared to other node tools, ComfyUI has a simple structure where "materials are put on a single production line and processed into images".
The question "Is it readable?" can be rephrased as **"How quickly can you find this single line?"**.

It is a famous story in design, but people basically look at things in order from **"top-left to bottom-right"**.

It is better to arrange the workflow according to this principle.

## 2. Show the Wires

![](https://i.gyazo.com/9846334b433e5a4122ee5cae02850543.png){gyazo=image}

You can only know where information is passed from and to by looking at the wires.
Arrange nodes so that wires are not hidden behind them.

*   **Use Reroute Nodes**: By creating relay points (Reroute) appropriately, you can avoid overlapping and crossing wires.
*   **Be Careful with Wireless**: "Skip" or "Wireless" nodes (like Use Everywhere) are convenient, but if you use them too much, it takes more effort to find "where the information flew", and it takes more effort than untangling spaghetti.

## 3. Don't Use Bento Box Layout

![](https://i.gyazo.com/643b7ec8626411c1d7d08161e348b5b5.png){gyazo=image}

I understand the desire to pack nodes neatly into a rectangle, but it is the worst from the perspective of **"Visual Guidance"** and **"Showing Wires"**.

Data flows in strange directions, and wires hide behind nodes.

ComfyUI has an infinitely wide canvas.
Don't pack it tight, use the space luxuriously and arrange it spaciously.

## 4. Start with the Default Workflow

![](https://i.gyazo.com/71fdea2d1aeea37542d068aa855e512f.png){gyazo=image}

You can call the basic text2image workflow from `Templates` → `Getting Started` → `Image Generation` in the sidebar.

> Unfortunately, the minimal workflow in the image has been removed from the templates.
> Instead, I'll put it here.
>
> [](/workflows/begin-with/readable-nodes/Stable_Diffusion_1.5.json)

This configuration is the base for not only SD1.5 but also all the latest models (SDXL, Flux, Video generation, etc.).

By starting expansion from here, consistency is born in the structure of the workflow, making it easier for others (or your future self) to understand.

## 5. Color-Code Nodes

![](https://i.gyazo.com/ccf1a2d336fdbfd0e94ae71926e8d9b6.png){gyazo=image}

As functions increase, you will not be able to instantly distinguish which node plays which role.

Appropriate coloring helps decoding.

Also, you can **group** related nodes by selecting them and pressing `Ctrl + G`. Groups can be titled and moved together, so it is an essential function for organization.

For example, for ControlNet, unify related nodes such as `Apply ControlNet` / `Load Model` / `Preprocessor` with the same color.

Then, when you think "I want to change the ControlNet settings", you only need to look for the green area.

## 6. Write Notes (Comments)

![](https://i.gyazo.com/fa2b5d6e3560c0b56e068228f91f649a.png){gyazo=image}

Model selection, CFG value, sampler type... Generative AI has countless parameters, and everyone wants to know **"why you chose that value"**.

Please talk about your commitment without hesitation, such as "This is for detail improvement" or "XX model recommended".
It takes a little effort, but just having this increases the value of the workflow many times over.

## 7. Keep it Small and Simple

![](https://i.gyazo.com/2a9c66fa28c01a8bd12b24fdde2a07a4.png){gyazo=image}

If the workflow becomes bloated, processing time increases, the error rate rises, and it becomes difficult to read.

If you can split it, keep it as small as possible. ComfyUI has a tab function.

"All in One" is also romantic, but by dividing labor like "Tab 1 for generation, Tab 2 for upscaling", each workflow becomes simple and easier to reuse.

## 8. Minimize Custom Nodes

![](https://gyazo.com/e26d548e44643c52f6658eb368846cbf){gyazo=image}

Custom nodes are a feature that makes ComfyUI powerful, but unlike core nodes, there is no guarantee that they will be maintained or work reliably.

The more custom nodes are used, the more likely you are to encounter trouble.

Of course, there are functions that cannot be used without custom nodes. However, if it is something like simply grouping multiple nodes, you should use core nodes even if the number of nodes increases slightly.
