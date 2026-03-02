---
layout: page.njk
lang: en
section: begin-with
slug: path
navId: path
title: "Path"
summary: ""
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## What is a Path?

Folders and files on a computer have something like an "address" in the real world. This address is called a **"Path"**.

For example, when giving instructions to software, if you ask "bring that photo~", the computer will be like "Which one!".
Therefore, it is necessary to clearly convey the location and name, such as "Bring the photo named 'dog.jpeg' in the folder named 'Animals'".

There are two main types of paths depending on "how to specify the location" (absolute path and relative path).

### Example: Folder Structure
First, let's assume there is a folder structure like the following.

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

A method of describing the entire route from the very root (root) such as C drive to the target file.

Example: Specifying the location of cat.jpg

```
C:\Users\Yamada\Photos\cat.jpg
```

Feature: It is very clear and easy to understand, but if you move the folder or take data to another computer and the "address" to cat.jpg changes, you have to rewrite it or it won't work.

---

## Relative Path

A method of describing only the route from "where you are now (current directory)" to the target file.

Example 1: Specifying cat.jpg while the Yamada folder is open

```
Photos\cat.jpg
```

Example 2: Using the symbol `..` to go back one level
For example, to specify cat.jpg while the Animals folder is open, "go back one level (Photos) and then specify".

```
..\cat.jpg
```

---

## Difference between Windows and Mac/Linux (Delimiter)
The character that separates path hierarchies (delimiter) differs depending on the OS.

- Windows: `¥` or `\` (backslash)

  - * Depending on the environment, it may look like a yen symbol or a backslash, but the entity is the same.

- Mac / Linux: `/` (slash)
