---
layout: page.njk
lang: en
section: begin-with
slug: settings
navId: settings
title: "Settings"
created: 2025-11-24
updated: 2026-03-02
summary: "About settings"
seoTitle: "ComfyUI Settings and Recommended Options"
seoDescription: "How to open ComfyUI settings and the options worth changing: interface language, node badges, Run button position, and live previews."
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## How to Open Settings Screen

Open settings from the **ComfyUI Logo** -> **⚙ Settings** at the top left of the screen.

You can change settings here not only for ComfyUI itself but also for custom nodes (as long as they provide some).
Most of it is self-explanatory, so feel free to play around and customize things yourself.

---

## My Recommended Settings

Here are a few settings I recommend.

### Language
`Comfy` → `Locale` → `English`
- If your system is in another language, this is probably set to that language, but this site uses `English`.
- I get wanting it in your own language, but most of the terms are technical jargon, and a clumsy translation only makes them harder to understand.

### Badge
`Lite Graph` → `Node` → `Node source badge mode` → `Show All`
- Displays a badge indicating whether the node is a ComfyUI core node or a custom node.
- When loading someone else's workflow, you can check which custom node the node uses.

### Run Button Position

You can change it to your preferred position by dragging `⋮⋮` next to the `▷ Run` button.

![](/media/begin-with/settings/legacy_gyazo_1c7183f67866e67e640715cfe42a2a61.mp4){media=loop}


### Preview during generation

ComfyUI Manager → Set Preview method to one of `Auto`/`TAESD`/`latent2RGB`
- A preview of the image as it is being generated appears inside the KSampler node.
- I keep it off because it takes up a lot of space, but it's a great way to learn how images get generated.

![](/media/begin-with/settings/legacy_gyazo_b57c81af6a11466c664303f29b25b4cc.mp4){media=loop}
