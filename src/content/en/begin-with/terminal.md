---
layout: page.njk
lang: en
section: begin-with
slug: terminal
navId: terminal
title: "Terminal"
summary: ""
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/f763b3b332d7854c0200b3d0690b7c7f.png"
---

## What is a Terminal?

**It's "that thing hackers use in movies".**

Unlike the screen operated with a mouse (GUI) that you usually use, the terminal (CLI) operates the computer by **typing commands (text)**.
It may be unfamiliar and intimidating for non-engineers, but if you actually try it, it's surprisingly not a big deal.

## Basic Structure of CLI

![](https://i.gyazo.com/90e4cdeaf87656d9d3b324cafc9b31eb.png){gyazo=image}

* **Prompt**
    * The `PS D:\something` part.
    * It indicates "current folder (location)". (User name etc. on Mac)
* **Command**
    * Enter the operation you want the computer to do.
    * Example: `cd` (change directory) / `ls` (list files)
* **Argument (Option)**
    * Additional parameters to finely control the command behavior.
    * Example: `ls -l`
* **Path**
    * -> [Path](/en/begin-with/path/)


---

## [Windows] PowerShell

### How to open PowerShell
- 1.  `Win key` + `R` -> Type `powershell` -> `OK`
- 2.  Or, open the folder you want to operate in Explorer -> Right click on blank space -> `Open in Terminal`

### Commands you should remember at minimum

* `cd <path>`
    * Move folders.
    ![](https://gyazo.com/aae05ca5c1531996bf5781960e260f46){gyazo=loop}
* `dir`
    * Displays a list of folders and files in the current folder.
* `mkdir <folder name>`
    * Creates a new folder.
* `.\<file name>`
    * Runs an executable file in the current folder.
    ![](https://gyazo.com/855ce160b4ec55a5e6f93198f7efd39c){gyazo=loop}
* `rm <file name>`
    * Deletes a file.

---

## [Linux / macOS]

### How to open Terminal
* **macOS:** `Command` + `Space` (Spotlight search) -> Type `Terminal` -> `Enter`
* **Linux:** `Ctrl` + `Alt` + `T` (Common in many distributions)

### Basic Commands
There are many parts common with Windows (PowerShell), but there are also subtle differences.

* `cd <path>`
    * Move folders.
* `ls`
    * Displays a list of files in the current folder.
* `mkdir <folder name>`
    * Creates a folder.
* `rm <file name>`
    * Deletes a file.
    * **Caution:** If you delete it in the terminal, it does not go to the "Trash" and disappears immediately, so it cannot be restored. Be careful!
* `./<executable file name>`
    * Executes a script etc. in the current folder. Pay attention to the direction of the slash `/`.
* `open .` (macOS only)
    * Opens the location currently open in the terminal with Finder (window). It is the strongest command when you wonder "Where am I?" or want to check files with GUI.
    * *In Linux, `xdg-open .` corresponds to this.

### Supplement: sudo
In Linux/Mac, when making important changes related to the system, you may be asked for "administrator privileges".
In that case, add `sudo` to the beginning of the command (Example: `sudo rm ...`).

* **Important:** You will be asked for a password, but **nothing is displayed on the screen even if you type on the keyboard**.
* It's not broken, so trust it, enter the password, and press Enter.
