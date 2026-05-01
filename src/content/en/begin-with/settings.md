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
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## How to Open Settings Screen

Settings can be opened by **ComfyUI Logo** -> **⚙ Settings** at the top left of the screen.

Limited to what is provided, settings for not only the ComfyUI body but also custom nodes can be done from here.
Basically, you can understand by looking, so please customize various things yourself.

---

## My Recommended Recommendations

I introduce some recommended settings.

### Language
`Comfy` → `Locale` → `English`
- For Japanese users, this is probably set to Japanese, but we use `English` on this site.
- I understand the desire to set it to Japanese, but since most of the terms used are technical terms, setting it to Japanese poorly makes it even more confusing.

### Badge
`Lite Graph` → `Node` → `Node source badge mode` → `Show All`
- Displays a badge indicating whether the node is a ComfyUI core node or a custom node.
- When loading someone else's workflow, you can check which custom node the node uses.

### Run Button Position

You can change it to your preferred position by dragging `⋮⋮` next to the `▷ Run` button.

![](https://gyazo.com/1c7183f67866e67e640715cfe42a2a61){gyazo=loop}


### Preview during generation

ComfyUI Manager → Set Preview method to one of `Auto`/`TAESD`/`latent2RGB`
- A preview image being generated will be displayed inside the KSamlper node.
- I turn it off because it takes up a lot of space, but it is a good function to learn how images are generated.

![](https://gyazo.com/b57c81af6a11466c664303f29b25b4cc){gyazo=loop}
