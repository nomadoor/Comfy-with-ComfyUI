---
layout: page.njk
lang: en
section: data-utilities
slug: queue
navId: queue
title: "Queue"
summary: "About queuing processes and batch execution"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## What is Queue?

Queue is a mechanism to line up processes you want to execute in order.

When the current process finishes, the next process in the Queue is automatically executed.

---

## Basic of Queue in ComfyUI

![](https://i.gyazo.com/5831e4d69bd26c7d5a533fb5781a33ad.png){gyazo=image}

The `▷ Run` button in ComfyUI looks like "Execute", but it is actually a button to **add one reservation to the Queue**. The reason generation starts the moment you press `▷ Run` is because the reservation enters the front of the line and is executed immediately.

Open the `Queue` in the sidebar and try pressing `▷ Run` continuously.
You should see the Queue being added.

---

## How to Queue (Reserve)

### 1. Press Run during processing

This is the simplest way.
If you want to run the same workflow again, you can add it to the Queue immediately.

![](https://gyazo.com/0680d8d1d2ff86a81f15a81085af35a9){gyazo=loop}

Since ComfyUI has only one processing engine,

- From another tab
- From another workflow

Even if you press `▷ Run` from these, they will all line up in the same Queue.

### 2. Increase the number next to Run for continuous execution

![](https://i.gyazo.com/5831e4d69bd26c7d5a533fb5781a33ad.png){gyazo=image}

By changing the number next to the `▷ Run` button, you can stack that many runs into the Queue at once.
This is useful when you want to create multiple images with the same settings.

---

## Control After Generate

For `INT` type parameters (e.g., `seed` in `KSampler`), there is an option to change the value after generation.

![](https://gyazo.com/3f0dd7eb5dde53d648a2fe2c49d41324){gyazo=loop}

When used with Queue, you can apply it to **generate continuously while changing the value each time**.

- `fixed`: Do not change the value
- `increment`: Increase by 1
- `decrement`: Decrease by 1
- `randomize`: Randomize each time


Use `randomize` if you want to try different results each time like a seed gacha, and `fixed` if you want to fix the seed and compare other parameters.

> The workflows on this site mostly use `fixed` for reproducibility.

---

## Queue Operations

### Add a reservation

- Click `▷ Run`
- Increase the number next to it to stack that amount at once.

### Stop the current job

Stops only the currently running job.
"Future reservations" stacked in the Queue remain.

![](https://gyazo.com/a7d76a9fee8c00efeddb0f454528c8d6){gyazo=loop}

- Click `❌️ (Cancel Current Run)`

Only the currently running job stops.
"Future reservations" in the Queue remain as they are.

### Delete reserved tasks

![](https://gyazo.com/b4d1229ca875c9fd5cbbde0dfbf47fc6){gyazo=loop}

To delete only one item:
- Right-click the target in the Queue sidebar -> Delete

To delete all unexecuted reservations:
- Click `🔳 (Clear Pending Tasks)`
- You can batch delete tasks remaining in the Queue (unexecuted ones).


---


## Check past processes

![](https://gyazo.com/3db298a7968024f5c06db82ee194d0c9){gyazo=loop}

Opening `Queue` in the sidebar allows you to check past processing history.
You can also load past workflows from here.
