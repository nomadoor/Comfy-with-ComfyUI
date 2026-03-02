---
layout: page.njk
lang: en
section: begin-with
slug: python
navId: python
title: "Python"
summary: ""
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## About Python

There are numerous programming languages in the world, but ComfyUI runs on a language called **Python**.

You don't need to be able to program in Python at all to master ComfyUI.
However, knowing a few terms might give you the energy to fight the errors you will face from now on.

---

## Version

It feels a bit strange that a "language" has a version, but just as words that didn't exist in the Showa era are born in the Reiwa era, Python adds new features and improvements with every update.

Basically, it is designed to maintain backward compatibility (making old code work), but some programs stop working when the version goes up.

* **Recommended Version**
  - Currently, the latest version of Python is advancing rapidly, but ComfyUI runs stably in the range of `3.10` to `3.13`.

---

## Library

It's strange to compare it in ComfyUI, but a "library" is like a **Custom Node**.
It is an "expansion part" to add functions not in Python itself or to make complex processing easy to write.

Although convenient, if a library depends on another library or does not match the version of Python itself, it may cause a state like **"I didn't do anything but it broke"**.
In fact, most errors encountered in ComfyUI are caused by libraries.

---

## pip install

This is the command to install that "library".

```bash
pip install <library>
```

For example, typing as above downloads and installs the library from the internet.

---

## Virtual Environment

Libraries are Python's strength and at the same time can be a cause of errors.
The more you put in, the more convenient it becomes, but the dependency relationship becomes complicated, and the possibility of causing errors increases.

That's where **"Virtual Environment"** comes in.

If you install libraries without doing anything, it will affect all Python programs on your PC, but by managing them in "dedicated rooms" for each software, you can prevent complex dependency relationships.
The frequently appearing `venv` is one of the functions to create this virtual environment.

---

## Portable Version

The portable version of ComfyUI is a bit special.
If you look into the `ComfyUI_windows_portable` folder, there is a folder called `python_embeded`.

* **Manual Install (venv):** Install Python on the PC and create a virtual environment (room) in it.
* **Portable Version:** Built-in Python itself in the folder.

It's a structure like "bringing the whole house".
Therefore, it works even if Python is not installed on the PC itself, and if you put it on a USB memory and start it on another PC, you can run it as is.


### 🚨 Caution

Even if it says "works anywhere," there are limits.

- 1. **OS Barrier:** The portable version for Windows does not work on Linux or Mac.
- 2. **Hardware Barrier:** ComfyUI configured for CUDA (NVIDIA) does not work on PCs without NVIDIA GPUs.
- 3. **Environment Dependency Barrier:** Specific libraries such as `xformers` and `FlashAttention` strongly depend on drivers, hardware configurations, and paths, so they often do not work when taken to another PC.

Let's just understand it at the level of "It works if the basic hardware configuration and OS are the same".
