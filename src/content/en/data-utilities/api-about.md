---
layout: page.njk
lang: en
section: data-utilities
slug: api-about
navId: api-about
title: "What is the API?"
summary: "An entry point to control ComfyUI from outside"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## Structure of ComfyUI

ComfyUI is actually divided into "two parts".

### Server (ComfyUI Core)

The "engine" side that executes the workflow and generates images, videos, audio, etc.
When you start ComfyUI, this server waits at a URL like `http://127.0.0.1:8188` locally.

### Frontend (User Interface)

The "operation" side that instructs the server to "execute this workflow".
The Web node UI you usually use is just one of these frontends.

---

## API is a "Window to Send Commands to Server"

The frontend and server are not connected arbitrarily.
They are connected by the **API (Application Programming Interface)**.

![](https://gyazo.com/a04e2d09b534afb1e32900a738f0c3a7){gyazo=image}

The Web node UI also sends commands to the server internally via the API.
In other words, the moment you press `▷Run` in the UI, a request saying "execute this workflow" is sent to the server in the background.

---

## API Increases "Ways to Execute"

The most interesting part of the API is that you can **operate the same ComfyUI server from entry points other than the browser**.

For example, you can do the following:

- Run workflows from commands (CLI) or scripts
- Create and execute a small custom UI (e.g., a screen with only forms)
- Replace only the seed or text and execute continuously

While the node UI offers high freedom, high freedom can sometimes cause confusion.
Also, when "running the same workflow many times while changing it slightly" like batch processing, running it with a script is sometimes simpler than fiddling with nodes.

The advantage of the API is that you can choose the entry point according to your purpose.

---

## Notes

### Server Must Be Running

The API is not a mechanism that "eliminates the need to start ComfyUI".

Since the server side executes the generation, the server must be started and waiting.

### Mainly for Automating "Execution"

Even if we say "you can execute in any way you like", it basically means that the entry points for "execution" increase.
The construction of the workflow itself is basically done in the node UI.

On top of that, imagine that you can continuously execute by changing parameters like seed and text little by little, or switching the workflow itself.
