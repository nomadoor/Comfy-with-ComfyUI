---
layout: page.njk
lang: zh
section: begin-with
slug: downloading-and-placing-models
navId: downloading-and-placing-models
title: "模型的下载与放置"
created: 2026-02-06
updated: 2026-03-02
summary: "关于模型的下载与放置"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## 模型的发布场所

模型（有时也称为权重）基本上发布在以下两个地方。只要学会使用这两个地方，就不会有什么困扰了。

### [Huggingface](https://huggingface.co/models)
- 类似于生成式 AI 界的 GitHub，主要是研究者在这里发布模型。

### [Civitai](https://civitai.com/)
- 这里是分享社区微调（Fine-tuning）模型的最古老、也是最受欢迎的地方之一。
- Huggingface 上有除图像生成模型以外的各类模型，而 Civitai 则是专为图像生成模型打造的网站，因此具有筛选功能等，更容易查找模型。（虽然界面稍微有点乱……）
- 此外，这里的 NSFW 模型相当多。这既是优点也是一大弱点，近期各方面的限制也正在变得越来越严格。

---

## 从 HuggingFace 下载

让我们试着下载 Stable Diffusion 1.5。

![](https://gyazo.com/b274b58909cf22061a2506ab7b43bf61){gyazo=loop}

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

让我们试着下载作为 Stable Diffusion 1.5 微调模型曾风靡一时的 epiCRealism。

![](https://i.gyazo.com/7bcde1665657f544a1191c760248dd80.png){gyazo=image}

- 1.  首先，打开 [epiCRealism](https://civitai.com/models/25694/epicrealism) 的页面。
- 2.  点击画面右侧蓝色的 **Download** 按钮。
- 3.  下载开始。

※ 也有一些不登录就无法下载的模型（如 NSFW 等）。

---

## 模型的放置位置

下载的模型文件，根据种类不同，放置的位置也是固定的。

如果不了解图像生成的机制可能会觉得有点难，但在本站，所有模型的下载链接都会附带其配置场所，请放心。让我们一点一点找找感觉吧。

```text
📂ComfyUI
└── 📂models
    ├── 📂checkpoints       # ckpt 模型
    ├── 📂loras             # LoRA
    ├── 📂vae               # VAE
    ...
```

即便在启动 ComfyUI 后将模型放入文件夹，ComfyUI 也不会自动识别。

放置文件后，按下键盘上的 `r` 键，或点击 `ComfyUI 图标` → `Edit` → `Refresh Node Definitions`，ComfyUI 就会加载它。

---

## 模型整理术

随着模型越来越多，就会出现“这个是以什么为基础的模型来着？”“那个模型去哪了？”之类的问题。
让我们通过文件夹分类来整理整顿吧。

### 文件夹分类

只要是在合适的文件夹（`checkpoints` 或 `loras` 等）内，创建子文件夹进行整理也是没问题的。
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
这样就可以根据模型的种类或用途进行分类，更易于管理。

### 用自定义节点更方便

如果安装了 **[rgthree-comfy](https://github.com/rgthree/rgthree-comfy)** 这个自定义节点，
它就能在菜单上层级化显示分好类的文件夹结构。

- `ComfyUI 图标` → `⚙Settings` → `rgthree-comfy settings` → `Auto Nest Subdirectories in Menus ✅️`

  ![](https://i.gyazo.com/dccf958c1d05e68e94bcb6bdd680e43c.png){gyazo=image}
