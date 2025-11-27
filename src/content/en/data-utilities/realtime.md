---
layout: page.njk
lang: en
section: data-utilities
slug: realtime
navId: realtime
title: "Realtime Processing"
summary: "Realtime-like processing and when to use Instant/Change"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## ComfyUI is not suitable for Realtime Processing

First of all, ComfyUI is **not suitable for realtime processing**.
This is because all processing is executed as a single workflow, and it cannot proceed to the next operation until one process is finished.

However, by automatically pouring the next process immediately after the process finishes,
it is possible to "make it look like realtime".

---

## Run(Instant) / Run(Change)

ComfyUI input nodes have the following two execution modes.

### Run (Instant)

![](https://gyazo.com/ba99c003cb82d4e8f2a483eab84e9f03){gyazo=loop}

- Once execution starts, **the same workflow is automatically re-executed every time processing finishes**
- If you want to stop, please switch to another mode (it will not stop as it is)

### Run (On Change)

![](https://gyazo.com/59133ed0ac3bcc4d02f0a34cc8bf9320){gyazo=loop}

- Executes only when values such as sliders change
- Processing enters the queue automatically every time you move the mouse


---

## About Realtime image2image / video2video

Theoretically, if you apply image2image / video2video for each frame, you can create an experience close to "realtime video processing".
However, since inference of generative AI inevitably takes time, **realtime processing in the actual sense is very difficult**.


The day of realization is approaching with the latest research, but steady optimization will still be necessary for a while.

- Lower resolution
- Switch to lightweight models
- Use acceleration technology dedicated to video (explained on another page)

> "Realtime image2image" becomes a **special workflow based on acceleration technology**.
