---
layout: page.njk
lang: en
slug: setup
navId: setup
title: "Setup"
summary: "About Setup"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## ComfyUI Setup

There are several ways to run ComfyUI in a local environment.

* **Portable Version (Recommended)**
* Desktop Version (Installer format)
* Manual Installation Version (venv + Git / For advanced users)

The portable version is flexible yet stable, and since anyone can create a similar environment, this site will explain assuming that you are basically using the portable version.

In addition, let's install **ComfyUI Manager** here as well.

This is a tool that makes managing ComfyUI easy, such as installing custom nodes.

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

- 1. Right-click the downloaded `7z file` and extract it with `Extract All`.
  - ![](https://gyazo.com/776dafe2320c41526e6292f52edbe07d){gyazo=loop}
  - As explained in [Recommended Specs - Storage](/en/begin-with/recommended-specs/#storage), we recommend placing it on an SSD.
- 2. Double-click `run_nvidia_gpu.bat` in the extracted folder to start it.
- 3. Initial startup takes time for environment configuration. If the browser opens automatically, it is successful.

### 3. Installing ComfyUI Manager

- 1. Install Git
  - Download the installer from [Git for Windows](https://gitforwindows.org/) and install it.
  - You can leave all settings as default (just keep clicking Next).

- 2. Open the installation location
  - Open the `custom_nodes` folder inside the ComfyUI folder.
  - ```text
    📂ComfyUI_windows_portable/
    └── 📂ComfyUI/
          └── 📂custom_nodes/
    ```

- 3. Open Terminal
  - Type `cmd` in the address bar of the folder (where the path is displayed) and press the Enter key.
  - A black screen (command prompt) will open.

- 4. Execute Command
  - Copy the following command, paste it into the black screen (right click), and press the Enter key.
  - ```powershell
    git clone https://github.com/ltdrdata/ComfyUI-Manager.git
    ```

If a folder named `ComfyUI-Manager` is created inside the `custom_nodes` folder, it is successful.
Restart ComfyUI and a "Manager" button will be added to the menu.

---

## Desktop Version

This is an installer format for Windows. It provides stable operation with ComfyUI Manager already installed, but there are slightly more restrictions.

### Download

- 1. Download `ComfyUI Setup.exe` from the [GitHub page](https://github.com/Comfy-Org/desktop) of ComfyUI Desktop.
- 2. Run it and select the installation destination and GPU settings.

---

## Manual Installation (Windows, Linux)

This is a standard installation method using `git clone` and `pip`.

### About Python Version
* **Python 3.13** is recommended.
* If issues occur with custom node dependencies, try **3.12**.

### 1. Installation

First, clone the repository, create a virtual environment, and activate it.

```powershell
# Clone the repository
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI

# Create and activate virtual environment (Windows)
python -m venv venv
venv\Scripts\activate

# (For Linux/macOS)
# python -m venv venv
# . venv/bin/activate
```

### 2. Install PyTorch (NVIDIA)

Stable:
```bash
pip install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu130
```

Nightly (Potential performance improvement):
```bash
pip install --pre torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cu130
```

### 3. Install Dependencies

Execute the following inside the ComfyUI folder.

```bash
pip install -r requirements.txt
```

### 4. Installing ComfyUI Manager

Even with manual installation, Manager is essential.

```bash
cd custom_nodes
git clone https://github.com/ltdrdata/ComfyUI-Manager.git
cd ..
```

---

## About Easy Installers

Easy installers like Pinokio and Stability Matrix are certainly convenient and allow you to easily introduce complex functions.

However, the more elements involved in between, the more troubles increase... When a problem occurs, it becomes difficult to pinpoint the cause, and eventually, there are situations where beginners cannot handle it.

Since introducing ComfyUI, including the portable version, is not that difficult, we recommend doing it simply by the means provided by the official.

---

### References
* [ComfyUI - Installing](https://github.com/comfyanonymous/ComfyUI#installing)
