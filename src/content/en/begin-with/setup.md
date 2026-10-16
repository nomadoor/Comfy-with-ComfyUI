---
layout: page.njk
lang: en
section: begin-with
slug: setup
navId: setup
title: "Setup"
created: 2025-11-20
updated: 2026-05-25
summary: "About Setup"
seoTitle: "How to Install ComfyUI: Portable and Desktop"
seoDescription: "Set up ComfyUI locally: the recommended portable build, the desktop installer, and a manual install with venv and Git on Windows and Linux."
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## ComfyUI Setup

There are several ways to run ComfyUI in a local environment.

* **[Portable Version (Recommended)](#setup-with-portable-version)**
* [Desktop Version (Installer)](#desktop-version)
* [Manual Installation (venv + Git / For advanced users)](#manual-installation-windows-linux)

The portable version is flexible yet stable, and anyone who sets it up ends up with much the same environment, so the guides on this site generally assume you're using the portable version.

We'll also install **ComfyUI Manager** here.

It's a tool that makes managing ComfyUI easier, for things like installing custom nodes.

---

## Setup with Portable Version

The portable version bundles Python, PyTorch, and CUDA, so it works as soon as you extract it.

### 1. Download

Go to ComfyUI's [GitHub release page](https://github.com/comfyanonymous/ComfyUI/releases) and pick the file that matches your GPU.

| GPU Type | File Name (Example) | Remarks |
| :--- | :--- | :--- |
| **NVIDIA GPU** | `ComfyUI_windows_portable_nvidia.7z` | If your driver is new enough, start with the plain version (no suffix). If startup fails, update the GPU driver or use the **version for old drivers** below. |
| NVIDIA GPU (Stable/Older environment) | `cu126`/`cu128` | Use this if you don't want to update your driver, or if the plain version closes right after it starts. |
| AMD GPU | `ComfyUI_windows_portable_amd.7z` | For AMD users. |


### 2. Extract and Run

1. Right-click the downloaded `7z file` and extract it with `Extract All`.
   - As explained in [Recommended Specs - Storage](/en/begin-with/recommended-specs/#storage), I recommend putting it on an SSD.
2. Double-click `run_nvidia_gpu.bat` in the extracted folder to start it.
3. The first launch takes a while to set up the environment. If your browser opens automatically, it worked.

### 3. Installing ComfyUI Manager

1. Open the `ComfyUI_windows_portable` folder, right-click inside the folder, and choose `Open in Terminal`.

2. Enter the following command in the window and press `Enter`.

   ```powershell
   .\python_embeded\python.exe -m pip install -r ComfyUI\manager_requirements.txt
   ```

   This installs the libraries required by Manager.

   This alone won't make Manager show up in the UI, though, so add a command-line argument to the launch `.bat` file.

3. Right-click `run_nvidia_gpu.bat` and choose `Edit`.

4. Add `--enable-manager` to the end of the line that runs `main.py`.

   ```powershell
   .\python_embeded\python.exe -s ComfyUI\main.py --windows-standalone-build --enable-manager
   ```

5. If you want to use the old ComfyUI Manager, also add `--enable-manager-legacy-ui`.

   ```powershell
   .\python_embeded\python.exe -s ComfyUI\main.py --windows-standalone-build --enable-manager --enable-manager-legacy-ui
   ```

---

## Desktop Version

This is an installer for Windows. It runs reliably, with ComfyUI Manager already included and so on, but it's a bit more restricted in return.

### Download

1. Download `ComfyUI Setup.exe` from the ComfyUI Desktop [GitHub page](https://github.com/Comfy-Org/desktop).
2. Run it and choose the install location and GPU settings.

> [!NOTE]
> ComfyUI Manager is included by default.

---

## Manual Installation (Windows, Linux)

This is a standard installation method using `git clone` and `pip`.

### About Python Version
* **Python 3.13** is recommended.
* If issues occur with custom node dependencies, try **3.12**.

### 1. Installation

1. Clone the repository and move into the ComfyUI folder.

   ```powershell
   git clone https://github.com/comfyanonymous/ComfyUI.git
   cd ComfyUI
   ```

2. Create and activate a virtual environment.

   On Windows:

   ```powershell
   python -m venv venv
   venv\Scripts\activate
   ```

   On Linux/macOS:

   ```bash
   python -m venv venv
   . venv/bin/activate
   ```

### 2. Install PyTorch (NVIDIA)

1. Normally, install the Stable version.

   ```bash
   pip install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu130
   ```

2. If you want to use the Nightly version, run the following.

   It may improve performance, but normally the Stable version is fine.

   ```bash
   pip install --pre torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cu130
   ```

### 3. Install Dependencies

1. Install the dependencies.

   ```bash
   pip install -r requirements.txt
   ```

### 4. Installing ComfyUI Manager

1. Install the libraries required by ComfyUI Manager.

   ```bash
   pip install -r manager_requirements.txt
   ```

2. This alone won't make Manager show up in the UI, so add `--enable-manager` when you start ComfyUI.

   ```bash
   python main.py --enable-manager
   ```

3. If you want to use the old ComfyUI Manager, also add `--enable-manager-legacy-ui`.

   ```bash
   python main.py --enable-manager --enable-manager-legacy-ui
   ```

---

## About Easy Installers

Easy installers like Pinokio and Stability Matrix are certainly convenient, and they let you set up complex features easily.

But the more layers sit in between, the more trouble you get... When something goes wrong, it's harder to track down the cause, and you end up in situations a beginner can't handle.

Installing ComfyUI, starting with the portable version, isn't that hard, so I recommend keeping it simple and sticking to the official methods.

---

### References
* [Installing ComfyUI Manager](https://docs.comfy.org/manager/install)
