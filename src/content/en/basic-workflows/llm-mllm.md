---
layout: page.njk
lang: en
section: basic-workflows
slug: llm-mllm
navId: llm-mllm
title: "LLM / MLLM"
summary: "What you can do with LLMs in ComfyUI"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## What is LLM / MLLM?

An LLM is, very roughly speaking, an AI that reads text and responds with text — like ChatGPT.

An MLLM is an LLM that can also accept images and other inputs. As the name suggests, it's a "Multimodal" LLM.

---

## What do you use it for in ComfyUI?

In ComfyUI, LLMs are used less for conversation and more as a "behind-the-scenes" helper — creating the baton to pass to image generation models.

- **Prompt expansion & translation**
  - Turning a rough human instruction into a detailed English prompt that AI can understand
- **Tag generation & image captioning**
  - Show it an image and have it output tags or a description
  - Useful for training captions, or as a prompt for re-generation
- **Object detection & segmentation**
  - Some MLLMs can handle more specialized tasks
  - MLLM-based object detection is especially handy because you can specify targets in natural language

---

## 3 ways to use LLMs in ComfyUI

ComfyUI is an engine specialized for image generation, so there's no built-in feature to run LLMs — the underlying mechanisms are completely different.

That means you'll generally use custom nodes or external integrations.

### Self-contained within ComfyUI

Download a model file and run it on your own PC, just like image generation models.

Lightweight models specialized for specific tasks — like caption generation or object detection — are the main use case here.

![Florence2](https://gyazo.com/b364e8bc1ba2799ad953384f4dfe2079){gyazo=image}

**Representative supported models**
- [JoyCaption](/en/basic-workflows/joycaption/)
- [Florence-2](/en/basic-workflows/florence2/)
- Qwen3 VL

### External LLM server integration

Delegate LLM inference to a dedicated engine like Ollama or LM Studio, and call it from ComfyUI via API.

Running on the same PC still means competing for VRAM, but the key advantage is **keeping the inference environment separate from ComfyUI**.
- No pollution of ComfyUI's dependencies, making maintenance easier
- Run it on a separate PC and connect over the network to eliminate VRAM contention entirely

→ [External LLM Server Integration](/en/basic-workflows/external-llm-server/)

### Official paid API nodes

ComfyUI's official nodes for calling closed services like ChatGPT or Gemini via API.

![Google_Gemini](https://gyazo.com/0d12a7369948fa19779c0b7ffb487cd0){gyazo=image}

Bluntly put, these are far smarter and faster than local models.
- Zero load on your PC. You can run image generation while prompts are being refined in the background, with no impact on generation speed
- That said, pay-as-you-go billing applies, and NSFW content will be blocked by guardrails, so keep that in mind

→ [API Nodes](/en/basic-workflows/api-nodes/)

---

## Side note: Are you already using one?

Recent image generation models (like Qwen-Image and Z-Image) embed MLLMs such as Qwen or Gemma as their text encoder — the component that understands your prompt.

They use it to understand text prompts and reference images for generation and editing, but in a sense, that's all they're using it for — a rather lavish arrangement.
It would be interesting if we could use that MLLM directly for other purposes someday…
