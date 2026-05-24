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
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

You can run multiple ComfyUI instances on the same PC.

However, if you launch it twice without thinking about anything, you will usually get an error like this and the second launch will fail.

```text
Port 8188 is already in use on address 127.0.0.1.   
Please close the other application or use a different port with --port.
```

It means "that port is already being used", but what does that actually mean?

---

## ComfyUI runs as a server

![](https://gyazo.com/a04e2d09b534afb1e32900a738f0c3a7){gyazo=image}

The first thing to know is that ComfyUI is split into a **screen** and an **execution engine**.

The node screen you normally use is the frontend for editing workflows and pressing the run button.
The thing actually generating images and videos is the ComfyUI server running behind it.

When you start ComfyUI normally, it opens at this URL by default.

```text
http://127.0.0.1:8188
```

`127.0.0.1` is the address for "your own PC", and `8188` after it is the port number.

This port number is the endpoint for the ComfyUI server.

---

## Starting two as-is makes the ports collide

If the first ComfyUI is using `127.0.0.1:8188` and you try to start a second one, the second one also uses `127.0.0.1:8188` by default, so the ports collide.

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
Even if two ComfyUI instances generate at the same time, if one process is occupying the GPU, the other has to wait for that work to finish.

Starting two instances does not mean generation speed becomes twice as fast.

Still, there are several useful cases.

- Separate tasks that do not use much GPU
- Keep your everyday ComfyUI running while starting a development ComfyUI

---

## The same URL means the same server

Here we talked about running multiple ComfyUI servers.

On the other hand, there is also a small trick where you open the same URL in another browser tab or another window.

![](https://gyazo.com/71d8f5ff0d41e4b1e6790fc2e0a366a2){gyazo=image}

For example, if you open `http://127.0.0.1:8188` in two browser tabs, you can control the same ComfyUI server from multiple screens.

They feel somewhat similar, but they are completely different operations, so be careful.

- **Opening the same URL in multiple tabs**: You are viewing the same ComfyUI server from multiple screens
- **Opening URLs with different ports**: You are viewing separate ComfyUI servers
