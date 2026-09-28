---
layout: page.njk
lang: en
section: begin-with
slug: git
navId: git
title: "Git"
created: 2025-11-24
updated: 2026-03-02
summary: "The Git and GitHub basics worth knowing when using ComfyUI"
seoTitle: "Git and GitHub Basics for ComfyUI Users"
seoDescription: "Git and GitHub basics for installing ComfyUI and custom nodes: commits and branches explained with a video-game analogy, key commands, and what ComfyUI Manager does."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/begin-with/git/legacy_gyazo_4bb24e5d24ae91a7e0f1f5143c2e5ee5.png"
---

## What is Git?

In a nutshell, it's like a **game save function**.
It provides functions to proceed with development comfortably so that you don't have to start over from the beginning if you fail.

- **Commit**
  - A function like a "save point" in an action game.
  - If you save (commit) at any timing you like, even if the program breaks in the subsequent work, you can reliably rewind time to that place where it was working and start over.

- **Branch**
  - A function to create "branching routes" or "parallel worlds" in a game.
  - You can safely try new features in a copied world (branch) without affecting the main file.
  - Unlike games, the point is that you can integrate (merge) only the changes (diffs) that went well in the branch into the main world later.

---

## What is GitHub?

![](/media/begin-with/git/legacy_gyazo_aa0bd187bca975346df5582992735910.png){media=image}

It is a **"huge warehouse (cloud storage)"** to keep data saved with Git.

Developers all over the world upload and publish their programs (such as ComfyUI custom nodes) here.
Generally, the act of "installing a custom node" refers to "copying files from this warehouse called GitHub to your PC".

Also, GitHub has an aspect like SNS.
It is also a place for communication between developers and users, such as reporting bugs in programs (Issue) or requesting new features.

---

## Minimum Commands to Remember

- **git clone**
  - Basically, it is okay to understand it as "a function to download the program on GitHub as a whole to your PC".
  - However, unlike simply downloading a Zip file, it is important to bring a copy to your hand **while maintaining the connection with the repository**. Thanks to this "connection", the next `pull` becomes possible.

- **git pull**
  - Even after `git clone`, developers continue to improve software and add features, so the program in your environment gradually becomes old.
  - When you run `git pull`, it compares the latest state on GitHub with the contents of your PC and **downloads and updates only the parts that have changed**.
  - You can consider it practically an "update" command.

---

## The True Identity of ComfyUI Manager
The frequently used **ComfyUI Manager** is a tool that automatically performs these `git clone` and `git pull` in the background.

- **Install:** `git clone` runs in the background.
  - (At the same time, it performs `pip install` etc. and prepares necessary libraries)
- **Update:** `git pull` runs in the background.
