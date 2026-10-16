---
layout: page.njk
lang: en
section: begin-with
slug: path
navId: path
title: "Path"
created: 2025-11-24
updated: 2026-03-02
summary: "File path basics: how paths point to files"
seoTitle: "What Is a File Path? Absolute vs. Relative"
seoDescription: "File path basics for ComfyUI settings and errors: paths as file addresses, absolute vs. relative paths, and Windows vs. Mac/Linux separators."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## What is a Path?

Folders and files on a computer have something like a real-world "address". This address is called a **"path"**.

Say you're giving software instructions and you ask it to "grab that photo~". The computer will go, "Which one?!"
So you have to spell out the location and the name: "Grab the photo called 'giraffe.jpeg' in the folder called 'Animals'."

Paths come in two main types, depending on how they specify the location: absolute paths and relative paths.

### Example: Folder Structure
For the explanation, assume we have this folder structure.

```text
📂C:/
 └── 📂Users/
      └── 📂Yamada/
           └── 📂Photos/
                ├── cat.jpg  <-- Target this time
                └── 📂Animals/
                     └── dog.jpg
```

---

## Absolute Path

This writes out the whole route to the file, starting from the very top (the root), such as the C drive.

Example: Specifying the location of cat.jpg

```
C:\Users\Yamada\Photos\cat.jpg
```

Characteristics: It's very clear and easy to follow, but if you move the folder or take the data to another computer and the "address" of cat.jpg changes, it stops working until you rewrite it.

---

## Relative Path

This writes only the route from "where you are now" (the current directory) to the file.

Example 1: Specifying cat.jpg while the Yamada folder is open

```
Photos\cat.jpg
```

Example 2: Using the symbol `..` to go back one level
For example, to point to cat.jpg while the Animals folder is open, you "go up one level (to Photos) first, then point to it".

```
..\cat.jpg
```

---

## Windows vs. Mac/Linux (Separators)
The character that separates the levels of a path (the separator) differs by OS.

- Windows: `¥` or `\` (backslash)

  - * Depending on your system it may show up as a yen sign or a backslash, but it's the same character.

- Mac / Linux: `/` (slash)
