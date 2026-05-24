---
layout: page.njk
lang: zh
section: begin-with
slug: multiple-comfyui-instances
navId: multiple-comfyui-instances
title: "多开 ComfyUI"
created: 2026-05-24
updated: 2026-05-24
summary: "多开 ComfyUI 时，需要错开端口号"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

ComfyUI 可以在同一台 PC 上多开。

不过，如果什么都不考虑就启动两次，通常会出现下面这样的错误，第二个实例会启动失败。

```text
Port 8188 is already in use on address 127.0.0.1.   
Please close the other application or use a different port with --port.
```

意思是“这个入口已经被使用了”。那么这到底是怎么回事呢？

---

## ComfyUI 是作为服务器运行的

![](https://gyazo.com/a04e2d09b534afb1e32900a738f0c3a7){gyazo=image}

首先需要知道的是，ComfyUI 分为 **画面** 和 **执行引擎** 两部分。

平时操作的节点画面，是用来编辑工作流、点击运行按钮的 frontend（前端）。
真正生成图像或视频的，是在背后运行的 ComfyUI 服务器。

普通启动 ComfyUI 时，默认会通过下面这个 URL 打开。

```text
http://127.0.0.1:8188
```

`127.0.0.1` 表示“自己的 PC”，后面的 `8188` 是端口号。

这个端口号就是通向 ComfyUI 服务器的入口。

---

## 直接启动两个时，端口会冲突

当第一个 ComfyUI 正在使用 `127.0.0.1:8188` 时，如果再启动第二个 ComfyUI，默认情况下它也会使用同一个 `127.0.0.1:8188`，于是入口就冲突了。

同一个端口号不能同时被两个服务器使用，所以第二个 ComfyUI 会启动失败。

---

## 用 `--port` 错开入口

ComfyUI 有一个可以在启动时指定端口号的 [命令行参数](/zh/begin-with/command-line-arguments/)：`--port`。

下面试着把第二个 ComfyUI 的端口号错开，用 `8189` 启动。

像这样指定即可。

```bash
python main.py --port 8189
```

如果使用的是便携版，可以编辑启动用的 `.bat` 文件，在 `main.py` 后面追加 `--port 8189`。

这样就会得到两个入口。

```text
http://127.0.0.1:8188
http://127.0.0.1:8189
```

请分别用浏览器打开这两个 URL。
看起来都是同一个 ComfyUI，但它们连接的是不同的服务器。

---

## 多开并不会让 GPU 增加

这样就可以多开了。

不过，ComfyUI 在生成图像时，通常会全力使用 GPU。
即使两个 ComfyUI 同时生成，只要其中一个占用了 GPU，另一个最终也还是要等它处理完。

并不是启动两个实例，生成速度就会变成两倍。

不过，多开仍然有不少用途。

- 分开处理不太使用 GPU 的任务
- 保持日常使用的 ComfyUI 运行，同时启动开发用的 ComfyUI

---

## 同一个 URL 看到的是同一个服务器

这里讲的是启动多个 ComfyUI 服务器的方法。

另一方面，也可以把同一个 URL 用浏览器的其他标签页或其他窗口打开。

![](https://gyazo.com/71d8f5ff0d41e4b1e6790fc2e0a366a2){gyazo=image}

例如，把 `http://127.0.0.1:8188` 在两个浏览器标签页中打开时，就可以从多个画面操作同一个 ComfyUI 服务器。

看起来有点相似，但这是完全不同的操作，需要注意。

- **用多个标签页打开同一个 URL**：从多个画面查看同一个 ComfyUI 服务器
- **打开端口不同的 URL**：查看不同的 ComfyUI 服务器
