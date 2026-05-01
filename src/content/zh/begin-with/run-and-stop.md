---
layout: page.njk
lang: zh
section: begin-with
slug: run-and-stop
navId: run-and-stop
title: "执行与停止"
created: 2026-02-06
updated: 2026-03-02
summary: "关于执行与停止"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## 执行处理

执行 工作流。

- 点击菜单的 `▷ Run`（或 `Queue Prompt`）按钮

![](https://gyazo.com/e1be6c3b9c1666f5735bd17261d7714f){gyazo=loop}

---

## 重复处理

使用相同的设置多次执行 工作流。

- 更改 `▷ Run` 按钮旁边的数值

![](https://gyazo.com/5831e4d69bd26c7d5a533fb5781a33ad){gyazo=loop}

默认上限为 **100**，但可以在设置中更改。
- 请修改 `⚙Settings` → `Queue Button` → `Batch count limit` 的值。

---

## 自动重复处理

当“希望每次更改参数都自动生成”或者“想把它放着让它无限生成”的时候使用。

- 点击 `▷ Run` 按钮内的 `˅`，选择模式，然后点击 `▷ Run`
- 按下 `🔳 (Clear Pending Tasks)` 按钮停止

![](https://gyazo.com/c516b3b9fd8b2c506fb1fa91cf385174){gyazo=loop}

### 模式的区别

- **Run (Instant)**
  - 上一次处理结束后，立即开始下一次处理。
  - **注意**: 如果生成结果完全相同（例如固定了 Seed），则会被跳过。

- **Run (On Change)**
  - 基本处于待机状态。
  - 某个参数（提示词或数值等）发生变化的瞬间，开始处理。

---

## 中断处理

如果不小心误点了执行，可以从这里中断。

- **操作**: 点击 `▷ Run` 按钮旁边的 `❌️` 按钮

![](https://gyazo.com/06d8045e9aa39f3ccb9ed7fe49f28588){gyazo=loop}

### 关于强制结束

在 KSampler 进行采样等 PC 负载较高的时候，即使按下 `❌️` 也可能不会立即响应。
如果实在停不下来，请**关闭终端并重启 ComfyUI 本身**。这是最稳妥的方法。

---

## 队列的确认与清除

可以确认已预约的处理（队列），或者批量删除它们。

- **操作**: 点击左侧边栏的 Queue 图标（或键盘上的 `Q` 键）显示列表。

![](https://gyazo.com/23f7fb0414ad302f23b333ae0add5827){gyazo=loop}

- **单独取消**: 右键点击想要取消的处理，选择 `Delete`。
- **批量取消**: 按下 `▷ Run` 按钮旁边的 `🟥` 按钮，将取消所有剩余的队列。
