---
layout: page.njk
lang: en
section: notes
slug: kura-krea2-lora-training
navId: kura-krea2-lora-training
title: "Training a Krea 2 LoRA with Kura"
created: 2026-07-13
updated: 2026-07-14
noteTags: ["project", "lora", "krea-2", "kura"]
summary: "A practical guide to training and comparing a Krea 2 character LoRA with Kura and an AI agent"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/bd00a496f18c5ecb9925dd7f790ffc7d.png"
---

## What is Kura?

Training a LoRA follows the same basic process regardless of the base model or task: prepare a dataset, choose parameters such as the learning rate and rank, and pass everything to the training software.

That sounds simple, but two things make it difficult.

- **Every training tool works differently**
  - The tool changes with the model, whether that is AI Toolkit, Musubi Tuner, or something else
  - Setup, configuration, commands, and weight output locations all differ
- **The best parameters are not obvious**
  - The number of images, learning rate, rank, and step count depend on the model and task
  - If the job does not fit on the GPU, you have to decide which settings to reduce

[Kura](https://github.com/nomadoor/Kura) was built to solve these problems by giving an AI agent a consistent way to handle LoRA training.

Kura has three main parts:

- A **CLI** that reliably prepares the environment and handles everything from training to weight recovery
- **Files** that preserve past experiments
- A **Skill** that helps the AI choose parameters using knowledge about models and previous experiments

Today's AI agents can probably build an environment from scratch and run a training job. Doing that every time wastes tokens, though, and it provides no way to accumulate what was learned from earlier experiments.

Kura is a harness that provides shortcuts for LoRA training, so people can focus on the dataset and parameter tuning.

Let's use Krea 2 as the base model and train a character LoRA.

---

## Prepare the dataset

### Collect images

For LoRA training, the quality of the dataset matters more than anything else, including the parameters.

Collect images that clearly show the subject you want to train. If possible, include a variety of poses, angles, and backgrounds instead of repeating the same composition.

Here, we are creating a LoRA for an original character, but only have a few hand-drawn images to start with.

![Creating variations with an image editing model](https://gyazo.com/2159c09bf30ffc9230b93e72a9b933f9){gyazo=image}

In that situation, you can use Nano Banana or ChatGPT Images 2.0 to create more variations.

This may reduce quality for photos of real people, but it can work well for characters with clear, recognizable features.

### Create captions

A caption is text that describes what appears in an image.

What you include depends on what you want the LoRA to learn. More detail is not always better.

Using Vivi as an example, let's look at how to write captions for a **character LoRA**.

![Vivi relaxing on a couch](https://gyazo.com/d74af5465c466791239a29516fa341c4){gyazo=image}

This image contains several kinds of information:

- The character's distinctive hair, face, and outfit
- The pose
- The background and furniture
- The illustration style

For a character LoRA, leave out words that describe the character and caption everything else.

Start by listing every visible element:

```text
1girl, solo, reclining, couch, holding mug, pink hair, gradient hair, headphones, sweater, scarf, orange pants, purple boots, indoors, living room, pillow, blanket, floor lamp, window, cityscape, coffee table, books, potted plant
```

Then **remove** the words that describe the character, including the hair, face, and outfit:

```text
reclining, couch, indoors, living room, pillow, blanket, floor lamp, window, cityscape, coffee table, books, potted plant
```

Finally, add the trigger word for the character—`Vivi` in this example—to the beginning of the caption:

```text
Vivi, reclining, couch, indoors, living room, pillow, blanket, floor lamp, window, cityscape, coffee table, books, potted plant
```

You can also ask an AI to do this work. Here is an example of asking ChatGPT to create the captions:

→ [Creating LoRA training tags with ChatGPT](https://chatgpt.com/share/6a54dbe5-6bec-83e9-ae15-f6bb02972c59)

> Because this is a character LoRA, we removed words that describe the character. For an outfit LoRA, remove words describing the outfit; for a style LoRA, remove words describing the art style.

Save each caption in a text file with the same name as its image. The filenames do not need to be sequential.

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

## Set up Kura

### What you need

- **Always required**
  - [Git](https://git-scm.com/)
  - [uv](https://docs.astral.sh/uv/getting-started/installation/)
  - An AI agent such as Codex or Claude Code
- **For local training**
  - An NVIDIA GPU
  - [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **For cloud training**
  - A [RunPod](https://www.runpod.io/) account

> For local training with WSL2, open `Settings → Resources → WSL Integration` in Docker Desktop and enable the WSL distribution where you run Kura, such as `Ubuntu`.

### Install Kura

1. If `uv` is not installed yet, install it first.

    macOS / Linux:

    ```sh
    curl -LsSf https://astral.sh/uv/install.sh | sh
    ```

    Windows PowerShell:

    ```powershell
    irm https://astral.sh/uv/install.ps1 | iex
    ```

2. Open a terminal and clone Kura.

    ```sh
    git clone https://github.com/nomadoor/Kura.git
    cd Kura
    ```

3. Run Kura's initial setup.

    ```sh
    uv sync
    uv run kura init
    ```

    `kura init` creates `datasets/`, `runs/`, `workflows/`, `promptsets/`, `cache/`, `workspace.yaml`, and other required files.

### Set environment variables only when needed

You only need these settings if you use RunPod or a gated Hugging Face model, such as FLUX.2 [klein] 9B.

1. Copy `.env.example` to create `.env.local`.

    ```sh
    cp .env.example .env.local
    ```

2. Open `.env.local` and enter only the values you need.

    ```text
    RUNPOD_API_KEY=<RunPod API key>
    HF_TOKEN=<Hugging Face token>
    ```

- `RUNPOD_API_KEY`: Used when training or generating on RunPod. [Create an API key in RunPod Settings](https://docs.runpod.io/get-started/api-keys).
- `HF_TOKEN`: Used for gated models on Hugging Face. You can get one from [Hugging Face Access Tokens](https://huggingface.co/settings/tokens). It is not required for Krea 2 training.

Kura loads `.env.local` automatically when you run its commands.

### Open Kura in an AI agent

Open the Kura folder as the AI agent's working directory.

- **Open it after moving into the Kura folder**

  ```sh
  cd path/to/Kura
  codex
  ```

- **Open it from another directory**

  Use `-C` to specify the Kura path.

  ```sh
  codex -C /path/to/Kura
  ```

---

## Train a LoRA with an AI agent

Now it is time to let the AI do some of the work.

### Place the dataset

Put the dataset under Kura's `datasets/` directory.

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

Kura also uses `dataset.yaml` and `items.jsonl` to record the dataset contents. The AI checks the images and captions and creates these files, so you do not need to write them yourself.

### Describe the LoRA you want

Tell the AI agent that has Kura open what you want to train.

```text
Use the images in datasets/character-lora to create a Krea 2 character LoRA.
```

![Codex](https://gyazo.com/c0869c902e2ae71682a0b8433c693fbf){gyazo=image}

Kura includes a Skill for reviewing datasets and choosing parameters. You do not need to specify every parameter at the start.

If you know what you want, you can say, “Use `rank 16` and `learning rate 5e-5`.” If you want to use RunPod, simply say, “Train it on RunPod.”

Unlike a GUI, the requirements can be adjusted through conversation.

### Review the plan and start training

Before training begins, the AI agent creates a Kura `plan` and shows it to you.

<!-- TODO: Add an image of the actual run plan -->

The `plan` contains information like the following. Check whatever you understand.

- **Training details**
  - The model and training backend
  - Dataset image count and resolution
  - LoRA rank, learning rate, and batch size
  - Training steps and LoRA save interval
- **Execution environment**
  - Local or RunPod
  - The GPU to use
  - Model download size and required storage
  - Warnings about the number of saved LoRAs and disk usage

If you want something changed, say, “Set the step count to 2000,” for example. Then review the revised `plan`.

When everything looks right, say **“Start training.”** The training job will begin.

### Monitor training with Kura Monitor

Kura Monitor is a monitoring tool for checking training progress and previous runs.

It is a read-only view. You cannot start training or change settings from the Monitor.

> Open it in a separate terminal from the one running the training job.

```sh
cd path/to/Kura
uv run kura monitor
```

![kura monitor](https://gyazo.com/200c43a33b1a88c82d555d2bf2d3ed55){gyazo=image}

To inspect one run in detail, use the `watch` command.

```sh
uv run kura run watch <run-id>
```

![watch](https://gyazo.com/19b89285e83c62b08e1ba1ee80579c03){gyazo=image}

Left-clicking a link in the Monitor opens it in your file explorer. Saved LoRAs are added to the run's `outputs/` directory during training.

```text
📂Kura/
└── 📂runs/
    └── 📂<run-id>/
        └── 📂outputs/
            └── *.safetensors
```

When you use RunPod, Kura automatically stops the Pod after training finishes and all outputs have been recovered.

---

## Check the results in ComfyUI

You cannot know whether a LoRA is good until you generate with it. Use ComfyUI through Kura to try the LoRA you trained.

### Prepare ComfyUI

For local ComfyUI, start it as usual and make sure it is available at `http://127.0.0.1:8188`.

The first time, Kura may ask for the location of ComfyUI's `models/loras` folder. Kura places the LoRA there temporarily for generation, then removes it afterward.

If ComfyUI is not installed locally, you can also launch it on RunPod and generate there.

### Generate with the LoRA

Once ComfyUI is ready, ask the AI to generate an image.

```text
Apply the LoRA we just trained and generate one image in ComfyUI.
```

![Vivi at 1000 steps](https://gyazo.com/5bffd9971f963f76bd0dc68ce4add3d0){gyazo=image}

In general, the AI does **not build a workflow from scratch**.

`Kura/workflows/samples/` contains API-format workflows for the major models. The AI chooses a suitable one and inserts the trained LoRA.

If there is no matching workflow, or if you want to use another one, export it from ComfyUI in **API format** and place it in `Kura/workflows/`.

### Ask for comparison images

A good character LoRA needs more than a recognizable character. It also needs the **flexibility** to change the pose, composition, and background in response to the prompt.

With too little training, the character will not look right. With too much, the LoRA learns the dataset's compositions and backgrounds as well, making the prompt less effective. This is overfitting.

The most reliable way to find the right balance is to generate each saved step with several prompts and compare the results side by side.

```text
I want to evaluate the character LoRA I trained.
Use three prompts to generate with every saved step, then arrange the results into a review image.
```

![Comparison](https://gyazo.com/a9b23a29fc76faf1d66da47962b41373){gyazo=image}

In this example, around 1000 steps looks best.

---

## The experiment knowledge stays with you

The training process is now complete, but this is where Kura becomes most useful.

The dataset, parameters, failed settings, and generated LoRAs all remain as files. The AI reads them before the next training job, so with each experiment it becomes easier to suggest settings that fit your environment and the LoRA you want to make.

Files alone cannot tell the AI which result was best. After comparing the outputs, tell it what you thought—for example, “1000 steps was best,” or “The face looks right, but the pose is difficult to change.” That evaluation is saved in the comparison run's `notes.md` and becomes useful context for the next experiment.

Kura's default values are not absolute answers either. For now, they are simply values that the author has found reasonably useful through experience.

If you would like, share your successful and failed experiments in [Kura Issues](https://github.com/nomadoor/Kura/issues). As more results are collected, they can be reflected in Kura's Skill and default values. The goal is to make high-quality training possible without having to obsess over every setting.

---

## Troubleshooting

### Network errors such as DNS lookup failures

Kura uses the network to download models and control RunPod. If Codex CLI does not have network access, add the following to your Codex user configuration and restart Codex.

```toml
[sandbox_workspace_write]
network_access = true
```

If you use Claude Code or another agent, allow network access in that agent's settings as well.

### Cannot access ComfyUI's LoRA folder

When generating with local ComfyUI, the AI agent needs permission to place the LoRA temporarily in ComfyUI's folder.

With Codex CLI, add ComfyUI's `models/loras` folder when starting it.

```sh
codex -C /path/to/Kura --add-dir /path/to/ComfyUI/models/loras
```

If you use Claude Code or another agent, allow access to the ComfyUI folder in that agent's settings as well.
