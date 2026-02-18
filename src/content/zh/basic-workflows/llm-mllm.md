---
layout: page.njk
lang: zh
section: basic-workflows
slug: llm-mllm
navId: llm-mllm
title: "LLM / MLLM"
summary: "在 ComfyUI 中使用 LLM 能做什么"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 什么是 LLM / MLLM？

LLM（大语言模型），简单来说就是像 ChatGPT 一样，读取文本并以文本作答的 AI。

MLLM 则是在此基础上，还能接受图像等多种输入的 LLM。顾名思义，就是"多模态"LLM。

---

## 在 ComfyUI 中用来做什么？

在 ComfyUI 中，LLM 与其说是用来对话，不如说更多是作为"幕后助手"——为图像生成模型准备好输入素材。

- **提示词扩展与翻译**
  - 将人类粗略的指令，扩展为 AI 更容易理解的详细英文提示词
- **标签生成与图像描述**
  - 输入图像，让它输出描述该图像的标签或文字
  - 可用于训练用描述文本，也可将其作为提示词重新生成图像
- **物体检测与分割**
  - 部分 MLLM 能执行更专业的任务
  - 基于 MLLM 的物体检测尤为实用，因为可以用自然语言指定目标

---

## 在 ComfyUI 中使用 LLM 的三种方式

ComfyUI 是专为图像生成设计的引擎，核心功能中并不包含运行 LLM 的能力——两者的底层机制完全不同。

因此，通常需要通过自定义节点或外部集成来使用。

### 在 ComfyUI 内部完结

与图像生成模型一样，下载模型文件并在本机运行。

主要使用针对特定任务优化的轻量模型，如描述生成或物体检测。

![Florence2](https://gyazo.com/b364e8bc1ba2799ad953384f4dfe2079){gyazo=image}

**代表性支持模型**
- [JoyCaption](/zh/basic-workflows/joycaption/)
- [Florence-2](/zh/basic-workflows/florence2/)
- Qwen3 VL

### 外部 LLM 服务器集成

将 LLM 推理交给 Ollama 或 LM Studio 等专用引擎，从 ComfyUI 通过 API 调用。

即使在同一台 PC 上运行，VRAM 的竞争依然存在，但最大的优势在于**将推理环境与 ComfyUI 完全隔离**。
- 不污染 ComfyUI 的依赖环境，维护性更高
- 在另一台 PC 上运行并通过网络连接，还能彻底解决 VRAM 争抢问题

→ [外部 LLM 服务器集成](/zh/basic-workflows/external-llm-server/)

### 官方付费 API 节点

ComfyUI 官方提供的节点，用于通过 API 调用 ChatGPT 或 Gemini 等闭源服务。

![Google_Gemini](https://gyazo.com/0d12a7369948fa19779c0b7ffb487cd0){gyazo=image}

说句实话，这些服务比本地模型聪明得多，也快得多。
- PC 负载完全为零。在跑图的同时让它在后台润色提示词，完全不影响生成速度
- 不过，当然需要按量付费，且 NSFW（成人向）内容会被安全机制拦截，需注意

→ [API 节点](/zh/basic-workflows/api-nodes/)

---

## 题外话：其实你已经在用了？

最近的图像生成模型（如 Qwen-Image、Z-Image 等）内置了 Qwen 或 Gemma 等 MLLM 作为文本编码器——也就是理解提示词的那个组件。

它们用 MLLM 来理解文本提示词和参考图像，进而完成生成与编辑任务。但反过来说，也只是用于这一目的，算是一种"奢侈的用法"。  
如果有朝一日能直接将其作为通用 MLLM 使用，那就有趣了……
