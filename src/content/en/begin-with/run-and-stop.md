---
layout: page.njk
lang: en
section: begin-with
slug: run-and-stop
navId: run-and-stop
title: "Run & Stop"
created: 2025-11-20
updated: 2026-09-27
summary: "About Run & Stop"
seoTitle: "Run, Stop, and Queue Workflows in ComfyUI"
seoDescription: "Run and stop ComfyUI workflows: repeat counts, auto-run modes, interrupting and force-stopping, and checking and clearing the queue."
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## Execute Processing

Run the workflow.

![](/media/begin-with/run-and-stop/legacy_gyazo_e1be6c3b9c1666f5735bd17261d7714f.mp4){media=loop}

- Click the `▷ Run` (or `Queue Prompt`) button in the menu

---

## Repeat Processing

Run the workflow multiple times with the same settings.

![](/media/begin-with/run-and-stop/legacy_gyazo_5831e4d69bd26c7d5a533fb5781a33ad.mp4){media=loop}

- Change the number next to the `▷ Run` button

The default limit is **100**, but it can be changed in the settings.
- Change the value of `⚙Settings` -> `Queue Button` -> `Batch count limit`.

---

## Repeat Processing Automatically

Use this when you want it to "generate automatically every time I change a parameter" or to "keep generating forever while I leave it alone."

![](/media/begin-with/run-and-stop/legacy_gyazo_c516b3b9fd8b2c506fb1fa91cf385174.mp4){media=loop}

- Click `˅` inside the `▷ Run` button, select a mode, and click `▷ Run`

### Difference in Modes

- **Run (Instant)**
  - Starts the next process immediately after the previous process finishes.
  - **Note**: If the result would be exactly the same (for example, the seed is fixed), the run is skipped.

- **Run (On Change)**
  - It basically sits and waits.
  - Processing starts the moment any parameter (prompt, number, etc.) is changed.

---

## Interrupt Processing

If you started a run by mistake, you can stop it here.

![](/media/begin-with/run-and-stop/stop.mp4){media=loop}

- **Operation**: Click the `❌️` button next to the `▷ Run` button

### About Forced Termination

When your PC is under heavy load, such as during sampling in KSampler, pressing `❌️` may not take effect right away.
If it just won't stop, **close the terminal and restart ComfyUI itself**. That's the surest way.

---

## Check and Clear Queue

You can check the jobs waiting to run (the queue) or delete them all at once.

![](/media/begin-with/run-and-stop/legacy_gyazo_23f7fb0414ad302f23b333ae0add5827.mp4){media=loop}

- **Operation**: Click the Queue icon on the left sidebar (or press `Q`) to show the list.

- **Cancel Individually**: Right-click the process you want to cancel and select `Delete`.
- **Cancel All**: Click `Clear queue` in the `Job Queue` window.
