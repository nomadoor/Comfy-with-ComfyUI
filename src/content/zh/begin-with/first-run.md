---
layout: page.njk
lang: zh
section: begin-with
slug: first-run
navId: first-run
title: "首次运行"
created: 2026-02-06
updated: 2026-03-02
summary: "启动 ComfyUI 并生成图像"
seoTitle: "启动 ComfyUI 并生成第一张图"
seoDescription: "启动 ComfyUI 并用官方模板生成第一张图片的步骤。介绍便携版、桌面版和手动安装的启动方法，以及找不到模型时的处理方法。"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

细节先放一边，总之先来生成一张图试试吧。

## 启动

### **便携版**
- 双击安装文件夹中的 `run_nvidia_gpu.bat`。

### **桌面版**
- 从桌面的快捷方式或开始菜单启动。

### **手动安装**
- 执行以下命令：
  ```powershell
  cd path\to\comfyui
  venv\Scripts\activate
  python main.py
  ```

稍等一会儿，浏览器里就会打开 ComfyUI 的界面。
※ 如果界面没有打开，请试着在浏览器地址栏输入 `http://127.0.0.1:8188`。

---

## 从模板选择工作流

![](/media/begin-with/first-run/legacy_gyazo_7ffdc91e29dc41127e4101360ceff732.png){media=image}

- 第一次启动后，应该会打开模板界面。（如果没有打开，请选择左侧边栏的 `Templates`。）
- 首先，请选择 `Getting Started` → `Image Generation`。
- 此时会显示 `Missing Models` 错误。
  - 这表示缺少运行这个工作流所需的模型，不过请先忽略它，点击 `✕` 关闭。

---

## 下载模型

这个工作流是用来运行 **Stable Diffusion 1.5** 这个模型的。
和现在最新的模型相比，它的性能比较一般……说实话其实已经不太能用了，但最根本的原理并没有变。

就用这个可以说是图像生成 AI 鼻祖的模型，来学习基本的图像生成吧。

- 1.  **下载模型**
  - [v1-5-pruned-emaonly-fp16.safetensors (直链)](https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive/resolve/main/v1-5-pruned-emaonly-fp16.safetensors)
  - 点击上方链接开始下载。
  - 请将下载的文件保存到以下文件夹中。
  ```text
  📂ComfyUI/
    └── 📂models/
        └── 📂checkpoints/
            └── v1-5-pruned-emaonly-fp16.safetensors
  ```

- 2.  **刷新**
  - 只是把模型放进去，ComfyUI 还识别不到。
  - 按下键盘上的 `r` 键，或点击 `ComfyUI 图标` → `Edit` → `Refresh Node Definitions`，即可让 ComfyUI 识别模型。

---

## 尝试生成

![](/media/begin-with/first-run/legacy_gyazo_57af4e96b7f6b2280aeed28afe3bb121.mp4){media=loop}

- 点击界面上方的 **`▷ Run`** 按钮，就会开始生成。
- 如果 `Save Image` 节点显示了图像，即表示成功。
- `Save Image` 节点顾名思义，是用于保存输入图像的节点。生成的图像保存在以下文件夹中。
```text
📂ComfyUI/
  └── 📂output/
      ├── SD1.5_00001_.png
      ...
```

试着改改提示词（`CLIP Text Encode` 节点里的文字），或者改改 `seed` 的数值，随便玩玩看吧。

---

## 常见问题

### 找不到模型（Load Checkpoint 变红）
- **症状**
  - `Load Checkpoint` 节点被红框包围，并显示错误。
  - `Value not in list: ckpt_name: 'v1-5-pruned.ckpt' not in []`
- **原因**
  - 指定的模型文件没有放入 `models/checkpoints/` 文件夹。
  - 文件名已被更改。
- **解决方法**
  - 请确认文件夹位置是否正确（应该是 `models/checkpoints`）。
  - 改了文件名也没关系，但这时请重新选择一次模型。
