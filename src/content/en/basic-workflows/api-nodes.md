---
layout: page.njk
lang: en
section: basic-workflows
slug: api-nodes
navId: api-nodes
title: "API Nodes"
created: 2025-12-11
updated: 2026-03-02
summary: "How to use external closed models through ComfyUI's API nodes"
seoTitle: "ComfyUI API Nodes: Use Closed Models in ComfyUI"
seoDescription: "Use closed image and video models inside ComfyUI with API nodes: how credits work and how to buy them, how to use the nodes, and when they fit."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
tags: []
---

## What are API Nodes?

ComfyUI is an image generation engine, but it's useless unless models like Stable Diffusion and Qwen-Image are released as open weights in the first place.

Most companies developing AI are for-profit, so it's actually rare for them to release their models like this. We really should be grateful (´・ω・｀)

Most closed models are used through each company's own site or app, but there's also a way to call them through nodes from inside ComfyUI.

API nodes (called Partner Nodes in the official documentation) are a set of nodes for calling external closed models from ComfyUI through an API.

> [!NOTE]
> "API nodes" here means only the **paid nodes provided by ComfyUI**.
> I'm keeping them separate from setups where you get your own OpenAI or Gemini API key and call it from a custom node.

---

## Credit System

API nodes **always use up credits (prepaid)**, whichever model you use. There's no free tier or trial, and they won't run when your credit balance is 0.

Each model has its own price, along the lines of "X credits per generation."
Prices are generally set close to each company's published API pricing, so going through ComfyUI doesn't make things dramatically more expensive.

![](/media/basic-workflows/api-nodes/legacy_gyazo_6f7f9247364acac4d4fb1ccfeeb2e845.png){media=image}

The rough cost is shown as a badge in the top-right corner of each API node.

---

## How to Purchase Credits

- 1. Launch ComfyUI and open `User` from `⚙ Settings`
- 2. Log in with your Comfy account, or Google / GitHub account
- 3. Click `Credits` under the `User` tab
- 4. Click `Purchase Credits` and top up as much as you need via Stripe
- 5. Once payment is complete, check that your balance has gone up (if it hasn't, reload the browser or restart ComfyUI)

---

## How to Use API Nodes

They work just like any other node. Search for the node by model name and connect it.

![](/media/basic-workflows/api-nodes/legacy_gyazo_0d12a7369948fa19779c0b7ffb487cd0.png){media=image}

[](/workflows/basic-workflows/api-nodes/google_gemini.json)

---

## When to Use API Nodes

I'm one of those people who insist on running AI locally, so honestly, I don't use API nodes very often.

Still, for things like generating captions, just using Gemini is far easier than running an LLM on my own PC, so I do rely on it now and then.

ComfyUI's strength is running models locally, but being able to mix closed and local models in the same workflow is arguably a strength too.
