---
layout: page.njk
lang: zh
section: data-utilities
slug: ai-agent-api
navId: ai-agent-api
title: "让 AI Agent 使用 ComfyUI 工作流"
created: 2026-05-17
updated: 2026-05-17
summary: "通过 API 让 AI Agent 使用 ComfyUI workflow（工作流）"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## ComfyUI 分为“画面”和“执行引擎”

![](https://gyazo.com/a04e2d09b534afb1e32900a738f0c3a7){gyazo=image}

首先需要知道的是，ComfyUI 分为 **画面** 和 **执行引擎**。

平时操作的节点画面，是用来编辑 workflow（工作流）和按下执行按钮的前端。真正生成图像或视频的，是在背后运行的 ComfyUI 服务器。

在 [什么是 API？](/zh/data-utilities/api-about/) 里也讲过，这里简单回顾一下。

- 节点画面：人类用来制作 workflow 的画面
- ComfyUI 服务器：接收并执行 workflow 的引擎
- API：外部程序向服务器发送指令的入口

只要能把执行所需的信息传给服务器，节点画面并不是必须的。

---

## 让 AI 使用 ComfyUI 的方法有两种

### 1. 通过 API 使用已经能运行的 workflow

第一种方法，是人类先准备好一个能运行的 workflow，再让 AI 通过 API 执行它。

这和 [通过 API 运行工作流](/zh/data-utilities/api-run-workflow/) 中介绍的方法很接近。

与其说是让 AI 自由使用整个 ComfyUI，不如说是把 **用 ComfyUI 做好的一个功能，当作工具交给 AI**。

这个方法的弱点是灵活性。比如添加节点、改变节点连接顺序这类大幅修改，基本不适合用这种方法处理。

不过，prompt、seed 这类参数可以通过 API 修改，所以让它用各种 prompt、各种尺寸生成图像，是完全可以做到的。

### 2. 让 AI 从制作 workflow 开始

第二种方法，是让 AI 自己制作 workflow。

比如让它“做一个 Flux 图像编辑 workflow”或“用这张图生成 mask 并合成”，由 AI 思考节点结构并组出 workflow。

听到 AI 和 ComfyUI 的组合，很多人可能会先想到这种方式，但它其实相当困难。

---

## 让 AI 从制作 workflow 开始很难

ComfyUI 的 workflow 是 JSON，所以看起来好像可以像写程序一样，让 AI 直接生成。

但实际上，workflow 非常依赖每个人自己的 ComfyUI 环境。  
是否安装了 custom node、是否有对应模型文件、节点规格现在是否还一致……这些条件不满足，就无法运行。

在 AI 性能之前，**AI 无法掌控的地方，就已经有太多会让行为不稳定的因素**。

当然，将来这类工作也许会变得可行。  
但至少现在，先让 AI 使用人类已经确认能运行的 workflow，会更现实。

---

## 通过 API 来使用

通过 API 来使用时，思路很简单。

1. 启动 ComfyUI
2. 将能运行的 workflow 保存为 API 格式
3. 把 workflow 交给 AI Agent
4. 指示它在这个 workflow 能做的范围内完成任务

[通过 API 运行工作流](/zh/data-utilities/api-run-workflow/) 介绍了如何通过 API 执行 ComfyUI。  
不过，细节上的 API 写法可以交给 AI 来处理。

### 先启动 ComfyUI

API 并不是“让你不需要启动 ComfyUI”的机制。

在本地使用时，和平时一样启动 ComfyUI，并确保可以通过 `http://127.0.0.1:8188` 打开。

AI Agent 会向这个服务器发送 HTTP 请求。  
可以把它理解为：AI 不通过节点画面，而是从外部读取 workflow 并按下 `Run`。

### 将能运行的 workflow 保存为 API 格式

接下来，把想让 AI 使用的 workflow 保存为 API 格式。

普通 workflow JSON 中还包含节点位置、UI 用信息等内容。  
API 格式的 JSON，则是用来告诉 ComfyUI 服务器“执行这个”的形式。

1. 在 ComfyUI 的节点 UI 中打开想让 AI 使用的 workflow
2. 从菜单选择 `File` → **Export (API)**
3. 用容易理解的名字保存（例：`SD1.5_text2image_API.json`）

> 当然，这个 workflow 必须能在你自己的环境中实际运行。  
> 请先下载好模型等必要文件，并实际运行确认一次。

### 把 workflow 交给 AI Agent，并给出指示

把 workflow 交给 AI Agent，并不需要什么特别操作。

只要把 API 用 workflow JSON 放在 AI Agent 能读取的位置即可。

如果是 Codex，用 VS Code 打开包含这些 workflow JSON 的文件夹就可以了。

例如，在文件夹里放入下面两个文件。

- `Z-Image-Turbo_api.json`：用于图像生成
- `Flux.2_klein_9b_api.json`：用于图像编辑

然后像这样对 Codex 下指示。

```text
用 Z-Image-Turbo 生成一张站在公园里的男性图像，
再用 Flux.2 klein 9B 把这个人的衣服改成蓝色毛衣，
并保存到 output 文件夹。
```

之后 Codex 会读取 workflow，替换必要的 prompt 和输入图像，并提交给 ComfyUI API。

![VS Code 画面](https://gyazo.com/ae044eb02df2f95bd15f00bcd0c44620){gyazo=image}

---

## workflow 分小一点会更容易让 AI 使用

这是我自己提出的概念，[Readable Nodes](/zh/begin-with/readable-nodes/) 大致就是把 workflow 组得简单、易读的想法。

让 AI 使用时，基本也是一样。  
我觉得 workflow **小而简单** 时会更容易处理。

![](https://i.gyazo.com/2a9c66fa28c01a8bd12b24fdde2a07a4.png){gyazo=image}

比如，把下面这些处理放进一个 workflow 里。

- 图像生成
- 放大
- 脸部修正

这种情况下，一旦执行，就会从头到尾全部跑完。  
即使最初生成的图像不理想，放大和修正也会继续执行。

如果把它拆成小 workflow 呢？

- 用 `text2image` 生成候选图像
- 只把好的结果送进 `upscale`
- 只把需要的结果交给 `face fix`
- 之后也可以只执行 `upscale`

人类自己用的时候，整合在一起有时会更轻松。可是让 AI 使用时，workflow 之间的衔接可以交给 AI 来做。

这样一来，与其准备 All in one 的 workflow，不如准备更细、更小的最小 workflow，AI 会更灵活地使用它们。

---

## 关于 MCP

上面的方法，是让 AI 写一段使用 API 的简单程序并执行。它能用，但从 AI native 的角度看，多少有些不够顺手。

于是，也可以考虑转换成 **MCP**。MCP 是一种向 AI Agent 提供工具和数据的通用协议。

例如，可以考虑下面这样的 MCP tool。

- `run_text2image`
- `run_image2image`
- `run_upscale`
- `get_comfyui_queue`
- `get_output_image`

从 AI 的角度来看，它不需要处理“把 JSON POST 到 HTTP `/prompt`”这样的细节，只要调用 `run_text2image` 这个工具即可。

比如在这个 tool 内部，可以读取 API 格式的 workflow，替换必要的值，然后提交到 ComfyUI 的 `/prompt`。

不过，它主要只是让 AI 稍微更容易使用而已，并不会大幅改变能做的事情。  
现阶段没有必要勉强使用。
