---
layout: page.njk
lang: zh
section: begin-with
slug: component-gallery
navId: component-gallery
title: "组件画廊"
summary: "总结在 Markdown 使用的基本部件的外观的验证页面。"
tags:
  - component-gallery
  - begin-with
  - docs
  - design
  - ja
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
---

## 表格

| 步骤 | 内容 | 备忘 |
| ---- | ---- | ---- |
| 01 | 用 Gyazo 拍静止画 or 视频。 | 遵守 720px 宽的上限。 |
| 02 | 引入 docs。 | 务必通过 `imageVariant` 过滤器。 |
| 03 | 贴在 Markdown。 | 写 `alt` 文本确保可访问性。 |

## 代码块

```ts
type Workflow = {
  id: string;
  title: string;
  tags: string[];
};

export function format(workflow: Workflow) {
  return `[${workflow.tags.join(", ")}] ${workflow.title}`;
}
```

行内 `code` 也是同样的色调，收纳在容易读的胶囊形状。

## 引用

> “Small, clear, safe steps.” 文章的总结也通过每 1 步说明控制读者的视线。

## 嵌套的列表

- 收集输入
  - Gyazo 截图
    - 确认 alt
  - Workflow JSON
- 总结工作流
  - 写目的
  - 确认 Download / Copy 动作

## Gyazo 图像

![Conditioning reference](https://i.gyazo.com/075ff7bc7a36635d40662b163b5a9cfe.jpg){gyazo=image}

## 让图像横向排列

用`.article-media-row`包围尺寸不同的图像，会根据幅度自动整列。

![](https://i.gyazo.com/f805391f1a7ae6b253440cf16168a763.jpg){gyazo=image} ![毛茸茸角色](https://i.gyazo.com/075ff7bc7a36635d40662b163b5a9cfe.jpg){gyazo=image}

## Gyazo 视频（循环）

![想以循环播放确认的情况在这里。](https://gyazo.com/d32149b1fc31363100fbc9f009b41add){gyazo=loop}

## Gyazo 视频（播放器）

![在 Gyazo 官方播放器操作播放・停止・搜索。](https://gyazo.com/d32149b1fc31363100fbc9f009b41add){gyazo=player}

`gyazoVideoLoop` 是自动播放 + 循环前提，`gyazoVideoPlayer` 原样嵌入 Gyazo 的播放器 UI 和搜索栏。

## 表格 + 代码的组合

| 令牌 | 值 | 用途 |
| ----- | --- | ---- |
| `--color-panel` | `#111111` | 记事内的容器。 |
| `--color-panel-alt` | `#1a1a1a` | 表格或代码的背景。 |

```bash
uvx playwright test component-gallery.spec.ts --headed
```
