---
layout: page.njk
lang: zh
section: data-utilities
slug: queue
navId: queue
title: "队列 (Queue)"
created: 2026-02-06
updated: 2026-03-02
summary: "预约任务，以及指定次数连续运行"
seoTitle: "ComfyUI 队列（Queue）：预约生成与连续执行"
seoDescription: "ComfyUI 的 Run 按钮其实是向队列添加预约。介绍连续执行、control after generate 设置、停止当前任务、删除预约和查看历史的方法。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 什么是 Queue (队列)？

Queue (队列) 是把想要执行的任务按顺序排好的机制。

当前任务结束后，Queue 中排着的下一个任务就会自动开始执行。

---

## ComfyUI 中的 Queue 基础

![](/media/begin-with/run-and-stop/legacy_gyazo_5831e4d69bd26c7d5a533fb5781a33ad.mp4){media=loop}

ComfyUI 的 `▷ Run` 按钮看上去是“执行”，实际上是 **向 Queue 添加 1 个预约的按钮**。之所以一按 `▷ Run` 就开始生成，是因为这个预约直接排到了最前面，并立即被执行。

打开侧边栏的 `Queue`，试着连续点击 `▷ Run` 看看。
应该能看到 Queue 里的任务一个个增加。

---

## 向 Queue 添加任务（预约）的方法

### 1. 在处理过程中直接点击 Run

这是最简单的方法。
想把同一个工作流再执行一次时，可以马上接着把它加入 Queue。

![](/media/data-utilities/queue/legacy_gyazo_0680d8d1d2ff86a81f15a81085af35a9.mp4){media=loop}

ComfyUI 只有一个处理引擎，所以无论是从

- 别的标签页
- 别的工作流

点击 `▷ Run`，都会排进同一个 Queue。

### 2. 调大 Run 旁边的数字，连续运行

![](/media/begin-with/run-and-stop/legacy_gyazo_5831e4d69bd26c7d5a533fb5781a33ad.mp4){media=loop}

修改 `▷ Run` 按钮旁边的数字，就能按这个次数一次性加入 Queue。
想用相同设置生成多张图时很方便。

---

## Control After Generate

`INT` 类型的参数（例: `KSampler` 的 `seed` 等）带有一个在生成后改变数值的选项。

![](/media/data-utilities/queue/legacy_gyazo_3f0dd7eb5dde53d648a2fe2c49d41324.mp4){media=loop}

配合 Queue 使用，就能实现 **每次改变数值、连续生成** 这样的玩法。

- `fixed`：数值不变
- `increment`：增加 1
- `decrement`：减少 1
- `randomize`：每次随机

想像抽卡一样每次试出不同结果，就用 `randomize`；
想固定 seed、比较其他参数，就用 `fixed`。

> [!NOTE]
> 为了便于复现，本站的工作流几乎都使用 `fixed`。

---

## Queue 的操作

### 添加预约

- 点击 `▷ Run`
- 调大旁边的数字，就能按这个次数一次性添加。

### 停止当前正在运行的任务

只停止正在运行的任务。
Queue 中排着的“后续预约”会保留下来。

![](/media/data-utilities/queue/legacy_gyazo_a7d76a9fee8c00efeddb0f454528c8d6.mp4){media=loop}

- 点击 `❌️ (Cancel Current Run)`

只有当前正在运行的任务会停止。
Queue 中排着的“后续预约”会原样保留。

### 删除已预约的任务

![](/media/data-utilities/queue/legacy_gyazo_b4d1229ca875c9fd5cbbde0dfbf47fc6.mp4){media=loop}

只想删除 1 个时
- 在侧边栏的 Queue 中右键点击该任务 → Delete

想批量删除未执行的预约时
- 点击 `🔳 (Clear Pending Tasks)`
- 可以一次性删除 Queue 中剩下的任务（未执行的部分）


---


## 查看过去的任务

![](/media/data-utilities/queue/legacy_gyazo_3db298a7968024f5c06db82ee194d0c9.mp4){media=loop}

打开侧边栏的 `Queue`，可以查看过去的处理历史。
也可以从这里载入过去的工作流。
