---
layout: page.njk
lang: zh
section: notes
slug: kura-krea2-lora-training
navId: kura-krea2-lora-training
title: "用 Kura 训练 Krea 2 LoRA"
created: 2026-07-13
updated: 2026-07-14
noteTags: ["project", "lora", "krea-2", "kura"]
summary: "使用 Kura 和 AI 智能体训练、比较 Krea 2 角色 LoRA 的完整流程"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/bd00a496f18c5ecb9925dd7f790ffc7d.png"
---

## Kura 是什么？

无论使用什么基础模型、训练什么任务，LoRA 训练的基本流程都一样：制作数据集，确定学习率和 rank 等参数，再交给训练软件处理。

听上去很简单，但实际操作中主要有两个难点。

- **每种训练软件的用法都不一样**
  - 不同模型会使用 AI Toolkit、Musubi Tuner 等不同的训练软件
  - 环境搭建、配置写法、运行方式以及权重的保存位置也各不相同
- **不知道什么参数最合适**
  - 所需图片数量、学习率、rank 和 step 数会随模型和任务变化
  - 如果显存不够，还要判断应该缩减哪些设置

为了解决这两个问题，我制作了供 AI 智能体使用的 [Kura](https://github.com/nomadoor/Kura)。

Kura 主要由三个部分组成：

- 负责搭建环境，并可靠完成从训练到回收权重整个流程的 **CLI**
- 保存以往实验的**文件**
- 让 AI 根据模型知识和以往实验来考虑参数的 **Skill**

现在的 AI 智能体应该也能从零搭建环境并完成训练。但每次都从头开始会浪费 token，更重要的是，它没有积累过去实验经验的机制。

Kura 是一套为 LoRA 训练准备好快捷方式的工具框架，让人可以把注意力放在数据集和参数调整上。

下面就以 Krea 2 为基础模型，训练一个角色 LoRA。

---

## 准备数据集

### 收集图片

在 LoRA 训练中，比起参数，数据集的质量更加重要。

请收集能够清楚展示训练对象的图片。尽量不要全部使用同一种构图，最好让姿势、角度和背景有一定变化。

这次要制作的是原创角色 LoRA，但手头只有几张自己画的图片。

![用图像编辑模型增加图片变化](https://gyazo.com/2159c09bf30ffc9230b93e72a9b933f9){gyazo=image}

遇到这种情况，也可以使用 Nano Banana 或 ChatGPT Images 2.0 增加图片变化。

对于真人照片，这种做法可能会降低质量；但如果是特征清晰的角色，通常会很有效。

### 制作 caption

Caption 是说明图片中有什么内容的文字。

应该写入哪些内容，取决于你希望 LoRA 学会什么。并不是写得越详细越好。

下面以 Vivi 为例，看看**角色 LoRA** 的 caption 应该怎样编写。

![在沙发上休息的 Vivi](https://gyazo.com/d74af5465c466791239a29516fa341c4){gyazo=image}

这张图片包含多种要素：

- 角色特有的发型、面部和服装
- 姿势
- 背景和家具
- 插画风格

制作角色 LoRA 时，要从 caption 中排除描述角色本身的要素，只写其他内容。

首先，把图片中出现的所有要素列出来：

```text
1girl, solo, reclining, couch, holding mug, pink hair, gradient hair, headphones, sweater, scarf, orange pants, purple boots, indoors, living room, pillow, blanket, floor lamp, window, cityscape, coffee table, books, potted plant
```

然后**删除**描述 Vivi 发型、面部和服装等角色本身的词语：

```text
reclining, couch, indoors, living room, pillow, blanket, floor lamp, window, cityscape, coffee table, books, potted plant
```

最后，在开头加上用于调用这个角色的触发词（本例中为 `Vivi`），caption 就完成了。

```text
Vivi, reclining, couch, indoors, living room, pillow, blanket, floor lamp, window, cityscape, coffee table, books, potted plant
```

这一系列工作也可以交给 AI。下面是请 ChatGPT 制作 caption 的示例。

→ [用 ChatGPT 制作 LoRA 训练标签](https://chatgpt.com/share/6a54dbe5-6bec-83e9-ae15-f6bb02972c59)

> 这次制作的是角色 LoRA，所以删除了描述角色本身的词语。如果制作服装 LoRA，就删除描述服装的词语；如果制作风格 LoRA，就删除描述画风的词语。

请把 caption 保存为与图片同名的文本文件。文件名不必使用连续编号。

```text
📂images/
├── 0001.png
├── 0001.txt
├── 0002.png
├── 0002.txt
├── ...
├── 0020.png
└── 0020.txt
```

---

## 设置 Kura

### 需要准备的内容

- **最初需要**
  - [Git](https://git-scm.com/)
  - [uv](https://docs.astral.sh/uv/getting-started/installation/)
  - Codex、Claude Code 等 AI 智能体
- **在本地训练时**
  - NVIDIA GPU
  - [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **在云端训练时**
  - [RunPod](https://www.runpod.io/) 账户

> 如果要在 WSL2 中进行本地训练，请打开 Docker Desktop 的 `Settings → Resources → WSL Integration`，启用运行 Kura 的 WSL 发行版（例如 `Ubuntu`）。

### 安装 Kura

1. 如果还没有安装 `uv`，请先安装。

    macOS / Linux：

    ```sh
    curl -LsSf https://astral.sh/uv/install.sh | sh
    ```

    Windows PowerShell：

    ```powershell
    irm https://astral.sh/uv/install.ps1 | iex
    ```

2. 打开终端，用 `git clone` 获取 Kura。

    ```sh
    git clone https://github.com/nomadoor/Kura.git
    cd Kura
    ```

3. 完成 Kura 的初始设置。

    ```sh
    uv sync
    uv run kura init
    ```

    执行 `kura init` 后，会创建 `datasets/`、`runs/`、`workflows/`、`promptsets/`、`cache/`、`workspace.yaml` 等内容。

### 仅在需要时设置环境变量

只有在使用 RunPod，或使用需要 Hugging Face 授权的模型（例如 FLUX.2 [klein] 9B）时，才需要进行这项设置。

1. 复制 `.env.example`，创建 `.env.local`。

    ```sh
    cp .env.example .env.local
    ```

2. 打开 `.env.local`，只填写需要的值。

    ```text
    RUNPOD_API_KEY=<RunPod API key>
    HF_TOKEN=<Hugging Face token>
    ```

- `RUNPOD_API_KEY`：在 RunPod 上训练或生成时使用。请在 [RunPod Settings 中创建 API key](https://docs.runpod.io/get-started/api-keys)。
- `HF_TOKEN`：使用需要 Hugging Face 授权的模型时使用。可以从 [Hugging Face Access Tokens](https://huggingface.co/settings/tokens) 获取。训练 Krea 2 时不需要。

执行 Kura 命令时，`.env.local` 会被自动读取。

### 从 Kura 打开 AI 智能体

把 Kura 文件夹作为 AI 智能体的工作目录打开。

- **进入 Kura 文件夹后打开**

  ```sh
  cd path/to/Kura
  codex
  ```

- **从其他位置打开**

  使用 `-C` 指定 Kura 的路径。

  ```sh
  codex -C /path/to/Kura
  ```

---

## 和 AI 一起训练 LoRA

接下来也让 AI 出一份力吧。

### 放置数据集

把制作好的数据集放在 Kura 的 `datasets/` 目录下。

```text
📂Kura/
└── 📂datasets/
    └── 📂character-lora/
        └── 📂images/
            ├── 001.png
            ├── 001.txt
            ├── 002.png
            ├── 002.txt
            └── ...
```

除此之外，Kura 还使用 `dataset.yaml` 和 `items.jsonl` 记录数据集内容。AI 会检查图片和 caption 并创建这两个文件，因此不需要自己编写。

### 告诉 AI 想制作什么 LoRA

向已经打开 Kura 的 AI 智能体说明想要制作的 LoRA。

```text
使用 datasets/character-lora 中的图片，制作 Krea 2 的角色 LoRA。
```

![Codex](https://gyazo.com/c0869c902e2ae71682a0b8433c693fbf){gyazo=image}

Kura 提供了用于检查数据集和确定参数的 Skill，因此一开始不需要指定详细参数。

当然，如果你熟悉这些参数，也可以告诉它“使用 `rank 16`、`learning rate 5e-5`”。想用 RunPod 时，只要说“在 RunPod 上训练”即可。

和 GUI 不同，需要的条件可以在对话中调整。

### 确认计划并开始训练

在真正开始训练之前，AI 智能体会用 Kura 创建 `plan` 并展示给你。

<!-- TODO: 添加实际 run 的 plan 截图 -->

`plan` 中会显示以下内容。请在自己能理解的范围内进行确认。

- **训练内容**
  - 使用的模型和训练 backend
  - 数据集的图片数量和分辨率
  - LoRA 的 rank、learning rate 和 batch size
  - 训练 step 数和 LoRA 保存间隔
- **运行环境**
  - 本地或 RunPod
  - 使用的 GPU
  - 模型下载量和所需存储空间
  - 保存的 LoRA 数量、磁盘占用等警告

如果想修改某项内容，可以告诉 AI“请把 step 数改为 2000”。然后再次确认修改后的 `plan`。

确认无误后，请告诉它**“开始训练”**。训练就会启动。

### 用 Kura Monitor 查看进度

Kura Monitor 是用于查看训练进度和以往 run 的监控工具。

Monitor 只是查看状态的界面，不能从这里开始训练或修改设置。

> 请在运行训练的终端之外，另开一个终端启动 Monitor。

```sh
cd path/to/Kura
uv run kura monitor
```

![kura monitor](https://gyazo.com/200c43a33b1a88c82d555d2bf2d3ed55){gyazo=image}

如果想详细查看某个 run，请使用 `watch` 命令。

```sh
uv run kura run watch <run-id>
```

![watch](https://gyazo.com/19b89285e83c62b08e1ba1ee80579c03){gyazo=image}

在 Monitor 中左键单击链接，就会打开文件管理器。已保存的 LoRA 在训练过程中也会依次添加到该 run 的 `outputs/` 中。

```text
📂Kura/
└── 📂runs/
    └── 📂<run-id>/
        └── 📂outputs/
            └── *.safetensors
```

使用 RunPod 时，训练结束并回收全部输出后，Pod 也会自动停止。

---

## 在 ComfyUI 中确认生成结果

LoRA 的效果究竟如何，只有实际生成后才知道。下面通过 Kura 使用 ComfyUI，测试刚刚训练的 LoRA。

### 准备 ComfyUI

如果使用本地 ComfyUI，请像平时一样启动，并确保可以通过 `http://127.0.0.1:8188` 访问。

第一次使用时，Kura 可能会询问 ComfyUI 的 `models/loras` 文件夹位置。Kura 只会在生成时临时放入 LoRA，生成结束后会将其清理掉。

如果本地没有 ComfyUI，也可以在 RunPod 上启动 ComfyUI 进行生成。

### 使用 LoRA 生成图片

准备完成后，请 AI 生成图片。

```text
应用刚才训练的 LoRA，用 ComfyUI 生成一张图片。
```

![Vivi 1000 steps](https://gyazo.com/5bffd9971f963f76bd0dc68ce4add3d0){gyazo=image}

通常情况下，AI **不会从零创建工作流**。

`Kura/workflows/samples/` 中准备了主要模型的 API 格式工作流。AI 会从中选择合适的工作流，并插入训练好的 LoRA。

如果没有对应的工作流，或者想使用其他工作流，请从 ComfyUI 导出 **API 格式**的工作流，并放入 `Kura/workflows/`。

### 让 AI 制作比较图

好的角色 LoRA 不仅要能还原角色，还需要具备按照提示词改变姿势、构图和背景的**灵活性**。

训练不足时，生成的角色会不够相似。反过来，训练过度时，LoRA 会把数据集中的构图和背景也记住，使提示词难以生效。这就是过拟合。

要找到合适的平衡点，最可靠的方法是使用多个提示词生成各个 step 保存的 LoRA，再把结果排列起来比较。

```text
我想确认训练好的角色 LoRA。
使用 3 个提示词，让每个已保存 step 的 LoRA 分别生成图片，再把结果排列成一张评测图。
```

![Comparison](https://gyazo.com/a9b23a29fc76faf1d66da47962b41373){gyazo=image}

在这个例子中，1000 step 左右看起来比较合适。

---

## 实验知识会保留下来

到这里，训练流程已经完成，但 Kura 真正的价值从这里才开始体现。

使用的数据集和参数、失败的设置、输出的 LoRA 都会以文件形式保留下来。下一次训练时，AI 会读取这些内容，因此实验次数越多，就越容易提出适合当前环境和目标 LoRA 的设置。

但是，只有文件还不足以判断哪个结果更好。比较结束后，也请把“1000 step 的效果最好”“脸很像，但姿势不容易变化”等感受告诉 AI。评价会保存在比较用 run 的 `notes.md` 中，成为下一次实验的参考。

Kura 自带的默认值也不是绝对正确的答案。目前只是根据作者的经验，暂时设置了一组比较容易使用的值。

如果愿意，也请在 [Kura Issues](https://github.com/nomadoor/Kura/issues) 中分享你的成功和失败案例。随着实验结果不断积累，它们会反映到 Kura 的 Skill 和默认值中。我们的目标是，即使不逐项钻研设置，也能完成高质量的训练。

---

## 故障排除

### 出现 DNS lookup 等网络错误

Kura 在下载模型和操作 RunPod 时需要使用网络。如果 Codex CLI 没有网络权限，请把以下设置添加到 Codex 的用户配置中，然后重新启动 Codex。

```toml
[sandbox_workspace_write]
network_access = true
```

使用 Claude Code 等其他工具时，也请在对应 AI 智能体的设置中允许网络访问。

### 无法访问 ComfyUI 的 LoRA 文件夹

使用本地 ComfyUI 生成时，AI 智能体需要有权限把 LoRA 临时放入 ComfyUI 文件夹。

使用 Codex CLI 时，请在启动时添加 ComfyUI 的 `models/loras` 文件夹。

```sh
codex -C /path/to/Kura --add-dir /path/to/ComfyUI/models/loras
```

使用 Claude Code 等其他工具时，也请在对应 AI 智能体的设置中允许访问 ComfyUI 文件夹。
