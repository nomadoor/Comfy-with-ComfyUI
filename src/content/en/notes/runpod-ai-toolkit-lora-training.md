---
layout: page.njk
lang: en
section: notes
slug: runpod-ai-toolkit-lora-training
navId: runpod-ai-toolkit-lora-training
title: "Running AI Toolkit on RunPod"
created: 2026-05-03
updated: 2026-05-03
noteTags: ["guide", "training", "runpod", "ai-toolkit", "lora"]
summary: "A practical flow for launching AI Toolkit on RunPod and running LoRA training"
permalink: "/{{ lang }}/notes/{{ slug }}/"
---

## What is RunPod?

[RunPod](https://www.runpod.io/) is a service where you can rent cloud GPU power for short periods of time.

There are several similar services, but I feel RunPod has the best balance of price and ease of use.

Compared with simple image generation, model training needs more compute power and VRAM. You also keep the GPU running for tens of minutes or several hours.

If you only want to train a simple LoRA, it can be done for a few dollars, so it is easy enough to try.

This note walks through the flow from launching AI Toolkit on RunPod to downloading the LoRA you trained.

> I plan to cover detailed training settings and dataset preparation for each model in separate notes.

---

## Overall flow

1. Create a RunPod account and buy credits
2. Create a Pod
3. Open the AI Toolkit UI
4. Upload a Dataset
5. Create a Job
6. Run training
7. Download the LoRA file
8. Stop the Pod

---

## 1. Create a RunPod account and buy credits

### Create an account

![](https://gyazo.com/fa937b8adfc9a1e28e406645ada9b52b){gyazo=image}

Open [RunPod](https://www.runpod.io/) and create an account from `Sign Up`.

### Buy credits

RunPod works by buying credits first and spending them as you use GPUs.

If you only want to try LoRA training, about 10 dollars is enough.

- Click the `+` button in the upper right
- Choose `Other` if you want to start with a small amount
- Enter the amount and continue to `Go to Checkout`

You do not have to use it, but this is my referral code. If you register from here, you can get a little extra credit on your first credit purchase.

- https://runpod.io?ref=ke9q7kqp

---

## 2. Create a Pod

### What is a Pod?

RunPod has several features, but for this note you only need to understand **Pod**.

A Pod is like a customizable rental PC in the cloud.

You choose which GPU to use and how much storage to allocate, then rent that environment.

This time, we will create a Pod that can run AI Toolkit, open AI Toolkit from the browser, and train a LoRA.

### Create the Pod

Open `Pods` from the sidebar and create a new Pod.

Here you choose Cloud, GPU, CUDA version, storage, and so on.

![](https://gyazo.com/6f74774cfc5a065178ef3040173cbab8){gyazo=image}

- **Cloud**
  - `Secure Cloud`
    - This is an environment prepared by RunPod. It is stable, but the price is higher.
  - `Community Cloud`
    - This is an externally provided environment that has passed RunPod's review.
  - `Community Cloud` cannot use Network Volume, but we will not use it this time, so either option is fine.

- **Network Volume**
  - When you close a Pod, the data inside it is also deleted.
  - Network Volume is a service for keeping data somewhere else so that does not happen.
  - In this note, we will download the LoRA after training and delete the whole Pod.

- **CUDA version**
  - AI Toolkit may not run with an old CUDA version.
  - Choose `12.8` or later for this flow.

- **GPU**
  - There are many choices, so it is easy to get lost, but the first thing to look at is **VRAM**.
  - If you do not have enough VRAM, training will fail with `Out of Memory`.
  - After that, you can choose a higher-grade GPU for speed.

Here are a few GPUs I often use.

| GPU | VRAM | Note |
| --- | --- | --- |
| **RTX 3090** | 24GB | For SDXL-style LoRA training, this has a good balance of speed and cost. |
| **RTX A40** | 48GB | Because 48GB VRAM is available at a relatively low price, this is the GPU I usually pick first for LoRA training. Use it when 24GB is not enough. |
| **RTX PRO 6000** | 96GB | This is a little overkill for LoRA training, but useful for large models such as LTX-2 or settings with high VRAM usage. |

### Deployment settings

After the hardware settings are done, choose what software to run.

We will use a template, so there is nothing especially difficult here.

![](https://gyazo.com/8a3c2e36c95a1c43daf39dc9c69880cc){gyazo=image}

- **Pod name**
  - Give it any name you like.

- **Pod template**
  - Choose [AI Toolkit - ostris - ui - official](https://console.runpod.io/hub/template/ai-toolkit-ostris-ui-official?id=0fqzfjy6f3).
  - This is the template made by Ostris, the author of AI Toolkit.
  - Be careful when searching for `AI Toolkit`, because many templates with similar names appear.

- **Storage configuration**
  - Allocate enough **Volume disk** for the dataset, base model, and output LoRA files.
  - The default value is fine.

After that, click `Deploy On-Demand` and the Pod will be created.

> Credit usage starts at this point. Prepare your dataset before deploying the Pod.

---

## 3. Open the AI Toolkit UI

It takes a little while for the Pod to be created. Wait for it to finish.

![](https://gyazo.com/952faa4188776b9cc626a5c2009422b3){gyazo=image}

When the Pod is ready, it will show `🟢Ready`, and a link for opening AI Toolkit will appear.

Click `HTTP Service`, and AI Toolkit should open.

![](https://gyazo.com/696fa9e2aa3260c51214fd4fc7c3af1a){gyazo=image}

It will ask for a password. Enter `password`.

> In a normal setup you should set a different password, but this Pod is disposable, so I do not worry about it too much here.

From here, we will look at the rough training flow in AI Toolkit.

---

## 4. Upload a Dataset

![](https://gyazo.com/d57274c9ba07002e7ee02b1b72a80499){gyazo=image}

Upload the images and caption files used for training to AI Toolkit.

- Open the `Dataset` tab
- Click `New Dataset` in the upper right
- Give the dataset a name
- Drag and drop the images and `.txt` files

If the images and their matching caption files are loaded, you are ready.

---

## 5. Create a Job

In AI Toolkit, the flow is to create a training setup called a Job, then run it.

It is a bit like a workflow in ComfyUI.

![](https://gyazo.com/c8029171b590fcb71fc68188a2f5c8be){gyazo=image}

Set the base model, learning rate, dataset you just loaded, and other training parameters here.

When the settings are done, click `Create Job` in the upper right.

Before training starts, you can change the settings as many times as you want.

---

## 6. Run training

After creating the Job, run the training.

![](https://gyazo.com/b06e6a6734de8d0dba21687c56604812){gyazo=image}

- Click the run button (`▶`) in the upper right

If there is no error and the progress bar is moving, it is basically working.

You can stop training and resume it later.

You can also stop it, change parameters, and run it again, but some parameters can break the training state. If you are not sure, it is better to start again from 0.

---

## 7. Download the LoRA file

Depending on the settings, AI Toolkit periodically outputs LoRA files during training.

The only real way to know whether training went well is to generate images with ComfyUI or another tool. To be honest, the Loss Graph is not very useful for judging that.

![](https://gyazo.com/89e7eea124ea56af4a34bba8af083057){gyazo=image}

- Output LoRA files appear in the `Checkpoints` area
- Click the download button and save them

That is the basic flow.

> If you delete the Pod, the uploaded dataset and generated LoRA files are deleted too. Make sure to download every file you need.  
> It is also useful to save the config file that contains all the settings, so you can review it later.

---

## 8. Stop the Pod

RunPod charges while the Pod is running, even if you are not actively working.

Do not forget to stop it.

![](https://gyazo.com/f60fe312a59e9fe6624490c8004da78e){gyazo=image}

- Return to the RunPod page
- Open the running Pod
- Stop the Pod with `Stop`
- Confirm that you have downloaded all necessary files

`Stop` stops GPU billing, but the storage fee for the Volume disk remains.

If you no longer need AI Toolkit, run `Terminate` to shut it down completely.

![](https://gyazo.com/7142f88c43aa0b4b0281b6c6a1c064ad){gyazo=image}

- Delete the Pod with `Terminate`

---

## Training a specific model

This note mainly covered the part up to launching AI Toolkit from RunPod.

For the concrete flow of training a model with AI Toolkit, see the following note.

- [Training an SDXL (Illustrious) LoRA with AI Toolkit](/en/notes/ai-toolkit-sdxl-lora-training/)
