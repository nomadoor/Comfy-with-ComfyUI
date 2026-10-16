---
layout: page.njk
lang: en
section: data-utilities
slug: queue
navId: queue
title: "Queue"
created: 2025-11-27
updated: 2026-03-02
summary: "Queuing up runs and running them multiple times"
seoTitle: "The ComfyUI Queue: Schedule and Repeat Generations"
seoDescription: "The ComfyUI Run button adds a job to the queue. Run multiple times, use control after generate, stop the current job, clear jobs, and check history."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## What is the Queue?

The Queue lines up the jobs you want to run, in order.

When the current job finishes, the next one in the Queue starts automatically.

---

## Queue Basics in ComfyUI

![](/media/begin-with/run-and-stop/legacy_gyazo_5831e4d69bd26c7d5a533fb5781a33ad.mp4){media=loop}

The `▷ Run` button in ComfyUI looks like it means "execute," but it actually **adds one job to the Queue**. Generation starts the moment you press `▷ Run` only because that job goes straight to the front and runs immediately.

Open `Queue` in the sidebar and press `▷ Run` several times in a row.
You should see jobs piling up in the Queue.

---

## How to Add Jobs to the Queue

### 1. Press Run while a job is running

This is the simplest way.
If you want to run the same workflow again, you can add it to the Queue right away.

![](/media/data-utilities/queue/legacy_gyazo_0680d8d1d2ff86a81f15a81085af35a9.mp4){media=loop}

ComfyUI has only one processing engine, so even if you press `▷ Run` from

- another tab
- another workflow

they all line up in the same Queue.

### 2. Raise the number next to Run to run it several times

![](/media/begin-with/run-and-stop/legacy_gyazo_5831e4d69bd26c7d5a533fb5781a33ad.mp4){media=loop}

Change the number next to the `▷ Run` button to add that many runs to the Queue at once.
This is handy when you want several images with the same settings.

---

## Control After Generate

`INT` parameters (such as `seed` in `KSampler`) have an option that changes the value after each generation.

![](/media/data-utilities/queue/legacy_gyazo_3f0dd7eb5dde53d648a2fe2c49d41324.mp4){media=loop}

Combined with the Queue, this lets you **generate over and over while changing the value each time**.

- `fixed`: Do not change the value
- `increment`: Increase by 1
- `decrement`: Decrease by 1
- `randomize`: Randomize each time


Use `randomize` when you want a different result every time, like rolling the dice on seeds, and `fixed` when you want to lock the seed and compare other parameters.

> [!NOTE]
> The workflows on this site mostly use `fixed` for reproducibility.

---

## Queue Operations

### Add a job

- Click `▷ Run`
- Raise the number next to it to add that many at once.

### Stop the current job

Stops only the job that is running.
The jobs still waiting in the Queue stay put.

![](/media/data-utilities/queue/legacy_gyazo_a7d76a9fee8c00efeddb0f454528c8d6.mp4){media=loop}

- Click `❌️ (Cancel Current Run)`

Only the running job stops.
The jobs waiting in the Queue stay as they are.

### Delete queued tasks

![](/media/data-utilities/queue/legacy_gyazo_b4d1229ca875c9fd5cbbde0dfbf47fc6.mp4){media=loop}

To delete only one item:
- Right-click the target in the Queue sidebar -> Delete

To delete all pending jobs at once:
- Click `🔳 (Clear Pending Tasks)`
- This deletes every task still waiting in the Queue (not yet run).


---


## Checking Past Runs

![](/media/data-utilities/queue/legacy_gyazo_3db298a7968024f5c06db82ee194d0c9.mp4){media=loop}

Open `Queue` in the sidebar to see your past runs.
You can also load past workflows from here.
