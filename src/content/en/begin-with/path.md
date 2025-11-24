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

For example, when giving instructions to software, if you ask "bring that photo", the computer will be like "which one!".
Therefore, it is necessary to clearly convey the location and name, such as "bring the photo named 'giraffe.jpeg' inside the folder named 'Animals'".

Paths are largely divided into two types (Absolute Path and Relative Path) depending on the "method of specifying the location".

### Example: Folder Structure
First, let's explain assuming the following folder structure.

```text
📂C:/
 └── 📂Users/
      └── 📂Yamada/
           └── 📂Photos/
                ├── cat.jpg  <-- Target this time
                └── 📂Animals/
                     └── dog.jpg
```

## Absolute Path

This is a method of describing the entire route from the very root (like C drive) to the target file.

Example: Specifying the location of cat.jpg

```
C:\Users\Yamada\Photos\cat.jpg
```

Feature: It is very clear and easy to understand, but if you move the folder or take the data to another computer and the "address" to cat.jpg changes, you have to rewrite it or it will become unusable.

## Relative Path

This is a method of describing only the route from "where you are now (current directory)" to the target file.

Example 1: Specifying cat.jpg while the Yamada folder is open

```
Photos\cat.jpg
```

Example 2: Using the symbol .. to go back one level
For example, to specify cat.jpg while the Animals folder is open, you "go back one level (to Photos) and then specify".

```
..\cat.jpg
```

## Difference between Windows and Mac/Linux (Delimiter)
The character that separates path hierarchies (delimiter) differs depending on the OS.

- Windows: `¥` or `\` (Backslash)

  - *Depending on the environment, it may look like a Yen mark or a Backslash, but the entity is the same.

- Mac / Linux: `/` (Slash)
