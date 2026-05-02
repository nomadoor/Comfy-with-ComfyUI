---
layout: page.njk
lang: en
section: basic-workflows
slug: external-llm-server
navId: external-llm-server
title: "External LLM Server Integration"
created: 2026-02-18
updated: 2026-03-02
summary: "Run an LLM outside ComfyUI and connect to it"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/da95a615f374717f19b3447244ad647a.png"
---

## External LLM Server Integration

ComfyUI itself is an "engine for connecting generation workflows for images, video, and more" — it has no built-in capability to run LLMs.

So the idea is to delegate LLM work to a separate inference engine (server), while ComfyUI only handles "sending requests and receiving results."

### Why separate the processing?

Custom nodes that run entirely within ComfyUI do exist, but LLM environments carry heavy dependencies, and certain combinations can prevent ComfyUI from starting at all.
Keeping them separate means you won't pollute ComfyUI's environment.

Also, tools built specifically for LLMs tend to support the latest models faster and are generally more stable.
If you have multiple powerful PCs, you can even offload processing to a separate machine.

---

## How to connect

There are several ways to integrate, but the most convenient option right now is the **OpenAI API-compatible** format.

Despite the "OpenAI" name, it's widely used as a common HTTP API format for chat-based LLMs.
Ollama also provides this [compatible API](https://docs.ollama.com/api/openai-compatibility), so using an OpenAI-compatible node on the ComfyUI side is the quickest approach.

---

## Setting up Ollama

![](https://gyazo.com/a01ee125967ce857275bc883a5c3a1dd){gyazo=image}

We'll use **[Ollama](https://ollama.com/)**, a simple and easy-to-use open-source inference engine.

### Installation

Download the installer from the [official site](https://ollama.com/download) and run it.

After installation, Ollama runs as a background service. If you see the icon in the system tray, you're ready to go.

### Downloading a model

Find the model you want to use. You can search for supported models at [Ollama Search](https://ollama.com/search).

For this guide, we'll use `qwen3-vl:8b` — a lightweight but capable model that also supports image input.

Open a terminal and run:

```bash
ollama run qwen3-vl:8b
```

Other locally useful models:

- **gemma3** : Developed by Google. Usable for similar purposes as Qwen3 VL
- **gpt-oss:20b** : OpenAI's open-weight model. Text-only, but very powerful
- **◯◯-Abliterated** : Even open-weight models typically include censorship (not just NSFW). Models with this alignment removed carry this kind of name
  - [UGI Leaderboard](https://huggingface.co/spaces/DontPlanToEnd/UGI-Leaderboard) is a good place to find various models

---

## Running from ComfyUI

Install a custom node to access Ollama from ComfyUI.

### Custom Node

We'll use a node that can send requests in OpenAI API-compatible format. Any will do, but let's go with the simplest one here.

- **[comfyui-openai-api](https://github.com/hekmon/comfyui-openai-api)**

### Minimal chat

![](https://gyazo.com/767f4fd9d6adf6727fc075fac1d14479){gyazo=image}

[](/workflows/basic-workflows/external-llm-server/OpenAI_API_Chat.json)

- `base_url` : `http://localhost:11434/v1` (Ollama's default address)
- `api_key` : Not required for Ollama.
- `model` : Enter the model name you downloaded (e.g., `qwen3-vl:8b`)
- `system_prompt` : Optional

Type your message in the input field at the top of the node and hit `▷Run`.

### Continuing a conversation

This node has no internal "memory."
To continue a conversation, connect the `History` output of the previous node to the `History` input of the next node — this sends the past log along with each new request.

![](https://gyazo.com/274ae7b0dac7a88e4481cd4ca815757f){gyazo=image}

[](/workflows/basic-workflows/external-llm-server/OpenAI_API_Chat-History.json)

- 🟨 Connect `History` from the previous node to `History` on the next node

### Image input

If you're using an MLLM like Qwen3 VL that understands images, you can feed in an image and ask questions about it.

![](https://gyazo.com/04578d7535ce9b4c4fb43148ac1ee2bd){gyazo=image}

[](/workflows/basic-workflows/external-llm-server/OpenAI_API_Chat-multi_images.json)

- Connect your image(s) to `image(s)`
- 🟦 To input multiple images, concatenate them with `Batch Images` first

### Prompt generation → Image generation

Let's put it to use: have the model generate a prompt from an input image, then use that prompt to generate a similar image.

![](https://gyazo.com/214851c957532e34fb705e0d5feeeef9){gyazo=image}

[](/workflows/basic-workflows/external-llm-server/OpenAI_API_Chat-image2prompt.json)

- Use the system prompt to specify an output format like "output a ready-to-use image generation prompt."
- Then just connect the output to `CLIP Text Encode`.
