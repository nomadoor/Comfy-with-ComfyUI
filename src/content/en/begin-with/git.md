---
layout: page.njk
lang: en
section: begin-with
slug: git
navId: git
title: "Git"
summary: ""
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/4bb24e5d24ae91a7e0f1f5143c2e5ee5.png"
---

## What is Git?

In a nutshell, it's like a **game save function**.
It provides functions to proceed with development comfortably so that you don't have to start over from the beginning if you fail.

- **Commit**
  - It is a function like a "save point" in an action game.
  - If you save (commit) at a timing you like, even if the program breaks in the work ahead, you can rewind time to that place where it was definitely working and start over.

- **Branch**
  - It is a function to create a "branch route" or "parallel world" of the game.
  - You can safely try new functions in the copied world (branch) without affecting the main file.
  - Unlike games, you can integrate (merge) only the changes (diffs) that went well in the branch into the main world later.


## What is GitHub?

![](https://i.gyazo.com/aa0bd187bca975346df5582992735910.png){gyazo=image}

It is a **"huge warehouse (cloud storage)"** to put data saved with Git.

Developers around the world upload and publish their programs (such as ComfyUI custom nodes) here.
Generally, the act of "installing a custom node" refers to "copying files from this warehouse called GitHub to your PC".

Also, GitHub has an aspect like SNS.
It is also a place for developers and users to communicate by reporting bugs (Issue) or requesting new features.

---

## Commands you should remember at minimum

- **git clone**
  - Basically, it is okay to understand it as "a function to download the program on GitHub entirely to your PC".
  - However, unlike simply downloading a Zip file, it is important to bring a copy to hand **while maintaining the connection with the repository**. Thanks to this "connection", the next `pull` becomes possible.

- **git pull**
  - Even after `git clone`, developers continue to improve software and add functions, so the program in your environment gradually becomes old.
  - When you execute `git pull`, it compares the latest state on GitHub with the contents of your PC and **downloads and updates only the changed parts**.
  - You can think of it as a substantial "update" command.

---

## The True Identity of ComfyUI Manager
The frequently used **ComfyUI Manager** is a tool that automatically acts as an agent for this `git clone` and `git pull` in the background.

- **Install:** `git clone` is running in the background.
  - (At the same time, it also performs `pip install` etc. and prepares necessary libraries)
- **Update:** `git pull` is running in the background.
