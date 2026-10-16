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

In a nutshell, it's like **saving in a video game**.
It gives you tools to keep development going smoothly, so one mistake doesn't send you all the way back to the start.

- **Commit**
  - Like a "save point" in an action game.
  - Save (commit) whenever you like, and if the program breaks later on, you can rewind to the point where it definitely worked and try again.

- **Branch**
  - Like creating a "branching route" or a "parallel world" in a game.
  - You can safely try new features in a copied world (a branch) without touching the main files.
  - Unlike a game, you can later bring just the changes (diffs) that worked out in the branch back into the main world (merge).

---

## What is GitHub?

![](/media/begin-with/git/legacy_gyazo_aa0bd187bca975346df5582992735910.png){media=image}

It's a **"huge warehouse (cloud storage)"** for the data you save with Git.

Developers all over the world upload and publish their programs (like ComfyUI custom nodes) here.
When people say "install a custom node", they usually mean "copy the files from this warehouse called GitHub to your PC".

GitHub also has a social-media side to it.
It's where developers and users talk to each other: reporting bugs (Issues), requesting new features, and so on.

---

## Minimum Commands to Remember

- **git clone**
  - For the most part, you can think of it as "downloading an entire program from GitHub to your PC".
  - The important difference from just downloading a Zip file is that your local copy **stays connected to the repository**. That "connection" is what makes the next command, `pull`, possible.

- **git pull**
  - After you `git clone`, the developers keep improving the software and adding features, so your copy gradually goes out of date.
  - Running `git pull` compares the latest version on GitHub with what's on your PC and **downloads and updates only the parts that changed**.
  - You can think of it as the "update" command, in practice.

---

## What ComfyUI Manager Really Does
**ComfyUI Manager**, which you'll use a lot, is a tool that runs these `git clone` and `git pull` commands for you behind the scenes.

- **Install:** `git clone` runs in the background.
  - (It also runs things like `pip install` to set up the libraries you need)
- **Update:** `git pull` runs in the background.
