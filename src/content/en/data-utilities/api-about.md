---
layout: page.njk
lang: en
section: data-utilities
slug: api-about
navId: api-about
title: "What is the API?"
created: 2026-02-05
updated: 2026-03-02
summary: "An entry point to control ComfyUI from outside"
seoTitle: "What Is the ComfyUI API? Run Workflows from Outside"
seoDescription: "How ComfyUI splits into a server and a frontend, how the API sends commands to the server, what it can automate, and what to watch out for."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## Structure of ComfyUI

ComfyUI is actually split into "two parts."

### Server (ComfyUI Core)

This is the "engine" side that runs workflows and generates images, videos, audio, and so on.
When you start ComfyUI, this is the server listening locally at a URL like `http://127.0.0.1:8188`.

### Frontend (User Interface)

This is the "control" side that tells the server, "run this workflow."
The web-based node UI you normally use is just one of these frontends.

---

## API is a "Window to Send Commands to Server"

The frontend and the server don't just connect on their own.
What links them is the **API (the window that passes commands along)**.

![](/media/begin-with/multiple-comfyui-instances/legacy_gyazo_a04e2d09b534afb1e32900a738f0c3a7.png){media=image}

The web node UI also sends its commands to the server through the API behind the scenes.
In other words, the moment you press `▷Run` in the UI, a request saying "run this workflow" is sent to the server in the background.

---

## API Increases "Ways to Execute"

The most interesting thing about the API is that **you can drive the same ComfyUI server from entry points other than the browser**.

For example, you can do the following:

- Run workflows from commands (CLI) or scripts
- Build your own small UI (like a screen with just a form) and run workflows from it
- Swap only the seed or text and run it over and over

The node UI gives you a lot of freedom, but sometimes that much freedom just gets confusing.
Also, for batch-style jobs where you "run the same workflow many times with small changes," a script is sometimes simpler than fiddling with nodes.

That's the advantage of the API: you can pick the entry point that suits the job.

---

## Notes

### Server Must Be Running

The API is not a way to "skip starting ComfyUI."

The server is what actually runs the generation, so it has to be running and waiting.

### Mainly for Automating "Execution"

"Run it however you like" basically means you get more entry points for *running* workflows.
Building the workflow itself is still mostly done in the node UI.

From there, you can run it repeatedly while tweaking parameters like the seed or text, or switching between whole workflows.
