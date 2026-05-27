---
layout: page.njk
lang: en
section: begin-with
slug: setup
navId: setup
title: "Setup"
created: 2025-11-24
updated: 2026-05-25
summary: "About Setup"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## ComfyUI Setup

There are several ways to run ComfyUI in a local environment.

* **[Portable Version (Recommended)](#setup-with-portable-version)**
* [Desktop Version (Installer format)](#desktop-version)
* [Manual Installation Version (venv + Git / For advanced users)](#manual-installation-windows-linux)

The portable version is flexible yet stable, and since anyone can create a similar environment, this site will explain assuming that you are basically using the portable version.

We will also install **ComfyUI Manager** here.

It is a tool that makes ComfyUI management easier, including installing custom nodes.

---

## Setup with Portable Version

The portable version includes Python, PyTorch, and the CUDA environment, and works just by extracting it.

### 1. Download

Access the [GitHub release page](https://github.com/comfyanonymous/ComfyUI/releases) of ComfyUI and select the file that matches your GPU.

| GPU Type | File Name (Example) | Remarks |
| :--- | :--- | :--- |
| **NVIDIA GPU** | `ComfyUI_windows_portable_nvidia.7z` | In an environment where the driver is new enough, please choose the standard one first. If startup fails, update the GPU driver or use the **version for old drivers** below. |
| NVIDIA GPU (Stable/Older environment) | `cu126`/`cu128` | Use this if you do not want to update the driver, or if the standard version terminates immediately after startup. |
| AMD GPU | `ComfyUI_windows_portable_amd.7z` | For AMD users. |


### 2. Extract and Run

1. Right-click the downloaded `7z file` and extract it with `Extract All`.
   - ![](https://gyazo.com/776dafe2320c41526e6292f52edbe07d){gyazo=loop}
   - As explained in [Recommended Specs - Storage](/en/begin-with/recommended-specs/#storage), we recommend placing it on an SSD.
2. Double-click `run_nvidia_gpu.bat` in the extracted folder to start it.
3. Initial startup takes time for environment configuration. If the browser opens automatically, it is successful.

### 3. Installing ComfyUI Manager

1. Open the `ComfyUI_windows_portable` folder, right-click inside the folder, and choose `Open in Terminal`.

2. Enter the following command in the window and press `Enter`.

   ```powershell
   .\python_embeded\python.exe -m pip install -r ComfyUI\manager_requirements.txt
   ```

   This installs the libraries required by Manager.

   However, Manager will not appear in the screen yet. Next, add a command line argument to the launch `.bat` file.

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

This is an installer format for Windows. It provides stable operation with ComfyUI Manager already installed, but there are slightly more restrictions.

### Download

1. Download `ComfyUI Setup.exe` from the [GitHub page](https://github.com/Comfy-Org/desktop) of ComfyUI Desktop.
2. Run it and select the installation destination and GPU settings.

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

2. Add `--enable-manager` when starting ComfyUI.

   ```bash
   python main.py --enable-manager
   ```

3. If you want to use the old ComfyUI Manager, also add `--enable-manager-legacy-ui`.

   ```bash
   python main.py --enable-manager --enable-manager-legacy-ui
   ```

---

## About Easy Installers

Easy installers like Pinokio and Stability Matrix are certainly convenient and allow you to easily introduce complex functions.

However, the more elements involved in between, the more troubles increase... When a problem occurs, it becomes difficult to pinpoint the cause, and eventually, there are situations where beginners cannot handle it.

Since introducing ComfyUI, including the portable version, is not that difficult, we recommend doing it simply by the means provided by the official.

---

### References
* [Installing ComfyUI Manager](https://docs.comfy.org/manager/install)
