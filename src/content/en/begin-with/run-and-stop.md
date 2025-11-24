---
layout: page.njk
lang: en
slug: run-and-stop
navId: run-and-stop
title: "Run & Stop"
summary: "About Run & Stop"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## Execute Processing

Execute the workflow.

- Click the `▷ Run` (or `Queue Prompt`) button in the menu

![](https://gyazo.com/e1be6c3b9c1666f5735bd17261d7714f){gyazo=loop}

---

## Repeat Processing

Execute the workflow multiple times with the same settings.

- Change the number next to the `▷ Run` button

![](https://gyazo.com/5831e4d69bd26c7d5a533fb5781a33ad){gyazo=loop}

The default limit is **100**, but it can be changed in the settings.
- Change the value of `⚙Settings` -> `Queue Button` -> `Batch count limit`.

---

## Repeat Processing Automatically

Use this when you want to "generate automatically every time you change a parameter" or "leave it alone and continue generating infinitely".

- Click `˅` inside the `▷ Run` button, select a mode, and click `▷ Run`
- Press the `🔳 (Clear Pending Tasks)` button to stop

![](https://gyazo.com/c516b3b9fd8b2c506fb1fa91cf385174){gyazo=loop}

### Difference in Modes

- **Queue (Instant)**
  - Starts the next process immediately after the previous process finishes.
  - **Note**: Skipped if the generation result is completely the same (e.g. Seed is fixed).

- **Queue (Change)**
  - Basically in a standby state.
  - Processing starts the moment any parameter (prompt, number, etc.) is changed.

---

## Interrupt Processing

If you execute it by mistake, you can interrupt it from here.

- **Operation**: Click the `❌️` button next to the `▷ Run` button

![](https://gyazo.com/06d8045e9aa39f3ccb9ed7fe49f28588){gyazo=loop}

### About Forced Termination

When the load on the PC is high, such as during sampling with KSampler, pressing `❌️` may not respond immediately.
If it doesn't stop no matter what, **close the terminal and restart ComfyUI itself**. This is the most certain way.

---

## Check and Clear Queue

You can check reserved processes (queues) or delete them all at once.

- **Operation**: Click the Queue icon on the left sidebar (or `Q` key on the keyboard) to display the list.

![](https://gyazo.com/23f7fb0414ad302f23b333ae0add5827){gyazo=loop}

- **Cancel Individually**: Right-click the process you want to cancel and select `Delete`.
- **Cancel All**: Pressing the `🟥` button next to the `▷ Run` button cancels all remaining queues.
