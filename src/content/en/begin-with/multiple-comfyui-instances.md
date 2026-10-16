---
layout: page.njk
lang: en
section: begin-with
slug: multiple-comfyui-instances
navId: multiple-comfyui-instances
title: "Run Multiple ComfyUI Instances"
created: 2026-05-24
updated: 2026-05-24
summary: "When running multiple ComfyUI instances, shift the port number"
seoTitle: "Run Multiple ComfyUI Instances with --port"
seoDescription: "Run several ComfyUI instances on one PC: why the second launch fails, how to change the port with --port, and why this does not add more GPU power."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

You can run multiple ComfyUI instances on the same PC.

But if you just launch it twice without thinking, the second one will spit out an error like this and fail.

```text
Port 8188 is already in use on address 127.0.0.1.   
Please close the other application or use a different port with --port.
```

It's saying "that entrance is already in use", but what does that mean?

---

## ComfyUI runs as a server

![](/media/begin-with/multiple-comfyui-instances/legacy_gyazo_a04e2d09b534afb1e32900a738f0c3a7.png){media=image}

First, it helps to know that ComfyUI is split into a **screen** and an **execution engine**.

The node screen you normally use is the frontend for editing workflows and pressing the run button.
The thing actually generating images and videos is the ComfyUI server running behind it.

When you start ComfyUI normally, it opens at this URL by default.

```text
http://127.0.0.1:8188
```

`127.0.0.1` is the address for "your own PC", and `8188` after it is the port number.

This port number is the entrance to the ComfyUI server.

---

## Starting two as-is makes the ports collide

If the first ComfyUI is using `127.0.0.1:8188` and you try to start a second one, the second one also defaults to `127.0.0.1:8188`, so the two entrances collide.

The same port number cannot be used by two servers at the same time, so the second ComfyUI fails to start.

---

## Shift the port with `--port`

ComfyUI has a `--port` [command line argument](/en/begin-with/command-line-arguments/) for specifying the port number at startup.

Let's shift the port number for the second ComfyUI and start it on `8189`.

Specify it like this.

```bash
python main.py --port 8189
```

For the portable version, edit the `.bat` file you use to launch ComfyUI and add `--port 8189` after `main.py`.

Now you have these two URLs.

```text
http://127.0.0.1:8188
http://127.0.0.1:8189
```

Try opening each URL in your browser.
They both look like the same ComfyUI, but each one connects to a different server.

---

## Multiple instances do not give you more GPU

Now you can run multiple instances.

However, while ComfyUI is generating images, it usually uses the GPU at full power.
Even if you generate with two ComfyUI instances at once, if one of them is hogging the GPU, the other still has to wait for that job to finish before it can move on.

Running two doesn't make generation twice as fast.

It's still useful in plenty of ways.

- Separate tasks that do not use much GPU
- Start a ComfyUI for development while your everyday one keeps running

---

## The same URL means the same server

This page has been about running multiple ComfyUI servers.

There's also a little trick of opening the same URL in another browser tab or window.

![](/media/begin-with/multiple-comfyui-instances/legacy_gyazo_71d8f5ff0d41e4b1e6790fc2e0a366a2.png){media=image}

For example, if you open `http://127.0.0.1:8188` in two browser tabs, you can control the same ComfyUI server from multiple screens.

They seem kind of similar, but they're completely different things, so be careful.

- **Opening the same URL in multiple tabs**: You are viewing the same ComfyUI server from multiple screens
- **Opening URLs with different ports**: You are viewing separate ComfyUI servers
