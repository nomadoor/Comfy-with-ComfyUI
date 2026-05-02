---
layout: page.njk
lang: zh
section: basic-workflows
slug: external-llm-server
navId: external-llm-server
title: "外部 LLM 服务器集成"
created: 2026-02-18
updated: 2026-03-02
summary: "在 ComfyUI 外部运行 LLM 并与其联动"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/da95a615f374717f19b3447244ad647a.png"
---

## 外部 LLM 服务器集成

ComfyUI 本身是"连接图像、视频等生成工作流的引擎"，基本上不具备运行 LLM 的功能。

因此，将 LLM 的工作交给独立的推理引擎（服务器），ComfyUI 只负责"发送请求并接收结果"。

### 为什么要分离处理？

虽然也存在完全在 ComfyUI 内部运行的自定义节点，但 LLM 环境的依赖关系较重，某些组合可能导致 ComfyUI 无法启动。
保持分离，就不会污染 ComfyUI 的环境。

此外，专为 LLM 开发的工具对最新模型的支持往往更快，也更稳定。
如果你有多台性能强劲的 PC，甚至可以将处理迁移到另一台机器上。

---

## 连接方式

集成方式有多种，但目前最易用的是 **OpenAI API 兼容**格式。

虽然名字里有"OpenAI"，但它已作为面向聊天类 LLM 的通用 HTTP API 格式被广泛采用。
Ollama 也提供了这个[兼容 API](https://docs.ollama.com/api/openai-compatibility)，因此在 ComfyUI 侧使用 OpenAI 兼容节点是最便捷的方案。

---

## 安装 Ollama

![](https://gyazo.com/a01ee125967ce857275bc883a5c3a1dd){gyazo=image}

本次使用简单易用的开源推理引擎 **[Ollama](https://ollama.com/)**。

### 安装

从[官网](https://ollama.com/download)下载安装程序并运行。

安装完成后，Ollama 会作为后台服务运行。任务栏托盘中出现图标即表示准备就绪。

### 下载模型

找到你想使用的模型。可以在 [Ollama Search](https://ollama.com/search) 搜索支持的模型。

本次使用 `qwen3-vl:8b`——一个轻量但性能出色、同时支持图像输入的模型。

打开终端，运行：

```bash
ollama run qwen3-vl:8b
```

其他适合本地使用的模型：

- **gemma3** : Google 开发，可用于与 Qwen3 VL 类似的用途
- **gpt-oss:20b** : OpenAI 的开放权重模型，仅支持文本处理，但非常强大
- **◯◯-Abliterated** : 即使是开放权重模型，通常也内置了审查机制（不仅限于 NSFW）。移除了这种对齐的模型会带有此类名称
  - [UGI Leaderboard](https://huggingface.co/spaces/DontPlanToEnd/UGI-Leaderboard) 可以找到各种模型

---

## 从 ComfyUI 调用

安装一个自定义节点，以便从 ComfyUI 访问 Ollama。

### 自定义节点

使用能以 OpenAI API 兼容格式发送请求的节点。任意一款均可，这里选用最简洁的一款。

- **[comfyui-openai-api](https://github.com/hekmon/comfyui-openai-api)**

### 最简聊天

![](https://gyazo.com/767f4fd9d6adf6727fc075fac1d14479){gyazo=image}

[](/workflows/basic-workflows/external-llm-server/OpenAI_API_Chat.json)

- `base_url` : `http://localhost:11434/v1`（Ollama 的默认地址）
- `api_key` : 使用 Ollama 时无需填写。
- `model` : 输入刚才下载的模型名称（如 `qwen3-vl:8b`）
- `system_prompt` : 可省略

在节点顶部的输入框中输入消息，点击 `▷Run` 即可。

### 继续对话

该节点内部没有"记忆"功能。
若要延续对话，将上一个节点的 `History` 连接到下一个节点的 `History`，每次请求时一并发送历史记录。

![](https://gyazo.com/274ae7b0dac7a88e4481cd4ca815757f){gyazo=image}

[](/workflows/basic-workflows/external-llm-server/OpenAI_API_Chat-History.json)

- 🟨 将上一个节点的 `History` 连接到下一个节点的 `History`

### 图像输入

如果使用的是 Qwen3 VL 等支持图像理解的 MLLM，可以输入图像并就其内容提问。

![](https://gyazo.com/04578d7535ce9b4c4fb43148ac1ee2bd){gyazo=image}

[](/workflows/basic-workflows/external-llm-server/OpenAI_API_Chat-multi_images.json)

- 将图像连接到 `image(s)`
- 🟦 若要输入多张图像，先用 `Batch Images` 合并后再输入

### 提示词生成 → 图像生成

趁此机会，让模型根据输入图像生成提示词，再用该提示词生成相似图像。

![](https://gyazo.com/214851c957532e34fb705e0d5feeeef9){gyazo=image}

[](/workflows/basic-workflows/external-llm-server/OpenAI_API_Chat-image2prompt.json)

- 在系统提示词中指定输出格式，例如"输出可直接使用的图像生成提示词"。
- 之后只需将输出连接到 `CLIP Text Encode` 即可。
