---
layout: page.njk
lang: en
section: begin-with
slug: terminal
navId: terminal
title: "Terminal"
created: 2025-11-24
updated: 2026-03-02
summary: "Terminal basics for controlling your PC with commands"
seoTitle: "Terminal Basics: PowerShell and Linux Commands"
seoDescription: "Terminal (CLI) basics for installing and fixing ComfyUI: open PowerShell on Windows or a terminal on Linux and macOS, and the essential commands."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/begin-with/terminal/legacy_gyazo_f763b3b332d7854c0200b3d0690b7c7f.png"
---

## What is a Terminal?

**It's "that thing hackers use in movies".**

Unlike the mouse-driven screens (GUI) you normally use, a terminal (CLI) lets you **control the computer by typing commands (text)**.
If you're not an engineer, it may feel unfamiliar or intimidating, but once you actually try it, it's surprisingly no big deal.

## Basic Structure of CLI

![](/media/begin-with/terminal/legacy_gyazo_90e4cdeaf87656d9d3b324cafc9b31eb.png){media=image}

* **Prompt**
    * The `PS D:\something` part.
    * It shows the "folder (location) you're currently in." (On a Mac, it shows things like your user name.)
* **Command**
    * Type what you want the computer to do.
    * Example: `cd` (change directory) / `ls` (list files)
* **Argument (Option)**
    * Extra parameters for fine-tuning how the command behaves.
    * Example: `ls -l`
* **Path**
    * -> [Path](/en/begin-with/path/)


---

## [Windows] PowerShell

### How to open PowerShell
- 1.  `Win key` + `R` -> Type `powershell` -> `OK`
- 2.  Or open the folder you want to work in with Explorer -> Right-click an empty area -> `Open in Terminal`

### The bare-minimum commands

* `cd <path>`
    * Moves to another folder.
    ![](/media/begin-with/terminal/legacy_gyazo_aae05ca5c1531996bf5781960e260f46.mp4){media=loop}
* `dir`
    * Displays a list of folders and files in the current folder.
* `mkdir <folder name>`
    * Creates a new folder.
* `.\<file name>`
    * Runs an executable file in the current folder.
    ![](/media/begin-with/terminal/legacy_gyazo_855ce160b4ec55a5e6f93198f7efd39c.mp4){media=loop}
* `rm <file name>`
    * Deletes a file.

---

## [Linux / macOS]

### How to open Terminal
* **macOS:** `Command` + `Space` (Spotlight search) -> Type `Terminal` -> `Enter`
* **Linux:** `Ctrl` + `Alt` + `T` (Common in many distributions)

### Basic Commands
Much of it is the same as Windows (PowerShell), but some commands are slightly different.

* `cd <path>`
    * Moves to another folder.
* `ls`
    * Displays a list of files in the current folder.
* `mkdir <folder name>`
    * Creates a folder.
* `rm <file name>`
    * Deletes a file.
    * **Caution:** Files deleted in the terminal don't go to the "Trash"; they're gone immediately and can't be recovered. Be careful!
* `./<executable file name>`
    * Runs a script or similar file in the current folder. Note which way the slash `/` leans.
* `open .` (macOS only)
    * Opens the terminal's current location in a Finder window. It's the ultimate command when you're wondering "Where am I?" or want to check files in the GUI.
    * *On Linux, the equivalent is `xdg-open .`.

### Supplement: sudo
On Linux/Mac, you may need "administrator privileges" to make important changes to the system.
In that case, put `sudo` at the start of the command (Example: `sudo rm ...`).

* **Important:** You'll be asked for a password, but **nothing shows up on screen as you type**.
* It's not broken, so trust it, type your password, and press Enter.
