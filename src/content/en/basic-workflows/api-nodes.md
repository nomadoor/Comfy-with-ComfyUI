---
layout: page.njk
lang: en
section: basic-workflows
slug: api-nodes
navId: api-nodes
title: "API Nodes"
summary: "How to use external closed models with API nodes in ComfyUI"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
tags: []
---

## What are API Nodes?

ComfyUI is an image generation engine, but it is meaningless unless models like Stable Diffusion and Qwen-Image are released as open weights in the first place.

Most companies developing AI are for-profit companies, so it is rare for them to release models like this. We really have to be grateful.

Many closed models are used from each company's site or dedicated UI, but there is also a way to call them via nodes from within ComfyUI.

API nodes (called Partner Nodes in the official documentation) are nodes for calling external closed models from ComfyUI via API.

> The "API nodes" here refer to **paid nodes prepared by ComfyUI**.
> I distinguish them from patterns where you get OpenAI or Gemini API keys yourself and hit them from custom nodes.

---

## Credit System

API nodes **always consume credits (prepaid)** regardless of which model you use. There is no free tier or trial, and it cannot be executed when the credit balance is 0.

The fee is determined for each model in the form of "X credits per generation".
Basically, it is set at a level that does not deviate significantly from the API price range published by each company, and there is no such thing as "it becomes extremely expensive because it is via ComfyUI".

![](https://gyazo.com/6f7f9247364acac4d4fb1ccfeeb2e845){gyazo=image}

Approximate charges are displayed as badges on the top right of the API node.

---

## How to Purchase Credits

- 1. Launch ComfyUI and open `User` from `⚙ Settings`
- 2. Log in with your Comfy account, or Google / GitHub account
- 3. Click `Credits` under the `User` tab
- 4. Click `Purchase Credits` and charge only the necessary amount with Stripe payment
- 5. After payment is complete, confirm that the balance has increased (if it is not reflected, reload the browser or restart ComfyUI)

---

## How to Use API Nodes

The usage is the same as other nodes. Just search for the node by model name and connect it.

![](https://gyazo.com/0d12a7369948fa19779c0b7ffb487cd0){gyazo=image}

[](/workflows/basic-workflows/api-nodes/Google_Gemini.json)

---

## When to Use API Nodes

I am one of those who are particular about running AI locally, so honestly I don't use API nodes frequently.

Still, caption generation and the like are much easier to use Gemini than running LLM on my own PC, so I sometimes use it.

ComfyUI's strength is that it can run models in a local environment, but being able to mix and use closed models and local models in the same workflow can also be said to be a strength.
