---
layout: page.njk
lang: en
section: begin-with
slug: python
navId: python
title: "Python"
created: 2025-11-24
updated: 2026-08-01
summary: "The Python basics behind ComfyUI"
seoTitle: "Python Basics for ComfyUI Users"
seoDescription: "The Python terms you need for ComfyUI errors: versions, libraries, pip install, virtual environments, and the portable build's embedded Python."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## About Python

There are countless programming languages out there, and ComfyUI runs on one called **Python**.

You don't need to be able to program in Python at all to get good at ComfyUI.
But knowing a few terms might give you the will to fight the errors you're going to run into.

---

## Version

It may seem strange for a language to have versions, but spoken languages also gain new words and expressions over time. Likewise, Python adds new features and improvements with each update.

It's generally designed to stay backward compatible (so old code keeps working), but some programs do stop working when the version goes up.

* **Recommended Version**
  - The latest Python keeps moving forward, but ComfyUI runs reliably on `3.10` to `3.13`.

---

## Library

It's a bit odd to explain it with ComfyUI, but a "library" is something like a **custom node**.
It's an "add-on part" that adds features Python itself doesn't have, or makes complex processing easy to write.

They're handy, but when a library depends on other libraries, or doesn't match the version of Python itself, you can end up with the classic **"I didn't touch anything and it broke"**.
In fact, most of the errors you'll hit in ComfyUI come from libraries.

---

## pip install

This is the command for installing those "libraries".

```bash
pip install <library>
```

Type something like the above, and it downloads the library from the internet and installs it.

---

## Virtual Environment

As we saw, libraries are Python's strength, but also a common cause of errors.
The more you install, the more you can do, but the dependencies get more tangled and errors become more likely.

That's where **"virtual environments"** come in.

If you just install libraries as is, they affect every Python program on your PC. Keeping each piece of software in its own "private room" stops the dependencies from getting tangled.
The `venv` you'll see a lot is one tool for creating these virtual environments.

---

## Portable Version

The portable version of ComfyUI is a bit special.
Take a look inside the `ComfyUI_windows_portable` folder and you'll find a folder called `python_embeded`.

* **Manual Install (venv):** Python is installed on the PC, and a virtual environment (room) is created inside it.
* **Portable Version:** Python itself is bundled inside the folder.

You could say it "brings the whole house along".
So it runs even if Python isn't installed on the PC, and if you copy it to a USB stick and launch it on another PC, it runs as is.


### 🚨 Caution

"Runs anywhere" still has its limits.

- 1. **OS Barrier:** The portable version for Windows does not work on Linux or Mac.
- 2. **Hardware Barrier:** ComfyUI configured for CUDA (NVIDIA) does not work on PCs without NVIDIA GPUs.
- 3. **Environment Barrier:** Certain libraries such as `xformers` and `FlashAttention` depend heavily on drivers, hardware setup, and paths, so they often break when moved to another PC.

Think of it as "it works if the basic hardware setup and OS are the same", and no more than that.
