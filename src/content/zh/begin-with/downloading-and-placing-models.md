---
layout: page.njk
lang: zh
section: begin-with
slug: downloading-and-placing-models
navId: downloading-and-placing-models
title: "下载与放置模型"
created: 2026-02-06
updated: 2026-03-02
summary: "介绍如何下载和放置模型"
seoTitle: "ComfyUI 模型下载与存放位置"
seoDescription: "介绍从 Hugging Face 和 Civitai 下载模型的步骤、模型应该放在 ComfyUI 的 models 文件夹中的哪里，以及模型多起来之后的整理方法。"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## 模型在哪里发布

模型（有时也叫权重）基本上都发布在下面两个地方。只要会用这两个网站，基本就不会遇到什么困难。

### [Huggingface](https://huggingface.co/models)
- 类似于生成式 AI 界的 GitHub，主要是研究者在这里发布模型。

### [Civitai](https://civitai.com/)
- 这是社区分享微调（Fine-tuning）模型的地方，历史最久，也是最受欢迎的网站之一。
- Huggingface 上除了图像生成模型，还有各种各样的模型；而 Civitai 是专为图像生成模型打造的网站，所以有筛选等方便找模型的功能。（虽然界面有点太乱了……）
- 另外，这里的 NSFW 模型相当多。这既是优点，也是一大弱点，最近来自各方面的管控越来越严格了。

---

## 从 HuggingFace 下载

让我们试着下载 Stable Diffusion 1.5。

![](/media/begin-with/downloading-and-placing-models/legacy_gyazo_b274b58909cf22061a2506ab7b43bf61.mp4){media=loop}

- 1.  首先，打开 [Comfy-Org/stable-diffusion-v1-5-archive](https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive) 页面。
- 2.  点击 `Files and versions` 标签，在文件列表中找到目标模型文件（例: `.safetensors` 或 `.ckpt`）。
- 3.  下载方法有以下 3 种：
    * **直接下载:**
        - 点击文件名旁边的 **↓（下载图标）**。
    * **从详情页下载:**
        - 点击文件名打开详情页，点击那里显示的 `↓ download` 按钮。
    * **使用直链:**
        - 在文件详情页点击 `Copy download link`，即可复制下载用的 URL。
        - 你可以在 `wget` 等工具中使用这个 URL。
            ```bash
            wget https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive/resolve/main/v1-5-pruned-emaonly.safetensors
            ```

---

## 从 Civitai 下载

我们来下载 epiCRealism 试试，它是曾经风靡一时的 Stable Diffusion 1.5 微调模型。

![](/media/begin-with/downloading-and-placing-models/legacy_gyazo_7bcde1665657f544a1191c760248dd80.png){media=image}

- 1.  首先，打开 [epiCRealism](https://civitai.com/models/25694/epicrealism) 的页面。
- 2.  点击画面右侧蓝色的 **Download** 按钮。
- 3.  下载开始。

※ 也有一些不登录就无法下载的模型（如 NSFW 等）。

---

## 模型放在哪里

下载的模型文件，要按照种类放到固定的位置。

如果不了解图像生成的原理，可能会觉得挺难的；不过本站会写明所有模型的下载链接和放置位置，请放心。一点一点找感觉就好。

```text
📂ComfyUI
└── 📂models
    ├── 📂checkpoints       # ckpt 模型
    ├── 📂loras             # LoRA
    ├── 📂vae               # VAE
    ...
```

如果在启动 ComfyUI 之后才把模型放进文件夹，ComfyUI 是识别不到的。

放置文件后，按下键盘上的 `r` 键，或点击 `ComfyUI 图标` → `Edit` → `Refresh Node Definitions`，ComfyUI 就会加载它。

---

## 整理模型的方法

模型多起来以后，就会出现“这个模型是基于什么的来着？”“那个模型跑哪去了？”之类的问题。
用文件夹分类整理一下吧。

### 文件夹分类

只要是在对应的文件夹（`checkpoints` 或 `loras` 等）里，再建子文件夹来整理也没有问题。
ComfyUI 会自动识别子文件夹内的模型。

例如，如果像下面这样整理 `checkpoints` 文件夹：

```text
📂models/checkpoints/
├── 📂SD1.5
│   └── v1-5-pruned.ckpt
├── 📂SDXL
│   └── sd_xl_base_1.0.safetensors
```

在 ComfyUI 的 `Load Checkpoint` 节点等地方，文件名就会像 `SD1.5\v1-5-pruned.ckpt` 这样带着文件夹名显示。
这样就能按模型的种类或用途分类，管理起来更方便。

### 用自定义节点更方便

如果安装了 **[rgthree-comfy](https://github.com/rgthree/rgthree-comfy)** 这个自定义节点，
就能在菜单中按层级显示分好类的文件夹结构。

- `ComfyUI 图标` → `⚙Settings` → `rgthree-comfy settings` → `Auto Nest Subdirectories in Menus ✅️`

  ![](/media/begin-with/downloading-and-placing-models/legacy_gyazo_dccf958c1d05e68e94bcb6bdd680e43c.png){media=image}
