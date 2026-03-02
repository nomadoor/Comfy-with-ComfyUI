---
layout: page.njk
lang: zh
section: begin-with
slug: terminal
navId: terminal
title: "终端"
summary: "关于终端 (CLI) 的基础知识"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/f763b3b332d7854c0200b3d0690b7c7f.png"
---

## 什么是终端？

**就是“电影里黑客在敲的那个东西”。**

终端 (CLI: Command Line Interface) 与我们平时用鼠标操作的画面 (GUI: Graphical User Interface) 不同，它是通过**输入命令（文字）来操作计算机**的。
对于非程序员来说，这可能很难产生亲近感，甚至会觉得有点难搞，但实际试过之后会发现意外地并不可怕。

## CLI 的基本结构

![](https://i.gyazo.com/90e4cdeaf87656d9d3b324cafc9b31eb.png){gyazo=image}

* **提示符 (Prompt)**
    * `PS D:\某种路径` 的部分。
    * 表示“当前所在的文件夹（位置）”。（Mac 上可能是用户名等）
* **命令 (Command)**
    * 输入想要计算机执行的操作。
    * 例：`cd` (移动文件夹) / `ls` (显示文件列表)
* **参数 / 选项 (Arguments / Options)**
    * 用于精细控制命令动作的附加参数。
    * 例：`ls -l`
* **路径 (Path)**
    * → [路径](/zh/begin-with/path/)

---

## 【Windows 篇】PowerShell

### 打开 PowerShell 的方法
- 1.  `Win 键` + `R` → 输入 `powershell` → `确定`
- 2.  或者，在资源管理器中打开想要操作的文件夹 → 在空白处点击右键 → `在终端中打开`

### 至少要记住的命令

* `cd <路径>`
    * 移动文件夹。
    ![](https://gyazo.com/aae05ca5c1531996bf5781960e260f46){gyazo=loop}
* `dir`
    * 显示当前文件夹内的文件夹和文件列表。
* `mkdir <文件夹名>`
    * 创建新文件夹。
* `.\<文件名>`
    * 运行当前文件夹中的可执行文件。
    ![](https://gyazo.com/855ce160b4ec55a5e6f93198f7efd39c){gyazo=loop}
* `rm <文件名>`
    * 删除文件。

---

## 【Linux / macOS 篇】

### 打开终端的方法
* **macOS:** `Command` + `Space` (Spotlight 搜索) → 输入 `Terminal` → `Enter`
* **Linux:** `Ctrl` + `Alt` + `T` (在许多发行版中通用)

### 基本命令
虽然与 Windows (PowerShell) 有很多共通之处，但也有微妙的差异。

* `cd <路径>`
    * 移动文件夹。
* `ls`
    * 显示当前文件夹内的文件列表。
* `mkdir <文件夹名>`
    * 创建文件夹。
* `rm <文件名>`
    * 删除文件。
    * **注意:** 在终端中删除文件不会进入“回收站”，而是直接消失，无法恢复。请务必小心！
* `./<可执行文件名>`
    * 运行当前文件夹中的脚本等。请注意斜杠 `/` 的方向。
* `open .` (仅 macOS)
    * 在 Finder（窗口）中打开当前终端所在的位置。当你想知道“这是哪儿？”或者想用 GUI 确认文件时，这是最强的命令。
    * ※在 Linux 中，对应的命令是 `xdg-open .`。

### 补充：sudo
在 Linux/Mac 中，当进行涉及系统的这一类重要更改时，有时会被要求提供“管理员权限”。
此时需要在命令的开头加上 `sudo`（例：`sudo rm ...`）。

* **重要:** 此时会要求输入密码，**但即便敲击键盘，屏幕上也不会显示任何字符**。
* 这不是坏了，请相信自己，输入密码并按下 Enter 键。
