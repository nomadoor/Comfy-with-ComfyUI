---
layout: page.njk
lang: zh
section: faq
slug: error-handling
navId: error-handling
title: "遇到错误时该怎么办"
summary: "遇到错误时的检查清单"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---
## 遇到错误时该怎么办

启动 ComfyUI 后…… 或执行处理后…… 出现错误画面，这是家常便饭。
不要惊慌，首先掌握“应该看哪里”。

基本上，错误会在以下 2 个地方显示相同的内容。

- ComfyUI 的画面上（红色的错误窗口）
- 启动的终端窗口（文本日志）

画面上的错误窗口按下 Close 就会消失，但内容会原样保留在终端侧。
即使慌忙关掉了，之后滚动终端也能确认相同的错误文。

---

## 看错误文的哪里

运行时错误首先应该看的是错误文的最初 2 行。

- `Error occurred when executing KSampler:`  
  → 在哪个节点发生了错误
- `mat1 and mat2 shapes cannot be multiplied (154x2048 and 768x320)`  
  → 因什么原因失败（shape / channel / dtype 等）

搜索这 2 行，大抵就能找到原因。

---

## 错误的调查方法

- **Google 搜索**
  - 直接粘贴错误文，经常能搜到海外论坛或 GitHub issue。

- **问 ChatGPT 或 Gemini**
  - 最近它们相当聪明，大概率能回答。但是，因为 ComfyUI 相关的信息变化频繁，请不要绝对信任。
  - 如果出现“安装 Python 库吧”“删掉这个重装吧”之类的建议，请先暂停一下。
  - 拙劣地照做的话，反而可能会破坏环境。

- **搜索相关 GitHub 仓库的 issue**
  - 确认 ComfyUI 本体、各个自定义节点的 repo 中是否有相同的错误。
  - 将搜索栏最初自带的 `is:open` 删掉，包含已解决的 issue 一起搜，命中率会提高。

- **尽管如此还是不明白的话，就在某处提问**
  - 请试着在 Twitter / X、reddit 等地方提问。
  - 我参与的 work4ai 社区也有棉花糖（提问箱），如果想匿名提问的话投到这里也没问题。
    - [棉花糖/work4ai](https://marshmallow-qa.com/gbyrz1zwnewy7gj?t=2ACPWh&utm_medium=url_text&utm_source=promotion)
  - 那样的时候，“在哪个节点”“是什么样的错误文”这 2 点也很重要。

---

## 最终手段：在写 issue 之前

如果怎么都无法解决，就只能在 ComfyUI 本体或自定义节点的 GitHub 上提 issue 了。

但是，除了确信真的是 bug 的情况以外，请极力避免发帖。
因为真正必须修复的问题会被埋没。

首先请按照本页面的步骤，自己试着区分原因。
