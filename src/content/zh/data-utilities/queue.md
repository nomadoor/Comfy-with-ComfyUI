---
layout: page.njk
lang: zh
section: data-utilities
slug: queue
navId: queue
title: "队列 (Queue)"
summary: "关于处理的预约和指定次数运行"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 什么是 Queue (队列)？

Queue (队列) 是指将想要让计算机执行的处理按顺序排列等候的机制。

当前的处理结束后，堆积在 Queue 中的下一个处理就会被自动执行。

---

## ComfyUI 中的 Queue 基础

![](https://i.gyazo.com/5831e4d69bd26c7d5a533fb5781a33ad.png){gyazo=image}

ComfyUI 的 `▷ Run` 按钮虽然看起来是“执行”，但实际上是 **向 Queue 中追加 1 个预约的按钮**。按下 `▷ Run` 的瞬间生成就开始了，是因为预约直接进入了排头并且被立即执行了。

打开侧边栏的 `Queue`，试着连续点击 `▷ Run` 看看。
你应该能看到 Queue 被一个个添加进去。

---

## 堆积 Queue（预约）的方法

### 1. 在处理中直接点击 Run

这是最简单的方法。
当你想再次执行同一个 工作流 时，可以马上将其追加到 Queue 中。

![](https://gyazo.com/0680d8d1d2ff86a81f15a81085af35a9){gyazo=loop}

由于 ComfyUI 只有一个处理引擎，因此无论你从

- 别的标签页
- 别的 工作流

点击 `▷ Run`，它们都会排在同一个 Queue 中。

### 2. 这增加 Run 旁边的数字进行连续运行

![](https://i.gyazo.com/5831e4d69bd26c7d5a533fb5781a33ad.png){gyazo=image}

更改 `▷ Run` 按钮旁边的数字，就可以根据该次数批量堆积到 Queue 中。
当想用相同的设置制作多张图时很方便。

---

## Control After Generate

`INT` 类型的参数（例: `KSampler` 的 `seed` 等），拥有在生成后更改数值的选项。

![](https://gyazo.com/3f0dd7eb5dde53d648a2fe2c49d41324){gyazo=loop}

与 Queue 并用，就可以进行 **每次改变数值并连续生成** 这样的应用。

- `fixed`：数值不变
- `increment`：增加 1
- `decrement`：减少 1
- `randomize`：每次随机

如果想像扭蛋一样每次尝试不同的结果，就使用 `randomize`。
如果想固定 seed 并比较其他参数，就使用 `fixed`。

> 本网站的 工作流 为了可复现性，绝大多数都使用了 `fixed`。

---

## Queue 的操作

### 添加预约

- 点击 `▷ Run`
- 增加旁边的数字，就可以根据该次数批量添加。

### 停止当前正在进行的处理

仅停止运行中的任务。
堆积在 Queue 中的“后续预约”会保留。

![](https://gyazo.com/a7d76a9fee8c00efeddb0f454528c8d6){gyazo=loop}

- 点击 `❌️ (Cancel Current Run)`

当前正在运行的任务会停止。
排在 Queue 中的“后续预约”会保留。

### 删除已预约的任务

![](https://gyazo.com/b4d1229ca875c9fd5cbbde0dfbf47fc6){gyazo=loop}

想只删除 1 个时
- 在侧边栏的 Queue 中右键点击对象 → Delete

想批量删除未执行的预约时
- 点击 `🔳 (Clear Pending Tasks)`
- 可以一键删除残留在 Queue 中的任务（未执行部分）


---


## 确认过去的处理

![](https://gyazo.com/3db298a7968024f5c06db82ee194d0c9){gyazo=loop}

打开侧边栏的 `Queue`，可以确认过去的处理历史。
也可以从这里读取过去的 工作流。
