---
layout: page.njk
lang: zh
section: begin-with
slug: path
navId: path
title: "路径"
created: 2026-02-06
updated: 2026-03-02
summary: "表示文件位置的路径基础"
seoTitle: "什么是路径？绝对路径与相对路径的区别"
seoDescription: "在 ComfyUI 设置和报错信息中经常出现的“路径”基础。讲解作为文件地址的路径、绝对路径与相对路径的区别，以及 Windows 与 Mac/Linux 分隔符的不同。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 什么是路径 (Path)？

电脑里的文件夹和文件，都有一个类似现实世界中“地址”的东西。这个地址就叫做 **“路径 (Path)”**。

比如给软件下指令时，如果只说“把那张照片拿来～”，电脑只会反问：“到底是哪张啊！”
所以需要把位置和名称说清楚，比如“把‘动物’文件夹里那张叫‘长颈鹿.jpeg’的照片拿来”。

按照“指定位置的方式”，路径大致可以分为两类：绝对路径和相对路径。

### 示例：文件夹结构
下面假设有这样一个文件夹结构来说明。

```text
📂C:/
 └── 📂Users/
      └── 📂Yamada/
           └── 📂Photos/
                ├── cat.jpg  <-- 本次的目标
                └── 📂Animals/
                     └── dog.jpg
```

---

## 绝对路径

从 C 盘这样的最顶层（根，Root）开始，把到目标文件的路线完整写出来的方法。

例：指定 cat.jpg 的位置时

```
C:\Users\Yamada\Photos\cat.jpg
```

特点：非常明确、好懂；但如果整个文件夹被移动，或者把数据带到别的电脑上，导致 cat.jpg 的“地址”变了，就必须重新改写，否则没法用。

---

## 相对路径

只写出从“当前所在位置（当前目录）”到目标文件这一段路线的方法。

例 1：在 Yamada 文件夹中指定 cat.jpg 时

```
Photos\cat.jpg
```

例 2：使用返回上一层的符号 `..`
比如在 Animals 文件夹中要指定 cat.jpg，就要“先返回上一层（Photos）再指定”。

```
..\cat.jpg
```

---

## Windows 与 Mac/Linux 的区别（分隔符）
用来分隔路径层级的字符（分隔符）因操作系统而异。

- Windows: `¥` 或 `\` (反斜杠)

  - ※根据环境不同，它可能显示为日元符号（¥），也可能显示为反斜杠（\），但实际上是同一个字符。

- Mac / Linux: `/` (斜杠)
