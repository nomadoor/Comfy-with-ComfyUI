---
layout: page.njk
lang: zh
section: notes
slug: error-handling
navId: error-handling
title: "遇到错误时该怎么办"
created: 2026-02-06
updated: 2026-03-02
noteTags: ["troubleshoot", "error"]
summary: "遇到错误时要做的事情清单"
seoTitle: "ComfyUI 出现错误时该做什么"
seoDescription: "ComfyUI 报错时的检查步骤：应该看画面和终端的哪里、错误信息的读法与查法，以及提交 issue 前需要确认的事项。"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: ""
---
## 遇到错误时该怎么办

一启动 ComfyUI……一执行处理……就弹出错误画面，这是家常便饭。
别慌，先记住“该看哪里”就好。

基本上，同样的错误内容会出现在下面 2 个地方。

- ComfyUI 的界面上（红色的错误窗口）
- 启动 ComfyUI 的终端窗口（文本日志）

界面上的错误窗口点了 Close 就会消失，但内容会原样留在终端里。
就算慌忙关掉了，之后在终端里往回翻，也能看到同样的错误信息。

---

## 看错误信息的哪里

遇到运行时错误，首先要看的是错误信息的前 2 行。

- `Error occurred when executing KSampler:`  
  → 错误出在哪个节点
- `mat1 and mat2 shapes cannot be multiplied (154x2048 and 768x320)`  
  → 因为什么原因失败（shape / channel / dtype 等）

搜一下这 2 行，大多能找到原因。

---

## 如何查错误

- **Google 搜索**
  - 直接粘贴错误信息，往往就能搜到海外论坛或 GitHub issue。

- **问 ChatGPT 或 Gemini**
  - 最近它们相当聪明，大概率能给出答案。不过 ComfyUI 相关的信息变化很快，别完全相信它们。
  - 如果它建议“安装某个 Python 库”“把这个删掉重装”，请先停一下。
  - 贸然照做的话，反而可能把环境搞坏。

- **搜索相关 GitHub 仓库的 issue**
  - 在 ComfyUI 本身和各个自定义节点的 repo 里，看看有没有相同的错误。
  - 先把搜索栏里默认带的 `is:open` 删掉，连已解决的 issue 一起搜，更容易找到。

- **还是搞不明白的话，就找个地方提问**
  - 可以在 Twitter / X、reddit 等地方问问看。
  - 我参加的 work4ai 社区也有一个棉花糖（匿名提问箱），想匿名提问的话，投到这里也没问题。
    - [棉花糖/work4ai](https://marshmallow-qa.com/gbyrz1zwnewy7gj?t=2ACPWh&utm_medium=url_text&utm_source=promotion)
  - 提问时，“在哪个节点”“错误信息是什么”这 2 点同样重要。

---

## 最终手段：在写 issue 之前

如果怎么都解决不了，就只能去 ComfyUI 本身或自定义节点的 GitHub 上提 issue 了。

但是，除非确信真的是 bug，否则请尽量不要发。
不然真正需要修复的问题会被淹没。

请先按照本页的步骤，自己排查一下原因。
