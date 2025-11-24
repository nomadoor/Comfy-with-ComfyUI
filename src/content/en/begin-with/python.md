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

There are many programming languages in the world, but ComfyUI runs on a language called **Python**.

You don't need to be able to program in Python at all to master ComfyUI.
However, if you know a few terms, you might get the motivation to fight the errors you will face from now on.

---

## Version

It feels a bit strange that a "language" has a version, but just as words that didn't exist in the Showa era are born in the Reiwa era, Python also adds new functions and improvements with every update.

Basically, it is designed to maintain backward compatibility (making old code work), but some programs stop working when the version goes up.

* **Recommended Version**
  - Currently, the latest version of Python is progressing rapidly, but the range where ComfyUI operates stably is `3.10` to `3.13`.

## Library

It's strange to compare it with ComfyUI, but a "Library" is like a **Custom Node**.
It is an "extension part" to add functions that are not in Python itself or to make complex processing easier to write.

Although it is convenient, if a library depends on another library or if the version does not match Python itself, it may cause a state like **"It broke even though I didn't do anything"**.
In fact, most of the errors encountered in ComfyUI are caused by libraries.

## pip install

This is the command to install that "library".

```bash
pip install <library>
```

For example, if you type as above, it downloads the library from the Internet and installs it.


## Virtual Environment

Libraries are Python's strength, but also a factor that easily causes errors.
The more you put in, the more convenient it becomes, but the dependency becomes complicated and the possibility of causing errors increases.

That's where **"Virtual Environment"** comes in.

If you install libraries without doing anything, it will affect all Python programs on your PC, but by managing them in "dedicated rooms" for each software, you can prevent complicated dependencies.
`venv`, which appears often, is one of the functions to create this virtual environment.


## Portable Version

The portable version of ComfyUI is a bit special.
If you look into the `ComfyUI_windows_portable` folder, there is a folder called `python_embeded`.

* **Manual Installation (venv):** Install Python on the PC and create a virtual environment (room) inside it.
* **Portable Version:** Contains Python itself inside the folder.

It's a structure like "bringing the whole house".
Therefore, it works even if Python is not installed on the PC itself, and if you put it in a USB memory and start it on another PC, you can run it as it is.


### 🚨 Caution

Even if we say "works anywhere", there are limits.

- 1.  **OS Wall:** The portable version for Windows does not work on Linux or Mac.
- 2.  **Hardware Wall:** ComfyUI configured for CUDA (NVIDIA) does not work on a PC without an NVIDIA GPU.
- 3.  **Environment Dependency Wall:** Specific libraries such as `xformers` and `FlashAttention` strongly depend on drivers, hardware configuration, and paths, so they often do not work when taken to another PC.

Let's take it at the level of "It works if the basic hardware configuration and OS are the same".
