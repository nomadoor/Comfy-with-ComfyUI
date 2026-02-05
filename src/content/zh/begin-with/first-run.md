---
layout: page.njk
lang: zh
section: begin-with
slug: first-run
navId: first-run
title: "首次运行"
summary: "关于首次运行与生成"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

细节先放一边，总之让我们先试着生成一张图像吧。

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

稍等片刻，ComfyUI 的画面就会在浏览器中打开。
※ 如果画面没有打开，请尝试在浏览器地址栏输入 `http://127.0.0.1:8188`。

---

## 从模板选择 workflow

![](https://i.gyazo.com/7ffdc91e29dc41127e4101360ceff732.png){gyazo=image}

- 刚启动时，应该会打开模板画面。（如果没有打开，请选择左侧边栏的 `Templates`。）
- 首先，请选择 `Getting Started` → `Image Generation`。
- 此时会显示 `Missing Models` 错误。
  - 这表示运行该 workflow 所需的模型缺失，请先忽略它，点击右上角的 `✕` 关闭窗口。

---

## 模型下载

这个 workflow 是用于运行 **Stable Diffusion 1.5** 模型的。
虽然性能不如最新的模型……或者老实说已经不太实用了，但根本的运行机制是一样的。

让我们先用这个可以说是图像生成 AI 始祖的模型，来学习基础的生成方法吧。

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
  - 仅将模型放入文件夹，ComfyUI 是无法识别的。
  - 按下键盘上的 `r` 键，或点击 `ComfyUI 图标` → `Edit` → `Refresh Node Definitions`，即可让 ComfyUI 识别模型。

---

## 尝试生成

![](https://gyazo.com/57af4e96b7f6b2280aeed28afe3bb121){gyazo=loop}

- 点击屏幕上方的 **`▷ Run`** 按钮，生成就会开始。
- 如果 `Save Image` 节点显示了图像，即表示成功。
- `Save Image` 节点顾名思义，是用于保存输入图像的节点。生成的图像保存在以下文件夹中。
```text
📂ComfyUI/
  └── 📂output/
      ├── SD1.5_00001_.png
      ...
```

试着修改提示词（`CLIP Text Encode` 节点的文字），或者改变 `seed` 的数值来玩玩看吧。

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
  - 请确认文件夹位置是否正确（它是 `models/checkpoints`）。
  - 文件名更改没有问题，但这种情况下，请重新在节点上选择对应的模型文件。
